/*
 * @Author: czy0729
 * @Date: 2023-04-22 16:38:32
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-06-09 05:10:47
 */
import { toJS } from 'mobx'
import cheerio from 'cheerio-without-node-native'
import { getTimestamp, info, loading, urlStringify } from '@utils'
import fetch, { xhr } from '@utils/fetch'
import { fetchCollectionSingleV0 } from '@utils/fetch.v0'
import axios from '@utils/thirdParty/axios'
import {
  API_EP_STATUS,
  API_SUBJECT_UPDATE_WATCHED,
  APP_ID,
  APP_SECRET,
  DEV,
  HOST,
  HTML_ACTION_ERASE_COLLECTION,
  HTML_PM_CREATE,
  HTML_USER_SETTING,
  URL_OAUTH_REDIRECT
} from '@constants'
import { EpId, EpStatus, SubjectId } from '@types'
import RakuenStore from '../rakuen'
import Fetch from './fetch'
import { INIT_ACCESS_TOKEN, INIT_USER_COOKIE, INIT_USER_INFO } from './init'

export default class Action extends Fetch {
  /** 登出 */
  logout = () => {
    setTimeout(() => {
      this.setState({
        accessToken: INIT_ACCESS_TOKEN,
        userCookie: INIT_USER_COOKIE,
        setCookie: '',
        userInfo: INIT_USER_INFO,
        outdate: false
      })
      this.save('accessToken')
      this.save('userCookie')
      this.save('setCookie')
      this.save('userInfo')
    }, 0)
  }

  /** 更新 accessToken */
  updateAccessToken = (accessToken: any = INIT_ACCESS_TOKEN) => {
    this.clearState('accessToken', {})
    this.setState({
      accessToken: {
        access_token: accessToken.access_token,
        expires_in: accessToken.expires_in,
        token_type: accessToken.token_type,
        scope: accessToken.scope,
        user_id: accessToken.user_id,
        refresh_token: accessToken.refresh_token
      }
    })
    this.save('accessToken')
  }

  /** 更新用户 cookie */
  updateUserCookie = (userCookie = INIT_USER_COOKIE) => {
    this.setState({
      userCookie,
      outdate: false
    })
    this.save('userCookie')
  }

  /** @deprecated */
  updateHmCookie = (hmCookie: string) => {
    this.setState({
      hmCookie
    })
    this.save('hmCookie')
  }

  /** 打印游客登录 sercet */
  logTourist = () => {}

  /** 设置授权信息过期提示 */
  setOutdate = () => {
    this.setState({
      outdate: true
    })
  }

  /** 删掉在看收藏的条目信息 */
  removeCollection = (subjectId: SubjectId) => {
    const index = this.collection.list.findIndex(
      item => Number(item.subject_id) === Number(subjectId)
    )
    if (index === -1) return false

    const collection = toJS(this.collection)
    collection.list.splice(index, 1)
    this.setState({
      collection
    })
    this.save('collection')

    return true
  }

  /** 添加在看收藏的条目信息 */
  addCollection = async (subjectId: SubjectId) => {
    const index = this.collection.list.findIndex(
      item => Number(item.subject_id) === Number(subjectId)
    )
    if (index !== -1) return false

    const data = await fetchCollectionSingleV0({
      userId: this.myId,
      subjectId
    })
    if (!data) return false

    const collection = toJS(this.collection)
    collection.list.unshift(data)
    this.setState({
      collection
    })
    this.save('collection')

    return true
  }

  // -------------------- action --------------------
  /** 更新收视进度 */
  doUpdateEpStatus = async (config: { id: EpId; status: EpStatus }) => {
    const { id, status } = config || {}
    return fetch({
      url: API_EP_STATUS(id, status),
      method: 'POST'
    })
  }

  /** 批量更新收视进度 */
  doUpdateSubjectWatched = async (config: { subjectId: SubjectId; sort: number }) => {
    const { subjectId, sort } = config || {}
    return fetch({
      url: API_SUBJECT_UPDATE_WATCHED(subjectId),
      method: 'POST',
      data: {
        watched_eps: sort
      }
    })
  }

  /**
   * 检测 cookie 有没有过期
   *  - 访问任意个人中心的页面就可以判断, 顺便记录 formhash 用于登出
   *  - setCookie 是 html 中后续在请求头中获取的更新 cookie 的标志
   */
  doCheckCookie = async () => {
    const data = await RakuenStore.fetchNotify()
    const { setCookie = '', html } = data
    if (html.includes('抱歉，当前操作需要您') && !DEV) {
      this.setOutdate()
    }

    const matchLogout = html.match(/.tv\/logout(.+?)">登出<\/a>/)
    if (Array.isArray(matchLogout) && matchLogout[1]) {
      const formhash = matchLogout[1].replace('/', '')
      console.info('doCheckCookie', formhash)

      this.setState({
        formhash
      })
      this.save('formhash')
    }

    if (setCookie) {
      this.setState({
        setCookie
      })
      this.save('setCookie')
    }

    return data
  }

  /** 删除收藏 */
  doEraseCollection = async (
    config: {
      subjectId: SubjectId
      formhash: string
    },
    success?: () => any,
    fail?: () => any
  ) => {
    const { subjectId, formhash } = config || {}
    return xhr(
      {
        url: HTML_ACTION_ERASE_COLLECTION(subjectId, formhash)
      },
      success,
      fail
    )
  }

  /** 发短信 */
  doPM = async (
    data: {
      msg_title: string
      msg_body: string
      formhash: string
      msg_receivers: string
      submit: '发送' | '回复'
    },
    success?: () => any,
    fail?: () => any
  ) => {
    return xhr(
      {
        url: HTML_PM_CREATE(),
        data
      },
      success,
      fail
    )
  }

  /** 更新个人设置 */
  doUpdateUserSetting = async (
    data: {
      formhash: string
      nickname: string
      sign_input: string
      newbio: string
      timeoffsetnew: string
    },
    success?: (responseText?: string, request?: any) => any,
    fail?: (request?: any) => any
  ) => {
    return xhr(
      {
        url: HTML_USER_SETTING(),
        data: {
          ...data,
          submit: '保存修改'
        }
      },
      success,
      fail
    )
  }

  /** 当前获取 access_token 重试次数 */
  private oauthRetryCount: number = 0

  /** 存放 loading.hide */
  private hide: any

  /** 获取授权表单码 */
  reOauth = async () => {
    this.hide = loading('正在重新授权...')

    // @ts-expect-error
    axios.defaults.withCredentials = false

    // @ts-expect-error
    const { data } = await axios({
      method: 'get',
      url: `${HOST}/oauth/authorize?client_id=${APP_ID}&response_type=code&redirect_uri=${URL_OAUTH_REDIRECT}`,
      headers: {
        'User-Agent': this.userCookie.userAgent,
        Cookie: this.userCookie.cookie
      }
    })

    const formhash = cheerio.load(data)('input[name=formhash]').attr('value')
    return this.authorize(formhash)
  }

  /** 授权获取 code */
  authorize = async formhash => {
    // @ts-expect-error
    axios.defaults.withCredentials = false

    // @ts-expect-error
    const { request } = await axios({
      method: 'post',
      maxRedirects: 0,
      validateStatus: null,
      url: `${HOST}/oauth/authorize?client_id=${APP_ID}&response_type=code&redirect_uri=${URL_OAUTH_REDIRECT}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.userCookie.userAgent,
        Cookie: this.userCookie.cookie
      },
      data: urlStringify({
        formhash,
        redirect_uri: '',
        client_id: APP_ID,
        submit: '授权'
      })
    })

    const code = request?.responseURL?.split('=').slice(1).join('=')
    try {
      return this.getAccessToken(code)
    } catch (error) {
      this.oauthRetryCount += 1
      if (this.oauthRetryCount >= 6) {
        if (typeof this.hide === 'function') {
          this.hide()
          this.hide = null
        }
        info('重新授权失败，请重新登录')
        this.logout()
        return false
      }
      return this.getAccessToken(code)
    }
  }

  /** code 获取 access_token */
  getAccessToken = async code => {
    // @ts-expect-error
    axios.defaults.withCredentials = false

    // @ts-expect-error
    const { status, data } = await axios({
      method: 'post',
      maxRedirects: 0,
      validateStatus: null,
      url: `${HOST}/oauth/access_token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': this.userCookie.userAgent
      },
      data: urlStringify({
        grant_type: 'authorization_code',
        client_id: APP_ID,
        client_secret: APP_SECRET,
        code,
        redirect_uri: URL_OAUTH_REDIRECT,
        state: getTimestamp()
      })
    })

    if (status !== 200) {
      throw new TypeError(status)
    }

    this.oauthRetryCount = 0
    if (typeof this.hide === 'function') {
      this.hide()
      this.hide = null
    }
    this.updateAccessToken(data)
    return true
  }

  /** 检查登录状态 */
  checkLogin = () => {
    if (this.isWebLogin) {
      const { _loaded } = this.userInfo

      // 用户信息被动刷新, 距离上次 4 小时候后才请求
      if (!_loaded || getTimestamp() - _loaded > 60 * 60 * 4) {
        this.fetchUserInfo()
        this.fetchUsersInfo()
      }

      setTimeout(() => {
        try {
          this.doCheckCookie()
        } catch (error) {}
      }, 4000)
    }
  }
}

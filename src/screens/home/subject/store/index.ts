/*
 * 条目
 * @Params: { _jp, _cn, _image, _imageForce, _summary, _type,
 *            _collection, _rating,
 *            _aid, _wid, _hid }
 * @Author: czy0729
 * @Date: 2019-03-22 08:49:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-07-14 14:22:11
 */
import { collectionStore, otaStore, subjectStore, userStore } from '@stores'
import { getTimestamp } from '@utils'
import { queue } from '@utils/fetch'
import { SHARE_MODE, STORYBOOK } from '@constants'
import Action from './action'
import { EXCLUDE_STATE } from './ds'

class ScreenSubject extends Action {
  /** 初始化 */
  init = async () => {
    // 是否需要更新数据
    const { _loaded } = this.state
    const current = getTimestamp()
    const needFetch = !_loaded || current - Number(_loaded) > 60

    try {
      const state = (await this.getStorage(this.namespace)) || {}
      this.setState({
        ...state,
        ...EXCLUDE_STATE,
        _loaded: needFetch ? current : _loaded
      })

      // 装载条目云端缓存数据
      this.fetchSubjectFromOSS()
      if (needFetch) {
        // 手动刷新全局条目收藏状态
        collectionStore.fetchCollectionStatusQueue([this.subjectId])
        return this.onHeaderRefresh()
      }

      return true
    } catch (error) {
      this.setState({
        ...EXCLUDE_STATE,
        _loaded: needFetch ? current : _loaded
      })
      return true
    }
  }

  /** 访问私有 cdn, 加速未缓存条目首屏数据渲染 */
  onHeaderRefresh = async () => {
    queue(
      [
        () => {
          // 因为有 cdn, 下面 2 个用户相关的接口可以提前
          if (!this.state.subject._loaded) return this.fetchSubjectFormCDN()
        },
        () => {
          // 用户每集收看进度
          if (!SHARE_MODE) return this.fetchCollection()
        },
        () => {
          // 用户收藏状态
          if (!SHARE_MODE) return userStore.fetchUserProgress(this.subjectId)
        }
      ],
      1
    )

    // API 条目信息
    const data = await this.fetchSubject()
    queue(
      [
        () => this.fetchOTA(),
        () => this.fetchThirdParty(data),
        () => this.fetchAnitabi(),
        () => {
          // 网页端走的反代, 很容易请求挂起, 需要第一时间回去云端缓存数据
          if (STORYBOOK) return this.fetchCommentsFromOSS()

          // APP 端可以延迟获取, 若正常数据获取到, 会取消获取云端数据
          setTimeout(() => {
            this.fetchCommentsFromOSS()
          }, 6400)
        },
        () => this.fetchTrackComments(),
        () => this.fetchSubjectComments(true),
        () => this.fetchSubjectFromHTML(),
        () => this.fetchEpsData(),
        () => this.setRendered(),
        () => {
          // 对集数大于 1000 的条目, 旧 API 并不会返回大于 1000 章节的信息, 暂时到新的 API 里取
          if (this.subject.eps?.length < 1000) return true
          return subjectStore.fetchSubjectEpV2(this.subjectId)
        },
        () => {
          // nsfw 条目不再返回数据, 而旧接口 staff 也错乱, 主动请求网页的 staff 数据
          // @ts-expect-error
          if (data?.code === 404) return this.fetchPersons()
          return true
        }
      ],
      2
    )

    return true
  }

  /** 装载第三方找条目数据 */
  fetchOTA = () => {
    if (this.type === '动画') {
      if (this.animeInfo?.i) otaStore.fetchAnime(this.animeInfo.i)
      return
    }

    if (this.type === '游戏') {
      if (this.gameInfo?.i) otaStore.fetchGame(this.gameInfo.i)
      return
    }
  }
}

export default ScreenSubject

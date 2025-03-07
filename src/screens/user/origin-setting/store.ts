/*
 * @Author: czy0729
 * @Date: 2020-09-05 15:56:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-06-30 16:00:10
 */
import { observable, computed, toJS } from 'mobx'
import { subjectStore, systemStore } from '@stores'
import { getTimestamp, open, copy, info } from '@utils'
import store from '@utils/store'
import { t } from '@utils/fetch'
import { getOriginConfig, replaceOriginUrl } from './utils'
import { NAMESPACE, TYPES_DS } from './ds'

export default class ScreenOriginSetting extends store {
  state = observable({
    data: {
      base: {},
      custom: {
        anime: [],
        hanime: [],
        manga: [],
        wenku: [],
        music: [],
        game: [],
        real: []
      }
    },
    edit: {
      type: '',
      item: {
        id: '',
        uuid: '',
        name: '',
        url: '',
        sort: 0,
        active: 1
      }
    },
    active: true,
    _loaded: false
  })

  init = async () => {
    const state = (await this.getStorage(NAMESPACE)) || {}
    this.setState({
      data: toJS(subjectStore.origin),
      active: state?.active || false,
      _loaded: getTimestamp()
    })
  }

  // -------------------- get --------------------
  @computed get data() {
    const { data } = this.state
    return getOriginConfig(data)
  }

  // -------------------- action --------------------
  onToggle = () => {
    const { active } = this.state
    this.setState({
      active: !active
    })
    this.setStorage(NAMESPACE)
  }

  updateOrigin = () => {
    setTimeout(() => {
      const { data } = this.state
      subjectStore.updateOrigin(data)
    }, 0)
  }

  /** 展开编辑表单 */
  openEdit = (type, item) => {
    this.setState({
      edit: {
        type,
        item
      }
    })

    t('自定义源头.编辑表单', {
      type
    })
  }

  /** 关闭并清空编辑表单 */
  closeEdit = () => {
    this.setState({
      edit: {
        type: '',
        item: {
          id: '',
          uuid: '',
          name: '',
          url: '',
          sort: 0,
          active: 1
        }
      }
    })

    t('自定义源头.关闭表单')
  }

  /** 输入框变化 */
  onChangeText = (key, val) => {
    const { edit } = this.state
    let _val = val.trim()
    if (key === 'sort') _val = isNaN(Number(_val)) ? 0 : Number(_val)

    this.setState({
      edit: {
        ...edit,
        item: {
          ...edit.item,
          [key]: _val
        }
      }
    })
  }

  /** 保存源头 */
  submitEdit = () => {
    const { edit, data } = this.state
    const { type, item } = edit
    const { id, uuid } = item
    const isCreate = id === '' && uuid === ''

    let _data
    if (isCreate) {
      // 新增
      if (!item.name) {
        info('名字不能为空')
        return
      }

      if (!item.url) {
        info('网址不能为空')
        return
      }

      _data = toJS(data)
      _data.custom[type].push({
        uuid: getTimestamp(),
        name: item.name || '',
        url: item.url || '',
        sort: item.sort || 0,
        active: 1
      })
    } else {
      // 修改
      if (id) {
        _data = toJS(data)
        if (_data.base[id]) {
          _data.base[id] = {
            ..._data.base[id],
            sort: item.sort
          }
        } else {
          _data.base[id] = {
            sort: item.sort
          }
        }
      } else {
        if (!item.name) {
          info('名字不能为空')
          return
        }

        if (!item.url) {
          info('网址不能为空')
          return
        }

        _data = toJS(data)
        const findIndex = _data.custom[type].findIndex(i => i.uuid === uuid)
        if (_data.custom[type][findIndex]) {
          _data.custom[type][findIndex] = {
            ..._data.custom[type][findIndex],
            ...item
          }
        }
      }
    }

    this.setState({
      data: _data
    })

    this.closeEdit()
    this.updateOrigin()

    t('自定义源头.保存源头', {
      type
    })
  }

  /** 停用源头 */
  disableItem = ({ id, uuid, type }) => {
    if (!type) return

    const { data } = this.state
    const _data = toJS(data)

    if (id) {
      if (_data.base[id]) {
        _data.base[id] = {
          ..._data.base[id],
          active: 0
        }
      } else {
        _data.base[id] = {
          active: 0
        }
      }
    } else {
      const find = _data.custom[type].find(i => i.uuid === uuid)
      if (find) find.active = 0
    }

    this.setState({
      data: _data
    })
    this.updateOrigin()

    t('自定义源头.停用源头', {
      type
    })
  }

  /** 启用源头 */
  activeItem = ({ id, uuid, type }) => {
    if (!type) return

    const { data } = this.state
    const _data = toJS(data)

    if (id) {
      if (_data.base[id]) {
        _data.base[id] = {
          ..._data.base[id],
          active: 1
        }
      } else {
        _data.base[id] = {
          active: 1
        }
      }
    } else {
      const find = _data.custom[type].find(i => i.uuid === uuid)
      if (find) find.active = 1
    }

    this.setState({
      data: _data
    })
    this.updateOrigin()

    t('自定义源头.启用源头', {
      type
    })
  }

  /** 删除自定义源头 */
  deleteItem = ({ uuid, type }) => {
    if (!uuid || !type) return

    const { data } = this.state
    const _data = toJS(data)
    _data.custom[type] = _data.custom[type].filter(item => item.uuid !== uuid)

    this.setState({
      data: _data
    })
    this.updateOrigin()
  }

  /** 测试 */
  go = ({ type, url }) => {
    if (!type || !url) return

    const { test } = TYPES_DS.find(item => item.type === type)
    const _url = replaceOriginUrl(url, test)
    if (_url) {
      const { openInfo } = systemStore.setting
      if (openInfo) copy(_url, '已复制地址')
      setTimeout(
        () => {
          try {
            open(_url)
          } catch (error) {
            info('网址解析出错, 请检查')
          }
        },
        openInfo ? 1600 : 0
      )
    }
  }
}

/*
 * @Author: czy0729
 * @Date: 2023-02-27 20:13:43
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-10 21:38:36
 */
import { _ } from '@stores'
import { ExcludeState, State, InitItem } from '../types'

/** 唯一命名空间 */
export const NAMESPACE = 'ScreenHomeV2'

/** 每个 Item 的状态 */
export const INIT_ITEM: InitItem = {
  expand: false,
  doing: false
}

/** 不参与本地化的 state */
export const EXCLUDE_STATE: ExcludeState = {
  visible: false,

  /** 可视范围底部 y */
  visibleBottom: _.window.height,
  modal: {
    title: '',
    desc: ''
  },
  progress: {
    fetching: false,
    fetchingSubjectId1: 0,
    fetchingSubjectId2: 0,
    message: '',
    current: 0,
    total: 0
  },
  filter: '',
  filterPage: -1,
  isFocused: true,
  renderedTabsIndex: [],
  flip: 0
}

/** state */
export const STATE: State & ExcludeState = {
  subjectId: 0,
  page: 0,
  top: [],
  item: {},
  current: 0,
  grid: {
    subject_id: 0,
    subject: {},
    ep_status: ''
  },
  boot: 0,
  ...EXCLUDE_STATE,
  _loaded: false
}

/** 列表布局 ep 按钮最大数量 */
export const PAGE_LIMIT_LIST = 4 * 8

/** 网格布局 ep 按钮最大数量 */
export const PAGE_LIMIT_GRID = 4 * 6

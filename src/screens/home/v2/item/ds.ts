/*
 * @Author: czy0729
 * @Date: 2022-06-12 15:07:25
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-02-27 22:19:11
 */
import { _ } from '@stores'
import { Navigation, Subject, SubjectId } from '@types'
import { StoreType, TabLabel } from '../types'
import { memoStyles } from './styles'

export const TITLE_HIT_SLOPS = {
  top: _.device(8, 4),
  right: _.device(8, 4),
  bottom: _.device(2, 4),
  left: _.device(8, 4)
}

export const WEEK_DAY_MAP = {
  0: '日',
  1: '一',
  2: '二',
  3: '三',
  4: '四',
  5: '五',
  6: '六',
  7: '日'
} as const

/** index.tsx */
export type Props = {
  index: number
  subjectId: SubjectId
  subject: Subject
  title?: TabLabel

  /** 看到多少集 */
  epStatus: string | number
}

/** item.tsx */
export const DEFAULT_PROPS = {
  navigation: {} as Navigation,
  styles: {} as ReturnType<typeof memoStyles>,
  index: 0 as number,
  subject: {} as Subject,
  subjectId: 0 as SubjectId,
  title: '' as TabLabel,

  /** 看到多少集 */
  epStatus: '' as string | number,
  heatMap: false as boolean,
  homeListCompact: false as boolean,
  expand: false as boolean,
  epsCount: 0 as number,
  isTop: false as boolean,
  isRefreshing: false as boolean,
  onItemPress: (() => {}) as StoreType['onItemPress']
}

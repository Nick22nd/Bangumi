/*
 * @Author: czy0729
 * @Date: 2022-07-04 13:08:40
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-05-16 20:24:43
 */
import { MODEL_RAKUEN_SCROLL_DIRECTION } from '@constants'
import { RakuenScrollDirection } from '@types'
import { StoreType as $ } from '../types'
import { memoStyles } from './styles'

export const DEFAULT_PROPS = {
  styles: {} as ReturnType<typeof memoStyles>,
  list: [] as $['comments']['list'],
  readedTime: 0 as $['readed']['_time'],
  scrollDirection: MODEL_RAKUEN_SCROLL_DIRECTION.getValue<RakuenScrollDirection>(
    '右侧'
  ) as $['setting']['scrollDirection'],
  directFloor: '' as string,
  isWebLogin: false as $['isWebLogin'],
  onPress: (() => {}) as any,
  onDirect: (() => {}) as any
} as const

export const HIT_SLOP = {
  top: 0,
  right: 2,
  bottom: 0,
  left: 2
} as const

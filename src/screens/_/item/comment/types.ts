/*
 * @Author: czy0729
 * @Date: 2022-06-17 12:46:26
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-02-03 16:59:47
 */
import {
  CollectionStatusCn,
  EventType,
  Fn,
  Navigation,
  UserId,
  ViewStyle
} from '@types'

export type Props = {
  navigation?: Navigation
  style?: ViewStyle
  time?: string
  avatar?: string
  userId?: UserId
  userName?: string
  star?: string | number
  status?: CollectionStatusCn
  comment?: string
  event?: EventType
  popoverData?: string[]
  onSelect?: Fn
}

/*
 * @Author: czy0729
 * @Date: 2022-05-28 07:39:17
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-07-08 09:20:54
 */
import { ViewStyle, ReactNode } from '@types'

export type Props = {
  style?: ViewStyle

  /** 菜单项 */
  data?: string[] | readonly string[]

  /** 菜单位置 (iOS only) */
  placement?: string

  /** 菜单样式 (iOS only) */
  menuStyle?: ViewStyle

  contentStyle?: ViewStyle

  /** 菜单 Node (iOS only) */
  overlay?: ReactNode

  hitSlop?: Record<'top' | 'right' | 'bottom' | 'left', number>

  /** 菜单选择 */
  onSelect?: (title?: string) => any

  /** 菜单长按选择 (不推荐使用) */
  onLongPress?: (title?: string) => any

  children?: ReactNode
}

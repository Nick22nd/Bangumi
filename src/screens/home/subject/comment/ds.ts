/*
 * @Author: czy0729
 * @Date: 2022-08-03 10:31:12
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-01-17 06:46:32
 */
import { systemStore } from '@stores'
import { StoreType as $ } from '../types'
import { memoStyles } from './styles'

export const DEFAULT_PROPS = {
  styles: {} as ReturnType<typeof memoStyles>,
  showComment: true as typeof systemStore.setting.showComment,
  pageTotal: 0 as number,
  total: 0 as number,
  onSwitchBlock: (() => {}) as $['onSwitchBlock']
}

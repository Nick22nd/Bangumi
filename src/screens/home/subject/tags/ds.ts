/*
 * @Author: czy0729
 * @Date: 2022-08-26 10:38:10
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-06-29 17:07:13
 */
import { systemStore } from '@stores'
import { Navigation } from '@types'
import { StoreType as $ } from '../types'
import { memoStyles } from './styles'

export const DEFAULT_PROPS = {
  navigation: {} as Navigation,
  styles: {} as ReturnType<typeof memoStyles>,
  subjectId: 0 as $['subjectId'],
  subjectType: '' as $['subjectType'],
  showTags: true as typeof systemStore.setting.showTags,
  subjectTagsExpand: true as typeof systemStore.setting.subjectTagsExpand,
  focusOrigin: false as typeof systemStore.setting.focusOrigin,
  tag: [] as $['collection']['tag'],
  tags: [] as $['tags'],
  animeTags: [] as $['animeTags'],
  hentaiTags: [] as $['hentaiTags'],
  gameTags: [] as $['gameTags'],
  mangaTags: [] as $['mangaTags'],
  wenkuTags: [] as $['wenkuTags'],
  onSwitchBlock: (() => {}) as $['onSwitchBlock']
}

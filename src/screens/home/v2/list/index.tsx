/*
 * @Author: czy0729
 * @Date: 2019-03-14 15:13:57
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-07-12 10:06:28
 */
import React from 'react'
import { Loading } from '@components'
import { obc } from '@utils/decorators'
import { MODEL_SETTING_HOME_LAYOUT } from '@constants'
import { SettingHomeLayout } from '@types'
import Grid from '../grid'
import { Ctx } from '../types'
import { TABS_WITH_GAME as TABS } from '../ds'
import List from './list'
import { memoStyles } from './styles'

export default obc(({ title = '全部' }, { $ }: Ctx) => {
  global.rerender('Home.List')

  if (!$.userCollection._loaded) return <Loading />

  const isGrid =
    $.homeLayout === MODEL_SETTING_HOME_LAYOUT.getValue<SettingHomeLayout>('网格')
  if (isGrid) return <Grid title={title} />

  const { page, isFocused } = $.state
  const index = $.tabs.findIndex(item => item.title === title)
  return (
    <List
      connectRef={ref => $.connectRef(ref, index)}
      styles={memoStyles()}
      data={$.currentUserCollection(title)}
      title={title}
      scrollToTop={isFocused && TABS[page].title === title}
      onHeaderRefresh={$.onHeaderRefresh}
      onFooterRefresh={title === '游戏' ? $.onFooterRefresh : undefined}
    />
  )
})

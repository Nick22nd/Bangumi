/*
 * @Author: czy0729
 * @Date: 2019-04-26 13:40:51
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-13 22:24:16
 */
import React from 'react'
import { Page, Track } from '@components'
import { EVENT_APP_TAB_PRESS } from '@src/navigations/tab-bar'
import { ic } from '@utils/decorators'
import { useRunAfter, useObserver } from '@utils/hooks'
import Header from './header'
import Tab from './tab'
import Heatmaps from './heapmaps'
import Store from './store'
import { Ctx } from './types'

const Rakuen = (props, { $, navigation }: Ctx) => {
  useRunAfter(() => {
    $.init()

    navigation.addListener(`${EVENT_APP_TAB_PRESS}|Rakuen`, () => {
      $.onRefreshThenScrollTop()
    })
  })

  return useObserver(() => (
    <>
      <Page>
        <Header />
        <Tab />
      </Page>
      <Track title='超展开' hm={['rakuen', 'Rakuen']} />
      <Heatmaps />
    </>
  ))
}

export default ic(Store, Rakuen)

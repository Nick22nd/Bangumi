/*
 * @Author: czy0729
 * @Date: 2021-11-28 08:49:33
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-08-05 07:24:05
 */
import React from 'react'
import { obc } from '@utils/decorators'
import { TABS } from '../ds'
import { Ctx } from '../types'
import Filter from './filter'
import { memoStyles } from './styles'

export default obc(({ page }, { $ }: Ctx) => {
  // global.rerender('User.Filter')

  const { subjectType, showFilter, fliterInputText } = $.state
  const { key: type } = TABS[page]
  const isTabActive = $.isTabActive(subjectType, type)
  const isFiltering = $.isFiltering(subjectType, type)
  return (
    <Filter
      styles={memoStyles()}
      showFilter={showFilter}
      fliterInputText={fliterInputText}
      isTabActive={isTabActive}
      isFiltering={isFiltering}
      onFilterChange={$.onFilterChange}
    />
  )
})

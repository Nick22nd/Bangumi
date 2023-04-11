/*
 * @Author: czy0729
 * @Date: 2023-04-11 12:27:14
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-11 19:27:43
 */
import React from 'react'
import {
  StorybookList,
  StorybookNavigation,
  StorybookSPA,
  getStorybookRoute
} from '@components'
import { urlStringify } from '@utils'
import Component from './index'

export default {
  title: 'screens/Browser',
  component: Component
}

export const Browser = () => {
  const route = getStorybookRoute('Browser')
  return (
    <StorybookSPA>
      <StorybookList>
        <Component
          key={urlStringify(route.params)}
          navigation={StorybookNavigation}
          route={route}
        />
      </StorybookList>
    </StorybookSPA>
  )
}

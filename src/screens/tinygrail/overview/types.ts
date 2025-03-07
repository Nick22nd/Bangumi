/*
 * @Author: czy0729
 * @Date: 2022-11-07 16:02:01
 * @Last Modified by:   czy0729
 * @Last Modified time: 2022-11-07 16:02:01
 */
import { factory } from '@utils'
import { Navigation } from '@types'
import Store from './store'

const f = factory(Store)

export type StoreType = typeof f

export type Ctx = {
  $: StoreType
  navigation?: Navigation
}

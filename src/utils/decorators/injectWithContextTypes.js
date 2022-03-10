/*
 * @Author: czy0729
 * @Date: 2022-03-10 17:42:21
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-03-10 17:42:55
 */
import { contextTypes } from '@constants'
import inject from './inject'

function injectWithContextTypes(Store, Component) {
  Component.contextTypes = contextTypes
  return inject(Store)(Component)
}

export default injectWithContextTypes

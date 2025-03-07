/*
 * @Author: czy0729
 * @Date: 2023-08-10 04:29:53
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-11 21:29:28
 */
import { _ } from '@stores'
import { ViewStyle } from '@types'

const H_TABBAR = 48

export const memoStyles = _.memoStyles(() => {
  const backgroundColor = _.ios(
    'transparent',
    _.select(_.colorPlain, _.deepDark ? _._colorPlain : _._colorDarkModeLevel1)
  )
  const tabs: ViewStyle = {
    position: 'absolute',
    zIndex: 1,
    top: -_.statusBarHeight || 0,
    right: 0,
    height: _.headerHeight + H_TABBAR + (_.statusBarHeight || 0),
    backgroundColor
  }
  return {
    ios: {
      ...tabs
    },
    android: {
      ...tabs,
      top: 0,
      left: 0,
      height: _.headerHeight + H_TABBAR,
      backgroundColor: _.select('transparent', 'rgba(0, 0, 0, 0.5)'),
      overflow: 'hidden'
    },
    view: {
      backgroundColor
    }
  }
})

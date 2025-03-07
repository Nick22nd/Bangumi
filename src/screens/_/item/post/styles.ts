/*
 * @Author: czy0729
 * @Date: 2022-06-14 22:57:51
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-10 20:05:20
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => ({
  item: {
    width: _.window.width,
    paddingVertical: _.md,
    paddingHorizontal: _.wind
  },
  itemDelete: {
    width: _.window.width,
    paddingBottom: _.sm,
    paddingHorizontal: _.wind
  },
  itemJump: {
    borderBottomWidth: 2,
    borderColor: _.colorSuccess
  },
  inView: {
    minWidth: 36,
    minHeight: 36
  },
  content: {
    paddingLeft: _.sm
  },
  html: {
    paddingRight: _.sm,
    marginTop: _.sm
  },
  translate: {
    padding: _.sm,
    marginTop: _.sm,
    marginRight: _.sm,
    backgroundColor: _.select(_.colorBg, _._colorDarkModeLevel1),
    borderRadius: _.radiusXs,
    overflow: 'hidden'
  },
  direct: {
    position: 'absolute',
    top: -_.md + 1,
    right: 0,
    bottom: -_.md,
    left: -_._wind + 4,
    borderWidth: 2,
    borderColor: _.colorBorder,
    borderRadius: _.radiusMd,
    overflow: 'hidden'
  },
  left: {
    width: _.r(36)
  },
  sub: {
    paddingTop: _.md
  },
  expand: {
    paddingTop: _.sm,
    paddingBottom: _.md,
    marginLeft: 44
  }
}))

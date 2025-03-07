/*
 * @Author: czy0729
 * @Date: 2022-06-13 10:28:41
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-06-11 04:42:27
 */
import { _ } from '@stores'

export const memoStyles = _.memoStyles(() => ({
  rank: {
    minWidth: 24,
    paddingHorizontal: 6,
    marginRight: 8,
    color: _.__colorPlain__,
    textShadowOffset: {
      width: 1,
      height: 1
    },
    textShadowRadius: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.48)',
    backgroundColor: _.select('#ffc107', _._colorDarkModeLevel2),
    borderRadius: 4,
    overflow: 'hidden'
  },
  fit: {
    width: 'fit-content',
    borderRadius: 4
  }
}))

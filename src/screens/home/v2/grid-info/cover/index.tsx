/*
 * @Author: czy0729
 * @Date: 2022-11-20 08:37:07
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-21 07:40:18
 */
import React from 'react'
import { Cover as CompCover } from '@_'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { memoStyles as gridItemMemoStyles } from '../../grid-item/styles'
import { Ctx } from '../../types'

function Cover({ subjectId, subject = {}, onPress }: any, { $ }: Ctx) {
  // global.rerender('Home.GridInfo.Cover')

  const _subject = $.subject(subjectId)
  const itemStyles = gridItemMemoStyles()
  const imageWidth = _.isMobileLanscape ? 60 : itemStyles.item.width
  const imageHeight = imageWidth * 1.4
  return (
    <CompCover
      key={subjectId}
      size={imageWidth}
      height={imageHeight}
      src={_subject?.images?.medium || subject?.images?.medium || ''}
      radius
      shadow
      onPress={onPress}
    />
  )
}

export default obc(Cover)

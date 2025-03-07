/*
 * @Author: czy0729
 * @Date: 2022-06-21 20:54:06
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-19 09:26:25
 */
import React from 'react'
import { Image, Touchable } from '@components'
import { _, systemStore } from '@stores'
import { showImageViewer } from '@utils'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { Ctx } from '../types'
import { IMAGE_HEIGHT } from './ds'
import { styles } from './styles'

function Preview({ item, index, thumbs, epsThumbsHeader }, { $ }: Ctx) {
  const { showCharacter } = systemStore.setting
  if (!showCharacter) return null

  return (
    <Touchable
      style={index ? styles.image : styles.imageSide}
      animate
      onPress={() => {
        t('条目.预览', {
          subjectId: $.subjectId
        })

        showImageViewer(
          thumbs.filter((item, index) => index < 12),
          index
        )
      }}
    >
      <Image
        key={item}
        src={item.replace('img1.doubanio.com', 'img2.doubanio.com')}
        autoHeight={IMAGE_HEIGHT}
        radius={_.radiusXs}
        headers={epsThumbsHeader}
        errorToHide
      />
    </Touchable>
  )
}

export default obc(Preview)

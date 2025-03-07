/*
 * @Author: czy0729
 * @Date: 2023-06-28 09:07:17
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-06-28 09:07:52
 */
import React from 'react'
import { View } from 'react-native'
import { Touchable, Text, Heatmap } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { Ctx } from '../../types'

function Catalogs({ style }, { $, navigation }: Ctx) {
  return (
    <View style={style}>
      <Touchable
        animate
        scale={0.8}
        onPress={() => {
          t('空间.跳转', {
            userId: $.userId,
            to: 'Catalogs'
          })

          navigation.push('Catalogs', {
            userId: $.userId
          })
        }}
      >
        <Text type={_.select('plain', 'title')} size={11} bold noWrap>
          目录
        </Text>
      </Touchable>
      <Heatmap right={-76} bottom={-8} id='空间.跳转' to='Catalogs' alias='目录' />
    </View>
  )
}

export default obc(Catalogs)

/*
 * @Author: czy0729
 * @Date: 2020-04-21 12:15:41
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-10-11 17:39:55
 */
import React from 'react'
import { IconHeader } from '@_'
import { Flex, Text, Touchable, Heatmap } from '@components'
import { _ } from '@stores'
import { confirm } from '@utils'
import { memo } from '@utils/decorators'
import { t } from '@utils/fetch'
import { DEFAULT_PROPS } from './ds'

export default memo(({ navigation, monoId, canICO, icoUsers, doICO }) => {
  // global.rerender('Mono.Extra.Main')

  if (canICO) {
    return (
      <Touchable
        style={[_.container.touch, _.mr.sm]}
        onPress={() => {
          confirm('花费10000cc启动ICO?', () => doICO(navigation))
        }}
      >
        <Flex style={_.mr.sm}>
          <IconHeader name='trophy' size={18} />
          <Text size={13}>启动ICO</Text>
        </Flex>
      </Touchable>
    )
  }

  return (
    <IconHeader
      style={_.mr.sm}
      name='trophy'
      size={18}
      onPress={() => {
        const path = icoUsers ? 'TinygrailICODeal' : 'TinygrailDeal'
        t('人物.跳转', {
          to: path,
          monoId
        })

        navigation.push(path, {
          monoId
        })
      }}
    >
      <Heatmap right={173} id='人物.启动ICO' transparent />
      <Heatmap
        right={109}
        id='人物.跳转'
        to='TinygrailICODeal'
        alias='ICO'
        transparent
      />
      <Heatmap right={30} id='人物.跳转' to='TinygrailDeal' alias='交易' />
    </IconHeader>
  )
}, DEFAULT_PROPS)

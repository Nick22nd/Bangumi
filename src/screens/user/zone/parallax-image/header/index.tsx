/*
 * @Author: czy0729
 * @Date: 2023-06-28 09:35:42
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-06-28 09:41:01
 */
import React from 'react'
import { Animated } from 'react-native'
import { Flex, Text } from '@components'
import { Avatar } from '@_'
import { _ } from '@stores'
import { HTMLDecode } from '@utils'
import { obc } from '@utils/decorators'
import { H_HEADER } from '../../store'
import { Ctx } from '../../types'
import { styles } from './styles'

function Header({ style }, { $ }: Ctx) {
  const { _name } = $.params
  const { avatar, nickname } = $.usersInfo
  return (
    <Animated.View
      style={[
        styles.parallaxWrap,
        style,
        {
          opacity: $.scrollY.interpolate({
            inputRange: [
              -_.parallaxImageHeight,
              0,
              _.parallaxImageHeight - H_HEADER,
              _.parallaxImageHeight
            ],
            outputRange: [0, 0, 1, 1]
          })
        }
      ]}
    >
      <Flex style={styles.title} justify='center'>
        <Avatar
          style={styles.avatar}
          size={28}
          src={$.src}
          borderWidth={0}
          fallbackSrc={avatar?.large}
        />
        <Text
          style={_.ml.sm}
          type={_.select('plain', 'title')}
          align='center'
          bold
          numberOfLines={1}
        >
          {HTMLDecode(nickname || _name)}
        </Text>
      </Flex>
    </Animated.View>
  )
}

export default obc(Header)

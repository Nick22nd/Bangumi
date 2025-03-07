/*
 * @Author: czy0729
 * @Date: 2023-01-10 05:37:39
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-19 17:50:03
 */
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Flex, Iconfont, Text, Touchable, UserStatus } from '@components'
import { InView, Avatar, PreventTouchPlaceholder, SectionTitle } from '@_'
import { _ } from '@stores'
import { t } from '@utils/fetch'
import { obc } from '@utils/decorators'
import { HOST, SCROLL_VIEW_RESET_PROPS } from '@constants'
import { Ctx } from '../types'
import { styles } from './styles'

function Collected(props, { $, navigation }: Ctx) {
  // global.rerender('Mono.Collected')

  const { collected } = $.mono
  if (!collected?.length) return null

  return (
    <InView style={styles.container}>
      <SectionTitle
        style={_.container.wind}
        right={
          <Flex>
            <Touchable
              style={styles.touch}
              onPress={() => {
                navigation.push('WebBrowser', {
                  url: `${HOST}/${$.monoId}/collections`,
                  title: `谁收藏了${$.nameTop}`
                })

                t('人物.跳转', {
                  from: '谁收藏了',
                  to: 'WebBrowser',
                  monoId: $.monoId
                })
              }}
            >
              <Flex>
                <Text style={_.ml.sm} type='sub'>
                  全部
                </Text>
                <Iconfont
                  style={_.ml.xs}
                  name='md-open-in-new'
                  color={_.colorSub}
                  size={16}
                />
              </Flex>
            </Touchable>
          </Flex>
        }
      >
        谁收藏了
      </SectionTitle>
      <ScrollView
        style={_.mt.md}
        contentContainerStyle={_.container.wind}
        horizontal
        {...SCROLL_VIEW_RESET_PROPS}
      >
        {collected.map(item => (
          <Touchable
            key={item.userId}
            style={styles.item}
            animate
            onPress={() => {
              navigation.push('Zone', {
                userId: item.userId,
                _name: item.name
              })

              t('人物.跳转', {
                from: '谁收藏了',
                to: 'Zone',
                monoId: $.monoId,
                userId: item.userId
              })
            }}
          >
            <Flex>
              <UserStatus userId={item.userId}>
                <Avatar name={item.name} src={item.avatar} />
              </UserStatus>
              <View style={_.ml.sm}>
                <Flex>
                  <Text size={13} bold>
                    {item.name}
                  </Text>
                </Flex>
                <Text style={_.mt.xs} size={10} type='sub'>
                  {item.last}
                </Text>
              </View>
            </Flex>
          </Touchable>
        ))}
      </ScrollView>
      <PreventTouchPlaceholder />
    </InView>
  )
}

export default obc(Collected)

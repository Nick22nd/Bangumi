/*
 * @Author: czy0729
 * @Date: 2020-12-21 16:24:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-10-13 05:17:52
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, RenderHtml, UserStatus, Text } from '@components'
import { _, systemStore } from '@stores'
import { open, appNavigate, HTMLDecode } from '@utils'
import { obc } from '@utils/decorators'
import { Avatar, Name } from '../../../base'
import UserLabel from '../user-label'
import { memoStyles } from './styles'
import { Props } from './types'

const AVATAR_WIDTH = 20

function ItemPlusOne(
  {
    id,
    message,
    userId,
    userName,
    avatar,
    url,
    floor,
    directFloor,
    isAuthor,
    isFriend,
    isLayer,
    event
  }: Props,
  { navigation }
) {
  const styles = memoStyles()
  const { avatarRound } = systemStore.setting
  const imagesMaxWidthSub = _.window.width - 2 * _.wind - 2 * AVATAR_WIDTH - 2 * _.sm
  return (
    <View style={styles.item}>
      <Flex>
        <Flex style={avatarRound ? styles.round : styles.rectangle}>
          <View style={_.mr.xs}>
            <UserStatus userId={userId} mini>
              <Avatar
                navigation={navigation}
                size={AVATAR_WIDTH}
                userId={userId}
                name={userName}
                src={avatar}
                event={event}
              />
            </UserStatus>
          </View>
          <Name userId={userId} size={10} bold>
            {HTMLDecode(userName)}
          </Name>
          <UserLabel
            isAuthor={isAuthor}
            isFriend={isFriend}
            isLayer={isLayer}
            lineHeight={10}
          />
        </Flex>
        <Flex align='end'>
          <RenderHtml
            style={_.ml.sm}
            baseFontStyle={_.baseFontStyle.sm}
            imagesMaxWidth={imagesMaxWidthSub}
            html={message}
            onLinkPress={href => appNavigate(href, navigation, {}, event)}
            onImageFallback={() => open(`${url}#post_${id}`)}
          />
          {!!floor && (
            <Text type='sub' size={11} lineHeight={14}>
              {'  '}
              {floor}
            </Text>
          )}
        </Flex>
      </Flex>

      {/* 高亮 */}
      {directFloor && <View style={styles.direct} pointerEvents='none' />}
    </View>
  )
}

export default obc(ItemPlusOne)

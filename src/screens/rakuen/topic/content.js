/*
 * @Author: czy0729
 * @Date: 2020-03-19 00:38:46
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-01-04 04:50:57
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, RenderHtml, Loading, Text, Heatmap } from '@components'
import { IconTouchable } from '@screens/_'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { appNavigate } from '@utils/app'

function Content(props, { $, navigation }) {
  rerender('Topic.Content')

  const event = {
    id: '帖子.跳转',
    data: {
      from: '#1',
      topicId: $.topicId
    }
  }

  const { translateResult } = $.state
  const isGroup = $.topicId.includes('group/')
  return (
    <View style={styles.html}>
      {isGroup && !$.html && (
        <Flex style={styles.loading} justify='center'>
          <Loading />
        </Flex>
      )}
      {translateResult.length ? (
        <View>
          {translateResult.map((item, index) => (
            <View key={index}>
              <Text style={_.mt.md} size={13} lineHeight={14} type='sub'>
                {item.src}
              </Text>
              <Text style={_.mt.xs} size={15} lineHeight={17}>
                {item.dst}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        !!$.html && (
          <>
            {$.isEp && (
              <View style={styles.iconTranslate}>
                <IconTouchable
                  name='md-g-translate'
                  size={18}
                  onPress={$.doTranslate}
                />
                <Heatmap id='帖子.翻译内容' />
              </View>
            )}
            <View style={_.mt.md}>
              <RenderHtml
                html={$.html}
                matchLink
                onLinkPress={href => appNavigate(href, navigation, {}, event)}
              />
              <Heatmap
                bottom={133}
                id='帖子.跳转'
                data={{
                  to: 'Blog',
                  alias: '日志'
                }}
                transparent
              />
              <Heatmap
                bottom={100}
                id='帖子.跳转'
                data={{
                  to: 'CatalogDetail',
                  alias: '目录'
                }}
                transparent
              />
              <Heatmap
                bottom={67}
                id='帖子.跳转'
                data={{
                  to: 'Topic',
                  alias: '帖子'
                }}
                transparent
              />
              <Heatmap
                bottom={34}
                id='帖子.跳转'
                data={{
                  to: 'Mono',
                  alias: '人物'
                }}
                transparent
              />
              <Heatmap
                id='帖子.跳转'
                data={{
                  to: 'WebBrowser',
                  alias: '浏览器'
                }}
                transparent
              />
            </View>
          </>
        )
      )}
    </View>
  )
}

export default obc(Content)

const styles = _.create({
  html: {
    minHeight: 120 * _.ratio
  },
  loading: {
    height: 120 * _.ratio
  },
  iconTranslate: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: -4
  }
})

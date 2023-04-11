/*
 * @Author: czy0729
 * @Date: 2022-07-25 23:12:59
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-03-28 16:58:03
 */
import React from 'react'
import { View } from 'react-native'
import { Touchable, Flex, Katakana, Text } from '@components'
import { Cover, Stars, Manage } from '@_'
import { uiStore, _ } from '@stores'
import { HTMLDecode } from '@utils'
import { memo } from '@utils/decorators'
import { t } from '@utils/fetch'
import { IMG_WIDTH, IMG_HEIGHT, MODEL_COLLECTION_STATUS } from '@constants'
import { CollectionStatus } from '@types'
import { DEFAULT_PROPS } from './ds'

const ItemLine = memo(
  ({
    navigation,
    styles,
    hideScore,
    subjectId,
    name,
    desc,
    images,
    air,
    time,
    expand,
    collection,
    score,
    sites,
    onToggleExpand
  }) => {
    // global.rerender('Calendar.ItemLine.Main')

    const title = HTMLDecode(name)
    const size = title.length >= 20 ? 12 : title.length >= 14 ? 13 : 14

    const showScore = !hideScore && !!score
    const canPress = expand || (!expand && time && time !== '2359')

    const s = []
    if (sites.b) s.push('bilibili')
    if (!sites.b && sites.bhmt) s.push('bilibili 港澳台')
    if (sites.i) s.push('爱奇艺')
    if (sites.q) s.push('腾讯视频')

    const content = (
      <Flex style={styles.item} align='start'>
        <View style={styles.time}>
          {!!(time && !(time === '2359' && !expand)) && (
            <Text bold>
              {time === '2359' ? '未知' : `${time.slice(0, 2)}:${time.slice(2)}`}
            </Text>
          )}
          {time === '2359' && (
            <Touchable
              style={styles.undetermined}
              withoutFeedback
              onPress={onToggleExpand}
            >
              <Text type='sub'>{expand ? '收起' : '展开'}</Text>
            </Touchable>
          )}
        </View>
        {canPress && (
          <>
            <Cover
              width={IMG_WIDTH}
              height={IMG_HEIGHT}
              src={images?.medium}
              radius
              shadow
            />
            <Flex.Item style={_.ml.md}>
              <Flex
                style={styles.body}
                direction='column'
                justify='between'
                align='start'
              >
                <View style={_.container.block}>
                  <Flex align='start'>
                    <Flex.Item>
                      <Katakana.Provider
                        itemStyle={styles.katakanas}
                        size={size}
                        numberOfLines={3}
                        bold
                      >
                        <Katakana type='desc' size={size} numberOfLines={3} bold>
                          {title}
                        </Katakana>
                      </Katakana.Provider>
                    </Flex.Item>
                  </Flex>
                </View>
                {!!s.length && (
                  <Text type='sub' size={13} bold>
                    {s.join('、')}
                  </Text>
                )}
                <Flex>
                  {!!air && (
                    <Text style={_.mr.sm} type='sub' size={13} bold>
                      至第{air}话
                    </Text>
                  )}
                  {showScore && <Stars simple value={score} type='desc' size={13} />}
                </Flex>
              </Flex>
            </Flex.Item>
            <Manage
              subjectId={subjectId}
              collection={collection}
              onPress={() => {
                uiStore.showManageModal(
                  {
                    subjectId,
                    title: HTMLDecode(name),
                    desc,
                    status:
                      MODEL_COLLECTION_STATUS.getValue<CollectionStatus>(collection)
                  },
                  '每日放送'
                )
              }}
            />
          </>
        )}
      </Flex>
    )

    if (canPress) {
      return (
        <View style={_.container.block}>
          <Touchable
            animate
            onPress={() => {
              t('每日放送.跳转', {
                to: 'Subject',
                subjectId
              })

              navigation.push('Subject', {
                subjectId,
                _cn: name,
                _image: images?.medium
              })
            }}
          >
            {content}
          </Touchable>
        </View>
      )
    }

    return <View style={_.container.block}>{content}</View>
  },
  DEFAULT_PROPS
)

export default ItemLine

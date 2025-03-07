/*
 * @Author: czy0729
 * @Date: 2022-04-20 13:52:47
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-06-12 05:09:48
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Text } from '@components'
import { Cover, Manage, Rank, Rate } from '@_'
import { _, collectionStore, systemStore, uiStore } from '@stores'
import { getAction, alert } from '@utils'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import { MODEL_COLLECTION_STATUS, MODEL_SUBJECT_TYPE } from '@constants'
import { CollectionStatus, SubjectType, SubjectTypeCn } from '@types'
import { getReasonsInfo } from '../utils'
import { Ctx, ListItem } from '../types'
import Sub from './sub'
import { memoStyles } from './styles'

function Item(
  {
    item
  }: {
    item: ListItem
  },
  { $, navigation }: Ctx
) {
  const { type } = $.state
  const subject: any = $.subjects(item.id) || {}
  if (type !== MODEL_SUBJECT_TYPE.getLabel<SubjectType>(subject.type)) {
    return null
  }

  const { likeCollected } = systemStore.setting
  const collection = collectionStore.collect(item.id)
  if (!likeCollected && collection) return null

  const styles = memoStyles()
  const image = `https://lain.bgm.tv/pic/cover/m/${item.image}.jpg`
  const typeCn = MODEL_SUBJECT_TYPE.getTitle<SubjectTypeCn>(subject.type)
  const action = getAction(typeCn)
  return (
    <Flex style={styles.item} align='start'>
      <Cover
        src={image}
        width={styles.cover.width}
        height={styles.cover.height}
        radius
        type={typeCn}
        onPress={() => {
          navigation.push('Subject', {
            subjectId: item.id,
            _cn: item.name,
            _image: image
          })

          t('猜你喜欢.跳转', {
            subjectId: item.id,
            userId: $.userId
          })
        }}
      />
      <Flex.Item>
        <Flex style={styles.body} direction='column' justify='between' align='start'>
          <Flex direction='column' align='start'>
            <Text style={styles.title} bold numberOfLines={2}>
              {item.name}
            </Text>
            <Manage
              subjectId={item.id}
              collection={collection}
              typeCn={typeCn}
              horizontal
              onPress={() => {
                uiStore.showManageModal(
                  {
                    subjectId: item.id,
                    title: item.name,
                    action,
                    status:
                      MODEL_COLLECTION_STATUS.getValue<CollectionStatus>(collection)
                  },
                  '猜你喜欢'
                )
              }}
            />
          </Flex>
          <View>
            {!!subject.total && (
              <Flex style={_.mb.xs}>
                <Rank value={subject.rank} />
                <Text type='sub' size={11} bold>
                  {subject.score.toFixed(1)}
                  {'  '}({subject.total})
                </Text>
              </Flex>
            )}
            <Sub name={item.name} relates={item.relates} action={action} />
          </View>
        </Flex>
      </Flex.Item>
      <Rate
        value={item.rate}
        onPress={() => {
          alert(getReasonsInfo(item.reasons).join('\n'), item.name)
        }}
      />
    </Flex>
  )
}

export default obc(Item)

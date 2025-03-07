/*
 * @Author: czy0729
 * @Date: 2019-11-17 12:10:59
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-11-11 06:32:18
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Text, Image, Iconfont, Touchable, TextType } from '@components'
import { _ } from '@stores'
import { formatNumber, toFixed, tinygrailOSS, getCoverLarge } from '@utils'
import { obc } from '@utils/decorators'
import { t } from '@utils/fetch'
import Rank from '@tinygrail/_/rank'
import Stars from '@tinygrail/_/stars'
import { Ctx } from '../types'
import { memoStyles } from './styles'

function Info(props, { $, navigation }: Ctx) {
  const styles = memoStyles()
  const { showCover } = $.state
  const {
    icon,
    id,
    name,
    bonus,
    marketValue,
    current,
    total,
    level,
    fluctuation,
    rank,
    stars
  } = $.chara
  let color: TextType = 'tinygrailPlain'
  if (fluctuation < 0) {
    color = 'ask'
  } else if (fluctuation > 0) {
    color = 'bid'
  }

  let fluctuationText = '-%'
  if (fluctuation > 0) {
    fluctuationText = `+${toFixed(fluctuation, 2)}%`
  } else if (fluctuation < 0) {
    fluctuationText = `${toFixed(fluctuation, 2)}%`
  }

  const { s, subject, r } = $.relation
  const EVENT = {
    id: '资产重组.封面图查看',
    data: {
      monoId: $.monoId
    }
  } as const

  return (
    <View style={styles.container}>
      {showCover && !!icon && (
        <Flex justify='center'>
          <Image
            style={styles.image}
            src={tinygrailOSS(getCoverLarge(icon))}
            autoSize={160}
            shadow
            placeholder={false}
            imageViewer
            imageViewerSrc={tinygrailOSS(getCoverLarge(icon), 480)}
            event={EVENT}
          />
        </Flex>
      )}
      <Flex style={showCover && _.mt.md} justify='center'>
        <Touchable
          onPress={() => {
            t('资产重组.跳转', {
              to: 'Mono',
              from: '顶部',
              monoId: $.monoId
            })

            navigation.push('Mono', {
              monoId: `character/${id}`,
              _name: name
            })
          }}
        >
          <Flex justify='center'>
            <Rank value={rank} />
            <Text type='tinygrailPlain' size={15} align='center' bold>
              #{id} - {name}
              {!!bonus && (
                <Text type='warning' size={12} lineHeight={15} bold>
                  {' '}
                  x{bonus}
                </Text>
              )}
              <Text type='ask' size={12} lineHeight={15} bold>
                {' '}
                lv{level}
              </Text>
            </Text>
            <Iconfont name='md-navigate-next' color={_.colorTinygrailText} />
          </Flex>
        </Touchable>
      </Flex>
      {!!stars && (
        <Flex style={_.mt.xs} justify='center'>
          <Stars value={stars} size={15} />
        </Flex>
      )}
      <Flex style={[_.container.wind, _.mt.xs]} justify='center' align='baseline'>
        <Text type='tinygrailPlain' size={15} bold>
          ₵{current && toFixed(current, 1)}
        </Text>
        <Text type={color} align='center' size={12}>
          {' '}
          {fluctuationText}
        </Text>
        <Text type='tinygrailText' align='center' size={12}>
          {' '}
          / 发行价{toFixed($.issuePrice, 1)} / 市值
          {formatNumber(marketValue, 0, $.short)} / 量{formatNumber(total, 0, $.short)}
        </Text>
      </Flex>
      <Flex style={_.mt.sm} justify='center'>
        {!!subject && (
          <>
            <Touchable
              style={_.mr.sm}
              onPress={() =>
                navigation.push('Subject', {
                  subjectId: s
                })
              }
            >
              <Text type='tinygrailText' size={13}>
                [{subject}]
              </Text>
            </Touchable>
            <Touchable
              style={_.mr.sm}
              onPress={() =>
                navigation.push('TinygrailRelation', {
                  ids: r,
                  name: `${subject} (${r.length})`
                })
              }
            >
              <Iconfont name='md-compare-arrows' color={_.colorTinygrailPlain} />
            </Touchable>
          </>
        )}
        <Touchable onPress={$.toggleCover}>
          <Iconfont
            name={showCover ? 'md-keyboard-arrow-up' : 'md-keyboard-arrow-down'}
            color={_.colorTinygrailText}
          />
        </Touchable>
      </Flex>
    </View>
  )
}

export default obc(Info)

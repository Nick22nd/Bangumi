/*
 * @Author: czy0729
 * @Date: 2023-01-12 06:39:55
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-19 14:37:17
 */
import React from 'react'
import { ScrollView, View } from 'react-native'
import { Flex, Heatmap, Iconfont, Image, Text, Touchable } from '@components'
import { InView, PreventTouchPlaceholder, SectionTitle } from '@_'
import { _ } from '@stores'
import { date, open, showImageViewer, stl } from '@utils'
import { memo } from '@utils/decorators'
import { t } from '@utils/fetch'
import { useHorizontalLazy } from '@utils/hooks'
import { SCROLL_VIEW_RESET_PROPS } from '@constants'
import IconHidden from '../icon/hidden'
import { DEFAULT_PROPS, THUMB_HEIGHT, THUMB_WIDTH } from './ds'

export default memo(({ styles, showAnitabi, subjectId, data, onSwitchBlock }) => {
  // global.rerender('Subject.Anitabi.Main')

  const { city, pointsLength, imagesLength, litePoints } = data
  const { list, onScroll } = useHorizontalLazy(
    litePoints,
    Math.floor(_.window.contentWidth / THUMB_WIDTH) + 1
  )

  const thumbs = list
    .filter(item => item.image)
    .map(item => ({
      url: item.image.replace('h160', 'h360')
    }))
  return (
    <InView style={stl(styles.container, !showAnitabi && _.short)}>
      <SectionTitle
        style={_.container.wind}
        right={
          showAnitabi === false ? (
            <IconHidden name='取景地标' value='showAnitabi' />
          ) : (
            showAnitabi !== -1 && (
              <Touchable
                style={styles.touch}
                onPress={() => {
                  t('条目.跳转', {
                    to: 'anitabi.cn',
                    from: '取景地标',
                    subjectId
                  })

                  open(`https://anitabi.cn/map?bangumiId=${subjectId}`)
                }}
              >
                <Flex>
                  <Text type='sub'>动画巡礼地图</Text>
                  <Iconfont style={_.ml.xs} name='md-open-in-new' size={17} />
                </Flex>
                <Heatmap id='条目.跳转' from='取景地标' />
              </Touchable>
            )
          )
        }
        icon={!showAnitabi && 'md-navigate-next'}
        onPress={() => onSwitchBlock('showAnitabi')}
      >
        取景地标
      </SectionTitle>

      {showAnitabi && (
        <>
          <Flex style={_.container.windMtMd}>
            <Text size={11}>主要取景城市: </Text>
            <Text size={11} bold>
              {city}{' '}
            </Text>
            <Text size={11} type='sub'>
              {' '}
              ({pointsLength} 个地标 、{imagesLength} 张截图)
            </Text>
          </Flex>

          <ScrollView
            style={_.mt.md}
            contentContainerStyle={_.container.wind}
            horizontal
            {...SCROLL_VIEW_RESET_PROPS}
            scrollEventThrottle={8}
            onScroll={onScroll}
          >
            {list.map((item, index) => (
              <View key={item.id} style={_.mr.sm}>
                {item.image ? (
                  <Image
                    style={styles.image}
                    src={item.image}
                    size={THUMB_WIDTH}
                    height={THUMB_HEIGHT}
                    radius
                    onPress={() => {
                      showImageViewer(thumbs, Math.min(index, thumbs.length - 1))
                    }}
                  />
                ) : (
                  <Flex style={styles.void} direction='column' justify='center'>
                    <Text type='sub' size={16} bold>
                      {index + 1}
                    </Text>
                    <Text style={_.mt.xs} type='sub' size={11} bold>
                      尚无截图
                    </Text>
                  </Flex>
                )}
                <Text style={styles.title} size={11} bold numberOfLines={2}>
                  {item.cn || item.name}
                </Text>
                {item.ep || item.s ? (
                  <Text style={styles.sub} type='sub' size={11} bold numberOfLines={1}>
                    {item.ep ? `EP${item.ep} ` : ''}
                    {item.s ? date('i:s', item.s) : ''}
                  </Text>
                ) : (
                  <Text style={styles.sub} type='sub' size={11} bold numberOfLines={1}>
                    坐标 {item.geo.join('，')}
                  </Text>
                )}
              </View>
            ))}
          </ScrollView>

          <PreventTouchPlaceholder />
        </>
      )}
    </InView>
  )
}, DEFAULT_PROPS)

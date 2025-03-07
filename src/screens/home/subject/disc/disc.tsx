/*
 * @Author: czy0729
 * @Date: 2019-06-02 02:26:37
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-06-29 17:13:11
 */
import React, { useCallback, useState } from 'react'
import { View } from 'react-native'
import { Expand, Text, Heatmap } from '@components'
import { SectionTitle } from '@_'
import { _ } from '@stores'
import { memo } from '@utils/decorators'
import { appNavigate } from '@utils/app'
import IconDisc from '../icon/disc'
import IconSearchDisc from '../icon/search-disc'
import { DEFAULT_PROPS } from './ds'

export default memo(
  ({ navigation, styles, subjectId, disc, discTranslateResult, focusOrigin }) => {
    // global.rerender('Subject.Disc.Main')

    const [expand, setExpand] = useState(false)
    const onExpand = useCallback(() => {
      setExpand(true)
    }, [setExpand])

    const _discTranslateResult = [...discTranslateResult]
    return (
      <View style={styles.container}>
        <SectionTitle
          right={
            <>
              {!focusOrigin && <IconSearchDisc />}
              {!discTranslateResult.length && <IconDisc />}
            </>
          }
        >
          曲目列表
        </SectionTitle>
        {!!disc.length && (
          <View style={_.mt.md}>
            <Expand onExpand={onExpand}>
              {disc
                .filter((item, index) => {
                  if (expand) return true
                  return item.disc.length >= 6 ? index < 1 : index < 2
                })
                .map((item, index) => (
                  <View key={item.title} style={!!index && _.mt.md}>
                    <Text type='sub' size={16} selectable>
                      {item.title}
                    </Text>
                    <View style={_.mt.sm}>
                      {item.disc.map((i, idx) => {
                        let translate = ''
                        if (_discTranslateResult.length) {
                          translate = _discTranslateResult.shift().dst
                        }
                        return (
                          <View
                            key={i.href}
                            style={
                              idx % 2 === 0 ? [styles.item, styles.odd] : styles.item
                            }
                          >
                            <Text
                              onPress={() =>
                                appNavigate(
                                  i.href,
                                  navigation,
                                  {},
                                  {
                                    id: '条目.跳转',
                                    data: {
                                      from: '曲目列表',
                                      subjectId
                                    }
                                  }
                                )
                              }
                            >
                              {i.title}
                            </Text>
                            {!!translate && (
                              <Text style={styles.translate} type='sub' size={12}>
                                {translate}
                              </Text>
                            )}
                          </View>
                        )
                      })}
                    </View>
                  </View>
                ))}
            </Expand>
            <Heatmap id='条目.跳转' from='曲目列表' />
          </View>
        )}
      </View>
    )
  },
  DEFAULT_PROPS,
  ({ discTranslateResult, ...other }: { discTranslateResult: any[] }) => ({
    discTranslateResult: discTranslateResult.length,
    ...other
  })
)

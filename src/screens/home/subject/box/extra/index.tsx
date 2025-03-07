/*
 * @Author: czy0729
 * @Date: 2023-06-29 14:15:59
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-07-08 09:34:31
 */
import React from 'react'
import { View } from 'react-native'
import { Flex, Button, Iconfont } from '@components'
import { _, systemStore } from '@stores'
import { stl } from '@utils'
import { obc } from '@utils/decorators'
import IconActions from '../../icon/actions'
import IconOnline from '../../icon/online'
import IconSearch from '../../icon/search'
import IconGame from '../../icon/game'
import IconSearchDisc from '../../icon/search-disc'
import { Ctx } from '../../types'
import { styles } from './styles'

function Extra(props, { $ }: Ctx) {
  const { focusOrigin, focusAction } = systemStore.setting
  if (!focusOrigin) return null

  // 设置的实现: [自定义跳转] 和 [若有自定义跳转隐藏通用源头按钮]
  const hasActions = !!$.actions.length
  let Component:
    | typeof IconOnline
    | typeof IconSearch
    | typeof IconGame
    | typeof IconSearchDisc
  let elOrigin: React.ReactNode
  if (!(focusAction && hasActions)) {
    if ($.type === '动画' || $.type === '三次元') {
      Component = IconOnline
    } else if ($.type === '书籍') {
      Component = IconSearch
    } else if ($.type === '游戏') {
      Component = IconGame
    } else if ($.type === '音乐') {
      Component = IconSearchDisc
    }
    if (Component)
      elOrigin = (
        <View style={styles.container}>
          <Component>
            <Flex style={stl(styles.extra, !hasActions && styles.extraLg)}>
              <Button
                style={styles.btn}
                type={_.select('ghostPlain', 'plain')}
                extra={<Iconfont name='md-airplay' size={17} />}
              />
            </Flex>
          </Component>
        </View>
      )
  }

  return (
    <>
      {elOrigin}
      {hasActions && (
        <View style={styles.container}>
          <IconActions>
            <Flex style={[styles.extra, !elOrigin && styles.extraLg]}>
              <Button
                style={styles.btn}
                type={_.select('ghostPlain', 'plain')}
                extra={<Iconfont name='md-read-more' size={25} />}
              />
            </Flex>
          </IconActions>
        </View>
      )}
    </>
  )
}

export default obc(Extra)

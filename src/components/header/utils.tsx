/*
 * @Author: czy0729
 * @Date: 2022-03-12 04:55:18
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-13 21:32:24
 */
import React, { useState, useCallback, useRef } from 'react'
import { View } from 'react-native'
import { _, systemStore } from '@stores'
import { s2t } from '@utils/thirdParty/cn-char'
import { IOS } from '@constants'
import Back from './back'
import { colors, backgroundColors } from './styles'
import { UpdateHeaderProps } from './types'

const HEADER_TRANSITION_HEIGHT = 32

export const updateHeader = ({
  // 必要
  navigation,
  title = '',
  headerTitleAlign,
  headerTitleStyle,
  headerLeft,
  headerRight,

  // 非必要
  mode,
  fixed = false,
  statusBarEventsType
}: UpdateHeaderProps) => {
  if (!navigation) return

  const _title = systemStore.setting.s2t ? s2t(title) : title
  const color = colors[statusBarEventsType]
    ? colors[statusBarEventsType](fixed)
    : undefined
  const backgroundColor = backgroundColors[statusBarEventsType]
    ? backgroundColors[statusBarEventsType](fixed)
    : undefined
  const _headerTitleStyle = [
    {
      fontSize: 15,
      fontWeight: 'normal'
    },
    IOS &&
      !!_title &&
      headerTitleAlign === 'left' && {
        marginLeft: -18
      },
    headerTitleStyle
  ]
  if (!IOS) _headerTitleStyle.push(_.fontStyle)

  const options = {
    /** ==================== header ==================== */
    headerShown: true,
    headerTransparent: false,
    headerShadowVisible: false,
    headerStyle: {
      height: undefined,
      paddingHorizontal: 0,
      backgroundColor: backgroundColor || (mode ? 'transparent' : _.colorPlain),
      borderBottomWidth: 0,
      shadowOpacity: 0,
      elevation: 0
    },

    /** ==================== headerBack ==================== */
    headerBackTitleVisible: false,
    headerLeftContainerStyle: {
      paddingLeft: 5
    },
    headerLeft: () => (
      <>
        <View
          style={{
            marginLeft: _.ios(0, -8)
          }}
        >
          <Back navigation={navigation} color={color} />
        </View>
        {headerLeft}
      </>
    ),

    /** ==================== headerTitle ==================== */
    headerTitle: mode ? '' : _title,
    headerTitleAlign: headerTitleAlign || (mode ? 'left' : 'center'),
    headerTitleStyle: _headerTitleStyle,
    headerTintColor: color || _.colorTitle,

    /** ==================== headerRight ==================== */
    headerRightContainerStyle: {},
    headerRight: undefined
  }

  if (headerRight) {
    options.headerRightContainerStyle = {
      paddingRight: 6
    }
    options.headerRight = headerRight
  }

  /**
   * @bug
   * 这个应该是 react-navigation@5 或者 react-screens 的内部问题
   * 部分 vivo 华为机型有非常诡异的 bug
   * headerTransparent 不能为 true, height 不能为 0, position 不能为 absolute, backgroundColor 不能为透明
   * 只要你试图用任何手段让 header 看不见, 就会触发当前页面背景色丢失, 看见前一个页面内容的 bug!
   * 现在通过一些 hack 手段, 自己模拟一个 HeaderComponent 去避免这个问题
   */
  if (mode) {
    options.headerStyle = {
      ...options.headerStyle,
      backgroundColor: '#000000'
    }

    /** @hack */
    if (!IOS) {
      options.headerShown = false
      options.headerStyle.height = 0.5 // 别问为什么留 0.5, 我也想知道, 不给他留一点就是会出现页面重叠问题
    } else {
      if (mode) options.headerTransparent = true
    }

    // headerLeft 和headerRight 因为上面的问题迁移到了 HeaderComponent 里面实现
    options.headerLeft = () => null
    options.headerRight = () => null
  }

  // platform fixed
  // 文字至少留一个 fontFamily, 不然可能会触发文字截断 bug
  options.headerTitleStyle = [
    ...options.headerTitleStyle,
    {
      fontFamily: _.fontFamily
    }
  ]

  navigation.setOptions(options)
}

export const useOnScroll = () => {
  const yRef = useRef(0)
  const [fixed, setFixed] = useState(false)
  const onScroll = useCallback(
    ({ nativeEvent }) => {
      const { y } = nativeEvent.contentOffset
      yRef.current = y

      const offset = HEADER_TRANSITION_HEIGHT
      if ((fixed && y > offset) || (!fixed && y <= offset)) return

      setTimeout(() => {
        setFixed(y > offset)
      }, 0)
    },
    [fixed]
  )

  return {
    yRef,
    fixed,
    onScroll
  }
}

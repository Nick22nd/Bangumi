/*
 * 动作面板
 * @Author: czy0729
 * @Date: 2021-12-25 03:23:18
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-07 17:49:56
 */
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Animated, View } from 'react-native'
import { useObserver } from 'mobx-react'
import { _ } from '@stores'
import { useBackHandler } from '@utils/hooks'
import { IOS } from '@constants'
import { Portal } from '../portal'
import { SafeAreaBottom } from '../safe-area-bottom'
import { ScrollView } from '../scroll-view'
import { Touchable } from '../touchable'
import { Flex } from '../flex'
import { Text } from '../text'
import { memoStyles } from './styles'
import { Props as ActionSheetProps } from './types'

export { ActionSheetProps }

export const ActionSheet = ({
  show = false,
  height = 440,
  title = '',
  onClose,
  children
}: ActionSheetProps) => {
  const y = useRef(new Animated.Value(0))
  const [_show, _setShow] = useState(show)

  const _onShow = useCallback(() => {
    _setShow(true)
    setTimeout(() => {
      Animated.timing(y.current, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true
      }).start()
    }, 0)
  }, [])
  const _onClose = useCallback(() => {
    if (_show) {
      onClose()
      Animated.timing(y.current, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true
      }).start()
      setTimeout(() => {
        _setShow(false)
      }, 240)
    }
  }, [_show, onClose])

  useEffect(() => {
    if (show) {
      _onShow()
      return
    }

    if (_show) {
      _onClose()
    }
  }, [_onClose, _onShow, _show, show])

  useBackHandler(() => {
    if (IOS || !_show) return false

    _onClose()
    return true
  })

  return useObserver(() => {
    if (!_show) return null

    const styles = memoStyles()
    const h = Math.min(height || _.window.height * 0.5, _.window.height * 0.88)
    return (
      <Portal>
        <View style={styles.actionSheet}>
          <Animated.View
            style={[
              styles.mask,
              {
                opacity: y.current
              }
            ]}
          />
          <Touchable style={styles.wrap} useRN ripple={false} onPress={onClose} />
          <Animated.View
            style={[
              styles.content,
              {
                height: h,
                transform: [
                  {
                    translateY: y.current.interpolate({
                      inputRange: [0, 1],
                      outputRange: [h, 0]
                    })
                  }
                ]
              }
            ]}
          >
            <ScrollView
              style={[
                styles.body,
                {
                  height
                }
              ]}
              contentContainerStyle={_.container.bottom}
            >
              {typeof title === 'string'
                ? !!title && (
                    <Text style={_.mb.sm} size={12} bold type='sub' align='center'>
                      {title}
                    </Text>
                  )
                : title}
              {children}
            </ScrollView>
            <Touchable style={styles.close} onPress={onClose}>
              <SafeAreaBottom type='paddingBottom'>
                <Flex style={styles.btn} justify='center'>
                  <Text size={15} bold type='sub'>
                    收起
                  </Text>
                </Flex>
              </SafeAreaBottom>
            </Touchable>
          </Animated.View>
        </View>
      </Portal>
    )
  })
}

/*
 * @Author: czy0729
 * @Date: 2019-05-07 19:45:59
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-05 05:09:50
 */
import { NativeModules, Alert, Clipboard, Vibration } from 'react-native'
import * as Haptics from 'expo-haptics'
import { DEV } from '@/config'
import Portal from '@ant-design/react-native/lib/portal'
import Toast from '@components/@/ant-design/toast'
import ActionSheet from '@components/@/ant-design/action-sheet'
import { STORYBOOK } from '@constants/device'
import { IOS } from '@constants/constants'
import { Fn } from '@types'
import { syncSystemStore, s2tAsync } from '../async'

/**
 * Loading 指示器
 * @param text 内容
 * @param time 指示器持续多少秒, 默认 0s
 * @param delay 延迟多少毫秒后显示, 默认 1000ms
 * @returns fn 取消函数
 */
export function loading(
  text: string = 'Loading...',
  time: number = 0,
  delay: number = 1000
) {
  let toastId: number
  let timerId: any = setTimeout(() => {
    timerId = null
    toastId = Toast.loading(s2tAsync(text), time, () => {
      if (toastId) Portal.remove(toastId)
    })
  }, delay)

  return () => {
    if (timerId !== null) clearTimeout(timerId)
    if (toastId) Portal.remove(toastId)
  }
}

/** 轻震动反馈 */
export function feedback(light?: boolean) {
  if (STORYBOOK) return

  const { vibration } = syncSystemStore().setting
  if (!vibration) return

  if (DEV) console.info('vibration')

  if (IOS) {
    if (light) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    }
  } else {
    Vibration.vibrate(light ? 2 : 4)
  }
}

/** 确定框 */
export function confirm(
  content: string,
  onPress = () => {},
  title = '警告',
  onCancelPress = () => {},
  confirmText: string = '确定',
  cancelText: string = '取消'
) {
  const params = [
    {
      text: s2tAsync(cancelText),
      style: 'cancel' as const,
      onPress: onCancelPress
    },
    {
      text: s2tAsync(confirmText),
      onPress
    }
  ]

  // iOS 有时候在 popover 里面询问, 会触发屏幕假死, 需要延迟一下让菜单消失了再执行
  if (IOS) {
    setTimeout(() => {
      Alert.alert(s2tAsync(title), s2tAsync(content), params)
    }, 80)
    return
  }

  Alert.alert(s2tAsync(title), s2tAsync(content), params)
  return
}

/** 提示 */
export function alert(content: string, title: string = '提示') {
  const params = [
    {
      text: s2tAsync('确定'),
      onPress: () => {}
    }
  ]

  // iOS 有时候在 popover 里面询问, 会触发屏幕假死, 需要延迟一下让菜单消失了再执行
  if (IOS) {
    return setTimeout(() => {
      Alert.alert(s2tAsync(title), s2tAsync(content), params)
    }, 80)
  }

  return Alert.alert(s2tAsync(title), s2tAsync(content), params)
}

/** 轻提示 */
export function info(
  content: string | number = '网络错误',
  duration: number = 2.4,
  onClose: Fn = () => {},
  mask: boolean = false
) {
  Toast.info(s2tAsync(content), duration, onClose, mask)
}

/**
 * @deprecated 显示 ActionSheet
 * https://rn.mobile.ant.design/components/action-sheet-cn/
 */
export function showActionSheet(
  options = [] as string[] | readonly string[],
  callback = (() => {}) as Fn,
  // @ts-expect-error
  { title, message, cancelButtonIndex, destructiveButtonIndex } = {}
) {
  ActionSheet.showActionSheetWithOptions(
    {
      title,
      message,
      options,
      cancelButtonIndex,
      destructiveButtonIndex
    },
    callback
  )
}

/** 显示 ImageViewer */
export function showImageViewer(
  imageUrls: {
    url?: any
    _url?: any
    headers?: object
  }[] = [],
  index: number = 0,
  mini: boolean = false
) {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) return

  syncSystemStore().showImageViewer(
    imageUrls.map(item => ({
      ...item,
      url:
        typeof item.url === 'string'
          ? item.url.replace('http://', 'https://')
          : item.url,
      _url:
        typeof item._url === 'string'
          ? item._url.replace('http://', 'https://')
          : item._url
    })),
    index,
    mini
  )
}

/**
 * @deprecated 调整键盘模式
 * https://github.com/zubricky/react-native-android-keyboard-adjust
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function androidKeyboardAdjust(fn: 'setAdjustPan' | 'setAdjustResize') {
  return
  // if (IOS || STORYBOOK) return
  // const AndroidKeyboardAdjust = require('react-native-android-keyboard-adjust')
  // AndroidKeyboardAdjust[fn]()
}

/** 安卓原生切换白天黑夜标志, 用于动态改变原生弹窗主题颜色 */
export function androidDayNightToggle(isDark?: boolean) {
  if (IOS || STORYBOOK) return

  NativeModules.DayNight.setDarkMode(isDark ? 2 : 1)
}

/** 复制到剪贴板 */
export function copy(val: any, message: boolean | string = true, ms?: number) {
  const string = String(val)
  Clipboard.setString(string)

  if (message === true) {
    info(`已复制 ${string}`, ms)
  } else if (typeof message === 'string') {
    info(message, ms)
  }

  feedback()
}

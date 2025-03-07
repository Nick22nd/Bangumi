/*
 * @Author: czy0729
 * @Date: 2019-03-30 19:25:19
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-24 12:11:10
 */
import React, { useEffect } from 'react'
import { LogBox } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Provider from '@ant-design/react-native/lib/provider'
import Stacks from '@src/navigations'
import { DeepLink, NavigationContainer, DEV } from '@components'
import { HoldMenuProvider } from '@components/@/react-native-hold-menu'
import { AppCommon } from '@_'
import { _ } from '@stores'
import { useCachedResources, useOrientation } from '@utils/hooks'
import theme from '@styles/theme'

LogBox.ignoreAllLogs(true)

export default function App() {
  // 加载图标等资源
  const isLoadingComplete = useCachedResources()

  // 获取水平状态, 只有平板允许横屏, 手机锁竖屏
  const orientation = useOrientation()
  useEffect(() => {
    _.toggleOrientation(orientation)
  }, [orientation])

  if (!isLoadingComplete) return null

  return (
    <SafeAreaProvider style={_.container.flex}>
      {/* @ts-expect-error */}
      <Provider theme={theme}>
        <HoldMenuProvider>
          <NavigationContainer>
            <Stacks />
          </NavigationContainer>
        </HoldMenuProvider>
        <DeepLink />
        <AppCommon />
      </Provider>
      <DEV />
    </SafeAreaProvider>
  )
}

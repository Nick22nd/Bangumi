/*
 * @Author: czy0729
 * @Date: 2019-03-30 19:25:19
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-03-10 05:07:06
 */
import '@utils/thirdParty/stable-sort'
import 'react-native-gesture-handler'
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Provider from '@ant-design/react-native/lib/provider'
import BottomTabNavigator from '@src/navigations/bottom-tab-navigator'
import { NavigationContainer, DeepLink, BackAndroid } from '@components'
import { AppCommon } from '@_'
import { _ } from '@stores'
import {
  useCachedResources,
  useKeepAwake,
  useOrientation,
  useErrorHandlerAndroid
} from '@utils/hooks'
import theme from '@styles/theme'

export default function App() {
  const isLoadingComplete = useCachedResources()
  useKeepAwake()
  useErrorHandlerAndroid()

  const orientation = useOrientation()
  useEffect(() => {
    _.toggleOrientation(orientation)
  }, [orientation])

  if (!isLoadingComplete) return null

  return (
    <SafeAreaProvider style={_.container.flex}>
      <Provider theme={theme}>
        <NavigationContainer>
          <BottomTabNavigator />
        </NavigationContainer>
        <DeepLink />
        <BackAndroid />
        <AppCommon />
      </Provider>
    </SafeAreaProvider>
  )
}

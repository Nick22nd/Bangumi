/*
 * @Author: czy0729
 * @Date: 2022-03-07 18:02:17
 * @Last Modified by: czy0729
 * @Last Modified time: 2022-03-10 04:54:28
 */
import React from 'react'
import { observer } from 'mobx-react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer as NContainer } from '@react-navigation/native'
import { _ } from '@stores'

export const NavigationContainer = observer(({ children }) => (
  <GestureHandlerRootView style={_.container.plain}>
    <NContainer>{children}</NContainer>
  </GestureHandlerRootView>
))

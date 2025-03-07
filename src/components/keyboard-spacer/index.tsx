/*
 * 弹出的键盘占位
 * @Doc https://github.com/Andr3wHur5t/react-native-keyboard-spacer/blob/master/KeyboardSpacer.js
 * @Author: czy0729
 * @Date: 2019-06-13 00:04:53
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-02 22:59:55
 */
import React, { Component } from 'react'
import { UIManager, Keyboard, LayoutAnimation, View, Dimensions } from 'react-native'
import { stl } from '@utils'
import { IOS } from '@constants'
import { styles } from './styles'
import { DEFAULT_ANIMATION } from './ds'
import { Props as KeyboardSpacerProps } from './types'

export { KeyboardSpacerProps }

// 注意如果要在 Android 上使用此动画，则需要在代码中启用
if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export const KeyboardSpacer = class KeyboardSpacerComponent extends Component<KeyboardSpacerProps> {
  static defaultProps = {
    topSpacing: 0,
    animate: true,
    onToggle: () => null
  }

  private _listeners = null

  state = {
    keyboardSpace: 0
  }

  componentDidMount() {
    const updateListener = IOS ? 'keyboardWillShow' : 'keyboardDidShow'
    const resetListener = IOS ? 'keyboardWillHide' : 'keyboardDidHide'
    this._listeners = [
      Keyboard.addListener(updateListener, this.updateKeyboardSpace),
      Keyboard.addListener(resetListener, this.resetKeyboardSpace)
    ]
  }

  componentWillUnmount() {
    this._listeners.forEach(listener => listener.remove())
  }

  updateKeyboardSpace = event => {
    if (!event.endCoordinates) return

    const { animate } = this.props
    if (animate) {
      let animationConfig: any = DEFAULT_ANIMATION
      if (IOS) {
        animationConfig = LayoutAnimation.create(
          event.duration,
          LayoutAnimation.Types[event.easing],
          LayoutAnimation.Properties.opacity
        )
      }
      LayoutAnimation.configureNext(animationConfig)
    }

    const screenHeight = Dimensions.get('window').height
    const value = screenHeight - event.endCoordinates.screenY + this.props.topSpacing
    this.setState(
      {
        keyboardSpace: value
      },
      this.props.onToggle(true, value)
    )
  }

  resetKeyboardSpace = event => {
    this.props.onToggle(false, 0)

    const { animate } = this.props
    if (animate) {
      let animationConfig: any = DEFAULT_ANIMATION
      if (IOS) {
        animationConfig = LayoutAnimation.create(
          event.duration,
          LayoutAnimation.Types[event.easing],
          LayoutAnimation.Properties.opacity
        )
      }
      LayoutAnimation.configureNext(animationConfig)
    }

    this.setState({
      keyboardSpace: 0
    })
  }

  render() {
    const { style } = this.props
    const { keyboardSpace } = this.state
    return (
      <View
        style={stl(
          styles.container,
          {
            height: keyboardSpace
          },
          style
        )}
        pointerEvents='none'
      />
    )
  }
}

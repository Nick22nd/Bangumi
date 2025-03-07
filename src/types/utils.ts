/*
 * 工具类
 *
 * @Author: czy0729
 * @Date: 2022-06-27 13:12:03
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-07-25 16:03:03
 */
import React from 'react'
import {
  StyleProp,
  ViewStyle as RNViewStyle,
  TextStyle as RNTextStyle,
  ImageStyle as RNImageStyle,
  ColorValue as RNColorValue,
  ImageProps
} from 'react-native'

/** <View> StyleProp */
export type ViewStyle = StyleProp<RNViewStyle>

/** <Text> StyleProp */
export type TextStyle = StyleProp<RNTextStyle>

/** <Image> StyleProp */
export type ImageStyle = StyleProp<RNImageStyle>

/** 格子布局分拆工具函数返回样式 */
export type GridStyle = {
  width: number
  height: number
  marginLeft: number
}

/** React.ReactNode */
export type ReactNode = React.ReactNode

/** RNColorValue */
export type ColorValue = RNColorValue

/** 图片 uri */
export type Source = ImageProps['source']

/**
 * 用于在 vscode 里面注释能直接显示展开的 type
 * https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type/57683652#57683652
 * */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

/** 用于在 vscode 里面注释能直接显示展开的扩展 type */
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T

/** 用于展平推到结果 */
export type Flatten<T> = {
  [K in keyof T]: T[K]
}

/** 复写 type */
export type Override<P, S> = Expand<Omit<P, keyof S> & S>

/** 深偏 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/** 取值 */
export type ValueOf<T> = T[keyof T]

/** 任意函数 */
export type Fn = (...args: any[]) => any

/** 选择函数 */
export type SelectFn = <T, K>(arg1: T, arg2: K) => T | K

/** React Component Interface */
export type IReactComponent<P = any> =
  | React.FunctionComponent<P>
  | React.ComponentClass<P>
  | React.ClassicComponentClass<P>

/** 取 Model 联合类型 */
export type ModelValueOf<
  T extends readonly any[],
  K extends string = 'value'
> = T[number][K]

/** 普通对象 */
export type AnyObject = Record<string, any>

/** 取数组项 */
export type InferArray<T> = T extends (infer S)[] ? S : never

/** 取函数第一个参数 */
export type FnParams<T extends Fn> = Parameters<T>[0]

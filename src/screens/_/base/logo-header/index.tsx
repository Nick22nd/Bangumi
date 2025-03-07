/*
 * 带 Logo 的头部
 * @Author: czy0729
 * @Date: 2022-03-15 19:46:20
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-07-25 16:49:09
 */
import React from 'react'
import { Flex } from '@components'
import { ob } from '@utils/decorators'
import { Logo } from '../logo'
import { styles } from './styles'
import { Props as LogoHeaderProps } from './types'

export { LogoHeaderProps }

export const LogoHeader = ob(({ left, right, path }: LogoHeaderProps) => {
  return (
    <Flex style={styles.header} justify='center'>
      <Flex style={styles.side}>{left}</Flex>
      <Flex style={styles.logo} justify='center'>
        <Logo path={path} />
      </Flex>
      <Flex style={styles.side} justify='end'>
        {right}
      </Flex>
    </Flex>
  )
})

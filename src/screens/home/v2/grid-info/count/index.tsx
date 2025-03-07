/*
 * @Author: czy0729
 * @Date: 2022-11-20 08:49:13
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-06-08 00:38:35
 */
import React from 'react'
import { Flex, Text } from '@components'
import { _ } from '@stores'
import { obc } from '@utils/decorators'
import { MODEL_SUBJECT_TYPE } from '@constants'
import { SubjectTypeCn } from '@types'
import { Ctx } from '../../types'
import BookNextBtn from '../book-next-btn'
import { styles } from './styles'

function Count({ subjectId, subject = {}, epStatus, tip }: any, { $ }: Ctx) {
  // global.rerender('Home.GridInfo.Count')

  const _subject = $.subject(subjectId)
  const label = MODEL_SUBJECT_TYPE.getTitle<SubjectTypeCn>(
    _subject?.type || subject?.type
  )
  if (label === '游戏') {
    return (
      <Text style={_.mt.xs} type='sub' size={12} lineHeight={13}>
        {tip}
      </Text>
    )
  }

  if (label === '书籍') {
    const { list = [] } = $.collection
    const { ep_status: epStatus, vol_status: volStatus } = list.find(
      item => item.subject_id === subjectId
    )
    return (
      <Flex style={styles.book} justify='end'>
        <Text type='primary' size={20}>
          <Text type='primary' size={12} lineHeight={20}>
            Chap.{' '}
          </Text>
          {epStatus}
        </Text>
        <BookNextBtn
          subjectId={subjectId}
          epStatus={epStatus + 1}
          volStatus={volStatus}
        />
        <Text style={_.ml.md} type='primary' size={20}>
          <Text type='primary' size={12} lineHeight={20}>
            Vol.{' '}
          </Text>
          {volStatus}
        </Text>
        <BookNextBtn
          subjectId={subjectId}
          epStatus={epStatus}
          volStatus={volStatus + 1}
        />
      </Flex>
    )
  }

  return (
    <Text type='primary' size={18}>
      {epStatus || 0}
      <Text type='sub' lineHeight={18}>
        {' '}
        / {$.countRight(subjectId)}
      </Text>
    </Text>
  )
}

export default obc(Count)

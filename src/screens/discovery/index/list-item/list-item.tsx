/*
 * @Author: czy0729
 * @Date: 2022-09-09 21:52:02
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-05-26 12:56:13
 */
import React from 'react'
import { HorizontalList } from '@components'
import { InView } from '@_'
import { _ } from '@stores'
import { findSubjectCn, getCoverLarge } from '@utils'
import { memo } from '@utils/decorators'
import { IMG_DEFAULT, MODEL_SUBJECT_TYPE } from '@constants'
import { SubjectTypeCn } from '@types'
import SectionTitle from '../section-title'
import CoverLg from '../cover-lg'
import CoverSm from '../cover-sm'
import CoverXs from '../cover-xs'
import { INITIAL_RENDER_NUMS_XS } from '../ds'
import { DEFAULT_PROPS } from './ds'

const INITIAL_RENDER_NUMS_SM = _.device(Math.floor(_.window.contentWidth / 140) + 1, 0)

const ITEM_HEIGHT = 800

export default memo(
  ({ styles, style, index, type, list, friendsChannel, friendsMap }) => {
    // global.rerender('Discovery.ListItem.Main')

    const title = MODEL_SUBJECT_TYPE.getTitle<SubjectTypeCn>(type)
    return (
      <InView y={_.window.height * 0.64 + index * ITEM_HEIGHT}>
        <SectionTitle title={title} type={type} />
        <CoverLg
          title={title}
          src={getCoverLarge(list[0].cover) || IMG_DEFAULT}
          cn={findSubjectCn(list[0].title, list[0].subjectId)}
          data={list[0]}
        />
        <HorizontalList
          style={style}
          contentContainerStyle={styles.contentContainerStyle}
          data={list.filter((item, index) => index > 0)}
          initialRenderNums={INITIAL_RENDER_NUMS_SM}
          renderItem={item => (
            <CoverSm
              key={item.subjectId}
              title={title}
              src={item.cover || IMG_DEFAULT}
              cn={findSubjectCn(item.title, item.subjectId)}
              data={item}
            />
          )}
        />
        {!!friendsChannel.length && (
          <HorizontalList
            contentContainerStyle={styles.contentContainerStyleSm}
            data={friendsChannel.filter(
              item => (item.cover as string) !== '/img/no_img.gif'
            )}
            initialRenderNums={INITIAL_RENDER_NUMS_XS}
            renderItem={item => (
              <CoverXs
                key={`${item.userId}|${item.id}`}
                title={title}
                avatar={friendsMap[item.userId]?.avatar}
                data={item}
              />
            )}
          />
        )}
      </InView>
    )
  },
  DEFAULT_PROPS
)

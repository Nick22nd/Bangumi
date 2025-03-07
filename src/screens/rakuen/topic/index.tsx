/*
 * @Author: czy0729
 * @Date: 2019-04-29 19:28:43
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-10 20:19:05
 */
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Page, Loading } from '@components'
import { useOnScroll } from '@components/header/utils'
import { ItemPost, TapListener } from '@_'
import { layoutHeightMap } from '@_/item/post/utils'
import { _, rakuenStore, uiStore } from '@stores'
import { info, androidKeyboardAdjust, feedback } from '@utils'
import { ic } from '@utils/decorators'
import {
  useIsFocused,
  useIsFocusedRef,
  useKeyboardAdjustResize,
  useObserver,
  useRunAfter
} from '@utils/hooks'
import { t } from '@utils/fetch'
import Header from './header'
import List from './list'
import TouchScroll from './touch-scroll'
import Heatmaps from './heatmaps'
import Bottom from './bottom'
import LikesUsers from './likes-users'
import Store from './store'
import { Ctx } from './types'

const PRE_RENDER_INDEX = 8

const PRE_OFFSET = _.window.height * 0.2

const Topic = (props, { $ }: Ctx) => {
  const isFocused = useIsFocused()
  const isFocusedRef = useIsFocusedRef()
  const { fixed, onScroll } = useOnScroll()
  const [rendered, setRendered] = useState(false)
  const forwardRef = useRef(null)
  const fixedTextareaRef = useRef(null)
  const scrollFailCount = useRef(0)

  /** 滚动到指定楼层 */
  const scrollTo = useCallback((index = 0) => {
    try {
      const { list } = $.comments
      info(list[index]?.floor, 0.8)

      forwardRef.current?.scrollToIndex({
        animated: false,
        index,
        viewOffset: 0
      })
    } catch (error) {
      console.error('topic/index.js', 'scrollTo', error)
    }
  }, [])

  /** 滚动回调 */
  const onScrollFn = useCallback(
    e => {
      $.onScroll(e)
      onScroll(e)
      uiStore.closePopableSubject()
      uiStore.closeLikesGrid()
    },
    [onScroll]
  )

  /** 滚动到指定楼层 (重复尝试) */
  const onScrollTo = useCallback((index = 0, animated = true, offset = 0) => {
    try {
      t('帖子.楼层跳转', {
        topicId: $.topicId,
        index
      })

      const { sliderAnimated } = rakuenStore.setting
      if (index === -1) {
        if (animated) info('#1', 0.8)

        forwardRef.current?.scrollToOffset({
          animated: sliderAnimated ? true : animated,
          offset: 0 - _.headerHeight
        })
        feedback(true)
        $.updateDirection(-1, '')
        return
      }

      const { list } = $.comments
      if (animated) info(list[index]?.floor, 0.8)

      forwardRef.current?.scrollToIndex({
        animated: sliderAnimated ? true : animated,
        index,
        viewOffset: 0 + _.headerHeight + offset
      })
      feedback(true)
    } catch (error) {
      console.error('topic/index.js', 'onScrollTo', error)

      // 使用了分页 PaginationList 的情况下, 只能先去到最底层
      try {
        const str = String(error)
        const maximum = str.match(/but maximum is (\d+)/)?.[1]
        if (maximum) {
          if (animated) info(`#${maximum}`, 0.5)
          forwardRef.current?.scrollToIndex({
            animated,
            index: Number(maximum),
            viewOffset: 0 + _.headerHeight
          })
        }
        // eslint-disable-next-line no-catch-shadow
      } catch (error) {}
    }
  }, [])

  /** 滚动失败后尝试使用保守的方法再次滚动 */
  const onScrollToIndexFailed = useCallback(
    ({ highestMeasuredFrameIndex, index }) => {
      try {
        scrollTo(highestMeasuredFrameIndex)

        setTimeout(() => {
          if (scrollFailCount.current >= 8) return
          scrollFailCount.current += 1
          scrollTo(index)
        }, 100)
      } catch (error) {
        console.error('topic/index.js', 'onScrollToIndexFailed', error)
      }
    },
    [scrollTo]
  )

  /** 提醒页面进入跳转到指定提醒楼层 */
  const onJumpTo = useCallback(() => {
    if (!$.postId) return

    const { list, _loaded } = $.comments
    if (_loaded) {
      try {
        let scrollIndex = 0
        list.forEach(
          (
            item: {
              id: any
              sub: {
                id: any
              }[]
            },
            index: number
          ) => {
            if (scrollIndex) return

            if (item.id === $.postId) {
              scrollIndex = index
            } else if (item.sub) {
              item.sub.forEach((i: { id: any }) => {
                if (i.id === $.postId) scrollIndex = index
              })
            }
          }
        )

        if (scrollIndex) {
          scrollTo(scrollIndex)
        }
      } catch (error) {
        console.error('topic/index.js', 'onJumpTo', error)
      }
    }
  }, [scrollTo])

  /** 楼层进度条点击 */
  const onPress = useCallback(
    (index = 0) => {
      try {
        onScrollTo(index)

        const directIndex = $.directItems.findIndex(
          item => item.floor === `#${index + 1}`
        )
        if (directIndex && directIndex !== -1) {
          $.updateDirection(directIndex)
        }
      } catch (error) {
        console.error('topic/index.js', 'onPress', error)
      }
    },
    [onScrollTo]
  )

  /** 导演模式, 按楼层回复顺序前进或者退后 */
  const onDirect = useCallback(
    (isNext: boolean = true, step: number = 1) => {
      try {
        const { length } = $.directItems
        if (!$.directItems.length) return

        const { directIndex } = $.state
        const nextDirectIndex = Math.min(
          length - 1,
          Math.max(0, directIndex + (isNext ? 1 : -1) * step)
        )
        if (
          (directIndex === 0 && nextDirectIndex === 0) ||
          (directIndex === -1 && nextDirectIndex === 0 && !isNext)
        ) {
          onScrollTo(-1, false)
          return
        }

        const item = $.directItems[nextDirectIndex]
        if (!item) return

        const { index, floor } = item
        let offset = PRE_OFFSET
        if (index.length === 1) {
          onScrollTo(index[0], false, offset)
          if (step > 1) info(floor, 0.8)
        } else {
          // 假如子楼层折叠中, 需要先展开
          const { subExpand } = rakuenStore.setting
          const needExpand = index[1] > Number(subExpand) - 1
          if (needExpand) $.onExpand(item.pid)

          setTimeout(() => {
            // 计算整个子楼层到此处的高度
            const { pid, sibling } = item
            offset += PRE_OFFSET
            offset -= layoutHeightMap.get(pid) || 0
            sibling.forEach(id => {
              offset -= layoutHeightMap.get(id) || 0
            })

            onScrollTo(index[0], false, offset)
            if (step > 1) info(floor, 0.8)
          }, 40)
        }
        $.updateDirection(nextDirectIndex, floor)
      } catch (error) {
        console.error('topic/index.js', 'onDirect', error)
      }
    },
    [onScrollTo]
  )

  const onShowFixedTextarea = useCallback(() => {
    try {
      fixedTextareaRef.current?.onFocus()
    } catch (error) {
      console.error('topic/index.js', 'onShowFixedTextarea', error)
    }
  }, [])

  const renderItem = useCallback(
    ({ item, index }) => {
      // 延迟渲染, 减少二次进入页面瞬间楼层过多导致动画掉帧, 进入页面瞬间最多只渲染2个楼层
      if (!$.postId) {
        if (!rendered) {
          // 渲染指示标记
          if (index === PRE_RENDER_INDEX) return <Loading style={_.mt.md} />
          if (index > PRE_RENDER_INDEX - 1) return null
        }
      }

      const EVENT = {
        id: '帖子.跳转',
        data: {
          topicId: $.topicId
        }
      } as const

      return (
        <ItemPost
          inViewY={_.window.height * 0.8}
          index={index}
          postId={$.postId}
          authorId={$.topic.userId}
          {...item}
          rendered={rendered}
          showFixedTextare={onShowFixedTextarea}
          event={EVENT}
        />
      )
    },

    [rendered]
  )

  useRunAfter(async () => {
    androidKeyboardAdjust('setAdjustResize')

    setTimeout(() => {
      if (isFocusedRef.current) setRendered(true)
    }, 400)

    await $.init()

    if ($.postId) onJumpTo()
  })

  useKeyboardAdjustResize()

  useEffect(() => {
    if (!isFocused) {
      uiStore.closePopableSubject()
      uiStore.closeLikesGrid()
    }
  }, [isFocused])

  return useObserver(() => {
    return (
      <>
        <TapListener>
          <Page>
            <List
              forwardRef={forwardRef}
              renderItem={renderItem}
              onScroll={onScrollFn}
              onScrollToIndexFailed={onScrollToIndexFailed}
            />
            <TouchScroll onPress={onPress} />
          </Page>
        </TapListener>
        <Header fixed={fixed} />
        <Bottom fixedTextareaRef={fixedTextareaRef} onDirect={onDirect} />
        <LikesUsers />
        <Heatmaps />
      </>
    )
  })
}

export default ic(Store, Topic)

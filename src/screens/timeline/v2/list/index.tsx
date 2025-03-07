/*
 * @Author: czy0729
 * @Date: 2019-04-14 00:51:13
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-11 21:03:58
 */
import React from 'react'
import { Loading, ListView } from '@components'
import { Login, SectionHeader } from '@_'
import { uiStore } from '@stores'
import { keyExtractor } from '@utils'
import { obc } from '@utils/decorators'
import { MODEL_TIMELINE_SCOPE, MODEL_TIMELINE_TYPE } from '@constants'
import { TimeLineScope, TimeLineScopeCn, TimeLineType } from '@types'
import Item from '../item'
import { TABS } from '../ds'
import { Ctx, TabLabel } from '../types'
import { styles } from './styles'

class List extends React.Component<{
  scope?: TimeLineScope
  title?: TabLabel
}> {
  state = {
    /**
     * @issue 列表的滚回顶部 scrollToLocation 不知道如何正确使用
     * 暂时使用重新渲染的办法解决列表变换置顶问题
     */
    hide: false
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.scope !== this.props.scope) {
      this.setState({
        hide: true
      })

      setTimeout(() => {
        this.setState({
          hide: false
        })
      }, 0)
    }
  }

  forwardRef = (ref: any) => {
    const { $ } = this.context as Ctx
    const { title } = this.props
    const index = TABS.findIndex(item => item.title === title)
    return $.forwardRef(ref, index)
  }

  onScroll = evt => {
    uiStore.closePopableSubject()

    const { $ } = this.context as Ctx
    $.onScroll(evt)
  }

  renderItem = ({ item, index }) => {
    const { scope, title } = this.props
    return <Item scope={scope} title={title} item={item} index={index} />
  }

  render() {
    const { $ } = this.context as Ctx
    const { scope, page, isFocused } = $.state
    const { title } = this.props
    const label = MODEL_TIMELINE_SCOPE.getLabel<TimeLineScopeCn>(scope)
    if (!$.isWebLogin && ['好友', '自己'].includes(label)) return <Login />

    const { hide } = this.state
    if (hide) return null

    const timeline = $.timeline(
      scope,
      MODEL_TIMELINE_TYPE.getValue<TimeLineType>(title)
    )
    if (!timeline._loaded) return <Loading />

    if (!$.showItem(title)) return null

    return (
      <ListView
        ref={this.forwardRef}
        contentContainerStyle={styles.contentContainerStyle}
        keyExtractor={keyExtractor}
        data={timeline}
        sectionKey='date'
        stickySectionHeadersEnabled={false}
        progressViewOffset={styles.contentContainerStyle.paddingTop}
        scrollToTop={isFocused && TABS[page].title === title}
        renderSectionHeader={renderSectionHeader}
        renderItem={this.renderItem}
        scrollEventThrottle={4}
        onScroll={this.onScroll}
        onHeaderRefresh={$.onHeaderRefresh}
        onFooterRefresh={$.fetchTimeline}
      />
    )
  }
}

export default obc(List)

function renderSectionHeader({ section: { title } }) {
  return <SectionHeader>{title}</SectionHeader>
}

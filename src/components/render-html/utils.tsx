/* eslint-disable max-len */
/*
 * @Author: czy0729
 * @Date: 2021-09-14 20:53:38
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-07-06 15:45:39
 */
import { _, systemStore, subjectStore, rakuenStore } from '@stores'
import { sleep, HTMLDecode } from '@utils'
import { acSearch, getSubStrings } from '@utils/ac-search'
import decoder from '@utils/thirdParty/html-entities-decoder'
import { s2t } from '@utils/thirdParty/cn-char'
import { DEV, IOS, PAD } from '@constants'

/** 平板设备字体固定放大字号 */
export const PAD_FONT_ZISE_INCREASE = PAD === 2 ? 3 : 2

/** 平板设备字体固定放大行高 */
export const PAD_LINE_HEIGHT_INCREASE = PAD === 2 ? 10 : 4

/** 标签匹配规则 */
export const REGS = {
  a: /<a (.+?)<\/a>/g,
  bgm: /\(bgm|\)/g,
  divQ: /<div class="quote"><q>/g,
  fixedQ: /<\/(.+?)\.\.\.<\/span>$/,
  img: /<img/g,
  imgBr: /<br><img/g,
  media:
    /<a href="(https|http):\/\/(bgm|bangumi)\.tv\/(subject|group\/topic|rakuen\/topic\/group|character|person)\/(.+?)" target="_blank" rel="nofollow external noopener noreferrer" class="l">(.+?)<\/a>/g,
  pre: /<pre>/g,
  preR: /<\/pre>/g,
  q: /<q>(.+?)<\/q>/g,
  quote: /<div class="quote"><q(.+?)<\/q><\/div>/g,
  ruby: /<ruby>(.+?)<\/ruby>/g,
  whiteTags:
    /<(?!\/?(div|a|p|span|h1|h2|h3|h4|h5|strong|em|small|hr|br|q|img|ol|ul|li))/g
} as const

/** 获取最后字体渲染字号大小 */
export function getIncreaseFontSize(fontSize: number) {
  if (!fontSize || !_.isPad) return fontSize
  return Number(fontSize) + PAD_FONT_ZISE_INCREASE
}

/** 获取最后字体渲染行高大小 */
export function getIncreaseLineHeight(lineHeight: number) {
  if (!lineHeight || !_.isPad) return lineHeight
  return Number(lineHeight) + PAD_LINE_HEIGHT_INCREASE
}

/** 获取最后字体渲染基本样式 */
export function fixedBaseFontStyle(baseFontStyle = {}) {
  if (!_.isPad) return baseFontStyle

  const _baseFontStyle: {
    fontSize?: number
    lineHeight?: number
  } = {
    ...baseFontStyle
  }
  if (_baseFontStyle.fontSize) _baseFontStyle.fontSize += PAD_FONT_ZISE_INCREASE
  if (_baseFontStyle.lineHeight) {
    _baseFontStyle.lineHeight += PAD_LINE_HEIGHT_INCREASE
  }

  return _baseFontStyle
}

/** 给纯文字包上 span, 否则安卓不能自由复制 */
// function wrapSpanToRawText(html: string) {
//   html = `<div>${html}</div>`
//   const match = html.match(/>[^<>]+?</g)
//   if (match) {
//     match.forEach((item: string) => (html = html.replace(item, `><span${item}/span><`)))
//   }
//   return html
// }

/** 去除 q 里面的图片 (非常特殊的情况, 无法预测, 安卓 Text 里面不能包含其他元素) */
function removeQuote(html: string) {
  if (!IOS && html.includes('<q>')) {
    html = html.replace(REGS.q, (match, q) => {
      let _q = q.replace(REGS.img, ' img')

      // 暂时没办法处理像 </smal... 结尾这样的情况
      // 因为之前的错误全局 HTMLDecode, 没办法再处理
      if (REGS.fixedQ.test(_q)) {
        const { index } = _q.match(REGS.fixedQ)
        _q = _q.slice(0, index)
      }

      return `<q>${_q}</span></q>`
    })
  }
  return html
}

/** 安卓识别 pre 目前报错, 暂时屏蔽此标签 */
function removePre(html: string) {
  if (!IOS && html.includes('<pre>')) {
    html = html.replace(REGS.pre, '<div>').replace(REGS.preR, '</div>')
  }
  return html
}

/** 缩小引用的字号 */
function smallQuote(html: string) {
  if (REGS.divQ.test(html)) {
    html = html.replace(
      REGS.divQ,
      `<div class="quote"><q style="font-size: ${getIncreaseFontSize(
        12
      )}px; line-height: ${getIncreaseLineHeight(16)}px">`
    )
  }
  return html
}

/** 去除图片之间的 br */
function removeBrBetweenImages(html: string) {
  return html.replace(REGS.imgBr, '<img')
}

/** 去除暂时无法支持的 html */
function removeSomeTags(html: string) {
  return html.replace(REGS.ruby, '')
}

/** 简转繁 */
function htmlS2T(html: string) {
  const { s2t: _s2t } = systemStore.setting
  if (_s2t) html = s2t(decoder(html))
  return html
}

/** 转义 bug, 因一开始错误把整体转义过一次, 导致只能手动把左边的非合法标签 '<' 转义规避报错 */
function fixedWhiteTags(html: string) {
  return html.replace(REGS.whiteTags, '&lt;')
}

/** 强制修改 html 以能被组件正常渲染 */
export function hackFixedHTMLTags(html: string) {
  let _html = HTMLDecode(html)
  _html = removeQuote(_html)
  _html = removePre(_html)
  _html = smallQuote(_html)
  _html = removeBrBetweenImages(_html)
  _html = removeSomeTags(_html)
  _html = htmlS2T(_html)
  return fixedWhiteTags(_html)
}

/** 去除 html 标签、空行、换行 */
function removeHTMLTag(str: string) {
  return str.replace(/(<([^>]+)>)/gi, '').replace(/^\s*[\r\n]/gm, '')
}

/** 匹配 bgm 部分页面链接, 把这些链接变成 Media 块, 与行内文字独立 */
export function hackMatchMediaLink(html: string) {
  const { matchLink, acSearch: acSearchSetting } = rakuenStore.setting

  let _html = html
  let flag: boolean

  if (matchLink) {
    _html = html.replace(REGS.media, match => {
      // App 推广语不做单独块处理
      if (
        match.includes(
          '<a href="https://bgm.tv/group/topic/350677" target="_blank" rel="nofollow external noopener noreferrer" class="l"><'
        )
      ) {
        return match
      }

      flag = true
      return `<div>${match}</div>`
    })
  }

  // 防止两个连续的 Media 块中间产生大间隔
  if (flag) {
    return _html.replace(/<\/div><br><div>/g, '</div><div>')
  }

  // [实验性] 文字猜测条目并替换成链接
  if (acSearchSetting) {
    const htmlNoTags = _html.replace(REGS.quote, '').replace(REGS.a, '')

    const acData = acSearch(removeHTMLTag(htmlNoTags))
    if (Array.isArray(acData) && acData.length) {
      const substrings = getSubStrings()
      acData.forEach((item, index) => {
        _html = _html.replace(item, `##${index}##`)
      })
      acData.forEach((item, index) => {
        _html = _html.replace(
          `##${index}##`,
          `<a href="https://App/Subject/subjectId:${substrings[item]}">${item}</a>`
        )
      })
    }
  }

  return _html
}

/** 存放等待发起获取媒体信息的 id */
const IDS = []

/** 已获取过媒体信息的 id */
const LOADED_IDS = []

/** 是否获取中 */
let loading = false

/** 列队请求媒体信息 */
export async function fetchMediaQueue(
  type?: string,
  id?: unknown,
  onLoaded?: (result?: boolean) => void
) {
  if (type && id) {
    if (
      IDS.length <= 16 &&
      ![...IDS, ...LOADED_IDS].find(item => item.type === type && item.id === id)
    ) {
      IDS.push({
        type,
        id
      })
    }
  }

  if (!IDS.length) return

  if (!loading) {
    const item = IDS.shift()
    LOADED_IDS.push(item)

    try {
      if (DEV) console.info('fetchMediaQueue', IDS, item)

      loading = true
      if (item.type === 'subject') {
        const result = await subjectStore.fetchSubjectSnapshot(item.id)
        onLoaded(result)
      } else if (item.type === 'topic') {
        const result = await rakuenStore.fetchTopicSnapshot(item.id)
        onLoaded(result)
      } else if (item.type === 'mono') {
        await subjectStore.fetchMono({
          monoId: item.id
        })
      }

      await sleep()
      loading = false

      fetchMediaQueue()
    } catch (error) {
      loading = false
    }
  }
}

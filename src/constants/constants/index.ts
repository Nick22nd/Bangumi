/*
 * @Author: czy0729
 * @Date: 2022-05-26 13:27:30
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-07 22:38:18
 */
import { Platform } from 'react-native'
import PropTypes from 'prop-types'
import * as Device from 'expo-device'
import { PAD, RATIO, STORYBOOK, STORYBOOK_IFRAME } from '../device'

/** 设备名字 */
export const DEVICE_MODEL_NAME = Device.modelName

/** 方向垂直 */
export const ORIENTATION_PORTRAIT = 'PORTRAIT'

/** 方向水平 */
export const ORIENTATION_LANDSCAPE = 'LANDSCAPE'

const expoPackageJson = require('@/node_modules/expo/package.json')
const appJson = require('@/app.json')

/** @deprecated [已废弃] 打包 apk 和 bangumi-ios-test 线上 expo 使用35, 打包 ipa 提审需至少使用37 */
export const SDK = parseInt(expoPackageJson.version.split('.')[0])

/** Expo 线上预览唯一标识 */
export const BUNDLE_IDENTIFIER = appJson?.expo?.name as string

/** 版本号 */
export const VERSION_GITHUB_RELEASE = appJson?.expo?.version as string

/** 小圣杯助手版本 */
export const VERSION_TINYGRAIL_PLUGIN =
  appJson.expo.description.split('tinygrail plugin ')[1]

/** Google Play 版本 */
export const VERSION_GOOGLE = appJson.expo.description.includes('google play')

/** 域 */
export const HOST_NAME = 'bgm.tv'

/** 域名 */
export const HOST = `https://${HOST_NAME}` as const

/** 备用域名2 */
export const HOST_2 = 'https://bangumi.tv'

/** 备用域名3 */
export const HOST_3 = 'https://chii.in'

/** jsDelivr */
export const HOST_CDN = 'https://cdn.jsdelivr.net'

/** @deprecated 柠萌瞬间地址 */
export const HOST_NING_MOE = 'https://www.ningmoe.com'

/** @deprecated Anitama api 地址 */
export const HOST_ANITAMA = 'https://app.anitama.net'

/** @deprecated 动漫之家 */
export const HOST_DMZJ = 'https://m.news.dmzj.com'

/** @deprecated HD 漫画 */
export const HOST_MANGA = 'https://tinygrail.mange.cn/app'

/** 免费图床 */
export const HOST_IMAGE_UPLOAD = 'https://p.sda1.dev'

/** [待废弃] 登录 v1.0 oauth 地址 */
export const URL_OAUTH = `${HOST}/oauth/authorize` as const

/** [待废弃] 登录 v1.0 授权跳转地址 */
export const URL_OAUTH_REDIRECT = `${HOST}/dev/app` as const

/** bgm项目帖子地址 */
export const URL_FEEDBACK = `${HOST}/group/topic/350677` as const

/** 空头像地址 */
export const URL_DEFAULT_AVATAR = '/icon.jpg'

/** 空角色地址 */
export const URL_DEFAULT_MONO = '/info_only.png'

/** 指南 (语雀) */
export const URL_ZHINAN = 'https://www.yuque.com/chenzhenyu-k0epm/znygb4'

/** 关于 */
export const URL_ABOUT = `${URL_ZHINAN}/bw81ax?singleDoc` as const

/** 获取 */
export const URL_RELEASE = `${URL_ZHINAN}/ratl2b?singleDoc` as const

/** 隐私条款 */
export const URL_PRIVACY = `${URL_ZHINAN}/oi3ss2?singleDoc` as const

/** 开发状况 */
export const URL_DEV =
  'https://adaptable-playroom-795.notion.site/2f26b642dc714c4ca4d3e8701072c591?v=fe42d34dbb354e28b5221078780f93bd'

/** 开发问卷 */
export const URL_WENJUAN = 'https://wj.qq.com/s2/9645600/92c2/'

/** APP 网页版 */
export const URL_SPA = 'https://bangumi-app.5t5.top'

/** App ID https://bgm.tv/dev/app */
export const APP_ID = 'bgm8885c4d524cd61fc'

/** App Secret */
export const APP_SECRET = '1da52e7834bbb73cca90302f9ddbc8dd'

/**
 * 功能留言板入口
 * - [2020] 19945783
 * - [2021] 23045125,25475042
 * - [2022] 27168016,29260639,29987675,31072870
 * - [2023] 32279369,33457566,35103537,35103537
 * */
export const APP_ID_SAY_DEVELOP = '36237364'

/** 小圣杯意见反馈入口 */
export const APP_ID_SAY_TINYGRAIL = '19820034'

/** APP 游客用户 id
 * - [476179] 6907***59@qq.com
 * - [474489] 2963***10@qq.com
 * - [542389] say***02@163.com
 * - [700939]
 * */
export const APP_USERID_TOURIST = 700939

/** APP 审核用户id */
export const APP_USERID_IOS_AUTH = 700939

/** 网页端分享模式 (限制操作) */
export const SHARE_MODE = STORYBOOK && !STORYBOOK_IFRAME

/** 是否 iOS */
export const IOS = Platform.OS === 'ios'

/** 约定 User-Agent https://bangumi.github.io/api */
export const UA = `czy0729/Bangumi/${VERSION_GITHUB_RELEASE} (${
  IOS ? 'iOS' : 'Android'
})` as const

/** 是否安卓 10 之前 */
export const IS_BEFORE_ANDROID_10 = !IOS && Number(Platform.Version) < 29

/** @deprecated Bangumi 字眼在 App 内的显示 */
export const TITLE = IOS ? 'bgm.tv' : 'Bangumi'

/** 高级会员不限制达到金额 */
export const ADVANCE_CDN = 10

/** 小圣杯 App ID */
export const TINYGRAIL_APP_ID = 'bgm2525b0e4c7d93fec'

/** 小圣杯授权跳转地址 */
export const TINYGRAIL_URL_OAUTH_REDIRECT = 'https://tinygrail.com/api/account/callback'

/** 小圣杯更新内容帖子 */
export const TINYGRAIL_UPDATES_LOGS_URL = `${HOST}/group/topic/354698`

/** 项目地址 */
export const GITHUB_PROJECT = 'https://github.com/czy0729/Bangumi'

/** 项目 gh-pages */
export const GITHUB_PROJECT_GH = 'https://czy0729.github.io/Bangumi'

/** 项目发版内容地址 */
export const GITHUB_RELEASE = `${GITHUB_PROJECT}/releases`

/** 检测发版版本地址 */
export const GITHUB_RELEASE_REPOS =
  'https://api.github.com/repos/czy0729/Bangumi/releases'

export const GITHUB_HOST = 'https://gitee.com/a296377710/bangumi-pro'

/** 热数据地址 */
export const GITHUB_DATA = 'https://gitee.com/a296377710/bangumi/raw/master/data.json'

/** 高级会员地址 */
export const GITHUB_ADVANCE = `${GITHUB_HOST}/raw/master/advance.json`

/** 占位底图 */
export const IMG_EMPTY = {
  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQAQMAAAC6caSPAAAAA1BMVEX///+nxBvIAAAAKklEQVR42u3BgQAAAADDoPtTH2AK1QAAAAAAAAAAAAAAAAAAAAAAAACAOE+wAAFrRnPdAAAAAElFTkSuQmCC'
} as const

/** 占位底图 (黑) */
export const IMG_EMPTY_DARK = {
  uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQAQMAAAC6caSPAAAAA1BMVEU+PkC+lq+tAAAAKklEQVR42u3BgQAAAADDoPtTH2AK1QAAAAAAAAAAAAAAAAAAAAAAAACAOE+wAAFrRnPdAAAAAElFTkSuQmCC'
} as const

/** 空头像 */
export const IMG_DEFAULT_AVATAR = '//lain.bgm.tv/pic/user/s/icon.jpg'

export const DOGE_CDN_IMG_DEFAULT =
  'https://s-sh-4501-bangumi-cdn.oss.dogecdn.com/assets/default.png'

/** 默认图 */
export const IMG_DEFAULT = STORYBOOK
  ? DOGE_CDN_IMG_DEFAULT
  : require('@assets/images/default.png')

/** 默认头像 */
export const AVATAR_DEFAULT = STORYBOOK
  ? 'https://lain.bgm.tv/pic/user/l/icon.jpg'
  : require('@assets/images/l.png')

const h = (w: any) => parseInt(String(w * 1.4))

/** 头像大小 */
export const IMG_AVATAR_WIDTH = 32

/** 封面宽度 */
export const IMG_WIDTH = parseInt(String(RATIO * 82))

/** 封面高度 */
export const IMG_HEIGHT = h(IMG_WIDTH)

/** 封面宽度 (小) */
export const IMG_WIDTH_SM = parseInt(String(RATIO * 72))

/** 封面高度 (小) */
export const IMG_HEIGHT_SM = h(IMG_WIDTH_SM)

/** 封面宽度 (大) */
export const IMG_WIDTH_LG = parseInt(String(IMG_WIDTH * 1.34))

/** 封面高度 (大) */
export const IMG_HEIGHT_LG = h(IMG_WIDTH_LG)

/** GMT+0800 的偏移量 */
export const TIMEZONE_OFFSET_GMT8 = -480

/** 本地时区的偏移量 */
export const TIMEZONE_OFFSET_LOCAL = new Date().getTimezoneOffset()

/** 本地时区是否 GMT+0800 */
export const TIMEZONE_IS_GMT8 = TIMEZONE_OFFSET_LOCAL === TIMEZONE_OFFSET_GMT8

/** App 列表数据结构 */
export const LIST_EMPTY = {
  list: [],
  pagination: {
    page: 0,
    pageTotal: 0
  },

  /** 用于某些方法制造分页效果 */
  _list: [],
  _loaded: false as boolean | number
}

/** 用于制造分页数据 */
export const LIMIT_LIST = 100

/** 用于制造分页数据 (评论) */
export const LIMIT_LIST_COMMENTS = 24

/** 对评论数多的帖子进行网页跳转 */
export const LIMIT_TOPIC_PUSH = 500

/** 部分首屏渲染任务非常重的页面设置的初始最大项显示值 */
export const LIMIT_HEAVY_RENDER = 10

/** App 事件埋点数据结构 */
export const EVENT = {
  id: '',
  data: {}
} as const

/** 时间数组 */
export const DATA_AIRTIME = [
  '全部',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
  '2014',
  '2013',
  '2012',
  '2011',
  '2010',
  '2009',
  '2008',
  '2007',
  '2006',
  '2005',
  '2004',
  '2003',
  '2002',
  '2001',
  '2000',
  '1999',
  '1998',
  '1997',
  '1996',
  '1995',
  '1994',
  '1993',
  '1992',
  '1991',
  '1990',
  '1989',
  '1988',
  '1987',
  '1986',
  '1985',
  '1984',
  '1983',
  '1982',
  '1981',
  '1980'
] as const

/** 月份数组 */
export const DATA_MONTH = [
  '全部',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12'
] as const

/** 索引年数组 */
export const DATA_BROWSER_AIRTIME = [
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
  '2014',
  '2013',
  '2012',
  '2011',
  '2010',
  '2009',
  '2008',
  '2007',
  '2006',
  '2005',
  '2004',
  '2003',
  '2002',
  '2001',
  '2000',
  '1999',
  '1998',
  '1997',
  '1996',
  '1995',
  '1994',
  '1993',
  '1992',
  '1991',
  '1990',
  '1989',
  '1988',
  '1987',
  '1986',
  '1985',
  '1984',
  '1983',
  '1982',
  '1981',
  '1980',
  '1979',
  '1978',
  '1977',
  '1976',
  '1975',
  '1974',
  '1973',
  '1972',
  '1971',
  '1970',
  '1969',
  '1968',
  '1967',
  '1966',
  '1965',
  '1964',
  '1963',
  '1962',
  '1961',
  '1960',
  '1959',
  '1958',
  '1957',
  '1956',
  '1955',
  '1954',
  '1953',
  '1952',
  '1951',
  '1950',
  '1949'
] as const

/** 索引时间月数组 */
export const DATA_BROWSER_MONTH = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12'
] as const

/** 字母表数组 */
export const DATA_ALPHABET = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
] as const

/** 1 亿 */
export const B = 100000000

/** 1 万 */
export const M = 10000

/** 允许显示的源头 */
export const SITES = ['bilibili', 'qq', 'iqiyi', 'acfun', 'youku'] as const

/** 所有源头 */
export const SITES_DS = [
  'acfun',
  'bilibili',
  'sohu',
  'youku',
  'qq',
  'iqiyi',
  'letv',
  'pptv',
  'mgtv',
  'nicovideo',
  'netflix'
] as const

/** @deprecated 制造 [已收藏] 前面的占位 */
export const COLLECTION_INDENT = PAD ? '　　    ' : '　　   '

/** 页面通用 context */
export const contextTypes = {
  $: PropTypes.object,
  navigation: PropTypes.object,
  route: PropTypes.object
} as const

/** 抹平 ScrollView 跨平台不同表现参数 */
export const SCROLL_VIEW_RESET_PROPS = {
  alwaysBounceHorizontal: false,
  alwaysBounceVertical: false,
  overScrollMode: 'never',
  showsHorizontalScrollIndicator: false,
  showsVerticalScrollIndicator: false
} as const

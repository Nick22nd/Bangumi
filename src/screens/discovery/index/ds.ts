/*
 * @Author: czy0729
 * @Date: 2021-07-16 14:21:27
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-06-13 19:06:31
 */
import { _ } from '@stores'
import { getTimestamp } from '@utils'
import { IOS, STORYBOOK, SUBJECT_TYPE } from '@constants'
import { MenuItemType } from './types'

export const NAMESPACE = 'ScreenDiscovery'

export const EXCLUDE_STATE = {
  /** 可视范围底部 y */
  visibleBottom: _.window.height,
  home: {
    list: SUBJECT_TYPE.map(item => ({
      type: item.label
    })),
    pagination: {
      page: 1,
      pageTotal: 1
    },
    _loaded: getTimestamp()
  },
  visible: false,

  /** 菜单编辑中 */
  dragging: false,
  expand: false,
  link: ''
}

export const STATE = {
  showBlockTrain: true,
  ...EXCLUDE_STATE,
  _loaded: true
}

export const INITIAL_RENDER_NUMS_XS = _.device(
  Math.floor(_.window.contentWidth / 80) + 1,
  0
)

export const MENU_MAP = {
  Rank: {
    key: 'Rank',
    name: '排行榜',
    icon: 'md-equalizer'
  },
  Anime: {
    key: 'Anime',
    name: '找条目',
    icon: 'md-live-tv',
    size: 21
  },
  Browser: {
    key: 'Browser',
    name: '索引',
    icon: 'md-data-usage'
  },
  Catalog: {
    key: 'Catalog',
    name: '目录',
    icon: 'md-folder-open'
  },
  Calendar: {
    key: 'Calendar',
    name: '每日放送',
    icon: 'md-calendar-today',
    size: 20
  },
  DiscoveryBlog: {
    key: 'DiscoveryBlog',
    name: '日志',
    icon: 'md-edit',
    size: 21
  },
  Tags: {
    key: 'Tags',
    name: '标签',
    icon: 'md-bookmark-outline'
  },
  Open: {
    key: 'Open',
    name: '自定义',
    icon: 'md-more-horiz'
  },
  Staff: {
    key: 'Staff',
    name: '新番',
    icon: 'md-local-play'
  },
  Search: {
    key: 'Search',
    name: '搜索',
    icon: 'md-search'
  },
  Tinygrail: {
    key: 'Tinygrail',
    name: '小圣杯',
    icon: 'trophy',
    size: 20,
    web: false
  },
  Like: {
    key: 'Like',
    name: '猜你喜欢',
    icon: 'md-looks'
  },
  Recommend: {
    key: 'Recommend',
    name: '推荐',
    icon: 'md-favorite-outline'
  },
  Dollars: {
    key: 'Dollars',
    name: 'Dollars',
    text: 'D',
    size: 20
  },
  Wiki: {
    key: 'Wiki',
    name: '维基人',
    text: 'wiki',
    size: 14
  },
  Yearbook: {
    key: 'Yearbook',
    name: '年鉴',
    icon: 'md-whatshot'
  },
  UserTimeline: {
    key: 'UserTimeline',
    name: '时间线',
    icon: 'md-timeline',
    login: true,
    web: false
  },
  Netabare: {
    key: 'Netabare',
    name: 'netaba.re',
    text: 'N',
    size: 18,
    web: false
  },
  Anitama: {
    key: 'Anitama',
    name: '资讯',
    icon: 'md-text-format',
    size: 26,
    web: false
  },
  Smb: {
    key: 'Smb',
    name: '本地管理',
    text: 'SMB',
    size: 14,
    ios: false,
    web: false
  },
  DoubanSync: {
    key: 'DoubanSync',
    name: '豆瓣同步',
    text: '豆',
    size: 18,
    web: false
  },
  BilibiliSync: {
    key: 'BilibiliSync',
    name: 'bilibili 同步',
    text: 'B',
    size: 20,
    web: false
  },
  Backup: {
    key: 'Backup',
    name: '本地备份',
    text: 'CSV',
    size: 14,
    web: false
  },
  Series: {
    key: 'Series',
    name: '关联系列',
    icon: 'md-workspaces-outline',
    login: true,
    web: false
  },
  Character: {
    key: 'Character',
    name: '我的人物',
    icon: 'md-folder-shared',
    login: true,
    web: false
  },
  Catalogs: {
    key: 'Catalogs',
    name: '我的目录',
    icon: 'md-folder-special',
    login: true,
    web: false
  },
  Link: {
    key: 'Link',
    name: '剪贴板',
    icon: 'md-link',
    web: false
  }
} as const

export type MenuMapType = keyof typeof MENU_MAP

export const MENU_MAP_STORYBOOK = {
  Rakuen: {
    key: 'Rakuen',
    name: '超展开',
    size: 20,
    icon: 'md-chat-bubble-outline'
  },
  Timeline: {
    key: 'Timeline',
    name: '时间胶囊',
    icon: 'md-access-time'
  },
  Setting: {
    key: 'Setting',
    name: '设置',
    icon: 'setting'
  }
}

/** 根据设置自定义菜单构造菜单数据 */
export function getMenus(discoveryMenu: MenuMapType[] = []): MenuItemType[] {
  if (!discoveryMenu.length) return []

  let menuMap = { ...MENU_MAP }
  if (STORYBOOK) {
    menuMap = {
      ...menuMap,
      ...MENU_MAP_STORYBOOK
    }
    delete menuMap.Dollars
  }

  // 若 discoveryMenu 的 key 不存在在 defaultMenu 里, 需要过滤
  let menus = []
  discoveryMenu.forEach(key => {
    if (menuMap[key]) {
      menus.push(menuMap[key])
      delete menuMap[key]
    }
  })

  // 若有新菜单, 在 key=Open 前插入
  const newMenuKeys = Object.keys(menuMap)
  if (newMenuKeys.length) {
    const openIndex = menus.findIndex(item => item.key === 'Open')
    const newMenus = newMenuKeys.map(item => menuMap[item])
    menus = [
      ...menus.slice(0, openIndex),
      ...newMenus,
      ...menus.slice(openIndex, menus.length)
    ]
  }

  if (STORYBOOK) return menus.filter(item => item.web !== false)

  if (IOS) return menus.filter(item => item.ios !== false)

  return menus
}

export const linearColor = [
  'rgba(0, 0, 0, 0)',
  'rgba(0, 0, 0, 0.56)',
  'rgba(0, 0, 0, 0.8)'
] as const

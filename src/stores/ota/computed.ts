/*
 * @Author: czy0729
 * @Date: 2023-04-26 14:47:25
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-26 14:51:38
 */
import { computed } from 'mobx'
import { pick as advPick } from '@utils/subject/adv'
import { pick as animePick } from '@utils/subject/anime'
import { pick as gamePick } from '@utils/subject/game'
import { pick as hentaiPick } from '@utils/subject/hentai'
import { pick as mangaPick } from '@utils/subject/manga'
import { pick as wenkuPick } from '@utils/subject/wenku'
import { StoreConstructor, SubjectId } from '@types'
import State from './state'
import { STATE } from './init'
import { ADVItem, AnimeItem, GameItem, HentaiItem, MangaItem, WenkuItem } from './types'

export default class Computed extends State implements StoreConstructor<typeof STATE> {
  animeSubjectId(pickIndex: number): SubjectId {
    return computed(() => {
      const item = animePick(pickIndex)
      return item?.i || 0
    }).get()
  }

  anime(subjectId: SubjectId) {
    this.init('anime')
    return computed<AnimeItem>(() => {
      return this.state.anime[`age_${subjectId}`] || {}
    }).get()
  }

  mangaSubjectId(pickIndex: number): SubjectId {
    return computed(() => {
      const item = mangaPick(pickIndex)
      return item?.i || 0
    }).get()
  }

  manga(subjectId: SubjectId) {
    this.init('manga')
    return computed<MangaItem>(() => {
      return this.state.manga[`mox_${subjectId}`] || {}
    }).get()
  }

  gameSubjectId(pickIndex: number): SubjectId {
    return computed(() => {
      const item = gamePick(pickIndex)
      return item?.i || 0
    }).get()
  }

  advSubjectId(pickIndex: number): SubjectId {
    return computed(() => {
      const item = advPick(pickIndex)
      return item?.i || 0
    }).get()
  }

  game(subjectId: SubjectId) {
    this.init('game')
    return computed<GameItem | ADVItem>(() => {
      return this.state.game[`game_${subjectId}`] || {}
    }).get()
  }

  wenkuSubjectId(pickIndex: number): SubjectId {
    return computed(() => {
      const item = wenkuPick(pickIndex)
      return item?.i || 0
    }).get()
  }

  wenku(subjectId: SubjectId) {
    this.init('wenku')
    return computed<WenkuItem>(() => {
      return this.state.wenku[`wk8_${subjectId}`] || {}
    }).get()
  }

  hentaiSubjectId(pickIndex: number): SubjectId {
    return computed(() => {
      const item = hentaiPick(pickIndex)
      return item?.id || 0
    }).get()
  }

  hentai(subjectId: SubjectId) {
    this.init('hentai')
    return computed<HentaiItem>(() => {
      return this.state.hentai[`hentai_${subjectId}`] || {}
    }).get()
  }
}

/*
 * @Author: czy0729
 * @Date: 2023-04-24 02:59:49
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-04-24 03:18:45
 */
import { computed } from 'mobx'
import { LIST_EMPTY } from '@constants'
import {
  CollectActions,
  CollectionStatus,
  CollectionStatusCn,
  StoreConstructor,
  SubjectId,
  SubjectType,
  SubjectTypeCn,
  UserId
} from '@types'
import userStore from '../user'
import State from './state'
import { DEFAULT_USERS_SUBJECT_COLLECTION, STATE } from './init'
import {
  Collection,
  MosaicTile,
  UserCollections,
  UserCollectionsMap,
  UserCollectionsTags,
  UsersSubjectCollection
} from './types'

export default class Computed extends State implements StoreConstructor<typeof STATE> {
  /** 条目收藏信息 */
  collection(subjectId: SubjectId) {
    this.init('collection')
    return computed<Collection>(() => {
      return this.state.collection[subjectId] || {}
    }).get()
  }

  /** 用户收藏概览 (HTML, 全部) */
  userCollections(userId: UserId, subjectType: SubjectType, type: CollectionStatus) {
    this.init('userCollections')
    return computed<UserCollections>(() => {
      const key = `${userId || userStore.myUserId}|${subjectType}|${type}`
      return this.state.userCollections[key] || LIST_EMPTY
    }).get()
  }

  /** 用户收藏概览的标签 (HTML) */
  userCollectionsTags(
    userId: UserId,
    subjectType: SubjectType,
    type: CollectionStatus
  ) {
    this.init('userCollectionsTags')
    return computed<UserCollectionsTags>(() => {
      const key = `${userId || userStore.myUserId}|${subjectType}|${type}`
      return this.state.userCollectionsTags[key] || []
    }).get()
  }

  /** @deprecated 所有收藏条目状态 */
  @computed get userCollectionsMap(): UserCollectionsMap {
    this.init('userCollectionsMap')
    return this.state.userCollectionsMap
  }

  /** 瓷砖进度 */
  @computed get mosaicTile(): MosaicTile {
    this.init('mosaicTile')
    return this.state.mosaicTile
  }

  /**
   * @deprecated
   * 请使用 collectionStore.collect 替代
   * 条目的收藏状态, 替代 userCollectionsMap
   * */
  collectionStatus(subjectId: SubjectId) {
    this.init('collectionStatus')
    return computed<CollectionStatusCn | ''>(() => {
      return this.state.collectionStatus[subjectId] || ''
    }).get()
  }

  /** 条目的收藏状态最后一次请求时间戳, 对应 collectionStatus, 共同维护 */
  _collectionStatusLastFetchMS(subjectId: SubjectId) {
    this.init('_collectionStatusLastFetchMS')
    return computed<number>(() => {
      return this.state._collectionStatusLastFetchMS[subjectId] || 0
    }).get()
  }

  /** 特定用户特定条目的收藏信息 */
  usersSubjectCollection(username: UserId, subjectId: SubjectId) {
    this.init('usersSubjectCollection')
    return computed<UsersSubjectCollection>(() => {
      return (
        this.state.usersSubjectCollection[`${username}|${subjectId}`] ||
        DEFAULT_USERS_SUBJECT_COLLECTION
      )
    }).get()
  }

  // -------------------- computed --------------------
  /** @deprecated 获取指定条目收藏状态名 */
  statusName(subjectId: SubjectId) {
    return computed<CollectionStatusCn | ''>(() => {
      const collection = this.collection(subjectId) as any
      return collection?.status?.name || ''
    }).get()
  }

  /** 获取指定条目收藏状态 */
  collect(subjectId: SubjectId, type?: SubjectTypeCn) {
    return computed<CollectActions | ''>(() => {
      const value = this.collectionStatus(subjectId) || ''
      if (!value || !type || type === '动画' || type === '三次元') return value
      if (type === '书籍') return value.replace('看', '读') as CollectActions
      if (type === '游戏') return value.replace('看', '玩') as CollectActions
      if (type === '音乐') return value.replace('看', '听') as CollectActions
      return value
    }).get()
  }
}

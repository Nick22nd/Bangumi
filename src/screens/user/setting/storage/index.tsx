/*
 * @Author: czy0729
 * @Date: 2022-06-07 07:48:11
 * @Last Modified by: czy0729
 * @Last Modified time: 2023-08-03 01:17:03
 */
import React, { useState, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActionSheet, Text, Heatmap } from '@components'
import { clearCache } from '@components/image/image'
import { ItemSetting } from '@_'
import Stores from '@stores'
import { toFixed, confirm, info } from '@utils'
import { t } from '@utils/fetch'
import { useBoolean, useObserver, useMount } from '@utils/hooks'
import i18n from '@constants/i18n'
import { getShows } from '../utils'
import { TEXTS } from './ds'

function Storage({ filter }) {
  const { state, setTrue, setFalse } = useBoolean(false)
  const [storageSize, setStorageSize] = useState('')

  const caculateStorageSize = useCallback(async () => {
    try {
      const keys = await AsyncStorage.getAllKeys()
      const storages = await AsyncStorage.multiGet(keys)

      let storageSize = 0
      storages.forEach(item => {
        storageSize += item[0].length + item[1].length
      })
      setStorageSize(`${toFixed(storageSize / 1000 / 1000, 1)} mb`)
    } catch (error) {
      console.error('Setting', 'caculateStorageSize', error)
    }
  }, [])

  const clearStorage = useCallback(() => {
    confirm(`清除所有数据${i18n.cache()}，确定?`, async () => {
      t('设置.清除缓存', {
        type: 'storage'
      })

      await Stores.clearStorage()

      setTimeout(() => {
        info('已清除数据缓存')
        caculateStorageSize()
      }, 2400)
    })
  }, [caculateStorageSize])

  const clearImages = useCallback(() => {
    confirm('清除所有图片缓存，确定?', () => {
      t('设置.清除缓存', {
        type: 'images'
      })

      setTimeout(() => {
        clearCache()
        info('已清除图片缓存')
      }, 0)
    })
  }, [])

  const clearAll = useCallback(() => {
    confirm(
      `清除所有包括页面接口的数据${i18n.cache()} (若需清除图片${i18n.cache()}，请到系统里面清除应用数据)，确定?`,
      async () => {
        t('设置.清除缓存', {
          type: 'all'
        })

        await Stores.clearStorage()
        clearCache()

        setTimeout(() => {
          info('已清除')
          caculateStorageSize()
        }, 2400)
      }
    )
  }, [caculateStorageSize])

  useMount(() => {
    caculateStorageSize()
  })

  const shows = getShows(filter, TEXTS)
  return useObserver(() => {
    if (!shows) return null

    return (
      <>
        <ItemSetting hd='缓存' arrow highlight filter={filter} onPress={setTrue} />
        <ActionSheet show={state} title='缓存' onClose={setFalse}>
          {/* 清除数据缓存 */}
          <ItemSetting
            show={shows.clearStorage}
            ft={
              <Text type='sub' size={15}>
                {storageSize}
              </Text>
            }
            arrow
            highlight
            filter={filter}
            onPress={clearStorage}
            {...TEXTS.clearStorage}
            hd={`清除数据${i18n.cache()}`}
          >
            <Heatmap id='设置.清除缓存' />
          </ItemSetting>

          {/* 清除图片缓存 */}
          <ItemSetting
            show={shows.clearImages}
            arrow
            highlight
            filter={filter}
            onPress={clearImages}
            {...TEXTS.clearImages}
            hd={`清除图片${i18n.cache()}`}
          >
            <Heatmap id='设置.清除缓存' />
          </ItemSetting>

          {/* 清除缓存 */}
          <ItemSetting
            show={shows.clearAll}
            arrow
            highlight
            filter={filter}
            onPress={clearAll}
            {...TEXTS.clearAll}
            hd={`清除全部${i18n.cache()}`}
          >
            <Heatmap id='设置.清除缓存' />
          </ItemSetting>
        </ActionSheet>
      </>
    )
  })
}

export default Storage

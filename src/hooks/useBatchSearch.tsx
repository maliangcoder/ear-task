/**
 * 批量搜寻自定义 Hook
 * 封装批量搜寻的业务逻辑和进度管理
 */

import { useState, useCallback } from 'react'
import { Toast } from 'antd-mobile'
import { searchApi } from '@/api/search'
import type { BatchProgress } from '@/types/common'

export interface UseBatchSearchResult {
  /** 是否正在搜寻 */
  searching: boolean
  /** 当前进度 */
  progress: BatchProgress | null
  /** 执行批量搜寻 */
  executeBatchSearch: (total: number) => Promise<{ success: boolean; progress: BatchProgress | null }>
}

/**
 * 显示 Toast 并等待指定时间
 */
const showToastAndWait = (content: string, icon: 'success' | 'fail', duration: number): Promise<void> => {
  return new Promise((resolve) => {
    Toast.show({
      icon,
      content,
      duration,
      afterClose: () => resolve(),
    })
  })
}

export function useBatchSearch(): UseBatchSearchResult {
  const [progress, setProgress] = useState<BatchProgress | null>(null)
  const [searching, setSearching] = useState(false)

  const executeBatchSearch = useCallback(async (total: number) => {
    if (total <= 0) return { success: false, progress: null }

    setSearching(true)
    let successCount = 0
    let failCount = 0

    try {
      for (let i = 0; i < total; i++) {
        const res = await searchApi.search({ freeSearch: true })

        const currentStep = i + 1
        if (res.data) {
          successCount++
          // 显示成功提示，停留 1.5 秒
          await showToastAndWait(
            `第 ${currentStep}/${total} 次搜寻成功`,
            'success',
            1500
          )
        } else {
          failCount++
          // 显示失败提示，停留 1.5 秒
          await showToastAndWait(
            `第 ${currentStep}/${total} 次搜寻失败`,
            'fail',
            1500
          )
        }

        // 更新进度状态
        setProgress({
          current: currentStep,
          total,
          successCount,
          failCount,
        })
      }

      // 显示最终汇总结果，停留 2 秒
      const finalProgress: BatchProgress = {
        current: total,
        total,
        successCount,
        failCount,
      }

      await showToastAndWait(
        `搜寻完成！成功 ${successCount} 次${failCount > 0 ? `，失败 ${failCount} 次` : ''}`,
        successCount > 0 ? 'success' : 'fail',
        2000
      )

      return { success: successCount > 0, progress: finalProgress }
    } catch (error) {
      Toast.show({
        icon: 'fail',
        content: '搜寻异常，请重试',
      })
      return { success: false, progress: null }
    } finally {
      setSearching(false)
      setProgress(null)
    }
  }, [])

  return { searching, progress, executeBatchSearch }
}

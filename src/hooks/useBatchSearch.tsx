/**
 * 批量搜寻自定义 Hook
 * 封装批量搜寻的业务逻辑和进度管理
 */

import { useState, useCallback } from 'react'
import { Modal, Toast } from 'antd-mobile'
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

export function useBatchSearch(): UseBatchSearchResult {
  const [progress, setProgress] = useState<BatchProgress | null>(null)
  const [searching, setSearching] = useState(false)

  const executeBatchSearch = useCallback(async (total: number) => {
    if (total <= 0) return { success: false, progress: null }

    setSearching(true)
    let successCount = 0
    let failCount = 0

    // 显示进度 Modal
    const modal = Modal.show({
      title: '批量搜寻',
      content: (
        <div className="batch-progress-content">
          <div>正在执行搜寻...</div>
          <div className="progress-text">
            <span className="progress-current">0</span>/{total}
          </div>
        </div>
      ),
      closeOnMaskClick: false,
    })

    try {
      for (let i = 0; i < total; i++) {
        const res = await searchApi.search({ freeSearch: true })
        if (res.data) {
          successCount++
        } else {
          failCount++
        }

        // 更新进度显示
        const progressEl = document.querySelector('.progress-current')
        if (progressEl) {
          progressEl.textContent = String(i + 1)
        }
      }

      modal.close()

      const finalProgress: BatchProgress = {
        current: total,
        total,
        successCount,
        failCount,
      }

      Toast.show({
        icon: successCount > 0 ? 'success' : 'fail',
        content: `成功 ${successCount} 次${failCount > 0 ? `，失败 ${failCount} 次` : ''}`,
      })

      return { success: successCount > 0, progress: finalProgress }
    } catch (error) {
      modal.close()
      Toast.show({
        icon: 'fail',
        content: '搜寻失败，请重试',
      })
      return { success: false, progress: null }
    } finally {
      setSearching(false)
      setProgress(null)
    }
  }, [])

  return { searching, progress, executeBatchSearch }
}

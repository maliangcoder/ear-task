/**
 * 批量搜寻自定义 Hook
 * 封装批量搜寻的业务逻辑和进度管理
 */

import { useState, useCallback } from "react";
import { Toast } from "antd-mobile";
import { searchApi } from "@/api/search";
import type { BatchProgress } from "@/types/common";

/** 每次搜寻之间的延迟时间（毫秒） */
const SEARCH_DELAY_MS = 800;

/** 延迟函数 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UseBatchSearchResult {
  /** 是否正在搜寻 */
  searching: boolean;
  /** 当前进度 */
  progress: BatchProgress | null;
  /** 执行批量搜寻 */
  executeBatchSearch: (
    total: number
  ) => Promise<{ success: boolean; progress: BatchProgress | null }>;
}

export function useBatchSearch(): UseBatchSearchResult {
  const [progress, setProgress] = useState<BatchProgress | null>(null);
  const [searching, setSearching] = useState(false);

  const executeBatchSearch = useCallback(async (total: number) => {
    if (total <= 0) return { success: false, progress: null };

    setSearching(true);
    let successCount = 0;
    let failCount = 0;
    let consecutiveFailCount = 0;

    for (let i = 0; i < total; i++) {
      // 非首次请求时添加延迟，避免请求频率过快
      if (i > 0) {
        await delay(SEARCH_DELAY_MS);
      }

      try {
        const res = await searchApi.search({ freeSearch: true });

        const currentStep = i + 1;
        if (res.data) {
          successCount++;
          consecutiveFailCount = 0; // 重置连续失败计数
        } else {
          failCount++;
          consecutiveFailCount++;
        }

        // 更新进度状态
        setProgress({
          current: currentStep,
          total,
          successCount,
          failCount,
        });

        // 连续失败 3 次，停止继续尝试
        if (consecutiveFailCount >= 3) {
          Toast.show({
            icon: "fail",
            content: "连续失败次数过多，已停止",
          });
          break;
        }
      } catch (error) {
        console.error(`第 ${i + 1} 次搜寻失败:`, error);
        failCount++;
        consecutiveFailCount++;

        // 更新进度状态
        setProgress({
          current: i + 1,
          total,
          successCount,
          failCount,
        });

        // 连续失败 3 次，停止继续尝试
        if (consecutiveFailCount >= 3) {
          Toast.show({
            icon: "fail",
            content: "连续失败次数过多，已停止",
          });
          break;
        }
      }
    }

    // 显示最终汇总结果
    const finalProgress: BatchProgress = {
      current: successCount + failCount,
      total,
      successCount,
      failCount,
    };

    Toast.show({
      icon: successCount > 0 ? "success" : "fail",
      content: `搜寻完成！成功 ${successCount} 次${
        failCount > 0 ? `，失败 ${failCount} 次` : ""
      }`,
    });

    setSearching(false);
    setProgress(null);

    return { success: successCount > 0, progress: finalProgress };
  }, []);

  return { searching, progress, executeBatchSearch };
}

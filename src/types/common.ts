/**
 * 通用类型定义
 * 统一管理项目中通用的类型定义
 */

/**
 * API 统一响应格式
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  ok?: boolean
}

/**
 * 批量操作进度接口
 */
export interface BatchProgress {
  current: number
  total: number
  successCount: number
  failCount: number
}

/**
 * 格式化工具函数
 */

import { OCCUPATION_MAP } from '@/constants/occupations'

/**
 * 格式化百分比
 * @param value - 小数值 (0.1 表示 10%)
 * @returns 格式化后的百分比字符串
 */
export const formatPercent = (value: number): string => {
  return `${(value * 100).toFixed(0)}%`
}

/**
 * 格式化职业名称
 * @param type - 职业类型代码
 * @returns 职业中文名称
 */
export const formatOccupationName = (type: string): string => {
  return OCCUPATION_MAP[type] || type
}

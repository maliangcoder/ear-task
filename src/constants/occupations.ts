/**
 * 职业类型相关常量
 */

/**
 * 职业类型中文名称映射
 */
export const OCCUPATION_MAP: Record<string, string> = {
  AGRICULTURE: '农业',
  FORESTRY: '林业',
  MINING: '矿业',
} as const

/**
 * 职业类型颜色映射
 */
export const OCCUPATION_COLORS: Record<string, string> = {
  AGRICULTURE: '#4caf50',
  FORESTRY: '#8bc34a',
  MINING: '#ff9800',
} as const

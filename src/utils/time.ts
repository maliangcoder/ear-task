export const parseTime = (timeStr: string): Date => {
  if (!timeStr || timeStr.length < 14) {
    return new Date()
  }
  
  const year = parseInt(timeStr.substring(0, 4))
  const month = parseInt(timeStr.substring(4, 6)) - 1
  const day = parseInt(timeStr.substring(6, 8))
  const hour = parseInt(timeStr.substring(8, 10))
  const minute = parseInt(timeStr.substring(10, 12))
  const second = parseInt(timeStr.substring(12, 14))
  
  return new Date(year, month, day, hour, minute, second)
}

export const formatDuration = (startTimeStr: string): string => {
  if (!startTimeStr) {
    return '0小时0分钟'
  }
  
  const startTime = parseTime(startTimeStr)
  const now = new Date()
  const diff = now.getTime() - startTime.getTime()
  
  if (diff < 0) {
    return '0小时0分钟'
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  return `${hours}小时${minutes}分钟`
}

export const isIslandStopped = (endTimeStr: string): boolean => {
  if (!endTimeStr) {
    return false
  }
  
  const endTime = parseTime(endTimeStr)
  const now = new Date()
  return now.getTime() > endTime.getTime()
}

export const calculateResourceNeeded = (currentResource: number): number => {
  const needed = 120 - currentResource
  return needed > 0 ? needed : 0
}

/**
 * 获取有效的消耗速率
 * 如果 realResourceRate 为 0（未启动时），使用 resourceRate 作为后备
 */
export const getEffectiveRate = (
  realResourceRate: number,
  resourceRate: number
): number => {
  return realResourceRate > 0 ? realResourceRate : resourceRate
}

/**
 * 计算当前能量可以运行多少小时
 * @param resource 当前资源数量
 * @param realResourceRate 实际消耗速率（每小时，接口返回的已计算加成）
 * @param resourceRate 基础消耗速率（作为后备）
 */
export const calculateRemainingHours = (
  resource: number,
  realResourceRate: number,
  resourceRate?: number
): number => {
  const rate = getEffectiveRate(realResourceRate, resourceRate || realResourceRate)
  if (rate <= 0) return 0
  return resource / rate
}

/**
 * 计算N点空晶能够补充多少小时的运行时间
 * @param crystalAmount 空晶数量
 * @param supplementRate 补充比例（1空晶->n资源）
 * @param realResourceRate 实际消耗速率（每小时）
 * @param resourceRate 基础消耗速率（作为后备）
 */
export const calculateSupplementHours = (
  crystalAmount: number,
  supplementRate: number,
  realResourceRate: number,
  resourceRate?: number
): number => {
  const rate = getEffectiveRate(realResourceRate, resourceRate || realResourceRate)
  if (rate <= 0) return 0
  const resourceGain = crystalAmount * supplementRate
  return resourceGain / rate
}

/**
 * 计算需要补充多少空晶才能运行24小时
 * @param currentResource 当前资源数量
 * @param supplementRate 补充比例（1空晶->n资源）
 * @param realResourceRate 实际消耗速率（每小时）
 * @param resourceRate 基础消耗速率（作为后备）
 */
export const calculateCrystalNeededFor24Hours = (
  currentResource: number,
  supplementRate: number,
  realResourceRate: number,
  resourceRate?: number
): number => {
  const rate = getEffectiveRate(realResourceRate, resourceRate || realResourceRate)
  if (rate <= 0 || supplementRate <= 0) return 0
  
  // 24小时需要的资源
  const resourceNeeded = rate * 24
  // 还需要补充的资源
  const resourceToAdd = resourceNeeded - currentResource
  
  if (resourceToAdd <= 0) return 0
  
  // 需要的空晶数量（向上取整）
  return Math.ceil(resourceToAdd / supplementRate)
}

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

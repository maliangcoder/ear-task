import type { ApiResponse } from './common'

/**
 * 职业类型枚举
 */
export enum OccupationType {
  AGRICULTURE = 'AGRICULTURE',
  FORESTRY = 'FORESTRY',
  MINING = 'MINING',
}

export interface Worker {
  id: number
  name: string
  icon: string
  nftTitle: string
  nftMainImg: string
  status: string
  statusDetail: string
  working: boolean
  occupationType: OccupationType
  hobby: number
}

export interface SearchPreData {
  /** 可免费搜寻总次数 */
  freeTotalSearchNum: number
  /** 今日-已搜寻总次数 */
  todayFreeSearchNum: number
  /** 今日-已搜寻次数 */
  todayUsedSearchNum: number
  /** 剩余免费搜寻次数 */
  remainingFreeSearchNum: number
  /** 持有的搜寻票数量 */
  ticketNum: number
  /** [搜寻]搜寻消耗品_NFT_ID */
  searchConsumeId: number
  /** [搜寻]消耗品名称 */
  searchConsumeName: string
  /** [搜寻]消耗品图片 */
  searchConsumeImgUrl: string
  /** [搜寻]每次搜寻产出类型 */
  searchOutputType: string
  /** [搜寻]每次搜寻产物名称 */
  searchOutputName: string
  /** [搜寻]每次搜寻产物图片 */
  searchOutputImgUrl: string
  /** [搜寻]每次搜寻产出数量 */
  searchOutput: number
  /** 搜寻今日产出 */
  searchOutputToday: number
  /** 搜寻产出加成 */
  searchAddition: number
  /** [搜寻]使用藏品每次搜寻产出 */
  nftSearchOutput?: number
  /** 搜寻工人列表(英雄) */
  workerList: Worker[]
}

export interface SearchRequest {
  freeSearch: boolean
}

export type SearchPreResponse = ApiResponse<SearchPreData>
export type SearchResponse = ApiResponse<boolean>

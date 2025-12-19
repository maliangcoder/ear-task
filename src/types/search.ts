import type { ApiResponse } from './island'

export interface Worker {
  id: number
  name: string
  icon: string
  nftTitle: string
  nftMainImg: string
  status: string
  statusDetail: string
  working: boolean
  occupationType: string
  hobby: number
}

export interface SearchPreData {
  freeTotalSearchNum: number
  todayFreeSearchNum: number
  todayUsedSearchNum: number
  remainingFreeSearchNum: number
  ticketNum: number
  searchConsumeId: number
  searchConsumeName: string
  searchConsumeImgUrl: string
  searchOutputType: string
  searchOutputName: string
  searchOutputImgUrl: string
  searchOutput: number
  searchOutputToday: number
  searchAddition: number
  workerList: Worker[]
}

export interface SearchRequest {
  freeSearch: boolean
}

export type SearchPreResponse = ApiResponse<SearchPreData>
export type SearchResponse = ApiResponse<boolean>

export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  ok?: boolean
}

export interface PageData<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
  orders: any[]
  optimizeCountSql: boolean
  hitCount: boolean
  searchCount: boolean
}

export enum ExchangeType {
  CASH = 'CASH',
  CLOCKWORK = 'CLOCKWORK',
  CRYSTAL = 'CRYSTAL',
  GRAIN = 'GRAIN',
  TIN = 'TIN'
}

export enum Status {
  UN_USE = 'UN_USE',
  DOING = 'DOING',
  DESTROY = 'DESTROY'
}

export enum StatusDetail {
  BOARDING_LOCK = 'BOARDING_LOCK',
  ENABLE_LOCK = 'ENABLE_LOCK',
  EQUIPMENT_LOCK = 'EQUIPMENT_LOCK',
  GIVE_LOCK = 'GIVE_LOCK',
  GROUP_LOCK = 'GROUP_LOCK',
  INCUBATE_LOCK = 'INCUBATE_LOCK',
  INVEST_LOCK = 'INVEST_LOCK',
  ISLAND_POSITION_LOCK = 'ISLAND_POSITION_LOCK',
  ISLAND_WORKING_LOCK = 'ISLAND_WORKING_LOCK',
  RE_SELL_LOCK = 'RE_SELL_LOCK',
  RELEASE_LOCK = 'RELEASE_LOCK',
  SEARCH_POSITION_LOCK = 'SEARCH_POSITION_LOCK',
  SLOT_LOCK = 'SLOT_LOCK',
  TACTICAL_LOCK = 'TACTICAL_LOCK'
}

export interface Island {
  id: number
  nftId: number
  nftTitle: string
  nftMainImg: string
  openGive: boolean
  openResell: boolean
  resellPriceLimit: boolean
  resellPriceMin: number
  resellPriceMax: number
  memberNftId: number
  numberStr: string
  resource: number
  resourceLimit: number
  resourceRate: number
  supplementRate: number
  produceLimit: number
  produceRate: number
  exchangeConsumeType: ExchangeType
  exchangeProduceType: ExchangeType
  exchangeRate: number
  startTime: string
  endTime: string
  realResourceRate: number
  realProduceRate: number
  settlementNum: number
  produceNum: number
  status: Status
  statusDetail: StatusDetail
  createTime: string
}

export interface IslandListResponse {
  code: number
  data: PageData<Island>
  message: string
  ok: boolean
}

export interface IslandOperationRequest {
  id: number
  consume?: number
  start?: boolean
}

export interface IslandOperationResponse {
  code: number
  data: boolean
  message: string
}

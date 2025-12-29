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
  nftLevel?: number
  openGive: boolean
  openResell: boolean
  resellPriceLimit: boolean
  resellPriceMin: number
  resellPriceMax: number
  memberNftId: number
  numberStr: string
  /** [发条厂]资源数量 */
  resource: number
  /** [发条厂]资源补充上限 */
  resourceLimit: number
  /** [发条厂]资源消耗速率[单位:/h] */
  resourceRate: number
  /** [发条厂]资源补充比例【1空晶->n资源】 */
  supplementRate: number
  /** [发条厂]产出上限 */
  produceLimit: number
  /** [发条厂]生产速率 */
  produceRate: number
  exchangeConsumeType: ExchangeType
  exchangeProduceType: ExchangeType
  exchangeRate: number
  startTime: string
  endTime: string
  /** 本次消耗速率 */
  realResourceRate: number
  /** 本次生产速率 */
  realProduceRate: number
  settlementNum: number
  /** 当前产出数量 */
  produceNum: number
  status: Status
  statusDetail: StatusDetail
  createTime: string
  /** 发条厂产出加成 */
  factoryAddition?: number
  /** 发条厂今日收益 */
  factoryCollectToday?: number
  /** 厨房产出加成 */
  kitchenAddition?: number
  /** 厨房今日收益 */
  kitchenProduceToday?: number
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

import request from './request'
import type {
  IslandListResponse,
  IslandOperationRequest,
  IslandOperationResponse
} from '@/types/island'

export const islandApi = {
  getList() {
    return request.get<any, IslandListResponse>('/nft/enMemberIsland/backpackPage')
  },

  collect(data: Pick<IslandOperationRequest, 'id'>) {
    return request.post<any, IslandOperationResponse>('/nft/enMemberIsland/collect', data)
  },

  supplement(data: Required<Pick<IslandOperationRequest, 'id' | 'consume'>>) {
    return request.post<any, IslandOperationResponse>('/nft/enMemberIsland/supplement', data)
  },

  start(data: Required<Pick<IslandOperationRequest, 'id' | 'start'>>) {
    return request.post<any, IslandOperationResponse>(
      `/nft/enMemberIsland/start?id=${data.id}&start=${data.start}`
    )
  }
}

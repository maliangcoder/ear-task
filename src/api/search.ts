import request from './request'
import type { SearchPreResponse, SearchRequest, SearchResponse } from '@/types/search'

export const searchApi = {
  getSearchPre() {
    return request.get<any, SearchPreResponse>('/game/gameMemberShipSlot/searchPre')
  },

  search(data: SearchRequest) {
    return request.post<any, SearchResponse>('/game/gameMemberShipSlot/search', data)
  }
}

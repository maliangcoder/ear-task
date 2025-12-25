import { create } from 'zustand'
import { searchApi } from '@/api/search'
import type { SearchPreData } from '@/types/search'

interface SearchState {
  searchInfo: SearchPreData | null
  loading: boolean
  // Setters
  setSearchInfo: (info: SearchPreData) => void
  setLoading: (loading: boolean) => void
  // 业务方法
  fetchSearchInfo: () => Promise<void>
  reset: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  searchInfo: null,
  loading: false,

  setSearchInfo: (info) => set({ searchInfo: info }),
  setLoading: (loading) => set({ loading }),

  fetchSearchInfo: async () => {
    set({ loading: true })
    try {
      const res = await searchApi.getSearchPre()
      set({ searchInfo: res.data })
    } catch (error) {
      console.error('获取搜寻信息失败:', error)
    } finally {
      set({ loading: false })
    }
  },

  reset: () => set({ searchInfo: null, loading: false }),
}))

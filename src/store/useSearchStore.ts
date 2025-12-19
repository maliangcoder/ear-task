import { create } from 'zustand'
import type { SearchPreData } from '@/types/search'

interface SearchState {
  searchInfo: SearchPreData | null
  loading: boolean
  setSearchInfo: (info: SearchPreData) => void
  setLoading: (loading: boolean) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  searchInfo: null,
  loading: false,
  setSearchInfo: (info) => set({ searchInfo: info }),
  setLoading: (loading) => set({ loading })
}))

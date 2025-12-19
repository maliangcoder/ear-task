import { create } from 'zustand'
import type { Island } from '@/types/island'

interface IslandState {
  islands: Island[]
  loading: boolean
  setIslands: (islands: Island[]) => void
  setLoading: (loading: boolean) => void
}

export const useIslandStore = create<IslandState>((set) => ({
  islands: [],
  loading: false,
  setIslands: (islands) => set({ islands }),
  setLoading: (loading) => set({ loading })
}))

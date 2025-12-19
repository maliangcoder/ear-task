import { create } from 'zustand'
import type { UserDetail } from '@/types/auth'
import { storage } from '@/utils/storage'

interface AuthState {
  token: string | null
  userInfo: UserDetail | null
  isLoggedIn: boolean
  setAuth: (token: string, userInfo: UserDetail) => void
  logout: () => void
  initAuth: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userInfo: null,
  isLoggedIn: false,

  setAuth: (token, userInfo) => {
    storage.setToken(token)
    storage.setUserInfo(userInfo)
    set({ token, userInfo, isLoggedIn: true })
  },

  logout: () => {
    storage.clear()
    set({ token: null, userInfo: null, isLoggedIn: false })
  },

  initAuth: () => {
    const token = storage.getToken()
    const userInfo = storage.getUserInfo()
    if (token && userInfo) {
      set({ token, userInfo, isLoggedIn: true })
    }
  }
}))

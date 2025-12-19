const STORAGE_KEYS = {
  TOKEN: 'ear_task_token',
  USER_INFO: 'ear_task_user_info'
}

export const storage = {
  setToken(token: string) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  },

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  },

  setUserInfo(userInfo: any) {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
  },

  getUserInfo(): any | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER_INFO)
    return data ? JSON.parse(data) : null
  },

  clear() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_INFO)
  }
}

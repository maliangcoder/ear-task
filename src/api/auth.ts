import request from './request'
import type { LoginRequest, LoginResponse } from '@/types/auth'

export const loginApi = {
  login(data: LoginRequest) {
    return request.post<any, LoginResponse>('/customer/login/pwd.e', data)
  }
}

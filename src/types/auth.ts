export interface LoginRequest {
  phone: string
  password: string
}

export interface UserDetail {
  id: number
  userPhone: string
  name: string
  sex: string
  inviteUserId: number
  inviteUserName: string
  imgUrl: string
  enable: number
  createTime: string
  address: string
  hasPayPwd: number
  hasThreeCert: number
  inviteCode: string
  inviteUserCode: string
  reviewer: boolean
  yiBaoStatus: string
  yiBaoMerStatus: string
  cumulativeRecharge: number
  vipLevel: number
}

export interface LoginResponse {
  code: number
  data: {
    token: string
    userDetail: UserDetail
  }
  message: string
}

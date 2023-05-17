/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}
export interface LoginPicture {
  username: string
  password: string
  codeId?: string
  code?: string
  grant_type?: string
  client_id?: string
  client_secret?: string
  scope?: string
  rememberMe?: boolean
}

export interface TokenInfo {
  access_token: string
  refresh_token: string
  endpoint: string
  scope: string
  token_type: string
  tenantCode: string
  expires_in: number
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

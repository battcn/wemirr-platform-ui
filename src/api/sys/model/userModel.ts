/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}
export interface LoginPicture {
  username: string;
  password: string;
  codeId?: string;
  code?: string;
  grant_type?: string;
  client_id?: string;
  client_secret?: string;
  scope?: string;
  rememberMe?: boolean;
}

export interface TokenInfo {
  access_token: string;
  refresh_token: string;
  endpoint: string;
  scope: string;
  token_type: string;
  tenantCode: string;
  expires_in: number;
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
  userId: string | number;
  companyName: string;
  tenantId: string | number;
  tenantCode: string | number;
  permissions: [];
  username: string;
  realName: string;
  nickName: string;
  avatar: string;
  description?: string;
  homePath?: string;
  roles: RoleInfo[];
}

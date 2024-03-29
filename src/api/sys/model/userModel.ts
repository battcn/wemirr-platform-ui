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
  tenant_code?: string;
  code?: string;
  vc_code?: string;
  vc_token?: string;
  grant_type?: string;
  login_type?: string;
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
  roles: RoleInfo[];
}

export interface GetCaptchaCodeModel {
  captchaId: string;
  code: string;
  imageData: string;
}

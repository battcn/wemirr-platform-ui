import { cloneDeep } from '@vben/utils';

import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
    tenantCode?: string;
    loginType?: string;
    code?: string;
    clientId?: string;
    clientSecret?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  console.info('loginApi =>', data);
  data = cloneDeep(data);
  data.loginType = 'password';
  data.clientId = 'pc-web';
  data.clientSecret = 'pc-web';
  return requestClient.post<AuthApi.LoginResult>('/iam/token/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', {
    withCredentials: true,
  });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('/iam/token/logout', {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/iam/token/func_permissions');
}

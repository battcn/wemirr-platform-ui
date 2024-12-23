import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/iam/token/userinfo');
}

export async function getUserList() {
  return requestClient.postThen<any>('/iam/users/list');
}

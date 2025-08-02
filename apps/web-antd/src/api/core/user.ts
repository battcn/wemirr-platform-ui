import type { UserInfo } from '@vben/types';

import type { IDS } from '#/api/common';

import { defHttp } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return defHttp.get<UserInfo>('/iam/token/userinfo');
}

// export async function getUserList() {
//   return defHttp.post<any>('/iam/users/list');
// }
export async function getUserByIds(values: IDS) {
  const data = Array.isArray(values[0]) ? values[0] : values;
  return defHttp.post<any>('/iam/users/ids', data);
}

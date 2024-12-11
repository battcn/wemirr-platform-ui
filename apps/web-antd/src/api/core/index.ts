import { requestClient } from '#/api/request';

export * from './auth';
export * from './dict';
export * from './menu';
export * from './user';

/**
 * 获取当前初始化配置
 */
export async function loadTenantSetting(params) {
  return requestClient.get<any>('/iam/plat/site-setting', { params });
}

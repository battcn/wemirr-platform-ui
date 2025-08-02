import { requestClient } from '#/api/request';

export * from './auth';
export * from './dict';
export * from './menu';
export * from './upload';
export * from './user';

/**
 * 获取当前初始化配置
 */
export async function loadTenantSetting(params: any) {
  return requestClient.get<any>('/iam/plat/site-setting', { params });
}

/**
 * 第三方授权管理
 */
export async function thirdAuthGitee() {
  return requestClient.get<any>('/iam/third-auth/gitee');
}

import { defHttp } from '#/api/request';

/**
 * 获取机构树
 */
export function getOrgTree(query: any) {
  return defHttp.get('/iam/org/trees', { params: query });
}

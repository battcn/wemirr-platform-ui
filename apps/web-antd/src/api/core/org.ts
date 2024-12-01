import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function orgTrees() {
    return requestClient.get<any>('/iam/org/trees?parentId=0');
}

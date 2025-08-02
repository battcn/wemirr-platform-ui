import type { CategoryQuery, CategoryVO } from './model';

import { requestClient } from '#/api/request';

/**
 * 获取流程分类树列表
 * @returns tree
 */
export function categoryTree() {
  // return requestClient.get<CategoryTree[]>('/workflow/category/categoryTree');
  return [];
}

/**
 * 查询流程分类列表
 * @param params
 * @returns 流程分类列表
 */
export function categoryList(params?: CategoryQuery) {
  return requestClient.get<CategoryVO[]>(`/workflow/category/list`, { params });
}

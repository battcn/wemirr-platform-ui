import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  ProcessCategoryVo,
  ProcessCategoryQueryVo,
  ProcessCategoryPageVo,
  ProcessCategoryDto,
  ProcessCategoryPageDto,
} from './model/processCategoryModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: ProcessCategoryPageVo) =>
  defHttp.post<PageDto<ProcessCategoryPageDto>>({
    url: SysUrlPrefix.PROCESS + '/process-category/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: ProcessCategoryVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.PROCESS + '/process-category/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: ProcessCategoryVo, categoryId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.PROCESS + '/process-category/update/{categoryId}',
    data: { ...data, categoryId },
  });

/**
 * @description: 删除
 */
export const deleteById = (categoryId: string) =>
  defHttp.delete<String>(
    {
      url: SysUrlPrefix.PROCESS + '/process-category/delete-one/{categoryId}',
      params: { categoryId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 通过条件查询流程类别多条数据
 */
export const getList = (data: ProcessCategoryQueryVo) =>
  defHttp.post<ProcessCategoryDto[]>({
    url: SysUrlPrefix.PROCESS + '/process-category/select/list',
    data,
  });

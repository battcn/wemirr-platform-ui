import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  CommonCategoryPageVo,
  CommonCategoryPageDto,
  CommonCategoryVo,
} from './model/commonCategoryModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: CommonCategoryPageVo) =>
  defHttp.post<PageDto<CommonCategoryPageDto>>({
    url: SysUrlPrefix.AUTH + '/common-category/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: CommonCategoryVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.AUTH + '/common-category/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: CommonCategoryVo, categoryId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.AUTH + '/common-category/update/{categoryId}',
    data: { ...data, categoryId },
  });

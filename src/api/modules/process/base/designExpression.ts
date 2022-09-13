import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  DesignExpressionPageVo,
  DesignExpressionPageDto,
  DesignExpressionVo,
} from './model/designExpressionModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: DesignExpressionPageVo) =>
  defHttp.post<PageDto<DesignExpressionPageDto>>({
    url: SysUrlPrefix.PROCESS + '/design-expression/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: DesignExpressionVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.PROCESS + '/design-expression/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: DesignExpressionVo, expressionId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.PROCESS + '/design-expression/update/{expressionId}',
    data: { ...data, expressionId },
  });

/**
 * @description: 删除
 */
export const deleteById = (expressionId: string) =>
  defHttp.delete<String>(
    {
      url: SysUrlPrefix.PROCESS + '/design-expression/delete-one/{expressionId}',
      params: { expressionId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 修改状态
 */
export const updateState = (expressionId: string, type: number) =>
  defHttp.put<String>(
    {
      url: SysUrlPrefix.PROCESS + '/design-expression/update-state',
      params: { expressionId, type },
    },
    { successMessageMode: 'notification' },
  );

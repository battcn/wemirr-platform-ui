import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { OperatePageVo, OperatePageDto, OperateDto } from './model/operateModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: OperatePageVo) =>
  defHttp.post<PageDto<OperatePageDto>>({
    url: SysUrlPrefix.LOGGING + '/operate/select/page',
    data,
  });

/**
 * @description: 详情
 */
export const getById = (operateId: string) =>
  defHttp.get<OperateDto>({
    url: SysUrlPrefix.LOGGING + '/operate/select/one/{operateId}',
    params: { operateId },
  });

/**
 * @description: 删除
 */
export const deleteById = (operateId: string) =>
  defHttp.delete<String>(
    {
      url: SysUrlPrefix.LOGGING + '/operate/delete-one/{operateId}',
      params: { operateId },
    },
    { successMessageMode: 'notification' }
  );

/**
 * @description: 批量删除
 */
export const deleteBatchByIds = (operateIds: string[]) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.LOGGING + '/operate/delete-batch',
      data: operateIds,
    },
    { successMessageMode: 'notification' }
  );

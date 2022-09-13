import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { AuthDataPageVo, AuthDataPageDto, AuthDataDto } from './model/authDataModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: AuthDataPageVo) =>
  defHttp.post<PageDto<AuthDataPageDto>>({
    url: SysUrlPrefix.LOGGING + '/auth-data/select/page',
    data,
  });

/**
 * @description: 详情
 */
export const getById = (authLogId: string) =>
  defHttp.get<AuthDataDto>({
    url: SysUrlPrefix.LOGGING + '/auth-data/select/one/{authLogId}',
    params: { authLogId },
  });

/**
 * @description: 删除
 */
export const deleteById = (authLogId: string) =>
  defHttp.delete<String>(
    {
      url: SysUrlPrefix.LOGGING + '/auth-data/delete-one/{authLogId}',
      params: { authLogId },
    },
    { successMessageMode: 'notification' }
  );

/**
 * @description: 批量删除
 */
export const deleteBatchByIds = (authLogIds: string[]) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.LOGGING + '/auth-data/delete-batch',
      data: authLogIds,
    },
    { successMessageMode: 'notification' }
  );

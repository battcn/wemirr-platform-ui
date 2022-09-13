import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { ManageRouteVo, ManageRouteDto } from './model/manageRouteModel';

/**
 * @description: 通过过路由id修改过路由状态
 */
export const updateStatus = (routeId: string, state: number) =>
  defHttp.get<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/manage-route/update-status',
      params: { routeId, state },
    },
    { successMessageMode: 'notification' }
  );

/**
 * @description: 新增
 */
export const insert = (data: ManageRouteVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-route/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: ManageRouteVo, routeId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-route/update/{routeId}',
    data: { ...data, routeId },
  });

/**
 * @description: 详情
 */
export const getById = (routeId: string) =>
  defHttp.get<ManageRouteDto>({
    url: SysUrlPrefix.SYSTEM + '/manage-route/select/one/{routeId}',
    params: { routeId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (routeId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/manage-route/delete-one/{routeId}',
      params: { routeId },
    },
    { successMessageMode: 'notification' }
  );

/**
 * @description: 查询服务路由
 */
export const selectList = (serviceId: string) =>
  defHttp.get<string>({
    url: SysUrlPrefix.SYSTEM + '/manage-route/select/list/{serviceId}',
    params: { serviceId },
  });

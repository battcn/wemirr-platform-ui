import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  RbacClientDetailsPageVo,
  RbacClientDetailsPageDto,
  RbacClientDetailsVo,
  RbacClientDetailsDto,
  RbacClientResetDto,
  RbacClientResourceApiPageVo,
  RbacClientAuthVo,
} from './model/rbacClientDetailsModel';

import { RbacResourceDto } from './model/rbacResourceModel';
import { RbacResourceApiPageDto } from './model/rbacResourceApiModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacClientDetailsPageVo) =>
  defHttp.post<PageDto<RbacClientDetailsPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacClientDetailsVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: RbacClientDetailsVo, resourceId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/update/{resourceId}',
    data: { ...data, resourceId },
  });

/**
 * @description: 查看详情
 */
export const getById = (apiId: string) =>
  defHttp.get<RbacClientDetailsDto>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/select/one/{apiId}',
    params: { apiId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (resourceId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-client/delete-one/{resourceId}',
      params: { resourceId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 逻辑批量删除
 */
export const deleteBatchByIds = (data: string[]) =>
  defHttp.post<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-client/delete-batch',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 修改状态
 */
export const updateState = (resourceId: String, type: Number) =>
  defHttp.get<String>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-client/update/state',
      params: { resourceId, type },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 重置密码
 */
export const resetPassword = (data: RbacClientResetDto) =>
  defHttp.get<String>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-client/update/state',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 获取有效的资源列表
 */
export const selectResourceList = (clientDetailId: string, type?: number) =>
  defHttp.get<RbacResourceDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/select-resource/list',
    params: { type, clientDetailId },
  });

/**
 * @description: 资源api表分页查询
 */
export const selectResourcePage = (data: RbacClientResourceApiPageVo) =>
  defHttp.post<PageDto<RbacResourceApiPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/select-resource-api/page',
    data,
  });

/**
 * @description: 更新或添加权限
 */
export const updateAuth = (data: RbacClientAuthVo, clientDetailId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-client/update-auth/{clientDetailId}',
    data: { ...data, clientDetailId },
  });

import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { SuccessMessageMode } from '/#/axios';
import {
  RbacUserPageDto,
  RbacUserPageVo,
  RbacUserVo,
  RbacUserDto,
  RbacCorrelateRoleVo,
  RbacEnalbeUserPageVo,
  RbacJoinOrgVo,
} from './model/rbacUserModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacUserPageVo) =>
  defHttp.post<PageDto<RbacUserPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-user/select/page',
    data,
  });

/**
 * @description: 分页查询可关联的用户信息
 */
export const selectEnableUserPage = (data: RbacEnalbeUserPageVo) =>
  defHttp.post<PageDto<RbacUserPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-user/select/enable-user-page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacUserVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-user/insert',
    data,
  });

/**
 * @description: 删除
 */
export const deleteById = (userId: string) =>
  defHttp.delete<String>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-user/delete-one/{userId}',
      params: { userId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 修改
 */
export const update = (data: RbacUserVo, userId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-user/update/{userId}',
    data: { ...data, userId },
  });

/**
 * @description: 详情
 */
export const getById = (userId: string, orgId?: string) =>
  defHttp.get<RbacUserDto>({
    url: SysUrlPrefix.SYSTEM + '/rbac-user/select/one',
    params: { userId, orgId },
  });

/**
 * @description: 用户授权
 */
export const userAuth = (data: RbacCorrelateRoleVo) =>
  defHttp.post<string>({
    url: SysUrlPrefix.SYSTEM + '/rbac-user/auth',
    data,
  });

/**
 * @description: 同步流程引擎
 */
export const syncProcess = (mode: SuccessMessageMode = 'notification') =>
  defHttp.get<String>(
    { url: SysUrlPrefix.SYSTEM + '/rbac-user/sync/process' },
    { successMessageMode: mode },
  );

/**
 * @description: 加入机构
 */
export const joinOrg = (data: RbacJoinOrgVo) =>
  defHttp.post<string>({
    url: SysUrlPrefix.SYSTEM + '/rbac-user/join-org',
    data,
  });

/**
 * @description: 移除机构
 */
export const removeOrg = (userId: string, orgId: string) =>
  defHttp.get<string>({
    url: SysUrlPrefix.SYSTEM + '/rbac-user/remove-org',
    params: { userId, orgId },
  });

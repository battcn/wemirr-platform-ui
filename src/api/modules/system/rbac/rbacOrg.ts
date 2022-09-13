import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  RbacOrgTreeDto,
  RbacOrgPageVo,
  RbacOrgTreePageDto,
  RbacOrgVo,
  RbacOrgDto,
} from './model/rbacOrgModel';

import { RbacResourceDto } from './model/rbacResourceModel';
import { RbacResourceApiPageVo, RbacResourceApiPageDto } from './model/rbacResourceApiModel';
import { RbacMenuTreeDto } from './model/rbacMenuModel';
import { PageDto } from '/@/api/model/baseModel';
/**
 * @description: 获取组织机构树
 */
export const selectOrgTreeList = (type?: number) =>
  defHttp.get<RbacOrgTreeDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select/org-tree-list',
    params: { type: type },
  });

/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacOrgPageVo) =>
  defHttp.post<PageDto<RbacOrgTreePageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacOrgVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: RbacOrgVo, orgId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/update/{orgId}',
    data: { ...data, orgId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (orgId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-org/delete-one/{orgId}',
      params: { orgId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 查询
 */
export const getById = (orgId: String) =>
  defHttp.get<RbacOrgDto>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select/one/{orgId}',
    params: { orgId },
  });

/**
 * @description: 获取机构菜单权限树
 */
export const getMenuTree = (orgId: string, systemId?: string, status?: number) =>
  defHttp.get<RbacMenuTreeDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select/tree',
    params: { orgId, status, systemId },
  });

/**
 * @description: 获取有效的资源列表
 */
export const selectResourceList = (type?: number) =>
  defHttp.get<RbacResourceDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select-resource/list',
    params: { type },
  });

/**
 * @description: 资源api表分页查询
 */
export const selectResourcePage = (data: RbacResourceApiPageVo) =>
  defHttp.post<PageDto<RbacResourceApiPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org/select-resource-api/page',
    data,
  });

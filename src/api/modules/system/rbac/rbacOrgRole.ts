import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { SuccessMessageMode } from '/#/axios';
import {
  RbacOrgRolePageDto,
  RbacOrgRolePageVo,
  RbacRoleEffectiveDto,
  RbacOrgRoleDto,
  RbacOrgRoleMenuButtonDto,
  RbacOrgRoleVo,
  RbacOrgRoleAuthVo,
} from './model/rbacOrgRoleModel';
import { PageDto } from '/@/api/model/baseModel';
/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacOrgRolePageVo) =>
  defHttp.post<PageDto<RbacOrgRolePageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/select/page',
    data,
  });

/**
 * @description: 详情
 */
export const getById = (roleId: string) =>
  defHttp.get<RbacOrgRoleDto>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/select/one/{roleId}',
    params: { roleId },
  });

/**
 * @description: 修改角色状态
 */
export const updateStatus = (roleId: string, status: number) =>
  defHttp.get<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-org-role/update/status',
      params: { roleId, status },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 逻辑删除
 */
export const deleteById = (roleId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-org-role/delete-one/{roleId}',
      params: { roleId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 获取有效的角色
 */
export const getEffectiveRoles = () =>
  defHttp.get<RbacRoleEffectiveDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/select/role-info',
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacOrgRoleVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/insert',
    data,
  });

/**
 * @description: 获取某个角色菜单按钮权限信息
 */
export const getMenuActionById = (roleId: string) =>
  defHttp.get<RbacOrgRoleMenuButtonDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/select/menu-action/{roleId}',
    params: { roleId },
  });

/**
 * @description: 修改
 */
export const update = (data: RbacOrgRoleVo, roleId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/update/{roleId}',
    data: { ...data, roleId },
  });

/**
 * @description: 关联角色权限信息
 */
export const updateAuth = (data: RbacOrgRoleAuthVo, roleId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-org-role/update-auth/{roleId}',
    data: { ...data, roleId },
  });

/**
 * @description: 同步流程引擎
 */
export const syncProcess = (mode: SuccessMessageMode = 'notification') =>
  defHttp.get<String>(
    { url: SysUrlPrefix.SYSTEM + '/rbac-org-role/sync/process' },
    { successMessageMode: mode },
  );

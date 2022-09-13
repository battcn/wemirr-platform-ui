import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  RbacMenuPageVo,
  RbacMenuPageDto,
  RbacMenuTreeDto,
  RbacMenuVo,
  RbacMenuDto,
} from './model/rbacMenuModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacMenuPageVo) =>
  defHttp.post<PageDto<RbacMenuPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-menu/select/page',
    data,
  });

/**
 * @description: 获取菜单权限树
 */
export const getMenuTree = (type?: string, systemId?: string, status?: number) =>
  defHttp.get<RbacMenuTreeDto[]>({
    url: SysUrlPrefix.SYSTEM + '/rbac-menu/select/tree',
    params: { type, status, systemId },
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacMenuVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-menu/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: RbacMenuVo, menuId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-menu/update/{menuId}',
    data: { ...data, menuId },
  });

/**
 * @description: 详情
 */
export const getById = (menuId: string) =>
  defHttp.get<RbacMenuDto>({
    url: SysUrlPrefix.SYSTEM + '/rbac-menu/select/one/{menuId}',
    params: { menuId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (menuId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-menu/delete-one/{menuId}',
      params: { menuId },
    },
    { successMessageMode: 'notification' },
  );

import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  RbacSystemDto,
  RbacSystemVo,
  RbacSystemPageVo,
  RbacSystemPageDto,
} from './model/rbacSystemModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 获取有效的系统类表
 */
export const getList = () =>
  defHttp.get<RbacSystemDto[]>({ url: SysUrlPrefix.SYSTEM + '/rbac-system/select/list' });

/**
 * @description: 权限表分页查询
 */
export const selectPage = (data: RbacSystemPageVo) =>
  defHttp.post<PageDto<RbacSystemPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-system/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacSystemVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-system/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: RbacSystemVo, systemId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-system/update/{systemId}',
    data: { ...data, systemId },
  });

/**
 * @description: 详情
 */
export const getById = (systemId: string) =>
  defHttp.get<RbacSystemDto>({
    url: SysUrlPrefix.SYSTEM + '/rbac-system/select/one/{systemId}',
    params: { systemId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (systemId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-system/delete-one/{orgId}',
      params: { systemId },
    },
    { successMessageMode: 'notification' }
  );

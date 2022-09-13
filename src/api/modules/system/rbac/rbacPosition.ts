import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  RbacPositionDto,
  RbacPositionPageVo,
  RbacPositionPageDto,
  RbacPositionVo,
} from './model/rbacPositionModel';
import { PageDto } from '/@/api/model/baseModel';
/**
 * @description: 获取职位列表
 */
export const getAllList = () =>
  defHttp.get<RbacPositionDto[]>({ url: SysUrlPrefix.SYSTEM + '/rbac-position/select/list-all' });

/**
 * @description: 分页查询
 */
export const selectPage = (data: RbacPositionPageVo) =>
  defHttp.post<PageDto<RbacPositionPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/rbac-position/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: RbacPositionVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-position/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: RbacPositionVo, positionId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/rbac-position/update/{positionId}',
    data: { ...data, positionId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (positionId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/rbac-position/delete-one/{positionId}',
      params: { positionId },
    },
    { successMessageMode: 'notification' }
  );

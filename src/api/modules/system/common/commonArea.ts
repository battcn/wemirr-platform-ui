import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  CommonAreaPageVo,
  CommonAreaPageDto,
  CommonAreaVo,
  CommonAreaDto,
  CommonAreaTreeDto,
} from './model/commonAreaModel';
import { PageDto } from '/@/api/model/baseModel';
/**
 * @description: 分页查询
 */
export const selectPage = (data: CommonAreaPageVo) =>
  defHttp.post<PageDto<CommonAreaPageDto>>({
    url: SysUrlPrefix.SYSTEM + '/common-area/select/page',
    data,
  });

/**
 * @description: 新增
 */
export const insert = (data: CommonAreaVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.AUTH + '/common-area/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: CommonAreaVo, positionId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.AUTH + '/common-area/update/{positionId}',
    data: { ...data, positionId },
  });

/**
 * @description: 详情
 */
export const getById = (areaId: string) =>
  defHttp.get<CommonAreaDto>({
    url: SysUrlPrefix.AUTH + '/rbac-user/select/one/{areaId}',
    params: { areaId },
  });

/**
 * @description: 表逻辑删除
 */
export const deleteById = (areaId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/common-area/delete-one/{areaId}',
      params: { areaId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 通过上级区域编码获取下级
 */
export const getList = (parentId: string, activateAreaId?: string) =>
  defHttp.get<CommonAreaTreeDto[]>({
    url: SysUrlPrefix.SYSTEM + '/common-area/select/list',
    params: { parentId, activateAreaId },
  });

import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  ManageCustomFilterVo,
  ManageCustomFilterListDto,
  ManageCustomFilterDetailDto,
  ManageCustomFilterSimpleDto,
} from './model/manageCustomFilterModel';

/**
 * @description: 新增
 */
export const insert = (data: ManageCustomFilterVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-custom-filter/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: ManageCustomFilterVo, customFilterId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-custom-filter/update/{customFilterId}',
    data: { ...data, customFilterId },
  });

/**
 * @description: 详情
 */
export const getById = (customFilterId: string) =>
  defHttp.get<ManageCustomFilterDetailDto>({
    url: SysUrlPrefix.SYSTEM + '/manage-custom-filter/select/one/{customFilterId}',
    params: { customFilterId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (customFilterId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/manage-custom-filter/delete-one/{customFilterId}',
      params: { customFilterId },
    },
    { successMessageMode: 'notification' }
  );

/**
 * @description: 查询服务自定义过滤器
 */
export const selectList = (serviceId: string) =>
  defHttp.get<ManageCustomFilterListDto[]>({
    url: SysUrlPrefix.SYSTEM + '/manage-custom-filter/select/list/{serviceId}',
    params: { serviceId },
  });

/**
 * @description: 查询服务自定义过滤器(无特殊url信息，并且是有效的)
 */
export const selectSimpleList = (serviceId: string) =>
  defHttp.get<ManageCustomFilterSimpleDto[]>({
    url: SysUrlPrefix.SYSTEM + '/manage-custom-filter/select/list-simple/{serviceId}',
    params: { serviceId },
  });

/**
 * @description: 通过过滤器id修改过滤器状态
 */
export const updateStatus = (customFilterId: string, state: number) =>
  defHttp.get<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/manage-custom-filter/update-status',
      params: { customFilterId, state },
    },
    { successMessageMode: 'notification' }
  );

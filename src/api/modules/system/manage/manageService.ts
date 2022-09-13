import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { SuccessMessageMode } from '/#/axios';
import {
  ValidServiceInfoDto,
  InstancePageVo,
  ManageServicePageVo,
  ManageServicePageDto,
  ManageServiceVo,
  ManageServiceDto,
  NacosUpdateInstanceVo,
  ServiceInstancePageDto,
  SystemStatDto,
} from './model/manageServiceModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 获取有效的服务列表
 */
export const getValidServiceInfo = () =>
  defHttp.get<ValidServiceInfoDto[]>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/select/list-valid-info',
  });

/**
 * @description: 手动刷新网关
 */
export const syncGateway = (mode: SuccessMessageMode = 'notification') =>
  defHttp.get<String>(
    { url: SysUrlPrefix.SYSTEM + '/manage-service//refresh-gateway' },
    { successMessageMode: mode },
  );

/**
 * @description: 分页查询
 */
export const selectPage = (data: ManageServicePageVo) =>
  defHttp.post<PageDto<ManageServicePageDto>>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/select/page',
    data,
  });

/**
 * @description: 分页查询实例
 */
export const selectInstancePage = (data: InstancePageVo) =>
  defHttp.post<PageDto<ServiceInstancePageDto>>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/select-instance/page',
    data,
  });

/**
 * @description: 实例上下线
 */
export const updateInstance = (data: NacosUpdateInstanceVo) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.SYSTEM + '/manage-service/update/service-instance',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 新增
 */
export const insert = (data: ManageServiceVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: ManageServiceVo, serviceId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/update/{serviceId}',
    data: { ...data, serviceId },
  });

/**
 * @description: 详情
 */
export const getById = (serviceId: string) =>
  defHttp.get<ManageServiceDto>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/select/one/{serviceId}',
    params: { serviceId },
  });

/**
 * @description: 逻辑删除
 */
export const deleteById = (serviceId: string) =>
  defHttp.delete<string>(
    {
      url: SysUrlPrefix.SYSTEM + '/manage-service/delete-one/{serviceId}',
      params: { serviceId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 获取系统统计
 */
export const systemStat = () =>
  defHttp.get<SystemStatDto>({
    url: SysUrlPrefix.SYSTEM + '/manage-service/stat',
  });

import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  ProcessInstanceHistoryPageVo,
  InstanceHistoryPageDto,
  DesignModelVo,
  InstanceDetailDto,
  DesignModelDto,
  DesignModelBpmnDataVo,
  InstanceStatiDto,
} from './model/instanceManageModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 分页查询
 */
export const selectPage = (data: ProcessInstanceHistoryPageVo) =>
  defHttp.post<PageDto<InstanceHistoryPageDto>>({
    url: SysUrlPrefix.PROCESS + '/manage-instance/select/process-instance/page',
    data,
  });

/**
 * @description: 获取流程实例详细
 */
export const getInstanceDetail = (processInstanceId: string) =>
  defHttp.get<InstanceDetailDto>({
    url: SysUrlPrefix.PROCESS + '/manage-instance/select/detail/{processInstanceId}',
    params: { processInstanceId },
  });

/**
 * @description: 新增
 */
export const insert = (data: DesignModelVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.PROCESS + '/design-model/insert',
    data,
  });

/**
 * @description: 修改
 */
export const update = (data: DesignModelVo, modelId: string) =>
  defHttp.put<String>({
    url: SysUrlPrefix.PROCESS + '/design-model/update/{modelId}',
    data: { ...data, modelId },
  });

/**
 * @description: 详情
 */
export const getById = (modelId: string) =>
  defHttp.get<DesignModelDto>({
    url: SysUrlPrefix.PROCESS + '/design-model/select/one/{modelId}',
    params: { modelId },
  });

/**
 * @description: 保存模型数据
 */
export const saveModelData = (data: DesignModelBpmnDataVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.PROCESS + '/design-model/save-model-data',
    data: { ...data },
  });

/**
 * @description: 流程实例统计
 */
export const statistics = () =>
  defHttp.get<InstanceStatiDto>({
    url: SysUrlPrefix.PROCESS + '/manage-instance/instance/static',
  });

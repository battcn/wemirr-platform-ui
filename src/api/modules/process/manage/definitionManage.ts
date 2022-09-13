import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import {
  DeploymentVo,
  DeploymentHistoryVo,
  ProcessDefinitionPageVo,
  ProcessDefinitionPageDto,
  DeploymentDetailDto,
  ProcessInfoVo,
  ProcessInfoDto,
  UpdateProcessDefinitionStateVo,
} from './model/definitionManageModel';
import { PageDto } from '/@/api/model/baseModel';

/**
 * @description: 创建部署
 */
export const createDeployment = (data: DeploymentVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.PROCESS + '/manage-definition/create/deployment',
    data,
  });

/**
 * @description: 历史再次部署
 */
export const historyDeployment = (data: DeploymentHistoryVo) =>
  defHttp.post<String>({
    url: SysUrlPrefix.PROCESS + '/manage-definition/history/deployment',
    data,
  });

/**
 * @description: 分页查询流程部署信息
 */
export const selectPageDefinition = (data: ProcessDefinitionPageVo) =>
  defHttp.post<PageDto<ProcessDefinitionPageDto>>({
    url: SysUrlPrefix.PROCESS + '/manage-definition/select/page/definition/page',
    data,
  });

/**
 * @description: 删除部署
 */
export const deleteDeploymentById = (deploymentId: string) =>
  defHttp.delete<String>({
    url: SysUrlPrefix.PROCESS + '/manage-definition/delete/deployment/by-id/{deploymentId}',
    params: { deploymentId },
  });

/**
 * @description: 查询部署资源信息
 */
export const getDeploymentDetail = (processKeywordId: string) =>
  defHttp.get<DeploymentDetailDto>({
    url: SysUrlPrefix.PROCESS + '/manage-definition/select/deployment/resource/{processKeywordId}',
    params: { processKeywordId },
  });

/**
 * @description: 流程定义状态修改
 */
export const processDefinitionUpdateState = (data: UpdateProcessDefinitionStateVo) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.PROCESS + '/manage-definition/update/process-definition/state',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 获取流程详细信息
 */
export const getProcessInfo = (data: ProcessInfoVo) =>
  defHttp.post<ProcessInfoDto>({
    url: SysUrlPrefix.PROCESS + '/manage-definition/select/process-info',
    data,
  });

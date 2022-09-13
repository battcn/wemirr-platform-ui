import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { PageDto } from '/@/api/model/baseModel';
import {
  FormSubmitProcessModel,
  MsgSubmitProcessModel,
  ProcessCallbackResultModel,
  ProcessQueryPageVo,
  ProcessInstanceDetailDto,
  ProcessPageDto,
  CancelProcessVo,
  InstanceApplyInfoDto,
  ProcessUrgentVo,
  ActInstanceInfoModel,
  InstanceUserTaskDto,
} from './model/processBusinessModel';
/**
 * @description: 发起流程
 */
export const submitProcess = (data: FormSubmitProcessModel) =>
  defHttp.post<ProcessCallbackResultModel>({
    url: SysUrlPrefix.PROCESS + '/business-process/process/submit',
    data,
  });

/**
 * @description: 发起流程(消息启动)
 */
export const msgSubmitProcess = (data: MsgSubmitProcessModel) =>
  defHttp.post<ProcessCallbackResultModel>({
    url: SysUrlPrefix.PROCESS + '/business-process/process/msg-submit',
    data,
  });

/**
 * @description: 流程作废
 */
export const cancelProcess = (data: CancelProcessVo) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.PROCESS + '/business-process/process/cancel',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 催办
 */
export const urgentTask = (data: ProcessUrgentVo) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.PROCESS + '/business-process/process/urgent',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 分页查询我的申请
 */
export const selectProcessPage = (data: ProcessQueryPageVo) =>
  defHttp.post<PageDto<ProcessPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-process/select/process/page',
    data,
  });

/**
 * @description: 查询流程详情
 */
export const getSubmitDetail = (processInstanceId: string) =>
  defHttp.get<ProcessInstanceDetailDto>({
    url: SysUrlPrefix.PROCESS + '/business-process/process/select-detail/{processInstanceId}',
    params: { processInstanceId },
  });

/**
 * @description: 获取申请基本信息(包含申请表单)
 */
export const selectInstanceApplyInfo = (processInstanceId: string) =>
  defHttp.get<InstanceApplyInfoDto>({
    url: SysUrlPrefix.PROCESS + '/business-process/select/instance/apply-info/{processInstanceId}',
    params: { processInstanceId },
  });

/**
 * @description: 获取用户任务(审批意见)
 */
export const selectInstanceOptions = (processInstanceId: string) =>
  defHttp.get<InstanceUserTaskDto[]>({
    url: SysUrlPrefix.PROCESS + '/business-process/select/instance/user-task/{processInstanceId}',
    params: { processInstanceId },
  });

/**
 * @description: 获取活动实例信息(包含审批意见,用于流程图渲染)
 */
export const selectActInstanceInfos = (processInstanceId: string) =>
  defHttp.get<ActInstanceInfoModel>({
    url: SysUrlPrefix.PROCESS + '/business-process/select/instance/act-infos/{processInstanceId}',
    params: { processInstanceId },
  });

import { defHttp } from '/@/utils/http/axios';
import { SysUrlPrefix } from '/@/api/sysPrefix';
import { PageDto } from '/@/api/model/baseModel';
import {
  TaskQueryPageVo,
  TaskWaitPageDto,
  TaskHistoryPageDto,
  TaskHistoryQueryPageVo,
  CompleteTaskModel,
  EnableDismissVo,
  EnableDismissDto,
  DismissTaskModel,
  WaitUserTaskDetailModel,
} from './model/taskBusinessModel';

/**
 * @description: 分页查询一般待处理任务
 */
export const selectGeneralTaskPage = (data: TaskQueryPageVo) =>
  defHttp.post<PageDto<TaskWaitPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/general-task/page',
    data,
  });

/**
 * @description: 分页查询委托任务
 */
export const selectDelegateTaskPage = (data: TaskQueryPageVo) =>
  defHttp.post<PageDto<TaskWaitPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/delegate-task/page',
    data,
  });

/**
 * @description: 分页查询催办任务
 */
export const selectUrgentTaskPage = (data: TaskQueryPageVo) =>
  defHttp.post<PageDto<TaskWaitPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/urgent-task/page',
    data,
  });

/**
 * @description: 分页查询转办任务
 */
export const selectTurnOverTaskPage = (data: TaskQueryPageVo) =>
  defHttp.post<PageDto<TaskWaitPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/turn-over-task/page',
    data,
  });

/**
 * @description: 分页查询审批已处理任务
 */
export const selectHistoryTaskPage = (data: TaskHistoryQueryPageVo) =>
  defHttp.post<PageDto<TaskHistoryPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/history-task/page',
    data,
  });

/**
 * @description: 分页查询抄送任务
 */
export const selectCopyTaskPage = (data: TaskHistoryQueryPageVo) =>
  defHttp.post<PageDto<TaskHistoryPageDto>>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/copy-task/page',
    data,
  });

/**
 * @description: 审批
 */
export const completeTask = (data: CompleteTaskModel) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.PROCESS + '/business-task/task/complete',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 签收
 */
export const taskClaim = (taskId: string) =>
  defHttp.get<String>(
    {
      url: SysUrlPrefix.PROCESS + '/business-task/task/claim/{taskId}',
      params: { taskId },
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 获取可驳回节点
 */
export const selectEnableDismiss = (data: EnableDismissVo) =>
  defHttp.post<EnableDismissDto[]>({
    url: SysUrlPrefix.PROCESS + '/business-task/select/list/enable-dismiss',
    data,
  });

/**
 * @description: 驳回
 */
export const dismissTask = (data: DismissTaskModel) =>
  defHttp.post<String>(
    {
      url: SysUrlPrefix.PROCESS + '/business-task/task/dismiss',
      data,
    },
    { successMessageMode: 'notification' },
  );

/**
 * @description: 查询待审批任务详情
 */
export const waitTaskDetail = (taskId: string) =>
  defHttp.get<WaitUserTaskDetailModel>({
    url: SysUrlPrefix.PROCESS + '/business-task/task/wait-detail/{taskId}',
    params: { taskId },
  });

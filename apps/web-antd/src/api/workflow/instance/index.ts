import type { TaskInfo } from '../task/model';
import type { FlowInfoResponse } from './model';

import type { ID, IDS, PageQuery, PageResult } from '#/api/common';

import { requestClient } from '#/api/request';

/**
 * 根据 instanceId 查询信息
 * @param instanceId 流程实例ID
 * @returns info
 */
export function getInstanceById(instanceId: string) {
  return requestClient.get<TaskInfo>(`/workflow/flow-instances/${instanceId}`);
}

/**
 * 按照实例id删除流程实例
 * @param instanceIds 实例id
 */
export function deleteByInstanceIds(instanceIds: IDS) {
  return requestClient.delete(
    `/workflow/instance/deleteByInstanceIds/${instanceIds}`,
  );
}
/**
 * 撤销流程
 * @param data
 */
export function cancelProcessApply(data: { businessId: ID; message?: string }) {
  return requestClient.put('/workflow/instance/cancelProcessApply', data);
}
/**
 * @param businessId 业务ID
 * @returns TaskInfo
 */
export function getTaskByBusinessId(businessId: string) {
  return requestClient.get<TaskInfo>(
    `/workflow/instance/getInfo/${businessId}`,
  );
}

/**
 * 获取当前登录人发起的流程实例
 * @param params
 * @returns PageResult<Flow>
 */
export function meInstancePage(params?: PageQuery) {
  return requestClient.post<PageResult<TaskInfo>>(
    '/workflow/flow-instances/me-page',
    params,
  );
}

/**
 * 获取流程图，流程记录
 * @param instanceId 业务标识
 * @returns 流程图，流程记录
 */
export function flowInfo(instanceId: string) {
  return requestClient.get<FlowInfoResponse>(
    `/workflow/flow-instances/${instanceId}/ext-info`,
  );
}

/**
 * 获取流程变量
 * @param instanceId
 * @returns Map<string,any>
 */
export function instanceVariable(instanceId: string) {
  return requestClient.get<Record<string, any>>(
    `/workflow/instance/variable/${instanceId}`,
  );
}

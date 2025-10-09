import { defHttp } from '#/api/request';

export function getInstanceDetailByTaskId(taskId: any) {
  return defHttp.get(`/workflow/flow-instances/${taskId}/detail`);
}

export function getProcessInstanceComments(processInstanceId: any) {
  return defHttp.get(`/workflow/flow-instances/${processInstanceId}/comments`);
}

export function getFormPreviewByInstanceId(instanceId: any) {
  return defHttp.get(`/workflow/flow-instances/${instanceId}/form-preview`);
}

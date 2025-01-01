import { defHttp } from '#/api/request';

export function getInstanceDetailByTaskId(taskId: any) {
  return defHttp.get(`/bpm/process-instances/${taskId}/detail`);
}

export function getProcessInstanceComments(processInstanceId: any) {
  return defHttp.get(`/bpm/process-instances/${processInstanceId}/comments`);
}

export function getFormPreviewByInstanceId(processInstanceId: any) {
  return defHttp.get(
    `/bpm/process-instances/${processInstanceId}/form-preview`,
  );
}

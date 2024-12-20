import { defHttp } from '#/api/request';

export function CurrentApprovalDetail(taskId: any) {
  return defHttp.get(`/bpm/process_instances/${taskId}/detail`);
}

export function GetTaskApprovalRecord(processInstanceId: any) {
  return defHttp.get(
    `/bpm/process_instances/${processInstanceId}/approval_infos`,
  );
}

export function RenderFormByProcessInstanceId(processInstanceId: any) {
  return defHttp.get(`/bpm/process_instances/${processInstanceId}/render_form`);
}

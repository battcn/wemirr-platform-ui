import { defHttp } from '#/api/request';

export const GetFormConfigByModelId = (modelId: string) => {
  return defHttp.get(`/bpm/process-models/${modelId}/form-designs`);
};

export const startProcessInstance = (modelId: string, data: any) => {
  return defHttp.post(`/bpm/process-models/${modelId}/start-instance`, data);
};

export const ProcessModelGroupList = () => {
  return defHttp.get(`/bpm/process-models/group-list`);
};

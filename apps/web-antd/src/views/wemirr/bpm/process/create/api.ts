import { defHttp } from '#/api/request';

export const GetFormConfigByModelId = (modelId) => {
  return defHttp.get(`/bpm/process-models/${modelId}/form_designs`);
};

export const startProcessInstance = (modelId, data) => {
  return defHttp.post(`/bpm/process-models/${modelId}/start_instance`, data);
};

export const ProcessModelGroupList = () => {
  return defHttp.post(`/bpm/process-models/group_list`);
};

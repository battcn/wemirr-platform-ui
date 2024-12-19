import { defHttp } from '#/api/request';

export const GetFormConfigByModelId = (modelId) => {
  return defHttp.get(`/bpm/process_models/${modelId}/form_designs`);
};

export const StartProcessInstance = (modelId, data) => {
  return defHttp.post(`/bpm/process_models/${modelId}/start_instance`, data);
};

export const ProcessModelGroupList = () => {
  return defHttp.post(`/bpm/process_models/group_list`);
};

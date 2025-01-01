import { defHttp } from '#/api/request';

export function PageList(data: any) {
  return defHttp.post(`/bpm/process-models/page`, data);
}

export function AddProcessModel(data: any) {
  return defHttp.request(`/bpm/process-models/create`, {
    method: 'post',
    data,
  });
}

export function getActiveProcessCategory() {
  return defHttp.get(`/bpm/process_categories/list`, {
    params: { status: 1 },
  });
}

export function ModifyProcessModel(data: any) {
  return defHttp.request(`/bpm/process-models/${data.id}`, {
    method: 'put',
    data,
  });
}

export function GetById(id) {
  return defHttp.get(`/bpm/process-models/${id}`);
}

export function DelObj(id: string, data: any) {
  return defHttp.delete(`/bpm/process-models/${id}`, {
    data,
  });
}

export function Deploy(id: any) {
  return defHttp.post(`/bpm/process-models/${id}/deploy`);
}
export function saveFormDesign(id: any, data: any) {
  return defHttp.post(`/bpm/process-models/${id}/form-designs`, data);
}
export const getFormByModelId = (modelId: string) => {
  return defHttp.get(`/bpm/process-models/${modelId}/form-designs`);
};

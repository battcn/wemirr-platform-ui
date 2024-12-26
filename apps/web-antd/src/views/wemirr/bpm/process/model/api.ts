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

export function GetActiveProcessCategory() {
  return defHttp
    .request(`/bpm/process_categories/list`, {
      method: 'get',
      params: { state: 1 },
    })
    .then((ret) => ret.data);
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

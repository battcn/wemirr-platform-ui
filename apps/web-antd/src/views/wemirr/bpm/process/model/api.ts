import { defHttp } from '#/api/request';

export function PageList(data: any) {
  return defHttp.post(`/bpm/process_models/page`, data);
}

export function AddProcessModel(data: any) {
  return defHttp.request(`/bpm/process_models/create`, {
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
  return defHttp.request(`/bpm/process_models/${data.id}`, {
    method: 'put',
    data,
  });
}

export function GetById(id) {
  return defHttp.get(`/bpm/process_models/${id}`);
}

export function DelObj(id: string, data: any) {
  return defHttp.delete(`/bpm/process_models/${id}`, {
    data,
  });
}

export function Deploy(id: any) {
  return defHttp.post(`/bpm/process_models/${id}/deploy`);
}

import { defHttp } from '#/api/request';

export function GetList() {
  return defHttp.get('/iam/dict/list');
}

export function Refresh() {
  return defHttp.post('/iam/dict/refresh');
}

export function BatchDelete(ids: any) {
  return defHttp.request(`/iam/dict`, {
    method: 'delete',
    data: ids,
  });
}

export function AddObj(obj: any) {
  return defHttp.request('/iam/dict/create', {
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.request(`/iam/dict/${obj.id}`, {
    method: 'put',
    data: obj,
  });
}

export function DelObj(id: string) {
  return defHttp.request(`/iam/dict/${id}`, {
    method: 'delete',
    data: { id },
  });
}

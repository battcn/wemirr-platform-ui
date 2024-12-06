import { defHttp } from '#/api/request';

export function GetList() {
  return defHttp.get('/iam/tenant_dict/list');
}

export function Refresh() {
  return defHttp.post('/iam/tenant_dict/refresh');
}

export function BatchDelete(ids: any) {
  return defHttp.request(`/iam/tenant_dict`, {
    method: 'delete',
    data: ids,
  });
}

export function AddObj(obj) {
  return defHttp.request('/iam/tenant_dict/create', {
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request(`/iam/tenant_dict/${obj.id}`, {
    method: 'put',
    data: obj,
  });
}

export function DelObj(id: string) {
  return defHttp.request(`/iam/tenant_dict/${id}`, {
    method: 'delete',
    data: { id },
  });
}

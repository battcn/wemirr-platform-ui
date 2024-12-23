import { defHttp } from '#/api/request';

export function GetList() {
  return defHttp.get('/iam/tenant-dict/list');
}

export function incrSyncDict() {
  return defHttp.post('/iam/tenant-dict/incr-sync');
}

export function BatchDelete(ids: any) {
  return defHttp.request(`/iam/tenant-dict`, {
    method: 'delete',
    data: ids,
  });
}

export function AddObj(obj: any) {
  return defHttp.request('/iam/tenant-dict/create', {
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.request(`/iam/tenant-dict/${obj.id}`, {
    method: 'put',
    data: obj,
  });
}

export function DelObj(id: string) {
  return defHttp.request(`/iam/tenant-dict/${id}`, {
    method: 'delete',
    data: { id },
  });
}

import { defHttp } from '#/api/request';

export function GetList(query: any) {
  return defHttp.request('/gateway/rules/blacklist', {
    method: 'get',
    params: query,
  });
}
export function SaveOrUpdate(obj) {
  return defHttp.request('/gateway/rules/blacklist', {
    method: 'post',
    data: obj,
  });
}
export function AddObj(obj: any) {
  return defHttp.request('/gateway/rules/blacklist', {
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.request(`/gateway/rules/blacklist`, {
    method: 'post',
    data: obj,
  });
}
export function DelObj(id: any) {
  return defHttp.request(`/gateway/rules/blacklist/${id}`, {
    method: 'delete',
    data: { id },
  });
}

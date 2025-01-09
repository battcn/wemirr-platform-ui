import { defHttp } from '#/api/request';

export function GetList(query: any) {
  return defHttp.request('/gateway/rules/routes', {
    method: 'get',
    params: query,
  });
}

export function SaveOrUpdate(obj) {
  return defHttp.request('/gateway/rules/routes', {
    method: 'post',
    data: obj,
  });
}
export function DelObj(id: any) {
  return defHttp.request(`/gateway/rules/routes/${id}`, {
    method: 'delete',
    data: { id },
  });
}

export function ServiceStatus(id, status) {
  return defHttp.request(`/gateway/rules/routes/${id}/${status}`, {
    method: 'patch',
  });
}

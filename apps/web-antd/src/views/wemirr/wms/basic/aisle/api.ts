import { defHttp } from '#/api/request';

const apiPrefix = '/wms/aisles';

export function GetList(query: any) {
  return defHttp.request(`${apiPrefix}/page`, {
    method: 'POST',
    data: query,
  });
}

export function AddObj(obj: any) {
  return defHttp.request(`${apiPrefix}/create`, {
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.request(`${apiPrefix}/${obj.id}`, {
    method: 'put',
    data: obj,
  });
}

export function DelObj(id: any) {
  return defHttp.request(`${apiPrefix}/${id}`, {
    method: 'delete',
    data: { id },
  });
}

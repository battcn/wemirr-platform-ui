import { defHttp } from '#/api/request';

const apiPrefix = '/wms/stock/stocks';

export function GetList(query) {
  return defHttp.request(`${apiPrefix}/page`, {
    method: 'post',
    data: query,
  });
}
export function AddObj(obj) {
  return defHttp.post(`${apiPrefix}/create`, obj);
}

export function UpdateObj(obj) {
  return defHttp.put(`${apiPrefix}/${obj.id}/modify`, obj);
}

export function DelObj(id) {
  return defHttp.delete(`${apiPrefix}/${id}`);
}

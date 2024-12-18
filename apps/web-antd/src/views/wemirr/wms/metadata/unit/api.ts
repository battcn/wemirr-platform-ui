import { defHttp } from '#/api/request';

const apiPrefix = '/wms/metadata/units';

export function GetList(query: any) {
  return defHttp.request(`${apiPrefix}/page`, {
    method: 'post',
    data: query,
  });
}
export function AddObj(obj: any) {
  return defHttp.post(`${apiPrefix}/create`, obj);
}

export function UpdateObj(obj: any) {
  return defHttp.put(`${apiPrefix}/${obj.id}/modify`, obj);
}

export function DelObj(id: any) {
  return defHttp.delete(`${apiPrefix}/${id}`);
}

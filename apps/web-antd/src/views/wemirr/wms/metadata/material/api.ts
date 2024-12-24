import { defHttp } from '#/api/request';

const apiPrefix = '/wms/metadata/materials';

export function GetList(query: any) {
  return defHttp.post(`${apiPrefix}/page`, query);
}
export function AddObj(obj: any) {
  return defHttp.post(`${apiPrefix}/create`, obj);
}

export function UpdateObj(obj: any) {
  return defHttp.put(`${apiPrefix}/${obj.id}`, obj);
}

export function DelObj(id: any) {
  return defHttp.delete(`${apiPrefix}/${id}`);
}

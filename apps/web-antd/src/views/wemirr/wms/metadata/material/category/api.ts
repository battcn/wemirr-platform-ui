import { defHttp } from '#/api/request';

const apiPrefix = '/wms/metadata/material-categories';

export function MaterialCategoryTree(query: any) {
  return defHttp.request(`${apiPrefix}/tree`, {
    method: 'get',
    params: query,
  });
}
export function GetList(query) {
  return defHttp.post(`${apiPrefix}/page`, query);
}
export function SaveOrUpdate(obj: any) {
  return obj.id ? UpdateObj(obj) : AddObj(obj);
}
export function AddObj(obj) {
  return defHttp.request({
    url: `${apiPrefix}/create`,
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.put(`${apiPrefix}/${obj.id}`, obj);
}

export function DelObj(id) {
  return defHttp.delete(`${apiPrefix}/${id}`);
}

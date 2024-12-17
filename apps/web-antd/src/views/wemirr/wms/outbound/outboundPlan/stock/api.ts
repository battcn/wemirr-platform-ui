import { defHttp } from '#/api/request';

const apiPrefix = '/wms/inbound/receiving-plans';

export function GetList(query) {
  return defHttp.post(`${apiPrefix}/page`, query);
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

export function GetObj(obj) {
  return defHttp.request({
    url: `${apiPrefix}/detail/${obj.id}`,
    method: 'get',
  });
}

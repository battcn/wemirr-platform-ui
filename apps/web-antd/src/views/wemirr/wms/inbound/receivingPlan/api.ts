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

export function GetObj(id) {
  return defHttp.request({
    url: `${apiPrefix}/${id}/detail`,
    method: 'get',
  });
}

// 提交收货计划
export function Submit(id) {
  return defHttp.request({
    url: `${apiPrefix}/${id}/submit`,
    method: 'post',
  });
}

// 收货
export function Receiving(id) {
  return defHttp.request({
    url: `${apiPrefix}/${id}/receiving`,
    method: 'post',
  });
}

// 关闭
export function Close(id) {
  return defHttp.request({
    url: `${apiPrefix}/${id}/close`,
    method: 'post',
  });
}

// 关闭
export function Cancel(id) {
  return defHttp.request({
    url: `${apiPrefix}/${id}/cancel`,
    method: 'post',
  });
}

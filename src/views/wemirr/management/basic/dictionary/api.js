import { request } from '/src/api/service';
const apiPrefix = '/AdvancedNest';
export function GetList(query) {
  return request({
    url: '/authority/dictionaries',
    method: 'get',
    params: query,
  });
}

export function AddObj(obj) {
  return request({
    url: apiPrefix + '/add',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return request({
    url: apiPrefix + '/update',
    method: 'post',
    data: obj,
  });
}

export function DelObj(id) {
  return request({
    url: apiPrefix + '/delete',
    method: 'post',
    params: { id },
  });
}

export function GetObj(id) {
  return request({
    url: apiPrefix + '/info',
    method: 'get',
    params: { id },
  });
}

export function BatchDelete(ids) {
  return request({
    url: apiPrefix + '/batchDelete',
    method: 'post',
    data: { ids },
  });
}

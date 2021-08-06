import { request } from '/src/api/service';

export function GetList(query) {
  return request({
    url: '/gateway/rules/blacklist',
    method: 'get',
    params: query,
  });
}
export function SaveOrUpdate(obj) {
  return request({
    url: '/gateway/rules/blacklist',
    method: 'post',
    data: obj,
  });
}
export function AddObj(obj) {
  return request({
    url: '/gateway/rules/blacklist',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return request({
    url: `/gateway/rules/blacklist/${obj.id}`,
    method: 'post',
    data: obj,
  });
}
export function DelObj(id) {
  return request({
    url: `/gateway/rules/blacklist/${id}`,
    method: 'delete',
    data: { id },
  });
}

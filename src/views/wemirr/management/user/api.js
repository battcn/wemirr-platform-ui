import { request } from '/src/api/service';

export function GetList(query) {
  return request({
    url: '/authority/users',
    method: 'get',
    params: query,
  });
}

export function AddObj(obj) {
  return request({
    url: '/authority/users',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return request({
    url: `/authority/users/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id) {
  return request({
    url: `/authority/users/${id}`,
    method: 'delete',
    params: { id },
  });
}

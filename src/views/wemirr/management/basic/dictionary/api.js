import { request } from '/src/api/service';
export function GetList(query) {
  return request({
    url: '/authority/dictionaries',
    method: 'get',
    params: query,
  });
}
export function AddObj(obj) {
  return request({
    url: '/authority/dictionaries',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return request({
    url: `/authority/dictionaries/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id) {
  return request({
    url: `/authority/dictionaries/${id}`,
    method: 'delete',
    params: { id },
  });
}

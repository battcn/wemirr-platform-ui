import { request } from '/src/api/service';
export function GetList(query) {
  return request({
    url: '/tools/files',
    method: 'get',
    params: query,
  });
}
export function AddObj(obj) {
  return request({
    url: '/tools/files',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return request({
    url: `/tools/files/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id) {
  return request({
    url: `/tools/files/${id}`,
    method: 'delete',
    data: { id },
  });
}

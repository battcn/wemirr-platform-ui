import { request } from '/src/api/service';

export function SaveOrUpdate(obj) {
  if (obj.id) {
    return UpdateObj(obj);
  } else {
    return AddObj(obj);
  }
}
export function AddObj(obj) {
  return request({
    url: '/authority/org',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return request({
    url: `/authority/org/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id) {
  return request({
    url: `/authority/org/${id}`,
    method: 'delete',
    data: { id },
  });
}

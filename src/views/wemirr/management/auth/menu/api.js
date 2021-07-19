import { request } from '/src/api/service';

export function GetResourceList(query) {
  return request({
    url: '/authority/resources',
    method: 'get',
    params: query,
  });
}
export function SaveOrUpdate(obj) {
  if (obj.id) {
    return UpdateObj(obj);
  } else {
    return AddObj(obj);
  }
}
export function AddObj(obj) {
  return request({
    url: '/authority/resources',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return request({
    url: `/authority/resources/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id) {
  return request({
    url: `/authority/resources/${id}`,
    method: 'delete',
    data: { id },
  });
}

export function GetBuildStandardList(query) {
  return request({
    url: '/tools/dynamic_release_drag',
    method: 'get',
    params: query,
  });
}

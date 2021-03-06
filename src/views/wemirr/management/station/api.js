import { GET, request } from '/src/api/service';

export function GetList(query) {
  return GET('/authority/stations', query);
}

export function AddObj(obj) {
  return request({
    url: '/authority/stations',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return request({
    url: `/authority/stations/${obj.id}`,
    method: 'put',
    data: obj,
  });
}
export function DelObj(id) {
  return request({
    url: `/authority/stations/${id}`,
    method: 'delete',
    data: { id },
  });
}

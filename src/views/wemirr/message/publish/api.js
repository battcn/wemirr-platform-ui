import { request } from '/src/api/service';
export function GetList(query) {
  return request({
    url: '/authority/station_messages_publish',
    method: 'get',
    params: query,
  });
}
export function AddObj(obj) {
  return request({
    url: '/authority/station_messages_publish',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return request({
    url: `/authority/station_messages_publish/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id) {
  return request({
    url: `/authority/station_messages_publish/${id}`,
    method: 'delete',
    data: { id },
  });
}

export function SearchReceiver(type, value) {
  return request({
    url: `/authority/station_messages_publish/${type}/receivers`,
    method: 'get',
    params: { search: value },
  });
}

export function PublishMessage(id) {
  return request({
    url: `/authority/station_messages_publish/${id}/publish`,
    method: 'patch',
    data: { id },
  });
}

import { defHttp } from '@/utils/http/axios'
export function GetList(query) {
  return defHttp.request({
    url: '/authority/station_messages_publish',
    method: 'get',
    params: query,
  });
}
export function AddObj(obj) {
  return defHttp.request({
    url: '/authority/station_messages_publish',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request({
    url: `/authority/station_messages_publish/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id) {
  return defHttp.request({
    url: `/authority/station_messages_publish/${id}`,
    method: 'delete',
    data: { id },
  });
}

export function SearchReceiver(type, value) {
  return defHttp.request({
    url: `/authority/station_messages_publish/${type}/receivers`,
    method: 'get',
    params: { search: value },
  });
}

export function PublishMessage(id) {
  return defHttp.request({
    url: `/authority/station_messages_publish/${id}/publish`,
    method: 'patch',
    data: { id },
  });
}

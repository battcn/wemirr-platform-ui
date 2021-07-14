import { request } from '/src/api/service';
export function GetList(query) {
  return request({
    url: '/authority/station_messages/my',
    method: 'get',
    params: query,
  });
}
export function DelObj(id) {
  return request({
    url: `/authority/station_messages/${id}`,
    method: 'delete',
    data: { id },
  });
}

export function BatchDelete(ids) {
  return request({
    url: `/authority/station_messages`,
    method: 'delete',
    data: ids,
  });
}

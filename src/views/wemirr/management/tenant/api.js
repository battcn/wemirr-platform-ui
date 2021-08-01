import { request } from '/src/api/service';

export function BatchDelete(ids) {
  return request({
    url: `/authority/station_messages`,
    method: 'delete',
    data: ids,
  });
}

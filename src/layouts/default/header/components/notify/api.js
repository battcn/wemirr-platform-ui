import { request } from '/src/api/service';
export function MarkMessage(id) {
  return request({
    url: `/authority/station_messages/${id}/mark`,
    method: 'patch',
  });
}

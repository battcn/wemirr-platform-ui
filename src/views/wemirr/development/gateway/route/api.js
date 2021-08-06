import { request } from '/src/api/service';

export function GetList(query) {
  return request({
    url: '/gateway/rules/routes',
    method: 'get',
    params: query,
  });
}

export function SaveOrUpdate(obj) {
  return request({
    url: '/gateway/rules/routes',
    method: 'post',
    data: obj,
  });
}
export function DelObj(id) {
  return request({
    url: `/gateway/rules/routes/${id}`,
    method: 'delete',
    data: { id },
  });
}

export function ServiceStatus(id, status) {
  return request({
    url: `/gateway/rules/routes/${id}/${status}`,
    method: 'patch',
  });
}

import { defHttp } from '#/api/request';

export function AddObj(data: any) {
  return defHttp.request('/tms/fleets/create', {
    method: 'post',
    data,
  });
}
export function UpdateObj(data: any) {
  return defHttp.request(`/tms/fleets/${data.id}`, {
    method: 'put',
    data,
  });
}
export function PageList(data: any) {
  return defHttp.request('/tms/fleets/page', {
    method: 'post',
    data,
  });
}

export function DelObj(id: any) {
  return defHttp.request(`/tms/fleets/${id}`, {
    method: 'delete',
    data: { id },
  });
}

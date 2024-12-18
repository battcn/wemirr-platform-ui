import { defHttp } from '#/api/request';

export function AddObj(data: any) {
  return defHttp.request('/tms/part_purchases/create', {
    method: 'post',
    data,
  });
}
export function UpdateObj(data: any) {
  return defHttp.request(`/tms/part_purchases/${data.id}`, {
    method: 'put',
    data,
  });
}
export function PageList(data: any) {
  return defHttp.request('/tms/part_purchases/page', {
    method: 'post',
    data,
  });
}

export function DelObj(id: any) {
  return defHttp.request(`/tms/part_purchases/${id}`, {
    method: 'delete',
    data: { id },
  });
}

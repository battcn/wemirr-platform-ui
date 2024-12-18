import { defHttp } from '#/api/request';

export function AddObj(data: any) {
  return defHttp.request('/tms/accidents/create', {
    method: 'post',
    data,
  });
}
export function UpdateObj(data: any) {
  return defHttp.request(`/tms/accidents/${data.id}`, {
    method: 'put',
    data,
  });
}
export function PageList(data: any) {
  return defHttp.request('/tms/accidents/page', {
    method: 'post',
    data,
  });
}

export function DelObj(id: any) {
  return defHttp.request(`/tms/accidents/${id}`, {
    method: 'delete',
    data: { id },
  });
}

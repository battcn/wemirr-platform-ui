import { defHttp } from '#/api/request';

export function AddObj(data: any) {
  return defHttp.request('/tms/trucks/create', {
    method: 'post',
    data,
  });
}
export function UpdateObj(data: any) {
  return defHttp.request(`/tms/trucks/${data.id}`, {
    method: 'put',
    data,
  });
}
export function PageList(data: any) {
  return defHttp.request('/tms/trucks/page', {
    method: 'post',
    data,
  });
}

export function DelObj(id: any) {
  return defHttp.request(`/tms/trucks/${id}`, {
    method: 'delete',
    data: { id },
  });
}

import { defHttp } from '#/api/request';

export function AddObj(data: any) {
  return defHttp.request('/tms/peccancy/create', {
    method: 'post',
    data,
  });
}
export function UpdateObj(data: any) {
  return defHttp.request(`/tms/peccancy/${data.id}`, {
    method: 'put',
    data,
  });
}
export function PageList(data: any) {
  return defHttp.request('/tms/peccancy/page', {
    method: 'post',
    data,
  });
}

export function DelObj(id: any) {
  return defHttp.request(`/tms/peccancy/${id}`, {
    method: 'delete',
    data: { id },
  });
}

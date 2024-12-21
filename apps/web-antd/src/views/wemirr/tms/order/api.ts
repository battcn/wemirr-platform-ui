import { defHttp } from '#/api/request';

export function GetInfo(id: any) {
  return defHttp
    .request(`/tms/orders/${id}/detail`, {
      method: 'GET',
    })
    .then((ret) => ret.data);
}

export function AddObj(data: any) {
  return defHttp.request('/tms/orders/create', {
    method: 'post',
    data,
  });
}
export function UpdateObj(data: any) {
  return defHttp.request(`/tms/orders/${data.id}`, {
    method: 'put',
    data,
  });
}
export function PageList(data: any) {
  return defHttp.request('/tms/orders/page', {
    method: 'post',
    data,
  });
}

export function DelObj(id: any) {
  return defHttp.request(`/tms/orders/${id}`, {
    method: 'delete',
    data: { id },
  });
}

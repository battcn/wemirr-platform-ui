import { defHttp } from '#/api/request';

export function GetInfo(id: any) {
  return defHttp.request({
    url: `/wms/receiving_appointments/${id}/detail`,
    method: 'GET',
  });
}

export function AddObj(data: any) {
  return defHttp.request({
    url: '/wms/receiving_appointments/create',
    method: 'post',
    data,
  });
}
export function UpdateObj(data: any) {
  return defHttp.request({
    url: `/wms/receiving_appointments/${data.id}`,
    method: 'put',
    data,
  });
}
export function PageList(data: any) {
  return defHttp.request({
    url: '/wms/receiving_appointments/page',
    method: 'post',
    data,
  });
}

export function DelObj(id: any) {
  return defHttp.request({
    url: `/wms/receiving_appointments/${id}`,
    method: 'delete',
    data: { id },
  });
}

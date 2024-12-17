import { defHttp } from '#/api/request';

export function GetInfo(id: any) {
  return defHttp.request({
    url: `/wms/scan_orders/${id}/detail`,
    method: 'GET',
  });
}

export function AddObj(data: any) {
  return defHttp.request({
    url: '/wms/scan_orders/create',
    method: 'post',
    data,
  });
}
export function UpdateObj(data: any) {
  return defHttp.request({
    url: `/wms/scan_orders/${data.id}`,
    method: 'put',
    data,
  });
}
export function PageList(data: any) {
  return defHttp.request({
    url: '/wms/scan_orders/page',
    method: 'post',
    data,
  });
}

export function DelObj(id: any) {
  return defHttp.request({
    url: `/wms/scan_orders/${id}`,
    method: 'delete',
    data: { id },
  });
}

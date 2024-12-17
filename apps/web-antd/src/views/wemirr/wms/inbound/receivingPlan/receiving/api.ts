import { defHttp } from '#/api/request';

export function GetInfo(id: any) {
  return defHttp.request({
    url: `/wms/inbound/receiving-plans/${id}/detail`,
    method: 'GET',
  });
}

export function AddObj(data: any) {
  return defHttp.request({
    url: '/wms/inbound/receiving-plans/create',
    method: 'post',
    data,
  });
}
export function UpdateObj(data: any) {
  return defHttp.request({
    url: `/wms/inbound/receiving-plans/${data.id}`,
    method: 'put',
    data,
  });
}
export function PageList(data: any) {
  return defHttp.request({
    url: `/wms/inbound/receiving-plans/${data.receivingPlanId}/item_page`,
    method: 'get',
    params: data,
  });
}

export function DelObj(id: any) {
  return defHttp.request({
    url: `/wms/inbound/receiving-plans/${id}`,
    method: 'delete',
    data: { id },
  });
}

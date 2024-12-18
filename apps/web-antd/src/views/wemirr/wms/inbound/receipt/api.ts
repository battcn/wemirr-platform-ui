import { defHttp } from '#/api/request';

const apiPrefix = '/wms/inbound/inventory-receipts';

export function GetList(query: any) {
  return defHttp.post(`${apiPrefix}/page`, query);
}

export function AddObj(obj: any) {
  return defHttp.request({
    url: `${apiPrefix}/create`,
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  console.log(obj.items);
  const items = obj.items.map((item: any) => ({
    id: item.id,
    locationId: item.locationId,
  }));
  return defHttp.request({
    url: `${apiPrefix}/${obj.id}`,
    method: 'put',
    data: { id: obj.id, items },
  });
}

export function DelObj(id: any) {
  return defHttp.delete(`${apiPrefix}/${id}`);
}

export function GetObj(id) {
  return defHttp.request({
    url: `${apiPrefix}/${id}/detail`,
    method: 'get',
  });
}

// 确认入库
export function Submit(id) {
  return defHttp.request({
    url: `${apiPrefix}/${id}/submit`,
    method: 'post',
  });
}

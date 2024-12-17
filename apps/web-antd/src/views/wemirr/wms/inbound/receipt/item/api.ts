import { defHttp } from '#/api/request';

const apiPrefix = '/wms/inbound/inventory-receipts';

export function UpdateObj(obj) {
  return defHttp.request({
    url: `${apiPrefix}/item/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id) {
  return defHttp.request({
    url: `${apiPrefix}/item/${id}`,
    method: 'delete',
    data: { id },
  });
}

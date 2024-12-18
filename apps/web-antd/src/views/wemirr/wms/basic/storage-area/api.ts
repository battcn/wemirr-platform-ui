import { defHttp } from '#/api/request';

const apiPrefix = '/wms/storage-areas';

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
  return defHttp.request({
    url: `${apiPrefix}/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id: any) {
  return defHttp.request({
    url: `${apiPrefix}/${id}`,
    method: 'delete',
    data: { id },
  });
}

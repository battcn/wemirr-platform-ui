import { defHttp } from '#/api/request';

const apiPrefix = '/wms/basic/storage-areas';

export function GetList(query) {
  return defHttp.post(`${apiPrefix}/page`, query);
}

export function AddObj(obj) {
  return defHttp.request({
    url: `${apiPrefix}/create`,
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request({
    url: `${apiPrefix}/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id) {
  return defHttp.request({
    url: `${apiPrefix}/${id}`,
    method: 'delete',
    data: { id },
  });
}

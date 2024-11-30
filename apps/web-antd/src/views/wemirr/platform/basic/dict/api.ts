import { defHttp } from '#/api/request';

export function GetList() {
  return defHttp.request({
    url: "/iam/dict/list",
    method: "get",
  });
}

export function Refresh() {
  return defHttp.request({
    url: "/iam/dict/refresh",
    method: "post",
  });
}

export function BatchDelete(ids: any) {
  return defHttp.request({
    url: `/iam/dict`,
    method: "delete",
    data: ids,
  });
}

export function AddObj(obj) {
  return defHttp.request({
    url: "/iam/dict/create",
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request({
    url: `/iam/dict/${obj.id}`,
    method: "put",
    data: obj,
  });
}

export function DelObj(id: string) {
  return defHttp.request({
    url: `/iam/dict/${id}`,
    method: "delete",
    data: { id },
  });
}

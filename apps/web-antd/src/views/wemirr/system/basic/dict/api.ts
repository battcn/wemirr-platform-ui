import { defHttp } from '#/api/request';

export function GetList() {
  return defHttp.request({
    url: "/authority/tenant_dict/list",
    method: "get",
  });
}

export function Refresh() {
  return defHttp.request({
    url: "/authority/tenant_dict/refresh",
    method: "post",
  });
}

export function BatchDelete(ids: any) {
  return defHttp.request({
    url: `/authority/tenant_dict`,
    method: "delete",
    data: ids,
  });
}

export function AddObj(obj) {
  return defHttp.request({
    url: "/authority/tenant_dict/create",
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request({
    url: `/authority/tenant_dict/${obj.id}`,
    method: "put",
    data: obj,
  });
}

export function DelObj(id: string) {
  return defHttp.request({
    url: `/authority/tenant_dict/${id}`,
    method: "delete",
    data: { id },
  });
}

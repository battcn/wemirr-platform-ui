import { defHttp } from "@/utils/http/axios";

export function GetList() {
  return defHttp.request({
    url: "/authority/dict/list",
    method: "get",
  });
}

export function Refresh() {
  return defHttp.request({
    url: "/authority/dict/refresh",
    method: "post",
  });
}

export function BatchDelete(ids: any) {
  return defHttp.request({
    url: `/authority/dict`,
    method: "delete",
    data: ids,
  });
}

export function AddObj(obj) {
  return defHttp.request({
    url: "/authority/dict/create",
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request({
    url: `/authority/dict/${obj.id}`,
    method: "put",
    data: obj,
  });
}

export function DelObj(id: string) {
  return defHttp.request({
    url: `/authority/dict/${id}`,
    method: "delete",
    data: { id },
  });
}

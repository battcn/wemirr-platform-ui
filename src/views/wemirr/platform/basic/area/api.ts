import { defHttp } from "@/utils/http/axios";

export function GetList(query: any) {
  return defHttp.request({
    url: "/authority/areas",
    method: "get",
    params: query,
  });
}
export function GetChildrenList(parentId: string) {
  return defHttp.request({
    url: `/authority/areas/${parentId}/children`,
    method: "get",
    params: parentId,
  });
}
export function GetListTree(query: any) {
  return defHttp.request({
    url: "/authority/areas/trees",
    method: "get",
    params: query,
  });
}

export function SaveOrUpdate(obj: any) {
  return defHttp.request({
    url: "/authority/areas",
    method: "post",
    data: obj,
  });
}
export function BatchDelete(ids: any) {
  return defHttp.request({
    url: `/authority/areas`,
    method: "delete",
    data: ids,
  });
}
export function DelObj(id: string) {
  return defHttp.request({
    url: `/authority/areas/${id}`,
    method: "delete",
    data: { id },
  });
}

import { defHttp } from "@/utils/http/axios";

export function GetList(query) {
  return defHttp.request({
    url: "/authority/areas",
    method: "get",
    params: query,
  });
}
export function GetChildrenList(parentId) {
  return defHttp.request({
    url: `/authority/areas/${parentId}/children`,
    method: "get",
    params: parentId,
  });
}
export function GetListTree(query) {
  return defHttp.request({
    url: "/authority/areas/trees",
    method: "get",
    params: query,
  });
}

export function SaveOrUpdate(obj) {
  return defHttp.request({
    url: "/authority/areas",
    method: "post",
    data: obj,
  });
}
export function BatchDelete(ids) {
  return defHttp.request({
    url: `/authority/areas`,
    method: "delete",
    data: ids,
  });
}
export function DelObj(id) {
  return defHttp.request({
    url: `/authority/areas/${id}`,
    method: "delete",
    data: { id },
  });
}

import { defHttp } from '#/api/request';

export function GetList(query: any) {
  return defHttp.request({
    url: "/iam/areas",
    method: "get",
    params: query,
  });
}
export function GetChildrenList(parentId: string) {
  return defHttp.request({
    url: `/iam/areas/${parentId}/children`,
    method: "get",
    params: parentId,
  });
}
export function GetListTree(query: any) {
  return defHttp.request({
    url: "/iam/areas/trees",
    method: "get",
    params: query,
  });
}

export function SaveOrUpdate(obj: any) {
  return defHttp.request({
    url: "/iam/areas",
    method: "post",
    data: obj,
  });
}
export function BatchDelete(ids: any) {
  return defHttp.request({
    url: `/iam/areas`,
    method: "delete",
    data: ids,
  });
}
export function DelObj(id: string) {
  return defHttp.request({
    url: `/iam/areas/${id}`,
    method: "delete",
    data: { id },
  });
}

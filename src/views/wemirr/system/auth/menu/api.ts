import { defHttp } from "@/utils/http/axios";

export function GetResourceList(query: any) {
  return defHttp.request({
    url: "/authority/resources",
    method: "get",
    params: query,
  });
}
export function SaveOrUpdate(obj: any) {
  if (obj.id) {
    return UpdateObj(obj);
  } else {
    return AddObj(obj);
  }
}
export function AddObj(obj: any) {
  return defHttp.request({
    url: "/authority/resources",
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.request({
    url: `/authority/resources/${obj.id}`,
    method: "put",
    data: obj,
  });
}

export function DelObj(id: any) {
  return defHttp.request({
    url: `/authority/resources/${id}`,
    method: "delete",
    data: { id },
  });
}

export function GetBuildStandardList(query: any) {
  return defHttp.request({
    url: "/tools/dynamic_release_drag",
    method: "get",
    params: query,
  });
}

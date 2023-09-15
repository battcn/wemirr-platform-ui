import { defHttp } from "@/utils/http/axios";

export function GetList(query) {
  return defHttp.request({
    url: "/gateway/rules/limits",
    method: "get",
    params: query,
  });
}

export function AddObj(obj) {
  return defHttp.request({
    url: "/gateway/rules/limits",
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request({
    url: `/gateway/rules/limits/${obj.id}`,
    method: "put",
    data: obj,
  });
}
export function DelObj(id) {
  return defHttp.request({
    url: `/gateway/rules/limits/${id}`,
    method: "delete",
    data: { id },
  });
}

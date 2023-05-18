import { defHttp } from "@/utils/http/axios";

export function GetList(query) {
  return defHttp.request({
    url: "/gateway/rules/blacklist",
    method: "get",
    params: query,
  });
}
export function SaveOrUpdate(obj) {
  return defHttp.request({
    url: "/gateway/rules/blacklist",
    method: "post",
    data: obj,
  });
}
export function AddObj(obj) {
  return defHttp.request({
    url: "/gateway/rules/blacklist",
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request({
    url: `/gateway/rules/blacklist`,
    method: "post",
    data: obj,
  });
}
export function DelObj(id) {
  return defHttp.request({
    url: `/gateway/rules/blacklist/${id}`,
    method: "delete",
    data: { id },
  });
}

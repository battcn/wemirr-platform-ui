import { defHttp } from "@/utils/http/axios";
export function GetList(query) {
  return defHttp.request({
    url: "/tools/files",
    method: "get",
    params: query,
  });
}
export function AddObj(obj) {
  return defHttp.request({
    url: "/tools/files",
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request({
    url: `/tools/files/${obj.id}`,
    method: "put",
    data: obj,
  });
}

export function DelObj(id) {
  return defHttp.request({
    url: `/tools/files/${id}`,
    method: "delete",
    data: { id },
  });
}

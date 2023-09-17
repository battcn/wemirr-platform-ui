import { defHttp } from "@/utils/http/axios";

export function GetList(query) {
  return defHttp.get({ url: "/authority/stations", params: query });
}

export function AddObj(obj) {
  return defHttp.request({
    url: "/authority/stations",
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj) {
  return defHttp.request({
    url: `/authority/stations/${obj.id}`,
    method: "put",
    data: obj,
  });
}
export function DelObj(id) {
  return defHttp.request({
    url: `/authority/stations/${id}`,
    method: "delete",
    data: { id },
  });
}

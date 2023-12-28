import { defHttp } from "@/utils/http/axios";

export function GetList(query: any) {
  return defHttp.get({ url: "/authority/stations", params: query });
}

export function AddObj(obj: any) {
  return defHttp.request({
    url: "/authority/stations",
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.request({
    url: `/authority/stations/${obj.id}`,
    method: "put",
    data: obj,
  });
}
export function DelObj(id: string) {
  return defHttp.request({
    url: `/authority/stations/${id}`,
    method: "delete",
    data: { id },
  });
}

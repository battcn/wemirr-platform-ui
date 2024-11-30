import { defHttp } from '#/api/request';

export function GetList(query: any) {
  return defHttp.get({ url: "/iam/stations", params: query });
}

export function AddObj(obj: any) {
  return defHttp.request({
    url: "/iam/stations",
    method: "post",
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.request({
    url: `/iam/stations/${obj.id}`,
    method: "put",
    data: obj,
  });
}
export function DelObj(id: string) {
  return defHttp.request({
    url: `/iam/stations/${id}`,
    method: "delete",
    data: { id },
  });
}

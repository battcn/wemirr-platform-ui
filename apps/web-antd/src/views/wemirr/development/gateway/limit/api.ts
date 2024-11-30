import { defHttp } from '#/api/request';

export function GetList(query: any) {
  return defHttp.request("/gateway/rules/limits",{
    method: "get",
    params: query,
  });
}

export function AddObj(obj: any) {
  return defHttp.post("/gateway/rules/limits",{ data: obj });
}

export function UpdateObj(obj: any) {
  return defHttp.request(`/gateway/rules/limits/${obj.id}`,{
    method: "put",
    data: obj,
  });
}
export function DelObj(id: any) {
  return defHttp.request(`/gateway/rules/limits/${id}`,{
    method: "delete",
    data: { id },
  });
}

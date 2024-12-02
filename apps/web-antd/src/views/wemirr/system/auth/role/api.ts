import { defHttp } from '#/api/request';

export function GetList(data: any) {
  return defHttp.post( "/iam/roles/page",data);
}
export function AddObj(obj: any) {
  return defHttp.post("/iam/roles/create",obj);
}

export function UpdateObj(data: any) {
  return defHttp.put(`/iam/roles/${data.id}`,data);
}

export function DelObj(id: string) {
  return defHttp.delete( `/iam/roles/${id}`);
}

export function GetUserByRoleId(roleId: string) {
  return defHttp.get(`/iam/roles/${roleId}/users`);
}

export function DistributionUser(obj: any) {
  return defHttp.post( `/iam/roles/${obj.roleId}/users`,obj);
}

export function DistributionRoleAuthority(obj: any) {
  return defHttp.request( `/iam/roles/${obj.roleId}/authority`,{
    method: "post",
    data: obj,
  });
}

export function InitOrgList() {
  return defHttp.request("/iam/org/trees",{
    method: "get",
    params: { status: true },
  });
}

import { defHttp } from '#/api/request';

export function GetList(query: any) {
  return defHttp.post({
    url: "/iam/roles/page",
    data: query,
  });
}
export function AddObj(obj: any) {
  return defHttp.post({
    url: "/iam/roles/create",
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.put({
    url: `/iam/roles/${obj.id}`,
    data: obj,
  });
}

export function DelObj(id: string) {
  return defHttp.delete({
    url: `/iam/roles/${id}`,
    data: { id },
  });
}

export function GetUserByRoleId(roleId: string) {
  return defHttp.request({
    url: `/iam/roles/${roleId}/users`,
    method: "get",
  });
}

export function DistributionUser(obj: any) {
  return defHttp.request({
    url: `/iam/roles/${obj.roleId}/users`,
    method: "post",
    data: obj,
  });
}

export function DistributionRoleAuthority(obj: any) {
  return defHttp.request({
    url: `/iam/roles/${obj.roleId}/authority`,
    method: "post",
    data: obj,
  });
}

export function InitOrgList() {
  return defHttp.request({
    url: "/iam/org/trees",
    method: "get",
    params: { status: true },
  });
}

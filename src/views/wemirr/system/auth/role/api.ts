import { defHttp } from "@/utils/http/axios";

export function GetList(query: any) {
  return defHttp.get({
    url: "/tools/roles",
    params: query,
  });
}
export function AddObj(obj: any) {
  return defHttp.post({
    url: "/tools/roles",
    data: obj,
  });
}

export function UpdateObj(obj: any) {
  return defHttp.put({
    url: `/tools/roles/${obj.id}`,
    data: obj,
  });
}

export function DelObj(id: string) {
  return defHttp.delete({
    url: `/tools/roles/${id}`,
    data: { id },
  });
}

export function GetUserByRoleId(roleId: string) {
  return defHttp.request({
    url: `/authority/roles/${roleId}/users`,
    method: "get",
  });
}

export function DistributionUser(obj: any) {
  return defHttp.request({
    url: `/authority/roles/${obj.roleId}/users`,
    method: "post",
    data: obj,
  });
}

export function DistributionRoleAuthority(obj: any) {
  return defHttp.request({
    url: `/authority/roles/${obj.roleId}/authority`,
    method: "post",
    data: obj,
  });
}

export function InitOrgList() {
  return defHttp.request({
    url: "/authority/org/trees",
    method: "get",
    params: { status: true },
  });
}

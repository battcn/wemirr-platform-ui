import { defHttp } from "@/utils/http/axios";

export function GetUserByRoleId(roleId) {
  return defHttp.request({
    url: `/authority/roles/${roleId}/users`,
    method: "get",
  });
}

export function DistributionUser(obj) {
  return defHttp.request({
    url: `/authority/roles/${obj.roleId}/users`,
    method: "post",
    data: obj,
  });
}

export function GetPermissionList(roleId) {
  return defHttp.request({
    url: `/authority/roles/${roleId}/resources/permissions`,
    method: "get",
    params: roleId,
  });
}

export function DistributionRoleAuthority(obj) {
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

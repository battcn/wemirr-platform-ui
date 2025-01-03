import { defHttp } from '#/api/request';

export function GetResourceList(query: any) {
  return defHttp.request('/iam/resources/page', {
    method: 'get',
    params: query,
  });
}
export function GetList(data: any) {
  return defHttp.post('/iam/roles/page', data);
}
export function AddObj(obj: any) {
  return defHttp.post('/iam/roles/create', obj);
}

export function UpdateObj(data: any) {
  return defHttp.put(`/iam/roles/${data.id}`, data);
}

export function DelObj(id: string) {
  return defHttp.delete(`/iam/roles/${id}`);
}

export function getUserByRoleId(roleId: string) {
  return defHttp.get(`/iam/roles/${roleId}/users`);
}
export function getRolePermissions(roleId: string) {
  return defHttp.get(`/iam/roles/${roleId}/permissions`);
}
export function assignUser(obj: any) {
  return defHttp.put(`/iam/roles/${obj.roleId}/assign-users`, obj);
}

export function assignResource(obj: any) {
  return defHttp.put(`/iam/roles/${obj.roleId}/assign-resources`, obj);
}

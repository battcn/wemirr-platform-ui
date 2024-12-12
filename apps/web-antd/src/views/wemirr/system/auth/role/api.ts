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

export function GetUserByRoleId(roleId: string) {
  return defHttp.get(`/iam/roles/${roleId}/users`);
}
export function getRolePermissions(roleId: string) {
  return defHttp
    .get(`/iam/roles/${roleId}/permissions`)
    .then((ret) => ret.data);
}
export function assignUser(obj: any) {
  return defHttp.post(`/iam/roles/${obj.roleId}/assign-user`, obj);
}

export function assignResource(obj: any) {
  return defHttp.request(`/iam/roles/${obj.roleId}/assign-resources`, {
    method: 'put',
    data: obj,
  });
}

import { request } from '/src/api/service';

export function GetList(query) {
  return request({
    url: '/authority/roles',
    method: 'get',
    params: query,
  });
}

export function AddObj(obj) {
  return request({
    url: '/authority/roles',
    method: 'post',
    data: obj,
  });
}

export function UpdateObj(obj) {
  return request({
    url: `/authority/roles/${obj.id}`,
    method: 'put',
    data: obj,
  });
}

export function DelObj(id) {
  return request({
    url: `/authority/roles/${id}`,
    method: 'delete',
    params: { id },
  });
}

export function GetUserByRoleId(roleId) {
  return request({
    url: `/authority/roles/${roleId}/users`,
    method: 'get',
    params: roleId,
  });
}

export function DistributionUser(obj) {
  return request({
    url: `/authority/roles/${obj.roleId}/users`,
    method: 'post',
    data: obj,
  });
}

export function GetPermissionList(roleId) {
  return request({
    url: `/authority/roles/${roleId}/resources/permissions`,
    method: 'get',
    params: roleId,
  });
}

export function DistributionRoleAuthority(obj) {
  return request({
    url: `/authority/roles/${obj.roleId}/authority`,
    method: 'post',
    data: obj,
  });
}

// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function GetList (query) {
  return request({
    url: '/authority/roles',
    method: 'get',
    params: query
  })
}
export function GetOrgDetails (roleId) {
  return request({
    url: `/authority/roles/${roleId}/role_rog`,
    method: 'get',
    data: { roleId }
  })
}

export function GetInfo (id) {
  return request({
    url: `/authority/roles/${id}`,
    method: 'get',
    data: { id }
  })
}

export function GetUserIdByRoleId (roleId) {
  return request({
    url: `/authority/roles/${roleId}/users`,
    method: 'get',
    prams: roleId
  })
}

export function AddObj (obj) {
  return request({
    url: '/authority/roles',
    method: 'post',
    data: obj
  })
}

export function AddUserRole (obj) {
  return request({
    url: `/authority/roles/${obj.roleId}/users`,
    method: 'post',
    data: obj
  })
}

export function AddRoleAuthority (obj) {
  return request({
    url: `/authority/roles/${obj.roleId}/authority`,
    method: 'post',
    data: obj
  })
}

export function UpdateObj (obj) {
  return request({
    url: `/authority/roles/${obj.id}`,
    method: 'put',
    data: obj
  })
}
export function DelObj (id) {
  return request({
    url: `/authority/roles/${id}`,
    method: 'delete',
    data: { id }
  })
}

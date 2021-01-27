import { request } from '@/api/service'

export function GetLoginLogList (query) {
  return request({
    url: '/authority/login_logs',
    method: 'get',
    params: query
  })
}
export function UpdateUserInfo (obj) {
  return request({
    url: `/authority/users/${obj.id}`,
    method: 'put',
    data: obj
  })
}
export function UpdatePassword (obj) {
  return request({
    url: `/authority/users/${obj.id}`,
    method: 'put',
    data: obj
  })
}

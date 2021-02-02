import { request } from '@/api/service'

export function GetList (query) {
  return request({
    url: '/gateway/rules/limits',
    method: 'get',
    params: query
  })
}

export function AddObj (obj) {
  return request({
    url: '/gateway/rules/limits',
    method: 'post',
    data: obj
  })
}

export function UpdateObj (obj) {
  return request({
    url: `/gateway/rules/limits/${obj.id}`,
    method: 'put',
    data: obj
  })
}
export function DelObj (id) {
  return request({
    url: `/gateway/rules/limits/${id}`,
    method: 'delete',
    data: { id }
  })
}

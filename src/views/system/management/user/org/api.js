import { request } from '@/api/service'

export function GetList (query) {
  return request({
    url: '/authority/org/trees',
    method: 'get',
    params: query
  })
}

export function AddObj (obj) {
  return request({
    url: '/authority/org',
    method: 'post',
    data: obj
  })
}

export function UpdateObj (obj) {
  return request({
    url: `/authority/org/${obj.id}`,
    method: 'put',
    data: obj
  })
}

export function DelObj (id) {
  return request({
    url: `/authority/org/${id}`,
    method: 'delete',
    data: { id }
  })
}

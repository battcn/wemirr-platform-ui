// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function GetList (query) {
  return request({
    url: '/authority/areas',
    method: 'get',
    params: query
  })
}
export function GetChildrenList (parentId) {
  return request({
    url: `/authority/areas/${parentId}/children`,
    method: 'get',
    params: parentId
  })
}
export function GetListTree (query) {
  return request({
    url: '/authority/areas/trees',
    method: 'get',
    params: query
  })
}

export function AddObj (obj) {
  return request({
    url: '/authority/areas',
    method: 'post',
    data: obj
  })
}

export function UpdateObj (obj) {
  return request({
    url: `/authority/areas/${obj.id}`,
    method: 'put',
    data: obj
  })
}

export function DelObj (id) {
  return request({
    url: `/authority/areas/${id}`,
    method: 'delete',
    data: { id }
  })
}

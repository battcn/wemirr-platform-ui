// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function GetList (query) {
  return request({
    url: '/tools/generates',
    method: 'get',
    params: query
  })
}
export function Download (id) {
  return request({
    url: `/tools/generates/${id}/download`,
    method: 'patch',
    responseType: 'blob',
    data: { id }
  })
}
export function AddObj (obj) {
  return request({
    url: '/tools/generates',
    method: 'post',
    data: obj
  })
}

export function UpdateObj (obj) {
  return request({
    url: `/tools/generates/${obj.id}`,
    method: 'put',
    data: obj
  })
}

export function DelObj (id) {
  return request({
    url: `/tools/generates/${id}`,
    method: 'delete',
    data: { id }
  })
}

// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function GetList (query) {
  return request({
    url: '/tools/dynamic_release_grids',
    method: 'get',
    params: query
  })
}

export function GetColumnList (query) {
  return request({
    url: `/tools/dynamic_release_grids/${query.gridId}/columns`,
    method: 'get',
    params: query
  })
}

export function AddObj (obj) {
  return request({
    url: '/tools/dynamic_release_grids',
    method: 'post',
    data: obj
  })
}

export function UpdateObj (obj) {
  return request({
    url: `/tools/dynamic_release_grids/${obj.gridId}/columns`,
    method: 'put',
    data: obj
  })
}

export function DelObj (id) {
  return request({
    url: `/tools/dynamic_release_grids/${id}`,
    method: 'delete',
    data: { id }
  })
}

// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function GetList (query) {
  return request({
    url: '/authority/login_logs',
    method: 'get',
    params: query
  })
}

export function PageList (model, query) {
  return request({
    url: `/tools/dynamic_releases/${model}/pages`,
    method: 'get',
    params: query
  })
}

export function AddObj (model, obj) {
  return request({
    url: `/tools/dynamic_releases/${model}`,
    method: 'post',
    data: obj
  })
}

export function UpdateObj (model, id, obj) {
  return request({
    url: `/tools/dynamic_releases/${model}/${id}`,
    method: 'put',
    data: obj
  })
}
export function DelObj (model, id) {
  return request({
    url: `/tools/dynamic_releases/${model}/${id}`,
    method: 'delete',
    data: { id }
  })
}

export function GetCrudOptions (model) {
  return request({
    url: `/tools/dynamic_releases/${model}/curd_options`,
    method: 'get',
    params: model
  })
}

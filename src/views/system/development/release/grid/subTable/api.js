// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function GetList (model, query) {
  return request({
    url: `/tools/dynamic_releases/${model}/pages`,
    method: 'get',
    params: query
  })
}

export function GetCrudOptions (model) {
  return request({
    url: `/tools/dynamic_releases/${model}/curd_options`,
    method: 'get',
    params: model
  })
}

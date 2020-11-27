// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function GetList (query) {
  return request({
    url: '/tools/dynamic_release_datasource',
    method: 'get',
    params: query
  })
}
export function PingConnection (datasourceId) {
  return request({
    url: `/tools/dynamic_release_datasource/${datasourceId}/ping`,
    method: 'get',
    params: datasourceId
  })
}
export function AddObj (obj) {
  return request({
    url: '/tools/dynamic_release_datasource',
    method: 'post',
    data: obj
  })
}

export function UpdateObj (obj) {
  return request({
    url: `/tools/dynamic_release_datasource/${obj.id}`,
    method: 'put',
    data: obj
  })
}

export function DelObj (id) {
  return request({
    url: `/tools/dynamic_release_datasource/${id}`,
    method: 'delete',
    data: { id }
  })
}

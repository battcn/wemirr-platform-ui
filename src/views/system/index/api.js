// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function getDashboards (query) {
  return request({
    url: '/authority/dashboards',
    method: 'get',
    params: query
  })
}

export function DelObj (id) {
  return request({
    url: `/authority/users/${id}`,
    method: 'delete',
    data: { id }
  })
}

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

export function DelObj (id) {
  return request({
    url: `/authority/users/${id}`,
    method: 'delete',
    data: { id }
  })
}

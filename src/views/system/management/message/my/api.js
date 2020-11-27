// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function GetMyMessageList (query) {
  return request({
    url: '/authority/station_messages/my',
    method: 'get',
    params: query
  })
}
export function DelObj (id) {
  return request({
    url: `/authority/station_messages/${id}`,
    method: 'delete',
    data: { id }
  })
}

// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function PublishMessage (obj) {
  return request({
    url: '/authority/station_messages',
    method: 'post',
    data: obj
  })
}

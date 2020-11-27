// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function AddObj (obj) {
  return request({
    url: '/tools/dynamic_release_generates',
    method: 'post',
    data: obj
  })
}


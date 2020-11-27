// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function GetList (query) {
  return request({
    url: '/authority/stations',
    method: 'get',
    params: query
  })
}

export function AddObj (obj) {
  return request({
    url: '/authority/stations',
    method: 'post',
    data: obj
  })
}

export function UpdateObj (obj) {
  return request({
    url: `/authority/stations/${obj.id}`,
    method: 'put',
    data: obj
  })
}
export function DelObj (id) {
  return request({
    url: `/authority/stations/${id}`,
    method: 'delete',
    data: { id }
  })
}

// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function GetRouter (query) {
  return request({
    url: '/authority/resources/router',
    method: 'get',
    params: query
  })
}

export function GetResourceList (query) {
  return request({
    url: '/authority/resources',
    method: 'get',
    params: query
  })
}
//
// export function allTree (query) {
//   return request({
//     url: '/authority/resources/router',
//     method: 'get',
//     params: query
//   })
// }

export function AddObj (obj) {
  return request({
    url: '/authority/resources',
    method: 'post',
    data: obj
  })
}

export function AddResourceObj (obj) {
  return request({
    url: '/authority/resources',
    method: 'post',
    data: obj
  })
}

export function UpdateObj (obj) {
  return request({
    url: `/authority/resources/${obj.id}`,
    method: 'put',
    data: obj
  })
}
export function UpdateResourceObj (obj) {
  return request({
    url: `/authority/resources/${obj.id}`,
    method: 'put',
    data: obj
  })
}

export function DelObj (id) {
  return request({
    url: `/authority/resources/${id}`,
    method: 'delete',
    data: { id }
  })
}
export function DelResourceById (id) {
  return request({
    url: `/authority/resources/${id}`,
    method: 'delete',
    data: { id }
  })
}

// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import {request} from '@/api/service'

export function GetList(query) {
  return request({
    url: '/tools/dynamic_release_drag_push_servers',
    method: 'get',
    params: query
  })
}

export function GetDragList(query) {
  return request({
    url: '/tools/dynamic_release_drag',
    method: 'get',
    params: query
  })
}

export function BindBuildModel(pushId, ids) {
  return request({
    url: `/tools/dynamic_release_drag_push_servers/${pushId}/binding`,
    method: 'put',
    data: ids
  })
}

export function AddObj(obj) {
  return request({
    url: '/tools/dynamic_release_drag_push_servers',
    method: 'post',
    data: obj
  })
}

export function UpdateObj(obj) {
  return request({
    url: `/tools/dynamic_release_drag_push_servers/${obj.id}`,
    method: 'put',
    data: obj
  })
}

export function DelObj(id) {
  return request({
    url: `/tools/dynamic_release_drag_push_servers/${id}`,
    method: 'delete',
    data: {id}
  })
}

// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function PageList (model, query) {
  return request({
    url: `/tools/dynamic_release_drag/${model}/pages`,
    method: 'post',
    data: query
  })
}
export function Download (model,content) {
  return request({
    url: `/tools/dynamic_release_drag/${model}/export`,
    method: 'patch',
    responseType: 'blob',
    data: content
  })
}
export function AddObj (model, obj) {
  return request({
    url: `/tools/dynamic_release_drag/${model}`,
    method: 'post',
    data: obj
  })
}

export function UpdateObj (model, id, obj) {
  return request({
    url: `/tools/dynamic_release_drag/${model}/${id}`,
    method: 'put',
    data: obj
  })
}
export function DelObj (model, id) {
  return request({
    url: `/tools/dynamic_release_drag/${model}/${id}`,
    method: 'delete',
    data: { id }
  })
}

export function BatchDel (model, ids) {
  return request({
    url: `/tools/dynamic_release_drag/${model}/batch_delete`,
    method: 'delete',
    data: { ids }
  })
}

export function GetCrudOptions (model) {
  return request({
    url: `/tools/dynamic_release_drag/${model}/curd_options`,
    method: 'get',
    params: model
  })
}

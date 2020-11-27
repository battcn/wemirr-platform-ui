// 请求真实后端
// import { request } from '@/api/service'

// 请求模拟数据
import { request } from '@/api/service'

export function GetList (query) {
  return request({
    url: '/authority/dictionaries',
    method: 'get',
    params: query
  })
}

export function GetItemList (query) {
  return request({
    url: `/authority/dictionaries/${query === undefined || query.id === undefined ? 0 : query.id}/items`,
    method: 'get',
    params: query
  })
}

export function AddObj (obj) {
  return request({
    url: '/authority/dictionaries',
    method: 'post',
    data: obj
  })
}

export function AddItemObj (dictionaryId, obj) {
  return request({
    url: `/authority/dictionaries/${dictionaryId}/items`,
    method: 'post',
    data: obj
  })
}

export function UpdateObj (obj) {
  return request({
    url: `/authority/dictionaries/${obj.id}`,
    method: 'put',
    data: obj
  })
}

export function UpdateItemObj (dictionaryItemId, obj) {
  return request({
    url: `/authority/dictionaries/${dictionaryItemId}/items/${obj.id}`,
    method: 'put',
    data: obj
  })
}

export function DelObj (id) {
  return request({
    url: `/authority/dictionaries/${id}`,
    method: 'delete',
    data: { id }
  })
}

export function DelItemObj (dictionaryId, dictionaryItemId) {
  return request({
    url: `/authority/dictionaries/${dictionaryItemId}/items/${dictionaryItemId}`,
    method: 'delete'
  })
}

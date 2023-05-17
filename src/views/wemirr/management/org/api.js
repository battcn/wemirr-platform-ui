import { defHttp } from '@/utils/http/axios'

export function SaveOrUpdate(obj) {
  if (obj.id) {
    return UpdateObj(obj)
  } else {
    return AddObj(obj)
  }
}
export function AddObj(obj) {
  return defHttp.request({
    url: '/authority/org',
    method: 'post',
    data: obj
  })
}

export function UpdateObj(obj) {
  return defHttp.request({
    url: `/authority/org/${obj.id}`,
    method: 'put',
    data: obj
  })
}

export function DelObj(id) {
  return defHttp.request({
    url: `/authority/org/${id}`,
    method: 'delete',
    data: { id }
  })
}

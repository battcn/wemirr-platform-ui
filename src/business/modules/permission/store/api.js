import { request } from '@/api/service'

export function getPermissions () {
  return request({
    url: '/authority/resources/router',
    method: 'get'
  })
}

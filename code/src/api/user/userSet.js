import request from '@/utils/request'

export function getUserInfo() {
  return request({
    url: '/person/custom/me',
    method: 'get'
  })
}

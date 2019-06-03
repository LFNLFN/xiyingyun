import request from '@/utils/request'

export function getStsToken(params) {
  return request({
    url: '/sts/get',
    method: 'get'
  })
}

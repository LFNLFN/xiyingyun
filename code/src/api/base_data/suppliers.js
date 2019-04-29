import request from '@/utils/request'

export function getSuppliers() {
  return request({
    url: '/authorize/me',
    method: 'get'
  })
}

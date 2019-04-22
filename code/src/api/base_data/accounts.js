import request from '@/utils/request'

export function getUsers(paramObj) {
  return request({
    url: '/user',
    method: 'get',
    params: paramObj
  })
}

export function addStaff(paramObj) {
  return request({
    url: '/user',
    method: 'post',
    data: JSON.stringify(paramObj)
  })
}

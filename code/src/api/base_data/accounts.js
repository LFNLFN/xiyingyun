import request from '@/utils/request'

// 获取员工列表
export function getUsers(paramObj) {
  return request({
    url: '/user',
    method: 'get',
    params: paramObj
  })
}

// 增加员工
export function addStaff(paramObj) {
  return request({
    url: '/user',
    method: 'post',
    data: JSON.stringify(paramObj)
  })
}

// 修改密码
export function resetPassword(id, paramObj) {
  const url = `/user/password/${id}`
  return request({
    url: url,
    method: 'put',
    data: JSON.stringify(paramObj)
  })
}

// 禁用用户
export function disableUSer(id) {
  const url = `/user/${id}/disable`
  return request({
    url: url,
    method: 'put'
  })
}

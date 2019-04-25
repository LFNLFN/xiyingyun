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
export function addAccount(paramObj) {
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
    params: paramObj
  })
}

// 禁用用户
export function disableUser(id) {
  const url = `/user/${id}/disable`
  return request({
    url: url,
    method: 'put'
  })
}

// 启用用户
export function enableUser(id) {
  const url = `/user/${id}/enable`
  return request({
    url: url,
    method: 'put'
  })
}

import request from '@/utils/request'

// 获取员工列表
export function getUsers(paramObj) {
  return request({
    url: '/person',
    method: 'get',
    params: paramObj
  })
}

// 增加账号
export function addAccount(datas) {
  return request({
    url: '/person/custom/detail',
    method: 'post',
    data: JSON.stringify(datas)
  })
}

// 修改账号信息
export function editAccountInfo(id, datas) {
  return request({
    url: `/person/${id}`,
    method: 'put',
    data: JSON.stringify(datas)
  })
}

// // 修改密码
// export function resetPassword(id, paramObj) {
//   const url = `/user/password/${id}`
//   return request({
//     url: url,
//     method: 'put',
//     params: paramObj
//   })
// }

// 批量修改密码
export function batchResetPswd(ids, paramObj) {
  return request({
    url: '/person/batch/password',
    method: 'put',
    params: paramObj,
    data: JSON.stringify(ids)
  })
}

// // 禁用用户
// export function disableAcc(id) {
//   const url = `/user/${id}/disable`
//   return request({
//     url: url,
//     method: 'put'
//   })
// }

// // 启用用户
// export function enableAcc(id) {
//   const url = `/user/${id}/enable`
//   return request({
//     url: url,
//     method: 'put'
//   })
// }

// 批量启用/禁用用户
export function batchOperateAcc(order, ids) {
  const url = `/person/${order}`
  return request({
    url: url,
    method: 'put',
    data: JSON.stringify(ids)
  })
}

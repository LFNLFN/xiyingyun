import request from '@/utils/request'

// 获取角色列表
export function getRoles(paramsObj) {
  return request({
    url: '/role',
    method: 'get',
    parmas: paramsObj
  })
}

// 新增角色
export function addRoles(paramsObj) {
  return request({
    url: '/role',
    method: 'post',
    data: JSON.stringify(paramsObj)
  })
}

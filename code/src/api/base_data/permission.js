import request from '@/utils/request'

// 获取角色列表
export function getRoles(paramsObj) {
  return request({
    url: '/role',
    method: 'get',
    parmas: paramsObj
  })
}

// 修改角色信息
export function editRoles(paramsObj) {
  const _url = `/role/${paramsObj.id}`
  return request({
    url: _url,
    method: 'put',
    data: JSON.stringify(paramsObj)
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

// 删除角色
export function delRoles(id) {
  const _url = `/role/${id}`
  return request({
    url: _url,
    method: 'delete'
  })
}

// 查询角色用户
export function getRolesPerson(id, paramsObj) {
  const _url = `/person/roleId/${id}`
  return request({
    url: _url,
    method: 'get',
    params: paramsObj
  })
}

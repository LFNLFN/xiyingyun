import request from '@/utils/request'

// 账号管理页面中获取角色列表（权限管理也使用此接口）
export function getRoles(paramsObj) {
  return request({
    url: `/role/allRoles`,
    method: 'get',
    parmas: paramsObj
  })
}

// 在供应商页面中获取角色列表
export function getRolesInSup(paramsObj, orgType) {
  return request({
    url: `/role/orgType/${orgType}`,
    method: 'get',
    parmas: paramsObj
  })
}

// 修改角色信息
export function editRoles(paramsObj) {
  const _url = `/role/personalise/${paramsObj.id}`
  return request({
    url: _url,
    method: 'put',
    data: JSON.stringify(paramsObj)
  })
}

// 新增角色
export function addRoles(paramsObj) {
  return request({
    url: '/role/personalise',
    method: 'post',
    data: JSON.stringify(paramsObj)
  })
}

// 删除角色
export function delRoles(id) {
  const _url = `/role/personalise/${id}`
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

// 获取角色权限列表
export function getRolesPermissionList(roleId) {
  return request({
    url: `/sysPermission/role/${roleId}`,
    method: 'get'
  })
}

// 绑定角色权限
export function rolesPermissionBinding({roleId, paramArr}) {
  return request({
    url: `/sysPermission/role/${roleId}`,
    method: 'post',
    data: JSON.stringify(paramArr)
  })
}

// 解绑角色权限
export function cancelRolesPermissionBinding({roleId, paramArr}) {
  return request({
    url: `/sysPermission/role/${roleId}`,
    method: 'delete',
    data: JSON.stringify(paramArr)
  })
}
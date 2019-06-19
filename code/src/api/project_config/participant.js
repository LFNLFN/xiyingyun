import request from '@/utils/request'

// 获取参建方列表
export function getParticipant(id) {
  return request({
    url: `/project/queryOrganizational/${id}`,
    mothod: 'get'
  })
}

// 绑定参建方
export function bindParticipant(projectId, organIds) {
  return request({
    url: `/project/bindOrganizational/${projectId}`,
    method: 'put',
    data: JSON.stringify(organIds)
  })
}

// 解绑参建方
export function unBindParticipant(projectId, organIds) {
  return request({
    url: `/project/deleteOrganizational/${projectId}`,
    method: 'delete',
    data: JSON.stringify(organIds)
  })
}

// 获取参建方所以员工
export function getParticiMemers(orgId) {
  return request({
    url: `/organizational/queryPerson/${orgId}`,
    method: 'get'
  })
}

// 获取已绑定的参建方人员
export function getBindtMemebers(projectId, orgId) {
  return request({
    url: `/project/queryPerson/${projectId}/${orgId}`,
    method: 'get'
  })
}

// 绑定的参建方人员
export function bindMemebers(projectId, orgId, ids) {
  return request({
    url: `/project/bindPerson/${projectId}/${orgId}`,
    method: 'put',
    data: JSON.stringify(ids)
  })
}

// 解绑的参建方人员
export function unbindMemebers(projectId, orgId, ids) {
  return request({
    url: `/project/deletePerson/${projectId}/${orgId}`,
    method: 'delete',
    data: JSON.stringify(ids)
  })
}

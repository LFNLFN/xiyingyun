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

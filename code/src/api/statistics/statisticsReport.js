import request from '@/utils/request'

// 获取项目的整改机构
export function getdutyOrganization(projectId) {
  return request({
    url: `project/queryOrganizational/${projectId}`,
    method: 'get'
  })
}

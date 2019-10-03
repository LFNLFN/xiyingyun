import request from '@/utils/request'

// 获取工序项列表（用于新增及分页查询界面）
export function getProgressItems() {
  return request({
    url: '/acceptItem/no-paging?terms[0].column=level&terms[0].value=2',
    method: 'get'
  })
}

// 进度计划分页查询
export function getProgressPlans(params) {
  return request({
    url: '/schedulePlanMain',
    method: 'get',
    params: params
  })
}

// 获取责任人列表
export function getResponsors(projectId) {
  return request({
    url: `/project/getPersonEntityList/${projectId}`,
    method: 'get',
  })
}

// 新增进度计划
export function addProgressPlans(data) {
  return request({
    url: '/schedulePlanMain',
    method: 'post',
    data: data
  })
}

// 获取进度计划详情
export function getPlanDetail(planId) {
  return request({
    url: `/schedulePlanMain/${planId}`,
    method: 'get',
  })
}

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
    method: 'get'
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
    method: 'get'
  })
}

// 进度进度汇报分页查询
export function getProgressReports(params) {
  return request({
    url: '/scheduleReportMain/pageList',
    method: 'get',
    params: params
  })
}

// 获取进度上报详情
export function getReportDetail(reportId) {
  return request({
    url: `/scheduleReportMain/detail/${reportId}`,
    method: 'get'
  })
}

// 进度上报审批流程
export function reportApproval(data) {
  return request({
    url: '/scheduleReportMain/approval',
    method: 'post',
    data: data
  })
}

// 进度上报作废流程
export function reportInvalid(data) {
  return request({
    url: '/scheduleReportMain/invalid',
    method: 'delete',
    data: data
  })
}

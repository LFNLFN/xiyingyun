import request from '@/utils/request'

/* ----------------------------- 主体进度相关 ----------------------------------- */

// 获取工序验收项
export function getProcessItem() {
  return request({
    url: 'acceptItem/no-paging?terms[0].column=type&terms[0].value=0',
    method: 'get'
  })
}

// 获取主体进度详情
export function getMainProgress(projectId, acceptItemId) {
  return request({
    url: `processAccept/getSubjectProcess/${projectId}?acceptItemId=${acceptItemId}`,
    method: 'get'
  })
}

// 进度汇总
export function getProgressCollect(unitId) {
  return request({
    url: `/processAccept/getProcessSummary/${unitId}`,
    method: 'get'
  })
}

/* ----------------------------- 检查问题相关 ----------------------------------- */

// 获取项目未整改问题数及按时整改率
export function getOrgProblemStatistics(projectId, timeType = 1) {
  return request({
    url: `/problemCheckMain/getOrgProblemStatistics/${projectId}/${timeType}`,
    method: 'get'
  })
}

// 获取检查问题统计数据
export function getProblemStatistics(projectId, timeType = 1, params) {
  return request({
    url: `/problemCheckMain/getProblemStatistics/${projectId}/${timeType}`,
    method: 'get',
    params: params
  })
}

// 获取检查问题类型分析
export function getTypeStatistics(projectId, timeType = 1, params) {
  return request({
    url: `problemCheckMain/getTypeStatistics/${projectId}/${timeType}`,
    method: 'get',
    params: params
  })
}

/* ----------------------------- 实测实量相关 ----------------------------------- */

// 获取项目下的标段
export function getMeasureSection(projectId) {
  return request({
    url: `/project/no-paging?terms[0].column=parentId&terms[0].value=${projectId}`,
    method: 'get'
  })
}

// 获取实测实量进度
export function getMeasureProcess(bidId) {
  return request({
    url: `/measuredQuantityMain/getBidMeasuredQuantity/${bidId}`,
    method: 'get'
  })
}

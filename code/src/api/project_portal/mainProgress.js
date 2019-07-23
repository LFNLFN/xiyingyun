import request from '@/utils/request'

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

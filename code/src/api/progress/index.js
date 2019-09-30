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

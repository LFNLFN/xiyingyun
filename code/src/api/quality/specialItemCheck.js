import request from '@/utils/request'

// 专项检查分页查询
export function getSpecialItemCheck(params) {
  return request({
    url: '/problemCheckBatch',
    method: 'get',
    params: params
  })
}

// 新增专项检查批次
export function addProblemCheckBatch(param) {
  return request({
    url: `/problemCheckBatch/batch`,
    method: 'post',
    param: param
  })
}

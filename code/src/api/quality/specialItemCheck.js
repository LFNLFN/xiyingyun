import request from '@/utils/request'

// 专项检查分页查询
export function getSpecialItemCheck(params) {
  return request({
    url: '/problemCheckBatch',
    method: 'get',
    params: params
  })
}


import request from '@/utils/request'

// 获取材料类型
export function getMaterialType() {
  return request({
    url: '/metarialType/tree',
    method: 'get'
  })
}

// 分页查询材料验收数据
export function getMaterialAcceptData(params) {
  return request({
    url: '/metarialAcceptMain',
    method: 'get',
    params: params
  })
}

// 获取材料验收详情
export function getMaterialAcceptDetail(id) {
  return request({
    url: `/metarialAcceptMain/${id}`,
    method: 'get'
  })
}


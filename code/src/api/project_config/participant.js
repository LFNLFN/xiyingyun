import request from '@/utils/request'

// 获取参建方类型
export function getPartType() {
  return request({
    url: '/dictionary-item',
    method: 'get',
    params: {
      'terms[0].column': 'dict_id',
      'terms[0].value': 'supplier_type'
    }
  })
}

import request from '@/utils/request'

// 根据条件获取数据字典中的值
export function getDictionaryItem(params) {
  return request({
    url: '/dictionary-item/no-paging',
    method: 'get',
    params: params
  })
}

// 根据条件获取数据字典中的值
export function getDictionary(params) {
  return request({
    url: '/dictionary/no-paging',
    method: 'get'
  })
}

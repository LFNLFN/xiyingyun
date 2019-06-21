import request from '@/utils/request'

// 获取所有数据字典
export function getDictionary(params) {
  return request({
    url: '/dictionary/no-paging',
    method: 'get'
  })
}

// 删除数据字典
export function delDictionary(id) {
  return request({
    url: `/dictionary/${id}`,
    method: 'delete'
  })
}

// 根据条件获取数据字典item
export function getDictionaryItem(params) {
  return request({
    url: '/dictionary-item/no-paging',
    method: 'get',
    params: params
  })
}

// 新增数据字典item
export function addDictionaryItem(data) {
  return request({
    url: '/dictionary-item',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 删除数据字典Item
export function delDictionaryItem(id) {
  return request({
    url: `/dictionary-item/${id}`,
    method: 'delete'
  })
}

// 修改数据字典item
export function editDictionaryItem(id, data) {
  return request({
    url: `/dictionary-item/${id}`,
    method: 'put',
    data: JSON.stringify(data)
  })
}

// 根据条件获取数据字典中的值
export function getMenus(params) {
  return request({
    url: '/menu/no-paging',
    method: 'get'
  })
}


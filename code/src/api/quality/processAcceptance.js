import request from '@/utils/request'

// 获取工序验收信息
export function getProcessAccept(params) {
  return request({
    url: '/processAccept',
    method: 'get',
    params: params
  })
}

// 获取工序项
export function getProcessItems() {
  return request({
    url: '/acceptItem/getProfessionAcceptItemList',
    method: 'get'
  })
}

// 获取工序验收项详情
export function getProcessAcceptDetail(id) {
  return request({
    url: `/processAccept/detail/3/${id}`,
    method: 'get'
  })
}

// 获取工序验收项详情
export function invalidProcessAccept(id) {
  return request({
    url: `/processAccept/invalid/${id}`,
    method: 'delete'
  })
}

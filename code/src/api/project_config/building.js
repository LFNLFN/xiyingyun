import request from '@/utils/request'

// 新增项目楼栋
export function addBuilding(datas) {
  return request({
    url: '/unit',
    method: 'post',
    data: JSON.stringify(datas)
  })
}

// 查询项目楼栋
export function getBuliding(params) {
  return request({
    url: '/unit/no-paging',
    method: 'get',
    params: JSON.stringify(params)
  })
}

// 删除楼栋功能
export function delBuliding(id) {
  return request({
    url: `/unit/${id}`,
    method: 'delete'
  })
}

// 批量增加房间
export function addRoomsBatch(datas) {
  return request({
    url: '/room/batch',
    method: 'post',
    data: JSON.stringify(datas)
  })
}

// 获取楼栋房间信息
export function getRooms(params) {
  return request({
    url: '/room/no-paging',
    method: 'get',
    params: params
  })
}
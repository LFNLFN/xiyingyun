import request from '@/utils/request'

// 获取实测实量项
export function getMeasuerItems(params = {}) {
  return request({
    url: '/checkItem',
    method: 'get',
    params: params
  })
}

// 获取实测实量项的子项
export function getMeasItemChild(itemId) {
  return request({
    url: `checkItem/child/${itemId}`,
    method: 'get'
  })
}

// 获取实测实量的楼栋
export function getMeasBuilding(projectId, itemId) {
  return request({
    url: `/measuredQuantityMain/roomTree/${projectId}/${itemId}`,
    method: 'get'
  })
}

// 获取实测实量数据
export function getMeasureDatas(params) {
  return request({
    url: '/measuredQuantityMain',
    method: 'get',
    params: params
  })
}

// 获取实测实量详情数据
export function getMeasureDetail(projectId, unitId, partId, checkItemId) {
  return request({
    url: `/measuredQuantityMain/detail/${projectId}/${unitId}/${partId}/${checkItemId}`,
    method: 'get'
  })
}

// 根据项目获取用户类型
export function getUserType(projectId) {
  return request({
    url: `measuredQuantityMain/measuredType/${projectId}`,
    method: 'get'
  })
}

// 新增实测实量数据
export function addMeasureDatas(datas) {
  return request({
    url: '/measuredQuantityMain',
    method: 'put',
    data: datas
  })
}

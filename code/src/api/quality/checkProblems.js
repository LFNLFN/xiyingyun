import request from '@/utils/request'

// 获取问题分类
export function getProblemType(params = {}) {
  return request({
    url: '/problemCheckSetting/no-paging',
    method: 'get',
    params: params
  })
}

export function getCheckItems(type) {
  return request({
    url: `/problemCheckSetting/tree/${type}`,
    method: 'get'
  })
}

// 获取创建单位
export function getCreatedOrgan(id) {
  return request({
    url: `/project/queryProjectOrganizational/${id}`,
    method: 'get'
  })
}

// 获取创建单位人员
export function getCreatedMembers(id) {
  return request({
    url: `/project/getPersonEntityList/${id}`,
    method: 'get'
  })
}

// 获取检查问题列表
export function getCheckProblems(params) {
  return request({
    url: '/problemCheckMain',
    method: 'get',
    params: params
  })
}

// 获取检查问题详情
export function getCheckProblemDetail(id) {
  return request({
    url: `/problemCheckMain/detail/${id}`,
    method: 'get'
  })
}

// 获取检查问题平面图
export function getCheckProblemPlan(id) {
  return request({
    url: `/problemCheckMain/floorPlan/${id}`,
    method: 'get'
  })
}


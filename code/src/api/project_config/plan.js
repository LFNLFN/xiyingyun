import request from '@/utils/request'

// 获取项目所有平面图
export function getPlans(params) {
  return request({
    url: '/floorPlan',
    method: 'get',
    params: params
  })
}

// 不分页获取项目所有平面图
export function getPlansNoPage(params) {
  return request({
    url: '/floorPlan/no-paging',
    method: 'get',
    params: params
  })
}

// 添加平面图
export function addPlan(data) {
  return request({
    url: '/floorPlan',
    method: 'post',
    data: JSON.stringify(data)
  })
}

// 编辑平面图
export function editPlan(id, data) {
  return request({
    url: `/floorPlan/${id}`,
    method: 'put',
    data: JSON.stringify(data)
  })
}

// 删除平面图
export function delPlan(id) {
  return request({
    url: `/floorPlan/${id}`,
    method: 'delete'
  })
}

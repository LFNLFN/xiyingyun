import request from '@/utils/request'

/* --------------- 组织架构相关 ---------------------*/
export function getOrgType() {
  return request({
    url: '/dictionary-item',
    method: 'get',
    params: {
      'terms[0].column': 'dict_id',
      'terms[0].value': 'org_type'
    }
  })
}

// 查询组织架构
export function getOrganization(datas) {
  return request({
    url: '/organizational/tree',
    method: 'get',
    params: datas
  })
}

// 修改组织架构信息
export function editOrganization(id, datas) {
  const urlStr = `/organizational/${id}`
  return request({
    url: urlStr,
    method: 'put',
    data: JSON.stringify(datas)
  })
}

// 新增组织架构
export function addOrganization(datas) {
  return request({
    url: '/organizational',
    method: 'post',
    data: JSON.stringify(datas)
  })
}

// 删除组织机构
export function delOrganization(id) {
  const urlStr = `/organizational/${id}`
  return request({
    url: urlStr,
    method: 'delete'
  })
}

/* --------------- 岗位相关 ---------------------*/
// 增加岗位
export function addPosition(datas) {
  return request({
    url: '/position',
    method: 'post',
    data: JSON.stringify(datas)
  })
}

// 修改岗位信息
export function editPosition(id, datas) {
  const urlStr = `/position/${id}`
  return request({
    url: urlStr,
    method: 'put',
    data: JSON.stringify(datas)
  })
}

// 查询岗位
export function getPosition(datas) {
  return request({
    url: '/position',
    method: 'get',
    params: datas
  })
}

// 删除岗位
export function delPosition(id) {
  const urlStr = `/position/${id}`
  return request({
    url: urlStr,
    method: 'delete'
  })
}

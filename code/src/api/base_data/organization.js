import request from '@/utils/request'

/* --------------- 组织架构相关 ---------------------*/

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
    url: '/position/tree',
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

// 岗位人员取消绑定
export function delPostMember(id, datas) {
  const _url = `/person/batch/removePosition/${id}`
  return request({
    url: _url,
    method: 'post',
    data: JSON.stringify(datas)
  })
}

// 批量绑定岗位人员
export function addPostMember(id, datas) {
  const _url = `/person/batch/bindPosition/${id}`
  return request({
    url: _url,
    method: 'post',
    data: JSON.stringify(datas)
  })
}

/* --------------- 人员相关 ---------------------*/
// 新增人员
export function addPerson(datas) {
  return request({
    url: '/person/custom/detail',
    method: 'post',
    data: JSON.stringify(datas)
  })
}

// 获取人员信息
export function gerPersons(datas) {
  return request({
    url: '/person',
    method: 'get',
    params: datas
  })
}

// 获取某岗位的人员列表
export function gerPersonsByPost(id) {
  const _url = `/person/in-position/${id}`
  return request({
    url: _url,
    method: 'get'
  })
}

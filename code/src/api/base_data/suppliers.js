import request from '@/utils/request'

/* --------------- 供应商相关 ---------------------*/

// 查询供应商
export function getSuppliers(datas) {
  return request({
    url: '/organizational/tree',
    method: 'get',
    params: datas
  })
}

// 修改供应商信息
export function editSuppliers(id, datas) {
  const urlStr = `/organizational/${id}`
  return request({
    url: urlStr,
    method: 'put',
    data: JSON.stringify(datas)
  })
}

// 新增供应商
export function addSuppliers(datas) {
  return request({
    url: '/organizational',
    method: 'post',
    data: JSON.stringify(datas)
  })
}

// 删除组织机构
export function delSuppliers(id) {
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

// 修改人员信息
export function editPersonInfo(datas) {
  const _url = `/person/${datas.id}`
  return request({
    url: _url,
    method: 'put',
    data: JSON.stringify(datas)
  })
}

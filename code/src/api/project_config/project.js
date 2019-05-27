import request from '@/utils/request'

// 获取项目列表
export function getProjectTree() {
  return request({
    url: '/project/tree',
    method: 'get'
  })
}

// 根据条件查询项目
export function getProject(params = {}) {
  return request({
    url: '/project',
    method: 'get',
    params: params
  })
}

// 新增项目
export function addProject(datas) {
  return request({
    url: '/project',
    method: 'post',
    data: JSON.stringify(datas)
  })
}

// 修改项目
export function editProject(id, datas) {
  const _url = `/project/${id}`
  return request({
    url: _url,
    method: 'put',
    data: JSON.stringify(datas)
  })
}

// 删除项目
export function delProject(id) {
  const _url = `/project/${id}`
  return request({
    url: _url,
    method: 'delete'
  })
}

// 根据条件获取数据字典中的值
export function getDictionaryItem(params) {
  return request({
    url: '/dictionary-item',
    method: 'get',
    params: params
  })
}

// 获取分期数据
export function getProjectDetail(params = {}) {
  return request({
    url: '/project/treeWithDetail',
    method: 'get',
    params: params
  })
}

// 新增分期
export function addProjectStage(datas) {
  return request({
    url: '/project/insertWithDetail',
    method: 'post',
    data: JSON.stringify(datas)
  })
}

// 更行项目分期或者标段
export function editProjectStage(datas) {
  return request({
    url: '/project/updateWithDetail',
    method: 'put',
    data: JSON.stringify(datas)
  })
}

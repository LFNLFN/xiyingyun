import request from '@/utils/request'

// 获取项目列表
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

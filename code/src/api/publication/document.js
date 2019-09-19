import request from '@/utils/request'

// 根据类型获取文档分类树
export function getDocumentTree(type) {
  return request({
    url: `/documentClassification/tree/${type}`,
    method: 'get'
  })
}

// 新增文档分类
export function addDocumentType(params) {
  return request({
    url: `/documentClassification`,
    method: 'post',
    data: params
  })
}

// 编辑文档分类
export function editDocumentType(params) {
  return request({
    url: `/documentClassification/${params.id}`,
    method: 'put',
    data: params
  })
}

// 删除文档分类
export function deleteDocumentType(params) {
  return request({
    url: `/documentClassification/${params.id}`,
    method: 'delete'
  })
}

// 获取项目文档列表上方的项目选择清单
export function getDocumentRelatedProject(params) {
  return request({
    url: `https://api-dev.gzxiyingyun.com/project/no-paging`,
    method: 'get',
    params: params
  })
}

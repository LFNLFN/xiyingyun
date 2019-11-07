import request from '@/utils/request'

// 获取问题等级列表
export function getProblemLevelList() {
    return request({
        url: '/dictionary-item/no-paging?terms[0].column=dictId&terms[0].value=problem_level&sorts[0].name=ordinal&sorts[0].order=asc',
        method: 'get'
    })
}

// 新增问题等级
export function addProblemLevel(paramsObj) {
    return request({
        url: '/dictionary-item',
        method: 'post',
        data: JSON.stringify(paramsObj)
    })
}

// 编辑问题等级
export function editProblemLevel({ id, paramsObj }) {
    return request({
        url: `/dictionary-item/${id}`,
        method: 'put',
        data: JSON.stringify(paramsObj)
    })
}

// 删除问题等级
export function deleteProblemLevel(id) {
    return request({
        url: `/dictionary-item/${id}`,
        method: 'delete'
    })
}

// 获取默认整改期限
export function getDafaultChangeDeadline() {
    return request({
        url: '/dictionary-item/no-paging?terms[0].column=dictId&terms[0].value=default_rectification_period',
        method: 'get'
    })
}

// 编辑默认整改期限
export function editDafaultChangeDeadline({ id, paramsObj }) {
    return request({
        url: `/dictionary-item/${id}`,
        method: 'put',
        data: JSON.stringify(paramsObj)
    })
}

// 获取允许相册选择列表
export function getAllowAlbumChooseList() {
    return request({
        url: '/dictionary-item/no-paging?terms[0].column=dictId&terms[0].value=album_choose&sorts[0].name=ordinal&sorts[0].order=asc',
        method: 'get'
    })
}

// 编辑允许相册选择列表
export function editAllowAlbumChooseList({ id, paramsObj }) {
    return request({
        url: `/dictionary-item/${id}`,
        method: 'put',
        data: JSON.stringify(paramsObj)
    })
}

// 获取照片必填列表
export function getSettingPhotoList() {
    return request({
        url: '/dictionary-item/no-paging?terms[0].column=dictId&terms[0].value=photo_setting&sorts[0].name=ordinal&sorts[0].order=asc',
        method: 'get'
    })
}

// 编辑照片必填列表
export function editSettingPhotoList({ id, paramsObj }) {
    return request({
        url: `/dictionary-item/${id}`,
        method: 'put',
        data: JSON.stringify(paramsObj)
    })
}

// 获取项目关键节点列表
export function getProjectKeyNodeList() {
    return request({
        url: '/dictionary-item/no-paging?terms[0].column=dictId&terms[0].value=project_key_node&sorts[0].name=ordinal&sorts[0].order=asc',
        method: 'get'
    })
}

// 新增项目关键节点
export function addProjectKeyNode(paramsObj) {
    return request({
        url: '/dictionary-item',
        method: 'post',
        data: JSON.stringify(paramsObj)
    })
}

// 编辑项目关键节点
export function editProjectKeyNode({ id, paramsObj }) {
    return request({
        url: `/dictionary-item/${id}`,
        method: 'put',
        data: JSON.stringify(paramsObj)
    })
}

// 删除项目关键节点
export function deleteProjectKeyNode(id) {
    return request({
        url: `/dictionary-item/${id}`,
        method: 'delete'
    })
}

// 获取录入模式列表
export function getMeasuredQuantityTypeList() {
    return request({
        url: '/dictionary-item/no-paging?terms[0].column=dictId&terms[0].value=measured_quantity_type&sorts[0].name=ordinal&sorts[0].order=asc',
        method: 'get'
    })
}

// 新增录入模式
export function addMeasuredQuantityType(paramsObj) {
    return request({
        url: '/dictionary-item',
        method: 'post',
        data: JSON.stringify(paramsObj)
    })
}

// 编辑录入模式
export function editMeasuredQuantityType({ id, paramsObj }) {
    return request({
        url: `/dictionary-item/${id}`,
        method: 'put',
        data: JSON.stringify(paramsObj)
    })
}

// 删除录入模式
export function deleteMeasuredQuantityType(id) {
    return request({
        url: `/dictionary-item/${id}`,
        method: 'delete'
    })
}

// 获取精装修验收工序项数
export function getExquisiteAcceptItemNum() {
    return request({
        url: '/dictionary-item/no-paging?terms[0].column=dictId&terms[0].value=exquisite_accept_item_num',
        method: 'get'
    })
}

// 编辑精装修验收工序项数
export function editExquisiteAcceptItemNum({ id, paramsObj }) {
    return request({
        url: `/dictionary-item/${id}`,
        method: 'put',
        data: JSON.stringify(paramsObj)
    })
}
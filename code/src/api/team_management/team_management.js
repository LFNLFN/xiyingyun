import request from '@/utils/request'

// 班组管理接口

// 获取工种列表
export function getWorkTypeList() {
    return request({
        url: '/dictionary-item/no-paging?terms[0].column=dictId&terms[0].value=work_type&sorts[0].name=ordinal&sorts[0].order=asc',
        method: 'get'
    })
}

// 新增班组
export function addTeam(paramObj) {
    return request({
        url: `/organizational/supplier/${paramObj.projectId}`,
        method: 'post',
        data: JSON.stringify(paramObj)
    })
}

// 移除班组
export function deleteTeam({ projectId, orgId }) {
    return request({
        url: `/organizational/supplier/${projectId}/${orgId}`,
        method: 'delete'
    })
}

// 获取项目分期列表
export function getProjectList() {
    return request({
        url: '/project/no-paging?terms[0].column=level&terms[0].value=2',
        method: 'get'
    })
}

// 查询项目班组列表
export function getProjectTeamList(projectId) {
    return request({
        url: `/organizational/supplier/${projectId}`,
        method: 'get'
    })
}

// 获取班组详情
export function getTeamDetail({ projectId, orgId }) {
    return request({
        url: `/organizational/supplier/${projectId}/${orgId}`,
        method: 'get'
    })
}

// 编辑班组信息
export function editTeam(paramObj) {
    return request({
        url: `/organizational/${paramObj.orgId}`,
        method: 'put',
        data: JSON.stringify(paramObj)
    })
}

// 新增班组人员
export function addTeamMember({ projectId, orgId, memberFillingObj }) {
    return request({
        url: `/organizational/supplier/person/${projectId}/${orgId}`,
        method: 'post',
        data: JSON.stringify(memberFillingObj)
    })
}

// 编辑班组人员
export function editTeamMember(paramObj) {
    return request({
        url: `/organizational/supplier/person/${paramObj.memberFillingObj.personId}`,
        method: 'put',
        data: JSON.stringify(paramObj.memberFillingObj)
    })
}

// 删除班组人员
export function deleteTeamMember({ projectId, orgId, memberFillingObj }) {
    return request({
        url: `/organizational/supplier/person/${projectId}/${orgId}/${memberFillingObj.personId}`,
        method: 'delete'
    })
}

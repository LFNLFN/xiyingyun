import request from '@/utils/request'

// 编辑企业信息
export function editOrgInfo(paramObj) {
    return request({
        url: '/organizationInfo',
        method: 'post',
        data: JSON.stringify(paramObj)
    })
}

// 查询企业信息详情
export function getOrgDetailInfo() {
    return request({
        url: '/organizationInfo',
        method: 'get'
    })
}

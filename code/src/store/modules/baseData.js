import { getRoles } from '@/api/base_data/permission.js'
import { getOrganization } from '@/api/base_data/organization.js'
// import { Message } from 'element-ui'

const baseData = {
  state: {
    checkItems: [
      {
        title: '质量风险',
        path: '/base_data/check_items/qualityRisk',
        name: 'qualityRisk'
      },
      {
        title: '安全文明',
        path: '/base_data/check_items/safe',
        name: 'safe'
      },
      {
        title: '实测实量',
        path: '/base_data/check_items/Measured',
        name: 'Measured'
      }
    ],
    permissionRoles: [],
    organizationData: []
  },
  mutations: {
    SET_PER_ROLES: (state, roles) => {
      state.permissionRoles = roles
    },
    CLEAR_PER_ROLES: (state) => {
      state.permissionRoles.splice(0, state.permissionRoles.length)
    },
    SET_ORGANIZATION: (state, tree) => {
      state.organizationData = tree
    },
    CLEAR_ORGANIZATION: (state) => {
      state.organizationData.splice(0, state.organizationData.length)
    }
  },
  actions: {
    // 获取角色
    getPerRoles({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.permissionRoles.length === 0) {
          getRoles({}).then(resp => {
            const data = resp.result.data
            commit('SET_PER_ROLES', data)
            resolve(data)
          }).catch(() => {
            reject()
          })
        } else {
          resolve(state.permissionRoles)
        }
      })
    },
    // 获取组织架构数据
    getOrganizationData({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.organizationData.length === 0) {
          getOrganization().then(resp => {
            const data = resp.result.filter(tree => tree.type === 0)
            commit('SET_ORGANIZATION', data)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } else {
          resolve(state.organizationData)
        }
      })
    }
  }
}

export default baseData

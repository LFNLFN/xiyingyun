import Vue from 'vue'
import { getRoles } from '@/api/base_data/permission.js'
import { getOrganization } from '@/api/base_data/organization.js'
// import { Message } from 'element-ui'

const baseData = {
  state: {
    permissionRoles: [],
    organizationData: [],
    organizationType: {
      suppliers: 1,
      organization: 0
    }
  },
  mutations: {
    SET_PER_ROLES: (state, roles) => {
      Vue.set(state, 'permissionRoles', roles)
    },
    CLEAR_PER_ROLES: (state) => {
      state.permissionRoles.splice(0, state.permissionRoles.length)
    },
    SET_ORGANIZATION: (state, tree) => {
      Vue.set(state, 'organizationData', tree)
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
    // 获取组织架构以及供应商
    getOrganizationData({ commit, state }, _obj) {
      const { type, reGet } = _obj
      return new Promise((resolve, reject) => {
        if (state.organizationData.length === 0 || reGet) {
          getOrganization().then(resp => {
            const data = resp.result
            const backData = data.filter(tree => tree.type === type)
            commit('SET_ORGANIZATION', data)
            resolve(backData)
          }).catch(err => {
            reject(err)
          })
        } else {
          resolve(state.organizationData.filter(tree => tree.type === type))
        }
      })
    }
  }
}

export default baseData

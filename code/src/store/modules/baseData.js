import Vue from 'vue'
import { getRoles } from '@/api/base_data/permission.js'
import { getRolesInSup } from '@/api/base_data/permission.js'
import { getRolesInOrg } from '@/api/base_data/organization.js'
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
    // 在账号管理中获取角色
    getPerRoles({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (true || state.permissionRoles.length === 0) { // 这个判断条件目前来说没有意义，但以后不知道，所以保留下来
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
    // 在供应商管理中，获取角色
    getPerRolesInSup({ commit, state }, { paramObj, orgType }) {
      return new Promise((resolve, reject) => {
        if (true || state.permissionRoles.length === 0) {
          getRolesInSup(paramObj, orgType).then(resp => {
            const data = resp.result
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
    // 在组织架构中获取角色
    getPerRolesInOrganization({ commit, state }, paramObj) {
      return new Promise((resolve, reject) => {
        if (true || state.permissionRoles.length === 0) {
          getRolesInOrg(paramObj).then(resp => {
            const data = resp.result
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

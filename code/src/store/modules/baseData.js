import { getRoles } from '@/api/base_data/permission.js'

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
    permissionRoles: []
  },
  mutations: {
    SET_PER_ROLES: (state, roles) => {
      state.permissionRoles = roles
    },
    CLEAR_PER_ROLES: (state) => {
      state.permissionRoles.splice(0, state.permissionRoles.length)
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
          })
        } else {
          resolve(state.permissionRoles)
        }
      })
    }
  }
}

export default baseData

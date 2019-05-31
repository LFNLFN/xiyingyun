import { getDictionaryItem } from '@/api/dictionary'
import Vue from 'vue'

// 保存项目配置部分需要的数据
const projectConfig = {
  state: {
    projectList: [], // 保存项目列表
    projectDetails: [], // 保存包含项目分期、标段的数据
    projectStatus: [], // 保存项目状态数据
    deliveryType: [], // 保存交付类型数据
    constructionType: [], // 保存施工阶段数据
    districtData: [] // 保存城市数据
  },
  mutations: {
    SET_PROJECT_LIST: (state, list) => {
      Vue.set(state, 'projectList', list)
      try {
        localStorage.setItem('projectList', JSON.stringify(list))
      } catch (e) {
        console.log('set localStorage error: ', e)
      }
    },
    SET_PROJECT_DETAILS: (state, list) => {
      Vue.set(state, 'projectDetails', list)
      try {
        localStorage.setItem('projectDetails', JSON.stringify(list))
      } catch (e) {
        console.log('set localStorage error: ', e)
      }
    },
    SET_DICTIONARY_ITEM: (state, _obj) => {
      Vue.set(state, _obj.key, _obj.data)
      // state[_obj.key] = _obj.data
    }
  },
  actions: {
    getDictionaryItemFunc({ commit, state }, _obj) {
      const key = _obj.dataKey
      const params = _obj.params
      return new Promise((reslove, reject) => {
        if (state[key] === undefined || state[key].length === 0) {
          getDictionaryItem(params).then(resp => {
            const data = resp.result
            if (state[key]) {
              commit('SET_DICTIONARY_ITEM', { key, data })
            }
            reslove(data)
          }).catch((err) => {
            reject(err)
          })
        } else {
          reslove(state[key])
        }
      })
    }
  }
}
export default projectConfig

import Vue from 'vue'
import { getLocationStructure } from '@/api/dictionary'
// import { Message } from 'element-ui'

const locationData = {
  state: {
    allCityData: []
  },
  mutations: {
    SET_CITY_DATA: (state, allCityData) => {
      Vue.set(state, 'allCityData', allCityData)
      try {
        localStorage.setItem('allCityData', JSON.stringify(allCityData))
      } catch (e) {
        console.log('set localStorage error: ', e)
      }
    }
  },
  actions: {
    // 获取城市结构
    getAllCityData({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.allCityData.length === 0) {
          const paramsObj = {
            'dictId': 'city',
            // 'parentId': '-1'
            'parentId': ''
          }
          const _keys = Object.keys(paramsObj)
          const params = {}
          _keys.forEach((key, idx) => {
            if (paramsObj[key] !== '') {
              params[`terms[${idx}].column`] = key
              params[`terms[${idx}].value`] = paramsObj[key]
            }
          })
          getLocationStructure(params).then(resp => {
            const data = resp
            commit('SET_CITY_DATA', data)
            resolve(data)
          }).catch(() => {
            reject()
          })
        } else {
          resolve(state.allCityData)
        }
      })
    }
  }
}

export default locationData

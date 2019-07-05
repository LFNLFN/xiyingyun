import Vue from 'vue'

const quality = {
  state: {},
  mutations: {
    SET_QUALITY_STATE_DATA: (state, params) => {
      console.log('params', params)
      const { key, data } = params
      Vue.set(state, key, data)
    }
  },
  actions: {}
}
export default quality

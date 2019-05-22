import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import baseData from './modules/baseData'
import projectConfig from './modules/projectConfig'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    baseData,
    projectConfig
  },
  getters
})

export default store

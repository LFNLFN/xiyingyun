import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import baseData from './modules/baseData'
import projectConfig from './modules/projectConfig'
import quality from './modules/quality'
import location from './modules/location'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    baseData,
    projectConfig,
    quality,
    location
  },
  getters
})

export default store

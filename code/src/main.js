import Vue from 'vue'
import ElementUI from 'element-ui'
import App from './App'
import store from './store'
import router from './router'
import VueAMap from 'vue-amap' // map

import 'normalize.css/normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import '@/icons' // icon
import '@/permission' // permission control
import '../mock' // simulation data

Vue.use(ElementUI)

Vue.config.productionTip = false

// 高德地图配置
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '2e7af8d95ccba78004513880b151acc8'
})

// 获取上传到阿里云OSS的图片的完整链接
Vue.prototype.GetOssImgFullPath = function(imgName) {
  if (imgName === '') return ''
  const bucket = process.env.OSS_BUCKET
  const endpoint = process.env.OSS_ENDPOINT
  if (imgName.match(`${bucket}.${endpoint}`)) {
    return imgName
  } else {
    return `http://${bucket}.${endpoint}/${imgName}`
  }
}

// localStorage 统一处理异常
Vue.prototype.$SetLocalStorage = function(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (e) {
    console.log('set localStorage error: ', e)
  }
}

Vue.prototype.$GetLocalStorage = function(key) {
  let backVal
  try {
    backVal = JSON.parse(localStorage.getItem(key))
  } catch (e) {
    backVal = null
  }
  return backVal
}

Vue.prototype.$RemoveLocalStorage = function(key) {
  try {
    localStorage.removeItem('loginSave')
  } catch (e) {
    console.log('remove localStorage error: ', e)
  }
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

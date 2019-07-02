import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import '../mock' // simulation data
import VueAMap from 'vue-amap' // map

Vue.use(ElementUI)

Vue.config.productionTip = false

// map 配置
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '2e7af8d95ccba78004513880b151acc8'
})

// 获取上传到阿里云OSS的图片的完整链接
Vue.prototype.GetOssImgFullPath = function(imgName) {
  if (imgName === '') return ''
  const bucket = process.env.OSS_BUCKET
  const endpoint = process.env.OSS_ENDPOINT
  return `http://${bucket}.${endpoint}/${imgName}`
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

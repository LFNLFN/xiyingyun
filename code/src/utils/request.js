import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken, removeToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000
})

// request拦截器
service.interceptors.request.use(
  // 让每个请求携带自定义token
  config => {
    config.headers['Content-Type'] = 'application/json'
    config.headers['Access-Control-Allow-Origin'] = '*'
    if (store.getters.token) {
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    console.log('response:', response)
    return handleCode(response)
  },
  error => {
    return handleCode(error.response)
  }
)

function handleCode(response) {
  const code = response.status || response.data.status
  const message = response.data.message || '请求异常，请重试或检查网络'
  return new Promise((resolve, reject) => {
    switch (code) {
      case 200:
        resolve(response.data)
        break
      case 401:
        MessageBox.confirm('登录验证已失效，请重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warnning'
        }).then(() => {
          reject()
          store.commit('SET_TOKEN', '')
          store.commit('SET_ROLES', [])
          removeToken()
          location.reload()
        })
        break
      case 400:
        Message({
          message: message,
          type: 'error',
          duration: 5 * 1000
        })
        reject()
        break
      case 404:
        Message({
          message: '请求连接出错，无法完成请求!!!',
          type: 'error',
          duration: 5 * 1000
        })
        reject()
        break
      case 500:
        Message({
          message: '服务器出错，请稍后再试!!!',
          type: 'error',
          duration: 5 * 1000
        })
        reject()
        break
      default :
        Message({
          message: '请求异常，请重试或检查网络!!!',
          type: 'error',
          duration: 5 * 1000
        })
        reject()
    }
  })
}

export default service

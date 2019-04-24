import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

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
    // status 不是200即请求出错，统一处理
    console.log('response:', response)
    const res = response.data
    if (res.status !== 200) {
      Message({
        message: res.message || '请求出错!!!',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.status === 401) {
        MessageBox.comfirm('登录验证已失效，请重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warnning'
        }).then(() => {
          location.reload()
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err: ', error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

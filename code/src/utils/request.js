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
    console.log('error.response: ', error.response)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
    // handleCode(error.response).then((resp) => {
    //   console.log('resp', resp)
    //   return Promise.reject(error)
    // }, (rej) => {
    //   console.log('rej', rej)
    //   return Promise.reject(error)
    // })
  }
)

function handleCode(response) {
  const code = response.status
  console.log('code: ', code)
  return new Promise((resolve, reject) => {
    switch (code) {
      case 200:
        resolve(response.data)
        break
      case 401:
        MessageBox.comfirm('登录验证已失效，请重新登录', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warnning'
        }).then(() => {
          reject()
          location.reload()
        })
        break
      case 400:
        Message({
          message: '参数错误，请检查输入数据!!!',
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
    }
  })
}

export default service

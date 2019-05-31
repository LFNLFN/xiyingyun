import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress configuration

// 不重定向白名单
const whiteList = ['/login']
// 获取用户权限信息，根据权限信息生成动态路由表
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || '登录失败，请检查网络或重试')
            next({ path: '/' })
          })
        })
      } else {
        // const reg = new RegExp('((?<=:).*(?=\/)|(?<=:).*)+', 'g')
        const params = to.params
        const paramKeys = Object.keys(to.params)
        if (paramKeys.length) {
          paramKeys.forEach(pk => {
            if (params[pk].match(/:/)) {
              next({ path: store.getters[pk][0].path })
            }
          })
        }
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

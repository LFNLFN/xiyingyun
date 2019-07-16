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
      NProgress.done()
    } else {
      // 是否显示全屏按钮
      if (store.getters.fullScreenBtnPath.includes(to.path)) {
        store.dispatch('ToggleFullScreenBtn', true)
      } else {
        store.dispatch('ToggleFullScreenBtn', false)
      }
      // 权限判断相关
      if (store.getters.roles.length === 0) {
        // 拉取用户信息
        store.dispatch('GetInfo').then(res => {
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || '登录失败，请检查网络或重试')
            next({ path: '/' })
          })
        })
      } else {
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

import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

// 引入Layout
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**/

// 配置路由 routes
export const constantRouterMap = [
  // 登录页面
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 链接错误页面
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 登录后进入首页
  {
    path: '/',
    component: Layout,
    redirect: '/project_config',
    hidden: true
  },
  // 项目设置界面
  {
    path: '/project_config',
    component: Layout,
    redirect: '/project_config/project',
    name: 'projectConfig',
    meta: { title: '项目设置', icon: '' },
    children: [
      {
        path: 'project',
        name: 'project',
        meta: { title: '项目管理', icon: '' },
        component: () => import('@/views/project_config/project')
      },
      {
        path: 'plan',
        name: 'Plan',
        meta: { title: '平面图管理', icon: '' },
        component: () => import('@/views/project_config/plan')
      },
      {
        path: 'building',
        name: 'Building',
        meta: { title: '楼栋管理', icon: '' },
        component: () => import('@/views/project_config/building')
      },
      {
        path: 'participant',
        name: 'Participant',
        meta: { title: '参建方管理', icon: '' },
        component: () => import('@/views/project_config/participant')
      }
    ]
  },
  // 基础资料页面
  {
    path: '/base_data',
    component: Layout,
    name: 'baseData',
    redirect: '/base_data/suppliers',
    meta: { title: '基础资料', icon: '' },
    children: [
      {
        path: 'suppliers',
        name: 'suppliers',
        // redirect: '/base_data/suppliers/index',
        meta: { title: '供应商管理', icon: '' },
        component: () => import('@/views/base_data/suppliers/suppliers')
        // children: [
        //   {
        //     path: 'index',
        //     name: 'suppliersIndex',
        //     hidden: true,
        //     component: () => import('@/views/base_data/suppliers/suppliers')
        //   },
        //   {
        //     path: 'details',
        //     name: 'suppliersDetails',
        //     hidden: true,
        //     component: () => import('@/views/base_data/suppliers/details'),
        //     meta: { title: '员工信息', icon: '' }
        //   }
        // ]
      },
      {
        path: 'accounts',
        name: 'accounts',
        meta: { title: '账号管理', icon: '' },
        component: () => import('@/views/base_data/accounts/accounts')
      },
      {
        path: 'organization',
        name: 'organization',
        meta: { title: '组织架构', icon: '' },
        component: () => import('@/views/base_data/organization/organization')
      },
      {
        path: 'permission',
        name: 'permission',
        meta: { title: '权限管理', icon: '' },
        component: () => import('@/views/base_data/permission/permission')
      },
      {
        path: 'params_config',
        name: 'paramsConfig',
        redirect: '/base_data/params_config/index',
        meta: { title: '参数设置', icon: '' },
        component: () => import('@/views/base_data/params_config/index'),
        children: [
          {
            path: 'index',
            name: 'paramsConfigIndex',
            hidden: true,
            component: () => import('@/views/base_data/params_config/index')
          }
        ]
      },
      {
        path: 'check_items/:checkItemsId',
        name: 'checkItems',
        meta: { title: '检查项配置', icon: '' },
        component: () => import('@/views/base_data/check_items')
      }
    ]
  },
  // 用户设置界面
  {
    path: '/user',
    component: Layout,
    name: 'user',
    redirect: '/user/user_set',
    meta: { title: '我的', icon: '' },
    children: [
      {
        path: 'security',
        name: 'security',
        meta: { title: '安全设置', icon: '' },
        component: () => import('@/views/user/security')
        // children: [
        //   {
        //     path: 'index',
        //     name: 'index',
        //     hidden: true,
        //     component: () => import('@/views/user/security/index')
        //   },
        //   {
        //     path: 'phone_num',
        //     name: 'poneNum',
        //     component: () => import('@/views/user/security/phone_num'),
        //     meta: { title: '更换手机号码', icon: '' }
        //   },
        //   {
        //     path: 'password',
        //     name: 'password',
        //     component: () => import('@/views/user/security/password'),
        //     meta: { title: '更改密码', icon: '' }
        //   }
        // ]
      },
      {
        path: 'user_set',
        name: 'userSet',
        meta: { title: '个人设置', icon: '' },
        component: () => import('@/views/user/user_set')
      },
      {
        path: 'my_company',
        name: 'myCompany',
        meta: { title: '我的公司', icon: '' },
        component: () => import('@/views/user/my_company')
      },
      {
        path: 'quit_apply',
        name: 'quitApply',
        meta: { title: '退出申请', icon: '' },
        component: () => import('@/views/user/quit_apply')
      }
    ]
  },
  // 无效链接重定向到404页面
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

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
* menuType:                      types: 'home', 'project', 'public'
**/

// 无权限公共页面
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
  }
]

// 根据权限加载的异步路由
export const asyncRouterMap = [
  // 登录后进入首页
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    hidden: true
  },
  /* ------------------- 首页 ------------------ */
  // 首页
  {
    path: '/home',
    name: 'home',
    component: Layout,
    redirect: '/home/index',
    meta: { title: '首页', icon: '' },
    menuType: 'home',
    children: [
      {
        path: 'index',
        name: 'homeIndex',
        meta: { title: '首页', icon: '' },
        component: () => import('@/views/home/index')
      }
    ]
  },
  /* ------------------- 统计数据大屏 ------------------ */
  // 首页
  {
    path: '/data_screen',
    name: 'dataScreen',
    component: Layout,
    redirect: '/data_screen/index',
    meta: { title: '统计数据大屏', icon: '' },
    menuType: 'home',
    children: [
      {
        path: 'index',
        name: 'dataScreenIndex',
        meta: { title: '统计数据大屏', icon: '' },
        component: () => import('@/views/data_screen/index')
      }
    ]
  },
  /* ------------------- 工程管理 ------------------ */
  // 质量管理
  {
    path: '/quality',
    component: Layout,
    redirect: '/quality/process_acceptance',
    name: 'quality',
    meta: { title: '质量管理', icon: '' },
    menuType: 'project',
    children: [
      {
        path: 'process_acceptance',
        name: 'processAcceptance',
        meta: { title: '工序验收', icon: '' },
        component: () => import('@/views/quality/process_acceptance/process_acceptance')
      },
      {
        path: 'check_problems',
        name: 'checkProblem',
        meta: { title: '检查问题', icon: '' },
        component: () => import('@/views/quality/check_problems/check_problems')
      },
      {
        path: 'service_problem',
        name: 'serviceProblem',
        meta: { title: '客服问题', icon: '' },
        component: () => import('@/views/quality/service_problem/service_problem')
      },
      {
        path: 'measure',
        name: 'measure',
        meta: { title: '实测实量', icon: '' },
        component: () => import('@/views/quality/measure/measure')
      },
      {
        path: 'special_item_check',
        name: 'specialCheck',
        redirect: 'special_item_check/index',
        meta: { title: '专项检查', icon: '' },
        component: () => import('@/views/quality/special_item_check/index'),
        children: [
          {
            path: 'index',
            name: 'specialItemCheckIndex',
            hidden: true,
            component: () => import('@/views/quality/special_item_check/special_item_check')
          },
          {
            path: 'addSpecialItem',
            name: 'addSpecialItem',
            hidden: true,
            component: () => import('@/views/quality/special_item_check/addSpecialItem')
          }
        ]
      }
      // {
      //   path: 'evaluation',
      //   name: 'evaluation',
      //   redirect: 'evaluation/index',
      //   meta: { title: '评估管理', icon: '' },
      //   component: () => import('@/views/quality/evaluation/index'),
      //   children: [
      //     {
      //       path: 'index',
      //       name: 'evaluationIndex',
      //       hidden: true,
      //       component: () => import('@/views/quality/evaluation/evaluation')
      //     }
      //   ]
      // }
    ]
  },
  // 材料管理
  {
    path: '/material',
    component: Layout,
    redirect: '/material/material_acceptance',
    name: 'material',
    alwaysShow: true,
    meta: { title: '材料管理', icon: '' },
    menuType: 'project',
    children: [
      {
        path: 'material_acceptance',
        name: 'materialAcceptance',
        meta: { title: '材料验收', icon: '' },
        component: () => import('@/views/material/material_acceptance/material_acceptance')
      }
      // {
      //   path: 'material_apply',
      //   name: 'materialApply',
      //   meta: { title: '材料申请', icon: '' }
      //   // component: () => import('@/views/material/material_acceptance/material_acceptance')
      // }
    ]
  },
  // 企业发文
  {
    path: '/publication',
    component: Layout,
    redirect: '/publication/publication_manage',
    name: 'publication',
    meta: { title: '企业发文', icon: '' },
    menuType: 'project',
    children: [
      {
        path: 'publication_manage',
        name: 'publicationManage',
        meta: { title: '公告管理', icon: '' },
        redirect: '/publication/publication_manage/index',
        component: () => import('@/views/publication/publication_manage/index'),
        children: [
          {
            path: 'index',
            name: 'publicationManageIndex',
            hidden: true,
            component: () => import('@/views/publication/publication_manage/publication_manage')
          },
          {
            path: 'addPublication',
            name: 'addPublication',
            hidden: true,
            component: () => import('@/views/publication/publication_manage/addPublication')
          }
        ]
      },
      {
        path: 'document_manage',
        name: 'documentManage',
        meta: { title: '文档管理', icon: '' },
        component: () => import('@/views/publication/document_manage/document_manage')
      }
    ]
  },
  // 统计分析
  {
    path: '/statistics',
    component: Layout,
    redirect: '/statistics/statistics_report',
    name: 'statistics',
    meta: { title: '统计分析', icon: '' },
    menuType: 'project',
    alwaysShow: true,
    children: [
      {
        path: 'statistics_report',
        name: 'statisticsReport',
        meta: { title: '统计报表', icon: '' },
        component: () => import('@/views/statistics/statistics_report/statistics_report')
      }
    ]
  },
  {
    path: '/project_portal',
    component: Layout,
    redirect: '/project_portal/index',
    name: 'projectPortal',
    meta: { title: '项目门户', icon: '' },
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'index',
        hidden: true,
        meta: { title: '项目门户首页', icon: '' },
        component: () => import('@/views/project_portal/index')
      },
      {
        path: 'buildingProcessDetail',
        name: 'buildingProcessDetail',
        hidden: true,
        meta: { title: '进度详情', icon: '' },
        component: () => import('@/views/project_portal/buildingProcessDetail')
      }
    ]

  },
  /* ------------------- 公共业务管理 ------------------ */
  // 项目设置界面
  {
    path: '/project_config',
    component: Layout,
    redirect: '/project_config/project',
    name: 'projectConfig',
    meta: { title: '项目设置', icon: '' },
    menuType: 'public',
    children: [
      {
        path: 'project',
        name: 'project',
        redirect: '/project_config/project/index',
        meta: { title: '项目管理', icon: '' },
        component: () => import('@/views/project_config/project/index'),
        children: [
          {
            path: 'index',
            component: () => import('@/views/project_config/project/project'),
            name: 'projectIndex',
            hidden: true
          },
          {
            path: 'projectStage',
            component: () => import('@/views/project_config/project/projectStage'),
            name: 'ProjectStage',
            hidden: true
          },
          {
            path: 'stageSection',
            component: () => import('@/views/project_config/project/stageSection'),
            name: 'stageSection',
            hidden: true
          }
        ]
      },
      {
        path: 'plan',
        name: 'Plan',
        meta: { title: '平面图管理', icon: '' },
        component: () => import('@/views/project_config/plan/plan')
      },
      {
        path: 'building',
        name: 'Building',
        meta: { title: '楼栋管理', icon: '' },
        component: () => import('@/views/project_config/building/building')
      },
      {
        path: 'participant',
        name: 'Participant',
        meta: { title: '参建方管理', icon: '' },
        redirect: '/project_config/participant/index',
        component: () => import('@/views/project_config/participant/index'),
        children: [
          {
            path: 'index',
            component: () => import('@/views/project_config/participant/participant'),
            name: 'participant',
            hidden: true
          },
          {
            path: 'participantDetail',
            component: () => import('@/views/project_config/participant/participantDetail'),
            name: 'participantDetail',
            hidden: true
          }
        ]
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
    menuType: 'public',
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
        path: 'check_items',
        name: 'checkItems',
        meta: { title: '检查项配置', icon: '' },
        component: () => import('@/views/base_data/check_items/check_items')
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
    menuType: 'public',
    children: [
      // {
      //   path: 'security',
      //   name: 'security',
      //   meta: { title: '安全设置', icon: '' },
      //   component: () => import('@/views/user/security/security')
      // },
      {
        path: 'user_set',
        name: 'userSet',
        meta: { title: '个人设置', icon: '' },
        component: () => import('@/views/user/user_set/user_set')
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
  // 网站信息
  {
    path: '/website_info',
    name: 'websiteInfo',
    component: Layout,
    redirect: '/website_info/index',
    meta: { title: '首页', icon: '' },
    menuType: 'public',
    children: [
      {
        path: 'index',
        name: 'websiteInfoIndex',
        meta: { title: '网站信息', icon: '' },
        component: () => import('@/views/website_info/index')
      }
    ]
  },
  // 无效链接重定向到404页面
  { path: '*', redirect: '/404', hidden: true }
]

const allRouter = constantRouterMap.concat(asyncRouterMap)

// 创建路由实例
const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  // routes: constantRouterMap
  routes: allRouter
})

// 重置路由
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

const router = createRouter()

export default router

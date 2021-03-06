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
    // redirect: '/home',
    redirect: '/website_info',
    hidden: true
  },
  /* ------------------- 系统设置 ------------------ */
  // 首页
  // {
  //   path: '/home',
  //   name: 'home',
  //   component: Layout,
  //   redirect: '/home/index',
  //   meta: { title: '首页', icon: 'home' },
  //   menuType: 'public',
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'homeIndex',
  //       meta: { title: '首页', icon: 'home' },
  //       component: () => import('@/views/home/index')
  //     }
  //   ]
  // },
  // 网站信息(首页)
  {
    path: '/website_info',
    name: 'websiteInfo',
    component: Layout,
    redirect: '/website_info/index',
    // meta: { title: '网站信息', icon: 'websiteInfo' },
    meta: { title: '首页', icon: 'home', pagePermissionId: 'sys_setting_index' },
    menuType: 'public',
    // menuType: 'home',
    children: [
      {
        path: 'index',
        name: 'websiteInfoIndex',
        // meta: { title: '网站信息', icon: 'websiteInfo' },
        meta: { title: '首页', icon: 'home', pagePermissionId: 'sys_setting_index' },
        component: () => import('@/views/website_info/index')
      }
    ]
  },
  // 项目设置界面
  {
    path: '/project_config',
    component: Layout,
    redirect: '/project_config/project',
    name: 'projectConfig',
    meta: { title: '项目设置', icon: 'projectConfig' },
    menuType: 'public',
    children: [
      {
        path: 'project',
        name: 'project',
        redirect: '/project_config/project/index',
        meta: { title: '项目管理', icon: '', pagePermissionId: 'project' },
        component: () => import('@/views/project_config/project/index'),
        children: [
          {
            path: 'index',
            component: () => import('@/views/project_config/project/project'),
            name: 'projectIndex',
            meta: { pagePermissionId: 'project' },
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
        path: 'building',
        name: 'Building',
        meta: { title: '楼栋管理', icon: '', pagePermissionId: 'unit' },
        component: () => import('@/views/project_config/building/building')
      },
      {
        path: 'plan',
        name: 'Plan',
        meta: { title: '平面图管理', icon: '', pagePermissionId: 'floorPlan' },
        component: () => import('@/views/project_config/plan/plan')
      },
      // 班组管理界面
      {
        path: 'teamManagementIndex',
        redirect: 'teamManagementIndex/teamManagement',
        name: 'teamManagement',
        hidden: true,
        meta: { title: '班组管理', icon: '' },
        component: () => import('@/views/team_management/index'),
        children: [
          {
            path: 'teamManagement',
            component: () => import('@/views/team_management/team_management'),
            name: 'teamManagement',
            hidden: true
          },
          {
            path: 'teamStage',
            component: () => import('@/views/team_management/components/teamStage'),
            name: 'teamStage',
            hidden: true
          }
        ]
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
            meta: { pagePermissionId: 'thirdPart' },
            name: 'participant',
            hidden: true
          },
          {
            path: 'participantDetail',
            component: () => import('@/views/project_config/participant/participantDetail'),
            meta: { pagePermissionId: 'thirdPart' },
            name: 'participantDetail',
            hidden: true
          }
        ]
      }
    ]
  },
  // 基础资料（改名为系统设置）
  {
    path: '/base_data',
    component: Layout,
    name: 'baseData',
    redirect: '/base_data/suppliers',
    meta: { title: '系统设置', icon: 'baseData' },
    menuType: 'public',
    children: [
      {
        path: 'organizationInformation',
        name: 'organizationInformation',
        meta: { title: '企业信息', icon: '', pagePermissionId: 'organizationInfo' },
        component: () => import('@/views/base_data/organizationInfo/organizationInfo')
      },
      {
        path: 'organization',
        name: 'organization',
        // meta: { title: '组织架构', icon: '' },
        meta: { title: '企业架构', icon: '', pagePermissionId: 'organizational' },
        component: () => import('@/views/base_data/organization/organization')
      },
      {
        path: 'accounts',
        name: 'accounts',
        // meta: { title: '账号管理', icon: '' },
        meta: { title: '人员管理', icon: '', pagePermissionId: 'person' },
        component: () => import('@/views/base_data/accounts/accounts')
      },
      {
        path: 'permission',
        name: 'permission',
        meta: { title: '权限管理', icon: '', pagePermissionId: 'permission' },
        component: () => import('@/views/base_data/permission/permission')
      },
      {
        path: 'suppliers',
        name: 'suppliers',
        // redirect: '/base_data/suppliers/index',
        meta: { title: '供应商管理', icon: '', pagePermissionId: 'supplier' },
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
      // {
      //   path: 'params_config',
      //   name: 'paramsConfig',
      //   redirect: '/base_data/params_config/index',
      //   meta: { title: '参数设置', icon: '' },
      //   hidden: true,
      //   component: () => import('@/views/base_data/params_config/index'),
      //   children: [
      //     {
      //       path: 'index',
      //       name: 'paramsConfigIndex',
      //       hidden: true,
      //       component: () => import('@/views/base_data/params_config/index')
      //     }
      //   ]
      // },
      // {
      //   path: 'check_items',
      //   name: 'checkItems',
      //   meta: { title: '检查项配置', icon: '' },
      //   hidden: true,
      //   component: () => import('@/views/base_data/check_items/check_items')
      // }
    ]
  },
  // 用户设置界面
  {
    path: '/user',
    component: Layout,
    name: 'user',
    redirect: '/user/user_set',
    meta: { title: '我的', icon: 'user' },
    hidden: true,
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
  /* ------------------- 工程管理 ------------------ */
  // 网站信息(首页)
  {
    path: '/project_website_info',
    name: 'websiteInfo',
    component: Layout,
    redirect: '/project_website_info/index',
    // meta: { title: '网站信息', icon: 'websiteInfo' },
    meta: { title: '首页', icon: 'home', pagePermissionId: 'project_manage_index' },
    menuType: 'project',
    // menuType: 'home',
    children: [
      {
        path: 'index',
        name: 'websiteInfoIndex',
        // meta: { title: '网站信息', icon: 'websiteInfo' },
        meta: { title: '首页', icon: 'home', pagePermissionId: 'project_manage_index' },
        component: () => import('@/views/website_info/index')
      }
    ]
  },
  // 数据大屏
  {
    path: '/data_screen',
    name: 'dataScreen',
    component: Layout,
    redirect: '/data_screen/index',
    meta: { title: '统计数据大屏', icon: 'dataScreen', pagePermissionId: 'project_manage_data_screen' },
    menuType: 'project',
    children: [
      {
        path: 'index',
        name: 'dataScreenIndex',
        meta: { title: '统计数据大屏', icon: 'dataScreen', pagePermissionId: 'project_manage_data_screen' },
        component: () => import('@/views/data_screen/index')
      }
    ]
  },
  // 质量管理
  {
    path: '/quality',
    component: Layout,
    redirect: '/quality/process_acceptance',
    name: 'quality',
    meta: { title: '质量管理', icon: 'quality' },
    menuType: 'project',
    children: [
      {
        path: 'check_problems',
        name: 'checkProblem',
        // meta: { title: '检查问题', icon: '' }, 旧名，保留旧名是因为有些文件的命名是根据旧名起的
        meta: { title: '日常检查', icon: '', pagePermissionId: 'problemCheckMain' },
        component: () => import('@/views/quality/check_problems/check_problems')
      },
      {
        path: 'measure',
        name: 'measure',
        meta: { title: '实测实量', icon: '', pagePermissionId: 'measuredQuantity' },
        component: () => import('@/views/quality/measure/measure')
      },
      {
        path: 'process_acceptance',
        name: 'processAcceptance',
        meta: { title: '工序验收', icon: '', pagePermissionId: 'processAccept' },
        component: () => import('@/views/quality/process_acceptance/process_acceptance')
      },
      {
        path: 'service_problem',
        name: 'serviceProblem',
        hidden: true,
        meta: { title: '客服问题', icon: '' },
        component: () => import('@/views/quality/service_problem/service_problem')
      },
      {
        path: 'special_item_check',
        name: 'specialCheck',
        redirect: 'special_item_check/index',
        meta: { title: '专项检查', icon: '', pagePermissionId: 'problemCheckBatch' },
        component: () => import('@/views/quality/special_item_check/index'),
        children: [
          {
            path: 'index',
            name: 'specialItemCheckIndex',
            meta: { title: '专项检查', pagePermissionId: 'problemCheckBatch' },
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
    meta: { title: '材料管理', icon: 'material' },
    menuType: 'project',
    children: [
      {
        path: 'material_acceptance',
        name: 'materialAcceptance',
        meta: { title: '材料验收', icon: '', pagePermissionId: 'metarialAcceptMain' },
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
  // 进度管理
  {
    path: '/progress',
    component: Layout,
    redirect: '/progress/progress_plan',
    name: 'progress',
    alwaysShow: true,
    hidden: true,
    meta: { title: '进度管理', icon: 'process' },
    menuType: 'project',
    children: [
      {
        path: 'progress_plan',
        name: 'progressPlan',
        meta: { title: '进度计划', icon: '' },
        redirect: '/progress/progress_plan/index',
        component: () => import('@/views/progress/progress_plan/index'),
        children: [
          {
            path: 'index',
            name: 'progress_plan',
            hidden: true,
            component: () => import('@/views/progress/progress_plan/progress_plan')
          },
          {
            path: 'addProgress',
            name: 'addProgress',
            hidden: true,
            component: () => import('@/views/progress/progress_plan/components/addProgress.vue')
          }
        ]
      },
      {
        path: 'progress_report',
        name: 'progressReport',
        meta: { title: '进度上报', icon: '' },
        component: () => import('@/views/progress/progress_report/progress_report')
      }
    ]
  },
  // 考勤管理界面
  {
    path: '/att_log',
    name: 'attLog',
    component: Layout,
    hidden: true,
    meta: { title: '考勤管理', icon: 'attLog' },
    // menuType: 'public',
    menuType: 'project', // 提升这行在侧边栏的显示顺序
    children: [
      {
        path: 'att_log_detail',
        name: 'attLogDetail',
        meta: { title: '考勤管理详情', icon: '' },
        component: () => import('@/views/att_log/att_log_detail')
      },
      {
        path: 'att_log_result',
        name: 'attLogResult',
        meta: { title: '考勤管理结果', icon: '' },
        component: () => import('@/views/att_log/att_log_result')
      }
    ]
  },
  // 班组管理界面
  {
    path: '/team_management',
    name: 'teamManagement',
    redirect: '/team_management/index/teamManagement',
    component: Layout,
    meta: { title: '班组管理', icon: 'teamManagement' },
    menuType: 'project',
    hidden: true,
    children: [
      {
        path: 'index',
        redirect: 'index/teamManagement',
        name: 'teamManagement',
        meta: { title: '班组信息', icon: '' },
        component: () => import('@/views/team_management/index'),
        children: [
          {
            path: 'teamManagement',
            component: () => import('@/views/team_management/team_management'),
            name: 'teamManagement',
            hidden: true
          },
          {
            path: 'teamStage',
            component: () => import('@/views/team_management/components/teamStage'),
            name: 'teamStage',
            hidden: true
          }
        ]
      }
    ]
  },
  // 企业发文
  {
    path: '/publication',
    component: Layout,
    redirect: '/publication/publication_manage',
    name: 'publication',
    meta: { title: '企业发文', icon: 'publication' },
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
        meta: { title: '文档管理', icon: '', pagePermissionId: 'documentRecord' },
        component: () => import('@/views/publication/document_manage/document_manage')
      }
    ]
  },
  // 基础设置
  {
    path: '/base_config',
    name: 'baseConfig',
    component: Layout,
    meta: { title: '基础设置', icon: 'baseData' },
    menuType: 'project',
    redirect: '/base_config/params_config/index',
    children: [
      {
        path: 'params_config',
        name: 'paramsConfig',
        meta: { title: '参数设置', icon: '', pagePermissionId: 'dictionary' },
        // hidden: true,
        component: () => import('@/views/base_data/params_config/index'),
        children: [
          {
            path: 'index',
            name: 'paramsConfigIndex',
            meta: { pagePermissionId: 'dictionary' },
            // hidden: true,
            component: () => import('@/views/base_data/params_config/index')
          }
        ]
      },
      {
        path: 'check_items',
        name: 'checkItems',
        // meta: { title: '检查项配置', icon: '' }, 保留旧名是因为有些文件的命名是根据旧名起的
        meta: { title: '检查标准', icon: '', pagePermissionId: 'inspectionCriteria' },
        component: () => import('@/views/base_data/check_items/check_items')
      }
    ]
  },
  // 统计分析
  {
    path: '/statistics',
    name: 'statistics',
    component: Layout,
    meta: { title: '统计分析', icon: 'statistics', pagePermissionId: 'report' },
    menuType: 'project',
    redirect: '/statistics/statistics_report',
    alwaysShow: true,
    children: [
      {
        path: 'statistics_report',
        name: 'statisticsReport',
        meta: { title: '统计报表', icon: '', pagePermissionId: 'report' },
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

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/pms',
    component: Layout,
    name: 'pms',
    meta: {
      title: '生产管理系统'
    },
    children: [
      {
        path: '/proddisp',
        component: () => import('@/views/pms/proddisp'), // Parent router-view
        name: 'proddisp',
        meta: { title: '生产调度' },
        children: [
          {
            path: '/dispordman',
            component: () => import('@/views/pms/proddisp/dispordman'),
            name: 'dispordman',
            meta: { title: '调度指令管理' },
            alwaysShow: true,
            children: [
              {
                path: '/dispord/list',
                name: 'PmsDispOrdList',
                component: () => import('@/views/pms/proddisp/dispordman/dispord/list'),
                meta: { title: '调度指令库管理', icon: 'table' }
              },
              {
                path: '/dispordrls/list',
                name: 'PmsDispOrdRlsList',
                component: () => import('@/views/pms/proddisp/dispordman/dispordrls/list'),
                meta: { title: '调度指令管理', icon: 'table' }
              },
              {
                path: '/dispord/update/:id', // ## :id 相当于占位符,要传参数
                name: 'PmsDispOrdUpdate',
                component: () => import('@/views/pms/proddisp/dispordman/dispord/update'),
                meta: { title: '编辑调度指令库', noCache: true },
                hidden: true
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/mes',
    component: Layout,
    name: 'mes',
    meta: {
      title: '生产执行系统'
    },
    children: [
      {
        path: 'proddisp',
        component: () => import('@/views/mes/proddisp'), // Parent router-view
        name: 'mproddisp',
        meta: { title: '生产调度' },
        children: [
          {
            path: 'dispordman',
            component: () => import('@/views/mes/proddisp/dispordman'),
            name: 'mdispordman',
            meta: { title: '调度指令管理' },
            alwaysShow: true,
            children: [
              {
                path: 'list',
                name: 'MesDispOrdRlsList',
                component: () => import('@/views/mes/proddisp/dispordman/dispordrls/list'),
                meta: { title: '煤矿调度指令管理', icon: 'table' }
              }
            ]
          }
        ]
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

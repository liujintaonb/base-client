import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

/**
 *  constantRoutes 存放不需要权限控制的路由，比如 登录、注册等页面
 *  路由参数
 *  hidden 可选参数， hidden = true 时，左侧菜单不显示，可以是 登录、注册、某个模块详情 等
 *  alwaysShow 可选参数 alwaysShow = true 时，表示，不管用户有没有路由权限 始终显示
 *  name 基本路由名称， 一级菜单可不设置路由菜单， 路由唯一标识，在 asyncRoutes 与后端返回权限集合对比
 *  meta 对象
 *      title 做左侧与页面标签显示
 *      icon  当前路由 icon 目前只支持 src/icons 中的图标
 *      affix 当前路由 是否固定在 tagsView
 */

export const constantRoutes = [
  {
    path: '/login',
    name: 'login',
    hidden: true,
    component: () => import(/* webpackChunkName: "login" */ '@/views/user/login/index.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '首页', icon: 'home' }
      }
    ]
  },
  // {
  //   path: '/perm',
  //   component: Layout,
  //   meta: { title: '权限管理', icon: 'perm' },
  //   name: 'perm',
  //   redirect: '/perm/users',
  //   children: [
  //     { path: 'users', component: () => import('@/views/permission/users/index.vue'), name: 'perm_users', meta: { title: '用户管理' } },
  //     { path: 'roles', component: () => import('@/views/permission/roles/index.vue'), name: 'perm_roles', meta: { title: '角色管理' } }
  //   ]
  // },
  // {
  //   path: '/system',
  //   component: Layout,
  //   meta: { title: '系统设置', icon: 'system' },
  //   name: 'system',
  //   redirect: '/system/menus',
  //   children: [
  //     { path: 'menus', component: () => import('@/views/system/menus/index.vue'), name: 'system_menus', meta: { title: '资源管理' } },
  //     { path: 'oss', component: () => import('@/views/system/oss/index.vue'), name: 'system_oss', meta: { title: '文件上传' } }
  //   ]
  // },
  {
    path: '/demo',
    component: Layout,
    meta: { title: 'demo', icon: 'demo' },
    children: [
      { path: 'map', component: () => import('@/views/demo/map/index.vue'), name: 'demo_map', meta: { title: '地图演示' } },
      { path: 'map-geojson', component: () => import('@/views/demo/map-geojson/index.vue'), name: 'demo_map-geojson', meta: { title: 'GeoJSON' } },
      { path: 'wang-edit', component: () => import('@/views/demo/edit/index.vue'), neme: 'demo_wangEdit', meta: { title: '富文本编辑器' } },
      {
        path: 'airlookmap',
        component: () => import('@/views/demo/airlookmap/index.vue'),
        name: 'dome_airlookmap',
        meta: { title: 'airlookmap demo' },
        children: [
          { path: 'loading', component: () => import('@/views/demo/airlookmap/loading.vue'), meta: { title: '加载影像' } },
          { path: 'roller', component: () => import('@/views/demo/airlookmap/roller.vue'), meta: { title: '影像卷帘' } },
          { path: 'color', component: () => import('@/views/demo/airlookmap/color-set.vue'), meta: { title: '颜色设置' } },
          { path: 'radar', component: () => import('@/views/demo/airlookmap/radar.vue'), meta: { title: '雷达图' } },
          { path: 'cloud', component: () => import('@/views/demo/airlookmap/cloud.vue'), meta: { title: '云图资源' } },
          { path: 'terrain', component: () => import('@/views/demo/airlookmap/terrain.vue'), meta: { title: '加载地形' } }
          // 动态扫描按demo 走会报错
          // { path: 'visual', component: () => import('@/views/demo/airlookmap/visual.vue'), meta: { title: '可视化动态扫描' } }
        ]
      }
      // { path: '3d/primordial', component: () => import('@/views/demo/3d/primordial'), name: 'demo_3d_primordial', meta: { title: '3D 地图 demo' } }
    ]
  }
]

export const asyncRoutes = [
  {
    path: '/perm',
    component: Layout,
    meta: { title: '权限管理', icon: 'perm' },
    name: 'perm',
    redirect: '/perm/users',
    children: [
      { path: 'users', component: () => import('@/views/permission/users/index.vue'), name: 'perm_users', meta: { title: '用户管理' } },
      { path: 'roles', component: () => import('@/views/permission/roles/index.vue'), name: 'perm_roles', meta: { title: '角色管理' } }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统设置', icon: 'system' },
    name: 'system',
    redirect: '/system/menus',
    children: [
      { path: 'menus', component: () => import('@/views/system/menus/index.vue'), name: 'system_menus', meta: { title: '资源管理' } },
      { path: 'oss', component: () => import('@/views/system/oss/index.vue'), name: 'system_oss', meta: { title: '文件上传' } }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: constantRoutes
})

export default router

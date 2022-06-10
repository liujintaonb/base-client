import { asyncRoutes, constantRoutes } from '@/router/index'

const state = {
  route: [],
  addRoutes: [],
  isReqPerm: false
}

const mutations = {
  SET_ROUTE: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    state.isReqPerm = true
  }
}

/**
 * 当前路由与后端返回的权限集合做对比，判断有无当前菜单权限
 * 不可调换判断顺序
 *  */
const hasPermission = (route, menus) => {
  if (route.name) {
    const res = menus.findIndex(menu => menu.name === route.name) > -1
    if (!res && route.children && route.children.length > 0) return hasPermission(route.children[0], menus)
    return res
  }
  if (route.hidden) return true
  return false
}

const filterAsyncRoutes = (routes, menus) => {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(route, menus)) {
      if (tmp.children && tmp.children.length > 0) tmp.children = filterAsyncRoutes(tmp.children, menus)
      res.push(tmp)
    }
  })
  return res
}

const actions = {
  async generaterRoutes ({ commit }, menus) {
    const accessRoutes = filterAsyncRoutes(asyncRoutes, menus)
    commit('SET_ROUTE', accessRoutes)
    return accessRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

import router from './router/index'
import store from './store/index'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, removeToken } from '@/utils/auth'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  document.title = `${to.meta.title}-Base Admin`

  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else if (!store.state.permission.isReqPerm) {
      try {
        await store.dispatch('user/getCurrUserInfo')
        const menus = await store.dispatch('user/getCurrUserMenus')
        const accessRoutes = await store.dispatch('permission/generaterRoutes', menus)
        accessRoutes.forEach(route => router.addRoute(route))
        next({ ...to, replace: true })
      } catch (error) { // 报错，清空 token 缓存，跳转到 登录页
        removeToken()
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) next()
    else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

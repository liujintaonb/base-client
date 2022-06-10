import { login, logout, getCurrUserInfo } from '@/api/user'
import { getCurrUserPerms } from '@/api/perm'
import { getCurrUserMenu } from '@/api/menu'
import { setToken, removeToken } from '@/utils/auth'

const state = {
  user: { name: '', avatar: '' },
  permMenu: [],
  apiPerms: []
}

const mutations = {
  SET_USER: (state, user) => {
    state.user = user
  },
  SET_PERMSMENUS: (state, permSource = []) => {
    state.permMenu = permSource
  },
  SET_APIPERMS: (state, apiPerms) => {
    state.apiPerms = apiPerms
  }
}

const actions = {
  login: async ({ commit }, loginData) => {
    const res = await login(loginData)
    if (res.code === 200) {
      setToken(res.data.Authorization || '')
    }
    return res
  },
  logout: async ({ commit }) => {
    await logout()
    removeToken()
  },
  getCurrUserApiPerms: async ({ commit, state }) => {
    if (state.apiPerms.length > 0) return state.apiPerms
    const res = await getCurrUserPerms()
    if (res.code === 200) {
      const apiPerms = res.data
      commit('SET_APIPERMS', apiPerms)
      return apiPerms
    }
    return []
  },
  getCurrUserMenus: async ({ commit, state }) => {
    const res = await getCurrUserMenu()
    let permMenu = []
    if (res.code === 200) permMenu = res.data || []
    else permMenu = []
    commit('SET_PERMSMENUS', permMenu)
    return permMenu
  },
  getCurrUserInfo: async ({ commit }) => {
    const res = await getCurrUserInfo()
    if (res.code === 200) {
      commit('SET_USER', res.data)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

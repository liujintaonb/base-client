import { getRoleList } from '@/api/role'

const state = {
  roleList: []
}

const mutations = {
  SET_ROLELIST: (state, roleList) => {
    state.roleList = roleList
  }
}

const actions = {
  async getRoleList ({ state, commit }, isReload) {
    if (!isReload && state.roleList.length > 0) return state.roleList
    const res = await getRoleList()
    if (res.code === 200) {
      return res.data.records || []
    }
    return []
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

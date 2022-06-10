const state = {
  visitedViews: [],
  cachedViews: []
}

const mutations = {
  ADD_VISITED_VIEW: (state, view) => {
    if (state.visitedViews.some(v => v.path === view.path)) return
    state.visitedViews.push(
      Object.assign({}, view, {
        title: view.meta.title || 'no-name'
      })
    )
  },
  ADD_CACHED_VIEW: (state, routeName) => {
    if (state.cachedViews.includes(routeName)) return
    state.cachedViews.push(routeName)
  },

  DEL_VISITED_VIEW: (state, view) => {
    for (const [i, v] of state.visitedViews.entries()) {
      if (v.path === view.path) {
        state.visitedViews.splice(i, 1)
        break
      }
    }
  },
  DEL_CACHED_VIEW: (state, routeName) => {
    const index = state.cachedViews.indexOf(routeName)
    index > -1 && state.cachedViews.splice(index, 1)
  },

  DEL_OTHERS_VISITED_VIEWS: (state, view) => {
    state.visitedViews = state.visitedViews.filter(v => {
      return v.meta.affix || v.path === view.path
    })
  },
  DEL_OTHERS_CACHED_VIEWS: (state, routeName) => {
    const index = state.cachedViews.indexOf(routeName)
    if (index > -1) {
      state.cachedViews = state.cachedViews.slice(index, index + 1)
    } else {
      // if index = -1, there is no cached tags
      state.cachedViews = []
    }
  },

  DEL_ALL_VISITED_VIEWS: state => {
    // keep affix tags
    const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
    state.visitedViews = affixTags
  },
  DEL_ALL_CACHED_VIEWS: state => {
    state.cachedViews = []
  },

  UPDATE_VISITED_VIEW: (state, view) => {
    for (let v of state.visitedViews) {
      if (v.path === view.path) {
        v = Object.assign(v, view)
        break
      }
    }
  }
}

const actions = {
  addVisitedView ({ commit }, view) {
    commit('ADD_VISITED_VIEW', view)
  },
  addCachedView ({ commit }, ...routeNames) {
    routeNames.forEach(name => {
      commit('ADD_CACHED_VIEW', name)
    })
  },
  delVisitedView ({ commit }, view) {
    commit('DELETE_VISITED_VIEW', view)
  },
  delCachedView ({ commit }, ...routeNames) {
    routeNames.forEach(name => {
      commit('DELETE_CACHED_VIEW', name)
    })
  },
  delOthersVisitedViews ({ commit }, view) {
    commit('DEL_OTHERS_VISITED_VIEWS', view)
  },
  delOthersCachedViews ({ commit }, routeName) {
    commit('DEL_OTHERS_CACHED_VIEW', routeName)
  },
  delAllVisitedViews ({ commit }) {
    commit('DEL_ALL_VISITED_VIEWS')
  },
  delAllCachedViews ({ commit }) {
    commit('DEL_ALL_CACHED_VIEW')
  },
  updateVisitedView ({ commit }, view) {
    commit('UPDATE_VISITED_VIEW', view)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

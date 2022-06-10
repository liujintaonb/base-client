import store from '@/store/index'

export default {
  mounted (el, binding, vnode, prevNode) {
    const { value } = binding
    const hasPermission = () => {
      return store.state.user.permMenu.findIndex(v => v.name === value) > -1
    }
    if (!hasPermission()) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

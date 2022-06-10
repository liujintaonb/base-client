import store from '@/store'

export default function hasPerm (val) {
  return store.state.user.permMenu.findIndex(v => v.name === val) > -1
}

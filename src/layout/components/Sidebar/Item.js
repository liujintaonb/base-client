
import { defineComponent, h, toRefs } from 'vue'
import SvgIcon from '_c/SvgIcon'

export default defineComponent({
  name: 'MenuItem',
  components: { SvgIcon },
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    const { icon, title } = toRefs(props)
    const vnodes = []
    if (icon.value) {
      if (icon.value.includes('el-icon')) {
        vnodes.push(h('i', { class: [icon.value, 'sub-el-icon'] }))
      } else {
        vnodes.push(h(SvgIcon, { 'icon-class': icon.value }))
      }
    }
    if (title.value) {
      vnodes.push(h('span', { 'v-slot': 'title' }, title.value))
    }
    return () => vnodes
  }
})

<template>
  <div ref="wangEditRed"></div>
</template>

<script>
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import E from 'wangeditor'

export default defineComponent({
  name: 'WangEdit',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const wangEditRed = ref()

    const editor = ref(null)
    const init = () => {
      editor.value = new E(wangEditRed.value)
      editor.value.config.onchange = (newHtml) => {
        emit('update:modelValue', newHtml)
      }
      editor.value.create()
    }

    watch(() => props.modelValue, (val) => {
      if (editor.value && val !== editor.value.txt.html()) {
        editor.value.txt.html(val)
      }
    })

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      // 销毁编辑器
      editor.value.destroy()
      editor.value = null
    })

    return {
      wangEditRed
    }
  }
})
</script>

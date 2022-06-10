<template>
  <k-map-placement class="k-map-pointer" :placement="placement">
    <div class="k-map-pointer__inner" :class="{ 'is-lock': lock }">
      <span>经纬度：[{{ coordinate.join(', ') }}]</span>
      <i class="el-icon-document-copy" ref="btnRef" title="复制"></i>
      <i class="el-icon-refresh-left" v-if="lock" title="解锁" @click="unlock"></i>
    </div>
  </k-map-placement>
</template>

<script>
import { defineComponent, inject, nextTick, ref } from 'vue'
import Clipboard from 'clipboard'
import KMapPlacement from '../../placement'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: 'KMapPointer',
  components: { KMapPlacement },
  props: {
    precision: {
      type: Number,
      default: 6
    },
    placement: {
      type: String,
      default: 'right-bottom',
      validator (val) {
        return [
          'left-top', 'center-top', 'right-top',
          'left-center', 'center-center', 'right-center',
          'left-bottom', 'center-bottom', 'right-bottom'
        ].includes(val)
      }
    }
  },
  emits: ['copy'],
  setup (props, { emit }) {
    const coordinate = ref([0, 0])
    const lock = ref(false)

    const btnRef = ref()

    const update = e => {
      coordinate.value = e.coordinate.map(n => n.toFixed(props.precision))
    }

    const move = e => {
      if (lock.value) return
      update(e)
    }

    const pick = e => {
      lock.value = true
      update(e)
    }

    const copy = () => {
      emit('copy', coordinate.value)
      ElMessage.success('已复制到剪贴板')
    }

    const unlock = () => {
      lock.value = false
    }

    const init = (map, vm) => {
      update({ coordinate: vm.center })
      map.on('pointermove', move)
      map.on('click', pick)
    }

    const clipboard = ref(null)
    const KMap = inject('KMap', ref(null))
    nextTick(() => {
      if (KMap) {
        clipboard.value = new Clipboard(btnRef.value, {
          text: e => coordinate.value.join(', ')
        })
        clipboard.value.on('success', copy)
        KMap.mapReady(init)
      }
    })

    return {
      coordinate,
      lock,
      update,
      move,
      pick,
      copy,
      unlock,
      btnRef,
      clipboard,
      KMap
    }
  },
  beforeUnmount () {
    this.clipboard && this.clipboard.destroy()
    if (this.KMap && this.KMap.map) {
      this.KMap.map.un('pointermove', this.move)
      this.KMap.map.un('click', this.pick)
    }
  }
})
</script>

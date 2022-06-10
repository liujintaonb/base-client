<template>
  <el-dialog title="选择上级菜单" v-if="visible" v-model="visible" top="5vh" width="350px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-tree :data="menuTree" highlight-current default-expand-all node-key="guid" @node-click="checkedParent"></el-tree>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, inject, ref, watch } from 'vue'

export default defineComponent({
  name: 'CheckMenuTree',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    // dialog 组件相关
    const visible = ref(false)
    watch(() => props.modelValue, (val) => {
      visible.value = val
    })
    const handleClose = () => {
      emit('update:modelValue', false)
    }
    const children = inject('menuTree', ref())
    const menuTree = ref([{ guid: '0', label: '顶级菜单（无上级）', children: children }])
    const menuId = ref('')
    const checkedParent = data => {
      menuId.value = data.guid
    }

    const confirmEvent = () => {
      emit('change', menuId.value)
      handleClose()
    }

    return {
      visible,
      handleClose,
      menuTree,
      checkedParent,
      confirmEvent
    }
  }
})
</script>

<template>
  <el-tree ref="roleMenuTreeRef" :data="menuTree" node-key="guid" @check-change="hanldCheckChange" show-checkbox check-strictly></el-tree>
</template>

<script>
import { arrToTree } from '@/utils'
import { defineComponent, inject, ref, watch } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const menuTree = ref([])
    // 从页面组件中拿取所拥有的菜单
    const menuList = inject('menus', ref([]))
    watch(() => menuList.value, (val) => {
      menuTree.value = arrToTree(val, { pidKey: 'parentId', root: '0', idKey: 'guid' })
    }, { immediate: true })

    const roleMenuTreeRef = ref()
    const setCheckedKeys = (val) => {
      roleMenuTreeRef.value && roleMenuTreeRef.value.setCheckedKeys(val, true)
    }
    watch(() => props.modelValue, val => {
      setCheckedKeys(val)
    })

    const hanldCheckChange = () => {
      emit('update:modelValue', roleMenuTreeRef.value.getCheckedKeys())
    }

    return {
      menuTree,
      roleMenuTreeRef,
      hanldCheckChange,
      setCheckedKeys
    }
  }
})
</script>

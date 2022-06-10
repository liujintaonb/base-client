<template>
  <el-select v-model="currApiPerms" popper-class="menu-apiperms-select" multiple collapse-tags filterable :filter-method="filterApiPerms" @change="handleChange" style="width: 250px;">
    <el-option v-for="api in apiPerms" :label="`${api.tag} + ${api.name} + ${ api.url }`" :value="api.guid" :key="api.guid" class="menu-apiperms-option">
      <div class="api-method-path">{{ api.methodType }} + {{ api.url }}</div>
      <div class="api-desc-content">{{ `${api.tag} - ${api.name}` }}</div>
    </el-option>
  </el-select>
</template>

<script>
import { useStore } from 'vuex'
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    // api perms
    const store = useStore()
    const apiPerms = ref()
    const apiPermsTmp = []
    const getApiPerms = async () => {
      apiPerms.value = await store.dispatch('user/getCurrUserApiPerms')
      apiPermsTmp.push(...(apiPerms.value))
    }
    getApiPerms()
    // 输入过滤
    const filterApiPerms = (value = '') => {
      const val = value.trim().toUpperCase()
      if (!value) {
        apiPerms.value = JSON.parse(JSON.stringify(apiPermsTmp))
        return
      }
      apiPerms.value = apiPermsTmp.filter(api => {
        return `${api.methodType}_${api.url}_${api.name}_${api.tag}`.toUpperCase().indexOf(val) > -1
      })
    }

    const currApiPerms = ref([])
    watch(() => props.modelValue, val => {
      currApiPerms.value = val
    })

    const handleChange = val => {
      emit('update:modelValue', val)
    }

    return {
      currApiPerms,
      apiPerms,
      handleChange,
      filterApiPerms
    }
  }
})
</script>

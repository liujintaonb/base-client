
<template>
  <el-dialog title="选择用户" v-if="visible" v-model="visible" top="10vh" width="400px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <ul class="check-user-list">
      <el-scrollbar>
        <template v-for="user in users.list" :key="user.guid">
          <li :class="{ 'check-user-item': true, 'is-checked': checkedUsers.findIndex(v => v === user.guid) > -1 }" @click="checkChange(user.guid)">
            <div style="display: flex">
              <div style="margin-right: 10px;font-size: 20px;">{{ user.name }}</div>
              <div>{{ user.description }}</div>
            </div>
          </li>
        </template>
      </el-scrollbar>
    </ul>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { ElMessage } from 'element-plus'
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    users: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    const visible = ref(false)
    watch(() => props.modelValue, (val) => {
      visible.value = val
    })
    const handleClose = () => {
      emit('update:modelValue', false)
    }

    const checkedUsers = ref([])

    const checkChange = (userId) => {
      const index = checkedUsers.value.findIndex(v => v === userId)
      if (index > -1) checkedUsers.value.splice(index, 1)
      else checkedUsers.value.push(userId)
    }

    const confirmEvent = () => {
      if (checkedUsers.value.length === 0) {
        ElMessage.error('请至少选择一个用户')
        return
      }
      emit('change', checkedUsers.value)
      handleClose()
    }

    return {
      visible,
      handleClose,
      checkedUsers,
      checkChange,
      confirmEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.check-user-list {
  height: 400px;
  overflow: hidden;
}
.check-user-item {
  padding: 0 7px;
  height: 36px;
  line-height: 35px;
  cursor: pointer;

  &:hover {
    background: #eee;
  }

  &.is-checked {
    background: #e8f4d9;
  }
}
</style>

<template>
  <el-dialog title="角色编辑" v-if="visible" v-model="visible" top="10vh" width="500px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form :model="roleForm" label-width="80px">
      <el-form-item label="角色名称" prop="">
        <el-input v-model.trim="roleForm.name" :maxlength="30" show-word-limit placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="">
        <el-input type="textarea" v-model.trim="roleForm.description" :maxlength="100" show-word-limit placeholder="角色备注"></el-input>
      </el-form-item>
      <el-form-item label="资源授权" prop="">
        <role-menu-tree ref="roleMenuTreeRef" v-model="currRolePermMenus"></role-menu-tree>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { createRole, updateRole, setRoleButton } from '@/api/role'
import { getRoleMenu } from '@/api/menu'
import { ElMessage } from 'element-plus'
import { defineComponent, nextTick, ref, watch } from 'vue'
import RoleMenuTree from './RoleMenuTree.vue'

export default defineComponent({
  components: { RoleMenuTree },
  props: {
    modelValue: {
      type: Boolean,
      defeault: false
    },
    currRole: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    // dialog
    const visible = ref(false)
    const currRolePermMenus = ref([])
    const getRolePermsFn = async id => {
      const res = await getRoleMenu(id)
      if (res.code === 200) {
        const permList = []
        const flatData = (arr) => {
          arr.forEach(item => {
            if (item.checked) permList.push(item.id)
            item.children?.length > 0 && flatData(item.children)
          })
        }
        flatData(res.data)
        currRolePermMenus.value = permList
      }
    }
    const roleMenuTreeRef = ref()
    watch(() => props.modelValue, (val) => {
      !val && roleMenuTreeRef.value && roleMenuTreeRef.value.setCheckedKeys([])
      val && props.currRole?.guid && getRolePermsFn(props.currRole.guid)
      // 只能使用 nextTick ，bug fix 点击取消 弹窗不消失的情况
      // 出现原因 roleMenuTreeRef.setCheckedKeys 遍历全部树较慢，当遍历完时， visible = false 不生效
      nextTick(() => {
        visible.value = val
      })
    })

    const handleClose = () => {
      emit('update:modelValue', false)
    }

    // 表单
    const roleForm = ref({
      name: '',
      description: ''
    })
    watch(() => props.currRole, val => {
      roleForm.value = val
    })

    const createOrUpdateFn = async () => {
      let res
      if (props.currRole?.guid) res = await updateRole(props.currRole.guid, roleForm.value)
      else res = await createRole(roleForm.value)
      if (res.code === 200) {
        const result = await setRoleButton(props.currRole.guid || res.data.guid, currRolePermMenus.value)
        if (result.code === 200) {
          ElMessage.success(props.currRole?.guid ? '更新成功' : '创建成功')
          emit('change', props.currRole?.guid ? 'add' : 'edit')
          handleClose()
        } else {
          ElMessage.error(res.message)
        }
      } else {
        ElMessage.error(res.message)
      }
    }

    const confirmEvent = () => {
      createOrUpdateFn()
    }
    return {
      visible,
      roleMenuTreeRef,
      handleClose,
      confirmEvent,
      // 表单
      roleForm,
      currRolePermMenus
    }
  }
})
</script>

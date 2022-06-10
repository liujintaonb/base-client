<template>
  <el-dialog title="按钮编辑" v-if="visible" v-model="visible" top="10vh" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="btnFormRef" :model="btnForm" :rules="btnFormRules" label-width="80px">
      <el-form-item label="按钮名称" prop="label">
        <el-input v-model.trim="btnForm.label"></el-input>
      </el-form-item>
      <el-form-item label="唯一编码" prop="name">
        <el-input v-model.trim="btnForm.name"></el-input>
      </el-form-item>
      <el-form-item label="授权集合" prop="">
        <api-perms-select v-model="currApiPerms"></api-perms-select>
      </el-form-item>
      <el-form-item label="排序" prop="index">
        <el-input v-model.number="btnForm.index"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { createMenu, updateMenu, setBtnInterface } from '@/api/menu'
import { getOneMenuPerms } from '@/api/perm'
import { ElMessage } from 'element-plus'
import { defineComponent, ref, watch } from 'vue'
import ApiPermsSelect from './ApiPermsSelect.vue'

export default defineComponent({
  components: { ApiPermsSelect },
  props: {
    modelValue: {
      type: Boolean,
      defeault: false
    },
    parent: {
      type: Object,
      default: () => {
        return {}
      }
    },
    currBtn: {
      type: Object,
      default: () => null
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    // dialog
    const visible = ref(false)
    watch(() => props.modelValue, (val) => {
      visible.value = val
    })
    const handleClose = () => {
      emit('update:modelValue', false)
    }

    const currApiPerms = ref([])
    const getOneMenuPermsFn = async id => {
      const res = await getOneMenuPerms(id)
      if (res.code === 200) {
        currApiPerms.value = res.data
      }
    }

    // 表单相关
    const btnFormRef = ref()
    const btnForm = ref({
      label: '',
      name: '',
      index: ''
    })

    watch(() => props.modelValue, (val) => {
      if (val) {
        if (btnFormRef.value) {
          btnFormRef.value.clearValidate()
          btnFormRef.value.resetFields()
        }
        btnForm.value = props.currBtn || { label: '', name: '', index: '' }
        if (btnForm.value.guid) {
          getOneMenuPermsFn(btnForm.value.guid)
        } else {
          currApiPerms.value = []
        }
      }
    })
    // 设置接口权限
    const setBtnInterfaceFn = async (id) => {
      const res = await setBtnInterface(id, currApiPerms.value)
      return res.code === 200
    }

    const createOrUpdateBtnFn = async () => {
      const req = {
        ...btnForm.value,
        type: 3,
        parentId: props.parent.guid
      }
      req.parentId = req.parentId || 0
      let res
      if (req.guid) {
        res = await updateMenu(req.guid, req)
      } else {
        res = await createMenu(req)
      }
      if (res.code === 200) {
        const result = await setBtnInterfaceFn(res.data?.guid || req.guid)
        if (result) {
          ElMessage.success(`${req.guid ? '更新' : '创建'}成功`)
          emit('change')
        } else {
          ElMessage.error(`${req.guid ? '更新' : '创建'}出现错误，请稍后尝试！`)
        }
        handleClose()
      } else {
        ElMessage.error(res.message)
      }
    }

    const confirmEvent = () => {
      btnFormRef.value.validate(valid => {
        if (valid) createOrUpdateBtnFn()
      })
    }

    const btnFormRules = ref({
      label: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' }
      ],
      name: [
        { required: true, message: '请输入唯一编码', trigger: 'blur' }
      ]
    })

    return {
      visible,
      handleClose,
      btnFormRef,
      btnForm,
      currApiPerms,
      btnFormRules,
      confirmEvent
    }
  }
})
</script>

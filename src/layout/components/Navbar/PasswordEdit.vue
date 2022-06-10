<template>
  <el-dialog title="密码修改" v-if="visible" v-model="visible" top="10vh" width="500px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="passwordFormRef" :model="passwordForm" :rules="passwordFormRules" label-width="150px">
      <el-form-item label="旧密码：" prop="password">
        <el-input type="password" v-model="passwordForm.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="newPassword">
        <el-input type="password" v-model="passwordForm.newPassword" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码：" prop="comPassword">
        <el-input type="password" v-model="passwordForm.comPassword" placeholder="请再次输入新密码"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { updateUserPassword } from '@/api/user.js'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    // dialog
    const visible = ref(false)
    watch(() => props.modelValue, (val) => {
      visible.value = val
    })

    const handleClose = () => {
      emit('update:modelValue', false)
    }
    const store = useStore()
    const passwordForm = ref({
      newPassword: '',
      password: '',
      comPassword: ''
    })

    const updateUserPasswordFn = async () => {
      const req = {
        guid: store.state.user.user.guid,
        newPassword: passwordForm.value.newPassword,
        password: passwordForm.value.password
      }
      const res = await updateUserPassword(req)
      if (res.code === 200) {
        ElMessage.success('密码修改成功')
        // 应该是重新登录
        handleClose()
      } else {
        ElMessage.error(res.message)
      }
    }
    const passwordFormRef = ref()
    const confirmEvent = () => {
      passwordFormRef.value.validate(valid => {
        if (valid) updateUserPasswordFn()
      })
    }

    const validatePassword = (rule, value, callback) => {
      if (passwordForm.value.newPassword === '') {
        callback(new Error('请输入新密码'))
      } else if (passwordForm.value.newPassword.length > 20 || passwordForm.value.newPassword.length < 6) {
        callback(new Error('请输入6-20个字符'))
        // } else if (!/^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{9,20}$/.test(passwordForm.newPassword)) {
        //   callback(new Error('请输入字母和数字的组合'))
      } else if (passwordForm.value.newPassword === passwordForm.value.password) {
        callback(new Error('新密码不能与旧密码一致'))
      } else {
        callback()
      }
    }
    const validatePasswordsure = (rule, value, callback) => {
      if (passwordForm.value.comPassword === '') {
        callback(new Error('请输入确认密码'))
      } else if (passwordForm.value.newPassword !== passwordForm.value.comPassword) {
        callback(new Error('两次新密码输入不一致，请核对'))
      } else {
        callback()
      }
    }
    const passwordFormRules = ref({
      password: [
        { required: true, message: '请输入本帐号密码', trigger: 'blur' }
      ],
      newPassword: [
        { required: true, validator: validatePassword, trigger: 'blur' }
      ],
      comPassword: [
        { required: true, validator: validatePasswordsure, trigger: 'blur' }
      ]
    })

    return {
      visible,
      handleClose,
      confirmEvent,
      passwordForm,
      updateUserPasswordFn,
      passwordFormRef,
      passwordFormRules
    }
  }
})
</script>

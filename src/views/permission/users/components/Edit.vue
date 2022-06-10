<template>
  <el-dialog title="用户信息编辑" v-if="visible" v-model="visible" top="10vh" width="500px" :before-close="handleClose" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-form ref="userFormRef" :model="userForm" label-width="80px" :rules="userFormRules">
      <el-form-item label="用户名" prop="name">
        <el-input v-model="userForm.name" :disabled="!!currUser?.guid"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model.trim="userForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model.trim="userForm.email"></el-input>
      </el-form-item>
      <el-form-item label="公司/组织" prop="company">
        <el-input v-model.trim="userForm.company"></el-input>
      </el-form-item>
      <el-form-item label="行政编码" prop="xzcode">
        <el-input v-model.trim="userForm.xzcode" placeholder="暂时手动输入，等之后有接口后统一改"></el-input>
      </el-form-item>
      <el-form-item label="级别" prop="level">
        <el-input v-model.trim="userForm.level" placeholder="请输入用户级别"></el-input>
      </el-form-item>
      <el-form-item label="密码" v-if="!currUser?.guid" prop="password">
        <el-input type="password" v-model="userForm.password" placeholder="请输入帐号密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" v-if="!currUser?.guid" prop="comPassword">
        <el-input type="password" v-model="userForm.comPassword" placeholder="再次输入密码"></el-input>
      </el-form-item>
      <el-form-item label="角色集合" prop="">
        <el-select v-model="currUserRoleList" multiple filterable>
          <el-option v-for="role in roleList" :label="role.name" :value="role.guid" :key="role.guid"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmEvent">确认</el-button>
    </template>
  </el-dialog>
</template>

<script >
import { defineComponent, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { updateUser, createUser, getUserRoleList, setUserRole } from '@/api/user'
import { validPhone, validEmail } from '@/utils/validate.js'

export default defineComponent({
  name: 'EditUser',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    currUser: {
      type: Object,
      default: () => {
        return {}
      }
    },
    roleList: {
      type: Array,
      default: () => []
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

    // 表单
    const userForm = ref({
      company: '',
      name: '',
      description: '',
      phone: '',
      email: '',
      level: '',
      comPassword: '',
      password: '',
      xzcode: ''
    })

    const createOrUpdateFn = async () => {
      if (currUserRoleList.value.length === 0) {
        try {
          await ElMessageBox.confirm('当前用户未选择角色，可能会影响使用，是否继续？', '提示')
        } catch (error) {
          return
        }
      }
      const user = { ...userForm.value }
      delete user.comPassword
      if (user.guid) {
        delete user.password
      }
      let res
      if (props.currUser?.guid) res = await updateUser(props.currUser.guid, user)
      else res = await createUser(user)
      if (res.code === 200) {
        const result = await setUserRole(res.data?.guid || props.currUser.guid, currUserRoleList.value)
        if (result.code === 200) {
          ElMessage.success(`${props.currUser?.guid ? '更新' : '创建'}成功`)
          emit('change')
          handleClose()
        } else {
          ElMessage.error(result.message)
        }
      } else {
        ElMessage.error(res.message)
      }
    }

    // 确认表单
    const confirmEvent = () => {
      createOrUpdateFn()
    }

    // 查询用户所有角色
    const currUserRoleList = ref([])
    const getUserRoleListFn = async (userId) => {
      const res = await getUserRoleList(userId)
      if (res.code === 200) {
        currUserRoleList.value = res.data.map(role => role.guid)
      }
    }
    watch(() => props.modelValue, val => {
      if (val) {
        userForm.value = props.currUser
        if (props.currUser.guid) getUserRoleListFn(props.currUser.guid)
      }
    })
    const userFormRef = ref()

    // 表单校验
    const validPhoneFn = (rule, value, callback) => {
      if (value && validPhone(value)) {
        callback()
      } else {
        callback(new Error('手机号格式错误，请输入正确的手机号'))
      }
    }
    const validEmailFn = (rule, value, callback) => {
      if (value) {
        validEmail(value) ? callback() : callback(new Error('邮箱格式错误，请输入正确的邮箱'))
      } else {
        callback()
      }
    }
    const validPasswordFn = (rule, value, callback) => {
      const password = userForm.value.password
      const comPassword = userForm.value.comPassword
      if (password && comPassword) {
        password === comPassword ? callback() : callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    const userFormRules = ref({
      name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { max: 20, message: '最多可输入20个字符', trigger: 'blur' }
      ],
      phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: validPhoneFn, trigger: 'blur' }
      ],
      level: [
        { required: true, message: '请输入级别', trigger: 'blur' }
      ],
      email: [
        { required: false, validator: validEmailFn, trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { validator: validPasswordFn, trigger: 'blur' }
      ],
      comPassword: [
        { required: true, message: '请输入确认密码', trigger: 'blur' },
        { validator: validPasswordFn, trigger: 'blur' }
      ]
    })
    return {
      visible,
      handleClose,
      userForm,
      userFormRef,
      userFormRules,
      confirmEvent,
      currUserRoleList
    }
  }
})
</script>

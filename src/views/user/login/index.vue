<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="system-tip-wrapper">
        <div class="logo-container">
          <!-- logo -->
          <div class="logo"></div>
          <div class="logo-title">BaseAdminClient</div>
        </div>
        <div class="system-tip">
          <img :src="loginBoxBg" alt="">
          <div class="system-tip__title">开箱即用的中后台管理系统</div>
        </div>
      </div>
      <div class="form-conatiner">
        <div class="form-wrapper">
          <h3 class="form-title">登录</h3>
          <el-form ref="loginFormRef" style="width: 100%;" :model="formData" :rules="loginFormRules" >
            <el-form-item prop="username">
              <el-input v-model.trim="formData.username" placeholder="帐号"></el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input type="password" v-model="formData.password" placeholder="密码"  @keyup.enter="loginEvent"></el-input>
            </el-form-item>
            <el-form-item>
              <div style="display: flex; justify-content: space-between;">
                <el-checkbox v-model="autoLogin">自动登录</el-checkbox>
                <el-button type="text">忘记密码</el-button>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 100%;" @click="loginEvent" :loading="loading">登&nbsp;&nbsp;&nbsp;录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { defineComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import loginBoxBg from '@/assets/imgs/login-box-bg.svg'

export default defineComponent({
  name: 'Login',
  data () {
    return {
      loginBoxBg
    }
  },
  setup () {
    const formData = ref({ username: '', password: '' })
    const autoLogin = ref(false)

    const loginFormRules = ref({
      username: [
        { required: true, message: '请输入帐号', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    })

    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const loginFormRef = ref()

    const loading = ref(false)
    // 登录事件
    const loginEvent = () => {
      loginFormRef.value.validate(valid => {
        if (valid) {
          loading.value = true
          store.dispatch('user/login', formData.value).then(res => {
            loading.value = false
            if (res.code === 200) {
              router.replace(route.query?.redirect || '/')
            } else {
              ElMessage.error(res.message)
            }
          }).catch(() => { loading.value = false })
        } else {
          return false
        }
      })
    }

    return {
      loading,
      autoLogin,
      formData,
      loginFormRef,
      loginFormRules,
      loginEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background-color: #fff;

  .login-wrapper {
    height: 100%;
    position: relative;
    padding: 0.5rem 0 0.5rem 0;
    margin: 0 auto;
    display: flex;
  }
}

.logo-container {
  display: flex;
  width: 60%;
  height: 80px;
}

.logo-title {
  font-size: 24px;
  font-weight: 700;
  transition: all .5s;
  color: #fff;
}

.system-tip-wrapper {
  width: 50%;
  min-height: 100vh;
  flex-direction: column;
  padding-left: 1rem;
}

.system-tip {
  margin: auto 0;
  img {
    margin-top: -4rem;
    width: 50%;
    height: auto;
    vertical-align: middle;
    border-style: none;
  }
}

.system-tip__title {
  margin-top: 2.5rem;
  line-height: 2.25rem;
  font-size: 1.875rem;
  font-weight: 500;
  color: #fff;
}

.form-conatiner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-wrapper {
  width: 75%;
  margin-left: 5rem;
  .form-title {
    font-size: 1.875rem;
    line-height: 2.25rem;
    margin-bottom: 1.5rem;
  }
}

@media (min-width: 768px) {
  .login-wrapper {
    max-width: 768px;
  }
  .form-wrapper {
    width: 60%;
  }
}

@media (min-width: 992px) {
  .login-wrapper {
    max-width: 992px;
  }
  .form-wrapper {
    width: 50%;
  }
}

@media (min-width: 1200px) {
  .login-wrapper {
    max-width: 1200px;
  }
  .login-container::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    margin-left: -48%;
    background-image: url(~@/assets/imgs/login-bg.svg);
    background-position: 100%;
    background-repeat: no-repeat;
    background-size: auto 100%;
    content: '';
    border-width: 0;
    border-style: solid;
    border-color: #e4e4e7;
  }
  .system-tip-wrapper {
    display: flex;
  }
  .form-conatiner {
    width: 50%;
  }
  .form-wrapper {
    width: 60%;
  }
  .form-title {
    text-align: left;
  }
}

@media (max-width: 1200px) {
  .login-container {
    background: linear-gradient(180deg, #1c3faa,#1c3faa);
  }
  .system-tip-wrapper {
    display: none;
  }
  .form-conatiner {
    width: 100%;
  }
  .form-wrapper {
    padding: 2rem;
    background-color: #fff;
    border-radius: 10px;
  }
  .form-title {
    text-align: center
  }
}
</style>

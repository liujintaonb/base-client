<template>
  <div class="navbar">
    <hamburger id="hamburger-container" class="hamburger-container" :is-active="sidebar.opened" @toggle-click="toggleSideBar"></hamburger>

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar icon="el-icon-user-solid" src="https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?imageView2/1/w/80/h/80" fit="fill" class="user-avatar" shape="square"></el-avatar>
          <span class="user-name">{{ username }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>首页</el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
          <el-dropdown-menu>
            <a @click="updatePasswodEvent">
              <el-dropdown-item>修改密码</el-dropdown-item>
            </a>
          </el-dropdown-menu>
          <el-dropdown-menu>
            <a @click="logoutEvent">
              <el-dropdown-item>退出</el-dropdown-item>
            </a>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <password-edit v-model="showUpdatePw"></password-edit>
  </div>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import Hamburger from '_c/Hamburger/index.vue'
import Breadcrumb from '_c/Breadcrumb/index.vue'
import PasswordEdit from './PasswordEdit.vue'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
  name: 'Navbar',
  components: { Hamburger, Breadcrumb, PasswordEdit },
  setup () {
    const store = useStore()
    const username = computed(() => store.state.user.user.name)
    const sidebar = computed(() => store.state.app.sidebar)
    const toggleSideBar = () => {
      store.dispatch('app/toggleSideBar')
    }
    const showUpdatePw = ref(false)
    const updatePasswodEvent = () => {
      showUpdatePw.value = true
    }

    const logoutEvent = () => {
      ElMessageBox.confirm('是否确认退出登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await store.dispatch('user/logout')
        // 这里采用 页面重载，防止路由跳转 出 bug
        window.location.reload()
      }).catch(() => {})
    }

    return {
      username,
      sidebar,
      toggleSideBar,
      logoutEvent,
      showUpdatePw,
      updatePasswodEvent
    }
  }
})
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  ::v-deep  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;

        .user-avatar {
          border-radius: 10px;
        }

        .user-name {
          margin-left: 5px;
          font-size: 24px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>

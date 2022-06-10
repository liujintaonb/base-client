<template>
  <div class="roles-container">
    <div class="roles-list-wrapper">
      <h3 class="roles__tip">
        <span>全部角色</span>
        <span class="fr clearfix tip-action">
          <el-button size="mini" @click="addRoleEvent" v-perm="'perm_roles:add'">新增</el-button>
        </span>
      </h3>
      <el-scrollbar class="role-list-content">
        <ul>
          <li
            class="roles-item"
            :class="{ 'role-item': true, 'is-active': currRole.guid === role.guid }"
            v-for="role in roleData"
            :key="role.guid"
            @click="roleClickEvent(role)"
            >
            {{ role.name }}
          </li>
        </ul>
      </el-scrollbar>
    </div>
    <!-- 右侧 -->
    <div class="role-content">
      <role-info :curr-role="currRole" ref="roleInfoRef" @change="addOrEditSuccess"></role-info>
      <role-user-list :curr-role="currRole"></role-user-list>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import RoleInfo from './components/RoleInfo.vue'
import RoleUserList from './components/RoleUserList.vue'

export default defineComponent({
  components: { RoleInfo, RoleUserList },
  setup () {
    const roleData = ref([])
    const currRole = ref()

    const store = useStore()
    const getRoleListFn = async () => {
      const res = await store.dispatch('business/getRoleList', true)
      roleData.value = res
      if (roleData.value.length > 0) {
        currRole.value = roleData.value[0]
      }
    }

    const roleClickEvent = (role) => {
      currRole.value = role
    }

    getRoleListFn()

    const roleInfoRef = ref()

    const addRoleEvent = () => {
      currRole.value = { name: '', description: '', menuIds: [] }
      roleInfoRef.value.addOrEditEvent('add')
    }

    const addOrEditSuccess = () => {
      getRoleListFn()
    }
    return {
      roleData,
      currRole,
      roleClickEvent,
      roleInfoRef,
      addRoleEvent,
      addOrEditSuccess
    }
  }
})
</script>

<style lang="scss" scoped>
.roles-container {
  display: flex;
  flex-wrap: nowrap;
  padding: 0;
  background: rgba(245, 245, 245, .6);
}

::v-deep .roles__tip {
  vertical-align: middle;
  line-height: 50px;
  padding-left: 16px;
  font-size: 14px;
  font-weight: 700;
  background: #eef2f5;

  .tip-action {
    margin-right: 16px;
  }
}

.roles-list-wrapper {
  width: 200px;
  height: 100%;
  padding-bottom: 20px;
  background: #fff;
  overflow: hidden;

  .roles-item {
    padding: 7px 16px;
    line-height: 1.5;
    font-size: 14px;
    cursor: pointer;

    &:hover {
      background-color: #F5F7FA;
    }

    &.is-active {
      background-color: #f0f7ff;
      color: #008fe4;
    }
  }
}
.role-list-content {
  height: calc(100% - 50px);
}

.role-content {
  width: calc(100% - 200px);
  margin-left: 10px;
  height: 100%;
}
</style>

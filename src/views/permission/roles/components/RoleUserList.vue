<template>
  <div class="role-user-list-wrapper">
    <h3 class="roles__tip">
      <span>关联用户</span>
      <span class="fr clearfix tip-action">
        <el-button size="mini" @click="addUserToRole" v-perm="'perm_roles:addUser'">添加用户</el-button>
      </span>
    </h3>
    <div class="role-user-list" v-loading="loading">
      <k-table ref="roleUserListRef" mode="render" :data="userData" :callback="pager => getUserListFn(currRole.guid, 1, pager)" border stripe>
        <el-table-column label="帐号" prop="name" align="center"></el-table-column>
        <el-table-column label="公司/组织" prop="company" align="center"></el-table-column>
        <el-table-column label="头像" prop="avatar" align="center"></el-table-column>
        <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
        <el-table-column label="注册时间" prop="createTime" align="center" width="90"></el-table-column>
        <el-table-column label="操作" prop="" align="center" width="200" v-if="hasCancelUserPerm">
          <template  #default="{ row }">
            <el-button type="danger" plain @click="createOrcancelCorrelation('cancel', [row.guid])">取消关联</el-button>
          </template>
        </el-table-column>
      </k-table>
    </div>

    <!-- 选择添加用户 -->
    <check-users v-model="showCheckUser" :users="hasNotRoleUser" @change="userIds => createOrcancelCorrelation('create', userIds)"></check-users>
  </div>
</template>

<script>
import { getNoRoleUserList, getHasRoleUserList, unbindUserList, bindUserList } from '@/api/role'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, ref, watch } from 'vue'
import CheckUsers from './CheckUsers.vue'
import hasPerm from '@/utils/perm'

const hasCancelUserPerm = hasPerm('perm_roles:cancelUser')

export default defineComponent({
  components: { CheckUsers },
  props: {
    currRole: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      hasCancelUserPerm
    }
  },
  setup (props) {
    const userData = ref({ list: [], total: 0 })
    const hasNotRoleUser = ref({ list: [], total: 0 })
    const loading = ref(false)
    // hasCurrRole = 0 | 1
    const getUserListFn = async (roleId, hasCurrRole, { page, size }) => {
      let res
      if (hasCurrRole) {
        loading.value = true
        res = await getHasRoleUserList(roleId, { page, size }).catch(() => { loading.value = false })
        loading.value = false
      } else res = await getNoRoleUserList(roleId, { page, size })
      if (res.code === 200) {
        const data = { list: res.data.records, total: res.data.total }
        hasCurrRole === 1 ? userData.value = data : hasNotRoleUser.value = data
      }
    }
    // 监听当前 角色，查询当前角色所关联的用户
    watch(() => props.currRole, (val) => {
      if (val.guid) {
        getUserListFn(val.guid, 1, { page: 1, size: 10 })
      }
    })

    const showCheckUser = ref(false)
    const addUserToRole = async () => {
      await getUserListFn(props.currRole.guid, 0, { page: 1, size: 10 })
      showCheckUser.value = true
    }

    const roleUserListRef = ref()
    //  type = 'create' | 'cancel'
    const createOrCancelRoleUserFn = async (type, userIds) => {
      let res
      if (type === 'cancel') {
        res = await unbindUserList(props.currRole.guid, userIds)
      } else {
        res = await bindUserList(props.currRole.guid, userIds)
      }
      if (res.code === 200) {
        ElMessage.success(type === 'cancel' ? '关联取消成功' : '关联用户成功')
        // 表格重载
        roleUserListRef.value.refreshData()
      } else {
        ElMessage.error(res.message)
      }
    }

    // 取消关联 type = 'create' | 'cancel'
    const createOrcancelCorrelation = async (type, userIds) => {
      if (type === 'cancel') {
        try {
          await ElMessageBox.confirm('确定取消当前角色用户关联，是否继续', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          await createOrCancelRoleUserFn(type, userIds)
        } catch (error) {}
        return
      }
      await createOrCancelRoleUserFn(type, userIds)
    }

    return {
      userData,
      loading,
      hasNotRoleUser,
      getUserListFn,
      showCheckUser,
      createOrcancelCorrelation,
      roleUserListRef,
      addUserToRole
    }
  }
})
</script>

<style lang="scss" scoped>
.role-user-list-wrapper {
  width: 100%;
  height: calc(100% - 230px);
  margin-top: 10px;
  background: #fff;
}
.role-user-list {
  padding: 10px;
}
</style>

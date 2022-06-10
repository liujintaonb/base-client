<template>
  <div>
    <div class="filter-container">
      <!-- <div class="filter-item">
        <el-input
          v-model="searchReq.name"
          placeholder="用户帐号"
          style="width: 200px;"
          clearable
        ></el-input>
      </div>
      <div class="filter-item">
        <el-input
          v-model="searchReq.phone"
          placeholder="用户手机"
          style="width: 200px;margin-left: 10px;"
          clearable
        ></el-input>
      </div>
      <div class="filter-item">
        <el-input
          v-model="searchReq.email"
          placeholder="用户邮箱1"
          style="width: 200px;margin-left: 10px;"
          clearable
        ></el-input>
      </div>
      <div class="filter-action-wrapper filter-item">
        <el-button
          type="primary"
          @click="searchEvent"
        >搜索</el-button>
        <el-button
          @click="showUserEditEvent('add')"
          v-perm="'perm_users:add'"
        >新增</el-button>
      </div> -->
      <k-form
        ref="userFormRef"
        mode="conf"
        labelWidth="0px"
        :formData="searchReq"
        :columns="formColumns"
        :btnColumns="formBtns"
      >
      </k-form>
    </div>

    <k-table
      ref="userTableRef"
      mode="render"
      :data="userData"
      :callback="getUserListFn"
      :loading="loading"
      auto
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        label="帐号"
        prop="name"
        align="center"
      ></el-table-column>
      <el-table-column
        label="公司/组织"
        prop="company"
        align="center"
      ></el-table-column>
      <el-table-column
        label="手机号"
        prop="phone"
        align="center"
      ></el-table-column>
      <el-table-column
        label="邮箱"
        prop="email"
        align="center"
      ></el-table-column>
      <el-table-column
        label="注册时间"
        prop="createTime"
        align="center"
        width="90"
      ></el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="100"
      >
        <template #default="{ row }">
          <k-badge :type="row.isEnable ? 'success' : 'danger'">{{ row.isEnable ? '启用' : '禁用' }}</k-badge>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        prop=""
        align="center"
        width="320"
        v-if="hasEditSetPwPerm || hasDelSetStatusPerm"
      >
        <template #default="{ row }">
          <div v-if="hasEditSetPwPerm">
            <el-button
              type="primary"
              plain
              size="mini"
              @click="showUserEditEvent('edit',row)"
              v-perm="'perm_users:edit'"
            >编辑</el-button>
            <el-button
              type="danger"
              plain
              size="mini"
              @click="updateSetPasswordEvent(row)"
              v-perm="'perm_users:setPw'"
            >重置密码</el-button>
          </div>
          <div
            style="margin-top: 10px;"
            v-if="hasDelSetStatusPerm"
          >
            <el-button
              :type="row.isEnable ? 'danger' : 'primary'"
              plain
              size="mini"
              @click="updateStatusEvent(row)"
              v-perm="'perm_users:setStatus'"
            >{{ row.isEnable ? '禁用' : '启用' }}</el-button>
            <el-button
              type="danger"
              plain
              size="mini"
              @click="deleteUserEvent(row)"
              v-perm="'perm_users:del'"
            >删除</el-button>
          </div>
        </template>
      </el-table-column>
    </k-table>

    <!-- 编辑用户 -->
    <edit-user
      v-model="showUserEdit"
      :curr-user="currUser"
      :role-list="roleList"
      @change="updateUserSuccess"
    ></edit-user>
  </div>
</template>

<script>
import EditUser from './components/Edit.vue'
import { defineComponent, ref } from 'vue'
import { getUserList, updateUser, updateSetPassword, deleteUser } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useStore } from 'vuex'
import hasPerm from '@/utils/perm'

const hasEditSetPwPerm = hasPerm('perm_users:edit') || hasPerm('perm_users:setPw')
const hasDelSetStatusPerm = hasPerm('perm_users:del') || hasPerm('perm_users:setStatus')

export default defineComponent({
  components: { EditUser },
  data () {
    return {
      hasEditSetPwPerm,
      hasDelSetStatusPerm,
      formColumns: [
        {
          type: 'input',
          placeholder: '请输入用户帐号',
          prop: 'name'
        },
        {
          type: 'input',
          placeholder: '请输入用户手机',
          prop: 'phone'
        },
        {
          type: 'input',
          placeholder: '请输入用户邮箱',
          prop: 'email'
        }
      ],
      formBtns: [
        {
          label: '搜索',
          perm: 'perm_users:add',
          callBack: this.searchEvent
        },
        {
          label: '新增',
          perm: 'perm_users:add',
          type: 'plain',
          callBack: () => {
            this.showUserEditEvent('add')
          }
        }
      ]
    }
  },
  setup () {
    const userData = ref({ list: [], total: 0 })

    const loading = ref(false)

    const searchReq = ref({
      page: 1,
      size: 10,
      name: '',
      phone: '',
      email: ''
    })
    // 查询表格事件
    const queryReq = ref({ page: 1, size: 10 })
    const getUserListFn = async ({ page, size }) => {
      loading.value = true
      const res = await getUserList({ ...queryReq.value, page, size }).catch(() => { loading.value = false })
      loading.value = false
      if (res.code === 200) {
        const data = res.data
        userData.value = { list: data.records, total: data.total }
      } else {
        ElMessage.error(res.message)
      }
    }
    const searchEvent = () => {
      queryReq.value = Object.assign({}, searchReq.value)
    }

    // 编辑用户相关
    const showUserEdit = ref(false)
    const currUser = ref({})
    // type = 'add' | 'edit'
    const showUserEditEvent = (type, row) => {
      currUser.value = row
      showUserEdit.value = true
    }

    const userTableRef = ref()
    const updateUserSuccess = () => {
      // 在当前页 重新加载数据
      userTableRef.value.refreshData()
    }

    const updateStatusEvent = async (row) => {
      const req = { ...row }
      req.isEnable = !req.isEnable
      const res = await updateUser(req.guid, req)
      if (res.code === 200) {
        ElMessage.success(`${req.isEnable ? '启用' : '禁用'}成功`)
        updateUserSuccess()
      } else {
        ElMessage.error(res.message)
      }
    }

    // 重置用户密码, 这里需要给出提示重置后的密码是多少
    const updateSetPasswordEvent = async (row) => {
      try {
        await ElMessageBox.confirm(`是否确定重置【${row.name}】用户密码？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await updateSetPassword(row.guid)
        if (res.code === 200) {
          ElMessage.success('该用户密码已重置')
        } else {
          ElMessage.error(res.message)
        }
      } catch (error) { }
    }

    // 删除用户
    const deleteUserEvent = async (row) => {
      try {
        await ElMessageBox.confirm(`是否确定删除【${row.name}】用户，且删除后不可恢复？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await deleteUser(row.guid)
        if (res.code === 200) {
          ElMessage.success('该用户已删除')
        } else {
          ElMessage.error(res.message)
        }
      } catch (error) { }
    }

    // 获取所有角色
    const store = useStore()
    const roleList = ref([])
    const getRoleList = async () => {
      roleList.value = await store.dispatch('business/getRoleList')
    }
    getRoleList()
    return {
      loading,
      searchReq,
      userData,
      searchEvent,
      getUserListFn,
      updateSetPasswordEvent,
      deleteUserEvent,
      // 编辑用户相关
      currUser,
      showUserEdit,
      showUserEditEvent,
      userTableRef,
      updateUserSuccess,
      updateStatusEvent,
      roleList
    }
  }
})
</script>

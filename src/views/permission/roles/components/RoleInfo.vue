<template>
  <div class="role-info-wrapper">
    <h3 class="roles__tip">
      <span>基础信息</span>
      <span class="fr clearfix tip-action">
        <el-button type="primary" @click="addOrEditEvent" :disabled="!editRole?.guid" size="mini" v-perm="'perm_roles:edit'">编辑</el-button>
        <el-button type="danger" @click="delRoleFn" :disabled="!editRole?.guid" size="mini" v-perm="'perm_roles:del'">删除</el-button>
      </span>
    </h3>
    <div class="role-info-content">
      <div class="role-item">
        <span class="role-item__label">角色名称：</span>
        <span class="role-item__content">{{ editRole.name || '--' }}</span>
      </div>
      <div class="role-item">
        <span class="role-item__label">创建时间：</span>
        <span class="role-item__content">{{ editRole.createTime || '--' }}</span>
      </div>
      <div class="role-item">
        <span class="role-item__label">备注：</span>
        <span class="role-item__content">{{ editRole.description || '--' }}</span>
      </div>
    </div>
    <role-edit v-model="showEdit" :curr-role="editRole" @change="addOrEditSuccess"></role-edit>
  </div>
</template>

<script>
import { defineComponent, provide, ref, watch } from 'vue'
import RoleEdit from './RoleEdit.vue'
import { getAllMenu } from '@/api/menu'
import { delRoleInfo } from '@/api/role'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
  components: { RoleEdit },
  props: {
    currRole: {
      type: Object,
      default: () => {
        return {
          name: '',
          createTime: '',
          description: ''
        }
      }
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const showEdit = ref(false)
    const editRole = ref({})
    watch(() => props.currRole, val => {
      editRole.value = val
    })

    const delRoleFn = async () => {
      try {
        await ElMessageBox.confirm('该操作将删除当前角色，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } catch (error) {}
      const res = await delRoleInfo(props.currRole.guid)
      if (res.code === 200) {
        addOrEditSuccess('del')
      }
    }

    // 查询所拥有的菜单资源
    const menuList = ref([])
    const getMenuList = async () => {
      const res = await getAllMenu()
      if (res.code === 200) {
        menuList.value = res.data.records
      }
    }
    getMenuList()
    provide('menus', menuList)
    // type = 'add' | 'edit'
    const addOrEditEvent = (type) => {
      if (type === 'add') {
        editRole.value = { name: '', description: '', menuIds: [] }
      } else {
        editRole.value = props.currRole
      }
      showEdit.value = true
    }
    // type = 'add' | 'del' | 'edit'
    const addOrEditSuccess = (type) => {
      emit('change', type)
    }
    return {
      showEdit,
      delRoleFn,
      addOrEditEvent,
      addOrEditSuccess,
      editRole
    }
  }
})
</script>

<style lang="scss" scoped>
.role-info-wrapper {
  width: 100%;
  height: 220px;
  background: #fff;

  .role-info-content {
    padding: 10px;
  }

  .role-item {
    padding: 5px 10px;

    &__label {
      display: inline-block;
      width: 80px;
      line-height: 1.5;
      text-align: right;
      font-weight: 600;
      white-space: nowrap;
    }
    &__content {
      color: #666;
      line-height: 1.5;
    }
  }
}
</style>

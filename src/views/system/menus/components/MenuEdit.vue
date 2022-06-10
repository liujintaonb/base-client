<template>
  <div class="menu-form-wrapper" >
    <div class="menu-action">
      <el-button type="primary" :disabled="isEditStatus || !currMenu?.guid" @click="addOrUpdate('edit')" v-perm="'system_menus:edit'">编辑</el-button>
      <el-button type="danger" :disabled="isEditStatus || !currMenu?.guid" @click="delMenuFn"  v-perm="'system_menus:del'">删除</el-button>
      <el-button :disabled="isEditStatus"  @click="addOrUpdate('add')" v-perm="'system_menus:add'">添加</el-button>
    </div>
    <el-form ref="menuFormRef" class="menu-form" :model="menuForm" :rules="menuFormRules" label-width="100px" :disabled="!isEditStatus">
      <el-form-item label="菜单名称" prop="label">
        <el-input v-model.trim="menuForm.label" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="">
        <el-button type="text" @click="isShowChecked = true">{{ menuObj[menuForm.parentId]?.label || '无' }}</el-button>
      </el-form-item>
      <el-form-item label="唯一编码" prop="name">
        <el-input v-model.trim="menuForm.name" placeholder="唯一标识"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="menuForm.type" placeholder="请选择类型" style="width: 250px;">
          <el-option label="菜单" :value="1"></el-option>
          <el-option label="标签页" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限集合">
        <api-perms-select v-model="currApiPerms"></api-perms-select>
      </el-form-item>
      <el-form-item label="排序" prop="">
        <el-input v-model.number="menuForm.index  " placeholder="排序"></el-input>
      </el-form-item>
      <div class="menu-form-action" v-show="isEditStatus">
        <el-button @click="cancelAddOrEdit">取消</el-button>
        <el-button type="primary" @click="createOrUpdateEvent">确认</el-button>
      </div>
    </el-form>

    <!-- 上级菜单选择 -->
    <check-menu-tree v-model="isShowChecked" @change="checkedParentId"></check-menu-tree>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { createMenu, delMenu, updateMenu, setBtnInterface } from '@/api/menu'
import { getOneMenuPerms } from '@/api/perm'
import CheckMenuTree from './CheckMenuTree.vue'
import ApiPermsSelect from './ApiPermsSelect.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default defineComponent({
  components: { CheckMenuTree, ApiPermsSelect },
  props: {
    currMenu: {
      type: Object,
      default: () => {
        return {}
      }
    },
    allMenu: {
      type: Array,
      default: () => []
    },
    menuTree: {
      type: Array,
      default: () => []
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    // 当前选中 apiPerms
    const currApiPerms = ref([])
    // 表单详情
    const menuForm = ref({ parentId: '', name: '', label: '', type: '', index: '' })

    // 获取父级菜单
    const menuObj = ref({})
    watch(() => props.allMenu, (val) => {
      val.forEach(menu => {
        menuObj.value[menu.guid] = menu
      })
    })
    const menuPermObj = ref({})
    const getOneMenuPermsFn = async (id) => {
      const res = await getOneMenuPerms(id)
      if (res.code === 200) {
        menuPermObj.value[id] = res.data
        currApiPerms.value = menuPermObj.value[id]
      }
    }

    // 当前菜单改变
    watch(() => props.currMenu, val => {
      menuForm.value = val
      getOneMenuPermsFn(val.guid)
    })

    // 表单操作
    const menuFormRef = ref() // 表单实例
    const isEditStatus = ref(false)
    // type = 'edit' | 'add'
    const addOrUpdate = (type) => {
      if (type === 'add') {
        menuForm.value = { parentId: props.currMenu?.guid || 0, name: '', label: '', type: '', index: '' }
      }
      isEditStatus.value = true
    }
    const cancelAddOrEdit = () => {
      menuForm.value = props.currMenu
      isEditStatus.value = false
      currApiPerms.value = menuPermObj.value[menuForm.value.guid]
      menuFormRef.value.clearValidate()
    }

    const isShowChecked = ref(false)
    const checkedParentId = (menuId) => {
      menuForm.value.parentId = menuId
    }
    // 设置接口权限
    const setBtnInterfaceFn = async (id) => {
      const res = await setBtnInterface(id, currApiPerms.value)
      return res.code === 200
    }
    // 创建 / 更新 请求
    const createOrUpdateMenuFn = async () => {
      const req = {
        ...menuForm.value
        // menuPermList: currApiPerms.value.map(curr => {
        //   const permObjArr = curr.split(',')
        //   return { apiMethod: permObjArr[0], apiUrl: permObjArr[1] }
        // })
      }
      req.parentId = req.parentId || '0'
      let res
      if (req.guid) {
        delete req.children
        res = await updateMenu(req.guid, req)
      } else {
        res = await createMenu(req)
      }
      if (res.code === 200) {
        const result = await setBtnInterfaceFn(res.data?.guid || req.guid)
        if (result) {
          ElMessage.success(`${req.guid ? '更新' : '创建'}成功`)
          isEditStatus.value = false
          emit('change')
        } else {
          ElMessage.error(`${req.guid ? '更新' : '创建'}出现错误，请稍后尝试！`)
        }
      } else {
        ElMessage.error(res.message)
      }
    }

    const delMenuFn = async () => {
      try {
        await ElMessageBox.confirm(`此操作将会永久删除【${props.currMenu.label}】菜单，是否继续`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await delMenu(props.currMenu.guid)
        if (res.code === 200) {
          ElMessage.success(`菜单【${props.currMenu.name}】删除成功`)
          emit('change')
        } else {
          ElMessage.error(res.message)
        }
      } catch (error) {}
    }

    const createOrUpdateEvent = () => {
      menuFormRef.value.validate(valid => {
        if (valid) createOrUpdateMenuFn()
      })
    }

    const menuFormRules = ref({
      name: [
        { required: true, message: '请输入菜单名称', trigger: 'blur' }
      ],
      code: [
        { required: true, message: '请输入唯一编码', trigger: 'blur' }
      ],
      type: [
        { required: true, message: '请选择类型', trigger: 'blur' }
      ]
    })

    return {
      menuObj,
      menuFormRef,
      menuFormRules,
      menuForm,
      currApiPerms,
      isEditStatus,
      addOrUpdate,
      cancelAddOrEdit,
      // 选择上级菜单相关
      isShowChecked,
      checkedParentId,
      createOrUpdateEvent,
      delMenuFn
    }
  }
})
</script>

<style lang="scss" scoped>
.menu-form-wrapper {
  width: 100%;
  height: 420px;
  background: #fff;

  .menu-action {
    padding: 10px 20px;
  }
  .menu-form {
    width: 400px;
    margin-top: 10px;

    .menu-form-action {
      text-align: right;
    }
  }
}
</style>

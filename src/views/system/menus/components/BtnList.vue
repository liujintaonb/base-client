<template>
  <div class="btn-list-wrapper">
    <div class="filter-container">
      <div class="filter-item">
        <!-- v-perm="'system_menus:add'" -->
        <el-button @click="addOrEditEvent('add')" :disabled="!currMenu?.guid" >添加</el-button>
      </div>
    </div>
    <k-table :data="{ list: btnList }" mode="render" :is-pager="false" border stripe size="mini">
      <el-table-column label="按钮名称" prop="label" align="center"></el-table-column>
      <el-table-column label="唯一编码" prop="name" align="center"></el-table-column>
      <el-table-column label="排序" prop="index" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="200" v-if="hasEditDelPerm">
        <template #default="{ row }">
          <el-button type="primary" plain size="mini" @click="addOrEditEvent('edit', row)" v-perm="'system_menus:edit'">编辑</el-button>
          <el-button type="danger" plain size="mini" @click="delBtnFn(row)" v-perm="'system_menus:del'">删除</el-button>
        </template>
      </el-table-column>
    </k-table>

    <btn-edit v-model="showEdit" :parent="currMenu" :curr-btn="currBtn" @change="addOrEditSuccess"></btn-edit>
  </div>
</template>

<script>
import { delMenu } from '@/api/menu'
import { defineComponent, ref, watch } from 'vue'
import BtnEdit from './BtnEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import hasPerm from '@/utils/perm'

const hasEditDelPerm = hasPerm('system_menus:edit') || hasPerm('system_menus:del')

export default defineComponent({
  components: { BtnEdit },
  props: {
    currMenu: {
      type: Object,
      default: null
    },
    allButton: {
      type: Array,
      defeault: () => []
    }
  },
  data () {
    return {
      hasEditDelPerm
    }
  },
  emits: ['change'],
  setup (props, { emit }) {
    const btnList = ref([])
    const getOneMenuBtnsFn = () => {
      btnList.value = props.allButton.filter(v => v.parentId === props.currMenu.guid)
    }
    watch(() => props.currMenu, val => {
      if (val?.guid) {
        getOneMenuBtnsFn(val.guid)
      }
    })

    const delBtnFn = async row => {
      try {
        await ElMessageBox.confirm(`此操作将会永久删除【${row.label}】按钮，是否继续`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await delMenu(row.guid)
        if (res.code === 200) {
          ElMessage.success(`按钮【${row.label}】删除成功`)
          emit('change')
        } else {
          ElMessage.error(res.message)
        }
      } catch (error) {}
    }

    const currBtn = ref()
    const showEdit = ref(false)
    // type = 'add' | 'edit'
    const addOrEditEvent = (type, row) => {
      if (type === 'add' && !props.currMenu?.guid) {
        ElMessage.error('请先选择左侧菜单,再添加该菜单下的按钮')
        return
      }
      currBtn.value = row
      showEdit.value = true
    }

    const addOrEditSuccess = () => {
      emit('change')
    }

    return {
      btnList,
      showEdit,
      addOrEditEvent,
      delBtnFn,
      currBtn,
      addOrEditSuccess
    }
  }
})
</script>

<style lang="scss" scoped>
.btn-list-wrapper {
  width: 100%;
  height: calc(100% - 430px);
  margin-top: 10px;
  padding: 10px;
  background: #fff;
}
</style>

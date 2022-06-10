<template>
  <div class="menu-container">
    <div class="menu-tree-wrapper">
      <el-scrollbar>
        <el-tree ref="menuTreeRef" :data="menuTree" node-key="guid" highlight-current default-expand-all @node-click="menuClickEvent"></el-tree>
      </el-scrollbar>
    </div>
    <div class="menu-content">
      <menu-edit :curr-menu="currMenu" :all-menu="allMenu" @change="createOrUpdateSuccess"></menu-edit>
      <btn-list :curr-menu="currMenu" :all-button="allButton" @change="createOrUpdateSuccess"></btn-list>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, provide, ref } from 'vue'
import { arrToTree } from '@/utils'
import { getAllMenu } from '@/api/menu'
import BtnList from './components/BtnList.vue'
import MenuEdit from './components/MenuEdit.vue'

export default defineComponent({
  components: { BtnList, MenuEdit },
  setup () {
    // 菜单树
    const menuTreeRef = ref()
    const menuTree = ref([])
    const loading = ref(false)
    const allMenu = ref([])
    const allButton = ref([])
    const currMenu = ref({ parentId: '', name: '', code: '', type: '', orderNum: '' })
    const getAllMenuList = async () => {
      loading.value = true
      const res = await getAllMenu()
      if (res.code === 200) {
        allMenu.value = []
        allButton.value = []
        res.data.records.forEach(v => {
          if (v.type === 3) allButton.value.push(v)
          else allMenu.value.push(v)
        })
        menuTree.value = arrToTree(allMenu.value, { root: '0', pidKey: 'parentId', idKey: 'guid' })
        if (allMenu.value.length > 0) {
          if (!currMenu.value.guid) currMenu.value = allMenu.value[0]
          else {
            const index = allMenu.value.findIndex(v => v.guid === currMenu.value.guid)
            currMenu.value = allMenu.value[index > -1 ? index : 0]
          }
          nextTick(() => {
            menuTreeRef.value && menuTreeRef.value.setCurrentKey(currMenu.value.guid)
          })
        }
      }
      loading.value = false
    }

    // 初始化
    getAllMenuList()
    provide('menuTree', menuTree)

    // 左侧菜单点击回调
    const menuClickEvent = data => {
      currMenu.value = data
    }

    const createOrUpdateSuccess = () => {
      getAllMenuList()
    }

    return {
      menuTreeRef,
      menuTree,
      menuClickEvent,
      allButton,
      allMenu,
      currMenu,
      createOrUpdateSuccess
    }
  }
})
</script>

<style lang="scss" scoped>
.menu-container {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  padding: 0;
  background: rgba(245, 245, 245, .6);
}
.menu-tree-wrapper {
  width: 200px;
  height: 100%;
  padding-bottom: 20px;
  background: #fff;
  overflow: hidden;
}
.menu-content {
  width: calc(100% - 210px);
  margin-left: 10px;
  height: 100%;
}

</style>

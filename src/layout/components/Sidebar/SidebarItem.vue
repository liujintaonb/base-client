<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren) && !item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <span v-if="onlyOneChild.meta?.icon || item?.meta?.icon">
            <i :class="onlyOneChild.meta.icon||item.meta&&item.meta.icon" v-if="(onlyOneChild.meta.icon||item.meta&&item.meta.icon || []).includes('el-icon')"></i>
            <svg-icon :icon-class="onlyOneChild.meta.icon||item.meta&&item.meta.icon" v-else></svg-icon>
          </span>
          <template #title>{{ onlyOneChild.meta.title }}</template>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
       <template #title>
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
       </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { defineComponent, ref, toRefs } from 'vue'
import AppLink from './Link.vue'
import { isExternal } from '@/utils/validate'
import Item from './Item.js'

export default defineComponent({
  name: 'SidebarItem',
  components: { AppLink, Item },
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // const data = reactive({
    //   onlyOneChild: null
    // })
    const { basePath } = toRefs(props)
    const onlyOneChild = ref(null)
    const hasOneShowingChild = (children = [], parent) => {
      const showingChildren = children.filter(route => {
        if (route.hidden) return false
        onlyOneChild.value = route
        return true
      })
      if (showingChildren.length === 1) return true
      if (showingChildren.length === 0) {
        onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    }
    const resolvePath = (routePath) => {
      if (isExternal(routePath)) return routePath
      if (isExternal(basePath.value)) return basePath.value
      return path.resolve(basePath.value, routePath)
    }

    // const oneMenu = computed(() => {
    //   return onlyOneChild.value.meta.icon || item.meta && item.meta.icon
    // })

    return {
      onlyOneChild,
      hasOneShowingChild,
      resolvePath
      // ...toRefs(data)
    }
  }
})
</script>

<template>
  <section class="k-table-container">
    <el-table
      ref="elTableRef"
      :data="list"
      v-bind="$attrs"
      style="width: 100%;"
      v-loading="loading"
    >
      <slot v-if="mode === 'render'"></slot>
      <template v-if="mode === 'config'">
        <el-table-column
          type="selection"
          align="center"
          width="55"
          v-if="selection"
        ></el-table-column>
        <el-table-column
          type="index"
          :label="indexLabel"
          align="center"
          width="50"
          v-if="index"
          :index="indexMethodFn"
        ></el-table-column>
        <template
          v-for="(column, index) in columns"
          :key="`${column.label}_${index}`"
        >
          <el-table-column
            :align="column.align || 'center'"
            v-if="column.type === 'slot'"
            v-bind="column"
          >
            <template #default="scope">
              <slot
                :name="column.prop"
                v-bind="{ ...scope, $index: indexMethodFn(index) }"
              >{{ scope.row[column.prop] || '' }}</slot>
            </template>
          </el-table-column>
          <TableColumn
            v-bind="column"
            v-else
          ></TableColumn>
        </template>
      </template>
    </el-table>

    <el-pagination
      v-if="isPager"
      :current-page="pager.page"
      :page-size="pager.size"
      :page-sizes="[10, 20, 50, 100]"
      :layout="pagination.layout || 'total, sizes, prev, pager, next, jumper'"
      :total="total"
      background
      v-bind="pagination"
      @size-change="size => refreshData({ size, page: 1 })"
      @current-change="page => refreshData({ page })"
      class="k-pagination"
    >
    </el-pagination>
  </section>
</template>

<script>
import { computed, defineComponent, nextTick, ref } from 'vue'
import TableColumn from './TableColumn'

const methodArr = [
  'clearSelection',
  'toggleRowSelection',
  'toggleAllSelection',
  'toggleRowExpansion',
  'setCurrentRow',
  'clearSort',
  'clearFilter',
  'doLayout',
  'sort'
]

export default defineComponent({
  name: 'KTable',
  components: { TableColumn },
  props: {
    // 模式配置  render element 表格模式，封装了 分页组件
    // config data配置模式
    mode: {
      type: String,
      default: 'config',
      validator: (val) => {
        return ['config', 'render'].includes(val)
      }
    },
    auto: Boolean,
    callback: Function,
    loading: Boolean,
    data: {
      type: Object,
      default: () => {
        return {
          list: [],
          total: 0
        }
      }
    },
    isPager: {
      type: Boolean,
      default: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pagination: {
      type: Object,
      default: () => {
        return {}
      }
    },
    columns: Array,
    selection: Boolean,
    index: Boolean,
    continuousIndex: {
      type: Boolean,
      default: true
    },
    indexMethod: Function,
    indexLabel: {
      type: String,
      default: '序号'
    }
  },
  inheritAttrs: false,
  setup (props) {
    // 表格
    const list = computed(() => props.data.list)
    const total = computed(() => props.data.total)
    const elTableRef = ref()
    // 继承 el-table methods
    const methodObj = {} // 存储方法

    nextTick(() => {
      if (elTableRef.value) {
        methodArr.forEach(m => {
          methodObj[m] = (...args) => {
            elTableRef.value[m].apply(elTableRef, ...args)
          }
        })
      }
    })

    // 分页逻辑
    const pager = ref({ page: props.pageNum, size: props.pageSize })
    // 刷新， 用户分页 / 暴露给父组件
    const refreshData = (newPager = {}) => {
      pager.value = { ...pager.value, ...newPager }
      props.callback && props.callback(pager.value)
    }

    // 初始化
    props.auto && props.callback && props.callback(pager.value)

    const indexMethodFn = (index) => {
      if (props.indexMethod) return props.indexMethod(index)
      if (!props.continuousIndex) return index + 1
      return (pager.value.page - 1) * pager.value.size + index + 1
    }

    return {
      list,
      total,
      pager,
      elTableRef,
      indexMethodFn,
      ...methodObj,
      refreshData
    }
  }
})
</script>

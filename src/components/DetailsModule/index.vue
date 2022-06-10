<template>
  <ul class="info-wrapper" :style="styles">
    <li class="info-item"  v-for="item in propData" :key="item.label">
      <slot>
        <div class="info__label">{{ item.label }}</div>
        <div class="info__content">{{ [].concat(item.prop).map(v => objData[v] || '').join('')}}</div>
      </slot>
    </li>
  </ul>
</template>

<script>
import { defineComponent } from 'vue'

/**
 * 详情组件，用于地图的一些详情展示
 * 属性参数
 * @member props
 * @property {string} [width="400px"] 展示宽度
 * @property {string} [height="400px"] 展示高度
 * @property {object} [objData] 接口返回的数据
 * @property {object[]} [propData=[]] 属性数组 形式如 [{ label: '', prop: '' }]
 *
*/
export default defineComponent({
  props: {
    width: {
      type: String,
      default: '400px'
    },
    height: {
      type: String,
      default: '400px'
    },
    objData: Object,
    propData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    styles () {
      return { width: this.width, height: this.height }
    }
  }
})
</script>

<style lang="scss" scoped>
.info-wrapper {
  display: table;
  overflow: auto;
  .info-item {
    display: table-row;
    width: 100%;
    line-height: 24px;
    font-size: 16px;
  }

  .info__label, .info__content {
    display: table-cell;
    padding: 5px 7px;
  }

  .info__label {
    width: 160px;
    text-align: right;
    color: #333;
    font-weight: 600;
  }

  .info__content {
    width: calc(100% - 160px);
    color: #666;
    font-size: 16px;
  }
}
</style>

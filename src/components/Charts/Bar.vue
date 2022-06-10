<template>
  <div class="chart-wrapper" :class="{ 'shadow': shadow, 'radius': radius}">
    <div class="chart__title" v-if="chartTitle">{{ chartTitle }}</div>
    <div :id="id" :style="styles"></div>
  </div>
</template>

<script>
import { computed, defineComponent, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import { Column } from '@antv/g2plot'

export default defineComponent({
  name: 'ChartBar',
  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    chartTitle: String,
    chartData: Array,
    xField: String,
    yField: String,
    meta: Object,
    shadow: {
      type: Boolean,
      default: true
    },
    radius: {
      type: Boolean,
      default: true
    }
  },
  setup (props) {
    const styles = computed(() => {
      return { height: props.height, width: props.width }
    })
    const id = 'chart_' + +new Date() + Math.random()
    const chart = ref(null)
    // 初始化
    const init = (option) => {
      nextTick(() => {
        if (!chart.value) {
          chart.value = new Column(id, {
            data: option.chartData,
            xField: option.xField,
            yField: option.yField,
            label: {
              // 可手动配置 label 数据标签位置
              position: 'middle', // 'top', 'bottom', 'middle',
              // 配置样式
              style: {
                fill: '#FFFFFF',
                opacity: 0.6
              }
            },
            xAxis: {
              label: {
                autoHide: true,
                autoRotate: false
              }
            },
            meta: option.meta,
            // @TODO 后续会换一种动画方式
            animation: {
              appear: {
                animation: 'fade-in',
                duration: 4000
              }
            }
          })
          chart.value.render()
        } else {
          chart.value.changeData(option)
        }
      })
    }

    onMounted(() => {
      init({ chartData: props.chartData, xField: props.xField, yField: props.yField, meta: props.meta })
    })

    onBeforeUnmount(() => {
      chart.value.destroy()
      chart.value = null
    })

    return {
      id,
      styles
    }
  }
})
</script>

<style lang="scss" scoped>
@import './chart.scss';
</style>

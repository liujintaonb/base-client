<template>
  <div class="chart-wrapper" :class="{ 'shadow': shadow, 'radius': radius}">
    <div class="chart__title" v-if="chartTitle">{{ chartTitle }}</div>
    <div :id="id" :style="styles"></div>
  </div>
</template>

<script>
import { computed, defineComponent, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import { Line } from '@antv/g2plot'

export default defineComponent({
  name: 'ChartLine',
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
    seriesField: String,
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
          chart.value = new Line(id, {
            data: option.chartData,
            xField: option.xField,
            yField: option.yField,
            seriesField: option.seriesField,
            yAxis: {
              label: {
                formatter: (v) => `${(v / 10e8).toFixed(1)} B`
              }
            },
            legend: {
              position: 'top'
            },
            smooth: true,
            // @TODO 后续会换一种动画方式
            animation: {
              appear: {
                animation: 'path-in',
                duration: 2000
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
      init({ chartData: props.chartData, xField: props.xField, yField: props.yField, seriesField: props.seriesField })
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

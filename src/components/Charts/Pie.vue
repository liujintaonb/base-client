<template>
  <div class="chart-wrapper" :class="{ 'shadow': shadow, 'radius': radius}">
    <div class="chart__title" v-if="chartTitle">{{ chartTitle }}</div>
    <div :id="id" :style="styles"></div>
  </div>
</template>

<script>
import { computed, defineComponent, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import { Pie } from '@antv/g2plot'

export default defineComponent({
  name: 'ChartPie',
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
    angleField: String,
    colorField: String,
    contentFormatter: String,
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
          chart.value = new Pie(id, {
            appendPadding: 10,
            data: option.chartData,
            angleField: option.angleField,
            colorField: option.colorField,
            radius: 1,
            innerRadius: 0.6,
            label: {
              type: 'inner',
              offset: '-50%',
              content: '{value}',
              style: {
                textAlign: 'center',
                fontSize: 14
              }
            },
            interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
            statistic: {
              title: false,
              content: {
                style: {
                  whiteSpace: 'pre-wrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                },
                formatter: () => option.contentFormatter
              }
            },
            // @TODO 后续会换一种动画方式
            animation: {
              appear: {
                animation: 'grow-in-xy',
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
      init({ chartData: props.chartData, angleField: props.angleField, colorField: props.colorField, contentFormatter: props.contentFormatter })
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

<template>
  <div class="dashboard-container">
    <div class="grow-card-wrapper">
      <el-row :gutter="12">
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <GrowCard title="总用户数" icon="user" :count="800000" :increase="2.4" comparison-type="环比"></GrowCard>
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <GrowCard title="总产品数" icon="product" :count="2000" :increase="3" comparison-type="同比"></GrowCard>
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <GrowCard title="总营收额" icon="chart-line" :count="3200000" :increase="-2" comparison-type="环比"></GrowCard>
        </el-col>
        <el-col :span="6" :sm="12" :xs="24" :lg="6">
          <GrowCard title="总任务数" icon="time" :count="10000" :increase="-1" comparison-type="同比"></GrowCard>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-row :gutter="12">
        <el-col :span="16" :xs="24" :sm="24" :lg="16">
          <chart-line v-bind="lineDemoData" height="300px"></chart-line>
          <div style="margin-top: 12px;">
            <el-row :gutter="12">
              <el-col :span="12">
                <chart-pie v-bind="pieDemoData" height="280px"></chart-pie>
              </el-col>
              <el-col :span="12" >
                <chart-bar v-bind="barDemoData" height="280px"></chart-bar>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="8" :xs="24" :sm="24" :lg="8">
          <div class="product-demo">
            <h3 class="product_tip">项目进度</h3>
            <product-card v-for="product in productionDemoData" v-bind="product" :key="product.guid"></product-card>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script >
import { defineComponent, ref } from 'vue'
import GrowCard from './components/GrowCard.vue'

import ChartLine from '_c/Charts/Line.vue'
import ChartBar from '_c/Charts/Bar.vue'
import ChartPie from '_c/Charts/Pie.vue'
import lineData from './lineData.json'

import ProductCard from './components/ProductCard.vue'

export default defineComponent({
  components: { GrowCard, ChartLine, ChartBar, ChartPie, ProductCard },
  setup () {
    const lineDemoData = ref({
      chartTitle: '部分国家GDP年度增长折线图',
      chartData: lineData,
      xField: 'year',
      yField: 'gdp',
      seriesField: 'name'
    })

    const barDemoData = ref({
      chartTitle: '柱状图demo',
      chartData: [
        {
          type: '家具家电',
          sales: 38
        },
        {
          type: '粮油副食',
          sales: 52
        },
        {
          type: '生鲜水果',
          sales: 61
        },
        {
          type: '美容洗护',
          sales: 145
        },
        {
          type: '母婴用品',
          sales: 48
        },
        {
          type: '进口食品',
          sales: 38
        },
        {
          type: '食品饮料',
          sales: 38
        },
        {
          type: '家庭清洁',
          sales: 38
        }
      ],
      xField: 'type',
      yField: 'sales',
      meta: {
        type: {
          alias: '类别'
        },
        sales: {
          alias: '销售额'
        }
      }
    })

    const pieDemoData = ref({
      chartTitle: '饼图 demo',
      chartData: [
        { type: '分类一', value: 27 },
        { type: '分类二', value: 25 },
        { type: '分类三', value: 18 },
        { type: '分类四', value: 15 },
        { type: '分类五', value: 10 },
        { type: '其他', value: 5 }
      ],
      angleField: 'value',
      colorField: 'type',
      contentFormatter: 'AntV\nG2Plot'
    })

    const productionDemoData = ref([
      {
        guid: 1,
        title: '开发任务一',
        desc: '开发任务一简介',
        percent: 25,
        updateDate: '2020.06.12',
        userAvatar: [
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
        ]
      },
      {
        guid: 2,
        title: '开发任务二',
        desc: '开发任务二简介',
        percent: 65,
        updateDate: '2020.06.23',
        userAvatar: [
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
        ]
      },
      {
        guid: 3,
        title: '开发任务三',
        desc: '开发任务三简介',
        percent: 85,
        updateDate: '2020.07.12',
        userAvatar: [
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
          'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'
        ]
      }
    ])
    return {
      lineDemoData,
      barDemoData,
      pieDemoData,
      productionDemoData
    }
  }
})
</script>

<style lang="scss" scoped>
.dashboard-container {
  background: rgba(245, 245, 245, 0);
}
.grow-card-wrapper {
  .grow-card {
    margin-bottom: 12px;
  }
}

.product-demo {
  background: #fff;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  box-shadow: 6px 6px 54px 0 rgba(0,0,0,.05);
  padding: 5px;

  .product_tip {
    display: flex;
    height: 32px;
    margin-bottom: 10px;
    justify-content: space-between;
    align-items: center;
    padding-left: 7px;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
  }
}
@media only screen and (min-width: 768px) {
  .product-demo {
    margin-top: 12px;
  }
}
@media only screen and (min-width: 1200px) {
  .product-demo {
    margin-top: 0;
  }
}
</style>

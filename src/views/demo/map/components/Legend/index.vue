<template>
  <k-map-placement class="app-map-legend-container" placement="left-bottom" :margin="[0, 0, 40, 20]">
    <div class="legend__tip" v-if="!showLegend"  >
      <el-popover
        placement="top-start"
        trigger="hover"
        :disabled="!showLegend && dataList.length > 0"
        content="请先勾选相应的图层">
        <template #reference>
          <el-button @click="handleClick(true)" style="color: #333 !important;" type="text" >图例</el-button>
        </template>
      </el-popover>
    </div>
    <el-collapse-transition>
      <div v-if="showLegend">
        <div class="legend__tip" >
          <span>图例</span>
          <el-button type="text" @click="handleClick(false)">隐藏</el-button>
        </div>
        <div class="app-map-legend-wrapper">
          <ul class="app-map-legend-list">
            <li class="legend-item" v-for="(item, index) in dataList" :key="index">
              <i :class="item.icon"></i>
              <div class="legend-label">{{ item.name }}</div>
            </li>
          </ul>
        </div>
      </div>
    </el-collapse-transition>
  </k-map-placement>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'

const legendList = [
  {
    type: 6,
    name: '居民地',
    icon: 'el-icon-my-ju-min-di'
  },
  {
    type: 7,
    name: '水系',
    icon: 'el-icon-my-shui-xi'
  },
  {
    type: 22,
    name: '铁路',
    icon: 'el-icon-my-xing-zheng-shi'
  },
  {
    type: 23,
    name: '公路',
    icon: 'el-icon-my-xing-zheng-shi'
  },
  {
    type: 9,
    name: '森林资源分布',
    icon: 'el-icon-my-sen-lin-fen-bu'
  },
  {
    type: 81,
    name: '草原资源分布',
    icon: 'el-icon-my-cao-yuan-fen-bu'
  },
  {
    name: '森林火险区划等级-一级',
    icon: 'el-icon-my-cc0000',
    type: 11
  }, {
    name: '森林火险区划等级-二级',
    icon: 'el-icon-my-ea9999',
    type: 11
  },
  {
    name: '森林火险区划等级-三级',
    icon: 'el-icon-my-f4cccc',
    type: 11
  },
  {
    name: '草原火险区划等级-低',
    icon: 'el-icon-my-f9cb9c',
    type: 12
  }, {
    name: '草原火险区划等级-中',
    icon: 'el-icon-my-f6b26b',
    type: 12
  }, {
    name: '草原火险区划等级-高',
    icon: 'el-icon-my-e69138',
    type: 12
  }, {
    name: '草原火险区划等级-极高',
    icon: 'el-icon-my-ghx',
    type: 12
  }, {
    name: '森林火灾高风险区',
    icon: 'el-icon-my-b3003e',
    type: 25
  }, {
    name: '森林火灾高危区',
    icon: 'el-icon-my-ghx',
    type: 25
  },
  {
    type: 16,
    name: '防火机构',
    icon: 'el-icon-my-fang-huo-ji-gou'
  },
  {
    type: 14,
    name: '地方专业防扑火队伍',
    icon: 'el-icon-my-xiao-fang-yuan2'
  },
  {
    type: 18,
    name: '地方专业防扑火队伍',
    icon: 'el-icon-my-ji-gou-ze-ren-qu'
  },
  {
    type: 26,
    name: '物资储备库',
    icon: 'el-icon-my-wu-zi-chu-bei-ku'
  },
  {
    type: 27,
    name: '专业队营房',
    icon: 'el-icon-my-zhuan-ye-dui-ying-fang'
  },
  {
    type: 28,
    name: '地面取水蓄水池',
    icon: 'el-icon-my-di-mian-qu-shui-xu-shui-chi'
  },
  {
    type: 29,
    name: '瞭望塔',
    icon: 'el-icon-my-liao-wang-tai'
  },
  {
    type: 30,
    name: '常年检查站',
    icon: 'el-icon-my-chang-nian-jian-cha-zhan'
  },
  {
    type: 19,
    name: '临时检查站',
    icon: 'el-icon-my-lin-shi-jian-cha-zhan'
  },
  {
    type: 32,
    name: '防火道路',
    icon: 'el-icon-my-fang-huo-dao-lu'
  },
  {
    type: 33,
    name: '防火阻隔带',
    icon: 'el-icon-my-fang-huo-ge-li-dai'
  },
  {
    type: 34,
    name: '航空护林站',
    icon: 'el-icon-my-hang-kong-hu-lin-zhan'
  },
  {
    type: 35,
    name: '永久机降点',
    icon: 'el-icon-my-yong-jiu-ji-jiang-ji-dian'
  },
  {
    type: 36,
    name: '临时机降点',
    icon: 'el-icon-my-lin-shi-ji-jiang-ji-dian'
  },
  {
    type: 37,
    name: '视频监控点',
    icon: 'el-icon-my-shi-pin-jian-kong-dian'
  }
]

export default defineComponent({
  props: {
    isFilter: {
      type: Boolean,
      default: false
    },
    types: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const showLegend = ref(false)

    const list = ref(legendList)

    const dataList = computed(() => {
      if (!props.isFilter) return list.value
      return list.value.filter(v => props.types.includes(v.type))
    })

    const handleClick = bool => {
      showLegend.value = bool && dataList.value.length > 0
    }
    return {
      showLegend,
      dataList,
      handleClick
    }
  }
})
</script>

<style lang="scss" scoped>
.app-map-legend-container {
  .legend__tip {
    padding: 4px 7px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.app-map-legend-wrapper {
  width: 400px;
  padding: 5px 16px 16px 16px;
}
.app-map-legend-list {
  display: flex;
  flex-wrap: wrap;
}
.legend-item {
  width: 50%;
  display: flex;
  align-items: center;
  height: 20px;
  line-height: 20px;
  padding: 12px 0;
  color:#333;
}
.legend-label {
  padding-left: 8px;
  font-size: 12px;
}
</style>

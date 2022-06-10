<template>
  <div>
    <div class="geojson-demo">
      <el-alert type="warning" title="GeoJSON 数据显示" class="map-demo-alert"></el-alert>
      <diff-color :geo="chinaData"></diff-color>
    </div>

    <div class="geojson-demo">
      <el-alert type="warning" title="GeoJSON 航行数据显示" class="map-demo-alert"></el-alert>
      <voyage :china="chinaData" :data="flightData"></voyage>
    </div>

  </div>
</template>

<script>
import { defineComponent } from 'vue'
import china from '_c/Charts/data/china.json'
import DiffColor from './components/DiffColor.vue'
import Voyage from './components/Voyage.vue'

export default defineComponent({
  components: { DiffColor, Voyage },
  data () {
    return {
      chinaData: china,
      flightData: [
        { from: '北京', to: '广东' },
        { from: '北京', to: '新疆' },
        { from: '北京', to: '西藏' }
      ]
    }
  }
})
</script>

<style lang="scss" scoped>
.map-demo-alert {
  margin-bottom: 10px;
}
.geojson-demo {
  margin: 0 auto;
  width: 50%;
  min-width: 500px;
  height: 420px;
  position: relative;

  ::v-deep .k-map-box {
    height: 350px;
  }
}
</style>

<template>
  <div class="map-demo-conatiner">
    <app-map @ready="appMapReady">
      <Legend :types="legendFilerData" isFilter></Legend>
      <Layers  @check-change="layerCheckChange" :map="map" ></Layers>
    </app-map>
  </div>
</template>

<script >
import { defineComponent, ref } from 'vue'
import AppMap from '_c/AppMap/index.vue'
import Legend from './components/Legend'
import Layers from './components/Layers'

export default defineComponent({
  components: { AppMap, Legend, Layers },
  setup () {
    const map = ref(null)

    const appMapReady = (val) => {
      map.value = val
    }

    /**  图层改变事件 */
    const legendFilerData = ref([])
    const layerCheckChange = (node, checked, checkedKeys) => {
      legendFilerData.value = checkedKeys
    }

    return {
      map,
      appMapReady,
      legendFilerData,
      layerCheckChange
    }
  }
})
</script>

<style lang="scss" scoped>
.map-demo-conatiner {
  padding: 10px;
}
</style>

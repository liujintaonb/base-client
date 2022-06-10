<template>
  <k-map :zoom="4" :center="[106.011022, 37.237037]" invert>
    <k-map-geo ref="geoRef"
                :json="china"
                @ready="handleReady"
                :stroke="{width:1,color:'#000'}"></k-map-geo>
    <k-map-scatter v-for="item in scatters"
                    :key="item.join(',')"
                    :coordinate="item"
                    :radius="5"
                    fill="red"></k-map-scatter>
    <k-map-flight v-for="(item,index) in flights"
                   :key="index"
                   :from="item.from"
                   :to="item.to"
                   :radius="10"
                   :space="0"
                   :smooth="0.03"
                   arrow></k-map-flight>
  </k-map>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    china: Object,
    data: {
      type: Array,
      default: () => []
    }
  },
  setup (props) {
    const geoRef = ref()
    const coordinates = ref()
    const handleReady = () => {
      coordinates.value = geoRef.value.getCoordinates()
    }

    const scatters = computed(() => {
      if (!coordinates.value) return []
      const points = {}
      props.data.forEach(v => {
        points[v.from] = coordinates.value[v.from]
        points[v.to] = coordinates.value[v.to]
      })
      return Object.keys(points).map(key => points[key])
    })

    const flights = computed(() => {
      if (!coordinates.value) return []
      return props.data.map(v => {
        return {
          from: coordinates.value[v.from],
          to: coordinates.value[v.to]
        }
      })
    })

    return {
      geoRef,
      handleReady,
      flights,
      scatters
    }
  }
})
</script>

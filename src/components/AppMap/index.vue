<template>
  <k-map v-bind="centerAndZoom" @ready="mapReady" :fullScreen="fullScreen">
    <slot></slot>
    <k-map-scale></k-map-scale>
    <k-map-layers :defaultActive="defaultActive"></k-map-layers>
    <k-map-zoom :slider="false"></k-map-zoom>
    <measure></measure>
    <k-map-pointer></k-map-pointer>
  </k-map>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import Measure from './components/Measure'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'

import config from '@/config'

export default defineComponent({
  components: {
    Measure
  },
  props: {
    center: Array,
    zoom: {
      type: Number,
      default: 11
    },
    fullScreen: {
      type: Boolean,
      default: true
    },
    defaultActive: {
      type: String,
      default: '卫星'
    }
  },
  setup (props, { emit }) {
    const map = ref(null)

    const centerAndZoom = computed(() => {
      return props.center ? { center: props.center, zoom: props.zoom } : {}
    })

    const createBoundaryLineLayer = (layers) => {
      return new TileLayer({
        source: new TileWMS({
          // 未发布
          url: `${config.geoserverUrl}/geoserver/cite/wms`,
          params: {
            layers,
            version: '1.1.0'
          },
          serverType: 'geoserver'
        }),
        zIndex: 1
      })
    }

    const removeLayers = (layers) => {
      layers.forEach(layer => layer && map.value.removeLayer(layer))
    }

    const country = ref(null)
    const area = ref(null)
    const city = ref(null)
    const bindMapBoundaryLineEvent = map => {
      if (!country.value) country.value = createBoundaryLineLayer('cite:guojie')
      map.addLayer(country.value)
      map.getView().on('change:resolution', () => {
        const zoom = map.getView().getZoom()
        if (zoom >= 9) {
          if (!area.value) {
            area.value = createBoundaryLineLayer('cite:xz_county')
          }
          removeLayers([area.value])
          map.addLayer(area.value)
        } else if (zoom >= 7) {
          if (!city.value) {
            city.value = createBoundaryLineLayer('cite:xz_city')
          }
          removeLayers([area.value, city.value])
          map.addLayer(city.value)
        } else {
          removeLayers([area.value, city.value])
        }
      })
    }

    const mapReady = (val) => {
      map.value = val
      bindMapBoundaryLineEvent(map.value)
      emit('ready', val)
    }

    return {
      map,
      mapReady,
      centerAndZoom
    }
  }
})
</script>

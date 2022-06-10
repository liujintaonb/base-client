<template>
  <ul class="k-map-layer-wrapper" @mouseenter="mouseHandler(true)" @mouseleave="mouseHandler(false)">
    <template v-for="mapImg in mapImgs" :key="mapImg.label" >
      <li class="k-map-layer-item" @click="checkedEvent(mapImg)" :class="{ 'k-map-layer-active': active === mapImg.label }" v-show="showAll || active === mapImg.label">
        <img class="k-map-layer-img" :src="mapImg.img" >
        <div class="k-map-layer-label">{{ mapImg.label }}</div>
      </li>
    </template>
  </ul>
</template>

<script>
import { computed, defineComponent, inject, nextTick, ref, watch } from 'vue'
import { createLayer } from '../../../utils/layers.js'
import standardMapImg from '../../../assets/imgs/layers/standard-map.png'
import satelliteMapImg from '../../../assets/imgs/layers/satellite-map.png'
import terrainMapImg from '../../../assets/imgs/layers/terrain-map.png'
import { useGlobalConfig } from '../../../utils/index.js'

export default defineComponent({
  name: 'KMapLayers',
  props: {
    defaultActive: {
      type: String,
      default: '地图',
      validator: val => {
        return ['地图', '卫星', '地形'].includes(val)
      }
    }
  },
  setup (props, { emit }) {
    const $KMAP = useGlobalConfig()
    const mapImgs = ref(
      [
        { label: '卫星', img: satelliteMapImg, layer: createLayer({ type: 'TDT', layers: ['img_w', 'cia_w'], ...$KMAP.tk ? { tk: $KMAP.tk } : null }) },
        { label: '地形', img: terrainMapImg, layer: createLayer({ type: 'TDT', layers: ['ter_w', 'cta_w'], ...$KMAP.tk ? { tk: $KMAP.tk } : null }) },
        { label: '地图', img: standardMapImg, layer: createLayer({ type: 'TDT', layers: ['vec_w', 'cva_w'], ...$KMAP.tk ? { tk: $KMAP.tk } : null }) }
      ]
    )
    const showAll = ref(false)
    const active = ref('地图')

    // 获取地图实例
    const KMap = inject('KMap', ref(null))
    const map = computed(() => {
      return KMap.map
    })

    const checkedEvent = item => {
      active.value = item.label
      showAll.value = false
      const layer = KMap.getLayer()
      if (layer) {
        map.value.removeLayer(layer)
      }
      item.layer.__K_LAYER__ = true
      item.layer.setZIndex(0)
      map.value.addLayer(item.layer)

      emit('change', item)
      KMap.$emit('k-map-layers-change', item.adapter)
    }

    watch(() => props.defaultActive, val => {
      if (!map.value) {
        active.value = val
        const i = mapImgs.value.findIndex(v => val === v.label)
        nextTick(() => {
          checkedEvent(mapImgs.value[i])
        })
      }
    }, {
      immediate: true
    })

    const mouseHandler = (val) => {
      showAll.value = val
    }

    return {
      mapImgs,
      showAll,
      active,
      checkedEvent,
      mouseHandler
    }
  }
})
</script>

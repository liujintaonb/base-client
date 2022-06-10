<template>
  <k-map :zoom="4" :center="[106.011022, 37.237037]">
    <k-map-geo
      :json="geo"
      :hover-style="hoverStyle"
      @mouseenter="handleMouseEnterEvent"
      @ready="geoReadyHandle"
      @mouseleave="handleMouseLeave"></k-map-geo>
      <k-map-popup ref="regionPopupRef" :offset="[0,-50]" width="200px" :closable="false" :position="region.position">
        <div>省份： {{region.name}}</div>
        <div>坐标： {{region.position}}</div>
      </k-map-popup>
  </k-map>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import province from '_c/Charts/data/province-data.json'
import parseStyle from '@/plugins/map/utils/style.js'
import event from '@/plugins/map/utils/event.js'

const setStyle = function (bg = 'rgba(0,0,0,0)', text) {
  return parseStyle({
    fill: bg,
    stroke: { width: 3, color: 'white' },
    text: { text: text, font: '20px', fill: 'green' }
  })
}

export default defineComponent({
  props: {
    geo: Object
  },
  setup (props) {
    const data = ref(province.datas)

    const total = computed(() => {
      return data.value.reduce((totalTmp, item) => {
        if (item.value > totalTmp) {
          totalTmp = item.value
        }
        return totalTmp
      }, 0)
    })

    const styleCache = {}
    const geoReadyHandle = (geo) => {
      const features = geo.getFeatures()
      features.forEach((feature) => {
        const featureData = feature.getProperties()
        const name = featureData.name
        const target = data.value.find((item) => {
          return item.cityname.indexOf(name) >= 0
        })
        const count = target && target.value || 0
        const value = Math.ceil(225 * count / total.value)
        styleCache[name] = `rgba(225, ${225 - value}, 0, 0.9)`
        const styleObj = setStyle(styleCache[name], name)
        feature.setStyle(styleObj)
      })
    }
    const hoverStyle = ref({
      fill: 'rgba(255, 0, 0, 0.2)',
      stroke: {
        color: '#000',
        width: 3
      },
      text: {
        fill: 'red'
      }
    })
    const region = ref({})
    const regionPopupRef = ref()
    watch(() => region.value, (val) => {
      if (val.position) regionPopupRef.value.show(val.position)
      else regionPopupRef.value.hide()
    }, {
      deep: true
    })

    const handleMouseEnterEvent = (e, feature) => {
      const position = feature.get('cp')
      const name = feature.get('name')
      region.value = { position, name }
      event.$emit('mouseenter', e, feature)
    }
    const handleMouseLeave = (e, feature) => {
      region.value = {}
      const name = feature.get('name')
      const styleObj = setStyle(styleCache[name], name)
      event.$emit('mouseleave', e, feature, styleObj)
    }

    return {
      data,
      geoReadyHandle,
      hoverStyle,
      region,
      handleMouseEnterEvent,
      handleMouseLeave,
      regionPopupRef
    }
  }
})
</script>

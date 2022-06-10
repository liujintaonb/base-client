
<template>
  <div class="cesium-wrapper" id="cesium-wrapper"> </div>
</template>

<script>
/* eslint-disable new-cap */
import { defineComponent, nextTick, onMounted, onBeforeUnmount } from 'vue'
import '@/plugins/airlookmap/index.scss'

export default defineComponent({
  setup () {
    let timer
    onMounted(() => {
      nextTick(() => {
        window.viewer = new window.AirlookMap.Map('cesium-wrapper', {
          baseLayerPicker: false,
          navigator: true, // 右侧控件加载
          nightExchange: true, // 增加夜空效果
          disableLogo: true
        })

        window.viewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(103.37, 38.05, Math.pow(10, 7.3)),
          orientation: {
            heading: window.Cesium.Math.toRadians(0),
            pitch: window.Cesium.Math.toRadians(-90),
            roll: window.Cesium.Math.toRadians(0)
          }
        })

        const IMGData = [
          'Z_RADA_C_BABJ_20190506033000_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506033600_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506034200_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506034800_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506035400_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506040000_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506040600_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506041200_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506041800_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506042400_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506043000_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506043600_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506044200_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506044800_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506045400_P_DOR_RDCP_R_ACHN_OTG_COLOR',
          'Z_RADA_C_BABJ_20190506050000_P_DOR_RDCP_R_ACHN_OTG_COLOR'
        ]

        const imageryLayers = window.viewer.imageryLayers

        const p0 = new window.Cesium.SingleTileImageryProvider({
          url: '//bd.bcebos.com/v1/www-static/doc/SampleData/RADA/' + IMGData[0] + '.png',
          rectangle: new window.Cesium.Rectangle.fromDegrees(73, 12.2, 135, 54.2)
        })
        const p1 = new window.Cesium.SingleTileImageryProvider({
          url: '//bd.bcebos.com/v1/www-static/doc/SampleData/RADA/' + IMGData[1] + '.png',
          rectangle: new window.Cesium.Rectangle.fromDegrees(73, 12.2, 135, 54.2)
        })

        let layer0 = imageryLayers.addImageryProvider(p0)
        let layer1 = imageryLayers.addImageryProvider(p1)
        layer1.alpha = 0
        const length = IMGData.length
        let currentIndex = 0

        setTimeout(() => {
          timer = setInterval(() => {
            const currentLayer = new window.Cesium.SingleTileImageryProvider({
              url: '//bd.bcebos.com/v1/www-static/doc/SampleData/RADA/' + IMGData[currentIndex] + '.png',
              rectangle: new window.Cesium.Rectangle.fromDegrees(73, 12.2, 135, 54.2)
            })
            const layerNew = imageryLayers.addImageryProvider(currentLayer)
            imageryLayers.remove(layer0)
            layer0 = layer1
            layer0.alpha = 1
            layer1 = layerNew
            layer1.alpha = 0
            currentIndex++
            if (currentIndex === length) {
              currentIndex = 0
            }
          }, 500)
        }, 2000)
      })
    })

    onBeforeUnmount(() => {
      clearInterval(timer)
      timer = null
    })
  }
})
</script>

<template>
  <div class="cesium-wrapper" id="cesium-wrapper"></div>
</template>

<script>
import { defineComponent, nextTick, onMounted } from 'vue'

export default defineComponent({
  setup () {
    onMounted(() => {
      nextTick(() => {
        const terrainProvider = new window.Cesium.CesiumTerrainProvider({
          url: 'https://map-terrain.cdn.bcebos.com/'
        })

        const viewer = new window.AirlookMap.Map('cesium-wrapper', {
          fullscreenButton: true,
          highlight: true,
          terrainProvider: terrainProvider,
          disableLogo: true
        })
        window.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjY2JmMDBkNy1lMmU2LTRmYTEtYjEwYS03NDliMTdlYzkzZTIiLCJpZCI6NDUwMTYsImlhdCI6MTYxNDY2NzE2MH0.KdNWA62Ll4IKWcZt5C0eQUg_7Z35Dc9SnilnIoGimKI'
        const bingLayer = window.Cesium.createWorldImagery({
          style: window.Cesium.IonWorldImageryStyle.AERIAL
        })
        viewer.imageryLayers.addImageryProvider(bingLayer)

        viewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(
            116.8912841796875,
            40.2913720703125,
            2000
          ),
          orientation: {
            heading: window.Cesium.Math.toRadians(20),
            pitch: window.Cesium.Math.toRadians(-40),
            roll: window.Cesium.Math.toRadians(0)
          }
        })
      })
    })
  }
})
</script>

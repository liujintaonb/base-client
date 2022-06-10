<template>
  <div class="cesium-wrapper" id="cesium-wrapper">
    <script src="//doc.airlook.com/lib/PostProcessStageCircleScan.min.js"></script>
    <script src="//doc.airlook.com/lib/PostProcessStageSectorScan.min.js"></script>
  </div>
</template>

<script>
/* eslint-disable new-cap */
import { defineComponent, nextTick, onMounted } from 'vue'

export default defineComponent({
  setup () {
    onMounted(() => {
      nextTick(() => {
        const terrainProvider = new window.Cesium.CesiumTerrainProvider({
          url: 'https://map-terrain.cdn.bcebos.com/'
        })
        const viewer = new window.AirlookMap.Map('cesium-wrapper', {
          baseLayerPicker: false,
          navigator: true, // 右侧控件加载
          terrainProvider: terrainProvider,
          disableLogo: true
        })
        viewer.scene.globe.enableLighting = false
        viewer.scene.globe.depthTestAgainstTerrain = true
        viewer.scene.globe.showGroundAtmosphere = false
        viewer.scene.requestRenderMode = false
        viewer.scene.screenSpaceCameraController.enableZoom = false
        viewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(
            109.58025404286062,
            19.51634346723056,
            900
          ),
          orientation: {
            heading: window.Cesium.Math.toRadians(0),
            pitch: window.Cesium.Math.toRadians(-60),
            roll: window.Cesium.Math.toRadians(0)
          }
        })

        let circlestage = null
        const postProcessStageCircleScan = new window.Cesium.PostProcessStageCircleScan(
          viewer
        )

        circlestage = postProcessStageCircleScan.create({
          center: {
            longitude: 109.58256672801868,
            latitude: 19.518477883557942,
            height: 36.162384
          },
          radius: 250,
          color: new window.Cesium.Color.fromCssColorString('#890e0e'),
          duration: 2000
        })
        postProcessStageCircleScan.add(circlestage)

        let sectorStage = null
        const postProcessStageSectorScan = new window.Cesium.PostProcessStageSectorScan(
          viewer
        )

        sectorStage = postProcessStageSectorScan.create({
          center: {
            longitude: 109.57792602214552,
            latitude: 19.522452801293028,
            height: 36.162384
          },
          radius: 250,
          color: new window.Cesium.Color.fromCssColorString('#038b4d'),
          duration: 2000
        })
        postProcessStageSectorScan.add(sectorStage)
      })
    })
  }
})

</script>

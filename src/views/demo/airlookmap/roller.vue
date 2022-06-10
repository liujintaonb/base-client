<template>
  <div class="cesium-wrapper" id="cesium-wrapper">
    <div id="slider"></div>
  </div>
</template>

<script>
import { defineComponent, nextTick, onMounted } from 'vue'
// import Airlookmap from '@/plugins/airlookmap'
import '@/plugins/airlookmap/index.scss'

export default defineComponent({
  setup () {
    onMounted(() => {
      nextTick(() => {
        const viewer = new window.AirlookMap.Map('cesium-wrapper', {
          baseLayerPicker: false,
          infoBox: false,
          disableLogo: true
        })

        const layers = viewer.imageryLayers
        const earthAtNight = layers.addImageryProvider(
          new window.Cesium.ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
          })
        )

        earthAtNight.splitDirection = window.Cesium.ImagerySplitDirection.RIGHT // Only show to the left of the slider.
        // Sync the position of the slider with the split position
        const slider = document.getElementById('slider')
        viewer.scene.imagerySplitPosition =
    (slider.offsetLeft + slider.clientWidth) / slider.parentElement.offsetWidth

        const handler = new window.Cesium.ScreenSpaceEventHandler(slider)

        let moveActive = false
        function move (movement) {
          if (!moveActive) {
            return
          }
          const relativeOffsetX = movement.endPosition.x
          const splitPosition =
      (slider.offsetLeft + relativeOffsetX) /
      slider.parentElement.offsetWidth
          slider.style.left = 100.0 * splitPosition + '%'

          viewer.scene.imagerySplitPosition = splitPosition
          viewer.scene.requestRender()
        }

        handler.setInputAction(function () {
          moveActive = true
        }, window.Cesium.ScreenSpaceEventType.LEFT_DOWN)
        handler.setInputAction(function () {
          moveActive = true
        }, window.Cesium.ScreenSpaceEventType.PINCH_START)

        handler.setInputAction(move, window.Cesium.ScreenSpaceEventType.MOUSE_MOVE)
        handler.setInputAction(move, window.Cesium.ScreenSpaceEventType.PINCH_MOVE)

        handler.setInputAction(function () {
          moveActive = false
        }, window.Cesium.ScreenSpaceEventType.LEFT_UP)
        handler.setInputAction(function () {
          moveActive = false
        }, window.Cesium.ScreenSpaceEventType.PINCH_END)

        // optimize resize
        ;(function () {
          const throttle = function (type, name) {
            let running = false
            const func = function () {
              if (running) { return }
              running = true
              window.requestAnimationFrame(function () {
                window.dispatchEvent(new CustomEvent(name))
                running = false
              })
            }
            window.addEventListener(type, func)
          }
          throttle('resize', 'optimizedResize')
        })()

        window.addEventListener('optimizedResize', function () {
          viewer.scene.imagerySplitPosition =
    (slider.offsetLeft + slider.clientWidth) / slider.parentElement.offsetWidth
        })
      })
    })
  }
})
</script>

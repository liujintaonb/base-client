<template>
  <div class="cesium-wrapper" id="cesium-wrapper"></div>
</template>

<script>
import { defineComponent, nextTick, onBeforeUnmount, onMounted } from 'vue'

export default defineComponent({
  setup () {
    let timer = null
    onMounted(() => {
      nextTick(() => {
        const viewer = new window.AirlookMap.Map('cesium-wrapper', {
          baseLayerPicker: false,
          navigator: true, // 右侧控件加载
          disableLogo: true
        })

        viewer.camera.flyTo({
          destination: window.Cesium.Cartesian3.fromDegrees(103, 35, 15000000)
        })

        const IMGData = ['1', '2', '3']
        const box = [-180, -90, 180, 90]
        const url = '//bd.bcebos.com/v1/www-static/doc/SampleData/Global/'

        setTimeout(() => {
          playCloud(IMGData, url, box)
        }, 1500)

        function playCloud (IMGData, baseUrl, rectangle) {
          const length = IMGData.length
          let currentIndex = 0
          let currentLayer
          setInterval(() => {
            const layers = viewer.imageryLayers._layers
            const len = layers.length
            currentLayer = new window.Cesium.SingleTileImageryProvider({
              url: baseUrl + IMGData[currentIndex] + '.png',
              // eslint-disable-next-line new-cap
              rectangle: new window.Cesium.Rectangle.fromDegrees(
                rectangle[0],
                rectangle[1],
                rectangle[2],
                rectangle[3]
              )
            })
            viewer.imageryLayers.addImageryProvider(currentLayer)
            currentIndex++
            if (currentIndex === length) {
              currentIndex = 0
            }
            // 优化性能 laryer.alpha==0 时引擎不进行渲染
            if (len > 4) {
              let count = 10
              timer = setInterval(function () {
                if (--count < 1) clearInterval(timer)
                layers[len - 3].alpha = count / 10
              }, 50)
            }
          }, 1500)
        }
      })
    })

    onBeforeUnmount(() => {
      clearInterval(timer)
      timer = null
    })
  }
})
</script>

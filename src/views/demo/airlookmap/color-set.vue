<template>
  <div class="cesium-wrapper">
    <div  id="cesium-wrapper"></div>
    <div id="loadingOverlay">
      <h1>Loading...</h1>
    </div>
    <div id="control">
      <div>
        <div class="tool-bar-li">
          <label>亮度</label>
          <input type="range" min="0" max="3" step="0.02" data-bind="value: brightness, valueUpdate: 'input'" />
          <input type="text"  disabled data-bind="value: brightness" />
        </div>
        <div class="tool-bar-li">
          <label>对比度</label>
          <input type="range" min="0" max="3" step="0.02" data-bind="value: contrast, valueUpdate: 'input'" />
          <input type="text"  disabled data-bind="value: contrast" />
        </div>
        <div class="tool-bar-li">
          <label>色调</label>
          <input type="range" min="0" max="3" step="0.02" data-bind="value: hue, valueUpdate: 'input'" />
          <input type="text"  disabled data-bind="value: hue" />
        </div>
        <div class="tool-bar-li">
          <label>饱和度</label>
          <input type="range" min="0" max="3" step="0.02" data-bind="value: saturation, valueUpdate: 'input'" />
          <input type="text"  disabled data-bind="value: saturation" />
        </div>
        <div class="tool-bar-li">
          <label>反差系数</label>
          <input type="range" min="0" max="3" step="0.02" data-bind="value: gamma, valueUpdate: 'input'" />
          <input type="text"  disabled data-bind="value: gamma" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, onMounted } from 'vue'
import '@/plugins/airlookmap/index.scss'

export default defineComponent({
  setup () {
    onMounted(() => {
      nextTick(() => {
        const startup = () => {
          // Sandcastle_Begin
          const viewer = new window.AirlookMap.Map('cesium-wrapper', {
            disableLogo: true
          })
          const imageryLayers = viewer.imageryLayers

          // The viewModel tracks the state of our mini application.
          const viewModel = {
            brightness: 0,
            contrast: 0,
            hue: 0,
            saturation: 0,
            gamma: 0
          }
          // Convert the viewModel members into knockout observables.
          window.Cesium.knockout.track(viewModel)

          // Bind the viewModel to the DOM elements of the UI that call for it.
          const control = document.getElementById('control')
          window.Cesium.knockout.applyBindings(viewModel, control)

          // Make the active imagery layer a subscriber of the viewModel.
          function subscribeLayerParameter (name) {
            window.Cesium.knockout
              .getObservable(viewModel, name)
              .subscribe(function (newValue) {
                if (imageryLayers.length > 0) {
                  const layer = imageryLayers.get(0)
                  layer[name] = newValue
                  viewer.scene.requestRender()
                }
              })
          }
          subscribeLayerParameter('brightness')
          subscribeLayerParameter('contrast')
          subscribeLayerParameter('hue')
          subscribeLayerParameter('saturation')
          subscribeLayerParameter('gamma')

          // Make the viewModel react to base layer changes.
          function updateViewModel () {
            if (imageryLayers.length > 0) {
              const layer = imageryLayers.get(0)
              viewModel.brightness = layer.brightness
              viewModel.contrast = layer.contrast
              viewModel.hue = layer.hue
              viewModel.saturation = layer.saturation
              viewModel.gamma = layer.gamma
            }
          }
          imageryLayers.layerAdded.addEventListener(updateViewModel)
          imageryLayers.layerRemoved.addEventListener(updateViewModel)
          imageryLayers.layerMoved.addEventListener(updateViewModel)
          updateViewModel()
        }
        startup()
      })
    })
  }
})
</script>

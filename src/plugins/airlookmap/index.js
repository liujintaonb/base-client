import { defineComponent, onMounted } from 'vue'
import './index.scss'

export default defineComponent({
  name: 'cesium',
  render () {
    const defaultSlot = this.$slots.default ? this.$slots.default() : ''
    return (
      <div class="cesium-wrapper" id={this.id}>
        { defaultSlot }
      </div>
    )
  },
  setup (props) {
    const id = 'airlookmap_cesium_' + +new Date() + Math.random()
    const init = () => {
      window.viewer = new window.AirlookMap.Map(id, {
        baseLayerPicker: false,
        navigator: true, // 右侧控件加载
        nightExchange: true, // 增加夜空效果
        disableLogo: true
      })

      window.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjY2JmMDBkNy1lMmU2LTRmYTEtYjEwYS03NDliMTdlYzkzZTIiLCJpZCI6NDUwMTYsImlhdCI6MTYxNDY2NzE2MH0.KdNWA62Ll4IKWcZt5C0eQUg_7Z35Dc9SnilnIoGimKI'
      const bingLayer = window.windowCesium.createWorldImagery({
        style: window.Cesium.IonWorldImageryStyle.AERIAL
      })
      window.viewer.imageryLayers.addImageryProvider(bingLayer, 0)
    }

    onMounted(() => {
      init()
    })

    return {
      id
    }
  }
})

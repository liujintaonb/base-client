import { defineComponent, onMounted, ref } from 'vue'
import * as Cesium from 'cesium'
import 'cesium/Build/Cesium/Widgets/widgets.css'

export default defineComponent({
  name: 'cesium',
  render () {
    return (
      <div class="cesium-wrapper" id={this.id}></div>
    )
  },
  setup (props) {
    const id = 'cesium_' + +new Date() + Math.random()
    const viewer = ref(null)
    const init = () => {
      const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7']
      const tiandituTk = '001163910f4981cbe5ced093ef7e3019'
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkMDAwMzA2YS03MzM2LTQ3MjItOWYyNi0xYzA4N2E2OGIxZmIiLCJpZCI6NDU5OTUsImlhdCI6MTYxNTczMDU4N30.PgarVtauT6hyy74ZKraBZT0DtxkUwksOzhyhtbmYW-U'
      viewer.value = new Cesium.Viewer(id, {
        animation: false, // 动画
        homeButton: true, // home键
        geocoder: true, // 地址编码
        baseLayerPicker: false, // 图层选择控件
        timeline: false, // 时间轴
        fullscreenButton: true, // 全屏显示
        infoBox: true, // 点击要素之后浮窗
        sceneModePicker: true, // 投影方式  三维/二维
        navigationInstructionsInitiallyVisible: false, // 导航指令
        navigationHelpButton: false, // 帮助信息
        selectionIndicator: false, // 选择
        imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
          // 影像底图
          url: 'http://t{s}.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + tiandituTk,
          subdomains: subdomains,
          layer: 'tdtImgLayer',
          style: 'default',
          format: 'image/jpeg',
          tileMatrixSetID: 'GoogleMapsCompatible', // 使用谷歌的瓦片切片方式
          show: true
        })
      })
      viewer.value._cesiumWidget._creditContainer.style.display = 'none' // 隐藏cesium ion
      viewer.value.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        // 影像注记
        url: 'http://t{s}.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=' + tiandituTk,
        subdomains: subdomains,
        layer: 'tdtCiaLayer',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'GoogleMapsCompatible',
        show: true
      }))

      // 将三维球定位到中国
      viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
        orientation: {
          heading: Cesium.Math.toRadians(348.4202942851978),
          pitch: Cesium.Math.toRadians(-89.74026687972041),
          roll: Cesium.Math.toRadians(0)
        },
        complete: function callback () {
          // 定位完成之后的回调函数
        }
      })
    }

    onMounted(() => {
      init()
    })

    return {
      id
    }
  }
})

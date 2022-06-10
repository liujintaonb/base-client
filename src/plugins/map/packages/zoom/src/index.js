/**
 * 缩放控件
 */
import { Zoom, ZoomSlider } from 'ol/control'
import { defineComponent } from 'vue'
import Placement from '../../placement'

const KMapZoom = defineComponent({
  name: 'KMapZoom',
  inject: ['KMap'],
  components: { Placement },
  render () {
    return null
  },
  /**
   * 参数属性
   * @member props
   * @property {string} [placement] 停泊位置，可选值'left-top', 'right-top', 'left-bottom', 'right-bottom'
   * @property {string | boolean} [slider] 是否显示拖动条
   */
  props: {
    placement: {
      type: String,
      default: 'left-top',
      validator (val) {
        return ['left-top', 'right-top', 'left-bottom', 'right-bottom'].includes(val)
      }
    },
    slider: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    classes () {
      return Object.keys({
        'k-map-zoom': true,
        [`is-${this.placement}`]: !!this.placement
      }).join(' ')
    }
  },
  methods: {
    init (map) {
      this.zoom = new Zoom({
        className: this.classes + ' ol-zoom'
      })
      map.addControl(this.zoom)
      if (this.slider) {
        this.zoomSlider = new ZoomSlider({
          className: this.classes + ' ol-zoomslider'
        })
        map.addControl(this.zoomSlider)
      }
    }
  },
  created () {
    this.KMap.mapReady(this.init)
  },
  beforeUnmount () {
    const map = this.KMap?.map
    if (map) {
      this.zoom && map.removeControl(this.zoom)
      this.zoomSlider && map.removeControl(this.zoomSlider)
    }
  }
})

export default KMapZoom

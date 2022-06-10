/**
 * HTML覆盖物组件
 * @module k-map-html
 */
import { defineComponent } from 'vue'
import Overlay from 'ol/Overlay'

const KMapHtml = defineComponent({
  name: 'KMapHtml',
  inject: ['KMap'],
  /**
   * 属性参数
   * @member props
   * @property {string} [id] html 元素 id
   * @property {number[]} [offset] html 相对 position 的 xy偏移值 单位px
   * @property {number[]} [position] 地图坐标
   * @property {String} [positioning] html 相对 position的 定位原点， 可选值： 'bottom-left', 'bottom-center', 'bottom-right', 'center-left', 'center-center', 'center-right', 'top-left', 'top-center', and 'top-right'
   * @property {Boolean} [stopEvent] 是否阻隔鼠标对地图的作用事件。默认 true
   * @property {Boolean} [insertFirst] 是否预先添加进地图
   * @property {Boolean} [autoPan] 控制地图在 html元素通过 setPosition 展示在地图上时，地图视口自动定位到html 可以显示的范围
   * @property {Object} [autoPanAnimation] autoPan为true时地图视口移动的动画配置 {duration: 2000,  easing: easeIn}
   * @property {Number} [autoPanMargin] autoPan为true时地图视口移动到出现html元素显示位置的距离
   * @property {Boolean} [visible=true] 是否可见
   */
  props: {
    // Set the overlay id.
    // The overlay id can be used with the module:ol/Map~Map#getOverlayById method.
    id: [Number, String],
    // Offsets in pixels used when positioning the overlay.
    // The first element in the array is the horizontal offset.
    // A positive value shifts the overlay right. The second element in the array is the vertical offset.
    // A positive value shifts the overlay down.
    offset: {
      type: Array,
      default: () => {
        return [0, 0]
      }
    },

    // The overlay position in map projection. null时隐藏
    position: Array,

    // Defines how the overlay is actually positioned with respect to its position property.
    // Possible values are 'bottom-left', 'bottom-center', 'bottom-right', 'center-left', 'center-center', 'center-right', 'top-left', 'top-center', and 'top-right'.
    positioning: {
      type: String,
      default: 'center-center'
    },

    // Whether event propagation to the map viewport should be stopped.
    stopEvent: {
      type: Boolean,
      default: true
    },

    // Whether the overlay is inserted first in the overlay container, or appended
    insertFirst: Boolean,
    // If set to true the map is panned when calling setPosition, so that the overlay is entirely visible in the current viewport.
    autoPan: {
      type: Boolean,
      default: false
    },
    // The animation options used to pan the overlay into view. This animation is only used when autoPan is enabled.
    // A duration and easing may be provided to customize the animation.
    autoPanAnimation: {
      type: Object,
      default: () => {
        return {}
      }
    },

    // The margin (in pixels) between the overlay and the borders of the map when autopanning.
    autoPanMargin: {
      type: Number,
      default: 20
    },
    // 切换显示隐藏
    visible: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      overlay: null
    }
  },
  render () {
    return (
      <div class="k-map-html" style={ this.styles } {...{ on: this.$attrs }}>
        { this.$slots.default() }
      </div>
    )
  },
  computed: {
    styles () {
      return {
        cursor: this.$attrs.click ? 'pointer' : ''
      }
    }
  },
  watch: {
    $props: {
      deep: true,
      handler () {
        // todo：不明原因发生警告
        try {
          this.dispose()
          this.init()
        } catch (e) {
        }
      }
    }
  },
  methods: {
    init () {
      if (!this.$el) return
      const opts = {
        ...this.$props,
        element: this.$el
      }
      if (!this.overlay) {
        this.overlay = new Overlay(opts)
      }
      this.KMap.map.addOverlay(this.overlay)
      this.position && this.setPosition(this.position)
    },
    setPosition (position) {
      if (!this.overlay) return
      this.$nextTick(() => {
        this.overlay.setPosition(this.visible ? position : null)
      })
    },
    dispose () {
      if (this.overlay && this.KMap && this.KMap.map) {
        this.KMap.map.removeOverlay(this.overlay)
      }
    }
  },
  mounted () {
    this.KMap.mapReady(this.init)
  },
  beforeUnmount () {
    this.dispose()
  }
})

export default KMapHtml

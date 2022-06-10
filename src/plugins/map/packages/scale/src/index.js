import { defineComponent } from 'vue'
import { ScaleLine } from 'ol/control'

const KMapScale = defineComponent({
  name: 'KMapScale',
  inject: ['KMap'],
  render () {
    return null
  },
  /**
   * 属性参数
   * @member props
   * @property [minWidth=64] 显示的最小宽度
   * @property [units] 单位
   * @property [bar] bar模式
   * @property [steps=4] Number of steps the scalebar should use. Use even numbers for best results. Only applies when bar is true.
   * @property [text] 显示文本，bar为true时有效
   */
  props: {
    minWidth: {
      type: Number,
      default: 64
    },
    units: {
      type: String,
      default: 'metric'
    },
    bar: {
      type: Boolean
    },
    steps: {
      type: Number,
      default: 4
    },
    text: {
      type: Boolean
    }
  },
  methods: {
    init (map) {
      this.scaleLine = new ScaleLine(this.$props)
      map.addControl(this.scaleLine)
    },
    dispose () {
      this.scaleLine && this.KMap.map.removeControl(this.scaleLine)
    }
  },
  created () {
    this.KMap.mapReady(this.init)
  }
})

export default KMapScale

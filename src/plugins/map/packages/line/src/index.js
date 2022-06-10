import { defineComponent } from 'vue'
import LineString from 'ol/geom/LineString'
import featureMixin from '../../../mixins/feature.js'
import strokeMixin from '../../../mixins/stroke.js'
import { createBezierCurvePoints } from '../../../utils/index.js'
import createArrow from '../../../utils/arrow.js'

const KMapLine = defineComponent({
  name: 'KMapLine',
  mixins: [strokeMixin, featureMixin],
  /**
   * 属性参数
   * @member props
   * @property {number[]} [coordinates] 地图坐标
   * @property {string} [color] 颜色
   * @property {number} [width] 线条宽度
   * @property {string} [lineCap]
   * @property {string} [lineJoin]
   * @property {number[]} [lineDash]
   * @property {number} [lineDashOffset]
   * @property {boolean|object} [arrow] 显示箭头
   * @property {boolean} [arrowEach] 每段线都带箭头
   * @property {boolean} [bezier] 显示曲线
   */
  props: {
    coordinates: {
      type: Array,
      default () {
        return []
      }
    },
    // 箭头配置
    arrow: {
      type: [Boolean, String, Object],
      default: false
    },
    arrowEach: Boolean,
    // 曲线
    bezier: Boolean
  },
  methods: {
    lastSegmentStyle () {
      const length = this.coordinates.length
      if (length >= 2) {
        const start = this.coordinates[length - 2]
        const end = this.coordinates[length - 1]
        return createArrow(start, end, this.arrow, { color: this.color })
      }
    },
    setStyle () {
      if (!this.feature) return
      const styles = this.createLineStyle(strokeMixin.props)
      if (this.arrow) {
        if (this.arrowEach) {
          const geometry = this.feature.getGeometry()
          geometry.forEachSegment((start, end) => {
            styles.push(createArrow(start, end, this.arrow))
          })
        } else {
          const lastStyle = this.lastSegmentStyle()
          styles.push(lastStyle)
        }
      }
      this.feature.setStyle(styles)
    },
    createLine () {
      return this.bezier ? createBezierCurvePoints(this.coordinates) : this.coordinates
    },
    drawHandler () {
      const line = this.createLine()
      if (line && line.length > 0) {
        return new LineString(line)
      }
      return null
    },
    modifyHandler (geometry) {
      const line = this.createLine()
      geometry.setCoordinates(line)
    }
  }
})

export default KMapLine

/**
 * Link 连线组件
 */
import { defineComponent } from 'vue'
import LineString from 'ol/geom/LineString'
import strokeMixin from '../../../mixins/stroke.js'
import featureMixin from '../../../mixins/feature.js'
import { createCurvePoints } from '../../../utils/index.js'
import createArrow from '../../../utils/arrow.js'

/**
 * 属性参数
 * @member props
 * @property {number[]} from 起点
 * @property {number[]} to 终点
 * @property {number} [radius=0] 曲线半径度数, 默认为0,直线
 * @property {number} [angle=90] 曲线角度，radius与 angle结合可定义曲线的形状
 * @property {string|boolean|object} [fromArrow] 起点箭头
 * @property {string|boolean|object} [toArrow] 终点箭头
 * @property {string} [color] 颜色
 * @property {number} [width] 线条宽度
 * @property {string} [lineCap]
 * @property {string} [lineJoin]
 * @property {number[]} [lineDash]
 * @property {number} [lineDashOffset]
 */
const KMapLink = defineComponent({
  name: 'KMapLink',
  mixins: [strokeMixin, featureMixin],
  props: {
    // 起点
    from: Array,
    // 终点
    to: Array,
    // 曲线半径度数
    radius: {
      type: Number,
      default: 0
    },
    // 曲线角度
    angle: {
      type: Number,
      default: 90
    },
    // 起点箭头
    fromArrow: [Boolean, String, Object],
    // 终点箭头
    toArrow: [Boolean, String, Object]
  },
  methods: {
    createLink () {
      return this.radius > 0
        ? createCurvePoints(this.from, this.to, this.radius, this.angle)
        : [this.from, this.to]
    },
    drawHandler () {
      return new LineString(this.createLink())
    },
    modifyHandler (geometry) {
      geometry.setCoordinates(this.createLink())
    },
    setStyle () {
      if (!this.feature) return
      const styles = this.createLineStyle(strokeMixin.props)
      const coordinates = this.feature.getGeometry().getCoordinates()
      const length = coordinates.length
      if (this.fromArrow) {
        styles.push(createArrow(coordinates[1], coordinates[0], this.fromArrow, { color: this.color }))
      }
      if (this.toArrow) {
        styles.push(createArrow(coordinates[length - 2], coordinates[length - 1], this.toArrow, { color: this.color }))
      }
      this.feature.setStyle(styles)
    }
  }
})

export default KMapLink

/**
 * Flight 航线组件
 * @module $ui/map/my-map-flight
 */
import { defineComponent } from 'vue'
import LineString from 'ol/geom/LineString'
import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import createArrow from '../../../utils/arrow'
import parseStyle from '../../../utils/style'
import { createCurvePoints, createLinePathPoints, coordinateEqual } from '../../../utils/util'
import strokeMixin from '../../../mixins/stroke'
import featureMixin from '../../../mixins/feature'

// 默认线动效样式
const defaultLineEffect = {
  color: '#409eff',
  lineDash: null
}

// 默认点动效样式
const defaultPointEffect = {
  circle: {
    fill: '#409eff',
    radius: 3
  }
}

/**
  * 属性参数, 继承 [$ui/map/mixins/feature]{@link module:$ui/map/mixins/feature}
  * @member props
  * @property {number[]} from 起点
  * @property {number[]} to 终点
  * @property {number} [radius=0] 曲线半径度数, 默认为0,直线
  * @property {number} [angle=90] 曲线角度，radius与 angle结合可定义曲线的形状
  * @property {string|boolean|object} [arrow] 终点箭头
  * @property {string} [color] 颜色
  * @property {number} [width] 线条宽度
  * @property {string} [lineCap]
  * @property {string} [lineJoin]
  * @property {number[]} [lineDash]
  * @property {number} [lineDashOffset]
  * @property {number} [delay] 动画延时开始
  * @property {boolean} [loop] 动画循环
  * @property {number} [space=0.01] 分割点的距离，可通过改设置控制动画移动的速度，值越大速度越快
  * @property {number} [smooth=0.01] 平滑度，越小线越平滑
  * @property {boolean|object|function} [lineEffect=true] 线动画样式配置
  * @property {boolean|object|function} [pointEffect=false] 点动画样式配置
  */
const KMapFlight = defineComponent({
  name: 'KMapFlight',
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
    // 箭头
    arrow: [Boolean, String, Object],
    delay: {
      type: Number,
      default: 0
    },
    loop: {
      type: Boolean,
      default: true
    },
    space: {
      type: Number,
      default: 0.01
    },
    // 平滑度，越小线越平滑
    smooth: {
      type: Number,
      default: 0.01
    },
    color: {
      type: String,
      default: 'rgba(64, 158, 255, 0.5)'
    },
    lineDash: {
      type: Array,
      default () {
        return [5]
      }
    },
    lineEffect: {
      type: [Boolean, Object, Function],
      default () {
        return defaultLineEffect
      }
    },
    pointEffect: {
      type: [Boolean, Object, Function],
      default: false
    }
  },
  methods: {
    createPoints () {
      const line = this.radius > 0
        ? createCurvePoints(this.from, this.to, this.radius, this.angle, this.smooth)
        : [this.from, this.to]
      return this.space ? createLinePathPoints(line, this.space) : line
    },
    drawHandler () {
      const points = this.createPoints()
      return new LineString(points)
    },
    modifyHandler (geometry) {
      geometry.setCoordinates(this.createPoints())
    },
    createArrowStyle (coordinates, strokeProps = {}) {
      const length = coordinates.length
      let index = 0
      const to = coordinates[length - 1]
      let from = to
      while (from && coordinateEqual(from, to)) {
        ++index
        from = coordinates[length - index]
      }
      return createArrow(from || to, to, this.arrow, { color: strokeProps.color || this.color })
    },
    createLineEffectStyle (feature, strokeProps = {}) {
      const styles = this.createLineStyle(strokeMixin.props, strokeProps)
      const coordinates = feature.getGeometry().getCoordinates()
      if (this.arrow) {
        const arrowStyle = this.createArrowStyle(coordinates, strokeProps)
        styles.push(arrowStyle)
      }
      return styles
    },
    createPointEffectStyle (feature, pointEffect) {
      if (!this.pointEffect) return null
      return parseStyle({
        ...defaultPointEffect,
        ...pointEffect
      })
    },
    setStyle () {
      if (!this.feature) return
      const style = this.createLineEffectStyle(this.feature)
      this.feature.setStyle(style)
      this.lineEffect && this.lineDelayStart(this.lineEffectRender)
      this.pointEffect && this.pointDelayStart(this.pointEffectRender)
    },
    lineEffectRender () {
      const geometry = this.feature.getGeometry()
      const coordinates = geometry.getCoordinates()
      const length = coordinates.length
      if (!this.lineEffectFeature) {
        this.lineEffectFeature = new Feature(new LineString([coordinates[0]]))
        this.KMap.addFeature(this.lineEffectFeature)
      }
      const feature = this.lineEffectFeature
      let fraction = 0
      // eslint-disable-next-line no-unused-vars
      const animate = () => {
        ++fraction
        if (fraction > length) {
          this.loop && this.lineEffectRender()
          return
        }
        const points = coordinates.slice(0, fraction + 1)
        const line = new LineString(points)
        const style = typeof this.lineEffect === 'function'
          ? this.lineEffect({ feature, fraction, points, line, vm: this })
          : this.createLineEffectStyle(feature, {
            ...defaultLineEffect,
            ...this.lineEffect
          })
        feature.setGeometry(line)
        feature.setStyle(style)
        window.requestAnimationFrame(animate)
      }
      animate()
    },
    pointEffectRender () {
      const geometry = this.feature.getGeometry()
      const coordinates = geometry.getCoordinates()
      const length = coordinates.length - 1
      if (!this.pointEffectFeature) {
        this.pointEffectFeature = new Feature(new Point(coordinates[0]))
        this.KMap.addFeature(this.pointEffectFeature)
      }
      const feature = this.pointEffectFeature
      let fraction = 0
      // eslint-disable-next-line no-unused-vars
      const animate = () => {
        ++fraction
        if (fraction > length) {
          this.loop && this.pointEffectRender()
          return
        }
        const coordinate = coordinates[fraction]
        const point = new Point(coordinate)
        const style = typeof this.pointEffect === 'function'
          ? this.pointEffect({ feature, fraction, coordinates, coordinate, point, vm: this })
          : this.createPointEffectStyle(feature, this.pointEffect)
        feature.setGeometry(point)
        feature.setStyle(style)
        window.requestAnimationFrame(animate)
      }
      animate()
    },
    lineDelayStart (func) {
      if (this.delay) {
        clearTimeout(this.lineDelayId)
        this.lineDelayId = setTimeout(func, this.delay)
      } else {
        func()
      }
    },
    pointDelayStart (func) {
      if (this.delay) {
        clearTimeout(this.pointDelayId)
        this.pointDelayId = setTimeout(func, this.delay)
      } else {
        func()
      }
    }
  },
  beforeUnmount () {
    if (this.lineEffectFeature) {
      this.KMap.removeFeature(this.lineEffectFeature)
    }
    if (this.pointEffectFeature) {
      this.KMap.removeFeature(this.pointEffectFeature)
    }
    this.pointDelayId && clearTimeout(this.pointDelayId)
    this.lineDelayId && clearTimeout(this.lineDelayId)
  }
})

export default KMapFlight

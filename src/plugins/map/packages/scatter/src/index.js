/**
 * 散点图
 */
import { defineComponent } from 'vue'
import Point from 'ol/geom/Point'
import { easeOut } from 'ol/easing'
import featureMixin from '../../../mixins/feature'
import parseStyle from '../../../utils/style'

// 涟漪动画默认配置
const defaultRippleEffect = {
  color: null, // 默认与 fill 参数一致
  period: 1.5, //  动画周期，秒数
  scale: 5, // 动画中波纹的最大缩放比
  strokeColor: null,
  strokeWidth: 2, // 边框宽度
  type: 'fill' // 渲染类型 fill 或 stroke
}

const KMapScatter = defineComponent({
  name: 'KMapScatter',
  mixins: [featureMixin],
  /**
   * 属性参数, 继承 map/mixins/feature
   * @member props
   * @property {number[]} [coordinate] 经纬度
   * @property {number} [radius=10] 散点半径
   * @property {boolean} [effect=true] 开启动画效果
   * @property {string} [fill] 散点颜色
   * @property {object} [stroke] 描边
   * @property {number} [delay] 动画延时开始，毫秒
   * @property {boolean} [loop] 是否循环
   * @property {object} [ripple] 涟漪动画配置
   * @property {string} [ripple.color] 颜色，默认取fill
   * @property {number} [ripple.period=1.5] 动画周期，秒数
   * @property {number} [ripple.scale=5] 动画中波纹的最大缩放比
   * @property {string} [ripple.strokeColor] 描边颜色，默认取fill
   * @property {number} [ripple.strokeWidth=2]  边框宽度
   * @property {string} [ripple.type=fill] 动画渲染类型，支持 fill 或 stroke
   *
   */
  props: {
    // 坐标
    coordinate: Array,
    // 散点半径
    radius: {
      type: Number,
      default: 10
    },
    // 开启效果动画
    effect: {
      type: Boolean,
      default: true
    },
    // 重置填充颜色默认值
    fill: {
      type: String,
      default: '#409eff'
    },
    stroke: {
      type: Object
    },
    // 涟漪动画效果配置
    ripple: {
      type: Object,
      default () {
        return defaultRippleEffect
      }
    },
    // 动画延时开始
    delay: {
      type: Number,
      default: 0
    },
    // 动画循环
    loop: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      aId: null
    }
  },
  computed: {
    rippleOptions () {
      const color = this.ripple.color || this.fill
      const strokeColor = this.ripple.strokeColor || this.fill
      return {
        ...defaultRippleEffect,
        ...this.ripple,
        color,
        strokeColor
      }
    }
  },
  methods: {
    drawHandler () {
      return new Point(this.coordinate)
    },
    modifyHandler (geometry) {
      geometry.setCoordinates(this.coordinate)
    },
    delayStart (func) {
      if (this.delay) {
        clearTimeout(this.delayId)
        this.delayId = setTimeout(func, this.delay)
      } else {
        func()
      }
    },
    setStyle () {
      if (!this.feature) return
      const center = parseStyle({
        zIndex: this.zIndex,
        circle: {
          fill: this.fill,
          radius: this.radius,
          stroke: this.stroke
        },
        text: this.styleText

      })
      let styles = [center]
      if (this.effect) {
        const ripple = this.getRipple(this.rippleOptions)
        const stroke = this.getRippleStroke(this.rippleOptions)
        styles = [stroke, ripple].concat(styles)
        this.delayStart(() => {
          this.rippleEffect(styles, this.rippleOptions)
        })
      }
      this.feature.setStyle(styles)
    },
    getRipple ({ color }, opts = {}) {
      return parseStyle({
        zIndex: this.zIndex,
        circle: {
          fill: color,
          radius: this.radius,
          ...opts
        }
      })
    },
    getRippleStroke ({ strokeColor, strokeWidth }, opts = {}) {
      return parseStyle({
        zIndex: this.zIndex,
        circle: {
          fill: 'transparent',
          radius: this.radius,
          stroke: {
            color: strokeColor,
            width: strokeWidth
          },
          ...opts
        }
      })
    },
    rippleEffect (styles, rippleOptions) {
      const { scale, period, type } = rippleOptions
      let [stroke, ripple, center] = styles
      // const image = type === 'fill'
      //   ? ripple.getImage()
      //   : stroke.getImage()
      const start = new Date().getTime()
      // eslint-disable-next-line no-unused-vars
      const animate = () => {
        const tick = new Date().getTime()
        const ratio = (tick - start) / (period * 1000)
        if (ratio > 1) {
          this.loop && this.rippleEffect(styles, rippleOptions)
          return
        }
        const val = easeOut(ratio)
        const radius = this.radius * scale * val
        const opacity = 1 - val
        if (type === 'fill') {
          ripple = this.getRipple(this.rippleOptions, {
            radius
          })
          ripple.getImage().setOpacity(opacity)
        } else {
          stroke = this.getRippleStroke(this.rippleOptions, {
            radius
          })
          stroke.getImage().setOpacity(opacity)
        }
        this.feature.setStyle([stroke, ripple, center])
        this.aId = window.requestAnimationFrame(animate)
      }
      animate()
    }
  },
  beforeUnmount () {
    this.aId && window.cancelAnimationFrame(this.aId)
  }
})

export default KMapScatter

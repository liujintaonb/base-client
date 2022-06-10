export default {
  /**
   * 属性参数
   * @member props
   * @property {Number} [zIndex] 显示层级
   * @property {String} [fill] 填充颜色
   * @property {Object} [stroke] 描边 {color,lineCap, lineJoin, lineDash, lineDashOffset, miterLimit, width}
   * @property {Object} [text] 文本， {font,maxAngle,offsetX,offsetY,overflow,placement,scale,rotateWithView,rotation,text,textAlign,textBaseline,fill,stroke,backgroundFill,backgroundStroke,padding}
   * @property {Function} [styleFunction] 渲染Style函数，必须返回Style实例
   */
  props: {
    zIndex: Number,
    fill: {
      type: String,
      default: 'rgba(255, 255,255, 0.5)'
    },
    stroke: {
      type: Object,
      default () {
        return {
          width: 3,
          color: '#409eff'
        }
      }
    },
    text: [Object, String],
    styleFunction: Function
  },
  computed: {
    styleText () {
      return typeof this.text === 'string'
        ? { text: this.text, font: '12px' }
        : (this.text || {})
    }
  }
}

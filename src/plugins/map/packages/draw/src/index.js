/**
 * 绘画组件
 */
import { defineComponent } from 'vue'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import { Draw, Snap, Modify } from 'ol/interaction'
import GeoJSON from 'ol/format/GeoJSON'
import parseStyle from '../../../utils/style.js'

// 默认图形样式
const defaultEffect = {
  fill: 'rgba(255, 255, 255, 0.5)',
  stroke: {
    color: '#409eff',
    width: 2
  },
  circle: {
    radius: 6,
    fill: '#409eff',
    stroke: {
      width: 1,
      color: '#fff'
    }
  }
}

const KMapDraw = defineComponent({
  name: 'KMapDraw',
  inject: ['KMap'],
  render () {
    return this.$slots.default
  },
  /**
   * 属性参数
   * @member props
   * @property {string} [type=LineString] 图形类型，支持 'Point', 'LineString', 'Polygon', 'Circle'
   * @property {object|function} [brush] 画笔样式配置
   * @property {object|function} [effect] 图形样式配置
   * @property {boolean} [manual] 启用手动控制，启用后，可按需要调用 draw modify finish 方法完成画图功能
   * @property {object} [options] Draw组件附加参数对象，支持：{clickTolerance,dragVertexDelay,snapTolerance,stopClick,maxPoints,minPoints,freehand,wrapX}
   */
  props: {
    type: {
      type: String,
      default: 'LineString',
      validator (val) {
        return ['Point', 'LineString', 'Polygon', 'Circle'].includes(val)
      }
    },
    // 画笔样式
    brush: {
      type: [Object, Function]
    },
    // 图形样式
    effect: {
      type: [Object, Function],
      default () {
        return defaultEffect
      }
    },
    // 手动控制
    manual: Boolean,
    /*
      {
        clickTolerance: Number,
        dragVertexDelay: Number,
        snapTolerance: Number,
        stopClick: Boolean,
        maxPoints: Number,
        minPoints: Number,
        freehand: Boolean,
        wrapX: Boolean
      }
     */
    options: Object

  },
  data () {
    return {
      layer: null,
      snapInstance: null,
      modifyInstance: null,
      drawInstance: null,
      drawStartHandler: null,
      drawEndHandler: null
    }
  },
  emits: ['ready', 'drawend', 'drawstart', 'modifystart', 'modifyend'],
  watch: {
    type () {
      if (!this.manual) {
        this.finish()
        this.draw()
        this.modify()
      }
    }
  },
  methods: {
    getStyle (config) {
      if (!config) return null
      return typeof config === 'function'
        ? config()
        : parseStyle(config)
    },
    init (map) {
      if (this.layer) return
      const source = new VectorSource()
      const style = this.getStyle(this.effect)
      this.layer = new VectorLayer({
        source,
        style,
        zIndex: 1
      })
      map.addLayer(this.layer)
      if (!this.manual) {
        this.draw()
        this.modify()
      }
      this.$emit('ready', this)
    },
    /**
     * 进入绘画模式
     * @method draw
     * @param {function} [callback] 绘画结束时回调函数
     */
    draw (callback) {
      if (!this.layer) return
      const source = this.layer.getSource()
      const style = this.getStyle(this.brush)
      const type = this.type
      const map = this.KMap.map
      const draw = new Draw({
        ...this.options,
        type,
        source,
        style
      })
      this.drawStartHandler = e => {
        /**
         * 开始绘画时触发
         * @event drawstart
         * @param {Object} e 事件对象，{feature}
         */
        this.$emit('drawstart', e)
      }
      this.drawEndHandler = e => {
        callback && callback(e)
        /**
         * 结束绘画时触发
         * @event drawend
         * @param {Object} e 事件对象，{feature}
         */
        this.$emit('drawend', e)
      }
      draw.on('drawstart', this.drawStartHandler)
      draw.on('drawend', this.drawEndHandler)
      this.drawInstance = draw
      this.snapInstance = new Snap({ source })
      map.addInteraction(draw)
      map.addInteraction(this.snapInstance)
    },
    /**
     * 进入绘画编辑模式
     * @method modify
     * @param {function} [callback] 编辑结束时回调函数
     */
    modify (callback) {
      if (!this.layer) return
      const map = this.KMap.map
      const source = this.layer.getSource()
      const style = this.getStyle(this.brush)
      const modify = new Modify({
        ...this.options,
        source,
        style
      })
      this.modifyStartHandler = e => {
        /**
         * 开始编辑时触发
         * @event modifystart
         * @param {Object} e 事件对象，{feature}
         */
        this.$emit('modifystart', e)
      }
      this.modifyEndHandler = e => {
        callback && callback(e)
        /**
         * 结束编辑时触发
         * @event modifyend
         * @param {Object} e 事件对象，{feature}
         */
        this.$emit('modifyend', e)
      }
      modify.on('modifystart', this.modifyStartHandler)
      modify.on('modifyend', this.modifyEndHandler)
      this.modifyInstance = modify
      map.addInteraction(this.modifyInstance)
    },
    /**
     * 完成绘画和编辑
     * @method finish
     */
    finish () {
      const map = this.KMap.map
      if (!map) return
      const draw = this.drawInstance
      const modify = this.modifyInstance
      if (draw) {
        draw.un('drawstart', this.drawStartHandler)
        draw.un('drawend', this.drawEndHandler)
        draw.dispose()
        map.removeInteraction(draw)
        map.removeInteraction(this.snapInstance)
        this.drawInstance = null
      }
      if (modify) {
        modify.un('modifystart', this.modifyStartHandler)
        modify.un('modifyend', this.modifyEndHandler)
        modify.dispose()
        map.removeInteraction(modify)
        this.modifyInstance = null
      }
    },
    dispose () {
      this.finish()
      if (this.KMap.map) {
        this.layer && this.KMap.map.removeLayer(this.layer)
      }
    },
    /**
     * 获取当前画布图层上的图形
     * @method getFeatures
     * @returns {Array}
     */
    getFeatures () {
      if (!this.layer) return []
      const source = this.layer.getSource()
      return source.getFeatures()
    },
    /**
     * 清空画布
     * @method clear
     */
    clear () {
      if (!this.layer) return
      const source = this.layer.getSource()
      source.clear()
    },
    /**
     * 删除指定图形
     * @method removeFeature
     * @param feature
     */
    removeFeature (feature) {
      const source = this.layer.getSource()
      source.removeFeature(feature)
    },
    /**
     * 添加图形, 图形加入到矢量图层
     * @method addFeature
     * @param {Feature[]|feature} feature
     */
    addFeature (feature) {
      const features = [].concat(feature)
      const source = this.layer.getSource()
      source.addFeatures(features)
    },
    /**
     * 图层上全部图形转换成JSON描述
     * @returns {string}
     */
    toJSON () {
      const features = this.getFeatures()
      return (new GeoJSON()).writeFeatures(features)
    },
    /**
     * 根据GeoJSON在图层上创建 feature
     * @param {object} json
     */
    fromJSON (json) {
      const features = (new GeoJSON()).readFeatures(json)
      this.addFeature(features)
    },
    /**
     * Feature转换成JSON
     * @param {Object} feature
     * @returns {string}
     */
    writeFeature (feature) {
      return (new GeoJSON()).writeFeature(feature)
    },
    /**
     * JSON转换成Feature
     * @param json
     * @returns {string}
     */
    readFeature (json) {
      return (new GeoJSON()).writeFeature(json)
    }
  },
  created () {
    this.KMap.mapReady(this.init)
  },
  beforeUnmount () {
    this.dispose()
  }
})

export default KMapDraw

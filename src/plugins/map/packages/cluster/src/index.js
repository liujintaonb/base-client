/**
 * 聚合组件
 */

import Point from 'ol/geom/Point'
import Feature from 'ol/Feature'
import { Vector as VectorLayer } from 'ol/layer'
import { Cluster, Vector as VectorSource } from 'ol/source'
import parseStyle from '../../../utils/style.js'
import { defineComponent } from 'vue'

// 样式函数构造器
const defaultStyleCreator = config => {
  return feature => {
    const size = (feature.get('features') || []).length
    const { fill, radius, strokeWidth, strokeColor, textFill, scaleSeed } = config

    return parseStyle({
      circle: {
        fill,
        radius: radius + scaleSeed * size,
        stroke: {
          width: strokeWidth,
          color: strokeColor
        }
      },
      text: {
        text: size > 0 ? size.toString() : '',
        fill: textFill
      }
    })
  }
}

const KMapCluster = defineComponent({
  name: 'KMapCluster',
  inject: ['KMap'],
  render (h) {
    const children = this.$slots.default ? this.$slots.defeault() : null
    if (children && children.length > 1) {
      return h('div', children)
    }
    return children
  },
  /**
    * 属性参数
    * @member props
    * @property {Object[]} [data] 数据
    * @property {Object} [keyMap] 数据字段映射
    * @property {string} [keyMap.coordinate=coordinate] 经纬度字段名称
    * @property {number} [distance=20] 聚合像素距离
    * @property {Object|Function} [styleCreator] 样式配置对象或函数
    * @property {string} [styleCreator.fill] 背景颜色
    * @property {number} [styleCreator.radius] 半径
    * @property {number} [styleCreator.strokeWidth] 描边宽度
    * @property {string} [styleCreator.strokeColor] 描边颜色
    * @property {string} [styleCreator.textFill] 字体颜色
    * @property {number} [styleCreator.scaleSeed] 半径缩放因子
    * @property {boolean} [cluster=true] 开启聚合
    * @property {number} [zIndex] 图层层级
    */
  props: {
    // 数据 [{coordinate}]
    data: {
      type: Array,
      default () {
        return []
      }
    },
    // 数据字段映射
    keyMap: {
      type: Object,
      default () {
        return {
          coordinate: 'coordinate'
        }
      }
    },
    // 聚合像素距离
    distance: {
      type: Number,
      default: 20
    },
    // 样式配置对象或函数
    styleCreator: {
      type: [Object, Function],
      default () {
        return {
          fill: '#409eff',
          radius: 10,
          strokeWidth: 1,
          strokeColor: '#fff',
          textFill: '#fff',
          scaleSeed: 0.001
        }
      }
    },
    // 开启聚合
    cluster: {
      type: Boolean,
      default: true
    },
    zIndex: Number,
    cursor: Boolean
  },
  data () {
    return {
      layer: null
    }
  },
  watch: {
    data (val) {
      this.clear()
      this.draw(val)
    }
  },
  methods: {
    init (map) {
      if (this.layer) return
      const source = new VectorSource({})
      const clusterSource = new Cluster({
        distance: this.distance,
        source
      })
      clusterSource.on('change', this.handleClusterChange)
      const style = typeof this.styleCreator === 'function'
        ? this.styleCreator
        : defaultStyleCreator(this.styleCreator)
      this.layer = new VectorLayer({
        source: this.cluster ? clusterSource : source,
        zIndex: this.zIndex,
        style
      })

      map.addLayer(this.layer)
      this.draw(this.data)
      this.$emit('ready', this)
    },
    dispose () {
      if (this.KMap && this.KMap.map && this.layer) {
        const source = this.layer.getSource()
        source && source.un('change', this.handleClusterChange)
        this.KMap.map.removeLayer(this.layer)
      }
    },
    /**
      * 绘制图形
      * @method draw
      * @param {Object[]} data 数据据
      */
    draw (data = []) {
      const { coordinate } = this.keyMap
      const features = data.map(item => new Feature({
        geometry: new Point(item[coordinate]),
        data: item,
        __vm__: this
      }))

      if (this.layer) {
        const source = this.getSource()
        source && source.addFeatures(features)
      }
    },
    /**
      * 清除图形
      * @method clear
      */
    clear () {
      if (!this.layer) return
      const source = this.getSource()
      source && source.clear()
    },
    getSource () {
      if (!this.layer) return
      const source = this.layer.getSource()
      return this.cluster ? source.getSource() : source
    },
    handleClusterChange (e) {
      /**
        * Cluster 发生改变时触发
        * @event change
        * @param {Object} e
        */
      this.$emit('change', e)
    }
  },
  created () {
    this.KMap.mapReady(this.init)
  },
  beforeUnmount () {
    this.dispose()
  }
})

export default KMapCluster

import Map from 'ol/Map'
import View from 'ol/View'
import DragPan from 'ol/interaction/DragPan'
import MouseWheelZoom from 'ol/interaction/MouseWheelZoom'
import PointerInteraction from 'ol/interaction/Pointer'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { FullScreen } from 'ol/control'
import { createLayer } from '../../../utils/layers.js'
import { useGlobalConfig } from '../../../utils/index.js'
import event from '../../../utils/event.js'
import { addResizeListener, removeResizeListener } from 'element-plus/lib/utils/resize-event'
import { defineComponent } from 'vue'

const KMap = defineComponent({
  name: 'KMap',
  provide () {
    return {
      KMap: this
    }
  },
  /**
   * 属性参数
   * @member props
   * @property {number} [zoom=4] 地图初始化层级
   * @property {number} [minZoom=1] 最小支持的层级
   * @property {number} [maxZoom=20] 最大支持的层级
   * @property {number[]} [center] 地图初始化中心经纬度
   * @property {String|Object|Function} [adapter=layers] 图层适配器，layers(天地图专用)
   * @property {String} [projection=EPSG:4326] 投影坐标系，支持 EPSG:4326 (WGS84) 或 EPSG:3857 (Pseudo-Mercator)
   * @property {String} [width=100%] 宽度，支持百分比
   * @property {String} [height=100%] 高度，支持百分比
   * @property {Boolean} [dragPan=true] 可拖拽移动图层
   * @property {Boolean} [mouseWheelZoom=true] 鼠标滚轮可缩放图层
   * @property {Object} [mapOptions] ol/Map 实例化参数选项
   * @property {Object} [viewOptions] ol/View 实例化参数选项
   */
  props: {
    // 初始化缩放层级
    zoom: {
      type: Number,
      default: 4
    },
    minZoom: {
      type: Number,
      default: 1
    },
    maxZoom: {
      type: Number,
      default: 20
    },
    // 初始化中心经纬度
    center: {
      type: Array,
      default () {
        return [108.5525, 34.3227]
      }
    },
    // 图层适配器, { layers(天地图专用)}
    adapter: {
      type: [String, Object, Function],
      default: () => {
        return { type: 'TDT' }
      }
    },
    // 投影标准
    projection: {
      type: String,
      default: 'EPSG:4326'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    // 可拖拽移动图层
    dragPan: {
      type: Boolean,
      default: true
    },
    // 鼠标滚轮可缩放图层
    mouseWheelZoom: {
      type: Boolean,
      default: true
    },
    // ol/Map 实例化参数选项
    mapOptions: Object,
    // ol/View 实例化参数选项
    viewOptions: Object,
    // 滤镜
    filter: Object,
    // 全屏
    fullScreen: {
      type: Boolean,
      default: true
    },
    // 颜色反相
    invert: Boolean
  },
  render () {
    const defaultSlot = this.$slots.default ? this.$slots.default() : ''
    return (
      <div class="k-map-box">
        <div id={this.id} class={this.classes} style={this.styles}>
          { defaultSlot }
        </div>
      </div>
    )
  },
  data () {
    return {
      id: 'k_map_' + +new Date() + Math.floor(Math.random() * 100000),
      cursor: null,
      viewWidth: 0,
      viewHeight: 0,
      map: null,
      fullScreenControl: null
    }
  },
  computed: {
    classes () {
      return {
        'k-map': true,
        'k-map--invert': this.invert
      }
    },
    styles () {
      return {
        width: this.width,
        height: this.height,
        cursor: this.cursor ? 'pointer' : ''
      }
    },
    filterStyle () {
      if (!this.filter) return null
      const filters = Object.entries(this.filter).map(([name, value]) => {
        if (name === 'hue-rotate') {
          return `${name}(${value}deg)`
        }
        return `${name}(${value})`
      })
      return filters.join(' ')
    }
  },
  watch: {
    dragPan (val) {
      this.setActive(DragPan, val)
    },
    mouseWheelZoom (val) {
      this.setActive(MouseWheelZoom, val)
    },
    filterStyle () {
      this.setCanvasFilter()
    }
  },
  methods: {
    /**
     * 设置是否激活交互工具
     * @method setActive
     * @param {Object} name 工具类
     * @param {Boolean} active 是否激活
     */
    setActive (name, active) {
      if (!this.map) return
      const interactions = this.map.getInteractions().getArray()
      const instance = interactions.find(n => n instanceof name)
      if (instance) {
        instance.setActive(active)
      }
    },
    /**
     * 实例化Map
     */
    init () {
      const $KMAP = useGlobalConfig()
      const { center, projection, zoom, minZoom, maxZoom } = this.$props
      const layer = createLayer({ ...this.adapter, ...$KMAP.tk ? { tk: $KMAP.tk } : null })
      // 标识图层
      layer.__K_LAYER__ = true
      const view = new View({
        ...(this.viewOptions || {}),
        projection,
        center,
        zoom,
        minZoom,
        maxZoom
      })
      this.map = new Map({
        ...(this.mapOptions || {}),
        layers: [].concat(layer),
        view: view,
        target: this.id,
        // 删除默认的控件
        controls: [],
        interactions: [
          new DragPan(),
          new MouseWheelZoom(),
          new PointerInteraction({
            handleEvent: this.handleEvent
          })
        ]
      })
      this.setActive(DragPan, this.dragPan)
      this.setActive(MouseWheelZoom, this.mouseWheelZoom)
      // 显示全屏
      if (this.fullScreen) {
        this.fullScreenControl = new FullScreen({
          className: 'k-map-fullscreen'
        })
        this.map.addControl(this.fullScreenControl)
      }
      this.bindMapEvents()
      /**
       * 地图初始化完成时触发
       * @event ready
       * @param {Map} map ol/Map实例
       * @param {VueComponent} vm Vue实例
       */
      this.$emit('ready', this.map, this)
      addResizeListener(this.$el, this.setViewSize)
      this.setCanvasFilter()
    },
    /**
     * 销毁Map
     * @method dispose
     */
    dispose () {
      if (!this.map) return
      this.fullScreen && this.fullScreenControl && this.map.removeControl(this.fullScreenControl)
      this.map.disposeInternal()
      this.unbindMapEvents()
      removeResizeListener(this.$el, this.setViewSize)
    },
    /**
     * 根据地图上的像素位置获取图形对象
     * @method getFeatureAtPixel
     * @param  {Number[]} pixel 位置像素 [x,y]
     * @return {Feature}
     */
    getFeatureAtPixel (pixel) {
      if (!this.map) return null
      return this.map.forEachFeatureAtPixel(pixel, feature => feature)
    },
    /**
     * 当图形可点击时，设置图形鼠标 cursor pointer
     * @method setCursor
     * @param {ol/Feature} feature
     */
    setCursor (feature) {
      const vm = this.getFeatureVM(feature)
      this.cursor = vm && (vm.cursor || vm.$attrs.click)
    },
    /**
     * 触发图形点击事件
     * @method clickTrigger
     * @param {ol/Feature} feature
     * @param {Object} e
     */
    clickTrigger (feature, e, eventName = 'click') {
      if (feature) {
        const vm = this.getFeatureVM(feature)
        if (vm) {
          vm.$emit(eventName, e, feature)
        }
      }
    },
    /**
     * 获取瓦片图层实例
     * @method getLayer
     * @returns {Array}
     */
    getLayer () {
      if (!this.map) return null
      return this.map.getLayers().getArray().find(n => n.__K_LAYER__)
    },
    /**
     * 获取图形挂载的 Vue实例
     * @method getFeatureVM
     * @param feature
     * @returns {*}
     */
    getFeatureVM (feature) {
      if (!feature) return
      const features = feature.get('features') || []
      const matchFeature = features[0] || feature
      return matchFeature.__vm__ || matchFeature.get('__vm__')
    },
    enterAndLeaveTrigger (feature, e) {
      // 无>有：鼠标移入
      if (!this.featureAtPixel && feature) {
        this.$emit('mouseenter', e, feature)
        const vm = this.getFeatureVM(feature)
        vm && vm.$emit('mouseenter', e, feature)
      }

      // 有>无： 鼠标移出
      if (this.featureAtPixel && !feature) {
        this.$emit('mouseleave', e, this.featureAtPixel)
        const vm = this.getFeatureVM(this.featureAtPixel)
        vm && vm.$emit('mouseleave', e, this.featureAtPixel)
      }
      // 同有，但不等：一出一进
      if (this.featureAtPixel && feature && this.featureAtPixel !== feature) {
        this.$emit('mouseleave', e, this.featureAtPixel)
        this.$emit('mouseenter', e, feature)
        const vmAtPixel = this.getFeatureVM(this.featureAtPixel)
        vmAtPixel && vmAtPixel.$emit('mouseleave', e, this.featureAtPixel)

        const vm = this.getFeatureVM(feature)
        vm && vm.$emit('mouseenter', e, feature)
      }
      // 更新
      this.featureAtPixel = feature
    },
    handleEvent (e) {
      const type = e.type
      const feature = this.getFeatureAtPixel(e.pixel)
      switch (type) {
        case 'pointermove':
          this.setCursor(feature)
          this.enterAndLeaveTrigger(feature, e)
          break
        case 'click':
          this.clickTrigger(feature, e)
          break
        default:
          this.clickTrigger(feature, e, type)
          break
      }

      return true
    },
    /**
     * 透传Map事件
     */
    bindMapEvents () {
      if (!this.map) return
      Object.entries(this.$attrs)
        .forEach(([key, handler]) => this.map.on(key, handler))
    },
    /**
     * 销毁透传Map事件
     */
    unbindMapEvents () {
      if (!this.map) return
      Object.entries(this.$attrs)
        .forEach(([key, handler]) => this.map.un(key, handler))
    },
    /**
     * 重置地图尺寸，当容器的尺寸变化后需要执行resize
     * @method resize
     */
    resize () {
      this.map.updateSize()
    },

    /**
     * 移动到指定经纬度居中
     * @method moveTo
     * @param {Number[]} loc 经纬度数组
     */
    moveTo (loc) {
      if (!this.map) return
      const view = this.map.getView()
      view.animate(
        {
          center: loc,
          duration: 200
        })
    },

    /**
     * 设置地图缩放等级
     * @method zoomTo
     * @param {Number|String} level 等级数值
     */
    zoomTo (level) {
      if (!this.map) return
      const view = this.map.getView()
      view.animate(
        {
          zoom: Number.parseInt(level),
          duration: 200
        })
    },

    /**
     * 逐步放大
     * @method zoomIn
     */
    zoomIn () {
      if (!this.map) return
      const view = this.map.getView()
      this.zoomTo(view.getZoom() + 1)
    },

    /**
     * 逐步缩小
     * @method zoomOut
     */
    zoomOut () {
      if (!this.map) return
      const view = this.map.getView()
      this.zoomTo(view.getZoom() - 1)
    },

    /**
     * 地图初始化完成回调
     * @method mapReady
     * @param callback
     */
    mapReady (callback) {
      this.$nextTick(() => {
        if (this.map) {
          callback && callback(this.map, this)
          return
        }
        event.$once('ready', callback)
      })
    },
    /**
     * 创建矢量图层，只会创建一个图层，已创建即复用
     */
    createVectorLayer () {
      if (!this.map || this.vectorLayer) return
      const vectorSource = new VectorSource()
      this.vectorLayer = new VectorLayer({
        source: vectorSource,
        zIndex: 1
      })
      this.map.addLayer(this.vectorLayer)
      return this.vectorLayer
    },
    /**
     * 在地图上添加图形, 图形加入到矢量图层
     * @method addFeature
     * @param {Feature[]|feature} feature
     */
    addFeature (feature) {
      if (!this.map) return
      if (!this.vectorLayer) {
        this.createVectorLayer()
      }
      const source = this.vectorLayer.getSource()
      const features = [].concat(feature)
      source.addFeatures(features)
    },
    /**
     * 删除图形
     * @method removeFeature
     * @param {Feature[]|feature} feature
     */
    removeFeature (feature) {
      if (!this.vectorLayer) return
      const source = this.vectorLayer.getSource()
      const features = [].concat(feature)
      features.forEach(feat => source.removeFeature(feat))
    },
    /**
     * 获取每个投影单位代表的距离米
     * @method getMetersPerUnit
     * @return {*|number|number}
     */
    getMetersPerUnit () {
      if (!this.map) return 0
      const view = this.map.getView()
      const projection = view.getProjection()
      return projection.getMetersPerUnit()
    },
    /**
     * 更新视图可视区尺寸
     */
    setViewSize () {
      const rect = this.$el.getBoundingClientRect()
      this.viewWidth = rect.width || 0
      this.viewHeight = rect.height || 0
      if (this.map) {
        this.map.updateSize()
      }
      this.$emit('view-size-change', rect)
    },
    setCanvasFilter () {
      if (!this.map) return
      const viewport = this.map.getViewport()
      if (viewport) {
        viewport.style.filter = this.filterStyle
      }
    },
    /**
     * 清空所有覆盖物
     */
    clear () {
      if (!this.map) return
      const layers = this.map
        .getLayers()
        .getArray()
        .filter(n => !n.__K_LAYER__)

      layers.forEach(n => {
        n.getSource().clear()
      })
    }
  },
  mounted () {
    this.init()
  },
  beforeUnmount () {
    this.dispose()
  }
})

export default KMap

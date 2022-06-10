<template>
  <k-map-cluster ref="cluster"
    v-bind="clusterProps"
    :data="markerData"
    :styleCreator="styleCreator"
    :cursor="cursor"
    v-on="$attr"
    @ready="activePopup(activeIndex)">
    <k-map-popup v-if="!multiple && $slots.default" v-show="marker" v-bind="popupProps" @hide="handleHide">
      <template v-if="$slots.title" v-slot:title>
        <slot v-if="marker" name="title" :marker="marker"></slot>
      </template>
      <solt v-if="marker" :marker="marker"></solt>
    </k-map-popup>

    <template v-if="multiple && $slots.default">
      <k-map-popup v-for="(marker, index) in markers"
                  :key="index"
                  v-bind="multiplePopupProps"
                  :position="marker.coordinate"
                  @hide="handleHide(index)">
        <template v-if="$slots.title" v-slot:title>
          <slot v-if="marker" name="title" :marker="marker"></slot>
        </template>
        <slot v-if="marker" :marker="marker"></slot>
      </k-map-popup>
    </template>
  </k-map-cluster>
</template>

<script>
/**
 * 标记
 * */
import { defineComponent } from 'vue'
import KMapCluster from '../../cluster'
import KMapPopup from '../../popup'
import imageMixin from '../../../mixins/image.js'
import parseStyle from '../../../utils/style.js'
import defaultMarkerSrc from '../../../assets/imgs/marker/blue.png'
import { mergeProps } from '../../../utils/index.js'

// 浮层默认参数
const defaultPopupProps = {
  title: '信息',
  width: '400px',
  offset: [0, -20],
  autoPan: true
}

export default defineComponent({
  name: 'KMapMarker',
  inject: ['KMap'],
  mixins: [imageMixin],
  components: { KMapCluster, KMapPopup },
  /**
     * 属性参数, 继承 [/KMap/packages/img]}
     * @member props
     * @property {number[]} [coordinate] 单个标记时的坐标，无设置data时有效
     * @property {string} [src] 标记的默认图片url，data各项属性无src时采用该值
     * @property {array} [data] 批量生成 marker 的数据
     * @property {number[]} [data.coordinate] 批量生成marker时每个marker的坐标
     * @property {string} [data.src] 批量生成marker的展示图片
     * @property {object} [keyMap] 数据属性映射
     * @property {object} [popup] 浮窗的配置参数
     * @property {Boolean} [multiple] 支持同时显示多个popup, 只对trigger=click 有效
     * @property {string} [trigger] popup打开方式 'click', 'hover'
     * @property {boolean} [cluster] 开启聚合
     * @property {number} [distance] 集群距离，表示在这个像素距离内的是同一群marker
     * @property {string} clusterSrc 集图标图片
     */
  props: {
    // 单个标记时的坐标，无设置data时有效
    coordinate: Array,
    // 标记的默认图片url，data各项属性无src时采用该值
    src: {
      type: String,
      default: defaultMarkerSrc
    },
    // 群标记图片url
    clusterSrc: {
      type: String
    },

    // 激活第几个浮层级
    activeIndex: Number,

    // 数据，[{coordinate, src}]
    data: {
      type: Array,
      default () {
        return []
      }
    },
    // 数据属性映射
    keyMap: {
      type: Object,
      default () {
        return {
          coordinate: 'coordinate',
          src: 'src'
        }
      }
    },
    // 开启集群
    cluster: {
      type: Boolean,
      default: true
    },
    // 相距少于的像素距离就是一群
    distance: {
      type: Number,
      default: 20
    },
    zIndex: Number,
    // 浮窗的配置参数
    popup: {
      type: Object,
      default () {
        return defaultPopupProps
      }
    },
    multiple: Boolean,

    // 浮窗显示触发方式
    trigger: {
      type: String,
      default: 'click',
      validator (val) {
        return ['click', 'hover'].includes(val)
      }
    }
  },
  data () {
    return {
      // 激活时的数据
      marker: null,
      // multiple 为true时，激活的数据
      markers: []
    }
  },
  computed: {
    markerData () {
      const { coordinate, src } = this.keyMap
      const data = this.data.length > 0
        ? this.data
        : (this.coordinate ? [{ coordinate: this.coordinate }] : [])
      return data.map(item => {
        return {
          ...item,
          coordinate: item[coordinate],
          src: item[src]
        }
      })
    },
    clusterProps () {
      return mergeProps(this, ['keyMap', 'distance', 'cluster', 'zIndex'])
    },
    // KMapImage配置参数
    imageProps () {
      const keys = Object.keys(imageMixin.props)
      return mergeProps(this, keys)
    },
    // KMapPopup配置参数
    popupProps () {
      if (!this.marker || this.multiple) return null
      const position = this.marker.coordinate
      return {
        ...defaultPopupProps,
        ...this.popup,
        position
      }
    },
    multiplePopupProps () {
      if (!this.multiple) return null
      return {
        ...defaultPopupProps,
        ...this.popup
      }
    },
    cursor () {
      return this.trigger === 'click'
    }
  },
  watch: {
    activeIndex (val) {
      this.activePopup(val)
    }
  },
  methods: {
    styleCreator (feature) {
      return this.cluster
        ? this.createClusterStyle(feature)
        : this.createFeatureStyle(feature)
    },
    createFeatureStyle (feature, clusterSrc) {
      const data = feature.get('data')
      const { coordinate, src } = data
      const icon = {
        ...this.imageProps,
        coordinate,
        src: clusterSrc || src || this.src
      }
      return parseStyle({ icon })
    },
    createClusterStyle (cluster) {
      const features = cluster.get('features')
      return this.createFeatureStyle(features[0], this.clusterSrc)
    },
    activePopup (index) {
      const cluster = this.$refs.cluster
      if (!cluster) return
      const source = cluster.getSource()
      if (!source) return
      const features = source.getFeatures() || []
      const feature = features[index]
      feature && this.showPopup({}, feature)
    },
    showPopup (e, feature) {
      if (!feature) return
      const coordinate = feature.getGeometry().getCoordinates()
      const features = feature.get('features') || []
      const marker = {
        coordinate,
        cluster: false,
        items: []
      }
      if (features.length > 0) {
        marker.items = features.map(f => f.get('data'))
        marker.cluster = true
      } else {
        marker.items = [feature.get('data')]
      }

      if (this.multiple) {
        this.markers.push(marker)
      } else {
        this.marker = marker
      }
      this.$emit('show', marker, feature, e)
    },
    handleHide (index = 0) {
      if (this.multiple) {
        const marker = this.markers.splice(index, 1)
        this.$emit('hide', marker)
      } else {
        this.$emit('hide', this.marker)
        this.marker = null
      }
    },
    bindEvents () {
      const cluster = this.$refs.cluster
      switch (this.trigger) {
        case 'click':
          cluster.$on('click', this.showPopup)
          break
        case 'hover':
          cluster.$on('mouseenter', this.showPopup)
          cluster.$on('mouseleave', this.handleHide)
          break
      }
    },
    draw (data = []) {
      const cluster = this.$refs.cluster
      if (cluster) {
        cluster.draw(data)
      }
    },
    clear () {
      const cluster = this.$refs.cluster
      if (cluster) {
        cluster.clear()
      }
    }
  },
  mounted () {
    this.bindEvents()
  },
  beforeUnmount () {
    const cluster = this.$refs.cluster
    if (cluster) {
      cluster.$off()
    }
  }
})
</script>

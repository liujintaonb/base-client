/**
 * 多边形覆盖组件
 */
import featureMixin from '../../../mixins/feature.js'
import Polygon from 'ol/geom/Polygon'
import { defineComponent } from 'vue'

const KMapPolygon = defineComponent({
  name: 'KMapPolygon',
  mixins: [featureMixin],
  /**
   * 属性参数,
   * @member props
   * @property {Array} [coordinates] 经纬度数组，是一个二维数组，必须三个点以上，首尾的点要相同, 才能构成多边形
   */
  props: {
    coordinates: {
      type: Array,
      required: true
    }
  },
  methods: {
    drawHandler () {
      return new Polygon([this.coordinates])
    },
    modifyHandler (geometry) {
      geometry.setCoordinates([this.coordinates])
    }
  }
})

export default KMapPolygon

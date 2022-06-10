import { defineComponent } from 'vue'
import Circle from 'ol/geom/Circle'
import featureMixin from '../../../mixins/feature.js'

const KMapCircle = defineComponent({
  name: 'KMapCircle',
  mixins: [featureMixin],
  /**
   * 属性参数, 继承 [$mixins/feature]
   * @member props
   * @property {number[]} [center] 圆形中心点经纬度
   * @property {number} [radius] 设置圆的半径。半径的单位:米
   */
  props: {
    center: {
      type: Array,
      required: true
    },
    // 设置圆的半径。半径的单位:米
    radius: {
      type: Number,
      default: 0
    }
  },
  methods: {
    // 单位米转换成投影单位值
    getRadius () {
      const metersPerUnit = this.KMap.getMetersPerUnit()
      return metersPerUnit ? this.radius / metersPerUnit : 0
    },
    drawHandler () {
      return new Circle(this.center, this.getRadius())
    },
    modifyHandler (geometry) {
      geometry.setCenter(this.center)
      geometry.setRadius(this.getRadius())
    }
  }
})

export default KMapCircle

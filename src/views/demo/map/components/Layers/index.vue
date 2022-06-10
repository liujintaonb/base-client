<template>
  <k-map-placement placement="left-center">
   <div class="app-layer-wrapper" >
      <div class="app-map-layer-tip-wrapper" :class="{ 'active': isActive }" @click="isActive = !isActive">
        <img :src="isActive ? activeLayerImg : layerImg">
      <div class="app-map-layer__tip" >图层</div>
      </div>
       <el-collapse-transition>
        <section v-show="isActive" class="app-layer-right-tree">
          <div class="app-layer-tree-wrapper" >
            <div class="app-map-layer-title">图例列表</div>
            <div class="app-layer-tree">
              <el-tree
                ref="map-layer-tree"
                :data="treeData"
                show-checkbox
                @check-change="checkChangeEvent"
                :default-expanded-keys="[8,10,13,15]"
                :default-checked-keys="[2, 3, 4, 105, 106]"
                node-key="id"
                >
                <template v-slot="{ node, data }">
                  <div :key="node.id">
                    <i :class="data.icon"></i>
                    <span style="margin-left: 7px;">{{ node.label }}</span>
                  </div>
                </template>
              </el-tree>
            </div>
          </div>
          <div class="app-map-layer-arrow-left" @click="isActive = false">
            <img :src="arrowLeft" />
          </div>
        </section>
      </el-collapse-transition>
    </div>
    <k-map-popup ref="map-popup" :offset="[250, 0]" :position="[108.5525, 34.3227]" title="地方专业防扑火队信息" closeOnClick show-arrow="left">
      <DetailsModule :prop-data="currentCickData.propData" :obj-data="currentCickData.objData"></DetailsModule>
    </k-map-popup>
    <k-map-cluster :z-index="40" :style-creator="styleCreator" :data="preventionGuard"></k-map-cluster>
  </k-map-placement>
</template>

<script>
import { defineComponent } from 'vue'

import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'

import layerImg from '@/assets/imgs/layer.png'
import activeLayerImg from '@/assets/imgs/layer-active.png'
import arrowLeft from '@/assets/imgs/layer-arrow-left.png'
import DetailsModule from '_c/DetailsModule/index.vue'
import layerData from './layerData.js'

import config from '@/config'
import { getMapData } from '@/api/appMap.js'

export default defineComponent({
  name: 'AppMapLayer',
  components: {
    DetailsModule
  },
  props: {
    map: {
      type: Object
    },
    xzCode: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      isActive: false,
      layerImg,
      arrowLeft,
      activeLayerImg,
      treeData: JSON.parse(JSON.stringify(layerData)),
      preventionImg: require('@/assets/imgs/pu-huo-dui2.png'),
      preventionGuard: [], // 防火队数据
      cacheData: {},
      currentCickData: {},
      layerTileCache: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.map.on('singleclick', e => {
        const feature = this.map.forEachFeatureAtPixel(e.pixel, feature => feature)
        if (feature) {
          const features = feature.getProperties().features
          if (features?.length === 1) {
          // 获取 features 中当前图所携带的数据
            this.currentCickData = features[0].values_?.data || {}
            if (!this.currentCickData.coordinate) {
              this.$refs['map-popup'] && this.$refs['map-popup'].hide()
            } else {
              this.$refs['map-popup'] && this.$refs['map-popup'].show(this.currentCickData.coordinate)
            }
          } else if (features?.length > 1) {
            this.$message.error('当前地点数据过多，请放大后查看')
          }
        }
      })
    })
  },
  methods: {
    styleCreator (feature) {
      const size = (feature.get('features') || []).length
      return this.$KMAP.parseStyle({
        icon: {
          src: this.preventionImg,
          anchor: [0.5, -2],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          stroke: { cursor: 'pointer' }
        },
        text: {
          textAlign: 'center',
          textBaseline: 'middle',
          text: size > 1 ? size.toString() : '',
          fill: '#fff',
          stroke: { color: '#83bf40', width: 12 }
        }
      })
    },
    checkChangeEvent (node, checked, childrenChecked) {
      this.$emit('check-change', node, checked, this.$refs['map-layer-tree'].getCheckedKeys())
      this.nodeLayerChange(node, checked)
    },
    /**
     * 创建节点图层
     */
    async nodeLayerChange (node, checked) {
      if (node.apiParams) {
        if (checked) {
          const coordinates = await this.getMapDataFn({ ...node.apiParams, ...{ xzCode: this.xzCode } }, node.layerConfig.propData)
          this.preventionGuard = coordinates
        } else {
          this.preventionGuard = []
        }
      } else if (node.layerConfig) {
        if (checked) {
          const layerConfig = node.layerConfig
          if (!this.layerTileCache[node.id]) {
            this.layerTileCache[node.id] = [].concat(layerConfig.type).map((n, i) => this.createLayer(n, (layerConfig.zIndex ? layerConfig.zIndex : node.id) + i))
          }
          this.layerTileCache[node.id].forEach(layer => this.map.addLayer(layer))
        } else {
          if (this.layerTileCache[node.id]) {
            this.removeLayers(this.layerTileCache[node.id])
          }
        }
      }
    },
    createLayer (layers, zIndex) {
      return new TileLayer({
        source: new TileWMS({
          // 未发布
          url: `${config.geoserverUrl}/geoserver/cite/wms`,
          params: {
            layers,
            version: '1.1.0'
          },
          serverType: 'geoserver'
        }),
        zIndex
      })
    },
    removeLayers (layers) {
      layers.forEach(layer => layer && this.map.removeLayer(layer))
    },
    // 懒加载数据，先查找缓存中是否存在数据，没有则查询，有则使用缓存数据
    async getMapDataFn (params, propData) {
      if (this.cacheData[params.typeName]) return this.cacheData[params.typeName]
      const res = await getMapData(params)
      this.cacheData[params.typeName] = res.features?.length > 0
        ? res.features.map(v => { return { coordinate: v.geometry.coordinates, type: params.typeName, objData: v.properties, propData } }) : []
      return this.cacheData[params.typeName]
    }
  }
})
</script>

<style lang="scss" scoped>
.app-layer-wrapper {
  position: relative;
}
.app-map-layer-tip-wrapper {
  position: absolute;
  padding: 10px 20px;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
  background: rgba(255, 255, 255, .9);
  border-radius: 2px;
  cursor: pointer;

  &.active {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    color: #418246;
  }
}
.app-map-layer__tip {
  padding-top: 7px;

}
.app-map-layer-title {
  line-height: 40px;
  color: #fff;
  text-align: center;
  background-color: rgba(84, 185, 90, 0.8);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
}
.app-layer-right-tree {
  display: flex;
  align-items: center;
  position: absolute;
  left: 73px;
  height: 600px;
  top: 50%;
  transform: translateY(-50%);
}
.app-layer-tree-wrapper {
  width: 270px;

  ::v-deep {
    .el-tree {
      background:none;
    }
    .el-tree-node__content:hover {
      background-color: rgba(84, 185, 90, .6);
    }
  }
}
.app-layer-tree {
  height: 560px;
  background:  rgba(255, 255, 255, 0.9);
  border-bottom-right-radius: 2px;
  border-bottom-left-radius: 2px;
  overflow-y: auto;
}
.app-map-layer-arrow-left {
  margin-top: 75px;
  cursor: pointer;
}
</style>

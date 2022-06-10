import LayerGroup from 'ol/layer/Group'
import TileLayer from 'ol/layer/Tile'
// import OSM from 'ol/source/OSM'
import XYZ from 'ol/source/XYZ'
// import TileGrid from 'ol/tilegrid/TileGrid'
// import WMTSGrid from 'ol/tilegrid/WMTS'
// import WMTS from 'ol/source/WMTS'
// import TileImage from 'ol/source/TileImage'
// import { get as getProj } from 'ol/proj'
// import { getWidth, getTopLeft } from 'ol/extent'

/**
 * 天地图
 * @param {string} t
 * @param {string} k
 *
 * vec_w: 矢量底图
 * cva_w: 矢量注记
 * img_w: 卫星影像底图
 * cia_w: 影像注记
 * ter_w: 地形底图
 * cta_w: 地形注记
 * ibo_w: 境界（省级以上）
 */
function createTdtLayer (t, tk = '001163910f4981cbe5ced093ef7e3019') {
  return new TileLayer({
    source: new XYZ({
      url: `http://t{0-7}.tianditu.com/DataServer?T=${t}&x={x}&y={y}&l={z}&tk=${tk}`
    })
  })
}

/**
 * 适配天地图图层
 * @param settings
 * @return {LayerGroup}
 */
function createTdtLayerGroup (settings) {
  const layers = settings.layers.map(n => createTdtLayer(n, settings.tk))
  return new LayerGroup({
    layers: layers
  })
}

/**
 * 创建地图图层， 暂时只支持创建天地图
 * @param {*} adapter
 */
export function createLayer (adapter) {
  if (typeof adapter === 'function') {
    return adapter({
      TileLayer,
      LayerGroup,
      XYZ
    })
  }
  // 字符串类型转换成对象描述
  const settings = typeof adapter === 'object' ? { ...adapter } : { type: adapter }
  const type = settings.type
  delete settings.type
  if (type === 'TDT') {
    return createTdtLayerGroup({
      layers: ['vec_w', 'cva_w'],
      ...settings
    })
  } else if (type === 'AMap') {
    return new TileLayer({
      source: new XYZ({
        url: 'http://webrd03.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}&lang=zh_cn'
      })
    })
  }
  return null
}

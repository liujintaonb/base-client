import request from '@/utils/request.js'
import config from '@/config'

// 地图数据查询
export function getMapData ({ typeName, xzCode }) {
  return request({
    url: `${config.geoserverUrl}/geoserver/cite/ows`,
    method: 'get',
    params: {
      typeName: `cite:${typeName}`,
      service: 'WFS',
      version: '1.0.0',
      request: 'GetFeature',
      maxFeatures: '50000',
      outputFormat: 'application/json',
      viewparams: `xzcode:${xzCode || ''}`
    }
  })
}

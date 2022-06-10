import KMap from './packages/map/index.js'
import KLayers from './packages/layers/index.js'
import Placement from './packages/placement/index.js'
import Zoom from './packages/zoom/index.js'
import Scale from './packages/scale/index.js'
import Html from './packages/html/index.js'
import Panel from './packages/panel/index.js'
import Popup from './packages/popup/index.js'
import Pointer from './packages/pointer/index.js'
import Draw from './packages/draw/index.js'
import Line from './packages/line/index.js'
import Link from './packages/link/index.js'
import Measure from './packages/measure/index.js'
import Image from './packages/image/index.js'
import Circle from './packages/circle/index.js'
import Cluster from './packages/cluster/index.js'
import Polygon from './packages/polygon/index.js'
import Geo from './packages/geo/index.js'
import Marker from './packages/marker/index.js'
import Scatter from './packages/scatter/index.js'
import Flight from './packages/flight/index.js'
import parseStyle from './utils/style.js'

const components = [
  KMap,
  KLayers,
  Placement,
  Zoom,
  Scale,
  Scatter,
  Html,
  Image,
  Panel,
  Popup,
  Pointer,
  Draw,
  Line,
  Link,
  Measure,
  Circle,
  Cluster,
  Polygon,
  Geo,
  Marker,
  Flight
]

const install = (app, opts = {}) => {
  components.forEach(component => {
    app.component(component.name, component)
  })
  app.config.globalProperties.$KMAP = {
    tk: opts.tk || '',
    parseStyle
  }
}

export default {
  version: '0.2.0',
  install,
  KMap,
  KLayers,
  Placement,
  Zoom,
  Scale,
  Scatter,
  Html,
  Image,
  Panel,
  Popup,
  Pointer,
  Draw,
  Line,
  Link,
  Measure,
  Circle,
  Cluster,
  Polygon,
  Geo,
  Marker,
  Flight
}

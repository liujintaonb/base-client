import Map from './src/index.js'
import 'ol/ol.css'
import './src/index.scss'

Map.install = app => {
  app.component(Map.name, Map)
}

export default Map

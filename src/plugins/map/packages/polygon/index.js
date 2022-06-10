import Polygon from './src/index.js'

Polygon.install = app => {
  app.component(Polygon.name, Polygon)
}

export default Polygon

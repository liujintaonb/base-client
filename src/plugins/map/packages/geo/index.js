import Geo from './src/index.js'

Geo.install = app => {
  app.component(Geo.name, Geo)
}

export default Geo

import Marker from './src/index.vue'

Marker.install = app => {
  app.component(Marker.name, Marker)
}

export default Marker

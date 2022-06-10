import Layers from './src/index.vue'
import './src/index.scss'

Layers.install = app => {
  app.component(Layers.name, Layers)
}

export default Layers

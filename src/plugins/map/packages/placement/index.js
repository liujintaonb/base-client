import Placement from './src/index.vue'
import './src/index.scss'

Placement.install = app => {
  app.component(Placement.name, Placement)
}

export default Placement

import Measure from './src/index.vue'
import './src/index.scss'

Measure.install = app => {
  app.component(Measure.name, Measure)
}

export default Measure

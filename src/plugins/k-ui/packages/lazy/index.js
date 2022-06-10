import Lazy from './src/index.vue'
import './src/index.scss'

Lazy.install = app => {
  app.component(Lazy.name, Lazy)
}

export default Lazy

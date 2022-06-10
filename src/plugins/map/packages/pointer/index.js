import Pointer from './src/index.vue'
import './src/index.scss'

Pointer.install = app => {
  app.component(Pointer.name, Pointer)
}

export default Pointer

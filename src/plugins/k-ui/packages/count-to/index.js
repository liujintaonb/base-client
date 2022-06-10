import CountTo from './src/index.vue'
import './src/index.scss'

CountTo.install = app => {
  app.component(CountTo.name, CountTo)
}

export default CountTo

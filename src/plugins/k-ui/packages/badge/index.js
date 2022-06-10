import Badge from './src/index.vue'
import './src/index.scss'

Badge.install = app => {
  app.component(Badge.name, Badge)
}

export default Badge

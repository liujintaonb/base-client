import Panel from './src/index.vue'
import './src/index.scss'

Panel.install = app => {
  app.component(Panel.name, Panel)
}

export default Panel

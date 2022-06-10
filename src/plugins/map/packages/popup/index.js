import Popup from './src/index.vue'
import './src/index.scss'

Popup.install = app => {
  app.component(Popup.name, Popup)
}

export default Popup

import Zoom from './src/index.js'
import './src/index.scss'

Zoom.install = app => {
  app.component(Zoom.name, Zoom)
}

export default Zoom

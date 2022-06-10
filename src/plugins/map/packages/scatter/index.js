import Scatter from './src/index.js'

Scatter.install = app => {
  app.component(Scatter.name, Scatter)
}

export default Scatter

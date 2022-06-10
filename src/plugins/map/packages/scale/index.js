import Scale from './src/index.js'

Scale.install = app => {
  app.component(Scale.name, Scale)
}

export default Scale

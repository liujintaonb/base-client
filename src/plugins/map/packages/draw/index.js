import Draw from './src/index.js'

Draw.install = app => {
  app.component(Draw.name, Draw)
}

export default Draw

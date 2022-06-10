import Circle from './src/index.js'

Circle.install = app => {
  app.component(Circle.name, Circle)
}

export default Circle

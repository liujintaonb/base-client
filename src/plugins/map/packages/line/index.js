import Line from './src/index.js'

Line.install = app => {
  app.component(Line.name, Line)
}

export default Line

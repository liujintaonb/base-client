import Flight from './src/index.js'

Flight.install = app => {
  app.component(Flight.name, Flight)
}

export default Flight

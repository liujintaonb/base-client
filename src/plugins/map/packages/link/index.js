import Link from './src/index.js'

Link.install = app => {
  app.component(Link.name, Link)
}

export default Link

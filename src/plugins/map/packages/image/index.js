import Image from './src/index.js'

Image.install = app => {
  app.component(Image.name, Image)
}

export default Image

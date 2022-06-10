import Detail from './src/Detail'
import './src/Detail.scss'

Detail.install = app => {
  app.component(Detail.name, Detail)
}

export default Detail

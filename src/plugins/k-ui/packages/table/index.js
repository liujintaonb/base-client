import Table from './src/Table.vue'
import './src/index.scss'

Table.install = app => {
  app.component(Table.name, Table)
}

export default Table

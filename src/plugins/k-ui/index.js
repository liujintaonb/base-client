import Detail from './packages/detail/index.js'
import Badge from './packages/badge/index.js'
import Lazy from './packages/lazy/index.js'
import CountTo from './packages/count-to/index.js'
import Table from './packages/table/index.js'
import Form from './packages/form/index.js'

const components = [
  Detail,
  Badge,
  Lazy,
  CountTo,
  Table,
  Form
]

const install = (app, opts = {}) => {
  components.forEach(component => {
    app.component(component.name, component)
  })
}

export default {
  version: '0.2.0',
  install,
  Detail,
  Badge,
  Lazy,
  CountTo,
  Table,
  Form
}

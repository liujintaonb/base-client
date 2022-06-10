import Cluster from './src/index.js'

Cluster.install = app => {
  app.component(Cluster.name, Cluster)
}

export default Cluster

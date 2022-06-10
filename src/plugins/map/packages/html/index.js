import Html from './src/index.js'

Html.install = app => {
  app.component(Html.name, Html)
}

export default Html

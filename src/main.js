import { createApp } from 'vue'
import './registerServiceWorker'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import './styles/index.scss'

import SvgIcon from '_c/SvgIcon/index.vue'

import store from './store'
import App from './App.vue'

// plugins
import KMap from './plugins/map'
import KUi from './plugins/k-ui'

import './icons/index'
import './perm'

import permDirective from './directive/perm.js'

const app = createApp(App)

app.directive('perm', permDirective)

app.component('svg-icon', SvgIcon)
//
app.use(ElementPlus, { locale, size: 'small' })

app.use(KUi)
app.use(KMap, {
  tk: '001163910f4981cbe5ced093ef7e3019'
})

app.use(store).use(router)

app.mount('#app')

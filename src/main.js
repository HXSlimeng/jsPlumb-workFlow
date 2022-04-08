import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Contextmenu from 'vue-contextmenujs'
import '@/style/index.less'
import vuetify from './plugins/vuetify'
import common from '@/views/components/common/index.js'
import VueDraggableResizable from 'vue-draggable-resizable'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'
import '@/icons'
//echarts
import * as echarts from 'echarts/core'
import 'echarts-gl'
import { PieChart, BarChart, Scatter3D, LineChart, ScatterChart } from 'echarts/charts'
import { Scatter3DChart } from 'echarts-gl/charts'
import { Grid3DComponent } from 'echarts-gl/components'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  DatasetComponentOption,
  TransformComponent,
  VisualMapComponent
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  PieChart,
  BarChart,
  LineChart,
  Scatter3DChart,
  Grid3DComponent,
  VisualMapComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  ScatterChart
])
import dataV from '@jiaminghi/data-view'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.component('vue-draggable-resizable', VueDraggableResizable)

Vue.use(Contextmenu)
  .use(common)
  .use(dataV)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

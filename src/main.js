import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Contextmenu from 'vue-contextmenujs'
import '@/style/index.less'
import vuetify from './plugins/vuetify'
import common from '@/views/components/common/index.js'

//echarts
import * as echarts from 'echarts/core';
import 'echarts-gl';
import { PieChart,BarChart,Scatter3D   } from 'echarts/charts';
import { Scatter3DChart } from 'echarts-gl/charts';
import { Grid3DComponent } from 'echarts-gl/components';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  DatasetComponentOption,
  TransformComponent,
  VisualMapComponent 
} from 'echarts/components';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  PieChart ,
  BarChart,
  Scatter3DChart,
  Grid3DComponent,
  VisualMapComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);

Vue.config.productionTip = false
Vue.use(common);
Vue.prototype.$echarts = echarts

Vue.use(Contextmenu);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

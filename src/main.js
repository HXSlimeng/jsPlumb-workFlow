import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Contextmenu from 'vue-contextmenujs'
import '@/style/index.less'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(Contextmenu);
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

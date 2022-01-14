import Vue from 'vue'
import VueRouter from 'vue-router'
import enterModel from '../views/enterModel.vue'
import ModelEditCtrl from '../views/ModelEditCtrl.vue'
  
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ModelEditCtrl',
    component: ModelEditCtrl
  },
  {
    path: '/enterModel',
    name: 'enterModel',
    component: enterModel
  },
]

const router = new VueRouter({
  routes
})

export default router

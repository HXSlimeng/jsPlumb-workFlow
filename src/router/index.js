import Vue from 'vue'
import VueRouter from 'vue-router'
import enterModel from '../views/enterModel.vue'
import ModelEditCtrl from '../views/ModelEditCtrl.vue'
import dataManage from '../views/dataManage.vue'
import modelPublishing from '../views/modelPublishing.vue'
import chartArrangement from '../views/chartArrangement.vue'
  
Vue.use(VueRouter)

const routes = [
  {
    path: '/dataManage',
    name: '数据管理',
    component: dataManage,
    meta:{
      menuList:true,
      icon:'mdi-database-cog',
    }
  },
  {
    path: '/enterModel',
    name: '模型编辑',
    component: enterModel,
    meta:{
      menuList:false,
      icon:'mdi-sitemap'
    }
  },
  {
    path: '/',
    name: '模型管理',
    component: ModelEditCtrl,
    meta:{
      menuList:true,
      icon:'mdi-view-dashboard'
    }
  },
  {
    path: '/modelPublishing',
    name: '模型发布',
    component: modelPublishing,
    meta:{
      menuList:true,
      icon:'mdi-publish'
    }
  },
  {
    path: '/chartArrangement',
    name: '图标编排',
    component: chartArrangement,
    meta:{
      menuList:true,
      icon:'mdi-arrange-bring-forward'
    }
  },
]

const router = new VueRouter({
  mode:'history',
  routes
})

export default router

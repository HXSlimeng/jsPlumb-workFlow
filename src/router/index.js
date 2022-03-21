import Vue from 'vue'
import VueRouter from 'vue-router'
import EnterModel from '../views/enterModel/enterModel.vue'
import ModelEditCtrl from '../views/ModelEditCtrl/ModelEditCtrl.vue'
import DataManage from '../views/dataManage/dataManage.vue'
import ModelPublishing from '../views/modelPublishing.vue'
import mangageEtl from '../views/mangageEtl/mangageEtl.vue'
import PreviewDBTable from '../views/components/dataManage/previewDBTable.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/dataManage',
    name: '数据源管理',
    component: DataManage,
    meta: {
      menuList: true,
      icon: '数据源管理'
    },
    children: [
      { path: '', redirect: 'database' },
      { path: 'database', component: () => import('../views/components/dataManage/dataBaseSource') },
      { path: 'file', component: () => import('../views/components/dataManage/fileSource') },
      { path: 'interface', component: () => import('../views/components/dataManage/interFaceSource') }
    ]
  },
  {
    path: '/previewDBTable',
    name: '数据源管理',
    component: PreviewDBTable,
    meta: {}
  },
  {
    path: '/enterModel',
    name: 'enterModel',
    component: EnterModel,
    meta: {
      menuList: false,
      icon: 'mdi-sitemap'
    }
  },
  {
    path: '/mangageEtl',
    name: '数据ETL管理',
    component: mangageEtl,
    meta: {
      menuList: true,
      icon: '数据ETL管理'
    }
  },
  {
    path: '/manageModel',
    name: '模型管理',
    component: ModelEditCtrl,
    meta: {
      menuList: true,
      icon: '模型管理'
    }
  },
  {
    path: '',
    redirect: '/manageModel',
    meta: {
      menuList: false,
      icon: 'mdi-arrange-bring-forward'
    }
  },

  {
    path: '/modelPublishing',
    name: 'ETL发布',
    component: ModelPublishing,
    meta: {
      menuList: false,
      icon: 'ETL发布'
    }
  },

  {
    path: '/buildCharts',
    name: '创建可视化',
    component: () => import('../views/buildCharts/buildCharts'),
    meta: {
      menuList: false
    }
  },
  {
    path: '/manageVisualAna',
    name: '可视化分析',
    component: () => import('../views/manageVisualAna/manageVisualAna'),
    meta: {
      menuList: true,
      icon: '可视化分析'
    }
  },
  {
    path: '/previewChartsTest',
    name: 'previewChartsTest',
    component: () => import('../views/buildCharts/preview'),
    meta: {
      menuList: false,
      icon: 'mdi-arrange-bring-forward',
      hideNav: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router

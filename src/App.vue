<template>
  <v-app>
    <v-app-bar app elevation="0" dense v-if="!$route.meta.hideNav" height="50px" clipped-left outlined>
      <v-img :src="fitowIcon" max-height="80" max-width="160"></v-img>
      <div class="text-h5 ml-4">AI大数据分析平台</div>
      <!-- <v-app-bar-title class="text-h5">绘制流程图</v-app-bar-title> -->
    </v-app-bar>
    <v-navigation-drawer
      v-if="!$route.meta.hideNav"
      v-model="mainLeftBar"
      app
      :hide-overlay="true"
      :stateless="true"
      permanent
      expand-on-hover
      style="z-index: 3;"
      clipped
    >
      <!-- <v-avatar
          class="d-block text-center mx-auto mt-4"
          color="grey darken-1"
          size="36"
      ></v-avatar>-->

      <!-- <v-divider class="mx-3 my-5"></v-divider> -->
      <v-list nav>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item v-for="item in menuRoute" :key="item.meta.icon" :to="item.path">
            <v-list-item-icon>
              <svg-icon :icon-class="item.meta.icon"></svg-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <router-view>
        <template #breadcrumb>
          <div class="text-h5">{{ $route.name }}</div>
          <!-- <v-breadcrumbs :items="breadcrumbItem" large class="py-0"></v-breadcrumbs> -->
        </template>
      </router-view>
    </v-main>
  </v-app>
</template>

<script>
import router from '@/router/index'

export default {
  name: 'App',
  created() {
    console.log(process.env)
  },
  data: () => ({
    //
    mainLeftBar: true,
    router: router.options.routes,
    routeIcon: ['mdi-database-cog', 'mdi-sitemap', 'mdi-view-dashboard', 'mdi-publish', 'mdi-arrange-bring-forward'],
    fitowIcon: require('@/assets/fitow.png'),
    breadcrumbItem: [
      {
        text: '模型管理',
        disabled: false,
        to: '/manageModel'
      },
      {
        text: '模型编辑',
        disabled: false,
        to: 'enterModel'
      }
    ],
    selectedItem: '0'
  }),
  methods: {
    routerLinkTo(route) {
      if (route.path != this.$route.path) {
        this.$router.push(route.path)
      }
    }
  },
  computed: {
    menuRoute() {
      return router.options.routes.filter(item => item.meta.menuList)
    }
  },
  watch: {
    $route(to, from) {
      switch (to.path) {
        case '':
          break

        default:
          break
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import url('./style/vuetifyPreset.less');
/deep/.v-app-bar-title__placeholder {
  text-overflow: unset;
}
.noActive {
  color: black !important;
}
.active {
  color: #009d89 !important;
}
</style>

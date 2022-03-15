<template>
  <v-app>
    <!-- <v-system-bar app>
      <v-spacer></v-spacer>
    </v-system-bar>-->
    <v-app-bar app elevation="1" dense v-if="!$route.meta.hideNav">
      <v-img :src="fitowIcon" max-height="80" max-width="160"></v-img>
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
      dark
      color="rgb(40,44,52)"
    >
      <!-- <v-avatar
          class="d-block text-center mx-auto mt-4"
          color="grey darken-1"
          size="36"
      ></v-avatar>-->

      <!-- <v-divider class="mx-3 my-5"></v-divider> -->
      <v-list nav>
        <v-list-item
          v-for="(item, index) in menuRoute"
          :key="index"
          :to="item.path"
        >
          <v-list-item-icon>
            <v-icon color="rgb(97,218,251)">{{ item.meta.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import router from "@/router/index";
// import client from "./views/config/nodeRedis.js";
// console.log(client);
// var redis = require('redis');
// console.log(redis);

export default {
  name: "App",
  created() {
    console.log(process.env);
  },
  data: () => ({
    //
    mainLeftBar: true,
    router: router.options.routes,
    routeIcon: [
      "mdi-database-cog",
      "mdi-sitemap",
      "mdi-view-dashboard",
      "mdi-publish",
      "mdi-arrange-bring-forward",
    ],
    fitowIcon: require("@/assets/fitow.png"),
  }),
  methods: {
    routerLinkTo(route) {
      if (route.path != this.$route.path) {
        this.$router.push(route.path);
      }
    },
  },
  computed: {
    menuRoute() {
      return router.options.routes.filter((item) => item.meta.menuList);
    },
  },
  watch: {
    $route(to, from) {},
  },
};
</script>
<style lang="less" scoped>
/deep/.v-app-bar-title__placeholder {
  text-overflow: unset;
}
</style>

/deep/.v-app-bar-title__placeholder {
  text-overflow: unset;
}

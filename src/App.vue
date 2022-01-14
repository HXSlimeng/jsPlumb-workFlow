<template>
  <v-app>
    <v-main>
    <v-app-bar >
          <!-- <v-app-bar-nav-icon @click="leftBarVis = !leftBarVis"></v-app-bar-nav-icon> -->
          <v-app-bar-title  class="text-h5">绘制流程图</v-app-bar-title>
          <!-- <router-link :to="{path:'/'}">模型菜单</router-link> -->
          <!-- <router-link :to="{path:'/enterModel'}">流程图绘制</router-link>     -->
    </v-app-bar>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
<style lang="less" scoped>
/deep/.v-app-bar-title__placeholder{
  text-overflow: unset;
}
</style>

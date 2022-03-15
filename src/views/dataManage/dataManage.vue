<template>
  <div class="d-flex flex-column">
    <v-card
      class="text-h5 d-flex justify-space-between align-center pl-6"
      height="50"
      style="width: 100%"
    >数据源管理</v-card>
    <div class="main_container d-flex">
      <v-navigation-drawer
        v-model="drawer"
        :hide-overlay="true"
        :stateless="true"
        :absolute="false"
        width="300px"
      >
        <v-divider></v-divider>

        <v-list dense nav :flat="true">
          <v-list-item-group v-model="selectedData" color="primary" mandatory>
            <v-list-item v-for="item in typeOfSource" :key="item.title" link>
              <v-list-item-icon>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      typeOfSource: [
        { title: "连接池数据", icon: 'mdi-server' },
        { title: "文件数据", icon: 'mdi-file-cog' },
        { title: "接口数据源", icon: 'mdi-link' },
      ],
      selectedData: 0,
      modelHeaders: [
        {
          text: "模型名称",
          align: "start",
          value: "model_name",
        },
        { text: "描述", value: "graph_param.graph_message" },
        { text: "创建时间", value: "time_str" },
        { text: "操作", value: "actions" },
      ],
      routeMap: ['', 'file', 'interface']
    };
  },
  methods: {
    fetchSourceData(newVal, oldVal) {
      if (newVal !== false && newVal !== oldVal) {
        this.$router.push('/dataManage/' + this.routeMap[newVal])
      }
    }
  },
  watch: {
    selectedData: {
      handler: 'fetchSourceData',
      immediate: false
    }
  }
};
</script>

<style lang="less" scoped>
.main_container {
  position: relative;
  height: 100vh;
}
.dataSourceBarTitle {
  button {
    float: right;
  }
}
</style>
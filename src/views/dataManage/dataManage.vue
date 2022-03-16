<template>
  <div class="d-flex flex-column">
    <!-- <v-card
      class="text-h5 d-flex justify-space-between align-center pl-6"
      height="50"
      style="width: 100%"
    >数据源管理</v-card>-->
    <div class="main_container px-2">
      <v-tabs slider-color="#009D89" class="selectBar">
        <v-tab
          active-class="activeColor"
          v-for="(item, index) in routeLinks"
          :key="item.name"
          :to="'/dataManage/' + item.addr"
          :disabled="index == 2"
        >{{ item.name }}</v-tab>
      </v-tabs>
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
      routeLinks: [
        {
          name: '连接池数据',
          addr: 'database'
        },
        {
          name: '文件数据',
          addr: 'file'
        },
        {
          name: '接口数据源',
          addr: 'interface'
        }
      ]
    };
  },
  methods: {

  },
  watch: {
    selectedData(newVal, oldVal) {
      console.log(newVal, oldVal);
    }
  }
};
</script>

<style lang="less" scoped>
.main_container {
  position: relative;
  height: 100vh;
  .selectBar {
    position: absolute;
  }
}
.dataSourceBarTitle {
  button {
    float: right;
  }
}
.activeColor {
  color: #009d89;
}
</style>
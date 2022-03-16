<template>
  <div class="px-2">
    <!-- <v-card
      class="text-h5 d-flex justify-space-between align-center pl-6"
      height="50"
      style="width: 100%"
    >
      数据ETL管理
    </v-card>-->
    <div class="my-1 d-flex justify-space-between align-center topBar">
      <div>
        <v-btn color="primary" outlined>发布</v-btn>
        <v-btn color="primary" outlined disabled>导出</v-btn>
      </div>
      <div class="d-flex">
        <v-text-field
          style="min-width: 320px;"
          outlined
          dense
          placeholder="请输入数据源名称搜索"
          append-icon="mdi-magnify"
          hide-details
          v-model="searchVal"
          @click:append="search"
          class="ml-2"
        ></v-text-field>
        <v-dialog v-model="addModelDialog" width="500">
          <template #activator="{ on, attrs }">
            <v-btn color="teal darken-1" dark v-bind="attrs" v-on="on">
              <v-icon>mdi-plus</v-icon>新建ETL
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h6 grey lighten-2">新建数据ETL</v-card-title>
            <div class="mx-3">
              <v-text-field :rules="createModelRules" label="模型名称" v-model="newModelName"></v-text-field>
              <v-text-field label="描述" v-model="newModelMessage"></v-text-field>
            </div>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="addModelDialog = false">取消</v-btn>
              <v-btn color="primary" @click="openNewModel('ETL')">确定</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn outlined color="error">批量删除</v-btn>
        <v-btn outlined>刷新</v-btn>
      </div>
    </div>

    <!-- <div class="d-flex mt-3 flex-wrap chartLinkMain">
      <div v-for="(item, index) in dataViewSource" :key="index">
        <v-hover>
          <template v-slot:default="{ hover }">
            <v-card width="250px" class="ml-3 mb-3">
              <v-img height="200" :src="item.link"></v-img>
              <v-card-title>{{ item.title }}</v-card-title>
              <v-card-text>{{ item.message }}</v-card-text>
              <v-divider class="my-1"></v-divider>
              <v-card-actions>
                <v-icon>mdi-account</v-icon>User
                <v-row justify="end" dense class="text-subtitle-2">更新于2022.01.18</v-row>
              </v-card-actions>
              <v-fade-transition>
                <v-overlay v-if="hover" absolute opacity="0.8" color="blue-grey darken-1">
                  <div class="d-flex flex-column justify-center align-center">
                    <div style="text-align: center">这是一段描述信息这是一段描述信息这是一段描述信息这是一段描述信息这是一段描述信息这是一段描述信息</div>
                    <v-btn color="success">部署为web实际应用</v-btn>
                  </div>
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </template>
        </v-hover>
      </div>
    </div>-->
    <v-data-table :headers="etlHeader" :items="etlSource" :items-per-page="5">
      <template #item.actions="{ item }">
        <v-btn text color="primary" @click="enterViewModel(item, 'ETL')">ETL编辑</v-btn>
        <v-btn text color="primary" @click="publishETL(item)">发布</v-btn>
        <v-btn text color="primary">导出</v-btn>
        <v-btn text color="primary">编辑</v-btn>
        <v-btn text color="primary" @click="delEtl(item)">删除</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import editModelMixin from "@/mixins/editModel.js";
export default {
  mixins: [editModelMixin],
  data() {
    return {
      etlHeader: [
        {
          text: "名称",
          value: "name",
        },
        {
          text: "描述",
          value: "describe",
        },
        {
          text: "状态",
          value: "status",
        },
        {
          text: "源表",
          value: "sourceTable",
        },
        {
          text: "最后修改时间",
          value: "time",
        },
        {
          text: "操作",
          value: "actions",
        },
      ],
      etlSource: [
        {
          name: "名称",
          describe: "描述信息",
          status: "1",
          sourceTable: "源表",
          time: "2022-1-1",
        },
      ],
      overlay: false,
      searchVal: ''
    };
  },
  methods: {
    delEtl(item) { },
    publishETL(item) {
      this.$router.push({
        path: "/modelPublishing",
        params: item,
      });
    },
    search() {

    }
  },
};
</script>

<style>
</style>
<style lang="less" scoped>
.chartLinkMain {
  height: 84vh;
}
.topBar {
  // min-height: 48px;
  button {
    margin-left: 10px;
  }
}
</style>
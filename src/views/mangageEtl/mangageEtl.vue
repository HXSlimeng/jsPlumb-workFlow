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
      <div class="d-flex align-center">
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
            <v-btn color="teal darken-1" dark v-bind="attrs" v-on="on"> <v-icon left>mdi-plus</v-icon>新建ETL </v-btn>
          </template>
          <v-card>
            <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">新建数据ETL</v-card-title>
            <div class="mx-3 my-2">
              <v-text-field dense outlined label="模型名称" v-model="newModelName"></v-text-field>
              <v-text-field dense outlined label="描述" v-model="newModelMessage"></v-text-field>
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
        <v-btn outlined> <v-icon left>mdi-refresh</v-icon> 刷新</v-btn>
      </div>
    </div>
    <v-data-table
      :headers="etlHeader"
      :items="desserts"
      item-key="graph_name"
      :items-per-page="10"
      :single-select="singleSelect"
      show-select
      :loading="etlLoading"
    >
      <template #item.actions="{ item }">
        <v-btn text color="primary" @click="enterViewModel(item, 'ETL')">ETL编辑</v-btn>
        <v-btn text color="primary" @click="publishETL(item)">发布</v-btn>
        <v-btn text color="primary">导出</v-btn>
        <v-btn text color="primary">编辑</v-btn>
        <v-btn text color="primary" @click="deleteItem(item)">删除</v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">确定要删除该模型吗？</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItemConfirm">确定</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import editModelMixin from '@/mixins/editModel.js'
import { searchGraph, editGraph, delGraph } from '@/request/apis/drawApi.js'

export default {
  mixins: [editModelMixin],
  data() {
    return {
      etlHeader: [
        {
          text: '名称',
          value: 'graph_name'
        },
        {
          text: '描述',
          value: 'graph_describe'
        },
        {
          text: '状态',
          value: 'status'
        },
        {
          text: '源表',
          value: 'sourceTable'
        },
        {
          text: '最后修改时间',
          value: 'create_time'
        },
        {
          text: '操作',
          value: 'actions'
        }
      ],
      desserts: [],
      overlay: false,
      searchVal: '',
      singleSelect: null,
      etlLoading: false
    }
  },
  methods: {
    deleteGraph(item) {},
    publishETL(item) {
      this.$router.push({
        path: '/mangageEtl/modelPublishing',
        params: item
      })
    },
    search() {},
    fetchEtlList() {
      this.etlLoading = true
      searchGraph({ graph_type: 0, graph_state: 0 })
        .then(res => {
          if (res.save_state == 'success') {
            this.desserts = res.models
          } else {
            this.$message.alertMessage(res.failed_info)
          }
          this.etlLoading = false
        })
        .catch(err => {
          console.log(err)
          this.dataLifetching = false
          this.etlLoading = false
        })
    }
  },
  created() {
    this.fetchEtlList()
  }
}
</script>

<style lang="less" scoped>
.chartLinkMain {
  height: 84vh;
}
.topBar {
  min-height: 52px;
  button {
    margin-left: 10px;
  }
}
</style>

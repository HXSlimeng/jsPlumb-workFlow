<template>
  <div class="content clear_fix my-3 mx-3">
    <div class="editBox">
      <v-dialog v-model="editSourceDialog" max-width="400px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">新建数据表</v-btn>
        </template>
        <v-card>
          <v-card-title class="blue-grey lighten-5">新建接口数据源</v-card-title>
          <div class="inputArea pa-3">
            <v-text-field class="inputItem" outlined dense label="数据源名称"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="接口地址"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="用户名"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="密码"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="描述"></v-text-field>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn>取消</v-btn>
            <v-btn>确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-text-field
        outlined
        dense
        placeholder="请输入数据源名称搜索"
        append-icon="mdi-magnify"
        hide-details
        v-model="searchVal"
        @click:append="search"
        class="ml-auto"
      ></v-text-field>
    </div>
    <v-data-table
      :headers="dbHeaders"
      :items="dbSource"
      item-key="graph_param.graph_id"
      class="elevation-1"
    >
      <template #item.actions="{ item }">
        <div class="d-flex">
          <v-btn color="primary" dark>查看库表</v-btn>
          <v-btn color="primary" dark>更新数据</v-btn>
          <v-btn color="primary" dark>编辑</v-btn>
          <v-btn color="primary" dark>查看</v-btn>
          <v-btn color="primary" dark @click="deleteItem(item)">删除</v-btn>
        </div>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">刷新</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import methods from "../../config/methods"

export default {
  data() {
    return {
      dbHeaders: [
        {
          text: '名称',
          value: 'name'
        },
        {
          text: '描述',
          value: 'subscribe'
        },
        {
          text: '接口地址',
          value: 'addr'
        },
        {
          text: '参数',
          value: 'addr'
        },
        {
          text: '操作',
          value: 'actions'
        }
      ],
      dbSource: [
        {
          name: '连接池1',
          subscribe: '描述信息',
          addr: 'xxxxxxxxxxxxxxxxxxx'
        }
      ],
      searchVal: '',
      editSourceDialog: false
    }
  },
  methods: {
    search() {
      console.log(111);
    }
  }
}
</script>

<style lang="less">
@import url("./datamanage.less");
</style>
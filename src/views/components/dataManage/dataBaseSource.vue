<template>
  <div class="content clear_fix my-3 mx-3">
    <div class="editBox">
      <v-dialog v-model="selectSourceDialog" max-width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">新建数据表</v-btn>
        </template>
        <v-card>
          <div v-for="item in typeOfDataBase" :key="item.title">
            <v-subheader>{{ item.title }}</v-subheader>

            <v-container class="pa-3">
              <v-row>
                <v-col cols="3" v-for="source in item.dataList" :key="source.name">
                  <v-hover v-slot="{ hover }">
                    <v-card
                      class="dataBaseItem"
                      :elevation="hover ? 12 : 2"
                      @click="dataBaseItem(source)"
                    >
                      <div style="height: 80px;"></div>
                      <span>{{ source.name }}</span>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card>
      </v-dialog>
      <v-dialog v-model="editSourceDialog" max-width="400px">
        <v-card>
          <v-card-title class="blue-grey lighten-5">新建数据源</v-card-title>
          <div class="inputArea pa-3">
            <v-text-field class="inputItem" outlined dense label="数据源名称"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="描述"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="驱动类型"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="链接地址"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="用户名"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="密码"></v-text-field>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn>测试链接</v-btn>
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
      disable-sort
      item-key="graph_param.graph_id"
      class="elevation-1"
    >
      <template #item.actions="{ item }">
        <div class="d-flex">
          <v-btn color="primary" dark @click="previewDBTable(item)">查看库表</v-btn>
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
          text: '地址',
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
      selected: null,
      selectSourceDialog: false,
      editSourceDialog: false,
      typeOfDataBase: [
        {
          title: '关系型数据库',
          dataList: [
            {
              name: 'MySql'
            },
            {
              name: 'SQL Server'
            }
          ]
        },
        {
          title: '国产数据库',
          dataList: [
            {
              name: 'xxxxx'
            },
            {
              name: 'xxxxxx'
            }
          ]
        },
      ]
    }
  },
  methods: {
    search() {
      console.log(111);
    },
    deleteItem(item) {
      console.log(item);
    },
    dataBaseItem(source) {
      this.selectSourceDialog = false;
      this.editSourceDialog = true;
    },
    previewDBTable(item) {
      console.log(item);
      this.$router.push('/previewDBTable');
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./datamanage.less");
</style>
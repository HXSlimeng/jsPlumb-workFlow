<template>
  <div class="content">
    <div class="editBox d-flex justify-end align-center">
      <v-text-field
        outlined
        dense
        placeholder="请输入数据源名称搜索"
        append-icon="mdi-magnify"
        hide-details
        v-model="searchVal"
        @click:append="search"
        class="ml-2"
      ></v-text-field>
      <v-dialog v-model="selectSourceDialog" max-width="796px" max-height>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on" tile class="ml-2">新建数据表</v-btn>
        </template>
        <v-card>
          <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">新建数据源</v-card-title>
          <!-- <div>
            <v-tabs v-model="databaseType" color="primary" slider-color="primary">
              <v-tab v-for="item in typeOfDataBase" :key="item.title">{{ item.title }}</v-tab>
            </v-tabs>
            <v-tabs-items v-model="databaseType">
              <v-tab-item v-for="item in typeOfDataBase" :key="item.title">
                <v-container>
                  <v-row>
                    <v-col cols="2" v-for="source in item.dataList" :key="source.name">
                      <v-hover v-slot="{ hover }">
                        <v-card
                          class="dataBaseItem"
                          :elevation="hover ? 5 : 2"
                          @click="fileSourceItem(source)"
                        >
                          <div style="height: 80px;"></div>
                          <span>{{ source.name }}</span>
                        </v-card>
                      </v-hover>
                    </v-col>
                  </v-row>
                </v-container>
              </v-tab-item>
            </v-tabs-items>
          </div>-->
          <div v-for="item in typeOfDataBase" :key="item.title">
            <v-container class="pa-11">
              <v-row>
                <v-col cols="3" v-for="source in item.dataList" :key="source.name">
                  <v-hover v-slot="{ hover }">
                    <v-card
                      class="dataBaseItem"
                      :elevation="hover ? 12 : 2"
                      @click="fileSourceItem(source)"
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
      <v-btn outlined color="error" class="ml-2">批量删除</v-btn>
      <v-dialog v-model="editSourceDialog" max-width="400px">
        <v-card>
          <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">上传文件</v-card-title>
          <div class="inputArea pa-3">
            <v-text-field class="inputItem" outlined dense label="数据源名称"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="描述"></v-text-field>
            <v-file-input prepend-icon="mdi-plus" :accept="acceptFileType">
              <template v-slot:selection="{ index, text }">
                <v-chip
                  v-if="index < 2"
                  color="deep-purple accent-4"
                  dark
                  label
                  small
                  v-model="fileSelected"
                >{{ text }}</v-chip>
                <span
                  v-else-if="index === 2"
                  class="text-overline grey--text text--darken-3 mx-2"
                >+{{ files.length - 2 }} File(s)</span>
              </template>
            </v-file-input>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn>取消</v-btn>
            <v-btn>确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-data-table :headers="dbHeaders" :items="dbSource" item-key="graph_param.graph_id">
      <template #item.actions="{ item }">
        <div class="d-flex">
          <v-btn color="primary" text>编辑</v-btn>
          <v-btn color="primary" text>查看</v-btn>
          <v-btn color="primary" text @click="deleteItem(item)">删除</v-btn>
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
          text: '文件名称',
          value: 'addr'
        },
        {
          text: '文件类型',
          value: 'type'
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
      selectSourceDialog: false,
      acceptFileType: null,
      typeOfDataBase: [{
        title: '文件类型',
        dataList: [
          {
            name: 'EXCEL类型文件',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
          },
          {
            name: 'TXT类型文件',
            type: 'text/plain'
          },
          {
            name: 'CSV类型文件',
            type: '.csv'
          },
          {
            name: 'DB类型文件',
            type: '.db'
          },
        ]
      }],
      fileSelected: null,
      editSourceDialog: false
    }
  },
  methods: {
    search() {
      console.log(111);
    },
    fileSourceItem(source) {
      this.selectSourceDialog = false
      this.editSourceDialog = true
      this.acceptFileType = source.type
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./datamanage.less");
</style>
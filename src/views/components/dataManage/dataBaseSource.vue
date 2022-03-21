<template>
  <div class="content">
    <div class="editBox d-flex justify-end align-center my-1">
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
      <v-dialog v-model="selectSourceDialog" max-width="1021px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on" class="ml-2"> <v-icon left>mdi-plus</v-icon> 新建数据源</v-btn>
        </template>
        <v-card>
          <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">新建数据源</v-card-title>
          <div class="pa-5">
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
                          class="dataBaseItem d-flex flex-column justify-center align-center py-3"
                          :elevation="hover ? 5 : 2"
                          @click="dataBaseItem(source)"
                        >
                        <svg-icon :icon-class="source.name == '其他' ? 'OtherDatabase' : source.name" className="databaseSource"></svg-icon>
                          <span class="pt-2">{{ source.name }}</span>
                        </v-card>
                      </v-hover>
                    </v-col>
                  </v-row>
                </v-container>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </v-card>
      </v-dialog>
      <v-btn outlined color="error" class="ml-2">批量删除</v-btn>
      <v-dialog v-model="editSourceDialog" max-width="400px">
        <v-card>
          <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">新建数据源</v-card-title>
          <div class="inputArea pa-3 d-flex-column">
            <v-text-field class="inputItem" outlined dense label="数据源名称" hint="数据源名称可输入英文大小写/中文/数字/下划线，最多输入30个字符"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="描述"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="驱动类型"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="链接地址"></v-text-field>
            <v-btn class="mt-n5 mb-2" color="primary" style="position: absolute; right: 10px;">测试链接</v-btn>
            <v-text-field class="inputItem mt-5" outlined dense label="用户名"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="密码"></v-text-field>
          </div>
          <v-card-actions class="d-flex justify-center pb-7">
            <v-btn color="primary" class="mr-8">确定</v-btn>
            <v-btn @click="editSourceDialog = false">取消</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-data-table
      :headers="dbHeaders"
      :items="dbSource"
      disable-sort
      item-key="graph_param.graph_id"
      absolute
    >
      <template #item.actions="{ item }">
        <div class="d-flex">
          <v-btn color="primary" text @click="previewDBTable(item)">查看库表</v-btn>
          <v-btn color="primary" text>更新数据</v-btn>
          <v-btn color="primary" text>编辑</v-btn>
          <v-btn color="primary" text @click="lookupSource(item)">查看</v-btn>
          <v-btn color="primary" text @click="deleteItem(item)">删除</v-btn>
        </div>
        <v-dialog
          v-model="lookupSourceDialog"
          scrollable
          :overlay="false"
          max-width="600px"
          transition="dialog-transition"
        >
          <v-card>
            <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">新建数据源</v-card-title>
            <v-card-text class="pt-5">
              <v-text-field solo dense label="数据源名称" v-model="value"></v-text-field>
              <v-text-field solo dense label="描述" v-model="value"></v-text-field>
              <v-text-field solo dense label="链接地址" v-model="value"></v-text-field>
              <v-text-field solo dense label="用户名" v-model="value"></v-text-field>
              <v-text-field solo dense label="密码" v-model="value"></v-text-field>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">刷新</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import methods from "../../config/methods"
import SvgIcon from '../svgComp/SvgIcon.vue';

export default {
  components: { SvgIcon },
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
              name: 'MySQL',
            },
            {
              name: 'DB2'
            },
            {
              name: 'Sybase'
            },
            {
              name: 'Informix'
            },
          ]
        },
        {
          title: '大数据数据库',
          dataList: [
            {
              name: 'Hive'
            },
            {
              name: 'MaxCompute'
            },
            {
              name: 'Spak SQL'
            },
          ]
        },
        {
          title: 'MPP数据库',
          dataList: [
            {
              name: 'GreenPlum'
            },
            {
              name: 'Vertica'
            }
          ]
        },
        {
          title: '国产数据库',
          dataList: [
            {
              name: '达梦V7'
            },
            {
              name: '高斯200'
            },
          ]
        },
        {
          title: '其他',
          dataList: [
            {
              name: '其他'
            }
          ]
        },
      ],
      databaseType: 0,
      lookupSourceDialog: false
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
    },
    lookupSource(item) {

      this.lookupSourceDialog = true;
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./datamanage.less");
.databaseSource{
  height: 60px;
  width: 60px;
}
.topBar{
  height: 52px !important;
}
</style>
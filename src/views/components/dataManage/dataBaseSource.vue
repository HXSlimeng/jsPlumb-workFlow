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
                          <svg-icon
                            :icon-class="source.name == '其他' ? 'OtherDatabase' : source.name"
                            className="databaseSource"
                          ></svg-icon>
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
            <v-text-field
              class="inputItem"
              outlined
              dense
              label="数据源名称"
              hint="数据源名称可输入英文大小写/中文/数字/下划线,最多输入30个字符"
              v-model="newSqlSource.sql_data_name"
            ></v-text-field>
            <v-text-field class="inputItem" outlined dense label="描述" v-model="newSqlSource.sql_data_describe"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="驱动类型" v-model="newSqlSource.sql_data_name"></v-text-field>
            <v-text-field
              class="inputItem"
              outlined
              dense
              label="链接地址"
              prefix="https://"
              v-model="newSqlSource.sql_data_ip"
            ></v-text-field>
            <v-text-field class="inputItem" outlined dense label="端口" v-model="newSqlSource.sql_data_port"></v-text-field>
            <v-btn class="mt-n5 mb-2" color="primary" style="position: absolute; right: 10px;" @click="connectTest">测试链接</v-btn>
            <v-text-field class="inputItem mt-5" outlined dense label="用户名" v-model="newSqlSource.sql_data_user"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="密码" v-model="newSqlSource.sql_data_password"></v-text-field>
          </div>
          <v-card-actions class="d-flex justify-center pb-7">
            <v-btn @click="editSourceDialog = false" class="mr-8">取消</v-btn>
            <v-btn color="primary" @click="addSqlSource" :loading="adding">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-data-table
      :headers="dbHeaders"
      :items="dbSource"
      disable-sort
      item-key="sql_data_id"
      absolute
      :single-select="singleSelect"
      show-select
      :loading="sqlSourceFetching"
    >
      <template #item.actions="{ item }">
        <div class="d-flex">
          <v-btn color="primary" text @click="previewDBTable(item)">查看库表</v-btn>
          <!-- <v-btn color="primary" text>更新数据</v-btn> -->
          <v-btn color="primary" text @click="editDbSource(item)">编辑</v-btn>
          <v-btn color="primary" text @click="lookupSource(item)">查看</v-btn>
          <v-btn color="primary" text @click="deleteItemConfirm(item)">删除</v-btn>
        </div>
      </template>
      <!-- <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">刷新</v-btn>
      </template> -->
    </v-data-table>
    <v-dialog v-model="lookupSourceDialog" scrollable :overlay="false" max-width="600px" transition="dialog-transition">
      <v-card>
        <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">查看数据</v-card-title>
        <v-card-text class="pt-5">
          <v-text-field outlined dense disabled label="数据源名称" v-model="lookupItem.sql_data_name"></v-text-field>
          <v-text-field outlined dense disabled label="描述" v-model="lookupItem.sql_data_describe"></v-text-field>
          <v-text-field outlined dense disabled label="链接地址" v-model="lookupItem.sql_data_ip"></v-text-field>
          <v-text-field outlined dense disabled label="端口" v-model="lookupItem.sql_data_port"></v-text-field>
          <v-text-field outlined dense disabled label="用户名" v-model="lookupItem.sql_data_user"></v-text-field>
          <v-text-field outlined dense disabled label="密码" v-model="lookupItem.sql_data_password"></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editDbSourceDialog" scrollable :overlay="false" max-width="600px" transition="dialog-transition">
      <v-card>
        <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">编辑数据</v-card-title>
        <v-card-text class="pt-5">
          <v-text-field outlined dense label="数据源名称" v-model="lookupItem.sql_data_name"></v-text-field>
          <v-text-field outlined dense label="描述" v-model="lookupItem.sql_data_describe"></v-text-field>
          <v-text-field outlined dense label="链接地址" v-model="lookupItem.sql_data_ip"></v-text-field>
          <v-text-field outlined dense label="端口" v-model="lookupItem.sql_data_port"></v-text-field>
          <v-text-field outlined dense label="用户名" v-model="lookupItem.sql_data_user"></v-text-field>
          <v-text-field outlined dense label="密码" v-model="lookupItem.sql_data_password"></v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">确定要删除该数据源吗？</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogDelete = false">取消</v-btn>
          <v-btn color="blue darken-1" text @click="deleteItem">确定</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import methods from '../../config/methods'
import SvgIcon from '../svgComp/SvgIcon.vue'
import { GenNonDuplicateID } from '@/common/until.js'

import { sql_query, sql_save, sql_delete, connect_test, query_tables } from '@/request/apis/dataManageApi.js'

export default {
  components: { SvgIcon },
  data() {
    return {
      dbHeaders: [
        {
          text: '名称',
          value: 'sql_data_name'
        },
        {
          text: '描述',
          value: 'sql_data_describe'
        },
        {
          text: '地址',
          value: 'sql_data_ip'
        },
        {
          text: '操作',
          value: 'actions'
        }
      ],
      dbSource: [],
      searchVal: '',
      selected: null,
      selectSourceDialog: false,
      editSourceDialog: false,
      typeOfDataBase: [
        {
          title: '关系型数据库',
          dataList: [
            {
              name: 'MySQL'
            },
            {
              name: 'DB2'
            },
            {
              name: 'Sybase'
            },
            {
              name: 'Informix'
            }
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
            }
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
            }
          ]
        },
        {
          title: '其他',
          dataList: [
            {
              name: '其他'
            }
          ]
        }
      ],
      databaseType: 0,
      lookupSourceDialog: false,
      lookupItem: {
        sql_data_id: '',
        sql_data_name: '',
        sql_data_group: '',
        sql_data_user: '',
        sql_data_password: '',
        sql_data_ip: '',
        sql_data_port: '',
        sql_data_table: '',
        sql_data_describe: ''
      },
      editDbSourceDialog: false,
      newSqlSource: {
        sql_data_name: '',
        sql_data_group: '',
        sql_data_user: '',
        sql_data_password: '',
        sql_data_ip: '',
        sql_data_port: '',
        sql_data_table: '',
        sql_data_describe: ''
      },
      singleSelect: null,
      adding: false,
      sqlSourceFetching: false,
      dialogDelete: false,
      deleting: false
    }
  },
  methods: {
    search() {},
    deleteItem() {
      this.deleting = true
      let item = this.lookupItem
      sql_delete({ sql_data_id: item.sql_data_id, sql_data_name: item.sql_data_name })
        .then(res => {
          if (res.success == 'success') {
            this.dbSource = this.dbSource.filter(v => v.sql_data_id != item.sql_data_id)
          }
          this.deleting = false

          console.log(res)
        })
        .catch(err => {
          console.log(err)
          this.deleting = false
        })
      this.dialogDelete = false
    },
    dataBaseItem(source) {
      this.selectSourceDialog = false
      this.editSourceDialog = true
    },
    previewDBTable(item) {
      /* const { sql_data_name, sql_data_id } = item
      query_tables({
        sql_data_name,
        sql_data_id,
        database_name: 'fitow_data_analysis',
        query_tables: 1
      }) */

      this.$router.push({ name: '/dataManage/previewDBTable', params: { sqlItem: item } })
    },
    lookupSource(item) {
      this.lookupItem = item
      this.lookupSourceDialog = true
    },
    deleteItemConfirm(item) {
      this.lookupItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    fetchSqlSource() {
      this.sqlSourceFetching = true
      let default_kwargs = {
        /* sql_data_id: '',
        sql_data_name: '',
        sql_data_group: '',
        sql_data_user: '',
        sql_data_password: '',
        sql_data_ip: '',
        sql_data_port: '',
        sql_data_table: '',
        sql_data_describe: '' */
      }
      sql_query(default_kwargs)
        .then(res => {
          this.sqlSourceFetching = false
          if (res.state == 0) {
            this.dbSource = this.dbSource.concat(res.result)
          }
        })
        .catch(err => {
          this.sqlSourceFetching = false
          console.log(err)
        })
    },
    editDbSource(item) {
      this.lookupItem = item
      this.editDbSourceDialog = true
    },
    addSqlSource() {
      this.adding = true
      const { sql_data_name, sql_data_user, sql_data_password, sql_data_ip, sql_data_port, sql_data_describe } = this.newSqlSource
      let default_kwargs = {
        sql_data_id: GenNonDuplicateID(8),
        sql_data_name,
        sql_data_group: 0,
        sql_data_user,
        sql_data_password,
        sql_data_ip,
        sql_data_port,
        sql_data_table: '',
        sql_data_describe
      }
      this.newSqlSource.sql_data_id = GenNonDuplicateID(8) /* this.newSqlSource */
      sql_save(default_kwargs)
        .then(res => {
          if (res.state == 0) {
            this.editSourceDialog = false
            this.fetchSqlSource()
          }
          this.adding = false
        })
        .catch(err => {
          console.log(err)
          this.adding = false
        })
    },
    connectTest() {
      const { sql_data_user, sql_data_password, sql_data_ip, sql_data_port } = this.newSqlSource
      connect_test({
        sql_data_user,
        sql_data_password,
        sql_data_ip,
        sql_data_port
      })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  created() {
    this.fetchSqlSource()

    /* window.addEventListener('beforeunload', () => {
      console.log('before Page reload~~~')
      }) */
  }
}
</script>

<style lang="less" scoped>
@import url('./datamanage.less');
.databaseSource {
  height: 60px;
  width: 60px;
}
.topBar {
  height: 52px !important;
}
</style>

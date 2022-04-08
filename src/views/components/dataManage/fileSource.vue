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
      <v-dialog v-model="selectSourceDialog" max-width="796px" max-height>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on" tile class="ml-2">新建数据表</v-btn>
        </template>
        <v-card>
          <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">新建数据源</v-card-title>
          <div v-for="item in typeOfDataBase" :key="item.title">
            <v-container class="pa-11">
              <v-row>
                <v-col cols="3" v-for="source in item.dataList" :key="source.name">
                  <v-hover v-slot="{ hover }">
                    <v-card
                      class="dataBaseItem d-flex flex-column justify-center align-center py-3"
                      :elevation="hover ? 12 : 2"
                      @click="fileSourceItem(source)"
                    >
                      <svg-icon :icon-class="source.icon" className="databaseSource"></svg-icon>
                      <span class="pt-2">{{ source.name }}</span>
                    </v-card>
                  </v-hover>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card>
      </v-dialog>
      <v-btn outlined color="error" class="ml-2">批量删除</v-btn>
      <v-dialog v-model="editSourceDialog" max-width="600px">
        <v-card>
          <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">上传文件</v-card-title>
          <div class="inputArea pa-3">
            <v-text-field class="inputItem" outlined dense label="数据源名称" v-model="uploadeFileMess.file_name"></v-text-field>
            <v-text-field class="inputItem" outlined dense label="描述" v-model="uploadeFileMess.file_describe"></v-text-field>
            <v-file-input prepend-icon="mdi-plus" :accept="acceptFileType" @change="loadFile">
              <template v-slot:selection="{ index, text }">
                <v-chip v-if="index < 2" color="deep-purple accent-4" dark label small v-model="uploadeFileMess.fileSelected">{{
                  text
                }}</v-chip>
                <span v-else-if="index === 2" class="text-overline grey--text text--darken-3 mx-2">+{{ files.length - 2 }} File(s)</span>
              </template>
            </v-file-input>
          </div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="editSourceDialog = false">取消</v-btn>
            <v-btn @click="addFileSource">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-data-table
      :headers="dbHeaders"
      :items="dbSource"
      item-key="file_id"
      :single-select="singleSelect"
      show-select
      :loading="dbSourceFetching"
    >
      <template #item.actions="{ item }">
        <div class="d-flex">
          <!-- <v-btn color="primary" text>编辑</v-btn> -->
          <!-- <v-btn color="primary" text @click="openLookupDialog(item)">查看</v-btn> -->
          <v-btn color="primary" text @click="deleteItem(item)">删除</v-btn>
        </div>
      </template>
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
  </div>
</template>

<script>
import methods from '../../config/methods'
import { GenNonDuplicateID } from '@/common/until.js'
import { file_save, file_query, file_delete } from '@/request/apis/dataManageApi.js'

export default {
  data() {
    return {
      dbHeaders: [
        {
          text: '名称',
          value: 'file_name'
        },
        {
          text: '描述',
          value: 'file_describe'
        },
        /* {
          text: '文件名称',
          value: 'file_name'
        }, */
        {
          text: '文件类型',
          value: 'file_type'
        },
        {
          text: '操作',
          value: 'actions'
        }
      ],
      dbSource: [],
      searchVal: '',
      selectSourceDialog: false,
      acceptFileType: null,
      typeOfDataBase: [
        {
          title: '文件类型',
          dataList: [
            {
              name: 'EXCEL类型文件',
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
              icon: 'EXCEL文件'
            },
            {
              name: 'TXT类型文件',
              type: 'text/plain',
              icon: 'TXT文件'
            },
            {
              name: 'CSV类型文件',
              type: '.csv',
              icon: 'CSV'
            },
            {
              name: 'DB类型文件',
              type: '.db',
              icon: 'DB'
            }
          ]
        }
      ],
      uploadeFileMess: {
        file_name: '',
        file_describe: '',
        fileSelected: null
      },
      editSourceDialog: false,
      singleSelect: '',
      lookupSourceDialog: false,
      lookupItem: {},
      dbSourceFetching: false
    }
  },
  methods: {
    search() {},
    fileSourceItem(source) {
      this.selectSourceDialog = false
      this.editSourceDialog = true
      this.acceptFileType = source.type
    },
    loadFile(e) {
      /* let formData = new FormData()
      formData.append('files', e) */
      /* let readFile = new FileReader()
      readFile.readAsText(e, 'utf8')
      readFile.onload = function() {

        // console.log(readFile.result)
        // console.log(JSON.parse(this.result))
      } */
      console.log(e)

      this.uploadeFileMess.fileSelected = e
    },
    addFileSource() {
      let file = this.uploadeFileMess.fileSelected
      let default_kwargs = {
        file_id: GenNonDuplicateID(8),
        file_name: this.uploadeFileMess.file_name,
        file_data_group: 'default',
        file_path: file.webkitRelativePath,
        file_type: file.type,
        file_describe: this.uploadeFileMess.file_describe
      }
      let formData = new FormData()
      formData.append('file', file)
      formData.append('query_type', 'add')
      Object.keys(default_kwargs).forEach(item => {
        formData.append(item, default_kwargs[item])
      })
      file_save(formData)
        .then(res => {
          console.log(res)
          this.fetchFileSource()
        })
        .catch(err => {
          console.log(err)
        })
    },
    fetchFileSource() {
      this.dbSourceFetching = true
      file_query()
        .then(res => {
          if (res.state == 0) {
            this.dbSource = res.result
            this.dbSourceFetching = false
          }
        })
        .catch(err => {
          console.log(err)
          this.dbSourceFetching = false
        })
    },
    deleteItem(item) {
      file_delete({ file_id: item.file_id, file_name: item.file_name })
        .then(res => {
          if (res.success == 'success') {
            this.dbSource = this.dbSource.filter(v => v.file_id != item.file_id)
          }
          console.log(res)
        })
        .catch(err => {
          console.log(err)
        })
    },
    openLookupDialog(item) {
      this.lookupItem = item
      this.lookupSourceDialog = true
    }
  },
  created() {
    this.fetchFileSource()
  }
}
</script>

<style lang="less" scoped>
@import url('./datamanage.less');
.databaseSource {
  height: 60px;
  width: 60px;
}
</style>

<template>
  <div>
    <!-- <v-card
      class="text-h5 d-flex justify-space-between align-center pl-6"
      height="50"
      style="width: 100%"
    >
      模型管理
    </v-card>-->

    <div class="mx-5 my-1 d-flex justify-space-between align-center topBar">
      <div>
        <slot name="breadcrumb"></slot>
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
            <v-btn color="teal darken-1" dark v-bind="attrs" v-on="on"> <v-icon left>mdi-plus</v-icon>创建流程图 </v-btn>
          </template>
          <v-card>
            <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">创建流程图</v-card-title>
            <div class="mx-3 my-2">
              <v-text-field dense outlined label="模型名称" v-model="newModelName"></v-text-field>
              <v-text-field dense outlined label="描述" v-model="newModelMessage"></v-text-field>
            </div>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="addModelDialog = false">取消</v-btn>
              <v-btn color="primary" @click="openNewModel('MODEL')">确定</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn outlined color="error">批量删除</v-btn>
        <v-btn outlined><v-icon left>mdi-refresh</v-icon>刷新</v-btn>
      </div>
    </div>

    <div class="modelTable px-2">
      <v-data-table
        v-model="selected"
        @page-count="pageCount = $event"
        :headers="modelHeaders"
        :items="desserts"
        :single-select="singleSelect"
        disable-sort
        item-key="graph_id"
        :page.sync="page"
        show-select
        :loading="dataLifetching"
        loading-text="数据加载中"
        hide-default-footer
      >
        <template v-slot:top>
          <v-dialog v-model="editDialog" max-width="500px">
            <v-card>
              <v-card-title>
                <span class="text-h5">编辑模型</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field v-model="editedItem.model_name" label="模型名称"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col>
                      <v-text-field v-model="editedItem.model_id" label="描述"></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">取消</v-btn>
                <v-btn color="blue darken-1" text @click="save">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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
        </template>

        <template #item.create_time="{ item }">
          {{ getTimeStr(item.create_time) }}
        </template>
        <template #item.actions="{ item }">
          <div class="d-flex editBtns">
            <v-btn @click="enterViewModel(item, 'MODEL')" text color="primary" dark>模型编辑</v-btn>
            <v-btn @click="enterViewModel(item, 'MODEL')" text color="primary" dark>模型查看</v-btn>
            <v-btn text color="primary" @click="deleteItem(item)">
              删除
            </v-btn>
          </div>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary">
            <!-- @click="initialize" -->
            刷新
          </v-btn>
        </template>
      </v-data-table>
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </div>
</template>

<script>
import datalist from '../config/data.json'
import { GenNonDuplicateID, getTimeStr } from '@/common/until.js'
import { searchGraph, editGraph } from '@/request/apis/drawApi.js'
import editModelMixin from '@/mixins/editModel.js'

export default {
  mixins: [editModelMixin],
  data() {
    return {
      page: 1,
      pageCount: 10,
      itemsPerPage: 10,
      selected: [],
      singleSelect: false,
      modelHeaders: [
        {
          text: '模型名称',
          align: 'center',
          value: 'graph_name'
        },
        { text: '描述', align: 'center', value: 'graph_describe' },
        { text: '创建时间', align: 'center', value: 'create_time' },
        { text: '操作', align: 'center', value: 'actions' }
      ],
      desserts: [],
      defaultItem: {
        graph_param: {
          graph_name: '',
          graph_id: '',
          graph_message: '',
          graph_createTime: '',
          graph_type: ''
        }
      },
      dataLifetching: false,
      searchVal: ''
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.editDialog = true
    },
    batchDelete() {
      let selectedArr = this.selected
    },
    close() {
      this.editDialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem)
      } else {
        this.desserts.push(this.editedItem)
      }
      this.close()
    },
    fetchModelList() {
      this.dataLifetching = true
      searchGraph({ graph_type: 1, graph_state: 0 })
        .then(res => {
          if (res.save_state == 'success') {
            this.desserts = res.models
            this.dataLifetching = false
          } else {
            this.$message.alertMessage(res.failed_info)
            this.dataLifetching = false
          }
        })
        .catch(err => {
          console.log(err)
          this.dataLifetching = false
        })
    },
    search() {},
    getTimeStr: getTimeStr
  },
  created() {
    this.fetchModelList()
  }
}
</script>

<style lang="less" scoped>
.topBar {
  min-height: 52px;
  button {
    margin-left: 10px;
  }
}
.editBtns {
  button {
    margin-left: 20px;
  }
}
</style>

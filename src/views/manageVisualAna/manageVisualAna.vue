<template>
  <div>
    <div class="mx-5 my-1 d-flex justify-space-between align-center topBar">
      <div>
        <slot name="breadcrumb"></slot>
      </div>
      <div class="d-flex">
        <v-dialog v-model="visualAnaDialog" width="500">
          <template #activator="{ on, attrs }">
            <v-btn color="teal darken-1" dark v-bind="attrs" v-on="on"> <v-icon left>mdi-plus</v-icon>新建可视化 </v-btn>
          </template>
          <v-card>
            <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">新建可视化</v-card-title>
            <div class="mx-3 my-2 ">
              <v-text-field label="可视化名称" v-model="newModelSetting.title" outlined dense></v-text-field>
            </div>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#E7E7E7" @click="visualAnaDialog = false">取消</v-btn>
              <v-btn color="primary" @click="NewVisAna('MODEL')">确定</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn outlined color="error">批量删除</v-btn>
      </div>
    </div>

    <div class="modelTable px-2">
      <v-data-table
        v-model="selected"
        @page-count="pageCount = $event"
        :headers="modelHeaders"
        :items="dataVItems"
        :single-select="singleSelect"
        show-select
        disable-sort
        item-key="model_id"
        :page.sync="page"
        :loading="dataLifetching"
        loading-text="数据加载中"
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

        <template #item.actions="{ item }">
          <div class="d-flex editBtns">
            <v-btn @click="enterDatav(item)" color="teal darken-1" dark>编辑模型</v-btn>
            <v-btn @click="previewCharts(item)" color="teal darken-1" dark>预览效果</v-btn>
            <v-btn color="teal darken-1" dark>编辑</v-btn>
            <v-btn color="teal darken-1" dark>删除</v-btn>
          </div>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary">
            <!-- @click="initialize" -->
            刷新
          </v-btn>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
        <v-text-field
          :value="itemsPerPage"
          label="Items per page"
          type="number"
          min="-1"
          v-if="false"
          max="15"
          @input="itemsPerPage = parseInt($event, 10)"
        ></v-text-field>
      </div>
    </div>
  </div>
</template>

<script>
import datalist from '../config/data.json'
import { GenNonDuplicateID } from '@/common/until.js'
import { searchGraph, editGraph } from '@/request/apis/drawApi.js'

export default {
  data() {
    return {
      page: 1,
      pageCount: 10,
      itemsPerPage: 10,
      selected: [],
      singleSelect: false,
      visualAnaDialog: false,
      modelHeaders: [
        {
          text: '可视化名称',
          align: 'start',
          value: 'model_info.globalSetting.title'
        },
        { text: '创建时间', value: 'createTime' },
        { text: '最后修改时间', value: 'lastChangeTime' },
        { text: '操作', value: 'actions' }
      ],
      dataVItems: [
        {
          model_name: '数据可视化示例一',
          model_id: 1,
          createTime: '2020-08-09',
          lastChangeTime: '2020-08-09',
          model_info: {
            draggableItems: [
              {
                id: '2hciksdeklq000',
                width: 754,
                height: 343,
                x: 26,
                y: 701,
                active: false,
                type: '轮播表',
                flag: '2hciksdeklq000',
                option: {
                  icon: 'chartLine',
                  isNotChart: true,
                  config: {
                    data: [
                      ['行1列1', '行1列2', '行1列3'],
                      ['行2列1', '行2列2', '行2列3'],
                      ['行3列1', '行3列2', '行3列3'],
                      ['行4列1', '行4列2', '行4列3'],
                      ['行5列1', '行5列2', '行5列3'],
                      ['行6列1', '行6列2', '行6列3'],
                      ['行7列1', '行7列2', '行7列3'],
                      ['行8列1', '行8列2', '行8列3'],
                      ['行9列1', '行9列2', '行9列3'],
                      ['行10列1', '行10列2', '行10列3']
                    ]
                  },
                  compName: 'dv-scroll-board'
                },
                borderStyle: 'DvBorderBox12'
              },
              {
                id: '3vnrk36aw54000',
                width: 879,
                height: 200,
                x: 1019,
                y: 849,
                active: false,
                type: '胶囊图',
                flag: '3vnrk36aw54000',
                option: {
                  icon: 'chartLine',
                  isNotChart: true,
                  config: {
                    data: [
                      {
                        name: '南阳',
                        value: 167
                      },
                      {
                        name: '周口',
                        value: 67
                      },
                      {
                        name: '漯河',
                        value: 123
                      },
                      {
                        name: '郑州',
                        value: 55
                      },
                      {
                        name: '西峡',
                        value: 98
                      }
                    ]
                  },
                  compName: 'dv-capsule-chart'
                },
                borderStyle: 'DvBorderBox12'
              },
              {
                id: '1xp63fz8sydc00',
                width: 797,
                height: 259,
                x: 21,
                y: 251,
                active: false,
                type: '散点图',
                flag: '1xp63fz8sydc00',
                option: {
                  xAxis: {},
                  yAxis: {},
                  title: {
                    text: '散点图示例',
                    subtext: 'Fake Data',
                    left: 'center'
                  },
                  series: [
                    {
                      symbolSize: 20,
                      data: [
                        [10, 8.04],
                        [8.07, 6.95],
                        [13, 7.58],
                        [9.05, 8.81],
                        [11, 8.33],
                        [14, 7.66],
                        [13.4, 6.81],
                        [10, 6.33],
                        [14, 8.96],
                        [12.5, 6.82],
                        [9.15, 7.2],
                        [11.5, 7.2],
                        [3.03, 4.23],
                        [12.2, 7.83],
                        [2.02, 4.47],
                        [1.05, 3.33],
                        [4.05, 4.96],
                        [6.03, 7.24],
                        [12, 6.26],
                        [12, 8.84],
                        [7.08, 5.82],
                        [5.02, 5.68]
                      ],
                      type: 'scatter'
                    }
                  ],
                  icon: 'chartLine'
                },
                borderStyle: 'DvBorderBox5'
              },
              {
                id: '1oue4v4437ts00',
                width: 846,
                height: 225,
                x: 1029,
                y: 500,
                active: false,
                type: '柱形图',
                flag: '1oue4v4437ts00',
                option: {
                  darkMode: 'auto',
                  title: {
                    text: 'Referer of a Website',
                    subtext: 'Fake Data',
                    left: 'center'
                  },
                  xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                  },
                  yAxis: {
                    type: 'value'
                  },
                  series: [
                    {
                      data: [150, 230, 224, 218, 135, 147, 260],
                      type: 'bar',
                      showBackground: true,
                      backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                      }
                    }
                  ],
                  icon: 'chartBar'
                },
                borderStyle: 'DvBorderBox12'
              },
              {
                id: '5obr80efzow000',
                width: 607,
                height: 324,
                x: 1267,
                y: 106,
                active: false,
                type: '饼状图',
                flag: '5obr80efzow000',
                option: {
                  title: {
                    text: '数据统计',
                    subtext: 'Fake Data',
                    left: 'center'
                  },
                  tooltip: {
                    trigger: 'item'
                  },
                  series: [
                    {
                      name: 'Access From',
                      type: 'pie',
                      radius: '40%',
                      data: [
                        {
                          value: 1048,
                          name: 'Search Engine'
                        },
                        {
                          value: 735,
                          name: 'Direct'
                        },
                        {
                          value: 580,
                          name: 'Email'
                        },
                        {
                          value: 484,
                          name: 'Union Ads'
                        },
                        {
                          value: 300,
                          name: 'Video Ads'
                        }
                      ],
                      emphasis: {
                        itemStyle: {
                          shadowBlur: 10,
                          shadowOffsetX: 0,
                          shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                      }
                    }
                  ],
                  icon: 'chartPie'
                },
                borderStyle: 'DvBorderBox12'
              }
            ],
            globalSetting: {
              themeBgColor: '',
              themeBgImage: 'http://yuanbaoshuju.com/bigscreen/14/img/bg01.png',
              bgModeSelc: 'image',
              editAreaSize: {
                w: 1920,
                h: 1080
              },
              title: '数据可视化示例一'
            }
          }
        }
      ],
      editedIndex: -1,
      editedItem: {
        graph_param: {
          graph_name: '',
          graph_id: '',
          graph_message: '',
          graph_createTime: '',
          graph_type: ''
        }
      },
      dialogDelete: false,
      editDialog: false,
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
      searchVal: '',
      newModelSetting: {
        title: ''
      }
    }
  },
  methods: {
    NewVisAna() {
      this.$router.push({ name: '创建可视化', params: this.newModelSetting })
    },
    editItem(item) {
      this.editedIndex = this.dataVItems.indexOf(item)
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
    deleteItemConfirm() {
      this.dataVItems.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    deleteItem(item) {
      this.editedIndex = this.dataVItems.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.dataVItems[this.editedIndex], this.editedItem)
      } else {
        this.dataVItems.push(this.editedItem)
      }
      this.close()
    },
    previewCharts(item) {
      const { draggableItems, globalSetting } = item.model_info
      window.localStorage.setItem('chartsItem', JSON.stringify({ draggableItems, globalSetting }))
      const { href } = this.$router.resolve({
        name: 'previewChartsTest'
      })
      window.open(
        href,
        '_blank',
        `menubar=no,toolbar=no,status=no,scrollbars=false,height=${window.screen.availHeight - 30},width=${window.screen.availWidth -
          10},location=no,top=0,left=0`
      )
    },
    fetchModelList() {
      this.dataLifetching = true
      searchGraph({ graph_type: 1, graph_state: 0 })
        .then(res => {
          if (res.save_state == 'success') {
            this.dataVItems = res.models
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
    enterDatav(item) {
      this.$router.push({
        name: '创建可视化',
        params: {
          modelInfo: item
        }
      })
    },
    search() {}
  },
  created() {
    // this.fetchModelList();
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

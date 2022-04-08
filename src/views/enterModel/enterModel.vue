<template>
  <div>
    <!-- Page Header -->
    <v-card class="editToolbar d-flex align-center justify-end my-1" elevation="0">
      <v-card-title style="position: absolute; left: 0">
        模型编辑
        <!-- <slot name="breadcrumb"></slot> -->
      </v-card-title>
      <div class="mainCtrl mr-10">
        <v-btn class="ml-10 teal darken-1" @click="backToEdit" dark>返回模型管理</v-btn>
      </div>
      <div></div>
    </v-card>
    <div class="flow_region">
      <!-- <div v-for="item in nodeTypeList" :key="item.type" class="node" draggable="true" @dragstart="drag($event, item)">
          <div class="log">
            <img :src="item.logImg" alt="">
          </div>
          <div class="name">{{item.typeName}}</div>
      </div>-->
      <!-- Left Aside -->
      <v-navigation-drawer v-model="leftBarVis" :absolute="false" :hide-overlay="true" :stateless="true">
        <v-list nav dense>
          <v-list-group v-for="item in listItem" :key="item.node_type" v-model="item.active" no-action>
            <template #prependIcon>
              <v-icon color="#0D47A1">{{ item.active ? 'mdi-database-settings' : 'mdi-database' }}</v-icon>
            </template>
            <template #activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.node_type"></v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item
              v-for="child in item.items"
              :disabled="child.disabled"
              :key="child.node_params.node_type"
              draggable="true"
              @dragstart="drag($event, child)"
              class="leftDragItem"
            >
              <v-icon color="#0D47A1">mdi-database</v-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <div class="leftDragTitle">
                    {{
                      getNameByNodeType(child.node_params.node_type)
                        ? getNameByNodeType(child.node_params.node_type)
                        : child.node_params.node_type
                    }}
                  </div>
                  <v-icon class="float-right">mdi-drag-variant</v-icon>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-navigation-drawer>

      <div id="flowWrap" ref="flowWrap" class="flow-wrap" @drop="drop($event)" @dragover="allowDrop($event)">
        <div class="graphEditTool d-flex justify-space-between align-center elevation-1">
          <div class="text-h5 ml-2" style="color: #00695c;">{{ data.graph_param.graph_name }}</div>
          <v-btn-toggle class="mr-2">
            <v-btn>撤销</v-btn>
            <v-btn>还原</v-btn>
            <v-btn @click="goSaveGraph"> <v-icon dark color="blue" class>mdi-download-box</v-icon>保存 </v-btn>
            <v-btn @click="runAllGraph"> <v-icon dark color="blue" class>mdi-play-box</v-icon>执行 </v-btn>
          </v-btn-toggle>
        </div>
        <div id="flow">
          <div
            v-show="auxiliaryLine.isShowXLine"
            class="auxiliary-line-x"
            :style="{
              width: auxiliaryLinePos.width,
              top: auxiliaryLinePos.y + 'px',
              left: auxiliaryLinePos.offsetX + 'px'
            }"
          ></div>
          <div
            v-show="auxiliaryLine.isShowYLine"
            class="auxiliary-line-y"
            :style="{
              height: auxiliaryLinePos.height,
              left: auxiliaryLinePos.x + 'px',
              top: auxiliaryLinePos.offsetY + 'px'
            }"
          ></div>
          <v-dialog v-model="showDelDialog">
            <v-card>
              <v-card-text>确定要删除该连接线吗？</v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="showDelDialog = false">I accept</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <flowNode
            ref="nodeItems"
            v-for="item in data.nodeList"
            :id="item.node_params.node_id"
            :key="item.node_params.node_id"
            :node="item"
            @setNodeName="setNodeName"
            @deleteNode="deleteNode"
            @changeLineState="changeLineState"
            @ctlRightOverLay="ctlRightOverLay"
            @getParentParams="getParentParams"
          ></flowNode>
        </div>
      </div>

      <v-navigation-drawer
        :hide-overlay="true"
        v-model="rightOverlay.active"
        absolute
        right
        :stateless="true"
        width="490px"
        :expand-on-hover="false"
        class="pt-14 rightOverlay"
      >
        <template v-slot:prepend>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="text-body-1">
                <div class="titleComp">
                  {{
                    getNameByNodeType(rightOverlay.info.node_params.node_type)
                      ? getNameByNodeType(rightOverlay.info.node_params.node_type)
                      : rightOverlay.info.node_params.node_type
                  }}
                </div>
              </v-list-item-title>
            </v-list-item-content>
            <div class="d-flex justify-center align-center">
              <v-btn @click="rightOverlay.active = false" color="error">关闭</v-btn>
              <div class="editBtn" v-if="false">
                <v-btn @click="reloadData(null)" color="success" class="mx-5">回显数据</v-btn>
                <v-file-input hide-input truncate-length="25" @change="loadFile" accept="application/json" class="mx-5"></v-file-input>
              </div>
            </div>
          </v-list-item>
          <v-list-item>
            <v-tabs v-model="rightOverlayTabs" @change="rightOverylayTabsChange" class="tabsCtl">
              <v-tab>基本数据</v-tab>
              <v-tab>执行结果</v-tab>
              <v-tab v-if="!isETLPage">图表</v-tab>
              <v-tab v-if="!isETLPage">3d图表</v-tab>
            </v-tabs>
          </v-list-item>
        </template>
        <div class="rightTabs">
          <div class="tabItems">
            <v-tabs-items v-model="rightOverlayTabs" class="mx-4">
              <v-tab-item class="pt-4">
                <v-text-field v-model="rightOverlay.info.node_params.node_name" solo dense>
                  <template #prepend>
                    <div class="text-h6 rOverlayTit">节点名称:</div>
                  </template>
                </v-text-field>
                <v-text-field v-model="rightOverlay.info.node_params.message" disabled solo dense>
                  <template #prepend>
                    <div class="text-h6 rOverlayTit">帮助信息:</div>
                  </template>
                </v-text-field>
                <v-switch v-model="rightOverlay.info.train_params.submit_result" label="节点是否返回节点计算结果"></v-switch>
                <v-text-field
                  v-if="rightOverlay.info.node_result"
                  v-model="rightOverlay.info.node_result.addtional_node_info"
                  disabled
                  solo
                  dense
                >
                  <template #prepend>
                    <div class="text-h6 rOverlayTit">计算结果:</div>
                  </template>
                </v-text-field>
                <v-expansion-panels :accordion="true">
                  <v-expansion-panel>
                    <v-expansion-panel-header color="#daeaf6">train_params</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list>
                        <v-list-item v-for="(v, index) in rightOverlay.info.train_params" :key="index">
                          <v-list-item-content>{{ index }}:</v-list-item-content>
                          <v-list-item-content>{{ v }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header color="#daeaf6">op_params</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list>
                        <v-list-item v-for="(v, index) in rightOverlay.info.op_params" :key="index">
                          <v-list-item-content>{{ index }}:</v-list-item-content>
                          <v-list-item-content>{{ v }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header color="#daeaf6">resource_params</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list>
                        <v-list-item v-for="(v, index) in rightOverlay.info.resource_params" :key="index">
                          <v-list-item-content>{{ index }}:</v-list-item-content>
                          <v-list-item-content>{{ v }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                  <v-expansion-panel>
                    <v-expansion-panel-header color="#daeaf6">addtional_node_info</v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-list v-if="rightOverlay.info.node_result">
                        <v-list-item v-for="(v, index) in rightOverlay.info.node_result.addtional_node_info" :key="index">
                          <v-list-item-content>{{ index }}:</v-list-item-content>
                          <v-list-item-content>{{ v }}</v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

                <v-list dense v-if="false">
                  <v-list-item v-for="(item, index) in rightOverlay.info" :key="index">
                    <template v-if="typeof item == 'object'">
                      <v-expansion-panels :accordion="true">
                        <v-expansion-panel>
                          <v-expansion-panel-header color="#daeaf6">
                            {{ index }}
                          </v-expansion-panel-header>
                          <v-expansion-panel-content>
                            <v-list>
                              <v-list-item v-for="(v, index) in item" :key="index">
                                <v-list-item-content>{{ index }}:</v-list-item-content>
                                <v-list-item-content>{{ v }}</v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </template>
                    <template v-else>
                      <v-list-item-icon>{{ index }}:</v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{ item }}</v-list-item-title>
                      </v-list-item-content>
                    </template>
                  </v-list-item>
                </v-list>
              </v-tab-item>
              <v-tab-item>
                <v-data-table
                  :headers="headers"
                  :items="rightOverlay.info.node_result ? rightOverlay.info.node_result.X : []"
                  :items-per-page="10"
                  class="elevation-1"
                >
                  <template #item="{ item }">
                    <tr>
                      <td v-for="(chdItem, index) in item" :key="index">{{ item[index] }}</td>
                    </tr>
                  </template>
                </v-data-table>
                <!-- <template #item.one="{ item }">
                    {{item[0]}}
                  </template>
                  <template #item.two="{ item }">
                    {{item[1]}}
                  </template>
                  <template #item.three="{ item }">
                    {{item[2]}}
                  </template>
                  <template #item.four="{ item }">
                    {{item[3]}}
                  </template>
                  <template #item.five="{ item }">
                    {{item[4]}}
                </template>-->
              </v-tab-item>
              <v-tab-item>
                <Gener-Charts :exeResult="json3d.node_result.X"></Gener-Charts>
              </v-tab-item>
              <v-tab-item>
                <v-card-title class="my-0 text-h5">数据分析3d散点图</v-card-title>
                <div id="scatter3D"></div>
              </v-tab-item>
            </v-tabs-items>
          </div>
        </div>
      </v-navigation-drawer>
    </div>
  </div>
</template>

<script>
import { nodeTypeList } from '../config/init'
import { jsPlumb } from 'jsplumb'
import { jsplumbSetting, jsplumbConnectOptions, jsplumbSourceOptions, jsplumbTargetOptions } from '../config/commonConfig'
import methods from '../config/methods'
import flowNode from '../components/node-item'
import jsonData from '../config/data copy.json'
import json3d from '../config/json3d.json'
import leftListItem from '../config/leftListItem.json'
import leftListItem2 from '../config/leftListItem2.json'
import { saveGraph, runGraph } from '@/request/apis/drawApi.js'
import { GenNonDuplicateID } from '@/common/until.js'
import GenerCharts from '@/views/components/rightOverlayEcharts/index'

export default {
  name: 'FlowEdit',
  components: {
    flowNode,
    GenerCharts
  },
  data() {
    return {
      jsPlumb: null,
      currentItem: null,
      // nodeTypeList: nodeTypeList,
      // nodeTypeObj: {},
      data: {
        graph_param: {
          graph_name: 'demo_graph',
          graph_id: null,
          graph_type: this.isETLPage ? 0 : 1
        },
        nodeList: [],
        lineList: []
      },
      jsplumbSetting: jsplumbSetting,
      jsplumbConnectOptions: jsplumbConnectOptions,
      jsplumbSourceOptions: jsplumbSourceOptions,
      jsplumbTargetOptions: jsplumbTargetOptions,
      auxiliaryLine: { isShowXLine: false, isShowYLine: false }, //对齐辅助线是否显示
      auxiliaryLinePos: {
        width: '100%',
        height: '100%',
        offsetX: 0,
        offsetY: 0,
        x: 20,
        y: 20
      },
      commonGrid: [5, 5], //节点移动最小距离
      selectModuleFlag: false, //多选标识
      rectAngle: {
        px: '', //多选框绘制时的起始点横坐标
        py: '', //多选框绘制时的起始点纵坐标
        left: 0,
        top: 0,
        height: 0,
        width: 0
      },
      selectedList: [],
      listItem: null,
      listTypeMap: [
        ['fitow_csv_loader', 'CSV文件读取'],
        ['fitow_xlsx_loader', 'EXCEL文件读取'],
        ['fitow_standard_scaler', '01标准化'],
        ['fitow_min_max_scaler', '极值标准化'],
        ['fitow_data_slicer', '数据切片'],
        ['fitow_linear_regression', '线性回归算法'],
        ['fitow_kmeans', 'Kmeans聚类'],
        ['fitow_pca', 'PCA降维'],
        ['fitow_tsne', 'TSNE降维'],
        ['fitow_svm_regression', 'SVM回归'],
        ['fitow_status_describe', '描述性统计分析'],
        ['fitow_etl_loader', 'ETL算子']
      ],
      listMap: {},
      leftBarVis: true,
      showDelDialog: false,
      rightOverlay: {
        info: {
          node_params: {},
          train_params: {},
          node_result: {
            X: null,
            Y: null
          }
        },
        active: false
      },
      rightOverlayTabs: null,
      chartsOpt: {
        pieOption: {
          title: {
            text: 'Referer of a Website',
            subtext: 'Fake Data',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          /* legend: {
                  orient: 'vertical',
                  left: 'left'
                }, */
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '40%',
              data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        basicBarOpt: {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }
          ]
        },
        scatter3Dopt: {
          grid3D: {},
          xAxis3D: {
            type: 'category'
          },
          yAxis3D: {
            name: 'Y轴文字',
            itemStyle: {
              borderColor: '#DC143C',
              backgroundColor: '#DC143C'
            }
          },
          zAxis3D: {
            itemStyle: {
              borderColor: '#DC143C',
              backgroundColor: '#DC143C'
            }
          },
          visualMap: {
            calculable: true,
            max: 3,
            // 维度的名字默认就是表头的属性名
            dimension: 1,
            inRange: {
              color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026'
              ]
            }
          },
          dataset: {
            dimensions: ['X轴', 'Y轴', 'Z轴'],
            source: json3d.node_result.X
          },
          series: [
            {
              type: 'scatter3D',
              symbolSize: 3.5,
              //数据点的大小
              encode: {
                x: 0,
                y: 1,
                z: 2,
                tooltip: {
                  backgroundColor: 'rgba(250,50,50,0.7)',
                  trigger: 'item'
                }
              },
              itemStyle: {
                // borderWidth: 1,
                // borderColor: 'rgba(255,255,255,0.8)'//边框样式
              }
            }
          ]
        }
      },
      json3d: json3d,
      chartInit: {
        scatter3DChart: false,
        pieChart: false,
        barChart: false
      },
      headers: [],
      testObj: {},
      initialModelData: '',
      isETLPage: null
    }
  },
  created() {
    this.listMap = new Map(this.listTypeMap)

    this.jsPlumb = jsPlumb.getInstance()
    let modelInfo = this.$route.params.modelInfo
    let sessionModel = window.sessionStorage.getItem('modelInfo')
    if (modelInfo) {
      this.reloadData(modelInfo)
      this.initialModelData = JSON.parse(JSON.stringify(modelInfo))
    } else if (sessionModel) {
      this.reloadData(JSON.parse(sessionModel))
    }
    window.onbeforeunload = () => {
      window.sessionStorage.setItem('modelInfo', JSON.stringify(this.data))
    }
    this.isETLPage = this.$route.params.pageType == 'ETL'
    this.listItem = this.isETLPage ? leftListItem2.listitems : leftListItem.listitems
    this.data.graph_param.graph_type = this.isETLPage ? 0 : 1
  },
  mounted() {
    // this.initNodeTypeObj()
    this.initNode()
    this.fixNodesPosition()
    this.$nextTick(() => {
      this.init()
    })

    let draggableEl = document.querySelectorAll('.v-treeview-node__root')
    draggableEl.forEach(v => (v.draggable = true))
  },
  destroyed() {
    window.onbeforeunload = null
    window.sessionStorage.removeItem('modelInfo')
  },
  methods: {
    ...methods,
    //初始化类型 有指定类型的标签之类的可以启用
    /* initNodeTypeObj() {
      nodeTypeList.map(v => {
        this.nodeTypeObj[v.type] = v
      })
    }, */
    //将类型与json中的数据对应，push到要循环的nodelist
    initNode() {
      /* this.data.lineList = data.lineList
      data.nodeList.map(v => {
        this.data.nodeList.push(v)
      }) */
    },
    flowToJSON() {
      let body = JSON.stringify(this.data)
    },
    goSaveGraph() {
      /* let graphId = this.data.graph_param.graph_id
      if (!graphId) {
        this.data.graph_param.graph_id = GenNonDuplicateID(8)
      } */
      saveGraph(this.data)
        .then(res => {
          if (res.save_state == 'success') {
            this.$message.alertMessage('保存成功!')
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    reloadData(innerData) {
      if (!innerData) {
        innerData = jsonData
      }
      this.jsPlumb.reset()
      this.data.lineList = []
      this.data.nodeList = []
      //深拷贝json数据
      let dataD = JSON.parse(JSON.stringify(innerData))
      this.data = dataD
      /* this.data.lineList = dataD.lineList;
      dataD.nodeList.map(v => {
        this.data.nodeList.push(v)
      }) */
      this.fixNodesPosition()
      this.$nextTick(() => {
        this.init()
      })
    },
    loadFile(e) {
      let _this = this
      let readFile = new FileReader()
      readFile.readAsText(e, 'utf8')
      readFile.onload = function() {
        _this.reloadData(JSON.parse(this.result))
      }
    },
    rightOverylayTabsChange(val) {
      if (val == 2 && !this.chartInit.barChart && !this.chartInit.pieChart) {
        setTimeout(() => {
          let pie = document.getElementById('pieChart')
          let basicBar = document.getElementById('basicBar')
          this.chartInit.pieChart = this.$echarts.init(pie)
          this.chartInit.barChart = this.$echarts.init(basicBar)
          this.chartInit.pieChart.setOption(this.chartsOpt.pieOption)
          this.chartInit.barChart.setOption(this.chartsOpt.basicBarOpt)
        }, 0)
      } else if (val == 3 && !this.chartInit.scatter3DChart) {
        setTimeout(() => {
          let scatter3D = document.getElementById('scatter3D')
          this.chartInit.scatter3DChart = this.$echarts.init(scatter3D)
          this.chartInit.scatter3DChart.setOption(this.chartsOpt.scatter3Dopt)
        }, 0)
      }
    },
    getParentParams(nodeId) {
      let parentIds = []
      let parentCollect = []
      this.data.lineList.forEach(v => {
        if (v.to == nodeId) {
          parentIds.push(v.from)
        }
      })
      this.data.nodeList.forEach(v => {
        if (parentIds.indexOf(v.node_params.node_id) > -1) {
          parentCollect.push(v)
        }
      })
      return parentCollect
    },
    backToEdit() {
      let modelChange = this.checkIfModelChange()
      if (modelChange) {
        console.log('modelHasChanged!!!')
      }
      this.$router.push({ path: this.isETLPage ? '/mangageEtl' : '/' })
    },
    checkIfModelChange() {
      return JSON.stringify(this.data) === JSON.stringify(this.initialModelData)
    },
    runAllGraph() {
      runGraph(this.data)
        .then(res => {
          if (res.success == 'OK') {
            this.$message.alertMessage('执行成功!')
          } else {
            console.log(res)
          }
        })
        .catch(err => {
          console.log(err)
        })
      let nodeItems = this.$refs.nodeItems
      if (nodeItems) {
        nodeItems.forEach(v => {
          v.nodeStatus = 2
        })
        setTimeout(() => {
          nodeItems.forEach(v => {
            v.connectToDatabase()
            // v.getParentParams(v.node.node_params.node_id);
          })
        }, 2000)
      } else {
        this.$message.alertMessage('当前没有可执行的结点')
      }
    },
    getNameByNodeType(type) {
      return this.listMap.get(type)
    },
    getHeaders() {
      let tableHeader = null
      let header = null
      console.log()
      this.rightOverlay.info.node_result
        ? (tableHeader = this.rightOverlay.info.node_result.addtional_node_info.column_names
            ? this.rightOverlay.info.node_result.addtional_node_info.column_names
            : null)
        : ''
      if (tableHeader) {
        let header = tableHeader.map(v => {
          return {
            text: v,
            align: 'center'
          }
        })
      }
      return header ? header : []
    }
  }
}
</script>

<style lang="less" scoped>
.editBtn {
  display: flex;
  position: absolute;
  right: 20px;
  width: 400px;
}
.editToolbar {
  height: 40px;
  z-index: 2;
  .mainCtrl {
    height: 100%;
    display: flex;
    align-items: center;
  }
}
.flow_region {
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  position: absolute;
  .nodes-wrap {
    width: 150px;
    height: 100%;
    border-right: 1px solid #ccc;
    .node {
      display: flex;
      height: 40px;
      width: 80%;
      margin: 5px auto;
      border: 1px solid #ccc;
      line-height: 40px;
      &:hover {
        cursor: grab;
      }
      &:active {
        cursor: grabbing;
      }
      .log {
        width: 40px;
        height: 40px;
      }
      .name {
        width: 0;
        flex-grow: 1;
      }
    }
  }

  .flow-wrap {
    height: 100%;
    position: relative;
    overflow: hidden;
    outline: none !important;
    flex-grow: 1;
    // background-image: url("../assets/point.png");
    background: #daeaf6;
    .graphEditTool {
      height: 62px;
      background-color: #ffffff;
      position: relative;
      z-index: 2;
    }

    #flow {
      position: relative;
      width: 100%;
      height: 100%;
      .auxiliary-line-x {
        position: absolute;
        border: 0.5px dashed #2ab1e8;
        z-index: 9999;
      }
      .auxiliary-line-y {
        position: absolute;
        border: 0.5px dashed #2ab1e8;
        z-index: 9999;
      }
    }
  }
}
</style>

<style lang="less">
.jtk-connector.active {
  z-index: 9999;
  path {
    stroke: #150042;
    stroke-width: 1.5;
    animation: ring;
    animation-duration: 3s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    stroke-dasharray: 5;
  }
}
@keyframes ring {
  from {
    stroke-dashoffset: 50;
  }
  to {
    stroke-dashoffset: 0;
  }
}
#pieChart {
  height: 320px;
  width: 350px;
  margin: 0 auto;
}
#basicBar {
  #pieChart();
}
#scatter3D {
  height: 400px;
  width: 400px;
  margin: 0 auto;
}
.rightTabs {
  .tabItems {
  }
}
.rOverlayTit {
  margin-right: 20px;
  white-space: nowrap;
}
.leftDragItem {
  border: dashed 2px gray;
  padding-left: 0px !important;
  margin-left: 64px;
  .leftDragTitle {
    max-width: 100px;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .v-list-item__title {
    line-height: 24px !important;
  }
}
</style>

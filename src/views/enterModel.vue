<template>
  <div>
    
      <v-dialog v-model="showDelDialog">
        <v-card>
        <v-card-text>
          确定要删除该连接线吗？
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="showDelDialog = false"
          >
            I accept
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>

    <div class="flow_region">
      <div >
        <!-- <div v-for="item in nodeTypeList" :key="item.type" class="node" draggable="true" @dragstart="drag($event, item)">
          <div class="log">
            <img :src="item.logImg" alt="">
          </div>
          <div class="name">{{item.typeName}}</div>
        </div> -->
      <v-navigation-drawer
            v-model="leftBarVis"
            :absolute="false"
            :hide-overlay="true"
            :stateless="true"
          >
          
            <v-list nav dense >
              <v-list-group
                v-for="item in listItem"
                :key="item.node_type"
                v-model="item.active"
                no-action
              >
              <template #prependIcon>
                <v-icon color="#f5c16c">{{item.active ? 'mdi-folder-open' : 'mdi-folder'}}</v-icon>
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
                >

                    <v-icon color="#f5c16c">mdi-folder</v-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="child.node_params.node_type"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
       </v-navigation-drawer>

      </div>
      <div id="flowWrap" ref="flowWrap" class="flow-wrap" @drop="drop($event)" @dragover="allowDrop($event)">
        <v-card class="editToolbar d-flex align-center justify-end"  elevation="1">
          <v-card-title class="text-h5 mx-3" style="position:absolute; left:0">模型编辑</v-card-title>
          <div class="mainCtrl mr-10">
            <v-btn class="mx-3" @click="flowToJSON"><v-icon dark color="blue" class="">mdi-download-box</v-icon>保存</v-btn>
            <v-btn class="mx-3"><v-icon dark color="blue" class="">mdi-play-box</v-icon>执行</v-btn>
            <v-btn class="ml-10" @click="backToEdit">返回模型管理</v-btn>
          </div>
          <div>
            </div>
        </v-card>
        <div id="flow">
          <div v-show="auxiliaryLine.isShowXLine" class="auxiliary-line-x" :style="{width: auxiliaryLinePos.width, top:auxiliaryLinePos.y + 'px', left: auxiliaryLinePos.offsetX + 'px'}"></div>
          <div v-show="auxiliaryLine.isShowYLine" class="auxiliary-line-y" :style="{height: auxiliaryLinePos.height, left:auxiliaryLinePos.x + 'px', top: auxiliaryLinePos.offsetY + 'px'}"></div>
          
          <flowNode v-for="item in data.nodeList" :id="item.node_params.node_id" :key="item.node_params.node_id" :node="item" @setNodeName="setNodeName" @deleteNode = "deleteNode" @changeLineState="changeLineState" @ctlRightOverLay="ctlRightOverLay" @getParentParams="getParentParams">

          </flowNode>
        
        </div>
      </div>

      <v-navigation-drawer
            :hide-overlay="true"
            v-model="rightOverlay.active"
            absolute
            right
            :stateless="true"
            width="600"
            :expand-on-hover="false"
            height="94%"
            class="pt-10"
          >
          <template v-slot:prepend>
            <v-list-item two-line>
              <v-list-item-avatar color="#D1DBBD">
                <v-icon>mdi-pencil</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="text-h4">{{rightOverlay.info.node_params.node_type}}</v-list-item-title>
                <v-list-item-subtitle>副标题</v-list-item-subtitle>
              </v-list-item-content>
              <div class="d-flex justify-center align-center" >
                  <v-btn
                    @click="rightOverlay.active = false "
                    color="error"
                    >
                    关闭
                    </v-btn>
                    <div class="editBtn" v-if="false">
                      <v-btn @click="reloadData(null)" color="success" class="mx-5">回显数据</v-btn>
                      <v-file-input hide-input truncate-length="25"  @change="loadFile" accept="application/json" class="mx-5"></v-file-input>
                    </div>
              </div>
            </v-list-item>
          </template>
              <v-tabs
                background-color="#e2ded3"
                color="#1a2639"
                v-model="rightOverlayTabs"
                @change="rightOverylayTabsChange"
                class="tabsCtl"
              >
                <v-tab>基本数据</v-tab>
                <v-tab>图表</v-tab>
                <v-tab>3d图表</v-tab>
              </v-tabs>
        <v-tabs-items v-model="rightOverlayTabs">
          <v-tab-item>
            <v-list dense>
              <v-list-item
                v-for="(item,index) in rightOverlay.info"
                :key="index"
              >
                  <template v-if="typeof item == 'object'">
                   <v-expansion-panels :accordion="true" >
                    <v-expansion-panel>
                      <v-expansion-panel-header color="#daeaf6">
                        {{index}}
                      </v-expansion-panel-header>
                      <v-expansion-panel-content>
                        <v-list>
                          <v-list-item v-for="(v,index) in item" :key="index">
                            <v-list-item-content>{{index}}:</v-list-item-content>
                            <v-list-item-content>{{v}}</v-list-item-content>
                          </v-list-item>
                        </v-list>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                    </v-expansion-panels>
                  </template>
                  <template v-else>
                    <v-list-item-icon>
                      {{index}}:
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{ item }}</v-list-item-title>
                    </v-list-item-content>
                  </template>
              </v-list-item>
            </v-list>
          </v-tab-item>
          <v-tab-item v-if="rightOverlay.info">
            <v-card height="400px" class="mx-2 my-2">
              <v-card-title class="my-0 text-h5">数据分析饼图</v-card-title>
              <div id="pieChart" ></div>
            </v-card>
            <v-card height="400px" class="mx-2 my-2">
              <v-card-title class="my-0 text-h5">数据分析柱形图</v-card-title>
              <div id="basicBar"></div>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card height="600px" class="mx-2 my-2">
              <v-card-title class="my-0 text-h5">数据分析3d折线图</v-card-title>
              <div id="scatter3D" ></div>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
       </v-navigation-drawer>
    </div>

    

    
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb"
import { nodeTypeList } from './config/init'
import { jsplumbSetting, jsplumbConnectOptions, jsplumbSourceOptions, jsplumbTargetOptions } from './config/commonConfig'
import methods from "./config/methods"
import jsonData from './config/data copy.json'
import flowNode from "./components/node-item"
import json3d from "./config/json3d.json"
export default {
  name: "FlowEdit",
  components: {
    flowNode
  },
  data() {
    return {
      jsPlumb: null,
      currentItem: null,
      nodeTypeList: nodeTypeList,
      nodeTypeObj: {},
      data: {
        graph_param: {
                graph_name: "demo_graph",
                graph_id: "graph_index_1",
                grap_type: "json_graph"
              },
        nodeList: [],
        lineList: []
      },
      selectedList: [],
      jsplumbSetting: jsplumbSetting,
      jsplumbConnectOptions: jsplumbConnectOptions,
      jsplumbSourceOptions: jsplumbSourceOptions,
      jsplumbTargetOptions: jsplumbTargetOptions,
      auxiliaryLine: { isShowXLine: false, isShowYLine: false},  //对齐辅助线是否显示
      auxiliaryLinePos: { width: '100%', height: '100%', offsetX: 0, offsetY: 0, x: 20, y: 20 },
      commonGrid: [5, 5], //节点移动最小距离
      selectModuleFlag: false, //多选标识
      rectAngle: {
        px: '',  //多选框绘制时的起始点横坐标
        py: '',  //多选框绘制时的起始点纵坐标
        left: 0,
        top: 0,
        height: 0,
        width: 0
      },
      listItem: [
        {
          action: 'mdi-ticket',
          items: [],
          node_type: '数据载入类',
        },
        {
          action: 'mdi-silverware-fork-knife',
          items: [
            { 
              node_params:{
                node_type: "根节点",
                message: "这是详情信息",
                node_name: "nodeName",
                submit: false,
                submit_result: false,
                last: true,
              },
              resource_params:[], 
              op_params: {}, 
              train_params: {
                  xls_file: "./client_demo/data/iris.xlsx", 
                  sheet:"", 
                  min_row:"", 
                  min_col:"", 
                  max_row:"", 
                  max_col:"" ,
                  additional_run_kwargs: {
                    submit_result: false 
                  },
                  predict_params: {},
              },
              
            },
            { 
              node_params:{
                node_type: "数据源",
                message: "这是详情信息",
                node_name: "nodeName",
                submit: true,
                submit_result: true,
                last: false,
              },
              resource_params:[], 
              op_params: {}, 
              train_params: {
                  xls_file: "./client_demo/data/iris.xlsx", 
                  sheet:"", 
                  min_row:"", 
                  min_col:"", 
                  max_row:"", 
                  max_col:"" ,
                  additional_run_kwargs: {
                    submit_result: false 
                  },
                  predict_params: {},
              },
              
            },
            { 
              node_params:{
                node_type: "普通数据",
                message: "这是详情信息",
                node_name: "nodeName",
                submit: false,
                submit_result: false,
                last: false,
              },
              resource_params:[], 
              op_params: {}, 
              train_params: {
                  xls_file: "./client_demo/data/iris.xlsx", 
                  sheet:"", 
                  min_row:"", 
                  min_col:"", 
                  max_row:"", 
                  max_col:"" ,
                  additional_run_kwargs: {
                    submit_result: false 
                  },
                  predict_params: {},
              },
            },
          ],
          node_type: '数据预处理',
        },
        {
          action: 'mdi-school',
          items: [],
          node_type: '机器学习算法',
        },
        {
          action: 'mdi-run',
          items: [],
          node_type: '统计学习类算法',
        },
        {
          action: 'mdi-content-cut',
          items: [],
          node_type: '办公室',
        },
        {
          action: 'mdi-tag',
          items: [],
          node_type: '促销活动',
        },
      ],
      leftBarVis:true,
      showDelDialog:false,
      rightOverlay:{
        info:{
          node_params:{}
        },
        active:false
      },
      rightOverlayTabs:null,
      chartsOpt:{
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
        scatter3Dopt:{
          grid3D: {},
          xAxis3D: {
            type: 'category'
          },
          yAxis3D: {},
          zAxis3D: {},
          dataset: {
            dimensions: [
              'X轴',
              'Y轴',
              'Z轴',
            ],
            source:json3d.node_result.Y
          },
          series: [
            {
              type: 'scatter3D',
              symbolSize: 3.5,
              encode: {
                x: 0,
                y: 1,
                z: 2,
                tooltip: 'tooltip文字'
              }
            }
          ]
        }
      }
    };
  },
  created(){
    this.jsPlumb = jsPlumb.getInstance();
    let modelInfo = this.$route.params.modelInfo;
    if (modelInfo) {
      this.reloadData(modelInfo);
    }
    console.log(json3d);

  },
  mounted() {
    // this.initNodeTypeObj()
    this.initNode()
    this.fixNodesPosition()
    this.$nextTick(() => {
      this.init();
    });

    let draggableEl = document.querySelectorAll('.v-treeview-node__root');
    draggableEl.forEach(v=>v.draggable = true);

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
    flowToJSON(){
      let body =  JSON.stringify(this.data);
      console.log(body);
    },
    reloadData(innerData){
      if(!innerData){
        innerData = jsonData;
      }
      this.jsPlumb.reset();
      this.data.lineList = [];
      this.data.nodeList = [];
      //深拷贝json数据
      let dataD = JSON.parse(JSON.stringify(innerData));
      this.data  = dataD;
      /* this.data.lineList = dataD.lineList;
      dataD.nodeList.map(v => {
        this.data.nodeList.push(v)
      }) */
    this.fixNodesPosition()
    this.$nextTick(() => {
      this.init();
    });
    },
    loadFile(e){
      let _this = this;
      let readFile = new FileReader();
      readFile.readAsText(e,'utf8');
      readFile.onload = function(){
        _this.reloadData(JSON.parse(this.result))
        }
    },
    rightOverylayTabsChange(val){
      if (val == 1) {
        setTimeout(() => {
          let pie = document.getElementById('pieChart')
          let basicBar = document.getElementById('basicBar')
          let scatter3D = document.getElementById('scatter3D')
          let pieChart = this.$echarts.init(pie);
          let barChart = this.$echarts.init(basicBar);
          let scatter3DChart = this.$echarts.init(scatter3D);
          pieChart.setOption(this.chartsOpt.pieOption);
          barChart.setOption(this.chartsOpt.basicBarOpt);
          scatter3DChart.setOption(this.chartsOpt.scatter3Dopt);
        }, 0);
      }
    },
    getParentParams(nodeId){
      let parentIds = []; 
      let parentCollect = []; 
      this.data.lineList.forEach((v)=>{
        if (v.to == nodeId) {
          parentIds.push(v.from)
        }
      })
      this.data.nodeList.forEach((v)=>{
        if (parentIds.indexOf(v.node_params.node_id) > -1) {
          parentCollect.push(v);
        }
      })
      console.log(parentCollect);
      return parentCollect;
    },
    backToEdit(){
      this.$router.push({path:'/'})
    }

  }
};
</script>

<style lang="less" scoped>
.editBtn{
  display: flex;
  position: absolute;
  right: 20px;
  width: 400px;
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
      &:hover{
        cursor: grab;
      }
      &:active{
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
    .editToolbar{
      height: 50px;
      z-index: 2;
    }
    .mainCtrl{
      height: 100%;
      display: flex;
      align-items: center;
    }
    #flow {
      position: relative;
      width: 100%;
      height: 100%;
      .auxiliary-line-x {
        position: absolute;
        border: .5px dashed #2ab1e8;
        z-index: 9999;
      }
      .auxiliary-line-y {
        position: absolute;
        border: .5px dashed #2ab1e8;
        z-index: 9999;
      }
    }
  }
}
</style>

<style lang="less">
.jtk-connector.active{
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
#pieChart{
  height: 350px;
  width: 350px;
  margin: 0 auto;
}
#basicBar{
  #pieChart()
}
#scatter3D{
  #pieChart()
}
.tabsCtl{
  position: sticky;
  top: 0;
  z-index: 2;
}
</style>
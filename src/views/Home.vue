<template>
  <div>
    <v-app-bar >
        <v-app-bar-nav-icon @click="leftBarVis = !leftBarVis"></v-app-bar-nav-icon>
          <v-app-bar-title min-width="400">绘制流程图</v-app-bar-title>
      <div class="editBtn">
        <v-btn @click="flowToJSON"  color="secondary" class="mx-5">生成json数据</v-btn>
        <v-btn @click="reloadData" color="success" class="mx-5">回显数据</v-btn>
        <v-file-input hide-input truncate-length="25"  @change="loadFile" accept="application/json" class="mx-5"></v-file-input>
      </div>
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
    </v-app-bar>
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
            absolute
            :hide-overlay="true"
          >
          
            <v-list nav dense >
              <v-list-group
                v-for="item in items"
                :key="item.title"
                v-model="item.active"
                :prepend-icon="item.action"
                no-action
              >
              <template #activator>
                <v-list-item-content>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </v-list-item-content>
              </template>
                <v-list-item
                  v-for="child in item.items"
                  :disabled="child.disabled"
                  :key="child.title"
                  draggable="true"
                  @dragstart="drag($event, child)"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="child.title"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
       </v-navigation-drawer>
      </div>
      <div id="flowWrap" ref="flowWrap" class="flow-wrap" @drop="drop($event)" @dragover="allowDrop($event)">
        <div id="flow">
          <div v-show="auxiliaryLine.isShowXLine" class="auxiliary-line-x" :style="{width: auxiliaryLinePos.width, top:auxiliaryLinePos.y + 'px', left: auxiliaryLinePos.offsetX + 'px'}"></div>
          <div v-show="auxiliaryLine.isShowYLine" class="auxiliary-line-y" :style="{height: auxiliaryLinePos.height, left:auxiliaryLinePos.x + 'px', top: auxiliaryLinePos.offsetY + 'px'}"></div>
          
          <flowNode v-for="item in data.nodeList" :id="item.id" :key="item.id" :node="item" @setNodeName="setNodeName" @deleteNode = "deleteNode" @changeLineState="changeLineState" @ctlRightOverLay="ctlRightOverLay"></flowNode>
        
        </div>
      </div>
      <v-navigation-drawer
            
            v-model="rightOverlay.active"
            absolute
            right
          >
          <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-avatar color="#D1DBBD">
            <v-icon>mdi-pencil</v-icon>
            <!-- <img src="https://randomuser.me/api/portraits/women/81.jpg"> -->
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{rightOverlay.info.title}}</v-list-item-title>
            <v-list-item-subtitle>副标题</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="(item,index) in rightOverlay.info"
          :key="item.id"
        >
          <v-list-item-icon>
            <v-icon>{{index}}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="d-flex justify-center align-center mt-10" >
          <v-btn
            @click="rightOverlay.active = false "
            color="error"
            outlined>
            关闭
            </v-btn>
      </div>
       </v-navigation-drawer>
    </div>

    
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb"
import { nodeTypeList } from './config/init'
import { jsplumbSetting, jsplumbConnectOptions, jsplumbSourceOptions, jsplumbTargetOptions } from './config/commonConfig'
import methods from "./config/methods"
import data from './config/data.json'
import flowNode from "./components/node-item"
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
      items: [
        {
          action: 'mdi-ticket',
          items: [{ title: '表单项' }],
          title: '景点',
        },
        {
          action: 'mdi-silverware-fork-knife',
          active: true,
          items: [
            { title: '数据源', message:'这是详情信息' },
            { title: '饭店',message:'这是详情信息'  },
            { title: '精选',message:'这是详情信息'  },
          ],
          title: '晚餐',
        },
        {
          action: 'mdi-school',
          items: [{ title: '表单项' }],
          title: '教育',
        },
        {
          action: 'mdi-run',
          items: [{ title: '表单项' }],
          title: '家庭',
        },
        {
          action: 'mdi-bottle-tonic-plus',
          items: [{ title: '表单项' }],
          title: '健康',
        },
        {
          action: 'mdi-content-cut',
          items: [{ title: '表单项' }],
          title: '办公室',
        },
        {
          action: 'mdi-tag',
          items: [{ title: '表单项' }],
          title: '促销活动',
        },
      ],
      leftBarVis:true,
      showDelDialog:false,
      rightOverlay:{
        info:{},
        active:false
      },
    };
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance();
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
      console.log(this.data);
      let body =  JSON.stringify(this.data);
      console.log(body);
    },
    reloadData(innerData){
      this.jsPlumb.reset();
      this.data.lineList = [];
      this.data.nodeList = [];
      //深拷贝json数据
      let dataD = JSON.parse(JSON.stringify(innerData));

      this.data.lineList = dataD.lineList
      dataD.nodeList.map(v => {
        this.data.nodeList.push(v)
      })
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
    /* background-image: url("../assets/point.png"); */
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
</style>
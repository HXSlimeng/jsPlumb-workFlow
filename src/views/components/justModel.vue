<template>
  <div class="flow_region">
    <div id="flowWrap" ref="flowWrap" class="flow-wrap" @drop="drop($event)" @dragover="allowDrop($event)">
      <slot :headerInfo="data.graph_param"></slot>
      <!-- <v-subheader class="text-h5" style="color: #00695c">
        {{ data.graph_param.graph_name }}
      </v-subheader> -->
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
          @ctlRightOverLay="ctlRightOverLay ? ctlRightOverLay : ''"
          @getParentParams="getParentParams ? getParentParams : ''"
        ></flowNode>
      </div>
    </div>
  </div>
</template>

<script>
import { datalist } from '../config/data.json'
import { jsPlumb } from 'jsplumb'
import { jsplumbSetting, jsplumbConnectOptions, jsplumbSourceOptions, jsplumbTargetOptions } from '../config/commonConfig'
import methods from '../config/methods'
import flowNode from './node-item'
export default {
  components: {
    flowNode
  },
  data() {
    return {
      data: {
        graph_param: {
          graph_name: 'demo_graph',
          graph_id: 'graph_index_1',
          grap_type: 'json_graph'
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
      showDelDialog: false,
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
        ['fitow_status_describe', '描述性统计分析']
      ]
    }
  },
  created() {
    this.listMap = new Map(this.listTypeMap)

    this.jsPlumb = jsPlumb.getInstance()
    let modelInfo = this.$route.params.modelInfo
    modelInfo = {
      graph_param: {
        graph_name: '测试',
        graph_id: '1zsp5rclplpc00',
        graph_message: '',
        graph_createTim: '2022-01-14',
        graph_type: 'json_graph'
      },
      create_time: '',
      nodeList: [
        {
          node_params: {
            node_type: 'fitow_csv_loader',
            node_name: 'csv_loader',
            node_id: '3ewzjdpe0eo000',
            dependency: [],
            submit: true,
            stage: 'train',
            last: false,
            top: '120px',
            left: '85px'
          },
          resource_params: {},
          op_params: {},
          train_params: {
            csv_file: './client_demo/data/iris.data',
            submit_result: true
          },
          predict_params: {}
        },
        {
          node_params: {
            node_type: 'fitow_csv_loader',
            node_name: 'csv_loader',
            node_id: 'hjd4apo5kqw00',
            dependency: [],
            submit: true,
            stage: 'train',
            last: false,
            top: '135px',
            left: '360px'
          },
          resource_params: {},
          op_params: {},
          train_params: {
            csv_file: './client_demo/data/iris.data',
            submit_result: true
          },
          predict_params: {}
        }
      ],
      lineList: [
        {
          from: '3ewzjdpe0eo000',
          to: 'hjd4apo5kqw00',
          label: '连线名称',
          id: '3a13zz2npuw000',
          Remark: ''
        }
      ]
    }
    modelInfo = datalist[0]
    console.log(modelInfo)
    if (modelInfo) {
      this.reloadData(modelInfo)
      this.initialModelData = JSON.parse(JSON.stringify(modelInfo))
    }
  },
  mounted() {
    this.fixNodesPosition()
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    ...methods,
    reloadData(innerData) {
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
    getNameByNodeType(type) {
      return this.listMap.get(type)
    }
  }
}
</script>

<style lang="less" scoped>
.flow_region {
  display: flex;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  position: absolute;
  //   &::after {
  //     content: "";
  //     display: block;
  //     height: 100%;
  //     width: 100%;
  //     position: absolute;
  //     z-index: 2;
  //   }

  .flow-wrap {
    height: 100%;
    position: relative;
    overflow: hidden;
    outline: none !important;
    flex-grow: 1;
    // background-image: url("../assets/point.png");
    background: #daeaf6;

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

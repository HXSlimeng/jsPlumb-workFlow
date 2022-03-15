<template>
  <div
    class="node-item"
    ref="node"
    :class="[
      isActive || isSelected ? 'active' : '',
      { nodedisab: nodeParams.disabled },
      { lastNode: nodeParams.last },
    ]"
    :style="flowNodeContainer"
    v-click-outside="setNotActive"
    @click="setActive"
    @mouseenter="showAnchor"
    @mouseleave="hideAnchor"
    @contextmenu.prevent="onContextmenu"
  >
    <!-- @dblclick.prevent="editNode" -->
    <v-icon>mdi-database-outline</v-icon>
    <div class="nodeName">{{ getNamenBytype(nodeParams.node_type) }}</div>

    <!-- <v-btn fab dark x-small color="primary" @click.stop="formInfoShow = true" v-if="nodeParams.submit" class="configParamBtn">
      <v-icon dark>mdi-file-document-edit-outline</v-icon>
    </v-btn> -->
    <!-- 记录node节点的状态 -->
    <v-icon v-if="nodeStatus == 3" dark color="red">mdi-alert-circle</v-icon>
    <v-icon
      v-else-if="nodeStatus != 2"
      dark
      :color="nodeStatus == '0' ? 'warning' : 'success'"
      >{{ statusIcon[nodeStatus] }}</v-icon
    >
    <v-progress-circular
      v-else
      indeterminate
      color="primary"
      size="24"
    ></v-progress-circular>
    <!--连线用--//触发连线的区域-->
    <div class="node-anchor anchor-top" v-show="ifShownodeAnchor"></div>
    <div class="node-anchor anchor-right" v-show="ifShownodeAnchor"></div>
    <div class="node-anchor anchor-bottom" v-show="ifShownodeAnchor"></div>
    <div class="node-anchor anchor-left" v-show="ifShownodeAnchor"></div>
    <!-- 配置数据弹出框 -->
    <v-dialog
      v-model="formInfoShow"
      max-width="600"
      :hide-overlay="false"
      :no-click-animation="true"
    >
      <v-card>
        <v-card-title class="text-h6 grey lighten-2"> 配置参数 </v-card-title>
        <v-form ref="form" lazy-validation class="ma-3">
          <span class="text-h6">train_params</span>
          <v-divider class="my-3"></v-divider>
          <div v-for="(config, key) in node.train_params" :key="key">
            <v-text-field
              v-if="
                key.indexOf('_file') == -1 && !(key == 'additional_run_kwargs')
              "
              :label="key"
              v-model="node.train_params[key]"
              required
              outlined
              height="10px"
            ></v-text-field>
          </div>
          <span class="text-h6">op_params</span>
          <v-divider class="my-3"></v-divider>
          <div v-for="(config, key) in node.op_params" :key="key">
            <v-text-field
              v-if="
                key.indexOf('_file') == -1 && !(key == 'additional_run_kwargs')
              "
              :label="key"
              v-model="node.train_params[key]"
              required
              outlined
              height="10px"
            ></v-text-field>
          </div>
          <span class="text-h6">resource_params</span>
          <v-divider class="my-3"></v-divider>
          <div v-for="(config, key) in node.resource_params" :key="key">
            <v-text-field
              v-if="
                key.indexOf('_file') == -1 && !(key == 'additional_run_kwargs')
              "
              :label="key"
              v-model="node.train_params[key]"
              required
              outlined
              height="10px"
            ></v-text-field>
          </div>
        </v-form>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="completeFill">完成</v-btn>
          <v-btn
            color="secondary"
            @click="connectToDatabase"
            :loading="dataBaseFetching"
            :disabled="nodeParams.submit_result"
            >计算数据</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 展示详情 -->
    <v-dialog v-model="showDetialMess" max-width="600">
      <v-card min-height="600">
        <v-card-title class="text-h6 grey lighten-2"> 查看输出 </v-card-title>
        <div v-if="node.node_result">
          <v-data-table
            :headers="headers"
            :items="node.node_result.X"
            :items-per-page="10"
            class="elevation-1"
          >
            <template #item="{ item }">
              <tr>
                <td v-for="(chdItem, index) in item" :key="index">
                  {{ item[index] }}
                </td>
              </tr>
            </template>
          </v-data-table>
        </div>
      </v-card>
    </v-dialog>
    <v-tooltip
      top
      color="warning"
      :activator="getNode()"
      v-if="nodeParams.disabled"
    >
      <v-icon color="white" size="18px">mdi-alert-circle</v-icon
      ><span>请先配置参数</span>
    </v-tooltip>
  </div>
</template>

<script>
import { nodeResult, runGraph } from "@/request/apis/drawApi.js";
import ClickOutside from "vue-click-outside";
import json3d from "@/views/config/json3d.json";
export default {
  name: "nodeItem",
  props: {
    node: Object,
  },
  directives: {
    ClickOutside,
  },
  computed: {
    // 节点容器样式
    flowNodeContainer: {
      get() {
        return {
          top: this.node.node_params.top,
          left: this.node.node_params.left,
        };
      },
    },
    ifShownodeAnchor() {
      return (
        this.mouseEnter &&
        !this.node.node_params.disabled &&
        !this.node.node_params.last
      );
    },
    nodeParams() {
      return this.node.node_params;
    },
  },
  data() {
    return {
      mouseEnter: false,
      isActive: false,
      isSelected: false,
      formInfoShow: false,
      showDetialMess: false,
      //表单数据
      connectFrom: {
        dataBaseName: "",
        password: "",
      },
      ruleInline: {
        user: [
          {
            required: true,
            message: "Please fill in the user name",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "Please fill in the password.",
            trigger: "blur",
          },
          {
            type: "string",
            min: 6,
            message: "The password length cannot be less than 6 bits",
            trigger: "blur",
          },
        ],
      },
      dataBaseFetching: false,
      headers: [
        {
          text: "第一项",
          align: "start",
          sortable: false,
          value: "one",
        },
        { text: "第二项", value: "two" },
        { text: "第三项", value: "three" },
        { text: "第四项", value: "four" },
        { text: "第五项", value: "five" },
      ],
      nodeStatus: 0,
      statusIcon: ["mdi-help-circle", "mdi-check-circle"],
    };
  },
  methods: {
    showAnchor() {
      this.mouseEnter = true;
    },
    hideAnchor() {
      this.mouseEnter = false;
    },
    onContextmenu() {
      this.$contextmenu({
        items: [
          {
            label: "删除",
            disabled: false,
            icon: "",
            onClick: () => {
              this.deleteNode();
            },
          },
          {
            label: "查看输出",
            disabled: false,
            icon: "",
            onClick: () => {
              this.showDetialMess = true;
            },
          },
          /* {
          label: '查看详细数据',
          disabled: false,
          icon: "",
          onClick: () => {
            // if (this.isActive) {
            //   return;
            // }else{
            //   }
              this.$emit("ctlRightOverLay",this.node,this.isActive)
            this.isActive = true
          }
        }, */
          {
            label: "配置参数",
            disabled: false,
            icon: "",
            onClick: () => {
              this.formInfoShow = true;
            },
          },
        ],
        event,
        customClass: "custom-class",
        zIndex: 9999,
        minWidth: 180,
      });
    },
    setActive() {
      if (window.event.ctrlKey) {
        this.isSelected = !this.isSelected;
        return false;
      }
      if (this.isActive) {
        return;
      } else {
        this.$emit("ctlRightOverLay", this.node, this.isActive);
      }
      this.isActive = true;
      this.isSelected = false;
      setTimeout(() => {
        this.$emit("changeLineState", this.nodeParams.node_id, true);
      }, 0);
    },
    setNotActive() {
      if (!window.event.ctrlKey) {
        this.isSelected = false;
      }
      if (!this.isActive) {
        return;
      }
      this.$emit("changeLineState", this.nodeParams.node_id, false);
      this.isActive = false;
    },
    editNode() {
      this.newNodeName = this.node.nodeName;
      this.$Modal.confirm({
        render: (h) => {
          return h("Input", {
            props: {
              value: this.newNodeName,
              autofocus: true,
            },
            on: {
              input: (val) => {
                this.newNodeName = val;
              },
            },
          });
        },
        onOk: () => {
          this.$emit("setNodeName", this.nodeParams.node_id, this.newNodeName);
        },
      });
    },
    deleteNode() {
      this.$emit("deleteNode", this.node);
    },
    connectToDatabase() {
      let _this = this;
      this.dataBaseFetching = true;
      this.nodeStatus = 2;
      nodeResult({
        node_name: this.nodeParams.node_name,
        node_id: this.nodeParams.node_id,
      })
        .then((res) => {
          console.log({
            fetch_result: res,
          });
          let { node_result, node_exec_state } = res;
          this.node.node_result = node_result;
          this.node.node_exec_state = node_exec_state;
          if (res.node_exec_state.state_id == 0) {
            this.$emit("ctlRightOverLay", this.node, this.isActive);
            // this.$nextTick(()=>{
            //   this.$parent.jsPlumb.makeTarget(this.nodeParams.node_id, this.$parent.jsplumbTargetOptions);
            // })
            this.$message.alertMessage("操作成功！");
            this.nodeStatus = 1;
            this.dataBaseFetching = false;
            // this.formInfoShow = false;
            // delete this.nodeParams.disabled
            //重新刷新列表数据
          } else if (res.node_exec_state.state_id == 1) {
            setTimeout(() => {
              this.connectToDatabase();
            }, 2000);
          } else {
            this.nodeStatus = 3;
            this.dataBaseFetching = false;
            this.$message.alertMessage(node_exec_state.fail_info);
          }
        })
        .catch((err) => {
          this.dataBaseFetching = false;
          console.log(err);
        });
      //   (function (params) {
      //   return new Promise((resolve,reject,pendding)=>{
      //     setTimeout(() => {
      //      let success = true;
      //      for (const key in _this.node.parameters) {
      //        if (_this.node.parameters.hasOwnProperty.call(_this.node.parameters, key)) {
      //          const element = _this.node.parameters[key];
      //           if (element == '') {
      //             success = false;
      //           }
      //        }
      //      }
      //      /* if (_this.node.parameters.find(v=>!!v)) {
      //        success = false;
      //      } */
      //      let result = json3d;
      //      if (!success) {
      //        result.node_exec_state.state = 'fail'
      //        result.node_exec_state.fail_info = '操作失败'
      //      }
      //       resolve(result)
      //     }, 2000);
      //   })
      // })().then(res =>{
      //   let { node_result,node_exec_state} = res;
      //     this.node.node_result = node_result;
      //     this.node.node_exec_state = node_exec_state;

      //   if (res.node_exec_state.state == 'success') {
      //     this.$emit("ctlRightOverLay",this.node,this.isActive)
      //     this.$nextTick(()=>{
      //       this.$parent.jsPlumb.makeTarget(this.nodeParams.node_id, this.$parent.jsplumbTargetOptions);
      //     })
      //     this.$message.alertMessage('操作成功！')
      //     this.dataBaseFetching = false;
      //     this.formInfoShow = false;
      //     delete this.nodeParams.disabled
      //     //重新刷新列表数据

      //   }else{
      //     this.dataBaseFetching = false;
      //     this.$message.alertMessage(node_exec_state.fail_info)
      //   }
      //   // this.node.dataBase = res;

      //   // this.$parent.setListDisable('精选');
      //   }).catch(err=>{
      //     console.log(err);
      //     this.dataBaseFetching = false;
      //     })
    },
    completeFill() {
      this.formInfoShow = false;
    },
    getNode() {
      return document.getElementById(this.nodeParams.node_id);
    },
    globalMessage(val) {
      this.$parent.alertMessage(val);
    },
    getParentParams() {
      this.$emit("getParentParams", this.nodeParams.node_id);
    },
    getNamenBytype(type) {
      return this.$parent.getNameByNodeType(type);
    },
  },
  mounted() {},
  created() {
    /* if (this.nodeParams.submit && !this.node.node_result) {
      this.nodeParams.disabled = true;
    } */
    /* setTimeout(() => {
      this.nodeStatus = 2
    }, 2000);
    setTimeout(() => {
      this.nodeStatus = 1
    }, 4000); */
  },
};
</script>

<style lang="less" scoped>
@labelColor: #409eff;
@nodeSize: 15px;
@viewSize: 10px;
.node-item {
  position: absolute;
  display: flex;
  height: 40px;
  width: 160px;
  justify-content: center;
  align-items: center;
  border: 1px solid #b7b6b6;
  border-left: solid 10px rgb(145, 170, 157);
  border-radius: 4px;
  cursor: move;
  box-sizing: content-box;
  z-index: 9995;
  background-color: rgb(209, 219, 189);
  &:hover {
    z-index: 9998;
    .delete-btn {
      display: block;
    }
  }
  .log-wrap {
    width: 40px;
    height: 40px;
    border-right: 1px solid #b7b6b6;
  }
  .nodeName {
    flex-grow: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: center;
  }
  .configParamBtn {
  }
  .node-anchor {
    display: flex;
    position: absolute;
    width: @nodeSize;
    height: @nodeSize;
    align-items: center;
    justify-content: center;
    border-radius: 2px;
    cursor: crosshair;
    z-index: 9999;
    background: rgb(25, 52, 65);
  }
  .anchor-top {
    top: calc((@nodeSize / 2) * -1);
    left: 50%;
    margin-left: calc((@nodeSize / 2) * -1);
  }
  .anchor-right {
    top: 50%;
    right: calc((@nodeSize / 2) * -1);
    margin-top: calc((@nodeSize / 2) * -1);
  }
  .anchor-bottom {
    bottom: calc((@nodeSize / 2) * -1);
    left: 50%;
    margin-left: calc((@nodeSize / 2) * -1);
  }
  .anchor-left {
    top: 50%;
    left: calc((@nodeSize / 0.9) * -1);
    margin-top: calc((@nodeSize / 2) * -1);
  }
}
.active {
  /* border: 1px dashed @labelColor; */
  box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.5);
  border-left: solid 10px rgb(145, 170, 157);
}
.nodedisab {
  background: rgba(209, 219, 189, 0.4);
  border-left: solid 10px rgba(145, 170, 157, 0.4);
  color: rgba(0, 0, 0, 0.4);
}
.lastNode {
  background: #bdbdbd;
  border-left: solid 10px #616161;
}
</style>
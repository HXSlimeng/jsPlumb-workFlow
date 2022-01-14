<template>
  <div class="node-item" ref="node" 
    :class="[(isActive || isSelected) ? 'active' : '', {nodedisab:nodeParams.disabled},{lastNode:nodeParams.last}]"
    :style="flowNodeContainer"
    v-click-outside="setNotActive"
    @mouseenter="showAnchor"
    @mouseleave="hideAnchor"
    @click="setActive"
    @contextmenu.prevent="onContextmenu"
    >
    <!-- @dblclick.prevent="editNode" -->
    <v-icon v-if="nodeParams.hasOwnProperty('disabled')">mdi-database-outline</v-icon>
    <div class="nodeName">{{nodeParams.node_type}}</div>

    <v-btn fab dark x-small color="primary" @click.stop="formInfoShow = true" v-if="nodeParams.submit" class="configParamBtn">
      <v-icon dark>mdi-file-document-edit-outline</v-icon>
    </v-btn>
      <!--连线用--//触发连线的区域-->
      <div class="node-anchor anchor-top" v-show="ifShownodeAnchor"></div>
      <div class="node-anchor anchor-right" v-show="ifShownodeAnchor"></div>
      <div class="node-anchor anchor-bottom" v-show="ifShownodeAnchor"></div>
      <div class="node-anchor anchor-left" v-show="ifShownodeAnchor"></div>
      <!-- 配置数据弹出框 -->
        <v-dialog v-model="formInfoShow" max-width="600" :hide-overlay="false" :no-click-animation="true">
          <v-card>
           <v-card-title class="text-h6 grey lighten-2">
             配置参数
            </v-card-title>
            <v-btn @click="getParentParams">获取父节点参数</v-btn>
            <v-form
              ref="form"
              lazy-validation
              class="mx-3"
            >
            <div v-for="(config,key) in node.train_params" :key="key">
              <v-text-field
                v-if="key.indexOf('_file')==-1 && !(key=='additional_run_kwargs')"  
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
              <v-btn color="primary" @click="completeFill" >完成</v-btn>
              <v-btn color="secondary" @click="connectToDatabase" :loading="dataBaseFetching" :disabled="!nodeParams.submit_result">计算数据</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- 展示详情 -->
        <v-dialog v-model="showDetialMess" max-width="600" >
          <v-card min-height="600">
            <v-card-title class="text-h6 grey lighten-2">
            查看输出
            </v-card-title>
            <v-list dense>
              <v-list-item
                v-for="(item,index) in node"
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
          </v-card>
        </v-dialog>
        <v-tooltip top color="warning" :activator="getNode()" v-if="nodeParams.disabled">
          <v-icon color="white" size="18px">mdi-alert-circle</v-icon><span>请先配置参数</span>
        </v-tooltip>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
export default {
  name: "nodeItem",
  props: {
      node: Object
  },
  directives: {
    ClickOutside
  },
  computed: {
    // 节点容器样式
    flowNodeContainer: {
      get() {
        return {
          top: this.node.node_params.top,
          left: this.node.node_params.left
        };
      }
    },
    ifShownodeAnchor(){
      return this.mouseEnter && !this.node.node_params.disabled && !this.node.node_params.last;
    },
    nodeParams(){
      return this.node.node_params
    }
    
  },
  data() {
    return {
      mouseEnter: false,
      isActive: false,
      isSelected: false,
      formInfoShow:false,
      showDetialMess:false,
      //表单数据
      connectFrom: {
                    dataBaseName: '',
                    password: ''
                },
      ruleInline: {
          user: [
              { required: true, message: 'Please fill in the user name', trigger: 'blur' }
          ],
          password: [
              { required: true, message: 'Please fill in the password.', trigger: 'blur' },
              { type: 'string', min: 6, message: 'The password length cannot be less than 6 bits', trigger: 'blur' }
          ]
      },
      dataBaseFetching:false
    };
  },
  methods: {
    showAnchor() {
      this.mouseEnter = true
    },
    hideAnchor() {
      this.mouseEnter = false
    },
    onContextmenu() {
      this.$contextmenu({
        items: [{
          label: '删除',
          disabled: false,
          icon: "",
          onClick: () => {
            this.deleteNode()
          }
        },
        {
          label: '显示详情信息',
          disabled: false,
          icon: "",
          onClick: () => {
            this.showDetialMess = true;
          }
        },
        {
          label: '配置参数',
          disabled: false,
          icon: "",
          onClick: () => {
            this.formInfoShow = true;
          }
        }],
        event,
        customClass: 'custom-class',
        zIndex: 9999,
        minWidth: 180
      })
    },
    setActive() {
      if(window.event.ctrlKey){
        this.isSelected = !this.isSelected
        return false
      }
        if (this.isActive) {
          return;
        }else{
          this.$emit("ctlRightOverLay",this.node,this.isActive)
        }
      this.isActive = true
      this.isSelected = false
      setTimeout(() => {
        this.$emit("changeLineState", this.nodeParams.node_id, true)
      },0)
    },
    setNotActive() {
      if(!window.event.ctrlKey){
        this.isSelected = false
      }
      if(!this.isActive) {
        return
      }
      this.$emit("changeLineState", this.nodeParams.node_id, false)
      this.isActive = false
    },
    editNode() {
      this.newNodeName = this.node.nodeName
      this.$Modal.confirm({
        render: (h) => {
          return h('Input', {
              props: {
                value: this.newNodeName,
                autofocus: true
              },
              on: {
                input: (val) => {
                  this.newNodeName = val;
                }
              }
          })
        },
        onOk: () => {
          this.$emit('setNodeName', this.nodeParams.node_id, this.newNodeName)
        }
      })
    },
    deleteNode() {
      this.$emit("deleteNode", this.node)
    },
    connectToDatabase(){
      let _this = this;
        this.dataBaseFetching = true;
      (function (params) {
      return new Promise((resolve,reject,pendding)=>{
        setTimeout(() => {
         let success = true;
         for (const key in _this.node.parameters) {
           if (_this.node.parameters.hasOwnProperty.call(_this.node.parameters, key)) {
             const element = _this.node.parameters[key];
              if (element == '') {
                success = false;
              }
           }
         }
         /* if (_this.node.parameters.find(v=>!!v)) {
           success = false;
         } */
         let result = {
          node_result:{
                X:[123],// 输出的二维数据，行列不定
                Y:[123], // 输出的标签数据，一般是一维数据
                addtional_node_info:{}, // 节点的统计分析信息
              },
          node_exec_state:{
                state:"success", //节点执行状态
                state_id:0, // 节点执行的状态id代号
                fail_info:"" // 执行失败的辅助信息
              }
         }
         if (!success) {
           result.node_exec_state.state = 'fail'
           result.node_exec_state.fail_info = '操作失败'
         }
          resolve(result)
        }, 2000);
      })
    })().then(res =>{
      
      let { node_result,node_exec_state} = res;
        this.node.node_result = node_result;
        this.node.node_exec_state = node_exec_state;

      if (res.node_exec_state.state == 'success') {
        this.$emit("ctlRightOverLay",this.node,this.isActive)
        this.$nextTick(()=>{
          this.$parent.jsPlumb.makeTarget(this.nodeParams.node_id, this.$parent.jsplumbTargetOptions);
        })
        this.$message.alertMessage('操作成功！')
        this.dataBaseFetching = false;
        this.formInfoShow = false;
        delete this.nodeParams.disabled
        //重新刷新列表数据
        
      }else{
        this.dataBaseFetching = false;
        this.$message.alertMessage(node_exec_state.fail_info)
      }
      // this.node.dataBase = res;

      // this.$parent.setListDisable('精选');
      }).catch(err=>{
        console.log(err);
        this.dataBaseFetching = false;
        })
    },
    completeFill(){
      this.formInfoShow = false;
    },
    getNode(){
      return document.getElementById(this.nodeParams.node_id);
    },
    globalMessage(val){
      this.$parent.alertMessage(val);
    },
    getParentParams(){
      this.$emit('getParentParams',this.nodeParams.node_id)
    }
  },
  mounted(){
  },
  created(){
    if (this.nodeParams.submit && !this.node.node_result) {
      this.nodeParams.disabled = true;
    }
  }
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
    .delete-btn{
      display: block;
    }
  }
  .log-wrap{
    width: 40px;
    height: 40px;
    border-right: 1px solid  #b7b6b6;
  }
  .nodeName {
    flex-grow: 1;
    width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .configParamBtn{
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
  .anchor-top{
    top: calc((@nodeSize / 2)*-1);
    left: 50%;
    margin-left: calc((@nodeSize/2)*-1);
  }
  .anchor-right{
    top: 50%;
    right: calc((@nodeSize / 2)*-1);
    margin-top: calc((@nodeSize / 2)*-1);
  }
  .anchor-bottom{
    bottom: calc((@nodeSize / 2)*-1);
    left: 50%;
    margin-left: calc((@nodeSize / 2)*-1);
  }
  .anchor-left{
    top: 50%;
    left: calc((@nodeSize/0.9)*-1);
    margin-top: calc((@nodeSize / 2)*-1);
  }
}
.active{
  /* border: 1px dashed @labelColor; */
  box-shadow: 0px 5px 9px 0px rgba(0,0,0,0.5);
  border-left: solid 10px rgb(145, 170, 157);
}
.nodedisab{
  background: rgba(209, 219, 189, .4); 
  border-left: solid 10px rgba(145, 170, 157,.4);
  color: rgba(0,0,0,0.4);
}
.lastNode{
  background: #BDBDBD;
  border-left: solid 10px #616161;
  
}

</style>
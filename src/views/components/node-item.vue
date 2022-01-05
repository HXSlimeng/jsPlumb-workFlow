<template>
  <div class="node-item" ref="node" 
    :class="[(isActive || isSelected) ? 'active' : '', node.disabled ? 'nodedisab' : '']"
    :style="flowNodeContainer"
    v-click-outside="setNotActive"
    @click="setActive"
    @mouseenter="showAnchor"
    @mouseleave="hideAnchor"
    @contextmenu.prevent="onContextmenu">
    <!-- @dblclick.prevent="editNode" -->
    <v-icon v-if="node.hasOwnProperty('disabled')">mdi-database-outline</v-icon>
    <div class="nodeName">{{node.title}}</div>
      <!--连线用--//触发连线的区域-->
      <div class="node-anchor anchor-top" v-show="mouseEnter && !node.disabled"></div>
      <div class="node-anchor anchor-right" v-show="mouseEnter && !node.disabled"></div>
      <div class="node-anchor anchor-bottom" v-show="mouseEnter && !node.disabled"></div>
      <div class="node-anchor anchor-left" v-show="mouseEnter && !node.disabled"></div>
        <v-dialog v-model="formInfoShow" max-width="600">
          <v-card class=" pa-10">
            <v-form
              ref="form"
              lazy-validation
            >
              <v-text-field
                :counter="10"
                label="数据库名称"
                v-model="connectFrom.dataBaseName"
                required
              ></v-text-field>

              <v-text-field
                label="邮件"
                required
              ></v-text-field>

              <v-select
                label="Item"
                required
              ></v-select>

              <!-- <v-checkbox
                label="Do you agree?"
                required
              ></v-checkbox> -->

             <!--  <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                检验
              </v-btn>

              <v-btn
                color="error"
                class="mr-4"
                @click="reset"
              >
                重置
              </v-btn>

              <v-btn
                color="warning"
                @click="resetValidation"
              >
                重置检验
              </v-btn> -->
            </v-form>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="connectToDatabase" :loading = "dataBaseFetching">提交</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- 展示详情 -->
        <v-dialog v-model="showDetialMess" max-width="300">
          <v-card class=" pa-5">
            {{node.message}}
          </v-card>
        </v-dialog>
        <v-tooltip top color="warning" :activator="getNode()" v-if="node.disabled">
          <v-icon color="white" size="18px">mdi-alert-circle</v-icon><span>请先连接数据库</span>
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
          top: this.node.top,
          left: this.node.left
        };
      }
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
            console.log(this.$vuetify);
            this.showDetialMess = true;
          }
        },
        {
          label: '连接数据库',
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
        this.$emit("changeLineState", this.node.id, true)
      },0)
    },
    setNotActive() {
      if(!window.event.ctrlKey){
        this.isSelected = false
      }
      if(!this.isActive) {
        return
      }
      this.$emit("changeLineState", this.node.id, false)
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
          this.$emit('setNodeName', this.node.id, this.newNodeName)
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
          let dataBase = _this.connectFrom.dataBaseName;
          resolve(dataBase)
        }, 2000);
      })
    })().then(res =>{
      this.$nextTick(()=>{
        this.$parent.jsPlumb.makeTarget(this.node.id, this.$parent.jsplumbTargetOptions);
      })
      this.dataBaseFetching = false;
      this.node.dataBase = res;
      this.formInfoShow = false;
      this.node.disabled = false;
      this.$parent.setListDisable('精选');
      }).catch(err=>{console.log(err);})
    },
    getNode(){
      return document.getElementById(this.node.id);
    }
  },
  mounted(){
  },
  created(){
      if (this.node.title == '数据源') {
        this.node.disabled = true; 
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
  opacity: .5;
}

</style>
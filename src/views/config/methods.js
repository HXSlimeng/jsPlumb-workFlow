import panzoom from "panzoom";
import { GenNonDuplicateID } from "@/common/until";

const methods = {
  init() {
    this.jsPlumb.ready(() => {
      // 导入默认配置
      this.jsPlumb.importDefaults(this.jsplumbSetting);
      //完成连线前的校验
      this.jsPlumb.bind("beforeDrop", evt => {
        let res = () => { } //此处可以添加是否创建连接的校验， 返回 false 则不添加； 
        return res
      })
      // 连线创建成功后，维护本地数据
      this.jsPlumb.bind("connection", evt => {
        this.addLine(evt)
      });
      //连线双击删除事件
      this.jsPlumb.bind("dblclick",(conn, originalEvent) => {
        this.jsPlumb.deleteConnection(conn)
        // this.confirmDelLine(conn)
      })
      //断开连线后，维护本地数据
      this.jsPlumb.bind("connectionDetached", evt => {
        this.deleLine(evt)
      })
      this.loadEasyFlow();
      // 会使整个jsPlumb立即重绘。
      this.jsPlumb.setSuspendDrawing(false, true);
    });
    this.initPanZoom();
  },
  // 加载流程图
  loadEasyFlow() {
    // 初始化节点
    for (let i = 0; i < this.data.nodeList.length; i++) {
      let node = this.data.nodeList[i];
      // 设置源点，可以拖出线连接其他节点
      this.jsPlumb.makeSource(node.node_params.node_id, this.jsplumbSourceOptions);
      // // 设置目标点，其他源点拖出的线可以连接该节点
      this.jsPlumb.makeTarget(node.node_params.node_id, this.jsplumbTargetOptions);
      // this.jsPlumb.draggable(node.node_params.node_id);
      this.draggableNode(node.node_params.node_id)
    }

    // 初始化连线
    // 取消连接事件
    this.jsPlumb.unbind("connection"); 
    for (let i = 0; i < this.data.lineList.length; i++) {
      let line = this.data.lineList[i];
      this.jsPlumb.connect(
        {
          source: line.from,
          target: line.to
        },
        this.jsplumbConnectOptions
      );
    }
    //连接线连接事件
    this.jsPlumb.bind("connection", evt => {
      let from = evt.source.id;
      let to = evt.target.id;
      this.data.lineList.push({
        from: from,
        to: to,
        label: "连线名称",
        id: GenNonDuplicateID(8),
        Remark: ""
      });
      let faParam, sonParam;
      //连线成功将父节点的参数传递给子节点
    faParam =  this.data.nodeList.find(v=>v.node_params.node_id==from);
    sonParam = this.data.nodeList.find(item=>item.node_params.node_id==to);
    faParam.node_result ? sonParam.resource_params.push({
      from:from,
      faParam:faParam.node_result
    }) : '';
    });
  },
  draggableNode(nodeId) {
    this.jsPlumb.draggable(nodeId, {
      grid: this.commonGrid,
      drag: (params) => {
        this.alignForLine(nodeId, params.pos)
      },
      start: () => {

      },
      stop: (params) => {
        this.auxiliaryLine.isShowXLine = false
        this.auxiliaryLine.isShowYLine = false
        this.changeNodePosition(nodeId, params.pos)
      }
    })
  },
  //移动节点时，动态显示对齐线
  alignForLine(nodeId, position) {
    let showXLine = false, showYLine = false
    this.data.nodeList.some(el => {
      if(el.node_params.node_id !== nodeId && el.node_params.left == position[0]+'px') {
        this.auxiliaryLinePos.x = position[0] + 60;
        showYLine = true
      }
      if(el.node_params.node_id !== nodeId && el.node_params.top == position[1]+'px') {
        this.auxiliaryLinePos.y = position[1] + 20;
        showXLine = true
      }
    })
    this.auxiliaryLine.isShowYLine = showYLine
    this.auxiliaryLine.isShowXLine = showXLine
  },
  changeNodePosition(nodeId, pos) {
    this.data.nodeList.some(v => {
      if(nodeId == v.node_params.node_id) {
        v.node_params.left = pos[0] +'px'
        v.node_params.top = pos[1] + 'px'
        return true
      }else {
        return false
      }
    })
  },
  drag(ele, item) {
    this.currentItem = JSON.parse(JSON.stringify(item));
  },
  drop(event) {
    const containerRect = this.jsPlumb.getContainer().getBoundingClientRect();
    const scale = this.getScale();
    let left = (event.pageX - containerRect.left -60) / scale;
    let top = (event.pageY - containerRect.top -20) / scale;
      var temp = {
        /* dataBase:this.currentItem.title + res, */
        ...this.currentItem,
      };
      temp.node_params.node_id = GenNonDuplicateID(8),
      temp.node_params.top = (Math.round(top/20))*20 + "px",
      temp.node_params.left = (Math.round(left/20))*20 + "px",
      
      this.addNode(temp);
  },
  addLine(line) {
    let from = line.source.id;
    let to = line.target.id;
    
    this.data.lineList.push({
      from: from,
      to: to,
      label: "连线名称",
      id: GenNonDuplicateID(8),
      Remark: ""
    });
    
  },
  confirmDelLine(line) {
    this.showDelDialog = true;
    /* this.$Modal.confirm({
      title: '删除连线',
      content: "<p>确认删除该连线？</p>",
      onOk: () => {
        this.jsPlumb.deleteConnection(line)
      }
    }) */
  },
  deleLine(line) {
    this.data.lineList.forEach((item, index) => {
      if(item.from === line.sourceId && item.to === line.targetId) {
        this.data.lineList.splice(index, 1)
      }
    })
  },
  // dragover默认事件就是不触发drag事件，取消默认事件后，才会触发drag事件
  allowDrop(event) {
    event.preventDefault();
  },
  getScale() {
    let scale1;
    if (this.jsPlumb.pan) {
      const { scale } = this.jsPlumb.pan.getTransform();
      scale1 = scale;
    } else {
      const matrix = window.getComputedStyle(this.jsPlumb.getContainer()).transform;
      scale1 = matrix.split(", ")[3] * 1;
    }
    this.jsPlumb.setZoom(scale1);
    return scale1;
  },
  // 添加新的节点
  addNode(temp) {
    this.data.nodeList.push(temp);
    this.$nextTick(() => {
      temp.node_params.disabled ? '' : this.jsPlumb.makeTarget(temp.node_params.node_id, this.jsplumbTargetOptions);
      temp.node_params.last ? '' : this.jsPlumb.makeSource(temp.node_params.node_id, this.jsplumbSourceOptions);
      this.draggableNode(temp.node_params.node_id)
    });
  },

  initPanZoom() {
    const mainContainer = this.jsPlumb.getContainer();
    const mainContainerWrap = mainContainer.parentNode;
    const pan = panzoom(mainContainer, {
      smoothScroll: false,
      bounds: true,
      // autocenter: true,
      zoomDoubleClickSpeed: 1,
      minZoom: 0.5,
      maxZoom: 2,
      //设置滚动缩放的组合键，默认不需要组合键
      beforeWheel: (e) => {
        // let shouldIgnore = !e.ctrlKey
        // return shouldIgnore
      },
      beforeMouseDown: function(e) {
        // allow mouse-down panning only if altKey is down. Otherwise - ignore
        var shouldIgnore = e.ctrlKey;
        return shouldIgnore;
      }
    });
    this.jsPlumb.mainContainerWrap = mainContainerWrap;
    this.jsPlumb.pan = pan;
    // 缩放时设置jsPlumb的缩放比率
    pan.on("zoom", e => {
      const { x, y, scale } = e.getTransform();
      this.jsPlumb.setZoom(scale);
      //根据缩放比例，缩放对齐辅助线长度和位置
      this.auxiliaryLinePos.width = (1/scale) * 100 + '%'
      this.auxiliaryLinePos.height = (1/scale) * 100 + '%'
      this.auxiliaryLinePos.offsetX = -(x/scale)
      this.auxiliaryLinePos.offsetY = -(y/scale)
    });
    pan.on("panend", (e) => {
      const {x, y, scale} = e.getTransform();
      this.auxiliaryLinePos.width = (1/scale) * 100 + '%'
      this.auxiliaryLinePos.height = (1/scale) * 100 + '%'
      this.auxiliaryLinePos.offsetX = -(x/scale)
      this.auxiliaryLinePos.offsetY = -(y/scale)
    })

    // 平移时设置鼠标样式
    mainContainerWrap.style.cursor = "grab";
    mainContainerWrap.addEventListener("mousedown", function wrapMousedown() {
      this.style.cursor = "grabbing";
      mainContainerWrap.addEventListener("mouseout", function wrapMouseout() {
        this.style.cursor = "grab";
      });
    });
    mainContainerWrap.addEventListener("mouseup", function wrapMouseup() {
      this.style.cursor = "grab";
    });
  }, 

  setNodeName(nodeId, name) {
    this.data.nodeList.some((v) => {
      if(v.node_params.node_id === nodeId) {
        v.nodeName = name
        return true
      }else {
        return false
      }
    })
  },

  //删除节点
  deleteNode(node) {
    this.data.nodeList.some((v,index) => {
      if(v.node_params.node_id == node.node_params.node_id) {
        let delNodeId = v.node_params.node_id;
        
        this.jsPlumb.remove(delNodeId)
          this.data.nodeList.splice(index, 1)

        //删除节点时同步删除右边信息栏
        if (v.node_params.node_id == this.rightOverlay.info.node_params.node_id) {
          this.rightOverlay.active = false;
        }
        return true
      }else {
        return false
      }
    });
  },

  //更改连线状态
  changeLineState(nodeId, val) {
    let lines = this.jsPlumb.getAllConnections()
    lines.forEach(line => {
      if(line.targetId === nodeId || line.sourceId === nodeId) {
        if(val) {
          line.canvas.classList.add('active')
        }else {
          line.canvas.classList.remove('active')
        }
      }
    })
  },

  //初始化节点位置  （以便对齐,居中）
  fixNodesPosition() {
    if(this.data.nodeList && this.$refs.flowWrap) {
      const nodeWidth = 120
      const nodeHeight = 40
      //方法返回元素的大小及其相对于视口的位置 getBoundingClientRect
      let wrapInfo = this.$refs.flowWrap.getBoundingClientRect()
      let maxLeft = 0, minLeft = wrapInfo.width, maxTop = 0, minTop = wrapInfo.height;
      let nodePoint = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      }
      let fixTop = 0, fixLeft = 0;
      this.data.nodeList.forEach(el => {
        //将json中的单位'px'去除
        let top = Number(el.node_params.top.substring(0, el.node_params.top.length -2))
        let left = Number(el.node_params.left.substring(0, el.node_params.left.length -2))
        maxLeft = left > maxLeft ? left : maxLeft
        minLeft = left < minLeft ? left : minLeft
        maxTop = top > maxTop ? top : maxTop
        minTop = top < minTop ? top : minTop
      })
      nodePoint.left = minLeft
      nodePoint.right = wrapInfo.width - maxLeft - nodeWidth
      nodePoint.top = minTop
      nodePoint.bottom = wrapInfo.height - maxTop - nodeHeight;

      fixTop = nodePoint.top !== nodePoint.bottom ? (nodePoint.bottom - nodePoint.top) / 2 : 0;
      fixLeft = nodePoint.left !== nodePoint.right ? (nodePoint.right - nodePoint.left) / 2 : 0;

      this.data.nodeList.map(el => {
        let top = Number(el.node_params.top.substring(0, el.node_params.top.length - 2)) + fixTop;
        let left = Number(el.node_params.left.substring(0, el.node_params.left.length - 2)) + fixLeft;
        el.node_params.top = (Math.round(top/20))* 20 + 'px'
        el.node_params.left = (Math.round(left/20))*20 + 'px'
      })
    }
  }, 
  resetField(){
    this.jsPlumb.reset();
  },
  ctlRightOverLay(val,isActive){
    this.rightOverlay.active = true;
    if (!isActive) {
      this.rightOverlay.active = false;
      setTimeout(()=>{
        this.rightOverlay.info = val;
        this.rightOverlay.active = true;
      },200)
    }
  },
  setListDisable(str){
    this.listItem.map(v=>{
     v.items.find(x=>{
       if (x.node_type == str) {
        this.$nextTick(()=>{
          this.$set(x,'disabled',true)
        }) 
       }
      })
    })
  }
}

export default methods;
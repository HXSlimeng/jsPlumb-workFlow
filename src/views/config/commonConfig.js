export const jsplumbSetting = {
  grid: [10, 10],
  // 动态锚点、位置自适应
  Anchors: [
    "TopCenter",
    "RightMiddle",
    "BottomCenter",
    "LeftMiddle"
  ],
  Container: "flow",
  // 连线的样式 StateMachine、Flowchart,有四种默认类型：Bezier（贝塞尔曲线），Straight（直线），Flowchart（流程图），State machine（状态机）
  Connector: ["Bezier", {  stub: 5 ,curviness:60}],
  // 鼠标不能拖动删除线
  ConnectionsDetachable: false,
  // 删除线的时候节点不删除
  DeleteEndpointsOnDetach: false,
  // 连线的端点
  Endpoint: [
    "Dot",
    {
      height: 10,
      width: 10
    }
  ],
  // 线端点的样式
  EndpointStyle: {
    fill: "rgba(255,255,156,0)",
    outlineWidth: 1
  },
  LogEnabled: false, //是否打开jsPlumb的内部日志记录
  // 绘制线
  PaintStyle: {
    stroke: "rgb(187,181,172)",
    strokeWidth: 2
  },
  HoverPaintStyle: { stroke: "#ff00cc", strokeWidth: 2 },
  // 绘制箭头
  Overlays: [
    [
      "Arrow",
      {
        width: 8,
        length: 8,
        location: 0.7
      }
    ]
  ],
  RenderMode: "svg"
}

// jsplumb连接参数
export const jsplumbConnectOptions = {
  isSource: true,
  isTarget: true,
  // 动态锚点、提供了4个方向 Continuous、AutoDefault
  anchor: [
    "TopCenter",
    "RightMiddle",
    "BottomCenter",
    "LeftMiddle"
  ],
  /* paintStyle: { stroke: 'lightgray', strokeWidth: 3 },
  endpointStyle: { fill: 'lightgray', outlineStroke: 'darkgray', outlineWidth: 2 } */
}

export const jsplumbSourceOptions = {
  filter: ".node-anchor", //触发连线的区域
  /*"span"表示标签，".className"表示类，"#id"表示元素id*/
  filterExclude: false,
  anchor: [
    "TopCenter",
    "RightMiddle",
    "BottomCenter",
    "LeftMiddle"
  ],
  allowLoopback: false
}

export const jsplumbTargetOptions = {
  filter: ".node-anchor",
  /*"span"表示标签，".className"表示类，"#id"表示元素id*/
  filterExclude: false,
  anchor: [
    "TopCenter",
    "RightMiddle",
    "BottomCenter",
    "LeftMiddle"
  ],
  allowLoopback: false
}
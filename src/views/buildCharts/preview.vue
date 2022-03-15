<template>
  <div class="outBox">
    <div class="editArea" id="topOuter">
      <vue-draggable-resizable
        v-for="item in draggableItems"
        :key="item.id"
        :w="item.width"
        :h="item.height"
        :x="item.x"
        :y="item.y"
        :parent="true"
        :minWidth="200"
        :minHeight="200"
        @activated="setActive(item)"
        :class="[{ active: item.active }, 'chartItem']"
        :draggable="false"
        :resizable="false"
      >
        <div :id="item.id" class="insideCharts"></div>
        <!-- <p>
              X: {{ item.x }} / Y: {{ item.y }} - Width: {{ item.width }} /
              Height: {{ item.height }}
        </p>-->
      </vue-draggable-resizable>
    </div>
  </div>
</template>

<script>
import preMethods from "./presetCharts";
import { debounce } from "@/common/until.js";
export default {
  data() {
    return {
      draggableItems: [],
      initEcharts: [],
      timer: null,
    };
  },
  created() {
    this.draggableItems = JSON.parse(window.localStorage.getItem("chartsItem"));
    // const { dragCharts } = this.$route.params;
    // this.draggableItems = dragCharts;
  },
  methods: {
    ...preMethods,
    loadCharts() {
      // this.draggableItems = [
      //   {
      //     id: "4xi7o7huw6000",
      //     width: 260,
      //     height: 200,
      //     x: 0.5,
      //     y: 0,
      //     active: false,
      //     type: "饼状图",
      //     option: {
      //       title: {
      //         text: "Referer of a Website",
      //         subtext: "Fake Data",
      //         left: "center",
      //       },
      //       tooltip: {
      //         trigger: "item",
      //       },
      //       series: [
      //         {
      //           name: "Access From",
      //           type: "pie",
      //           radius: "40%",
      //           data: [
      //             {
      //               value: 1048,
      //               name: "Search Engine",
      //             },
      //             {
      //               value: 735,
      //               name: "Direct",
      //             },
      //             {
      //               value: 580,
      //               name: "Email",
      //             },
      //             {
      //               value: 484,
      //               name: "Union Ads",
      //             },
      //             {
      //               value: 300,
      //               name: "Video Ads",
      //             },
      //           ],
      //           emphasis: {
      //             itemStyle: {
      //               shadowBlur: 10,
      //               shadowOffsetX: 0,
      //               shadowColor: "rgba(0, 0, 0, 0.5)",
      //             },
      //           },
      //         },
      //       ],
      //     },
      //   },
      //   {
      //     id: "5qdkh8jpl2o000",
      //     width: 893,
      //     height: 266,
      //     x: 262.5,
      //     y: 0,
      //     active: false,
      //     type: "柱形图",
      //     option: {
      //       title: {
      //         text: "Referer of a Website",
      //         subtext: "Fake Data",
      //         left: "center",
      //       },
      //       xAxis: {
      //         type: "category",
      //         data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      //       },
      //       yAxis: {
      //         type: "value",
      //       },
      //       series: [
      //         {
      //           data: [120, 200, 150, 80, 70, 110, 130],
      //           type: "bar",
      //           showBackground: true,
      //           backgroundStyle: {
      //             color: "rgba(180, 180, 180, 0.2)",
      //           },
      //         },
      //       ],
      //     },
      //   },
      //   {
      //     id: "3dekzo4v36o000",
      //     width: 432,
      //     height: 298,
      //     x: 0.5,
      //     y: 352,
      //     active: true,
      //     type: "折线图",
      //     option: {
      //       xAxis: {
      //         type: "category",
      //         data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      //       },
      //       yAxis: {
      //         type: "value",
      //       },
      //       series: [
      //         {
      //           data: [150, 230, 224, 218, 135, 147, 260],
      //           type: "line",
      //         },
      //       ],
      //     },
      //   },
      // ];
      this.draggableItems.forEach((v) => {
        v.draggable = false;
        v.resizable = false;
        this.createCharts(v.id, v.option);
      });
    },
    resizeScale(id) {
      this.setScale(id);
      let _this = this;
      window.addEventListener(
        "resize",
        function () {
          _this.setScale(id);
        },
        false
      );
    },
    setScale: debounce(function (id) {
      var dom = document.getElementById(id);
      let domW = dom.clientWidth;
      let domH = dom.clientHeight;
      var winW = window.innerWidth,
        winH = window.innerHeight,
        scaleX = winW / domW,
        scaleY = winH / domH;
      dom.style.transform = `scale(${scaleX})`;
    }, 500),
  },
  mounted() {
    this.loadCharts();
    this.resizeScale("topOuter");
  },
};
</script>

<style lang="less">
@editWidth: 1000px;
@editheight: 1000px;
.outBox {
  // width: 1920px;
  // height: 1080px;

  .editArea {
    width: 1920px;
    height: 1080px;
    transition: 0.3s all;
    transform-origin: left top;
    // border: solid gray 5px;
    position: relative;
    .insideCharts {
      width: 100%;
      height: 100%;
    }
  }
  .chartItem {
    border: 1px solid #8a8a8a;
  }
}
</style>
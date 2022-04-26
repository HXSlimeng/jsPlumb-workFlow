<template>
  <div class="outBox">
    <div class="editArea" id="topOuter" :style="globalStyleStr">
      <!-- <dv-decoration-11 class="visualAnaTit">{{ globalSetting.title }}</dv-decoration-11> -->
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
        <!-- <div v-if="item.option.isNotChart" class="insideCharts" @contextmenu.prevent="onContextmenu(item)">
          <component
            :ref="item.id"
            :style="`width:${item.width};height:${item.height};`"
            :width="item.width"
            :height="item.height"
            :config="item.option.config"
            :is="item.option.compName"
          ></component>
        </div>
        <component :is="item.borderStyle ? item.borderStyle : 'emptyBorder'" :ref="item.id" v-else>
          <div :id="item.id" class="insideCharts" style="padding-top:20px"></div>
        </component> -->
        <div class="insideCharts" @contextmenu.prevent="onContextmenu(item)">
          <component
            v-if="item.option.isNotChart"
            :ref="item.id"
            :style="`width:${item.width};height:${item.height};`"
            :width="item.width"
            :height="item.height"
            :config="item.option.config"
            :is="item.option.compName"
          ></component>
          <div v-else-if="item.option.isText" class="textNode" :style="getTextStyle(item)">
            {{ item.option.text }}
          </div>
          <component v-else :is="item.borderStyle ? item.borderStyle : 'emptyBorder'" :ref="item.id">
            <div :id="item.id" style="padding-top:20px" class="insideCharts"></div>
          </component>
        </div>
        <!-- <p>
              X: {{ item.x }} / Y: {{ item.y }} - Width: {{ item.width }} /
              Height: {{ item.height }}
        </p>-->
      </vue-draggable-resizable>
    </div>
  </div>
</template>

<script>
import preMethods from './presetCharts'
import { debounce } from '@/common/until.js'
export default {
  data() {
    return {
      draggableItems: [],
      initEcharts: [],
      timer: null,
      globalSetting: {},
      globalStyleStr: ''
    }
  },
  created() {
    const { draggableItems, globalSetting } = JSON.parse(window.localStorage.getItem('chartsItem'))
    this.draggableItems = draggableItems
    this.globalSetting = globalSetting
    console.log({
      draggableItems: this.draggableItems,
      globalSetting: this.globalSetting
    })
    // const { dragCharts } = this.$route.params;
    // this.draggableItems = dragCharts;
  },
  methods: {
    ...preMethods,
    /* loadCharts() {
      this.draggableItems.forEach(v => {
        v.draggable = false
        v.resizable = false
        this.createCharts(v.id, v.option)
      })
    }, */
    resizeScale(id) {
      this.setScale(id)
      let _this = this
      window.addEventListener(
        'resize',
        function() {
          _this.setScale(id)
        },
        false
      )
    },
    setEditStyle() {
      const { themeBgColor, themeBgImage, bgModeSelc, editAreaSize } = this.globalSetting
      const { w, h } = editAreaSize
      this.globalStyleStr = `height:${h}px;width:${w}px;background:${bgModeSelc == 'color' ? themeBgColor : 'url(' + themeBgImage + ');'}`
    },
    setScale: debounce(function(id) {
      var dom = document.getElementById(id)
      let domW = dom.clientWidth
      let domH = dom.clientHeight
      var winW = window.innerWidth,
        winH = window.innerHeight,
        scaleX = winW / domW,
        scaleY = winH / domH
      dom.style.transform = `scale(${scaleX})`
    }, 500)
  },
  mounted() {
    this.setEditStyle()
    this.loadCharts()
    this.resizeScale('topOuter')
  },
  destroyed() {
    window.onresize = null
  }
}
</script>

<style lang="less">
@editWidth: 1000px;
@editheight: 1000px;
.outBox {
  // width: 1920px;
  // height: 1080px;
  .visualAnaTit {
    width: 400px;
    height: 100px;
    color: #7ec699;
    font-size: 2em;
    position: absolute;
    left: 50%;
    margin-left: -200px;
    top: 30px;
  }
  .editArea {
    // width: 1920px;
    // height: 1080px;
    transition: 0.3s all;
    transform-origin: left top;
    // border: solid gray 5px;
    position: relative;
    background-repeat: no-repeat;
    background-size: 100vh 100vw;

    .insideCharts {
      width: 100%;
      height: 100%;
    }
  }
  .chartItem {
    border: 0px solid #8a8a8a;
  }
  .textNode {
    text-align: center;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
}
</style>

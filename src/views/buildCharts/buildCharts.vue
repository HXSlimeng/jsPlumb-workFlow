<!-- 我的页面 -->
<template>
  <div class="my_page">
    <v-card min-width="310" tile style="margin-right: -364px" class="leftNav">
      <div v-if="true">
        <v-btn @click="logMessage">打印数据</v-btn>
        <v-btn @click="loadCharts">回显数据</v-btn>
        <v-btn @click="previewCharts">预览效果</v-btn>
      </div>
      <v-tabs color="primary" slider-color="primary" style="position: sticky;">
        <v-tab>组件</v-tab>
        <v-tab>主题</v-tab>
        <v-tab-item>
          <v-card flat>
            <v-list>
              <v-list-item-group v-model="selectedItem" color="primary">
                <v-list-item v-for="(item, i) in chartOptList" :key="i" ref="dragItem" @dragstart="currDragType = i">
                  <!-- <v-list-item-icon>
              <v-icon v-text="item.icon"></v-icon>
                  </v-list-item-icon>-->
                  <v-list-item-content draggable="true">
                    <v-list-item-title v-text="i"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat class="px-2">
            <v-subheader>主题选择</v-subheader>
            <v-select :items="themeItems" outlined dense v-model="themeSelcted"></v-select>
            <v-subheader>画布尺寸</v-subheader>
            <v-text-field suffix="px" dense outlined v-model="globalSetting.editAreaSize.w"></v-text-field>
            <v-text-field suffix="px" dense outlined v-model="globalSetting.editAreaSize.h"></v-text-field>
            <v-subheader>背景</v-subheader>
            <v-radio-group v-model="globalSetting.bgModeSelc" row @change="setGlobalBg">
              <v-radio label="颜色" value="color"></v-radio>
              <v-radio label="图片" value="image"></v-radio>
            </v-radio-group>
            <v-tabs-items v-model="globalSetting.bgModeSelc">
              <v-tab-item value="color">
                <v-color-picker
                  @update:color="setGlobalBg"
                  dot-size="6"
                  show-swatches
                  hide-canvas
                  hide-sliders
                  hide-inputs
                  v-model="globalSetting.themeBgColor"
                ></v-color-picker>
              </v-tab-item>
              <v-tab-item value="image">
                <v-item-group v-model="globalSetting.themeBgImage" mandatory @change="setGlobalBg">
                  <v-container>
                    <v-row>
                      <v-col v-for="item in bgImages" :key="item" cols="12" md="6">
                        <v-item v-slot="{ active, toggle }" :value="item">
                          <v-card class="d-flex align-center" dark height="100" @click="toggle">
                            <v-img :src="item" aspect-ratio="1.7">
                              <v-row v-if="active" class="fill-height ma-0" align="center" justify="center">
                                <v-icon color="primary">mdi-check-circle</v-icon>
                              </v-row>
                            </v-img>
                            <!-- <v-scroll-y-transition>
                              <div v-if="active" class="text-h2 flex-grow-1 text-center">
                                {{ item }}
                              </div>
                            </v-scroll-y-transition> -->
                          </v-card>
                        </v-item>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-item-group>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
    <div>
      <div class="outBox">
        <div class="editArea" id="editMain" :style="getEditAreaMatrix1()">
          <vue-draggable-resizable
            v-for="item in draggableItems"
            :key="item.flag"
            :w="item.width"
            :h="item.height"
            :x="item.x"
            :y="item.y"
            @dragging="onDrag"
            @resizing="onResize"
            :parent="true"
            :minWidth="200"
            :minHeight="200"
            @deactivated="onDeactivated(item)"
            @activated="setActive(item)"
            :class="[{ active: item.active }, 'chartItem']"
            :draggable="item.draggable"
            :resizable="item.resizable"
          >
            <component :is="item.borderStyle ? item.borderStyle : 'emptyBorder'" :ref="item.id">
              <div :id="item.id" class="insideCharts" @contextmenu.prevent="onContextmenu(item)"></div>
            </component>
            <!-- <p>
              X: {{ item.x }} / Y: {{ item.y }} - Width: {{ item.width }} /
              Height: {{ item.height }}
            </p>-->
          </vue-draggable-resizable>
        </div>
      </div>
    </div>
    <v-dialog v-model="configDialog" width="500">
      <v-card v-if="currentChartOpt">
        <v-card-title class="text-h5 grey lighten-2">配置图表</v-card-title>
        <v-divider></v-divider>
        <div class="ma-5">
          <v-text-field label="图表标题" v-model="currentChartOpt.option.title.text"></v-text-field>
          <v-text-field label="副标题" v-model="currentChartOpt.option.title.subtext"></v-text-field>
          <v-radio-group v-if="currentChartOpt.option.xAxis" v-model="currentChartOpt.option.xAxis.data" label="X轴">
            <v-radio v-for="(n, i) in dataSource.xAxis" :key="i" :label="`数据源 ${i + 1}`" :value="n"></v-radio>
          </v-radio-group>
          <v-radio-group v-model="currentChartOpt.option.series[0].data" label="数据">
            <v-radio v-for="(n, i) in dataSource.data" :key="i" :label="`数据源 ${i + 1}`" :value="n"></v-radio>
          </v-radio-group>
        </div>
        <v-card-actions>
          <div></div>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="readyToCreate">确定</v-btn>
          <v-btn color="primary" text @click="configDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editChartsDialog" width="500px">
      <v-card>
        <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">编辑图表</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="mt-2">
          <v-select
            :items="borderSelected"
            outlined
            dense
            v-model="currentEditItem.borderStyle"
            label="边框样式"
            item-text="value"
            @change="borderStyleChange"
            item-value="value"
          ></v-select>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { GenNonDuplicateID } from '@/common/until.js'
import chartOptList from './chartsOptions.js'
import chartsMethods from './presetCharts.js'
import dataSource from './dataSource.js'
import emptyBorder from '@/views/components/emptyBorder/emptyBorder'
export default {
  components: { emptyBorder },
  data() {
    return {
      selectedItem: 1,
      active: false,
      draggableItems: [],
      currDragType: '',
      initEcharts: [],
      chartOptList: chartOptList,
      currentChartOpt: null,
      configDialog: false,
      dataSource: dataSource,
      chartAreaOpt: {
        scaleMin: 0.5,
        scaleMax: 2,
        scaleUnit: 0.1
      },
      editAreaMatrix: {
        scaleX: 1,
        sknewX: 0,
        sknewY: 0,
        scaleY: 1,
        translateX: 0,
        translateY: 0
      },
      themeItems: ['浅色主题', '深色主题'],
      themeSelcted: '浅色主题',

      currentEditItem: {},
      editChartsDialog: false,
      borderSelected: [
        {
          value: 'DvBorderBox1'
        },
        {
          value: 'DvBorderBox2'
        },
        {
          value: 'DvBorderBox3'
        },
        {
          value: 'DvBorderBox4'
        },
        {
          value: 'DvBorderBox5'
        }
      ],
      bgImages: [
        'http://yuanbaoshuju.com/bigscreen/5/img/bg.png',
        'http://yuanbaoshuju.com/bigscreen/14/img/bg01.png',
        'http://yuanbaoshuju.com/bigscreen/25/images/map_bg.jpg'
      ],
      imageSelected: 0,
      globalSetting: {
        themeBgColor: '#ffffff',
        themeBgImage: '',
        bgModeSelc: 'color',
        editAreaSize: {
          w: 2556,
          h: 1600
        }
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.dragInit()
    this.setEditAreaSize()
    this.setWheelListener()
    this.setCursor()
  },
  // 方法集合
  methods: {
    ...chartsMethods,
    setEditAreaSize() {
      let outBox = document.querySelector('.outBox')
      let editArea = document.querySelector('#editMain')

      let outBoxRealWidth = getComputedStyle(outBox).width.replace('px', '') - getComputedStyle(outBox).paddingLeft.replace('px', '')
      let editWidth = getComputedStyle(editArea).width.replace('px', '')
      let scaleMultiple = outBoxRealWidth / editWidth
      editArea.style.transform = `matrix(${scaleMultiple},0,0,${scaleMultiple},0,0)`
      this.editAreaMatrix.scaleX = scaleMultiple
      this.editAreaMatrix.scaleY = scaleMultiple
    },
    getEditAreaMatrix1() {
      let { scaleX, sknewX, sknewY, scaleY, translateX, translateY } = this.editAreaMatrix
      let { w, h } = this.globalSetting.editAreaSize
      let scaAndPos = `transform:matrix(${scaleX},${sknewX},${sknewY},${scaleY},${translateX},${translateY});`
      let graphSize = `height:${h}px;width:${w}px;`
      return scaAndPos + graphSize
    },
    setWheelListener() {
      let outBox = document.querySelector('.outBox')
      let { scaleUnit } = this.chartAreaOpt
      outBox.addEventListener('mousewheel', e => {
        if (e.deltaY < 0) {
          this.editAreaMatrix.scaleX += scaleUnit
          this.editAreaMatrix.scaleY += scaleUnit
        } else {
          this.editAreaMatrix.scaleX -= scaleUnit
          this.editAreaMatrix.scaleY -= scaleUnit
        }
      })
    },
    setCursor() {
      let outBox = document.querySelector('.outBox')

      let editBox = document.querySelector('#editMain')

      let _this = this
      editBox.addEventListener('mousedown', function wrapMousedown(e) {
        if (!e.srcElement.id) {
          return
        }
        this.style.cursor = 'grabbing'
        editBox.onmousemove = function wrapMouseout(e) {
          let tarX = e.movementX
          let tarY = e.movementY
          _this.editAreaMatrix.translateX += tarX
          _this.editAreaMatrix.translateY += tarY
        }
        editBox.addEventListener('mouseout', function wrapMouseout() {
          this.style.cursor = 'grab'
          editBox.onmousemove = null
        })
      })
      editBox.addEventListener('mouseup', function wrapMouseup() {
        this.style.cursor = 'grab'
        editBox.onmousemove = null
      })
    },
    // getEditAreaMatrix(p1, p2) {
    //   let editArea = document.querySelector("#editMain");
    //   let editAreaScaleStr = getComputedStyle(editArea).transform;
    //   let editAreaScale = editAreaScaleStr
    //     .slice(editAreaScaleStr.indexOf("(") + 1, editAreaScaleStr.indexOf(")"))
    //     .split(",")
    //     .map(Number);
    //   editAreaScale = editAreaScale.map(Number);
    //   return editAreaScale;
    // },
    dragInit() {
      let endArea = document.querySelector('.editArea')
      endArea.addEventListener('dragenter', event => {
        endArea.style.border = 'red solid 5px'
      })
      endArea.addEventListener('dragleave', event => {
        endArea.style.border = 'gray solid 5px'
      })
      endArea.addEventListener('dragover', event => {
        event.preventDefault()
      })
      endArea.addEventListener('drop', e => {
        endArea.style.border = 'gray solid 5px'
        let fatherboxMess = endArea.getBoundingClientRect()

        //创建图将前一个图的active取消
        let activeItem = this.draggableItems.find(v => v.active)
        activeItem ? (activeItem.active = false) : ''
        let editCharts = {
          id: GenNonDuplicateID(8),
          width: 200,
          height: 200,
          x: ~~(e.x - fatherboxMess.x),
          y: ~~(e.y - fatherboxMess.y),
          active: true,
          type: this.currDragType,
          flag: null,
          option: this.chartOptList[this.currDragType],
          borderStyle: 'DvBorderBox1'
        }
        editCharts.flag = editCharts.id
        this.currentChartOpt = editCharts
        this.configDialog = true
      })
    },
    setGlobalBg() {
      let editMain = document.getElementById('editMain')
      let bgColor = this.globalSetting.themeBgColor
      let bgImage = `url(${this.globalSetting.themeBgImage}) no-repeat`
      editMain.style.background = this.globalSetting.bgModeSelc == 'color' ? bgColor : bgImage
    },
    //
    logMessage() {
      console.log(this.draggableItems)
    },
    onContextmenu(target) {
      this.setActive(target)
      this.$contextmenu({
        items: [
          {
            label: '删除',
            disabled: false,
            icon: '',
            onClick: () => {
              this.deleteCharts(target.id)
            }
          },
          {
            label: '编辑图表',
            disabled: false,
            icon: '',
            onClick: () => {
              this.currentEditItem = target
              this.editChartsDialog = true
            }
          }
        ],
        event,
        customClass: 'custom-class',
        zIndex: 9999,
        minWidth: 180
      })
    },
    readyToCreate() {
      this.draggableItems.push(this.currentChartOpt)
      this.createCharts(this.currentChartOpt.id, this.currentChartOpt.option)
      this.configDialog = false
    },
    previewCharts() {
      window.localStorage.setItem('chartsItem', JSON.stringify({ dragItems: this.draggableItems, globalSetting: this.globalSetting }))
      const { href } = this.$router.resolve({
        name: 'previewChartsTest'
      })
      window.open(href, '_blank', 'menubar=no,toolbar=no,status=no,scrollbars=false')
    },
    borderStyleChange() {
      this.createCharts(this.currentEditItem.id, this.currentEditItem.option)
    }
  }
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
@editWidth: 1920px;
@editheight: 1080px;
@outerWidth: 80vw;
@outerHeight: 90vh;
@scaleSize: @outerWidth / @editWidth;
.my_page {
  display: flex;
  .leftNav {
    overflow-x: auto;
    height: calc(100vh - 50px);
    position: relative;
    z-index: 2;
  }
}
.outBox {
  // overflow: scroll;
  padding-left: 364px;
  // width: 100vw;
  overflow: hidden;
  position: relative;
  cursor: grab;
  background: url('../../assets/point.png');
  // width: @outerWidth;
  // height: @outerHeight;

  .editArea {
    // width: 200vw;
    // width: @editWidth;
    // height: @editheight;
    overflow: hidden;
    transform-origin: left top;
    border: solid gray 5px;
    position: relative;
    background-repeat: no-repeat;
    background-size: contain;
    .insideCharts {
      background-color: inherit;
      width: 100%;
      height: 100%;
    }
  }
}
.active {
  background: #eeeeee;
  box-shadow: 0px 5px 9px 0px rgba(0, 0, 0, 0.5);
}
.chartItem {
  // border: 1px solid #f3e307;
  // background: linear-gradient(to left, #2cd5ff, #2cd5ff) left top no-repeat,
  //   linear-gradient(to bottom, #2cd5ff, #2cd5ff) left top no-repeat,
  //   linear-gradient(to left, #2cd5ff, #2cd5ff) right top no-repeat,
  //   linear-gradient(to bottom, #2cd5ff, #2cd5ff) right top no-repeat,
  //   linear-gradient(to left, #2cd5ff, #2cd5ff) left bottom no-repeat,
  //   linear-gradient(to bottom, #2cd5ff, #2cd5ff) left bottom no-repeat,
  //   linear-gradient(to left, #2cd5ff, #2cd5ff) right bottom no-repeat,
  //   linear-gradient(to left, #2cd5ff, #2cd5ff) right bottom no-repeat;
  // background-size: 4px 20px, 20px 4px, 4px 20px, 20px 4px;
  border: 0px solid #073f97;
}
</style>

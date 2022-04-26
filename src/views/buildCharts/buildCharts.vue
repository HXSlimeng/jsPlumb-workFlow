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
              <v-list-group no-action>
                <template v-slot:activator>
                  <v-list-item-title>图表</v-list-item-title>
                </template>
                <v-list-item v-for="(item, i) in chartOptList" :key="i" ref="dragItem" @dragstart="currDragType = i">
                  <v-list-item-icon>
                    <svg-icon :icon-class="item.icon" className="chartIcon"></svg-icon>
                  </v-list-item-icon>
                  <v-list-item-content draggable="true">
                    <v-list-item-title v-text="i"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
              <v-list-group no-action>
                <template v-slot:activator>
                  <v-list-item-title>小组件</v-list-item-title>
                </template>
                <v-list-item v-for="(item, i) in specCompOptList" :key="i" ref="dragItem" @dragstart="currDragType = i">
                  <v-list-item-icon>
                    <svg-icon :icon-class="item.icon" className="chartIcon"></svg-icon>
                  </v-list-item-icon>
                  <v-list-item-content draggable="true">
                    <v-list-item-title v-text="i"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-group>
            </v-list>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat class="px-2">
            <v-subheader>画布尺寸</v-subheader>
            <v-select :items="screenSizeItems" v-model="screenSizeSelec" @change="setScreenSize" dense outlined></v-select>
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
        <div :style="getEditAreaMatrix1()" id="editMain" class="editArea">
          <!-- <dv-decoration-11 class="visualAnaTit">{{ globalSetting.title }}</dv-decoration-11> -->
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
            :minWidth="50"
            :minHeight="50"
            :active="item.active"
            @deactivated="onDeactivated(item)"
            @activated="setActive(item)"
            :class="[{ active: item.active }, 'chartItem']"
            :draggable="item.draggable"
            :resizable="item.resizable"
          >
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
              <!-- 使用plaintext-only而不是true避免内容出现tag或者换行符 -->
              <div
                v-else-if="item.option.isText"
                class="textNode"
                :style="getTextStyle(item)"
                @blur="changeTextVal($event, item)"
                contenteditable="plaintext-only"
                v-html="item.option.text"
              ></div>
              <component v-else :is="item.borderStyle ? item.borderStyle : 'emptyBorder'" :ref="item.id">
                <div :id="item.id" style="padding-top:20px" class="insideCharts"></div>
              </component>
            </div>
          </vue-draggable-resizable>
        </div>
      </div>
      <div class="scaleSlider">
        <!-- <v-slider
          v-model="graphScale"
          max="200"
          min="50"
          step="10"
          :color="ex1.color"
          :label="graphScale.toFixed(0) + '%'"
          vertical
          thumb-label="always"
        ></v-slider> -->
      </div>
    </div>
    <v-dialog v-model="configDialog" width="500">
      <v-card v-if="currentChartOpt">
        <v-card-title class="px-5 py-2 text-body-1 grey lighten-2">配置图表</v-card-title>
        <v-divider></v-divider>
        <div class="ma-5">
          <!-- <v-text-field label="图表标题" v-model="currentChartOpt.option.title.text"></v-text-field>
          <v-text-field label="副标题" v-model="currentChartOpt.option.title.subtext"></v-text-field> -->
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
          <v-btn color="primary" text @click="configDialog = false">取消</v-btn>
          <v-btn color="primary" text @click="readyToCreate">确定</v-btn>
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
          <div v-if="currentEditItem.option && currentEditItem.option.isText">
            <v-text-field outlined dense label="字体大小" v-model="currentEditItem.option.fontSize"> </v-text-field>
            <v-text-field outlined dense label="字体颜色" v-model="currentEditItem.option.color"> </v-text-field>
            <v-text-field outlined dense label="文本内容" v-model="currentEditItem.option.text"> </v-text-field>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="editChartsDialog = false">取消</v-btn>
          <v-btn color="primary" @click="saveEditItem">确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { GenNonDuplicateID } from '@/common/until.js'
import chartOptList from './chartsOptions.js'
import specCompOptList from './specCompOptions'
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
      specCompOptList: specCompOptList,
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
        'http://yuanbaoshuju.com/bigscreen/25/images/map_bg.jpg',
        'https://ajreport.beliefteam.cn/file/download/af82eb9c-67b4-495d-8376-5f147f0b733b',
        require('../../assets/bgSelection.png')
      ],
      imageSelected: 0,
      globalSetting: {
        themeBgColor: '#455a64',
        themeBgImage: '',
        bgModeSelc: 'color',
        editAreaSize: {
          w: 1920,
          h: 1080
        },
        title: ''
      },
      testData: 25,
      ex1: { label: 'color', val: 25, color: 'orange darken-3' },
      screenSizeItems: ['2560*1600', '1920*1440', '1920*1080', '1600*1200'],
      screenSizeSelec: '1920*1080'
    }
  },
  computed: {
    graphScale: {
      get() {
        return this.editAreaMatrix.scaleX * 100
      },
      set(val) {
        this.editAreaMatrix.scaleX = val / 100
        this.editAreaMatrix.scaleY = val / 100
      }
    },
    activeItem() {
      return this.draggableItems.find(v => v.active)
    }
  },
  watch: {},
  created() {
    window.onbeforeunload = () => {
      window.sessionStorage.setItem('visualGlobal', JSON.stringify(this.globalSetting))
      window.sessionStorage.setItem('visualdragble', JSON.stringify(this.draggableItems))
    }
  },
  mounted() {
    this.dragInit()
    this.setEditAreaSize()
    this.setWheelListener()
    this.setCursor()
    let modelInfo = this.$route.params.modelInfo
    if (modelInfo) {
      const { draggableItems, globalSetting } = modelInfo.model_info
      this.draggableItems = draggableItems
      this.globalSetting = globalSetting
      this.loadCharts()
    } else {
      let global = window.sessionStorage.getItem('visualGlobal')
      let draggable = window.sessionStorage.getItem('visualdragble')
      if (global && draggable) {
        this.draggableItems = JSON.parse(draggable)
        this.globalSetting = JSON.parse(global)
        this.setGlobalBg()
        this.draggableItems.forEach(v => {
          /* v.draggable = false
      v.resizable = false */
          if (!v.option.isNotChart && !v.option.isText) {
            this.createCharts(v.id, v.option)
          }
        })
      }
    }
  },
  destroyed() {
    window.onbeforeunload = null
    window.sessionStorage.removeItem('visualGlobal')
    window.sessionStorage.removeItem('visualdragble')
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
      let { w, h } = this.globalSetting.editAreaSize
      editArea.style.height = `${h}px`
      editArea.style.width = `${w}px`
      // let graphSize = `height:${h}px;width:${w}px;`
    },
    getEditAreaMatrix1() {
      let { scaleX, sknewX, sknewY, scaleY, translateX, translateY } = this.editAreaMatrix
      let scaAndPos = `transform:matrix(${scaleX},${sknewX},${sknewY},${scaleY},${translateX},${translateY});`
      return scaAndPos
    },
    setWheelListener() {
      let outBox = document.querySelector('.outBox')
      let { scaleUnit } = this.chartAreaOpt
      outBox.addEventListener('mousewheel', e => {
        let editArea = document.querySelector('#editMain')
        if (e.deltaY < 0) {
          this.editAreaMatrix.scaleX += scaleUnit
          this.editAreaMatrix.scaleY += scaleUnit
        } else {
          this.editAreaMatrix.scaleX -= scaleUnit
          this.editAreaMatrix.scaleY -= scaleUnit
        }
      })
      let userAgent = window.navigator.userAgent
      if (userAgent.includes('Firefox')) {
        outBox.addEventListener('DOMMouseScroll', e => {
          if (e.detail < 0) {
            this.editAreaMatrix.scaleX += scaleUnit
            this.editAreaMatrix.scaleY += scaleUnit
          } else {
            this.editAreaMatrix.scaleX -= scaleUnit
            this.editAreaMatrix.scaleY -= scaleUnit
          }
        })
      }
    },
    setCursor() {
      let editBox = document.querySelector('#editMain')
      let _this = this
      editBox.addEventListener('mousedown', function wrapMousedown(e) {
        e.stopPropagation()
        if (!e.srcElement.id && e.target.className != 'border-box-content') {
          return
        }
        this.style.cursor = 'grabbing'
        editBox.onmousemove = function wrapMouseout(e) {
          e.stopPropagation()
          let tarX = e.movementX * _this.editAreaMatrix.scaleX
          let tarY = e.movementY * _this.editAreaMatrix.scaleX
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
    dragInit() {
      let endArea = document.querySelector('.editArea')
      endArea.addEventListener('dragenter', event => {})
      endArea.addEventListener('dragleave', event => {})
      endArea.addEventListener('dragover', event => {
        event.preventDefault()
      })
      let _this = this
      endArea.addEventListener('drop', e => {
        let fatherboxMess = endArea.getBoundingClientRect()
        //创建图将前一个图的active取消
        let activeItem = this.draggableItems.find(v => v.active)
        activeItem ? (activeItem.active = false) : ''
        let scale = _this.editAreaMatrix.scaleX
        let editCharts = {
          id: GenNonDuplicateID(8),
          width: 200,
          height: 200,
          /* 放置的位置为 （鼠标位置 - 编辑区域的位置）/编辑区域缩放的倍数 */
          x: (e.x - fatherboxMess.x) / scale,
          y: (e.y - fatherboxMess.y) / scale,
          active: true,
          type: this.currDragType,
          flag: null,
          option: Object.assign({}, this.chartOptList[this.currDragType] || this.specCompOptList[this.currDragType]),
          borderStyle: 'DvBorderBox12'
        }
        editCharts.flag = editCharts.id
        if (editCharts.option.isNotChart || editCharts.option.isText) {
          if (editCharts.option.isText) {
            editCharts.width = 150
            editCharts.height = 50
          }
          this.draggableItems.push(editCharts)
        } else {
          this.currentChartOpt = editCharts
          this.configDialog = true
        }
      })
    },
    changeTextVal(e, item) {
      item.option.text = e.target.innerHTML
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
      window.localStorage.setItem('chartsItem', JSON.stringify({ draggableItems: this.draggableItems, globalSetting: this.globalSetting }))
      const { href } = this.$router.resolve({
        name: 'previewChartsTest'
      })
      window.open(
        href,
        '_blank',
        `menubar=no,toolbar=no,status=no,scrollbars=false,height=${window.screen.availHeight - 30},width=${window.screen.availWidth -
          10},location=no,top=0,left=0`
      )
    },
    borderStyleChange() {
      this.createCharts(this.currentEditItem.id, this.currentEditItem.option)
    },
    setScreenSize(e) {
      let w = e.slice(0, e.indexOf('*'))
      let h = e.slice(e.indexOf('*') + 1, e.length)
      this.globalSetting.editAreaSize.w = w
      this.globalSetting.editAreaSize.h = h
      let editArea = document.querySelector('#editMain')
      editArea.style.height = `${h}px`
      editArea.style.width = `${w}px`
    },
    saveEditItem() {
      const { id } = this.currentEditItem
      this.draggableItems.forEach(v => {
        if (v.id == id) {
          v.option = this.currentEditItem.option
          v.borderStyle = this.currentEditItem.borderStyle
        }
      })
      this.borderStyleChange()
      this.editChartsDialog = false
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
@graphHeight: calc(100vh - 50px);
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
  width: 100vw;
  height: @graphHeight;
  overflow: hidden;
  position: relative;
  cursor: grab;
  background: url('../../assets/point.png');
  // width: @outerWidth;
  // height: @outerHeight;

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
    // width: 200vw;
    // width: @editWidth;
    // height: @editheight;
    background-color: rgb(69, 90, 100);
    overflow: hidden;
    transform-origin: left top;
    position: relative;
    background-repeat: no-repeat;
    background-size: contain;
    /* &::after {
      content: '';
      display: block;
      position: absolute;
      width: 100vw;
      height: 100vh;
      background: linear-gradient(-90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 50px 50px,
        linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px) 0% 0% / 50px 50px;
    } */
    .insideCharts {
      background-color: inherit;
      width: 100%;
      height: 100%;
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
.scaleSlider {
  width: 200px;
  position: absolute;
  bottom: 100px;
  right: 100px;
}
.active {
  background: rgba(0, 0, 0, 0.1);
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
  border: 0px;
  .textNode {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    overflow: hidden;
  }
}
</style>

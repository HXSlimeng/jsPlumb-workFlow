import { debounce } from '@/common/until.js'
const chartsMethods = {
  onResize: debounce(function(x, y, width, height) {
    let activeItem = this.activeItem
    if (!activeItem.option.isNotChart && !activeItem.option.isText) {
      let init = this.initEcharts.find(v => v.id == activeItem.id)
      init.init.resize()
    }
    activeItem.x = x
    activeItem.y = y
    activeItem.width = width
    activeItem.height = height
    //dataV样式重新调整大小
    if (!activeItem.option.isText) {
      this.$refs[activeItem.id][0].initWH()
    }
    /* this.$nextTick(() => {
      activeItem.flag = activeItem.flag.length == 14 ? activeItem.flag + '1' : activeItem.flag.slice(0, 14)
    }) */
  }, 100),
  onDrag: debounce(function(x, y) {
    // let activeItem = this.draggableItems.find(v => v.active)
    console.log(111)
    this.activeItem.x = x
    this.activeItem.y = y
  }, 0),
  setActive(dragItem) {
    this.currentEditItem = JSON.parse(JSON.stringify(dragItem))
    this.draggableItems.forEach(v => {
      v.active = false
    })
    dragItem.active = true
  },
  onDeactivated(dragItem) {
    dragItem.active = false
  },
  createCharts(targetId, targetOption) {
    this.$nextTick(() => {
      let targetDom = document.getElementById(targetId)
      let ChartInit = this.$echarts.init(targetDom)
      this.initEcharts = this.initEcharts.filter(v => v.id != targetId)
      this.initEcharts.push({ id: targetId, init: ChartInit })
      ChartInit.setOption(targetOption)
    })
  },
  deleteCharts(targetId) {
    this.draggableItems = this.draggableItems.filter(v => v.id != targetId)
    this.initEcharts = this.initEcharts.filter(v => v.id != targetId)
  },
  setGlobalBg() {
    let editMain = document.getElementById('editMain')
    let bgColor = this.globalSetting.themeBgColor
    let bgImage = `url(${this.globalSetting.themeBgImage}) no-repeat`
    if (editMain) {
      editMain.style.background = this.globalSetting.bgModeSelc == 'color' ? bgColor : bgImage
    }
  },
  loadCharts() {
    /* const { draggableItems, globalSetting } = info
    this.draggableItems = draggableItems
    this.globalSetting = globalSetting */
    this.setGlobalBg()
    this.draggableItems.forEach(v => {
      /* v.draggable = false
      v.resizable = false */
      if (!v.option.isNotChart && !v.option.isText) {
        this.createCharts(v.id, v.option)
      }
    })
    // this.setGlobalBg
  },
  getTextStyle(item) {
    const { option } = item
    return {
      color: option.color,
      fontSize: `${option.fontSize}px`
    }
  }
}
export default chartsMethods

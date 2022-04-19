import { debounce } from '@/common/until.js'
const chartsMethods = {
  onResize: debounce(function(x, y, width, height) {
    let activeItem = this.draggableItems.find(v => v.active)
    if (!activeItem.option.isNotChart) {
      let init = this.initEcharts.find(v => v.id == activeItem.id)
      init.init.resize()
    }
    activeItem.x = x
    activeItem.y = y
    activeItem.width = width
    activeItem.height = height
    this.$refs[activeItem.id][0].initWH()
    /* this.$nextTick(() => {
      activeItem.flag = activeItem.flag.length == 14 ? activeItem.flag + '1' : activeItem.flag.slice(0, 14)
    }) */
  }, 100),
  onDrag: function(x, y) {
    let activeItem = this.draggableItems.find(v => v.active)
    activeItem.x = x
    activeItem.y = y
  },
  setActive(dragItem) {
    this.currentEditItem = dragItem
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
      if (!v.option.isNotChart) {
        this.createCharts(v.id, v.option)
      }
    })
    // this.setGlobalBg
  }
}
export default chartsMethods

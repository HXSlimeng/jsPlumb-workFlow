import { debounce } from '@/common/until.js'
const chartsMethods = {
  onResize: debounce(function(x, y, width, height) {
    let activeItem = this.draggableItems.find(v => v.active)
    let init = this.initEcharts.find(v => v.id == activeItem.id)
    init.init.resize()
    activeItem.x = x
    activeItem.y = y
    activeItem.width = width
    activeItem.height = height
  }, 100),
  onDrag: function(x, y) {
    let activeItem = this.draggableItems.find(v => v.active)
    activeItem.x = x
    activeItem.y = y
  },
  setActive(item) {
    let activeItem = this.draggableItems.find(v => v.active)
    if (activeItem) {
      activeItem.active = false
    }
    let toActiveItem = this.draggableItems.find(v => v.id == item.id)
    toActiveItem.active = true
  },
  createCharts(targetId, targetOption) {
    this.$nextTick(() => {
      let targetDom = document.getElementById(targetId)
      let ChartInit = this.$echarts.init(targetDom)
      this.initEcharts.push({ id: targetId, init: ChartInit })
      console.log(targetOption)
      ChartInit.setOption(targetOption)
    })
  },
  deleteCharts(targetId) {
    this.draggableItems = this.draggableItems.filter(v => v.id != targetId)
    this.initEcharts = this.initEcharts.filter(v => v.id != targetId)
  },
  loadCharts() {
    this.draggableItems = [
      {
        id: '4xi7o7huw6000',
        width: 260,
        height: 200,
        x: 0.5,
        y: 0,
        active: false,
        type: '饼状图',
        option: {
          title: {
            text: 'Referer of a Website',
            subtext: 'Fake Data',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '40%',
              data: [
                {
                  value: 1048,
                  name: 'Search Engine'
                },
                {
                  value: 735,
                  name: 'Direct'
                },
                {
                  value: 580,
                  name: 'Email'
                },
                {
                  value: 484,
                  name: 'Union Ads'
                },
                {
                  value: 300,
                  name: 'Video Ads'
                }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
      },
      {
        id: '5qdkh8jpl2o000',
        width: 893,
        height: 266,
        x: 262.5,
        y: 0,
        active: false,
        type: '柱形图',
        option: {
          title: {
            text: 'Referer of a Website',
            subtext: 'Fake Data',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }
          ]
        }
      },
      {
        id: '3dekzo4v36o000',
        width: 432,
        height: 298,
        x: 0.5,
        y: 352,
        active: true,
        type: '折线图',
        option: {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'line'
            }
          ]
        }
      }
    ]
    this.draggableItems.forEach(v => {
      v.draggable = false
      v.resizable = false
      this.createCharts(v.id, v.option)
    })
  }
}
export default chartsMethods

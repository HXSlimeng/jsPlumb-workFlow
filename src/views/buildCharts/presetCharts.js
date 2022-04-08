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
      console.log(this.initEcharts)
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
        id: '2hciksdeklq000',
        width: 754,
        height: 343,
        x: 26,
        y: 701,
        active: false,
        type: '轮播表',
        flag: '2hciksdeklq000',
        option: {
          icon: 'chartLine',
          isNotChart: true,
          config: {
            data: [
              ['行1列1', '行1列2', '行1列3'],
              ['行2列1', '行2列2', '行2列3'],
              ['行3列1', '行3列2', '行3列3'],
              ['行4列1', '行4列2', '行4列3'],
              ['行5列1', '行5列2', '行5列3'],
              ['行6列1', '行6列2', '行6列3'],
              ['行7列1', '行7列2', '行7列3'],
              ['行8列1', '行8列2', '行8列3'],
              ['行9列1', '行9列2', '行9列3'],
              ['行10列1', '行10列2', '行10列3']
            ]
          },
          compName: 'dv-scroll-board'
        },
        borderStyle: 'DvBorderBox12'
      },
      {
        id: '3vnrk36aw54000',
        width: 879,
        height: 200,
        x: 1019,
        y: 849,
        active: false,
        type: '胶囊图',
        flag: '3vnrk36aw54000',
        option: {
          icon: 'chartLine',
          isNotChart: true,
          config: {
            data: [
              {
                name: '南阳',
                value: 167
              },
              {
                name: '周口',
                value: 67
              },
              {
                name: '漯河',
                value: 123
              },
              {
                name: '郑州',
                value: 55
              },
              {
                name: '西峡',
                value: 98
              }
            ]
          },
          compName: 'dv-capsule-chart'
        },
        borderStyle: 'DvBorderBox12'
      },
      {
        id: '1xp63fz8sydc00',
        width: 797,
        height: 259,
        x: 21,
        y: 251,
        active: false,
        type: '散点图',
        flag: '1xp63fz8sydc00',
        option: {
          xAxis: {},
          yAxis: {},
          title: {
            text: '散点图示例',
            subtext: 'Fake Data',
            left: 'center'
          },
          series: [
            {
              symbolSize: 20,
              data: [
                [10, 8.04],
                [8.07, 6.95],
                [13, 7.58],
                [9.05, 8.81],
                [11, 8.33],
                [14, 7.66],
                [13.4, 6.81],
                [10, 6.33],
                [14, 8.96],
                [12.5, 6.82],
                [9.15, 7.2],
                [11.5, 7.2],
                [3.03, 4.23],
                [12.2, 7.83],
                [2.02, 4.47],
                [1.05, 3.33],
                [4.05, 4.96],
                [6.03, 7.24],
                [12, 6.26],
                [12, 8.84],
                [7.08, 5.82],
                [5.02, 5.68]
              ],
              type: 'scatter'
            }
          ],
          icon: 'chartLine'
        },
        borderStyle: 'DvBorderBox5'
      },
      {
        id: '1oue4v4437ts00',
        width: 846,
        height: 225,
        x: 1029,
        y: 500,
        active: false,
        type: '柱形图',
        flag: '1oue4v4437ts00',
        option: {
          darkMode: 'auto',
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
              data: [150, 230, 224, 218, 135, 147, 260],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }
          ],
          icon: 'chartBar'
        },
        borderStyle: 'DvBorderBox12'
      },
      {
        id: '5obr80efzow000',
        width: 607,
        height: 324,
        x: 1267,
        y: 106,
        active: false,
        type: '饼状图',
        flag: '5obr80efzow000',
        option: {
          title: {
            text: '数据统计',
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
          ],
          icon: 'chartPie'
        },
        borderStyle: 'DvBorderBox12'
      }
    ]

    this.globalSetting = {
      themeBgColor: '',
      themeBgImage: 'http://yuanbaoshuju.com/bigscreen/14/img/bg01.png',
      bgModeSelc: 'image',
      editAreaSize: {
        w: 1920,
        h: 1080
      },
      title: '可视化大屏'
    }
    this.draggableItems.forEach(v => {
      /* v.draggable = false
      v.resizable = false */
      if (!v.option.isNotChart) {
        this.createCharts(v.id, v.option)
      }
    })
    this.setGlobalBg()
  }
}
export default chartsMethods

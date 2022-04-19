const rightOverlayCharts = {
  data() {
    return {
      GenerateStep: 1,
      charinit: null,
      chartSelected: null,
      chartOpts: ['饼图', '柱形图', '折线图'],
      rightChartsOpt: [
        /* pieOption */

        {
          title: {
            text: '数据展示',
            subtext: '',
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          /* legend: {
                  orient: 'vertical',
                  left: 'left'
                }, */
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '40%',
              data: [
                { value: 1048, name: 'Search Engine' },
                { value: 735, name: 'Direct' },
                { value: 580, name: 'Email' },
                { value: 484, name: 'Union Ads' },
                { value: 300, name: 'Video Ads' }
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
        },
        /* basicBarOpt */
        {
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [],
              type: 'bar',
              showBackground: true,
              backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
              }
            }
          ]
        },
        /* categoryOpt */

        {
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: [],
              type: 'line'
            }
          ]
        }
      ],
      rowSelected: null
    }
  },
  computed: {
    currentTitle() {
      switch (this.GenerateStep) {
        case 1:
          return '选择类型'
        case 2:
          return '配置数据'
        default:
          return 'Created!'
      }
    }
  },
  created() {},
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // console.log(this.exeResult)
  },
  // 方法集合
  methods: {
    nextStep() {
      if (this.GenerateStep == 2 && this.rowSelected === null) {
        this.$message.alertMessage('未配置数据源！')
        return
      }
      this.GenerateStep++
      if (this.GenerateStep == 3) {
        setTimeout(() => {
          let chartDom = document.getElementById('rightOverlayChart')
          this.charinit = this.$echarts.init(chartDom)
          let options = this.rightChartsOpt[this.chartSelected]
          if (this.rowSelected) {
            let { node_result } = this.rightOverlay.info
            options.series[0].data = node_result.X.map(v => v[this.rowSelected])
            this.charinit.setOption(options)
          }
        }, 0)
      }
    },
    setExeResult(result) {
      console.log(result)
    },
    getChartsRows() {
      let rows = null
      let exeResult = this.rightInfoResult()
      if (exeResult?.X) {
        rows = exeResult.X[0].length
      } else {
        rows = []
      }
      return rows
    }
  }
}
export default rightOverlayCharts

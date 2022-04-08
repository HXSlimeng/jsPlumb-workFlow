const chartOptions = {
  饼状图: {
    title: {
      text: 'Referer of a Website',
      subtext: 'Fake Data',
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
          // { value: 1048, name: "Search Engine" },
          // { value: 735, name: "Direct" },
          // { value: 580, name: "Email" },
          // { value: 484, name: "Union Ads" },
          // { value: 300, name: "Video Ads" },
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
  柱形图: {
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
        data: [],
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ],
    icon: 'chartBar'
  },
  折线图: {
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
        data: [],
        type: 'line'
      }
    ],
    icon: 'chartLine'
  },
  散点图: {
    xAxis: {},
    yAxis: {},
    title: {
      text: 'Referer of a Website',
      subtext: 'Fake Data',
      left: 'center'
    },
    series: [
      {
        symbolSize: 20,
        data: [],
        type: 'scatter'
      }
    ],
    icon: 'chartLine'
  },
  胶囊图: {
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
  轮播表: {
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
  水位图: {
    icon: 'chartLine',
    isNotChart: true,
    config: { data: [66] },
    compName: 'dv-water-level-pond'
  }
}
export default chartOptions

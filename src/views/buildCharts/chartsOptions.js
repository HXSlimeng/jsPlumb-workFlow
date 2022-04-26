const chartOptions = {
  pie: {
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
  bar: {
    darkMode: 'auto',
    title: {},
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
  line: {
    darkMode: 'auto',
    title: {},
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
  scatter: {
    xAxis: {},
    yAxis: {},
    title: {},
    series: [
      {
        symbolSize: 20,
        data: [],
        type: 'scatter'
      }
    ],
    icon: 'chartLine'
  }
}
export default chartOptions

<template>
  <div class="my_page">
    <v-card-title class="text-h6 font-weight-regular justify-space-between">
      <span>{{ currentTitle }}</span>
      <v-avatar
        color="primary lighten-2"
        class="subheading white--text"
        size="24"
        v-text="GenerateStep"
      ></v-avatar>
    </v-card-title>

    <v-window v-model="GenerateStep">
      <v-window-item :value="1">
        <v-card-text>
          <v-radio-group v-model="chartSelected">
            <v-radio v-for="(item, index) in chartOpts" :key="index" :label="item" :value="index"></v-radio>
          </v-radio-group>
          <span class="text-caption grey--text text--darken-1">推荐生成的图表</span>
        </v-card-text>
      </v-window-item>

      <v-window-item :value="2">
        <v-card-text>
          <v-text-field label="Password" type="password"></v-text-field>
          <v-text-field label="Confirm Password" type="password"></v-text-field>
          <!-- <span class="text-caption grey--text text--darken-1">
              Please enter a password for your account
          </span>-->
        </v-card-text>
      </v-window-item>

      <v-window-item :value="3">
        <div class="pa-4 text-center">
          <div id="chart"></div>
        </div>
      </v-window-item>
    </v-window>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn :disabled="GenerateStep === 1" text @click="GenerateStep--">Back</v-btn>
      <v-spacer></v-spacer>
      <v-btn :disabled="GenerateStep === 3" color="primary" depressed @click="nextStep">Next</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      GenerateStep: 1,
      charinit: null,
      chartSelected: null,
      chartOpts: ["饼图", "柱形图"],
      chartsOpt: {
        pieOption: {
          title: {
            text: "Referer of a Website",
            subtext: "Fake Data",
            left: "center",
          },
          tooltip: {
            trigger: "item",
          },
          /* legend: {
                  orient: 'vertical',
                  left: 'left'
                }, */
          series: [
            {
              name: "Access From",
              type: "pie",
              radius: "40%",
              data: [
                { value: 1048, name: "Search Engine" },
                { value: 735, name: "Direct" },
                { value: 580, name: "Email" },
                { value: 484, name: "Union Ads" },
                { value: 300, name: "Video Ads" },
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        },
        basicBarOpt: {
          xAxis: {
            type: "category",
            data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              data: [120, 200, 150, 80, 70, 110, 130],
              type: "bar",
              showBackground: true,
              backgroundStyle: {
                color: "rgba(180, 180, 180, 0.2)",
              },
            },
          ],
        },
      },
    };
  },
  computed: {
    currentTitle() {
      switch (this.GenerateStep) {
        case 1:
          return "选择类型";
        case 2:
          return "配置数据";
        default:
          return "Created!";
      }
    },
  },
  created() { },
  // 生命周期 - 挂载完成（可以访问DOM元素）
  mounted() { },
  // 方法集合
  methods: {
    nextStep() {
      this.GenerateStep++;
      console.log(this.GenerateStep);
      if (this.GenerateStep == 3) {
        setTimeout(() => {
          let chartDom = document.getElementById("chart");
          this.charinit = this.$echarts.init(chartDom);
          this.charinit.setOption(
            this.chartSelected == 0
              ? this.chartsOpt.pieOption
              : this.chartsOpt.basicBarOpt
          );
        }, 0);
      }
    },
  },
};
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类
#chart {
  height: 320px;
  width: 350px;
  margin: 0 auto;
}
</style>

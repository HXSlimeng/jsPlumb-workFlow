<template>
  <div class="d-flex flex-column justify-center align-center overflow-y-auto">
      <v-card class="text-h5 d-flex justify-space-between align-center pl-6" height="50" style="width:100%">
        图表编排
      </v-card>
      <div class="d-flex mt-3 flex-wrap chartLinkMain">
        <div v-for="(item,index) in dataViewSource" :key="index">
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card width="250px" class="ml-3 mb-3">
                <v-img
                  height="200"
                  :src="item.link"
                ></v-img>
                <v-card-title>{{item.title}}</v-card-title>
                <v-card-text>{{item.message}}</v-card-text>
                <v-divider class="my-1"></v-divider>
                <v-card-actions>
                  <v-icon>mdi-account</v-icon>User
                  <v-row justify="end" dense class="text-subtitle-2">
                    更新于2022.01.18
                  </v-row>
                </v-card-actions>
                <v-fade-transition>
                  <v-overlay
                    v-if="hover"
                    absolute
                    opacity="0.8"
                    color="blue-grey darken-1"
                   
                  >
                  <div  class="d-flex flex-column justify-center align-center"> 
                    <div style="text-align:center">这是一段描述信息这是一段描述信息这是一段描述信息这是一段描述信息这是一段描述信息这是一段描述信息</div>  
                    <v-btn color="success">部署为web实际应用</v-btn>
                  </div>
                  </v-overlay>
                </v-fade-transition>
              </v-card>
            </template>
          </v-hover>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      dataViewSource:[
        {
          title:'折线图',
          message:'这是一段描述信息',
          link:'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/thumb/line-simple.png?_v_=1641520500142'
        },
        {
          title:'面积图',
          message:'这是一段描述信息',
          link:'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/thumb/area-stack-gradient.png?_v_=1641520500142'
        },
        {
          title:'关系图',
          message:'这是一段描述信息',
          link:'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/thumb/grid-multiple.png?_v_=1641520500142'
        },
        {
          title:'散点图1',
          message:'这是一段描述信息',
          link:'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/thumb/scatter-anscombe-quartet.png?_v_=1641520500142'
        },
        {
          title:'散点图2',
          message:'这是一段描述信息',
          link:'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/thumb/scatter-effect.png?_v_=1641520500142"'
        },
        {
          title:'关系图',
          message:'这是一段描述信息',
          link:'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/thumb/graph-label-overlap.png?_v_=1641520500142'
        },
        {
          title:'树图',
          message:'这是一段描述信息',
          link:'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/thumb/tree-basic.png?_v_=1641520500142'
        },
        {
          title:'饼图',
          message:'这是一段描述信息',
          link:'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples/data/thumb/pie-roseType.png?_v_=1641520500142'
        },
      ],
      overlay:false
    }
  }
}
</script>

<style>

</style>
<style lang="less" scoped>
.chartLinkMain{
  height: 84vh;
  
}
</style>
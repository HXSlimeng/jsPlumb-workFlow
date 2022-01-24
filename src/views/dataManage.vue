<template>
  <div class="d-flex flex-column" >
      <v-card class="text-h5 d-flex justify-space-between align-center pl-6 "  height="50" style="width:100%">
        数据管理
      </v-card>
      <div class="main_container d-flex">
          <v-navigation-drawer
            v-model="drawer"
            :hide-overlay="true"
            :stateless="true"
            :absolute="false"
            width="400px"
          >
            <v-list-item>
              <!-- <v-list-item-avatar>
                <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
              </v-list-item-avatar> -->

              <v-list-item-content class="ma-2">
                <v-list-item-title class="text-h6  dataSourceBarTitle" style="line-height:2">
                      数据库列表
                      <v-btn  class="ml-2" color="primary"><v-icon>mdi-refresh</v-icon></v-btn>
                      <v-btn class="ml-2">新建数据库</v-btn>
                  </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
            <v-list-item-content class="mx-2">
              <div class="d-flex">
                <v-text-field
                  label="搜索数据库"
                  solo
                  hide-details
                  dense
                ></v-text-field>
                <v-btn class="ml-2" color="primary"><v-icon>mdi-magnify</v-icon></v-btn>
              </div>
            </v-list-item-content>
            <v-list dense >
              <v-list-item-group  
              v-model="selectedData"
              color="primary">
                <v-list-item
                  v-for="item in items"
                  :key="item.title"
                  link
                >
                  <v-list-item-icon>
                    <v-icon>mdi-view-dashboard</v-icon>
                  </v-list-item-icon>

                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-navigation-drawer>
          <v-card class="dataDetail ma-3 pa-3 " style="overflow:hidden" height="800px" width="80%">
            <h2 class="mb-3"> 数据库信息</h2>
            <div>
              <span>库名: 基本数据库</span>
              <span class=" float-right mr-5">创建时间: 2022-01-21</span>
              <span class=" float-right mr-5">位置: xxxxxxxxxxxxx/xxxxxxxxxx/xxxxxxxx</span>
            </div>
            <span class="">描述: 描述信息</span>
            <h2 class="my-3">数据表信息</h2>
            <div class="d-flex" style="width:600px" >
              <v-btn>添加元数据表</v-btn>
              <v-text-field
                    label="搜索数据库"
                    solo
                    hide-details
                    class="ml-2"
                    dense
                  ></v-text-field>
                  <v-btn class="ml-2" color="primary"><v-icon>mdi-magnify</v-icon></v-btn>
              <v-btn  class="ml-2" color="primary"><v-icon>mdi-refresh</v-icon></v-btn>
            </div>
              <v-data-table
                  v-model="selected"
                  @page-count="pageCount = $event"
                  :headers="modelHeaders"
                  :items="desserts"
                  :single-select="singleSelect"
                  disable-sort
                  item-key="graph_param.graph_id"
                  :page.sync="page"
                  class="elevation-1 my-3"
              >
                  <template #item.actions="{ item }" >
                      <div class="d-flex">
                          <v-btn color="success" dark @click="deleteItem(item)">
                            发布
                          </v-btn>
                      </div>
                  </template>
                  <template v-slot:no-data>
                      <v-btn
                          color="primary"
                          @click="initialize"
                      >
                          刷新
                      </v-btn>
                  </template>
              </v-data-table>
              <div class="text-center pt-2">
                  <v-pagination
                      v-model="page"
                      :length="pageCount"
                  ></v-pagination>
                  <v-text-field
                      :value="itemsPerPage"
                      label="Items per page"
                      type="number"
                      min="-1"
                      v-if="false"
                      max="15"
                      @input="itemsPerPage = parseInt($event, 10)"
                  ></v-text-field>
            </div>
          </v-card>
      </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      drawer:true,
      items: [
          { title: 'stand scaler'},
          { title: 'kmeans'},
          { title: 'pca'},
          { title: 'data slicer'},
        ],
        selectedData:0
    }
  }
}
</script>

<style lang="less" scoped>
.main_container{
  position: relative;
  height: 100vh;
}
.dataSourceBarTitle{
  button{
    float: right;
  }
}
</style>
<template>
  <main class="content">
    <v-navigation-drawer permanent>
      <template #prepend>
        <div class="titleComp py-3">数据表</div>
      </template>
      <v-divider></v-divider>
      <v-text-field
        class="rounded-0 pt-2"
        elevation="0"
        solo
        dense
        hide-details
        placeholder="请输入"
        append-icon="mdi-magnify"
        v-model="searchDBName"
        @click:append="search"
      ></v-text-field>
      <v-list dense rounded>
        <v-list-item-group v-model="selectedDataTable" color="primary">
          <v-list-item v-for="item in dataTable" :key="item.text">
            <template v-slot:default="{ active }">
              <v-list-item-content>
                <v-list-item-title><v-icon v-if="active">mdi-check-circle</v-icon> {{ item[0] }}</v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <div class="px-5 pt-3 dataMain">
      <div class="mb-3 d-flex justify-space-between">
        <v-btn @click="queryTable">执行SQL</v-btn>
        <v-btn color="primary" outlined class="absolute" @click="$router.go(-1)">返回</v-btn>
      </div>
      <v-textarea solo name="input-7-4" label="请输入SQL语句" v-model="searchSqlStr"></v-textarea>
    </div>
  </main>
</template>

<script>
import { query_tables } from '@/request/apis/dataManageApi.js'

export default {
  data() {
    return {
      selectedDataTable: 1,
      dataTable: [],
      searchDBName: '',
      searchSqlStr: ''
    }
  },
  created() {
    let dbInfo = this.$route.params.sqlItem
    this.dbInfo = dbInfo
    // this.queryTable(dbInfo)
  },
  methods: {
    search() {
      const { sql_data_name, sql_data_id } = this.dbInfo
      query_tables({
        sql_data_name,
        sql_data_id,
        database_name: this.searchDBName,
        query_tables: 1,
        sql_string: ''
      })
        .then(res => {
          if (res.success == 'success') {
            this.dataTable = res.result
          }
        })
        .catch(err => {})
    },
    queryTable() {
      const { sql_data_name, sql_data_id } = this.dbInfo
      query_tables({
        sql_data_name,
        sql_data_id,
        database_name: this.searchDBName,
        query_tables: 1,
        sql_string: this.searchSqlStr
      })
        .then(res => {
          if (res.success == 'success') {
            this.dataTable = res.result
          }
        })
        .catch(err => {})
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  height: 100vh;
  display: flex;
}
.dataMain {
  width: 100%;
}
</style>

<template>
  <main class="content">
    <v-navigation-drawer permanent>
      <template #prepend>
        <div class="titleComp">数据表</div>
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
      <div class="editorMode">
        <editor ref="editorEl" v-model="content" @init="editorInit" lang="sql" theme="chrome" width="500" height="200"></editor>
      </div>
      <v-data-table
        class="mt-2"
        :headers="dbHeaders"
        :items="dbSource"
        disable-sort
        item-key=""
        absolute
        @page-count="pageCount = $event"
        :page.sync="page"
        :single-select="singleSelect"
        show-select
        :loading="sqlSourceFetching"
        hide-default-footer
      >
        <template #item.actions="{ item }">
          <div class="d-flex">
            <v-btn color="primary" text @click="previewDBTable(item)">查看库表</v-btn>
            <!-- <v-btn color="primary" text>更新数据</v-btn> -->
            <v-btn color="primary" text @click="editDbSource(item)">编辑</v-btn>
            <v-btn color="primary" text @click="lookupSource(item)">查看</v-btn>
            <v-btn color="primary" text @click="deleteItemConfirm(item)">删除</v-btn>
          </div>
        </template>
        <!-- <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">刷新</v-btn>
      </template> -->
      </v-data-table>
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
    </div>
  </main>
</template>

<script>
import { query_tables } from '@/request/apis/dataManageApi.js'

export default {
  components: {
    editor: require('vue2-ace-editor')
  },
  data() {
    return {
      selectedDataTable: 1,
      dataTable: [],
      page: 1,
      pageCount: 10,
      dbHeaders: [
        {
          text: '名称',
          align: 'center',
          value: 'sql_data_name'
        },
        {
          text: '描述',
          align: 'center',
          value: 'sql_data_describe'
        },
        {
          text: '地址',
          align: 'center',
          value: 'sql_data_ip'
        },
        {
          text: '操作',
          align: 'center',
          value: 'actions'
        }
      ],
      dbSource: [],
      searchDBName: '',
      searchSqlStr: '',
      content: `SELECT city, COUNT(id) AS users_count
FROM users
WHERE group_name = 'salesman'
AND created > '2011-05-21'
GROUP BY 1
ORDER BY 2 DESC`
    }
  },
  created() {
    let dbInfo = this.$route.params.sqlItem
    this.dbInfo = dbInfo

    // this.queryTable(dbInfo)
  },
  mounted() {
    console.log(this.$refs.editorEl.editor)
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
      console.log({
        Str: this.content
      })
      let newNode = document.createElement('p')
      newNode.innerHTML = this.content
      let parNode = document.querySelector('.editorMode')
      parNode.append(newNode)
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
    },
    editorInit: function() {
      require('brace/ext/language_tools') //language extension prerequsite...
      require('brace/mode/sql') //language
      require('brace/theme/chrome')
      require('brace/snippets/sql') //snippet
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
.editorMode {
  border: solid #d3d3d3 2px;
  width: 504px;
}
</style>

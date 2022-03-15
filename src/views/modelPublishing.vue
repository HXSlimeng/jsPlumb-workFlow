<template>
  <div>
    <v-card
      class="text-h5 d-flex justify-space-between align-center pl-6"
      height="50"
      style="width: 100%"
    >
      数据ETL发布
      <div>
        <v-btn>查看已发布</v-btn>
        <v-btn>发布ETL</v-btn>
        <v-btn @click="back">返回</v-btn>
      </div>
    </v-card>
    <!--     <div class="modelTable px-2 my-2">
      <v-data-table
        v-model="selected"
        @page-count="pageCount = $event"
        :headers="modelHeaders"
        :items="desserts"
        :single-select="singleSelect"
        disable-sort
        item-key="graph_param.graph_id"
        :page.sync="page"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <div class="d-flex">
            <v-btn color="success" dark @click="deleteItem(item)"> 发布 </v-btn>
          </div>
        </template>
        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize"> 刷新 </v-btn>
        </template>
      </v-data-table>
      <div class="text-center pt-2">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
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
    </div> -->
    <Model-comp>
      <template slot-scope="scope">
        {{ scope.headerInfo.graph_name }}
        描述：{{ scope.headerInfo.graph_message }} 创建时间：{{
          scope.headerInfo.graph_createTime
        }}
      </template>
    </Model-comp>
    <v-navigation-drawer
      absolute
      permanent
      right
      style="margin-top: 51px"
      width="300"
    >
      <template v-slot:prepend>
        <v-list-item two-line>
          <v-list-item-content> </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>
      <v-list-item>
        <v-text-field label="ETL名称"></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field label="描述"></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field label="发布参数"></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field label="发布地址"></v-text-field>
      </v-list-item>
    </v-navigation-drawer>
  </div>
</template>

<script>
import datalist from "./config/data.json";
import { GenNonDuplicateID } from "@/common/until.js";
import ModelComp from "@/views/components/justModel";

export default {
  data() {
    return {
      page: 1,
      pageCount: 10,
      itemsPerPage: 10,
      selected: [],
      singleSelect: false,
      modelHeaders: [
        {
          text: "模型名称",
          align: "start",
          value: "graph_param.graph_name",
        },
        { text: "描述", value: "graph_param.graph_message" },
        { text: "创建时间", value: "graph_param.graph_createTime" },
        { text: "操作", value: "actions" },
      ],
      desserts: [
        {
          model_name: "模型一",
          model_message: "这是模型的简单描述",
          create_time: "2022-01-11",
        },
      ],
      addModel: false,
      createModelRules: [(value) => !!value || "此为必填项"],
      newModelName: "",
      newModelMessage: "",
      editedIndex: -1,
      editedItem: {
        graph_param: {
          graph_name: "",
          graph_id: "",
          graph_message: "",
          graph_createTime: "",
          graph_type: "",
        },
      },
      dialogDelete: false,
      editDialog: false,
      defaultItem: {
        graph_param: {
          graph_name: "",
          graph_id: "",
          graph_message: "",
          graph_createTime: "",
          graph_type: "",
        },
      },
    };
  },
  components: {
    ModelComp,
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.editDialog = true;
    },
    enterViewModel(item) {
      this.$router.push({
        name: "模型编辑",
        params: {
          modelInfo: item,
        },
      });
    },
    openNewModel() {
      this.addModel = false;
      this.$router.push({
        name: "模型编辑",
        params: {
          modelInfo: {
            graph_param: {
              graph_name: this.newModelName,
              graph_id: GenNonDuplicateID(8),
              graph_message: this.newModelMessage,
              graph_createTime: "2022-01-14",
              graph_type: "json_graph",
            },
            create_time: "",
            nodeList: [],
            lineList: [],
          },
        },
      });
    },
    batchDelete() {
      let selectedArr = this.selected;
    },
    close() {
      this.editDialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    deleteItemConfirm() {
      this.desserts.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    back() {
      this.$router.go(-1);
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    },
  },
  created() {
    this.desserts = datalist.datalist;
  },
};
</script>

<style>
.modelTable {
  width: 80vw;
  /* height: 700px; */
}
</style>
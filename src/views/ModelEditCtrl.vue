<template>
  <div class="d-flex flex-column justify-center align-center" >
      <v-card class="text-h5 d-flex justify-space-between align-center pl-6 " height="50" style="width:100%">
        模型管理
        <v-dialog v-model="addModel" width="500">
            <template #activator="{ on, attrs }">
            <v-btn color="red lighten-2"
                    dark
                    class="mx-10"
                    v-bind="attrs"
                    v-on="on">
                    <v-icon>mdi-plus</v-icon>创建流程图</v-btn>
            </template>
                <v-card >
                    <v-card-title class="text-h6 grey lighten-2">
                    创建流程图
                    </v-card-title>
                        <div class="mx-3">
                            <v-text-field :rules="createModelRules" label="模型名称" v-model="newModelName">
                            </v-text-field>
                            <v-text-field label="描述" v-model="newModelMessage">
                            </v-text-field>
                        </div>

                    <v-divider></v-divider>

                    <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="primary"
                        @click="addModel = false"
                    >
                        取消
                    </v-btn>
                    <v-btn
                        color="primary"
                        @click="openNewModel"
                    >
                        确定
                    </v-btn>
                    </v-card-actions>
                </v-card>
        </v-dialog>
      </v-card>
      
      <div class="modelTable  px-2 my-2">
        <v-data-table
            v-model="selected"
            @page-count="pageCount = $event"
            :headers="modelHeaders"
            :items="desserts"
            :single-select="singleSelect"
            disable-sort
            item-key="graph_param.graph_id"
            hide-default-footer
            :page.sync="page"
            show-select
            class="elevation-1"
        >
            <template v-slot:top>
                <v-btn color="red" dark class="mx-10 align-self-start mt-2" @click="batchDelete">批量删除</v-btn>
                <v-dialog
            v-model="editDialog"
            max-width="500px"
            >
            <v-card>
                <v-card-title>
                <span class="text-h5">编辑模型</span>
                </v-card-title>

                <v-card-text>
                <v-container>
                    <v-row>
                    <v-col>
                        <v-text-field
                        v-model="editedItem.graph_param.graph_name"
                        label="模型名称"
                        ></v-text-field>
                    </v-col>
                    </v-row>
                    <v-row>
                    <v-col>
                        <v-text-field
                        v-model="editedItem.graph_param.graph_message"
                        label="描述"
                        ></v-text-field>
                    </v-col>
                    </v-row>
                </v-container>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="close"
                >
                    取消
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="save"
                >
                    保存
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>

            <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">确定要删除该模型吗？</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">取消</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">确定</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
            </v-dialog>
            </template>

            
            <template #item.actions="{ item }" >
                <div class="d-flex">
                    <v-btn @click="enterViewModel(item)" color="teal darken-1" dark>模型编辑</v-btn>
                    <v-btn @click="enterViewModel(item)" color="teal darken-1" dark>模型查看</v-btn>

                    <v-btn fab x-small dark color="success" @click="editItem(item)">
                        <v-icon small >mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn fab color="red" dark x-small @click="deleteItem(item)">
                        <v-icon small dark>mdi-delete</v-icon>
                    </v-btn>
                </div>
            </template>
            <template v-slot:no-data>
                <v-btn
                    color="primary"
                    @click="initialize"
                >
                    Reset
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
      </div>
  </div>
</template>

<script>
import datalist from "./config/data.json";

export default {
    data(){
        return{
            page: 1,
            pageCount: 10,
            itemsPerPage: 10,
            selected:[],
            singleSelect:false,
            modelHeaders:[
            {
                text: '模型名称',
                align: 'start',
                value: 'graph_param.graph_name',
            },
            { text: '描述', value: 'graph_param.graph_message' },
            { text: '创建时间',value: 'graph_param.graph_createTime'},
            { text: '操作', value: 'actions' },
            ],
            desserts: [
                {
                    model_name: '模型一',
                    model_message: '这是模型的简单描述',
                    create_time: '2022-01-11',
                },
                ],
            addModel:false,
            createModelRules:[
                value => !!value || '此为必填项'
            ],
            newModelName:'',
            newModelMessage:'',
            editedIndex: -1,
            editedItem: {
                graph_param: {
                    graph_name: "",
                    graph_id: "",
                    graph_message:"",
                    graph_createTime:"",
                    graph_type: ""
              },
            },
            dialogDelete:false,
            editDialog:false,
            defaultItem:{
                graph_param: {
                    graph_name: "",
                    graph_id: "",
                    graph_message:"",
                    graph_createTime:"",
                    graph_type: ""
              },
            }
        }
    },
    methods:{
        editItem(item){
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        console.log(this.editedItem);
        this.editDialog = true;
        console.log(this.editDialog);
        console.log(111);
        },
        enterViewModel(item){
            this.$router.push({
                name:'enterModel',
                params: {
                    modelInfo:item,
                }
            })
        },
        openNewModel(){
            this.addModel = false
             this.$router.push({
                name:'enterModel',
                params: {
                    modelInfo:{
                        model_name:this.newModelName,
                        model_message:this.newModelMessage,
                        create_time:"",
                        nodeList: [],
                        lineList: []
                    },
                }
            })
        },
        batchDelete(){
            let selectedArr = this.selected;
        },
        close () {
        this.editDialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      deleteItemConfirm () {
        this.desserts.splice(this.editedIndex, 1)
        this.closeDelete()
      },
        deleteItem (item) {
        this.editedIndex = this.desserts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },
      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.desserts[this.editedIndex], this.editedItem)
        } else {
          this.desserts.push(this.editedItem)
        }
        this.close()
      },

    },
    created(){
        this.desserts = datalist.datalist
    }
}
</script>

<style lang="less" scoped>
    .modelTable{
        width: 80vw;
        height: 700px;
    }
</style>
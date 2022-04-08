import { editGraph, delGraph } from '@/request/apis/drawApi.js'
import { GenNonDuplicateID } from '@/common/until.js'

const editModelMixin = {
  data() {
    return {
      addModelDialog: false,
      createModelRules: [value => !!value || '此为必填项'],
      newModelName: '',
      newModelMessage: '',
      editedIndex: -1,
      dialogDelete: false,
      editDialog: false,
      editedItem: {
        graph_param: {
          graph_name: '',
          graph_id: '',
          graph_message: '',
          graph_createTime: '',
          graph_type: ''
        }
      }
    }
  },
  methods: {
    enterViewModel(item, pageType) {
      editGraph({
        graph_name: item.graph_name,
        graph_id: item.graph_id
      })
        .then(res => {
          if (res.save_state == 'success') {
            const params = {
              modelInfo: res.front_graph,
              editPage: true,
              pageType
            }
            this.$router.push({
              name: pageType == 'ETL' ? '/mangageEtl/enterModel' : '/manageModel/enterModel',
              params: params
            })
          } else {
            this.$message.alertMessage(res.failed_info)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    openNewModel(pageType) {
      this.addModelDialog = false
      this.$router.push({
        name: pageType == 'ETL' ? '/mangageEtl/enterModel' : '/manageModel/enterModel',
        params: {
          modelInfo: {
            graph_param: {
              graph_name: this.newModelName,
              graph_id: GenNonDuplicateID(8),
              graph_message: this.newModelMessage,
              graph_createTime: '2022-01-14',
              graph_type: pageType == 'ETL' ? 0 : 1
            },
            create_time: '',
            nodeList: [],
            lineList: []
          },
          pageType
        }
      })
    },
    deleteItemConfirm() {
      const { graph_id, graph_name } = this.editedItem
      delGraph({ graph_id, graph_name })
        .then(res => {
          if (res.save_state == 'success') {
            this.desserts.splice(this.editedIndex, 1)
          }
        })
        .catch(err => {})
      this.closeDelete()
    },
    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    }
  }
}
export default editModelMixin

import { editGraph } from '@/request/apis/drawApi.js'
import { GenNonDuplicateID } from '@/common/until.js'

const editModelMixin = {
  data() {
    return {
      addModelDialog: false,
      createModelRules: [value => !!value || '此为必填项'],
      newModelName: '',
      newModelMessage: ''
    }
  },
  methods: {
    enterViewModel(item, pageType) {
      editGraph({
        graph_name: item.model_name,
        graph_id: item.model_id,
        time_str: item.time_str
      })
        .then(res => {
          if (res.save_state == 'success') {
            const params = {
              modelInfo: res.front_graph,
              editPage: true,
              pageType
            }
            this.$router.push({
              name: 'enterModel',
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
        name: '模型编辑',
        params: {
          modelInfo: {
            graph_param: {
              graph_name: this.newModelName,
              graph_id: GenNonDuplicateID(8),
              graph_message: this.newModelMessage,
              graph_createTime: '2022-01-14',
              graph_type: 'json_graph'
            },
            create_time: '',
            nodeList: [],
            lineList: []
          },
          pageType
        }
      })
    }
  }
}
export default editModelMixin

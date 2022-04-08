import { post, get } from '../http'
let BASE_API = process.env.VUE_APP_BASE_API
/* ------------------图接口----------------------- */
//执行图
export function runGraph(params) {
  return post(BASE_API + '/run_and_save', params)
}
//保存图
export function saveGraph(params) {
  return post(BASE_API + '/run_and_save', params)
}
//查询图
export function searchGraph(params) {
  return post(BASE_API + '/search_graph', params)
}
//编辑图
export function editGraph(params) {
  return post(BASE_API + '/edit_graph', params)
}
export function delGraph(params) {
  return post(BASE_API + '/delete_graph', params)
}
export function nodeResult(params) {
  return post(BASE_API + '/node_result', params)
}

import { post, get } from '../http'
let BASE_API = process.env.VUE_APP_BASE_API

/* ------------------数据源管理接口----------------------- */
export function file_save(params) {
  return post(BASE_API + '/data_managment/file_data_management', params)
}
export function file_query(params) {
  return post(BASE_API + '/data_managment/file_data_management?query_type=query')
}
export function file_delete(params) {
  const { file_name, file_id } = params
  return post(BASE_API + `/data_managment/file_data_management?query_type=delete&file_name=${file_name}&file_id=${file_id}`)
}
export function file_update(params) {
  return post(BASE_API + '/data_managment/file_data_management?query_type=update', params)
}
export function sql_save(params) {
  return post(BASE_API + '/data_managment/sql_data_management', { query_type: 'add', query_kwargs: params })
}
export function sql_query(params) {
  return post(BASE_API + `/data_managment/sql_data_management`, { query_type: 'query', query_kwargs: params })
}
export function sql_delete(params) {
  return post(BASE_API + '/data_managment/sql_data_management', { query_type: 'delete', query_kwargs: params })
}
export function sql_update(params) {
  return post(BASE_API + '/data_managment/sql_data_management', { query_type: 'update', query_kwargs: params })
}
export function connect_test(params) {
  return post(BASE_API + '/connect_test', { query_type: 0, query_kwargs: params })
}
export function query_tables(params) {
  return post(BASE_API + '/table_inspect', params)
}

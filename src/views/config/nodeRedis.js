var redis = require('redis')
    let RDS_PORT =   8521  //端口号
    let RDS_HOST = 'http://8.141.163.112/'    //服务器IP
    let RDS_OPTS = {auth_pass:'Fitow2018!' }
let client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);
export default client 
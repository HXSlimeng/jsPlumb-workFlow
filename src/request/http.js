import axios from 'axios'

// axios.defaults.baseURL = 'http://192.168.2.158:7654'

import qs from 'qs' //参数序列化，把数据格式转为 x-www-form-urlencoded

// let BASE_URL = 'http://192.168.2.158/'
let HOST = process.env.NODE_ENV
/* switch (HOST) {
    case 'development':
        BASE_URL = '';
        break;
    case 'production':
        axios.defaults.baseURL = "http://127.0.0.1:7654"
        break;
    default:
        break;
} */
axios.create({
  crossDomain: true, //设置cross跨域
  withCredentials: false, //跨域请求是否允许携带cookie资源凭证
  timeout: 1000 //请求超时时间
  // responseType:"arraybuffer"  返回的数据格式
})
axios.defaults.timeout = 5000

//  request请求拦截器
axios.interceptors.request.use(
  config => {
    // let token=localstorage.getItem('token');
    // token && (config.headers.Authorization=token);//请求携带token
    // config.headers = {
    //     'Content-Type': 'application/x-www-form-urlencoded'  //转换数据格式
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 成功状态 有3的接口一般是资源重定向
// service.defaults.validateStatus=status=>{
//     return /^(2|3)\d{2}$/.test(status);
// };

// response响应拦截器
axios.interceptors.response.use(
  response => {
    setTimeout(() => {}, 300)
    return response
  },
  error => {
    setTimeout(() => {}, 300)
    let { response } = error
    if (response) {
      //服务器有返回内容
      var errormsg = ''
      switch (response.status) {
        case 400:
          errormsg = '错误请求'
          break
        case 401:
          errormsg = '未登录,请重新登录'
          break
        case 403:
          errormsg = '决绝访问'
          break
        case 404:
          errormsg = '请求错误，未找到该资源'
          break
        case 405:
          errormsg = '请求方法未允许'
          break
        case 408:
          errormsg = '请求超时'
          break
        case 500:
          errormsg = '服务器出错'
          break
        case 501:
          errormsg = '网络未实现'
          break
        case 502:
          errormsg = '网络错误'
          break
        case 503:
          errormsg = '服务不可用'
          break
        case 504:
          errormsg = '网络超时'
          break
        case 505:
          errormsg = 'http版本不支持该请求'
          break
        default:
          errormsg = '连接错误'
      }
      return false
    } else {
      //服务器连结果都没有返回  有可能是断网或者服务器奔溃
      if (!window.navigator.online) {
        //断网处理
        return
      } else {
        //服务器奔了
        return Promise.reject(error)
      }
    }
  }
)

/*
 *get 方法，对应get请求
 *@param {String} url [请求的url地址]
 *@param {Object} params[请求携带的参数]]
 */

export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/*
 *post 方法，对应post请求
 *@param {String} url [请求的url地址]
 *@param {Object} params[请求携带的参数]]
 */

export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

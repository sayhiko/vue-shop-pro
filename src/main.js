import Vue from 'vue'
import App from './App'
import router from './router'
// 引入axios做相关配置
import axios from 'axios'
// 引入global.css全局样式
import './assets/css/global.css'
// 引入font字体图标样式
import './assets/fonts/iconfont.css'
// 引入組件庫
import ElementUI from 'element-ui'
// 引入table-tree
import ZkTable from 'vue-table-with-tree-grid'
// 注册ZKTable
Vue.use(ZkTable)
// 把elementUI注册给Vue
Vue.use(ElementUI)
// 配置axios请求根地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios的请求拦截器 在其中设置token
axios.interceptors.request.use(
  function(config) {
    var token = window.sessionStorage.getItem('token')
    config.headers.Authorization = token
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
// 把axios配置给Vue的$http成员
Vue.prototype.$http = axios
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

import Vue from 'vue'
import App from './App'
// 引入axios做相关配置
import axios from 'axios'
import router from './router'
// 引入global.css全局样式
import './assets/css/global.css'
// 引入font字体图标样式
import './assets/fonts/iconfont.css'
// 引入組件庫
import ElementUI from 'element-ui'
// 把elementUI注册给Vue
Vue.use(ElementUI)
// 配置axios请求根地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 把axios配置给Vue的$http成员
Vue.prototype.$http = axios
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

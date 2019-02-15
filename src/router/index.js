import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld'
// 导入登录组件
import Login from '@/components/Login'
// 导入首页组件
import Home from '@/components/Home'
Vue.use(Router)

export default new Router({
  routes: [
    // { path: '/', component: HelloWorld },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})

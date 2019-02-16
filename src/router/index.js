import Vue from 'vue'
import Router from 'vue-router'
// 导入登录组件
import Login from '@/components/Login'
// 导入首页组件
import Home from '@/components/Home'
// 导入Welcome组件
import Welcome from '@/components/Welcome'
Vue.use(Router)
var router = new Router({
  routes: [
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        }
      ]
    }
  ]
})
// 给路由设置导航守卫
// 让守卫队token进行监听 有token就让登录,没有token跳转到登录页
router.beforeEach((to, from, next) => {
  // 请求的是login页面就直接通过
  if (to.path === '/login') {
    return next()
  }
  // 请求非登录 就判断token
  var token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  }
  next()
})
export default router

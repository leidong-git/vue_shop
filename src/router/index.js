import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import Home from '../components/home.vue'

Vue.use(VueRouter)

const routes = [

]

const router = new VueRouter({
  routes: [
    { path: '/', redirect: './login' },
    { path: '/login', component: Login },
    { path:'/home', component: Home}

  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to代表将要访问的路径
  //form 代表从哪个路径挑战而来
  //next 是一个函数，表示放行
  //next() 放行 next('./login') 强制跳转登录页
  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token');
  console.log(tokenStr);
  if(!tokenStr){
    return next('/login')
  }
  next();
})

export default router

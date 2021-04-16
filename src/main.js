import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入字体图标
import './assets/font-awesome/css/font-awesome.css'
// 导入全局样式表
import './assets/css/global.css'
// 引入table-tree
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 导入
import axios from 'axios'
// 进度条显示
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
// 进度条关闭
router.afterEach(() => {
  NProgress.done()
})
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$HTTP = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为可用组件
Vue.use(VueQuillEditor)
Vue.filter('dateFormat', function (originval) {
  const dt = new Date(originval)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

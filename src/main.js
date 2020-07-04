import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入字体图标
import './assets/font-awesome/css/font-awesome.css'
// 导入全局样式表
import './assets/css/global.css'
//导入
import axios from 'axios'
// axios.default.baseURI = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$HTTP = axios
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

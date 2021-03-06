import Vue from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import AntV from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import less from 'less'

// font-icon 可本地导入
import './assets/icon/iconfont.css'
// api接口
import api from './assets/api/api'
// MD5加密
import md5 from 'js-md5'
// 打印组件
import Print from 'vue-print-nb'
Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$md5 = md5
Vue.use(ElementUI);
router.beforeEach((to, from, next) => {
  if ((to.fullPath === '/login') || sessionStorage.getItem('token')) {
    next()
  } else {
    next('/login')
  }
})

Vue.use(AntV)
Vue.use(less)
Vue.use(Print)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

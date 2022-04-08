import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
import infiniteScroll from 'vue-infinite-scroll'
Vue.use(ElementUI)
Vue.use(infiniteScroll)
new Vue({
  router,
  store,
  //全局事件总线$bus配置
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  render: h => h(App)
}).$mount('#app')

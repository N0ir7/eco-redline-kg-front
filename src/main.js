import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
import VueAwesomeSwiper from 'vue-awesome-swiper'
 
//引入样式
import 'swiper/css/swiper.css'
 
Vue.use(VueAwesomeSwiper, /* { 全局组件的默认选项 } */)
Vue.use(ElementUI)
new Vue({
  router,
  store,
  //全局事件总线$bus配置
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  render: h => h(App)
}).$mount('#app')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import './css/WriteGroupLayout.css'
import './css/myGlobal.css'
import './css/writeGroupLayout.less'


// IE 浏览器支持全部变量Vuex，异步请求axios等，不然报错
import 'babel-polyfill'

// 异步请求
import axios from 'axios'
// 处理axiios（post）请求的参数,序列化对象或参数的js
import qs from 'qs'
// Vuex 组件与组件数据交互(配置文件)
import store from './store/store'
// 上传组件（第三方）
import uploader from 'vue-simple-uploader'

Vue.config.productionTip = false;
Vue.use(iview);
Vue.use(uploader);

// 添加到vue的属性上
Vue.prototype.axios = axios;
Vue.prototype.qs = qs;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
});

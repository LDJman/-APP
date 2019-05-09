// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './assets/icon/iconfont.css'
import qs from 'qs'

Vue.prototype.$axios = axios

// Vue.prototype.host = '/api'// 本机请求地址
Vue.prototype.host ='http://47.106.228.83:9001'//云服务器请求地址

// Vue.prototype.wshost = 'ws://127.0.0.1:9002'// 本机ws请求地址
Vue.prototype.wshost = 'ws://47.106.228.83:9002'// 云服务器ws请求地址


Vue.prototype.$qs = qs
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

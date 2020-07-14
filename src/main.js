/* eslint-disable no-console */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/css/weui.min.css"
import axios from 'axios'
import {apiUrl} from "./config";

axios.defaults.baseURL = apiUrl
import VueAxios from 'vue-axios'
import "lib-flexible/flexible.js"

Vue.config.productionTip = false
import PullTo from 'vue-pull-to'
import {get, post} from "./assets/js/http"
import {version} from "./version"
// console.log(Vue.config)
console.log(version)
// 通过use方法加载axios插件
// console.log(axios.defaults.baseURL)
Vue.prototype.get = get
Vue.prototype.post = post
Vue.component("pull-to", PullTo);
Vue.use(VueAxios, axios, PullTo);
new Vue({
    render: h => h(App),
    store,
    router
}).$mount('#app')

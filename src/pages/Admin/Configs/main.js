/* eslint-disable linebreak-style */
/* eslint-disable no-new */
import Vue from 'vue';
import router from './router';
import App from '~/App.vue';
import '~/common/plugin/axios';
// 自定义组件
import '~/publicComponent/components';
import '../common/stastic/style.less';
import '~/common/plugin/element';
import util from "../Configs/CommonFunction.js"

// axios请求
import https from './https.js';
Vue.prototype.https = https;
Vue.prototype.utilFn = util;

// 使用方法
// this.https.get('/nurse/nurse_infor', {
//   id: 1555
// }).then(res => {
//   console.log(res)
// })
// this.https.post('/nurse/nurse_infor', {
//   id: 1555
// }).then(res => {
//   console.log(res)
// })
new Vue({
  el: '#WebApp',
  router,
  render: h => h(App),
});

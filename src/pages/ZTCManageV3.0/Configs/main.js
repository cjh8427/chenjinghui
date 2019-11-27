import Vue from 'vue';
import router from './router';
import App from '~/App.vue';

// axios请求
import https from './https.js';
Vue.prototype.https = https;
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

// 自定义组件
import '~/publicComponent/components';
import '../common/stastic/style.less';
import '~/common/plugin/element';
import '~/pages/ZTCManageV3.0/System/Component/Common/TableMixin/install';
new Vue({
  el: '#WebApp',
  router,
  render: h => h(App),
});
import Vue from 'vue';
// 自定义组件
import '~/common/plugin/element';
import router from './router';
import App from '~/App.vue';
import '~/publicComponent/components';
import '~/stastic/bigdata_exztc.less';
import axios from 'axios'
import VueAMap from 'vue-amap';
import '~/common/plugin/directives'

import Store from "./store"

Vue.use(VueAMap);
Vue.prototype.$http = axios
Vue.config.productionTip = false




//配置发送请求前的拦截器 可以设置token信息 
axios.interceptors.request.use(
  config => {
    config.headers.token = localStorage.$demoToken
    console.log()
    return config
  },
  err => {
    // console.log(JSON.stringify(err))
    return Promise.reject(err)
  });


VueAMap.initAMapApiLoader({
  key: '6f713c69faa95286904fa173059eae94',
  plugin: ['AMap.PathSimplifier', 'AMap.SimpleMarker', 'Map3D', 'AMap.DistrictSearch', 'AMap.SimpleMarker', 'AMap.DistrictLayer', 'AMap.ControlBar', 'AMap.MouseTool', "AMap.PolyEditor", "MarkerClusterer", "AMap.InfoWindow", "AMap.Driving", "AMap.TruckDriving", "AMap.MassMarks", "AMap.Size", "AMap.GraspRoad"],
  v: '1.4.15',
  uiVersion: '1.0.11' // 版本号
});

new Vue({
  el: '#ExZtc',
  router: router,
  store: Store,
  render: h => h(App),
});
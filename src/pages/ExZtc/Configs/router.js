import Vue from 'vue';
import VueRouter from 'vue-router';

//引入页面模板文件
import NotFound from '~/publicComponent/Error/notFound'; //404页面
import Index from '~/pages/ExZtc/Home/Index'; //平台首页
import Monitor from '~/pages/ExZtc/ToolKit/Monitor';

Vue.use(VueRouter);


const routes = [{
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: Index,
    name:"实时监控",
    meta: {
      title: '实时监控', keepAlive: false
    },
    children: [{
      path: '/index',
      component: Monitor,
      meta: {
        title: '实时监控', keepAlive: false
      },
    }, {
      path: '/monitor',
      component: Monitor,
      meta: {
        title: '实时监控', keepAlive: false
      },
    }]
  },
  {
    path: '*',
    component: NotFound
  },
];


const router = new VueRouter({
  routes: routes
})

router.beforeEach((to, from, next) => {
  let platformName = '武汉市建筑垃圾智慧监管平台'
  // console.log(to)
  setTimeout(function () {
    var title = to.meta.title ? to.meta.title + ' | ' + platformName : platformName
    window.document.title = title
  }, 300)
  next();

})


export default router;
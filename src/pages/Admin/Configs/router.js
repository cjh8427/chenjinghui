import Vue from 'vue';
import VueRouter from 'vue-router';

//引入页面模板文件
import NotFound from '~/publicComponent/Error/notFound'; //404页面
import dHome from '~/pages/Admin/Home/dHome'; //Demo演示平台首页
import TableFrame from '~/pages/Admin/Components/Public/TableFrame'
import mapView from '~/pages/Demo/System/mapViewHtml'

import Login from '~/pages/Admin/Login/Login'; //登录页面





import AlarmRule from '../Components/Pages/SystemManage/AlarmRule.vue'; //报警规则
import Enterprise from '../Components/Pages/SystemManage/Enterprise.vue'; //企业管理
import Role from '../Components/Pages/SystemManage/Role.vue'; //角色
import RolePermission from '../Components/Pages/SystemManage/RolePermission.vue'; //角色权限
import User from '../Components/Pages/SystemManage/User.vue'; //用户
import Vehicle from '../Components/Pages/SystemManage/Vehicle.vue'; //车辆
import MenuManage from '../Components/Pages/SystemManage/Menu.vue'; //菜单管理


Vue.use(VueRouter);

const routes = [{
    path: '/',
    redirect: '/Index'
  },
  {
    path: '/Login',
    component: Login,
    title: '登录'
  },
  // {
  //   path: '/index',
  //   component: dHome,
  //   title:'首页',
  //   children: [{
  //     path: '/index',
  //     component: setupMenu
  //   },{
  //     path: '/system/menu',
  //     component: setupMenu
  //   },{
  //       path: '/system/mapView',
  //       component: mapView
  //   }]
  // },
  {
    path: '/Index',
    component: dHome,
    meta: {
      requireAuth: true,
      title: '平台管理',
      keepAlive: true
    },
    children: [{
      path: '/Index',
      component: TableFrame,
      meta: {
        requireAuth: true,
        title: '报警规则管理',
        keepAlive: true
      },
      children: [{
          path: '/Index',
          component: AlarmRule,
          meta: {
            requireAuth: true,
            title: '报警规则管理',
            keepAlive: true
          }
        },
        {
          path: '/AlarmRule',
          component: AlarmRule,
          meta: {
            requireAuth: true,
            title: '报警规则管理',
            keepAlive: true
          }
        },
        {
          path: '/Enterprise',
          component: Enterprise,
          meta: {
            requireAuth: true,
            title: '企业管理',
            keepAlive: true
          }
        },
        {
          path: '/Role',
          component: Role,
          meta: {
            requireAuth: true,
            title: '角色管理',
            keepAlive: true
          }
        },
        {
          path: '/RolePermission',
          component: RolePermission,
          meta: {
            requireAuth: true,
            title: '角色权限管理',
            keepAlive: true
          }
        },
        {
          path: '/User',
          component: User,
          meta: {
            requireAuth: true,
            title: '用户管理',
            keepAlive: true
          }
        },
        {
          path: '/Vehicle',
          component: Vehicle,
          meta: {
            requireAuth: true,
            title: '车辆管理',
            keepAlive: true
          }
        },
        {
          path: '/Menu',
          component: MenuManage,
          meta: {
            requireAuth: true,
            title: '菜单管理',
            keepAlive: true
          }
        }
      ]
    }]
  },
  {
    path: '*',
    component: NotFound
  },
];

export default new VueRouter({
  routes
});
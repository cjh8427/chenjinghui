import Vue from 'vue';
import VueRouter from 'vue-router';

//引入页面模板文件

/**官网首页*/
import WebIndex from '~/pages/ZTCManageV3.0/System/OfficialWeb/Index'; //官网首页
import NorthPlus from '~/pages/ZTCManageV3.0/System/OfficialWeb/NorthPlus'; //北斗+车联网
import ConnectCar from '~/pages/ZTCManageV3.0/System/OfficialWeb/ConnectCar'; //车联网智能装备
import EnterpriseDetail from '~/pages/ZTCManageV3.0/System/OfficialWeb/EnterpriseDetail'; //公司简介
import ContactUs from '~/pages/ZTCManageV3.0/System/OfficialWeb/ContactUs'; //联系我们

/**其他页面*/
import NotFound from '~/publicComponent/Error/notFound'; //404页面
import dHome from '~/pages/ZTCManageV3.0/Home/dHome'; //依迅北斗用户中心
import LoginEnterprise from '~/pages/ZTCManageV3.0/System/LoginEnterprise'; // 企业登录
import RegisterEnterprise from '~/pages/ZTCManageV3.0/System/RegisterEnterprise'; // 企业注册
import ResetPassword from '~/pages/ZTCManageV3.0/System/ResetPassword'; // 重置密码

/**设备管理*/
import DeviceManage from '~/pages/ZTCManageV3.0/System/DeviceManage';

/**用户信息*/
import UserInfo from '~/pages/ZTCManageV3.0/System/UserInfo/UserInfo';
import UserInfoMyInfo from '~/pages/ZTCManageV3.0/System/UserInfo/UserInfo_my_info';
import UserInfoPassword from '~/pages/ZTCManageV3.0/System/UserInfo/UserInfo_password';
import UserInfoPhone from '~/pages/ZTCManageV3.0/System/UserInfo/UserInfo_phone';
import UserInfoAddress from '~/pages/ZTCManageV3.0/System/UserInfo/UserInfo_address';

/**计算服务*/
import serviceList from '~/pages/ZTCManageV3.0/System/compuServe/serviceList';

/**用户中心*/
import UserCenter from '~/pages/ZTCManageV3.0/System/UserCenter/index';
import mycenter from '~/pages/ZTCManageV3.0/System/UserCenter/mycenter';
import mycenterPlatform from '~/pages/ZTCManageV3.0/System/UserCenter/mycenter_platform';
import mycenterDevice from '~/pages/ZTCManageV3.0/System/UserCenter/mycenter_device';
import mycenterOrder from '~/pages/ZTCManageV3.0/System/UserCenter/mycenter_order';
import buyPlatform from '~/pages/ZTCManageV3.0/System/UserCenter/buyPlatform';
import buyDevice from '~/pages/ZTCManageV3.0/System/UserCenter/buyDevice';
import buyPlatformDetail from '~/pages/ZTCManageV3.0/System/UserCenter/buyPlatform_detail';
import buyDeviceDetail from '~/pages/ZTCManageV3.0/System/UserCenter/buyDevice_detail';

import noService from '~/pages/ZTCManageV3.0/System/compuServe/noService';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        redirect: '/OfficialWeb'
    },
    {
        path: '/OfficialWeb',
        component: WebIndex,
        title: '官网首页',
        children: [{
            path: '/OfficialWeb/NorthPlus',
            component: NorthPlus,
        },{
            path: '/OfficialWeb/ConnectCar',
            component: ConnectCar,
        },{
            path: '/OfficialWeb/EnterpriseDetail',
            component: EnterpriseDetail,
        },{
            path: '/OfficialWeb/ContactUs',
            component: ContactUs,
        }]

    },
    {
        path: '/login/Enterprise',
        component: LoginEnterprise,
        title: '登录'
    },
    {
        path: '/login/ResetPassword',
        component: ResetPassword,
        title: '重置密码'
    },
    {
        path: '/register/Enterprise',
        component: RegisterEnterprise,
        title: '注册'
    },
    {
        path: '/index',
        component: dHome,
        title: '首页',
        children: [{
            path: '/index',
            component: UserCenter,
        }, {
            path: '/system/DeviceManage',
            component: DeviceManage
        }, {
            path: '/system/UserCenter',
            component: UserCenter,
            children: [{
                path: '/system/UserCenter/mycenter',
                component: mycenter,
                children: [{
                    path: '/system/UserCenter/mycenter/platform',
                    component: mycenterPlatform
                }, {
                    path: '/system/UserCenter/mycenter/Device',
                    component: mycenterDevice
                }, {
                    path: '/system/UserCenter/mycenter/Order',
                    component: mycenterOrder
                }, {
                    path: '/system/UserCenter/mycenter/buyPlatformDetail',
                    component: buyPlatformDetail
                }, {
                    path: '/system/UserCenter/mycenter/buyDeviceDetail',
                    component: buyDeviceDetail
                }]
            }, {
                path: '/system/UserCenter/buyPlatform',
                component: buyPlatform
            }, {
                path: '/system/UserCenter/buyDevice',
                component: buyDevice
            }]
        }, {
            path: '/system/UserInfo',
            component: UserInfo,
            children: [{
                path: '/system/UserInfo/myInfo',
                component: UserInfoMyInfo
            },{
                path: '/system/UserInfo/password',
                component: UserInfoPassword
            },{
                path: '/system/UserInfo/phone',
                component: UserInfoPhone
            },{
                path: '/system/UserInfo/address',
                component: UserInfoAddress
            }]
        }, {
                path: '/system/serviceList',
                component: serviceList
        }, {
            path: '/system/noService',
            component: noService
        },]
    },
    {
        path: '*',
        component: NotFound
    },
];

export default new VueRouter({
    routes
});
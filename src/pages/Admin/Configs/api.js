let api = {
    //登录页
    GetLogin: '/bs/bb/sys/user/login', //登录接口
    GetMenuUrl: '/bs/SysMenu/initQueryMenu', //获取菜单
    GetPlatUrl: '/bs/SysDiction/initPlatForm', //根据域名获取平台信息

    //部门管理
    PostTableCfgUrl: '/bs/bb/config/query', //获取报表组成配置
    PostDeptTreeUrl: '/bs/base/tree', //获取部门树
    PostDeptDataUrl: '/bs/bb/curd', //获取部门表格数据
    PostSettingPermisionUrl: '/bs/bb/sys/role/settingPermission', //提交权限
}

module.exports = api
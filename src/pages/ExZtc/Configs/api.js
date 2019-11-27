let api = {
    host: "http://api2.ztc.comlbs.com",
    // host: "http://api.yc.comlbs.com",
    // host: "/api2",

    //用户登录及信息获取
    GetLogin: "/api/Login/GetAccountLogin",
    GetUserInfo: "/api/Login/GetUserInfo",




    //
    GetOnlinePointsUrl: "/api/Vehicle/GetOnlinePoints",
    GetVehicleListUrl: "/api/Vehicle/GetVehicleList",
    PostQueryCircleUrl: "/api/WebApp/QueryCircle",
    //单车实时状态
    GetDevVehicleStateUrl: "/api/AppVehicleData/GetDevVehicleState",
    //单车轨迹查询
    GetHisLocPayUrl: "/api/AppVehicleStat/HisLocPay",
    //获取报警信息
    QueryAlarmStatUrl: "/api/AppVehicleStat/QueryAlarmStat",


    //
    GetFenceListUrl: "/api/AppReports/GetFenceList",
    //获取车辆列表数据
    GetVehicleListUrl: "/api/WebApp/GetVehicleList",
    //获取工地数据
    GetSiteListUrl: "/api/WebApp/GetHomeSite",
    // GetSiteListUrl: "/api/Site/GetSiteList",
    GetSiteUrl: "/api/AppReports/GetHomeSite",
    //获取消纳点数据
    GetUnloadUrl: "/api/Unload/GetUnload",
    //获取工地数据
    // GetSiteListUrl: "/api/AppReports/GetSiteList", //POST
    //获取企业上线率
    GetEnterpriseTheWholePointUrl: "/api/AppReports/GetEnterpriseTheWholePoint",


}


module.exports = api
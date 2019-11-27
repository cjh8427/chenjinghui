/*
 MapView-3.0.0 code for exsun

 Copyright©2015-2019 武汉依迅北斗空间技术有限公司 All Rights Reserved.

 http://www.exsun.cn
 */(function (window, document, L, $) {/*
 {NAME}-{VERSION} code for exsun

 Copyright©2015-2019 武汉依迅北斗空间技术有限公司 All Rights Reserved.

 http://www.exsun.cn
 */

ES.MapView = {};
ES.MapView.version = '3.0.0';
// 存储页面公共的模块
ES.MapView.Page = ES.Page.extend({
    //页面id
    initialize: function (id, options) {
        ES.Page.prototype.initialize.call(this, id, options);
        // 全局对象，用于判断详细页面加载的内容ex-layout-cardetail-content
        this.$_oDivVehDetail = $('.ex-layout-cardetail');
        this.initEven();
    },
    // 权限判定
    AuthValue:function(oData,ulObj){
        for(var key in oData){
            if(oData[key].split(" ")[1].split("=")[1] == "false"){
                ulObj.find("li[menu-flag='"+key+"']").css('display',"none");
            }
        }
    },
    // 注册弹出层事件
    _getVecMarkerHtml: function (oGpsInfo) {
        var cDir = ES.TrackHelper.getDire(oGpsInfo.dir);
        var cMsg = ES.TrackHelper.getDateMsg(oGpsInfo.gpsTime);
        var oTemp = {};

        ES.extend(oTemp, oGpsInfo, {
            cMsg: cMsg,
            cDir: cDir,
            Mileage: oGpsInfo.mile ,
            cGpsDate: ES.Util.dateFormat(oGpsInfo.gpsTime, "yyyy-MM-dd hh:mm:ss"),
            cVehicleStatus: oGpsInfo.currentState || '通讯中断',
            cPoiInfo: oGpsInfo.poi || '',
            map: oGpsInfo.currentState === "通讯中断"||oGpsInfo.currentState === "定位失败" ? 'off' : 'on',
            key: oGpsInfo.status[0] === '1' ? 'on' : '',
            open: oGpsInfo.status[1] === '1' ? 'on' : '',
            signal: oGpsInfo.currentState !== "通讯中断" ? 'on' : '',
            entName:oGpsInfo.entName || '暂无'
        });
        var cHtml =
            '<div class="ex-maptip-wtm"> ' +
            '   <div class="ex-maptip-wtm-content">' +
            '       <div class="ex-content-info-box">' +
            '            <div class="ex-content-info-car ec-u-sm-6">' +
            '               <h3>{vehNo}</h3>' +
            '               <div class="ex-content-img"><img src="../img/mapview/truck_144.png" alt="" /></div>' +
            '               <ul>' +
            '                   <li><i class="ec-icon-car"></i><span>{entName}</span></li>' +
            // '                   <li><i class="ec-icon-user"></i><span>{deptName}</span></li>' +
            // //'                   <li><i class="ec-icon-map-signs"></i><span>{weigth}</span></li>' +
            '               </ul>' +
            '           </div>' +
            '           <div class="ex-content-info-state ec-u-sm-6">' +
            '               <ul>' +
            '                   <li><span>{cGpsDate}{cMsg}</span></li>' +
            '                   <li><strong>状态：</strong><span>{cVehicleStatus}</span></li>' +
            '                   <li><strong>速度：</strong><span>{speed} (Km/h)</span></li>' +
            //'                   <li><strong>载重：</strong><span>{weight}</span></li>' +
            //'                   <li><strong>今日：</strong><span></span></li>' +
            '                   <li><strong>里程：</strong><span>{Mileage} Km</span></li>' +
            '                   <li><strong>位置：</strong><span>{cPoiInfo}</span></li>' +
            '               </ul>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="ex-maptip-wtm-tool">' +
            '       <ul class="tool-btn ec-avg-sm-4 ec-u-sm-10">' +
            '           <li><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-truck"> 详情 </a></li>' +
            '           <li><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 轨迹 </a></li>' +
            '           <li><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-cloud"> 下发指令 </a></li>' +
            '           <li><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-video-camera"> 视频 </a></li>' +
            '        </ul>' +
            '       <ul class="tool-state ec-avg-sm-4 ec-u-sm-6">' +
            // '           <li><i class="GPS {map}"></i></li>' +
            //'           <li><i class="ACC {key}"></i></li>' +
            // '           <li><i class="signal {signal}"></i></li>' +
            //'           <li><i class="door {open}"></i></li>' +
            '        </ul>' +
            '   </div>' +
            '</div>';

        var cHtml = ES.Util.template(cHtml, oTemp);
        return cHtml;
    },
    toHeartModle: function (aoData) {
        var aoGps = [];
        if (!aoData ||  aoData.length <= 0) {
            return aoGps;
        }
        var cImg = '/Asset/img/ex_default/law_144.png'
        if(ES.MapView.oConfig.systemFlag ==='truck')
        {
            cImg= '/Asset/img/ex_default/truck_144.png'
        }
        for (var i = 0; i < aoData.length; i++) {
            var vehGpsData = aoData[i].vehGpsData
            var mapLatLng = vehGpsData.Poi.MapPoint;

            var oModel = {
                vehNo: aoData[i].vehNo,
                devNo: aoData[i].devNo,
                latLng: {lat:mapLatLng.Lat,lng:mapLatLng.Lon},
                gpsDate: vehGpsData.GpsDateTime,
                dir: vehGpsData.Direction,
                poi:  vehGpsData.Poi.Address,
                speed: vehGpsData.Speed,
                status: vehGpsData.Status,
                attach: vehGpsData.Property,
                sta: vehGpsData.VehicleStatus,
                mile: (vehGpsData.Mileage / 1000).toFixed(2),
                gpsTime: ES.Util.toDate(vehGpsData.GpsDateTime).getTime(),
                img:cImg,
                entName:vehGpsData.CompanyName,
                // weight:aoData[i].sWeightValue || aoData[i].Property.ZtWeightValue,
            };
            aoGps.push(oModel);
        }
        return aoGps;
    },
    toHeartModleForSingle: function (aoData) {
        var aoGps = '';
        if (!aoData) {
            return aoGps;
        }
        var cImg = '/Asset/img/ex_default/law_144.png'
        if(ES.MapView.oConfig.systemFlag ==='truck')
        {
            cImg= '/Asset/img/ex_default/truck_144.png'
        }
        var vehGpsData = aoData.vehGpsData
        var mapLatLng = vehGpsData.Poi.MapPoint;

        var aoGps = {
            vehNo: aoData.vehNo,
            devNo: aoData.devNo,
            latLng: {lat:mapLatLng.Lat,lng:mapLatLng.Lon},
            gpsDate: vehGpsData.GpsDateTime,
            dir: vehGpsData.Direction,
            poi:  vehGpsData.Poi.Address,
            speed: vehGpsData.Speed,
            status: vehGpsData.Status,
            attach: vehGpsData.Property,
            sta: vehGpsData.VehicleStatus,
            mile: (vehGpsData.Mileage / 1000).toFixed(2),
            gpsTime: ES.Util.toDate(vehGpsData.GpsDateTime).getTime(),
            img:cImg,
            entName:vehGpsData.CompanyName,
        };
        return aoGps;
    },
    //判断载重
    weightStatus:function(n,Status){
        if(!n){n=0}
        var _weight = parseInt(n);

        if(_weight<=1){
            return "空载";
        }else{
            if($.inArray(15,Status)>=0){
                return "超载";
            }else{
                return "满载";
            }
        }
    },
    getVstatus:function(aoData){
        if (!aoData ||  aoData.length <= 0) {
            return ;
        }
        for (var i = 0; i < aoData.length; i++) {
            var Item = aoData[i];
            var Vstatus={acc:0,gps:0};
            for(var j=0;j<Item.Status.length;j++){
                if(Item.Status[j]==1){
                    Vstatus.acc=1;
                }else if(Item.Status[j]==2){
                    Vstatus.gps=1;
                }
            }
            //状态判定
            if( Date.parse(new Date()) - ES.Util.toDate(Item.GpsDateTime).getTime() <= 600000){
                if(Item.Speed>0 && Vstatus.gps == 1 ){
                    Item.VehicleStatus="行驶";
                }else if(Item.Speed == 0 && Vstatus.gps == 1 && Vstatus.acc==0){
                    Item.VehicleStatus="熄火";
                }else if(Item.Speed == 0 && Vstatus.gps == 1 && Vstatus.acc==1){
                    Item.VehicleStatus="停车";
                }else if(Vstatus.gps == 0){
                    Item.VehicleStatus="定位失败";
                }
            }else{
                Item.VehicleStatus="通讯中断";
            }
        }
        return aoData;
    },
    getDetailStatus: function () {
        var nFlag = this.$_oDivVehDetail.data("nFlag")
        return (nFlag || 0);
    },
    setDetailStatus: function (nFlag) {
        this.$_oDivVehDetail.data("nFlag", nFlag);
    },
    initEven: function () {
        var self = this;
        $(".ex-layout-cardetail-close.ec-close").eq(0).bind('click', this, function () {
            // 显示X按钮
            self.setBtn0();
            // 隐藏 实时监控 、轨迹回放
            self.fire("MapView:VehDetail.hideTrack");
            // 设置地图高度 h - 0
            self.fire("MapView:Map.setMapConterH", { nH: 0, nTick: 150 });
        });
        // 向下箭头
        $(".ex-layout-cardetail-close.ec-close").eq(1).bind('click', this, function () {
            // 显示向上箭头
            self.setBtn2();
            // 隐藏实时跟踪的
            self.fire("MapView:TrackLst.hideTrack");
            //地图显示为 h - 40
            self.fire("MapView:Map.setMapConterH", { nH: 40, nTick: 150 });
        });
        $(".ex-layout-cardetail-close.ec-close").eq(2).bind('click', this, function () {
            // 显示向下按钮
            self.setBtn1();
            // 显示实时跟踪的高度
            self.fire("MapView:TrackLst.reShowTrack");
        })
    },
    //设置按钮样式
    setBtn0: function () {
        //MapShowDetail
        $("#MapShowDetail>a").eq(0).show();
        $("#MapShowDetail>a").eq(1).hide();
        $("#MapShowDetail>a").eq(2).hide();
    },
    //设置按钮样式
    setBtn1: function () {
        //MapShowDetail
        $("#MapShowDetail>a").eq(0).hide();
        $("#MapShowDetail>a").eq(1).show();
        $("#MapShowDetail>a").eq(2).hide();
    },
    //设置按钮样式
    setBtn2: function () {
        //MapShowDetail
        $("#MapShowDetail>a").eq(0).hide();
        $("#MapShowDetail>a").eq(1).hide();
        $("#MapShowDetail>a").eq(2).show();
    },
    openRight:function(){
        var _class=$('.ex-layout-sider:visible').width()==220?'ex-hidden-sm':'ex-hidden';
        $('.ex-layout-menu').removeClass(_class);
        $('.ex-layout-sider').removeClass(_class);
        $(window).resize( );
    },
    hiddenRight:function(){
        var _class=$('.ex-layout-sider:visible').width()==220?'ex-hidden-sm':'ex-hidden';
        $('.ex-layout-menu').addClass(_class);
        $('.ex-layout-sider').addClass(_class);
        $(window).resize( );
        // if(!this.hiddenOnce){
        //     setTimeout(function(){
        //         $(window).resize( );
        //         this.hiddenOnce=true;
        //     },1000)
        // }
    },
    rightEvent:function(){
        var self = this;
        this.hiddenOnce = false;

        $('.ex-right-switch.hidden').bind('click',function(){
            self.hiddenRight()
            $(this).hide().siblings('.open').show();
        });
        $('.ex-right-switch.open').bind('click',function(){
            self.openRight();
            $(this).hide().siblings('.hidden').show();
        });
    }
});

/**
 * 用户项目启动文件
 * Created by Eric_Fu on 2019-09-06
 */

$(function () {
    var nMapHeight = $(window).height();
    var nMapWidth = $(window).width() - 260;
    var m_oParam = ES.Util.getArgs();
    // var m_cHost = "http://192.168.1.244:30000";
    var m_cHost = "http://api.bdlbs.comlbs.com";
    ES.MapView.oConfig = {

        // 地图中心点位置
        mainCenter:{lat:30.5984342798,lng:114.3118287971}, //武汉中心点
        // mainCenter:{lat:31.17547255,lng:115.00334782}, //麻城中心点

        // 资产树
        deptTree: {
            plugins: ['types', 'search', 'unique', "checkbox"],
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true, 'checked': true},
                'data': function (obj, callback) {
                    var self = this;
                    var oReqParam = {
                        type: 'POST',
                        url: m_cHost + '/base/tree',
                        headers: {
                            token: m_oParam.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        },
                        dataType: 'json',
                        data: '{"tree":"dept"}',
                        success: function (oData) {
                            oData.detail[0].state = {opened: true, selected: true};
                            callback.call(self, oData.detail);
                        },
                        error: function () {
                            callback.call(self, null);
                        },
                    }
                    $.ajax(oReqParam);

                }
            },

            // 表示勾选有效
            'checkbox': {
                'tie_selection': false
            }
        },

        // 单选树
        deptSingleTree: {
            plugins: ['types', 'search', 'unique'],
            core: {
                'animation': 0,
                'state': {'opened': true},
                'data': function (obj, callback) {
                    var self = this;
                    var oReqParam = {
                        type: 'POST',
                        url: m_cHost + '/base/tree',
                        headers: {
                            token: m_oParam.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        },
                        dataType: 'json',
                        data: '{"tree":"vehTree"}',
                        success: function (oData) {
                            // oData.detail[0].state = {opened: true, selected: true};
                            callback.call(self, oData.detail);
                        },
                        error: function () {
                            callback.call(self, null);
                        },
                    }
                    $.ajax(oReqParam);

                }
            },

            // 表示勾选有效
            'checkbox': {
                'tie_selection': false
            }
        },

        token: m_oParam.token,

        //围栏树
        FenceTree: {
            plugins: ['types', 'search', 'unique', "checkbox"],
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': function (obj, callback) {
                    var self = this;
                    var oReqParam = {
                        type: 'POST',
                        url: m_cHost + '/base/tree',
                        headers: {
                            token: m_oParam.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        },
                        dataType: 'json',
                        data: '{"tree":"dept"}',
                        success: function (oData) {
                            oData.detail[0].state = {opened: true, selected: false};
                            callback.call(self, oData.detail);
                        },
                        error: function () {
                            callback.call(self, null);
                        },
                    }
                    $.ajax(oReqParam);

                }
            },
            // 表示勾选有效
            'checkbox': {
                'tie_selection': false
            },
        },

        // 部门查车
        lineVehLstUrl: m_cHost + '/bb/map/mapview',
        // 车辆列表url
        vehLstUrl: m_cHost + '/bb/map/mapview',
        // 获得关注列表
        // getFollowVeh: m_cHost + '/bb/map/mapview',
        getFollowVeh: m_cHost + '/bb/map/UserVehicle',
        // 活动关注车辆信息
        getFollowVehIds: m_cHost+'/bb/map/UserVehicle',
        // 获得用户报警类型
        getAlarmType: m_cHost+'/bb/map/UserAlarm',

        FenceVehLstUrl: m_cHost + '/bb/map/mapview',
        FenceMapUrl: m_cHost + '/bb/map/mapview',

        // 获得聚合点数据集合
        getVehsLoc: m_cHost + '/bb/base/vehicle/getVehicleData',

        // 获得车辆实时位置
        curPosUrl: m_cHost + '/bb/map/GetLocByDeviceNo',
        // 添加关注
        followVehUrl: m_cHost + '/MapView/FollowVeh',
        // 取消关注
        unfollowVehUrl: m_cHost + '/MapView/UnfollowVeh',

        // 没有分组获取车辆信息
        getVehsDetailLoc: m_cHost + '/MapView/GetVehsDetailLoc',

        getAlarmDetailPaing: m_cHost + '/MapView/AlarmTop5',

        // 获得地图线路数据
        getLineByIds: m_cHost + '/Line/GetLineByIds',

        mapAreaLocal: m_cHost + '/MapView/mapAreaLocal',

        //告警车辆
        AlarmVehLstUrl: m_cHost + '/MapView/QueryAlarmlVeh',

        nPagerBtnCnt: 7,

        // 最大分页数
        nMaxPageSize: 10,

        //工地
        oSiteConfig: {
            stroke: true,
            color: '#0FFF05',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: true,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false

        },

        //可疑工地
        oSuspicSiteConfig: {
            stroke: true,
            color: 'orange',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: true,
            fillColor: 'orange',
            fillOpacity: 0.2,
            clickable: true,
            smoothFactor: 1.0,
            noClip: false
        },

        // 监控最大车辆数
        nMonitorCnt: 1,

        //顶棚
        carMask: 15,

        // 顶灯
        carLight: 1,

        // 载重
        echartsWeight: 12,

        // 系统名称
        systemFlag: 'truck',
    };

    // 页面通信参数
    var oPage = new ES.MapView.Page('MapView', {});

    // 菜单
    new ES.MapView.Menu(oPage, {});

    // 容器内容布局
    var oLayoutContent = new ES.MapView.LayoutContent(oPage, { nWidth: nMapWidth-220, nHeight: nMapHeight });
    oLayoutContent.setWidth($(window).width() - 440 - 40 - 80);


    // 地图布局
    var oMapLayout = new L.MapLib.MapControl.Layout(oPage, { cDidId: 'MapView' });
    oMapLayout.addToolItem({cHTML:'<div class="ex-right-switch hidden"></div><div class="ex-right-switch open" style="display: none;"></div>'});

    oPage.rightEvent();

    // 初始化地图控件
    var oMapMaster = new L.MapLib.MapMaster.Map(oPage, {
        cDidId: 'MapView',
        oMapOption: {
            zoomControl: false,
            layers: [],
            center: ES.MapView.oConfig.mainCenter,
            zoom: 10,
            attributionControl:false,

        },
        //瓦片参数
        oTileOption: {
            maxZoom: 18,
            minZoom: 3,
            attribution: 'Map &copy;GB-20263—2019 <a href="http://www.exsun.cn">武汉依迅Exsun</a>'
        },
        nMapWidth: nMapWidth,
        nMapHeight: nMapHeight
    });

    // 加载地图
    oMapMaster.loadMapMaster();

    L.control.attribution({prefix:''}).addTo(oMapMaster.getMap());

    // 监听 改变 左边结构的宽度 的事件
    oPage.on('MapView:LayoutContent.resize', function (oData) {
        // 更改地图的 宽度
        //oMapMaster.reflesh(oData.nWidth);
        oLayoutContent.reflesh($(window).width() - 440 - 40, $(window).height());
        refleshMap(oData.nWidth);
    });

    oPage.on('MapView:Menu.resize', function (oData) {
        // 更改地图的 宽度
        var nWidth = $(window).width() - $('.ex-layout-sider:visible').width() -oData.nWidth;
        oLayoutContent.setWidth(nWidth);
        oMapLayout.setWidth(nWidth);
        //oMapMaster.reflesh(nWidth);
    });

    // 工具条
    new L.MapLib.MapControl.ESMapToolBox(oMapMaster, {
        acParentDivClass: [
            'ex-layout-maptool',
            'ex-theme-maptool',
            'ex-map-top',
            'ex-map-right'
        ]});

    // 地图瓦片
    new L.MapLib.MapControl.ESMapTile(oMapMaster, {
        acParentDivClass: [
            'ex-layout-maptool',
            'ex-theme-maptool',
            'ex-map-top',
            'ex-map-right'
        ]
    });

    // 全屏显示
    new L.MapLib.MapControl.ESMapFull(oMapMaster, { });

    new ES.MapView.LiveMange(oPage,{});

    var oVehLayer = new ES.MapView.VehClusterLayer(oPage, {});
    oVehLayer.getData();

    // new ES.MapView.VehClusterMange(oPage,{});

    // ES.getData({},ES.MapView.oConfig.getVehsLoc, function (oData) {
    //     for(var i = 0;i<oData.length;i++){
    //         var newLayer = new ES.MapView.VehClusterLayer(oPage, {maxItem:oData[i].items.length,areaName:oData[i].name});
    //         newLayer.drawLayers({aoData: oData[i].items});
    //     }
    // }, this);

    // new ES.HubSvr(oPage,{
    //     cHubUrl:'http://signalr.hgt.comlbs.com/signalr',
    //     // Gps 推送
    //     aoClientName:[
    //         {cSvrFn:'handlerGps',on:'HubSvr:setGpsInfo'},
    //         {cSvrFn:'handlerAlarm',on:'HubSvr:setSingleAlarmInfo'}]
    // });

    //工地layer
    new ES.MapView.SiteLayer(oPage,{});
    // //围栏layer
    new ES.MapView.FenceLayer(oPage,{});
    //
    new ES.MapView.FrameTab(oPage,{});

    new ES.MapView.PoiSearch(oMapMaster,{});

    new ES.MapView.RefreshLoc(oPage,{});
    //
    new ES.MapView.TypeExample(oPage,{})//地图图例

    // 界面改变是 出发的事件
    $(window).resize(function () {
        var nHeight = $(window).height();
        //var nWidth = oMenu.getWidth();
        var nWidth = $(window).width() - 440 - 40 - 80;
        if($('.ex-layout-menu').hasClass('ex-hidden')||$('.ex-layout-menu').hasClass('ex-hidden-sm')){
            var nMapWidth = $(window).width();
        }else{
            var nMapWidth = $(window).width()- $('.ex-layout-sider:visible').width() -40;
        }

        refleshMap(nMapWidth, nHeight);

        oLayoutContent.reflesh(nWidth, nHeight);
        // 广播消息
        oPage.fire('window:resize');
    });


    function refleshMap(nW, nH) {
        if (!oMapMaster._oMap) {
            return;
        }
        var oContainer = oMapMaster._oMap.getContainer();
        if (nW) {
            oContainer.style.width = nW + 'px';
        }
        if (nH) {
            oContainer.style.height = nH + 'px';
        }

        //oMapMaster._oMap._onResize();
        oMapMaster._oMap.invalidateSize({animate:true,pan:false,debounceMoveend:false});
        //setTimeout(function(){oMapMaster._oMap.invalidateSize({animate:true,pan:false,debounceMoveend:false});},200);

    };
});

ES.MapView.LayoutContent = ES.Evented.extend({

    cHTML:'<div class="ex-layout-content" style="float:left"></div>',

    oOption: {
        cPContainer: '.ex-layout-main',
        nWidth:1000,
        nHeight:500,
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        // 初始化界面
        this.initUI();

        this.initOn();
    },

    initOn: function () {
        this._oParent.on('MapView:LayoutContent.resize',this.resize,this);
    },

    resize: function (oData) {
        if(oData.nWidth){
            this.$_oContainer.css({width:oData.nWidth});
        }
        if(oData.nHeight){
            this.$_oContainer.css({height:oData.nHeight});
        }

    },

    setWidth:function (nWidth) {
        //this.$_oContainer.width(nWidth);
        this.$_oContainer.stop().animate({"width": nWidth + "px"}, 100);
    },

    reflesh: function (nWidth,nHeight) {
        // this.$_oContainer.css({width:nWidth,height:nHeight});
    },

    initUI: function () {
        this.$_oContainer = $(this.cHTML);

        $(this.oOption.cPContainer).append(this.$_oContainer);

        this.$_oContainer.css({width:this.oOption.nWidth,height:this.oOption.nHeight});
    },

});

ES.MapView.LiveMange = ES.Class.extend({

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initOn();

    },

    // 缓存车辆数据
    aoLivePos:null,

    initOn: function () {

        this._oParent.on("MapView:LiveMange.addLivePos", this.addLivePos, this);
        this._oParent.on("MapView:LiveMange.addLive", this.addLive, this);
        this._oParent.on("MapView:LiveMange.removeLive", this.removeLive, this);
        this._oParent.on("MapView:LiveMange.removePos", this.removePos, this);
        this._oParent.on("MapView:LiveMange.removeAll", this.removeAll, this);
        // hub 推送GPS数据 监听接口
        this._oParent.on("HubSvr:setGpsInfo", this.setGpsInfo, this);

    },

    addLive: function (oTemp) {
        var aoGpsInfo = oTemp.oData;
        for (var i = 0; i < aoGpsInfo.length; i++) {
            this.addLivePos({oGpsInfo:aoGpsInfo[i]});
        }
    },

    removeLive: function (oData) {
        var acId = oData.acId
        for (var i = 0; i < acId.length; i++) {
            this.removePos({oGpsInfo: {PhoneNum: acId[i]}});
        }
    },

    // 是一个数组，分发数据到包
    setGpsInfo: function (oTemp) {
        var aoGpsInfo =oTemp.oData;
        // 监听轨迹数据
        if (!aoGpsInfo || aoGpsInfo.length <= 0) return;

        aoGpsInfo = this._oParent.toHeartModle( this._oParent.getVstatus(aoGpsInfo));

        var self = this;
        $.each(aoGpsInfo, function (nIndex, oGpsInfo) {
            var nIndex = ES.Util.arrayIndex(self.aoLivePos, oGpsInfo, "devNo")
            if (nIndex < 0) {
                console.log("不存在跟踪设备：" + oGpsInfo.devNo + ";车牌号" + oGpsInfo.vehNo);
                return;
            }
            if(oGpsInfo.vehNo === undefined){
                oGpsInfo.vehNo = self.aoLivePos[0].options.vehNo;
                oGpsInfo.entName = self.aoLivePos[0].options.entName;
            }
            oGpsInfo.weight=oGpsInfo.weight === undefined? 0 : oGpsInfo.weight;
            oGpsInfo.bOpenBubble = true;
            self.aoLivePos[nIndex].drawLiveTrack({ oGpsInfo: oGpsInfo });

        })
    },

    // 添加实时跟踪 marker ,
    addLivePos: function (oData) {
        if (!oData || !oData.oGpsInfo){
            return;
        }

        if (!this.aoLivePos) {
            this.aoLivePos = new Array();
        }

        var oGpsInfo = oData.oGpsInfo;
        if (ES.Util.isInArray(this.aoLivePos, oData.oGpsInfo, "devNo")) {
            console.log("地图实时跟踪中存在已经跟踪的设备号" + oGpsInfo.devNo + ";车牌号" + (oGpsInfo.devNo||'' )+ "！");
            return;
        }

        // 要判断是否超出了监控设备个数，如果是，要移除最后一个元素
        if (this.aoLivePos.length >=  ES.MapView.oConfig.nMonitorCnt) {
            var oMapLiveTemp = this.aoLivePos.pop();
            this.removeMonitor(oMapLiveTemp);
        }

        var oMapLive = new ES.MapView.MapLive(this._oParent,oData.oGpsInfo);
        //oMapLive.setFristGps( oData.oGpsInfo);

        this.aoLivePos.push(oMapLive);
        oData.oGpsInfo.bOpenBubble = true;
        oMapLive.drawLiveTrack(oData);

    },

    // 移除监控
    removeMonitor: function (oMapLive) {
        if (!oMapLive) return;
        oMapLive.offEven();
        oMapLive.clearLiveTrack();
    },

    // 设备号 为唯一的判断
    removePos: function (oData) {
        if (!oData || !oData.oGpsInfo || !oData.oGpsInfo.hasOwnProperty("devNo")){
            return;
        }

        //var oGpsInfo = oData.oGpsInfo;
        var nIndex = ES.Util.arrayIndex(this.aoLivePos, oData.oGpsInfo, "devNo");
        if (nIndex === -1) {
            //console.log("地图实时跟踪中不存在设备号" + oGpsInfo.PhoneNum + ";车牌号" + oGpsInfo.VehicleNo + "！");
            return;
        }
        var oMapLive = this.aoLivePos[nIndex];
        if (!oMapLive) return;
        this.removeMonitor(oMapLive);
        this.aoLivePos.splice(nIndex, 1);

    },

    //删除所有的订阅车辆记录
    removeAll: function () {
        if (!this.aoLivePos || this.aoLivePos.length <= 0) {
            return;
        }
        var aoGpsInfo = []
        for (var i = 0; i < this.aoLivePos.length; i++) {
            this.aoLivePos[i].offEven();
            this.aoLivePos[i].clearLiveTrack();
            aoGpsInfo.push(this.aoLivePos[i].options);
        }

        // 取消订阅
        this._oParent.fire('HubSvr:batchUnsubGps', {aoGpsInfo: aoGpsInfo});

        // 删除所有元素
        this.aoLivePos.splice(0,this.aoLivePos.length);
    },

    convertVehStatus: function (oGpsInfo) {

        var oAttach = oGpsInfo.attach ;
        oGpsInfo.nGreenOn = 0;
        oGpsInfo.nRedOn = 0;
        oGpsInfo.nYelloOn = 0;
        oGpsInfo.cLight = "白灯";
        oGpsInfo.cClsLight = "gray";


        if (oAttach.ZtLeightGreenOn === 'True') {
            oGpsInfo.nGreenOn = 1
            oGpsInfo.cLight = "绿灯"
            oGpsInfo.cClsLight = "green"
        }

        if (oAttach.ZtLeightRedOn === 'True') {
            oGpsInfo.nRedOn = 1;
            oGpsInfo.cLight = "红灯";
            oGpsInfo.cClsLight = "red"
        }

        if (oAttach.ZtLeightYelloOn === 'True') {
            oGpsInfo.nYelloOn = 1;
            oGpsInfo.cLight = "黄灯";
            oGpsInfo.cClsLight = "yellow"
        }
        oGpsInfo.dWeight = oAttach.ZtWeightValue;

    },

});

ES.MapView.MapLive = L.MapLib.MapMaster.MapOpr.extend({

    /*
     为构造函数
     @oParent 为父级页面对象
     @oOption 为参数，设置当前的参数
     */
    initialize: function (oParent, oOption,oMap) {

        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption, oMap);
        // 添加图层
        this._loadLayerGroup();

        // 注册监听事件
        // this._initOn();

        this.devNo = oOption.devNo || "-1";
        this.cId = null;
    },

    setOption: function(oGpsInfo) {
        if(oGpsInfo.hasOwnProperty('vehNo')){
            delete  oGpsInfo.vehNo;
        }
        if(oGpsInfo.hasOwnProperty('CompanyName')){
            delete  oGpsInfo.CompanyName;
        }
        if(oGpsInfo.hasOwnProperty('currentState')){
            delete  oGpsInfo.currentState;
        }
        return ES.extend(this.options, oGpsInfo);
    },

    // 收到点击详情详情时设置的参数
    setFristGps:function(oGpsInfo) {
        this.oFristGps = oGpsInfo;
    },

    // 初始化监听事件
    _initOn: function () {

        this._oMap.on("moveend", this._mapMoveHandler, this);

        // 画实时点
        this._oParent.on("MV:Real.drawLiveTrack", this.drawLiveTrack, this);

        // 判断是否显示弹出层
        this._oParent.on("MV:Real.showVecMarkerPop", this._showVecMarkerPop, this);

        // 放大实时监控点
        this._oParent.on("MV:Real.setLiveZoomIn", this.setLiveZoomIn, this);

        // 清除实时跟踪的点、历史点、轨迹线
        this._oParent.on("MV:Real.clearLiveTrack", this.clearLiveTrack, this);

        this._oParent.on("MapView:MapLive.setZoomIn", this.setZoomIn, this);

    },

    // 实现地图放大
    setZoomIn:function(oData) {
        if (!oData || !oData.oGpsInfo) {
            return;
        }

        var oGpsInfo = oData.oGpsInfo;

        var oLayer = this.findLayer(this._oLivePosGroup, oGpsInfo.devNo);
        if (!oLayer) {
            return;
        }
        var oLatLng = oLayer.getLatLng();
        this.flyTo(oLatLng, {zoom: 16});

        // 打开popup层显示车辆数据
        oLayer.openPopup();
    },

    // 关闭事件
    offEven: function () {
        this._oMap.off("moveend", this._mapMoveHandler, this);

        // 画实时点
        this._oParent.off("MV:Real.drawLiveTrack", this.drawLiveTrack, this);

        //解决聚合和实时同时存在问题
        this._oParent.off("MV:Real.unVisibleMarker");

        // 判断是否显示弹出层
        this._oParent.off("MV:Real.showVecMarkerPop", this._showVecMarkerPop, this);

        // 放大实时监控点
        this._oParent.off("MV:Real.setLiveZoomIn", this.setLiveZoomIn, this);

        // 清楚实时跟踪的点、历史点、轨迹线
        this._oParent.off("MV:Real.clearLiveTrack", this.clearLiveTrack, this);
    },

    //添加实时跟踪状态数据
    _loadLayerGroup: function () {

        //线路
        this._oLineGroup = L.featureGroup();
        this._oMap.addLayer(this._oLineGroup);

        //轨迹点
        this._oTrackGroup = L.featureGroup();
        this._oMap.addLayer(this._oTrackGroup);

        //实时跟踪点
        this._oLivePosGroup = L.featureGroup();
        this._oMap.addLayer(this._oLivePosGroup);
    },

    //判断弹出层是否应该弹出，如果地图为当前获得页，就弹出层，否则不弹出
    //对地图进行了放大缩小操作
    _showVecMarkerPop: function (oData) {
        if (!this._oLivePosGroup) return;
        var bActive = $("#Map").hasClass("active");

        var oGpsInfo = oData.oGpsInfo;
        this._oLivePosGroup.eachLayer(function (oLayer) {
            if (oGpsInfo.cDevId != oLayer.cId) {
                oLayer.closePopup();
                return;
            }

            if (bActive) {
                this._oMap.setView(oLayer.getLatLng(), 17);
                oGpsInfo.bOpenBubble ? oLayer.openPopup() : oLayer.closePopup();
            }
            else {
                oLayer.closePopup();
            }
        }, this)

    },

    //修改弹出层样式错误，
    _updateVecMarkerPop: function (oLivePosLayer, cHtml) {
        if (!oLivePosLayer) return;
        oLivePosLayer.setPopupContent(cHtml);
    },

    //画布,实时跟踪绘制，如线，轨迹点等，oPosInfo，为当前点信息
    _drawLiveHis: function ( ) {
        var oGpsInfo =  this.oGpsInfo;

        var oPrePosInfo = null;
        var oLineLayer = this.findLayer(this._oLineGroup, oGpsInfo.devNo);
        if (!oLineLayer) {
            //创建线图层
            var oPloyLine = L.polyline([oGpsInfo.latLng], ES.MapView.oConfig.oLiveLineConfig);
            oPloyLine.cId = oGpsInfo.devNo;
            oPloyLine.oPrePosInfo = oGpsInfo;
            oPloyLine.addTo(this._oLineGroup);
        }
        else {
            oPrePosInfo = oLineLayer.oPrePosInfo;
            oLineLayer.oPrePosInfo = oGpsInfo;
            oLineLayer.addLatLng(oGpsInfo.latLng);
        }

        //创建轨迹图层
        if (oPrePosInfo) {
            var oTrackLayer = L.circleMarker(oPrePosInfo.latLng, ES.MapView.oConfig.oLiveCircleMarkerConfig);

            oTrackLayer.addTo(this._oTrackGroup);
            oTrackLayer.oGpsInfo = oGpsInfo;
            // 设置对象的弹出层
            this.initPopup(oTrackLayer);
            this.initPopupEvent(oTrackLayer);

            oGpsInfo.bOpenBubble ? oTrackLayer.openPopup() : oTrackLayer.closePopup();
        }
    },

    // 创建实时跟踪点
    _createLive: function (oGpsInfo) {

        var oLatLng = oGpsInfo.latLng;
        var oLayer = L.Marker.movingMarker([oLatLng], [], {
            icon: this._getPosIconInfo(oGpsInfo, {nWidth: 30, nHeight: 40, nInitDir: 180})
        });
        oLayer.cId = oGpsInfo.devNo;
        oLayer.oData = oGpsInfo;
        return oLayer;
    },

    // 在地图上绘制实时跟踪的点
    _drawLive: function () {
        if (!this._oLivePosGroup) {
            return;
        }
        var  oGpsInfo = this.oGpsInfo;
        var oLayer = this.findLayer(this._oLivePosGroup, oGpsInfo.devNo);
        if (!oLayer) {
            this.clearLiveTrackFrom(oGpsInfo);
            oLayer = this._createLive(oGpsInfo);
            oLayer.addTo(this._oLivePosGroup);
            oLayer.oGpsInfo = oGpsInfo;
            this.initPopup(oLayer);
            this.initPopupEvent(oLayer);
            oGpsInfo.bOpenBubble ? oLayer.openPopup() : oLayer.closePopup();
            this.oLayer = oLayer
            this.flyTo(oLayer.getLatLng(), {zoom: 13});
        }
        else {
            oLayer.moveTo(oGpsInfo.latLng,5000);
            if (oLayer.oCircle) {
                oLayer.oCircle.setLatLng(oGpsInfo.latLng);
            }
            oLayer.oGpsInfo = oGpsInfo;
            this.initPopup(oLayer);
        }
        this._setHeading(oGpsInfo, 180);
        this.selectLi(oGpsInfo);
        oLayer._bringToFront();

        return oLayer;
    },

    //WQ通过class获取li
    selectLi: function (oPosInfo) {
        var cId = oPosInfo.devNo;
        var oLi = $(".ex-layout-carlist-content").find("li");
        for (var i = 0; i < oLi.length; i++) {
            var oLiData = $(oLi[i]).data("data");
            if (oLiData.devNo == cId) {
                $(oLi[i]).removeData("data");
                $(oLi[i]).data("data", oPosInfo)
            }
        }
    },

    // 地图监控移动设置
    _mapMoveHandler: function () {
        if (!this._oLivePosGroup) return;
        this._oLivePosGroup.eachLayer(function (oLayer) {
            if (!oLayer._bringToFront) return;
            oLayer._bringToFront();

        }, this);
    },

    // 清除实时跟踪的点，给其他图层添加点
    clearLiveTrack: function () {
        this._oLivePosGroup.clearLayers();
        this._oLineGroup.clearLayers();
        this._oTrackGroup.clearLayers();

        //this.options.lat =  this.options.Lat ||this.options.lat;
        //this.options.lng =  this.options.Lng ||this.options.lng;
        //在图层上添加车辆图表
        this._oParent.fire("MapView:MapLive.addMarker", {oGpsInfo:this.options});
    },

    // 清除实时跟踪的对象，为自己
    clearLiveTrackFrom: function (oGpsInfo) {
        this._oLivePosGroup.clearLayers();
        this._oLineGroup.clearLayers();
        this._oTrackGroup.clearLayers();

        this._oParent.fire("MapView:ClusterLayer.removeLayer", {oGpsInfo:oGpsInfo});
    },

    // 画实时跟踪轨迹数据
    drawLiveTrack: function (oData) {
        if (!oData.oGpsInfo.latLng) {
            return;
        }
        // 数据缓存到 this.oGpsInfo
        this.oGpsInfo = oData.oGpsInfo;
        //this.oGpsInfo.vehNo = this.oFristGps.vehNo;
        this._drawLiveHis();
        this._drawLive();
    },

    // 放大地图,放大
    setLiveZoomIn: function () {

        var aoLayer = this._oLivePosGroup.getLayers();
        if (!aoLayer || aoLayer.length <= 0) {
            return;
        }
        if (!aoLayer[0].getLatLng) {
            return;
        }

        var oLatLng = aoLayer[0].getLatLng();

        var nMaxZoom = this._oMap.getMaxZoom();

        this._oMap.setView(oLatLng, nMaxZoom - 1);

    },

});

// 车辆实时跟踪的基本操作
ES.MapView.MapLive.include({
    // 设置弹出层的位置
    oPopOption: { maxWidth: 500 ,autoPan: false},
    // 获得实时跟踪点, 地图统计点数据
    _getPosIconInfo: function (oItem, oOption) {
        oItem.nDir = oItem.dir + oOption.nInitDir;
        return new L.DivIcon({
            html: ES.template(this._getIconHtml(), oItem),
            className: this.getLeightOnCls(oItem),
            iconSize: L.point(30, 40),
            iconAnchor: [10, 20],
            popupAnchor: L.point(-1, -20),
        });
    },

    _getIconHtml: function () {
        var cHtml =
            '<div cid="{devNo}" class="car-body" style="transform:rotateZ({nDir}deg);-webkit-transform: rotate({nDir}deg);"></div>' +
            '    <div class="pin-tip " style="display: block;">' +
            '        <div class="pin-dome"><b></b><c></c><d></d></div>' +
            '        <div class="pin-number">{vehNo}</div>' +
            '        <div class="pin-state">' +
            '        </div>' +
            '</div>';

        return cHtml;
    },

    // 设置车辆的角度
    _setHeading: function (oPosInfo, nInitDir) {
        if (!oPosInfo) {
            return;
        }
        if (!nInitDir) {
            nInitDir = 0;
        }
        oPosInfo.nDir = oPosInfo.dir + nInitDir;
        $('div[cId="' + oPosInfo.devNo + '"]').attr('style',ES.template( 'transform: rotate({nDir}deg);-webkit-transform: rotate({nDir}deg);',oPosInfo));
    },

    //根据告警类型，生成告警样式
    alarmToCls: function (oGpsInfo) {
        // 获得车辆的样式 和 车辆告警样式
        var oClass = { cAlarm: "" };
        oGpsInfo.cClsLight = "green";
        // 车灯要修改
        if (!oGpsInfo) return oClass;


        if (oGpsInfo.Speed > 60) {
            oClass.cAlarm = "car-state speed";
        }
        return oClass;
    },

});

// 弹出层的事件操作
ES.MapView.MapLive.include({

    // 注册弹出层事件,弹出层绑定对象,每次不是最新oGpsInfo数据，不能用匿名的函数，需要注销
    initPopupEvent: function (oLayer) {
        var self = this;
        var oPopup = oLayer.getPopup();
        if(!oPopup){
            return;
        }
        oPopup.on("contentupdate", function (){
            // 车辆详情按钮
            var oBtnDetail = $(".leaflet-popup").find("a.ec-icon-truck").parent();
            // 车辆轨迹按钮
            var oBtnTrack = $(".leaflet-popup").find("a.ec-icon-exchange").parent();
            var oMeassageClick = $(".leaflet-popup").find("a.ec-icon-commenting").parent();
            // 下发指令按钮
            var oVehicleOrder = $(".leaflet-popup").find("a.ec-icon-cloud").parent();
            // 查看视频按钮
            var oVehicleVideo = $(".leaflet-popup").find("a.ec-icon-video-camera").parent();
            var oGpsInfo = this.oGpsInfo;

            // 绑定事件
            oBtnDetail.bind("click", function () {
                self._oParent.fire("MapView:VehDetail.showDetail",{oGpsInfo:oGpsInfo});
                // 取消订阅
                self._oParent.fire('HubSvr.unsubGps',{aoGpsInfo:[oGpsInfo]});
                // 移除跟踪列表
                self._oParent.fire("MapView:LiveMange.removeAll");
                // 添加跟踪
                self._oParent.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});
            });

            oBtnTrack.bind("click", function () {
                window.open("/mapViewHtml/html/trackview.html?token="+ES.MapView.oConfig.token+"&PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo);
            });

            // 下发指令
            oVehicleOrder.bind('click', function(){
                self._oParent.orderVehicleDialog = new ES.Common.AddType(self._oParent,{bRemove:true},{title: '下发指令',
                    content:'<div class="ex-command-tabs modelType">'+
                    '           <ul class="ex-command-tab ec-avg-sm-3">'+
                    '               <li data-index="1"><i class="ec-icon-btn ec-primary ec-icon-database"></i><span>拍照</span></li>'+
                    '               <li data-index="2"><i class="ec-icon-btn ec-primary ec-icon-life-ring"></i><span>点名</span></li>'+
                    '               <li data-index="3"><i class="ec-icon-btn ec-primary ec-icon-search"></i><span>语音文字</span></li>'+
                    '           </ul>'+
                    '         </div>'});
                self._oParent.orderVehicleDialog.del(oGpsInfo);
            })

            oVehicleVideo.bind('click', function(){
                window.open("/mapViewHtml/html/video.html?token="+ES.MapView.oConfig.token+"&PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo + "&cameraNum=" + oGpsInfo.cameraNum);
            })

            // 发送消息
            oMeassageClick.bind("click", function () {
                ES.aWarn('系统正在开发过程！');
            });
        }, oPopup);
    },

    initPopup:function(oLayer){

        if(!this._oParent || !this._oParent._getVecMarkerHtml) {
            var i = 1;
        }
        var cHtml = this._oParent._getVecMarkerHtml(oLayer.oGpsInfo);
        //更新弹出层的信息,修改的目的是防止注册2次点击事件
        var oPopup = oLayer.getPopup();
        if(!oPopup){
            oPopup = oLayer.bindPopup(cHtml, this.oPopOption).getPopup();
        }
        // 在次注册事件
        oPopup.oGpsInfo = oLayer.oGpsInfo;
        oPopup.setContent(cHtml);

        return oPopup;
    },

    // 设置车辆gps信息 和 网络信息
    setMobileInfo: function (oGpsInfo) {
        //去掉on状态
        var $_oIMobile = $(".ex-icon-mobile");
        var $_oIBD = $(".ex-icon-bd");

        $_oIMobile.removeClass("on").removeClass("off");
        $_oIBD.removeClass("on").removeClass("off");

        //判断当前位置信息
        if (oGpsInfo.currentState == "行驶"
            || oGpsInfo.currentState == "停车"
            || oGpsInfo.currentState == "熄火") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("on");
        }
        else if (oGpsInfo.currentState == "通讯中断") {
            $_oIMobile.addClass("l-mobile-off");
            $_oIBD.addClass("l-bd-off");
        }
        else if (oGpsInfo.currentState == "定位失败") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("off");
        }
        else {
            $_oIMobile.addClass("off");
            $_oIBD.addClass("off");
        }
    },
    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getLeightOnCls: function (oData) {

        var cClsType = 'ex-monitor-mapicon-truck';
        var cClsStatus = 'gray';
        if (oData.carType == 0) {
            cClsType = 'ex-monitor-mapicon-tram';
        }

        if (oData.currentState == '行驶' || oData.currentState == '停车') {
            cClsStatus = 'green';
        }
        else if (oData.scurrentStateta == '熄火') {
            cClsStatus = 'green';
        }
        else if(oData.currentState == '定位失败'){
            cClsStatus = 'yellow';
        }else if(oData.currentState == '通讯中断'){
            cClsStatus = 'gray';
        }

        return cClsType+' '+ cClsStatus;
    },
})

ES.MapView.Menu = ES.Evented.extend({

    oOption: {
        // 是否动态创建
        bIsCreate: true,
        cContainerSel: '.ex-layout-main',
        acContainer: ['ex-layout-menu', 'ex-theme-menu', 'ec-avg-md-1'],

        // 菜单宽度
        nHideWidth:40,
        nShowWidth:120,
        //是否显示菜单文档
        bShowMenu:false,
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        ES.extend(this.oMenuConfig,oOption.oMenuConfig);
        this._aoPanel = [];

        // 当前显示那个panel
        this.oCurPanel = null;

        // 初始化界面
        this.initUI();

    },

    // 加载菜单选项
    initUI: function () {

        var $_oContainer = $('<ul class="ex-layout-menu ec-avg-md-1"></ul>');

        if (this.oOption.bIsCreate) {
            $_oContainer = $(this.cHTML);
            $(this.oOption.cContainerSel).append($_oContainer);
        }

        // 设置菜单的宽度和高度 显示菜单的文本
        $_oContainer.width(this.oOption.nWidth);

        if(this.oOption.bShowMenu){
            $_oContainer.find('span').show();
        }

        this.$_oContainer = $_oContainer;

        // 初始化事件
        this.initMenuEvent();

        this.initAn();
    },

    // 设置标题
    setTitle: function () {

    },

    getRight: function () {

        ES.Util.reqData({data:{nModelId :this.oOption.nModelId},url:'/Active/GetActive'},this.getRightHandler,this)

    },

    // 加载 菜单
    getRightHandler: function (oData) {
        // 加载菜单、
        if (!oData.rtnData || oData.rtnData.length <= 0) {
            return;
        }

        var $_oContainer = $('<ul class="ex-layout-menu ec-avg-md-1"></ul>');

        for (var i = 0; i < oData.rtnData.length; i++) {
            $_oContainer.append($(oData.rtnData[i].Html));
        }
        //return $_oContainer;

        if (this.oOption.bIsCreate) {
            //$_oContainer = $(this.cHTML);
            $(this.oOption.cContainerSel).append($_oContainer);
        }

        $_oContainer.children('li').width(this.oOption.nShowWidth);

        this.$_oContainer = $_oContainer;

        // 初始化事件
        this.initMenuEvent();

        this.initAn();
    },

    // 初始化节点
    initMenuEvent: function () {

        var self = this;
        var $_oContainer = this.$_oContainer;

        // 没有查询面板的查询，侧边栏选项显示车辆列表和父选框事件
        $_oContainer.find('li.level').bind('click', function () {

            var _i = $(this).index();

            $('.ex-layout-menu > li').removeClass('ec-active in').eq(_i).addClass('ec-active in');

            // 隐藏显示查询树
            self._oParent.fire('MapView:StruckBox.showBox',{oParam: {cTitle: $(this).text()}});

            // 触发在线查询接口
            self._oParent.fire($(this).attr('data-band'), {
                oSearchParam: {cFlag: $(this).attr('data-param')}
            });

            self.setTitle($(this).attr('lst-title'));
            // 点击时 ，直接传数据到lst列表

            var oTemp = {
                // 当前面板的标志
                cFlag: $(this).attr('menu-flag'),
                cTreeUrl: $(this).attr('tree-url'),
                cTreeTitle: $(this).attr('tree-title'),
                cTreeObject:$(this).attr('tree-object'),
                cListObject:$(this).attr('list-object'),
                cListTitle:$(this).attr('list-title'),
                cListUrl:$(this).attr('list-url'),
                cCheckEventName:$(this).attr('tree-check-event'),
                cUncheckEventName:$(this).attr('tree-uncheck-event'),
                cSelectEventName:$(this).attr('tree-select-event'),
                cViewUrl:$(this).attr('view-url'),
                cViewTitle:$(this).attr('view-title'),
                cViewObject:$(this).attr('view-object'),
                closeList:$(this).attr('list-show')=="close"?false:true,
            }
            self.createPanel(oTemp);

            // 加载监控页面
            self._oParent.fire('MapView:MonitorMgr.initMonitor',oTemp);

        });

        // 有查询面板的查询
        $_oContainer.find('li').not('.level').bind('click', function () {

            var _i = $(this).index();

            $('.ex-layout-menu > li').removeClass('ec-active in').eq(_i).addClass('ec-active in');

            self._oParent.fire('MapView:StruckBox.showBox', {oParam: {cTitle: $(this).text()}});

            var oTemp = {
                // 当前面板的标志
                cFlag: $(this).attr('data-param'),
                cTitle: $(this).attr('tree-title'),
                cObject:$(this).attr('tree-object'),
                cListView:$(this).attr('list-view'),
                cListTitle:$(this).attr('list-title'),
                cMonitor:$(this).attr('monitor-object'),
                cCheckEventName:$(this).attr('tree-check-event'),
                cSelectEventName:$(this).attr('tree-select-event'),
                cUrl:$(this).attr('list-url'),
            };

            // 点击菜单，触发左边菜单
            self._oParent.fire('MapView:MonitorMgr.initMonitor',oTemp);

            self.createPanel(oTemp);

            self._oParent.resize(400);
        });

        $_oContainer.find('li').eq(0).click();



        //侧边栏选项显示文字事件
        //$_oContainer.bind('mouseover', function () {
        //    $(this).stop().animate({ "width": "120px" }, 100);
        //    $(this).children('li').width(120);
        //    $(this).find('span').show();
        //    //resizeMap(true, $extaned);
        //})
        //
        ////侧边栏选项隐藏文字事件
        //$_oContainer.bind('mouseout', function () {
        //    //$(this).stop().animate({ "width": "40px" }, 100);
        //    //$(this).children('li').width(40);
        //    //$(this).find('span').hide();
        //    $(this).stop().animate({ "width": "120px" }, 100);
        //    $(this).children('li').width(120);
        //    $(this).find('span').show();
        //    //$(this).find('span').hide();
        //    //resizeMap(false, $extaned);
        //})
    },

    // 加载动画
    initAn: function () {
        var self = this;
        var $_oContainer = this.$_oContainer;
        //侧边栏选项显示文字事件
        $_oContainer.bind('mouseover', function () {
            $(this).stop().animate({"width": self.oOption.nShowWidth + "px"}, 100);
            $(this).children('li').width(self.oOption.nShowWidth);
            $(this).find('span').show();

            //改变地图宽度发送消息
            self._oParent.fire('MapView:Menu.resize',{nWidth:self.oOption.nShowWidth});
        });

        //侧边栏选项隐藏文字事件
        $_oContainer.bind('mouseout', function () {
            $(this).stop().animate({"width": self.oOption.nHideWidth + "px"}, 100);
            $(this).children('li').width(self.oOption.nHideWidth);
            $(this).find('span').hide();
            self._oParent.fire('MapView:Menu.resize',{nWidth:self.oOption.nHideWidth});
        });

    },

    // 创建面板
    createPanel: function (oTemp) {
        var bIn = false;
        if( this._aoPanel.length<=0){
            var oPenel = new ES.MapView.TabPanel(this._oParent, oTemp);
            this._aoPanel.push(oPenel);
            return;
        }

        var bIn = false;
        for (var i = 0; i < this._aoPanel.length; i++) {
            if (this._aoPanel[i].cFlag === oTemp.cFlag) {
                this._aoPanel[i].showBox();
                bIn = true;
                //this._oParent.fire('MapView:LayoutContent.resize', {nWidth: $(window).width()  - this._aoPanel[i].getWidth()});
            }
            else {
                this._aoPanel[i].hideBox();
            }
        }
        if (!bIn) {
            var oPenel = new ES.MapView.TabPanel(this._oParent, oTemp);
            this._aoPanel.push(oPenel);
        }
    },

    getWidth:function () {
        if(!this.oCurPanel ) {
            return 340;
        }
        return this.oCurPanel.getWidth();
    },

});

ES.MapView.Menu.include({

    cHTML:
    '<ul class="ex-layout-menu ec-avg-md-1">' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="deptVehView" ' +                     // 对象标识
    '           tree-url ="deptTree" ' +
    '           tree-title="组织架构" ' +
    '           tree-check-event="deptTree:layer" ' +           // 树的点击事件
    '           tree-uncheck-event="undeptTree:layer" ' +       // 树的点击事件
    '           tree-object="ES.MapView.TabPanel.TreeView" ' +
    '           list-object="ES.MapView.TabPanel.DeptVehLst"' +
    '           list-title="车辆列表" ' +
    '           data-obj="ES.MapView.VehicleMonitor"' +         // 统计数据列表
    '           list-url="vehLstUrl"><i class="ec-icon-sitemap"></i> <span>车辆列表</span>' +
    '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="deptSingleVehView" ' +                     // 对象标识
    '           tree-url ="deptSingleTree" ' +
    '           tree-title="组织架构" ' +
    '           tree-check-event="deptTree:layer" ' +           // 树的点击事件
    '           tree-uncheck-event="undeptTree:layer" ' +       // 树的点击事件
    '           tree-object="ES.MapView.TabPanel.OnlyTreeView" ' +
    '           tree-select-event="selectDeptTree:layer" ' +
    '           list-title="车辆列表" ' +
    '           data-obj="ES.MapView.VehicleMonitor"' +         // 统计数据列表
    '           list-url="vehLstUrl"><i class="ec-icon-sitemap"></i> <span>车辆列表(树)</span>' +
    '       </li>' +

    '       <li class="ec-active flip in level" ' +
    '           menu-flag ="attend" ' +
    '           list-object="ES.MapView.TabPanel.VehLst"' +
    '           list-title="关注车辆" ' +
    '           list-url="getFollowVeh" ><i class="ec-icon-star"></i> <span>关注车辆</span>' +
    '       </li>' +

    // '       <li class="ec-active flip in level" ' +
    // '           menu-flag ="AlarmVehView" ' +
    // '           list-object="ES.MapView.TabPanel.AlarmVehLst"' +
    // '           list-title="今日违规车辆列表" ' +
    // '           list-url="getAlarmType"'+
    // '           tree-check-event ="AlarmType:Vehicle" ' +
    // '           view-url ="AlarmType:Vehicle" ' +
    // '           view-object="ES.MapView.TabPanel.AlarmTypes"' +
    // '           view-title="车辆告警类型"><i class="ec-icon-warning"></i> <span>告警分类</span>' +
    // '       </li>' +
    //
    // '       <li class="ec-active flip in level" ' +
    // '           menu-flag ="fenceMap" ' +
    // '           tree-url ="FenceTree" ' +
    // '           tree-title="围栏" ' +
    // '           tree-check-event="fenceTree:layer" ' +
    // '           tree-uncheck-event="unfenceTree:layer" ' +
    // '           tree-object="ES.MapView.TabPanel.FenceTreeView" ' +
    // '           list-object="ES.MapView.TabPanel.VehLst"' +
    // '           list-title="当日经过车辆" ' +
    // '           list-url="FenceVehLstUrl"><i class="ec-icon-map-signs"></i> <span>围栏</span>' +
    // '       </li>' +
    //
    // '       <li class="ec-active flip in level" ' +
    // '           menu-flag ="rectVehView" ' +
    // '           list-object="ES.MapView.TabPanel.VehLst"' +
    // '           list-title="框内车辆" ' +
    // '           list-url="RectVehLstUrl"'+
    // '           tree-check-event ="RectSearch:Vehicle" ' +
    // '           view-url ="RectSearch:Vehicle" ' +
    // '           view-object="ES.MapView.TabPanel.RectSearch"' +
    // '           view-title="拉框搜索"><i class="ec-icon-object-group"></i> <span>拉框搜索</span>' +
    // '       </li>' +
    '   </ul>',
});

ES.MapView.TabPanel = ES.Evented.extend({



    oOption: {

        bIsCreate: true,

        // 初始化监听事件
        cEvenName: 'MapView:VehSitePanel.initVehSite',

        // 加载的父级容器
        cPContainer: '.ex-layout-main',

        // 当前面板标志
        cFlag: 'panelFlag',

        cTitle: '工地搜索车辆',

        // -- 界面加载完成 后触发的事件,url 加载
        cEventNameTabLoad: 'MapView:TabPanel.TabLoad',

        nListWidth:220,

        nTreeWidth: 220,

        nViewWidth:280,
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this._oPage = oParent._oParent
        // 保存当前页面对象
        this.$_oContainer = null;

        // 车辆list
        this.oListView =null;

        // 查询list
        this.oStrcukBox = null;

        //普通list
        this.oViewBox = null;

        // 简化变量定义
        this.cFlag = this.oOption.cFlag;

        this.initOn();

        this.initUI();

        if(this.oListView){
            this.oListView.$_oOpenBtn.click();
        }
    },

    initUI: function () {

        if (!this.oOption.bIsCreate) {
            return;
        }
        this.$_oContainer = $(this.cHTML);
        this.$_oContainer.addClass(this.oOption.cFlag);

        $(this.oOption.cPContainer).append(this.$_oContainer);
        this._oParent.fire(this.oOption.cEventNameTabLoad, {cFlag: this.oOption.cFlag});

        // 车辆列表结构
        this.initListView();

        // 查询过滤树结构
        this.initPanel();

        //  普通面板
        this.initView();

        this.setWidth(this.oOption.nInitWidth);

        if(!this.oStrcukBox) {
            if(!this.oViewBox){
                this.oListView.hideBtn();
            }
        }

        if(this.oListView){
            if(!this.oOption.closeList){
                this.oListView.hide()
            }
        }

    },
    //初始化 普通面板 自定义
    initView:function(){
        if(!this.oOption.cViewObject) {
            return;
        }
        var oTemp = eval(this.oOption.cViewObject);

        this.oViewBox = new oTemp(this, {
            cDivContainerSel:this.$_oContainer,
            cCheckEventName: this.oOption.cViewUrl,
            cTitle: this.oOption.cViewTitle
        });

    },

    // 初始化 树列表 查询需要
    initPanel: function () {

        if(!this.oOption.cTreeObject) {
            return;
        }

        var oTemp = eval(this.oOption.cTreeObject);

        this.oStrcukBox = new oTemp(this, {
                // 树的顶级容器，不是树容器
                cPContainer: this.$_oContainer,
                cTitle: this.oOption.cTreeTitle,
                cCheckEventName:this.oOption.cCheckEventName,
                cUncheckEventName:this.oOption.cUncheckEventName,
            },
            ES.MapView.oConfig[this.oOption.cTreeUrl]);

    },

    // 初始化面板数据cListView
    initListView: function () {
        if (!this.oOption.cListObject) {
            return;
        }

        var oTemp = eval(this.oOption.cListObject);

        // list 控件
        this.oListView = new oTemp(this, {
            // 树的顶级容器，不是树容器
            cDivContainerSel: this.$_oContainer,
            cTitle: this.oOption.cListTitle,
            nPageSize: 50,
            cUrl: ES.MapView.oConfig[this.oOption.cListUrl],
            cCheckEventName: this.oOption.cCheckEventName,
            cUncheckEventName: this.oOption.cUncheckEventName,
        });
        var $_oContainer = this.oListView.getPanel();

        // 分页控件
        this.oPager = new ES.MapView.TabPanel.LstPager(this, {
            nPageSize: ES.MapView.oConfig.nMaxPageSize,
            $_oContainer: $_oContainer, nBtnCnt: ES.MapView.oConfig.nPagerBtnCnt || 8,
        });
    },

    // 监听事件
    initOn: function () {
        //this._oParent.on(this.oOption.cEvenName, this.initTabPanel, this);
        //this._oParent.on('flishLoaded', this.loadTree, this);
    },

    getWidth: function () {
        //var nWidth = 0;
        // if (this.oListView) {
        //     nWidth = this.oListView.getWidth();
        // }
        //
        // if (this.oStrcukBox) {
        //     nWidth =nWidth+ this.oStrcukBox.getWidth();
        // }

        return this.$_oContainer.width();
    },

    // 设置容器的宽度，用于缓存
    setWidth:function (nWidth) {
        this.$_oContainer.css({width: nWidth});

        this.nWidth = nWidth;
    },

    // 打开 2个view
    openTree: function () {
        if (!this.$_oContainer) {
            return;
        }

        var nWidth = 0;
        if (this.oListView) {
            nWidth = this.oOption.nListWidth;
        }
        if(this.oStrcukBox) {
            nWidth = nWidth+ this.oOption.nTreeWidth;
        }else if (this.oViewBox){
            nWidth = nWidth+ this.oOption.nViewWidth;
        }
        this.setWidth(nWidth);

        nWidth = $(window).width() - nWidth - 40;
        this._oParent.fire('MapView:LayoutContent.resize', {nWidth: nWidth});
    },

    closeTree: function () {
        if (!this.$_oContainer) {
            return;
        }

        if (this.oListView) {
            this.setWidth(this.oOption.nListWidth);
        }

        var nWidth = this.getWidth();
        nWidth = $(window).width() - nWidth - 40;
        this._oParent.fire('MapView:LayoutContent.resize', {nWidth: nWidth});
    },

    // 显示查询面板
    showBox: function () {
        if (!this.$_oContainer) {
            return;
        }
        this.$_oContainer.show();
        if (this.oStrcukBox) {
            this.oStrcukBox.onOffCtrl(false);
        }
        var nWidth = $(window).width() - this.nWidth - 40;
        this._oParent.fire('MapView:LayoutContent.resize', {nWidth: nWidth});
    },

    // 隐藏查询面板
    hideBox: function () {
        this.$_oContainer.hide();
        if (this.oStrcukBox) {
            this.oStrcukBox.onOffCtrl(true);
        }

    },
});

// html 数据
ES.MapView.TabPanel.include({

    cHTML:'<div class="ex-layout-sider ec-fr">',

});

ES.MapView.TabPanel.VehLst = ES.Evented.extend({
    // 查询面板控件
    oOption: {
        // 车辆url
        cUrl: '',
        // 当前关注车辆信息
        cAttentUrl: '',
        // 面板的最上级容器，不是车辆容器
        cDivContainerSel: '#classContainer',
        // 车辆容器
        cLstContainerSel: '.ex-layout-carlist-content',
        // 查询框容器
        cSearchInputSel: 'input.ec-form-field',
        // 查询btn容器
        cSearchBtnSel: 'button.ec-btn-secondary',
        // 打开查询列表的宽度 ，车辆列表宽度 + 树宽度

        cCheckEventName:'MapView:DeptTreeView.getDeptId',

        cUncheckEventName:'MapView:UnDeptTreeView.getDeptId',

    },
    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this._oPage = oParent._oParent;
        this.$_oLstContainer = null;
        this.$_oContainer = null;
        this.oSearchInput = null;
        this.oSearchBtn = null;
        // 部门id数组为空
        this.anDeptId = null;
        // 初始化界面
        this.initOn();
        if (typeof this.oOption.cDivContainerSel === 'object') {
            this.$_oContainer = this.oOption.cDivContainerSel
        }
        else {
            this.$_oContainer = $(this.oOption.cDivContainerSel);
        }
        this.initUI();
    },

    initUI: function () {
        // 当前对象集合
        this.$_oStruck = $(this.cHtml);
        this.$_oContainer.append(this.$_oStruck);
        // 车辆容器
        this.$_oLstContainer = this.$_oStruck.find(this.oOption.cLstContainerSel);
        this.oSearchInput = this.$_oStruck.find(this.oOption.cSearchInputSel);
        this.oSearchBtn = this.$_oStruck.find(this.oOption.cSearchBtnSel);
        this.$_oOpenBtn = this.$_oStruck.find('a.ex-icon-turn.on');
        this.$_oCloseBtn = this.$_oStruck.find('a.ex-icon-turn.off');
        this.$_oTitle = this.$_oStruck.find('h4');
        this.$_oTitle.html(this.oOption.cTitle+'<span style="margin-left: 2em;"></span>');
        this.initSearchEvent();
        var self =this;
        if(this._oParent.cFlag == "attend"){
            //第一次按照 用户 的权限加载数据
            this.initData(1,function(oData){
                var aoGps = self.toModle(oData);
                self.$_oTitle.find('span').text(oData.detail.total+' 辆')
                self.vehHandler(aoGps);
                self.initPager(oData);
            });
        }
        // 绑定tab 关闭打开按钮事件
        this.initEvent();
    },

    // 数据转化,
    toModle: function (oData) {
        var aoGps = [];
        if (!oData || !oData.detail|| !oData.detail.list  || oData.detail.list.length <= 0) {
            return aoGps;
        }
        for (var i = 0; i < oData.detail.list.length; i++) {
            var item = oData.detail.list[i]

            var oModel = {
                id:item.id,
                vehNo: item.vehNo,
                devNo: item.devNo,
                latLng: {lat: item.vehGpsData.Poi.MapPoint.Lat, lng: item.vehGpsData.Poi.MapPoint.Lon},
                gpsDate: item.vehGpsData.GpsDateTime,
                dir: item.vehGpsData.Direction,
                poi: item.vehGpsData.Poi.Address,
                speed: item.vehGpsData.Speed,
                status: item.vehGpsData.Status,
                currentState: item.vehGpsData.VehStatusString,
                mile: (item.vehGpsData.Mileage / 1000).toFixed(2),
                gpsTime: item.vehGpsData.GpsTime * 1000,
                cameraNum: item.cameraNum
            };
            aoGps.push(oModel);
        }
        return aoGps;
    },

    getPanel: function () {
        return this.$_oStruck
    },

    /**
     *  加载数据
     * @nPage 加载数据时的页数
     * @fnCall 加载数据的回调函数
     * @return 返回 null
     * */
    initData: function (nPage,fnCall) {
        // 添加 遮罩层
        ES.Util.loadAn(this.$_oLstContainer);
        var searchModel = {veh_no: this.oSearchInput.val(),status:[1,2,3,4,5]};
        if (this.anDeptId) {

            ES.extend(searchModel, {deptIds: this.anDeptId});
        }
        var oParam = {
            'searchModel':searchModel,
            'editModel': {},
            'pageIndex': nPage,
            'pageSize': ES.MapView.oConfig.nMaxPageSize
        };

        // 分页请求数据
        ES.getData(
            JSON.stringify(oParam),
            this.oOption.cUrl,
            fnCall,
            this,
            null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            }
        );
    },

    // 绑定tab 关闭打开按钮事件
    initEvent: function () {
        var self = this;
        this.$_oOpenBtn.bind('click', function () {
            //$struckList.fadeIn(500);
            //self._oParent.fire("MapView:Struct.show");
            self.$_oStruck.css({ "opacity": "1"});
            //self.$_oStruck.animate({"left": "220px", "opacity": "1"}, 300);
            self.$_oCloseBtn.show();
            $(this).hide();
            self._oParent.openTree();
            // self._oParent.fire('MapView:Menu.resize',{nWidth:self.oOption.nHideWidth});
            //treeList("click");
        });



        //车辆列表父选框隐藏事件
        this.$_oCloseBtn.bind('click', function () {
            //$struckList.fadeOut(500);
            //self._oParent.fire("MapView:Struct.hide");
            self.$_oStruck.css({"opacity": "1"});
            //self.$_oStruck.animate({"left": "0", "opacity": "1"}, 300);
            self.$_oOpenBtn.show();
            $(this).hide();
            self._oParent.closeTree();
            self._oParent._oParent.fire('MapView:LayoutContent.resize', {nWidth: $(window).width() - 260});
        });


    },

    // 获得外层容器的宽度
    getWidth: function () {
        if (this.$_oStruck.offset().left <= 80) {
            return 0;
        }
        return this.$_oStruck.width();
    },

    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearchBtn.bind('click', function () {
            self.initData(1,function(oData){
                var aoGps = self.toModle(oData);
                self.$_oTitle.find('span').text(oData.detail.total+' 辆')
                self.vehHandler(aoGps);
                self.initPager(oData);
            });
        });
        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {

                self.initData(1, function (oData) {
                    var aoGps =  self.toModle(oData)
                    self.$_oTitle.find('span').text(oData.detail.total+' 辆');
                    self.vehHandler(aoGps);
                    self.initPager(oData);
                });
            }, 500);
        });
    },

    show: function () {
        this.$_oStruck.show();
    },

    hide: function () {
        this.$_oStruck.hide();
    },

    // 初始化界面
    initOn: function () {
        // 翻页执行
        this._oParent.on('MapView:VehLst.onPagerSearch', this.pagerSearch, this);
        this._oParent.on('MapView:VehLst.initVehLst', this.initVehLst, this);
        if (this.oOption.cCheckEventName) {
            this._oPage.on(this.oOption.cCheckEventName, this.initVehLst, this);
        }
        //cUncheckEventName
        if (this.oOption.cUncheckEventName) {
            this._oPage.on(this.oOption.cUncheckEventName, this.initVehLst, this);
        }
        if(this._oParent.cFlag=="attend"){
            this._oPage.on("MapView:VehLst.refreshConcern", this.initVehLst, this);
        }
    },

    initVehLst: function (oData) {
        var anDeptId = [];
        if (oData.acId && oData.acId.length > 0) {
            for (var i = 0; i < oData.acId.length; i++) {
                anDeptId.push(parseInt(oData.acId[i]));
            }
        }

        this.anDeptId = anDeptId;

        var self = this;
        this.initData(1, function (oData) {
            var aoGps = self.toModle(oData);
            if (oData && oData.detail) {
                self.$_oTitle.find('span').text(oData.detail.total + ' 辆')
                self.vehHandler(aoGps);
                self.initPager(oData);
            }
            else {
                ES.Util.removeAn(this.$_oLstContainer);
            }
        });
    },

    pagerSearch: function (oData) {
        if (!oData || !oData.oSearchParam || !oData.oSearchParam.PageIndex) {
            return;
        }
        var self = this;
        this.initData(oData.oSearchParam.PageIndex, function (oData) {
            var aoGps =  self.toModle(oData)
            self.vehHandler(aoGps);
        });
    },

});

// 初始化界面
ES.MapView.TabPanel.VehLst.include({
    // 初始化车辆列表数据
    vehHandler: function (oData) {
        // 移除遮罩层
        ES.Util.removeAn(this.$_oLstContainer);
        if(!oData){
            return ;
        }
        // 生存车辆列表
        var $_oUL = this.initVehItems(oData);
        if(!$_oUL) {
            return;
        }
        // 对所有车辆列表位置查询,并绘制车辆到地图图层
        //this.initVehLocal($_oUL);
        this.vehItemEvent($_oUL);
        this.initVehByAnimate($_oUL);
        this.initAttendEvent();
        this.initAttend();
    },
    // 加载车辆实时位置信息
    initVehLocal: function ($_oUL) {
        var $_aoLi = $_oUL.find("li");
        if (!$_aoLi || $_aoLi.length <= 0) {
            return;
        }
        var oAlarmData = [];
        for (var i = 0; i < $_aoLi.length; i++) {
            var oData = $($_aoLi[i]).data('data');
            if (!oData) {
                continue;
            }
            oAlarmData.push(oData.devNo);
        }
        // 获得车辆实时位置信息
        ES.getData({devNos : oAlarmData}, ES.MapView.oConfig.curPosUrl, this.curPosHandler, this);
    },
    // 设置车辆位置到地图
    curPosHandler: function (oTemp) {
        if (!oTemp) {
            return;
        }
        var aoTemp = this._oPage.toHeartModle(oTemp);
        var self = this;
        // 要不请求到的值赋值给li对象
        this.$_oLstContainer.find('li').each(function () {
            var oItem = $(this).data('data');
            if (!oItem) {
                return true;
            }
            for (var i = 0; i < aoTemp.length; i++) {
                if (aoTemp[i].devNo === oItem.devNo) {
                    $(this).find(".carlist-title > p.time").html(aoTemp[i].gpsDate);
                    aoTemp[i].id = oItem.id;
                    // 缓存当前也的数据
                    $(this).data('data', aoTemp[i]);
                    var cCls = self.getTruckCls(aoTemp[i]);
                    // 跟新车辆状态
                    $(this).find('.carlist-card>i')
                        .removeClass('green')
                        .removeClass('yellow')
                        .removeClass('gray')
                        .addClass(cCls);
                    break;
                }
            }
        });
    },

    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getTruckCls: function (oData) {

        var cClsType = 'truck';
        var cClsStatus = 'gray';
        // if (oData.carUseIn == 0) {
        //     cClsType = 'tram';
        // }

        if (oData.currentState == '行驶' || oData.currentState == '停车'|| oData.currentState == '熄火') {
            cClsStatus = 'green';
        }
        else {
            cClsStatus = 'gray';
        }

        return cClsType + ' ' + cClsStatus;
    },

    // 初始化所有车辆列表
    initVehItems:function(aoDataList) {
        var $_oUL = $("<ul></ul>");
        if (!aoDataList || aoDataList.length <= 0) {
            this.initVehByAnimate($_oUL);
            return;
        }
        for (var i = 0; i < aoDataList.length; i++) {
            var cHtml = ''
            aoDataList[i].cCls = this.getTruckCls(aoDataList[i]);
            if(aoDataList[i].cCls.indexOf('gray') > -1 ){
                cHtml =ES.Util.template(this.cItemNoVideoHtml, aoDataList[i]);
            }else{
                cHtml =ES.Util.template(this.cItemHtml, aoDataList[i]);
            }
            var oLi = $(cHtml);
            oLi.data('data', aoDataList[i]);

            $_oUL.append(oLi);
        }
        return $_oUL;
    },

    // 给每一项绑定事件,给每一项绑定 定位，点击li 定位位置信息
    vehItemEvent: function ($_oUL) {
        var self = this;
        $_oUL.find("li").each(function () {
            // $(this).find("a").eq(0).bind("click", $(this), function (e) {
            //     var oGpsInfo = e.data.data('data');
            //     //ec-btn-secondary //ec-btn-default
            //     if ($(this).hasClass('ec-btn-secondary')) {
            //         $(this).removeClass('ec-btn-secondary').addClass('ec-btn-default');
            //         $(this).removeClass('track');
            //         self._oPage.fire('HubSvr.unsubGps', {aoGpsInfo: [oGpsInfo]});
            //         self._oPage.fire("MapView:LiveMange.removeAll");
            //     }
            //     else {
            //         $_oUL.find('a.track').click();
            //         self._oPage.fire('MapView:LiveMange.addLivePos', {oGpsInfo: oGpsInfo});
            //         // 加历史轨迹界
            //         self._oPage.fire('HubSvr.subGps', {aoGpsInfo: [oGpsInfo]});
            //         $(this).addClass('track');
            //         $(this).removeClass('ec-btn-default').addClass('ec-btn-secondary')
            //     }
            // });

            $(this).find("a").eq(0).bind("click", $(this), function (e) {
                var oGpsInfo = e.data.data('data');
                window.open("/mapViewHtml/html/trackview.html?token="+ES.MapView.oConfig.token+"&PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo);
            });
            $(this).find("a").eq(1).bind("click", $(this), function (e) {
                e.stopPropagation();
                var oGpsInfo = e.data.data('data');
                // 画当前点到界面
                self._oPage.fire("MapView:VehDetail.showDetail", {oGpsInfo: oGpsInfo});
                // 取消订阅
                self._oPage.fire('HubSvr.unsubGps', {aoGpsInfo: [oGpsInfo]});
                // 移除跟踪列表
                self._oPage.fire("MapView:LiveMange.removeAll");
                // 添加跟踪
                self._oPage.fire('HubSvr.subGps', {aoGpsInfo: [oGpsInfo]});
                // 取消其他设备订阅
                self._oPage.fire('HubSvr.unSubAlarm');
                //订阅车辆告警
                self._oPage.fire('HubSvr.subAlarm', {aoGpsInfo: oGpsInfo});
            });
            // 下发指令
            $(this).find("a").eq(2).bind("click", $(this), function (e) {
                var oGpsInfo = e.data.data('data');
                self._oParent.orderVehicleDialog = new ES.Common.AddType(self._oParent,{bRemove:true},{title: '下发指令',
                    content:'<div class="ex-command-tabs modelType">'+
                    '           <ul class="ex-command-tab ec-avg-sm-3">'+
                    '               <li data-index="1"><i class="ec-icon-btn ec-primary ec-icon-database"></i><span>拍照</span></li>'+
                    '               <li data-index="2"><i class="ec-icon-btn ec-primary ec-icon-life-ring"></i><span>点名</span></li>'+
                    '               <li data-index="3"><i class="ec-icon-btn ec-primary ec-icon-search"></i><span>语音文字</span></li>'+
                    // '               <li data-index="4"><i class="ec-icon-btn ec-primary ec-icon-file-o"></i><span>语音</span></li>'+
                    // '               <li data-index="5"><i class="ec-icon-btn ec-primary ec-icon-star"></i><span>参数设置</span></li>'+
                    '           </ul>'+
                    '         </div>'});
                self._oParent.orderVehicleDialog.del(oGpsInfo);
            });
            // 视频
            $(this).find("a").eq(3).bind("click", $(this), function (e) {
                ES.aSucess('视频页面')
                var oGpsInfo = e.data.data('data');
                window.open("/mapViewHtml/html/video.html?token="+ES.MapView.oConfig.token+"&PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo + "&cameraNum=" + oGpsInfo.cameraNum);
            });

        });
        // 实现定位人，并展示人的数据
        $_oUL.find("li").bind('click', function () {
            var oGpsInfo = $(this).data("data");
            $(this).siblings().removeClass('ec-active');
            $(this).addClass('ec-active');
            self._oPage.fire('MapView:LiveMange.addLivePos', {oGpsInfo: oGpsInfo});
            // 如果详情界面显示，则进行跟踪
            if ($('#MapShowDetail').css('bottom') === '0px') {
                // 取消其他设备订阅
                self._oPage.fire('HubSvr.unSubAlarm');
                //订阅车辆告警
                self._oPage.fire('HubSvr.subAlarm', {aoGpsInfo: oGpsInfo});
                // 取消订阅
                self._oPage.fire('HubSvr.unsubGps', {aoGpsInfo: [oGpsInfo]});
                // 添加跟踪
                self._oPage.fire('HubSvr.subGps', {aoGpsInfo: [oGpsInfo]});
            }

            // 定位到当前车辆
            self._oPage._oMap.flyTo(oGpsInfo.latLng, 16);
            self._oPage.fire("MapView:VehDetail.switchDetail", {oGpsInfo: oGpsInfo});
        });
    },
    // 获得项
    getVehItemConfig: function (oItem,nIndex) {
        oItem.cGpsDate = ES.Util.dateFormat((oItem.GpsTime ? oItem.GpsTime : 946684800) * 1000, 'yyyy-MM-dd hh:mm:ss');
        var oItemConfig = {
            div: [
                {
                    i: { class: 'icon-car-pin green', html: nIndex },
                    div: { class: 'carlist-title', h2: { html: oItem.VehicleNo }, p: { html: oItem.cGpsDate } },
                    //em: { class: 'carlist-fav ' , i: { class: 'ec-icon-star' } }
                },
                {
                    class: 'carlist-bottom',
                    div: {
                        class: 'carlist-btn',
                        a: [{ class: "ec-btn ec-btn-xs ec-round ec-btn-secondary ex-btn-moredetail", href: 'javascript:void(0)', html: '跟踪' },
                            { class: "ec-btn ec-btn-xs ec-round ec-btn-default", href: 'javascript:void(0)', html: '轨迹' },
                            { class: "ec-btn ec-btn-xs ec-round ec-btn-default", href: 'javascript:void(0)', html: '消息' }
                        ]
                    }
                }
            ]
        };
        return oItemConfig;
    },
    // 动画加载车辆列表
    initVehByAnimate: function ($_oUL) {
        var $_aoLi = this.$_oLstContainer.find("ul>li");
        if($_aoLi && $_aoLi.length>0)
        {
            this._oPage.fire("MapView:LiveMange.removeAll");
        }
        // 清除ul时要清除处理定位，实时跟踪
        this.$_oLstContainer.find("ul").remove();
        this.$_oLstContainer.append($_oUL);
        $_oUL.find('li').hide().each(function () {
            var $_oLI = $(this);
            var nIndex = $(this).index();
            setTimeout(function () {
                $_oLI.show().addClass('in')
            }, nIndex * 100);
        });
    },
    // 初始化分页
    initPager: function (oData) {
        // 初始化分页控件
        this._oParent.fire("MapView:Pager.reflashPager", { nTotalCnt: oData.detail.total });
    },
    // 如果没有StruckBox，就隐藏btn
    hideBtn:function () {
        this.$_oOpenBtn.hide();
        this.$_oCloseBtn.hide();
    },
});

// 车辆列表 关注处理
ES.MapView.TabPanel.VehLst.include({
    // 初始关注列表
    initAttend: function () {
        var anVehNo = [];
        // 获得所有的车牌号
        this.$_oLstContainer.find('li').each(function () {
            var oData = $(this).data("data");
            if (!oData) {
                return true;
            }
            anVehNo.push(oData.id);
        });
        if (anVehNo.length <= 0) {
            return;
        }
        var param = {
            "searchModel": {
                vehicleids:anVehNo
            },
            "editModel": {
                //"vehNo": "鄂J82219*"
            },
            "buttonId": 0,
            "pageIndex": 1,
            "pageSize": 2000
        }

        ES.getData(JSON.stringify(param), ES.MapView.oConfig.getFollowVehIds, function (oData) {
                // 设置车辆列表颜色
                if (!oData || oData.code !==1 || !oData.detail||!oData.detail.list|| oData.detail.list.length<=0) {
                    return;
                }

                for (var i = 0; i < oData.detail.list.length; i++) {
                    var oItem = oData.detail.list[i];
                    this.$_oLstContainer.find('li').each(function () {
                        var oVehInfo = $(this).data("data")
                        if (!oVehInfo || !oVehInfo.hasOwnProperty("id")) {
                            return true;
                        }
                        if (oVehInfo.id === oItem.id) {
                            $(this).find("em.ec-icon-star").parent().addClass("carlist-fav");
                            return false;
                        }
                    });
                }
            },
            this,
            null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });
    },
    // 注册关注事件
    initAttendEvent: function () {
        var self = this;
        // 注册关注事件
        this.$_oLstContainer.find(".ec-icon-star").parent().bind("click", function () {
            var oItem = $(this).parent().parent().data("data")
            if (!oItem) return;

            if ($(this).hasClass("carlist-fav")) {
                self.delAttend($(this), oItem);
            }
            else {
                // 添加关注
                self.addAttend($(this), oItem);
            }
        });
    },
    // 取消车辆关注
    delAttend: function ($_oEm, oItem) {
        if (!$_oEm) {
            return;
        }
        var self = this;
        // 车辆已经关注，取消关注
        var oTemp = {
            content: "确认要取消车辆[" + oItem.vehNo + "]关注吗？",
            okValue: '确定',
            ok: function () {
                var oTemp = {
                    searchModel: {
                        //vehNo:oItem.vehNo,
                    },
                    editModel: {
                        vehNo:oItem.vehNo,
                    },
                    buttonId :  4,
                    pageIndex: 1,
                    pageSize: 20
                };
                // 取消车辆
                ES.getData(JSON.stringify(oTemp), ES.MapView.oConfig.getFollowVehIds, function (oData) {
                        if (!oData || oData.code !== 1) {
                            // 取消关注车辆失败
                            return;
                        }
                        $_oEm.removeClass("carlist-fav");
                        self._oPage.fire("MapView:VehLst.refreshConcern");
                        //self._oPage.fire("deptTree:layer",{});
                    }, this,
                    null,
                    {
                        headers: {
                            token: ES.MapView.oConfig.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        }
                    });
            },
            cancelValue: '取消',
            cancel: null
        }
        var oWnd = this.initConfirmWnd(oTemp);
        oWnd.showModal();
    },

    //添加关注
    addAttend: function ($_oEm, oItem) {
        if (!$_oEm) return;
        var self = this;
        var oTemp = {
            searchModel: {
                //vehNo:oItem.vehNo,
            },
            editModel: {
                vehNo: oItem.vehNo,
            },
            buttonId: 2,
            pageIndex: 1,
            pageSize: 20
        };
        ES.getData(JSON.stringify(oTemp), ES.MapView.oConfig.getFollowVehIds, function (oData) {
                if (!oData ||  oData.code !==1) {
                    // 关注车辆失败
                    return;
                }
                $_oEm.addClass("carlist-fav");
                self._oPage.fire("MapView:VehLst.refreshConcern");
            }, this,
            null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            })
    },
    // 弹出层的设置
    initConfirmWnd: function (oOption) {
        var oTemp = {
            title: "提示",
            content: "是否删除数据",
            okValue: '确定',
            ok: null,
            cancelValue: '取消',
            cancel: null
        }
        ES.Util.extend(oTemp, oOption);
        var oWnd = dialog(oTemp);
        return oWnd;
    },

});

// html数据
ES.MapView.TabPanel.VehLst.include({
    cHtml: '<div class="ex-layout-carlist">' +
    '   <div class="ex-layout-carlist-title">' +
    '       <h4 class="ec-align-left">车辆列表 [共4000辆]</h4>' +
    '       <a href="javascript:;" class="ex-icon-turn on" ><i class="ec-icon-arrow-circle-left"></i></a>' +
    '       <a href="javascript:;" class="ex-icon-turn off" style="display:none;"><i class="ec-icon-arrow-circle-right"></i></a>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-wrap">' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group">' +
    '               <input type="text" class="ec-form-field" placeholder="请输入车牌号或设备号">' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs" type="button"><span class="ec-icon-search"></span> </button>' +
    '               </span>' +
    '           </div>' +
    '       </div>' +
    '       <div class="ex-layout-carlist-content"></div>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-page">' +
    '       <ul class="ec-pagination ec-pagination-center">' +
    '           <li class="ec-disabled"><a href="javascript:;">&laquo;</a></li>' +
    '           <li class="ec-active"><a href="javascript:;">1</a></li>' +
    '           <li><a href="javascript:;">2</a></li>' +
    '           <li><a href="javascript:;">3</a></li>' +
    '           <li><a href="javascript:;">4</a></li>' +
    '           <li><a href="javascript:;">5</a></li>' +
    '           <li><a href="javascript:;">&raquo;</a></li>' +
    '       </ul>' +
    '   </div>' +
    '</div>',

    cItemHtml:
    '<li class="slideup in" style="display: list-item;">' +
    '   <div class="carlist-card">' +
    '       <i class="{cCls}"></i>' +
    '       <div class="carlist-title">' +
    '           <h2 class="num">{vehNo}</h2>' +
    '           <p class="time">{gpsDate}</p>' +
    '       </div>' +
    '       <div class="">' +//
    '           <em class="ec-icon-star" style="float: right;"></em>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '   <div class="carlist-bottom">' +
    '       <div class="carlist-btn ex-vehicle-list-4">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">轨迹</a>' +
    '       </div>' +
    '       <div class="carlist-btn ex-vehicle-list-4">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">详情</a>' +
    '       </div>' +
    '       <div class="carlist-btn ex-vehicle-list-4">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">下发指令</a>' +
    '       </div>' +
    '       <div class="carlist-btn ex-vehicle-list-4">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">视频</a>'+ '' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '</li>',

    // 当前不在线并且没有视频按钮
    cItemNoVideoHtml:
    '<li class="slideup in" style="display: list-item;">' +
    '   <div class="carlist-card">' +
    '       <i class="{cCls}"></i>' +
    '       <div class="carlist-title">' +
    '           <h2 class="num">{vehNo}</h2>' +
    '           <p class="time">{gpsDate}</p>' +
    '       </div>' +
    '       <div class="">' +//
    '           <em class="ec-icon-star" style="float: right;"></em>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '   <div class="carlist-bottom">' +
    '       <div class="carlist-btn ex-vehicle-list-3">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">轨迹</a>' +
    '       </div>' +
    '       <div class="carlist-btn ex-vehicle-list-3">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">详情</a>' +
    '       </div>' +
    '       <div class="carlist-btn ex-vehicle-list-3">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">下发指令</a>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '</li>',
});

ES.MapView.TabPanel.AlarmTypes = ES.Evented.extend({
    // 查询面板控件
    oOption: {
        // 车辆url
        cUrl: '',
        // 当前关注车辆信息
        cAttentUrl: '',
        // 面板的最上级容器，不是车辆容器
        cDivContainerSel: '#classContainer',
        // 车辆容器
        cLstContainerSel: '.ex-layout-carlist-content',
        // 查询框容器
        cSearchInputSel: 'input.ec-form-field',
        // 查询btn容器
        cSearchBtnSel: 'button.ec-btn-secondary',
        // 打开查询列表的宽度 ，车辆列表宽度 + 树宽度

        cCheckEventName:'MapView:DeptTreeView.getDeptId',

        cUncheckEventName:'MapView:UnDeptTreeView.getDeptId',

    },


    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this._oPage = oParent._oParent;
        this.initOn();
        if (typeof this.oOption.cDivContainerSel === 'object') {
            this.$_oContainer = this.oOption.cDivContainerSel
        }
        else {
            this.$_oContainer = $(this.oOption.cDivContainerSel);
        }
        this.initUI();
    },

    initOn:function(){},
    // 高级查询
    initEvent: function () {
        var self =this;
        this.$_oitmeUl.on('click','li>a',function(){
            $(this).parent().addClass('ec-active').siblings().removeClass('ec-active');
            self._oPage.fire(self.oOption.cCheckEventName,{acId:[parseInt($(this).attr('data-id'))]});
            if(self.$_oStruck.siblings().width()==0){
                self.$_oStruck.siblings().find('a.ex-icon-turn.on').click();
            }
        });
    },

    initUI: function () {
        // 当前对象集合
        this.$_oStruck = $(this.cHtml);
        // 要根据报警类型来获取报警
        this.$_oContainer.append(this.$_oStruck);

        // 车辆容器
        this.$_oTitle = this.$_oStruck.find('h4');
        this.$_oTitle.html(this.oOption.cTitle);
        this.$_oitmeUl = this.$_oStruck.find('.ex-mapview-struct-ul')
        this.getAlarmLst();
    },


    getAlarmLst:function () {

        var param = {
            "searchModel": {
                menu_id: 1882
            },
            "editModel": {},
            "buttonId": 1,
            "pageIndex": 1,
            "pageSize": 20
        }

        ES.getData(JSON.stringify(param), ES.MapView.oConfig.getAlarmType, function (oData) {
                // 设置车辆列表颜色
                if (!oData || oData.code !== 1 || !oData.detail || oData.detail.length <= 0) {
                    return;
                }
                //var oUl= this.$_oStruck.find('ul.ex-mapview-struct-ul')
                for (var i = 0; i < oData.detail.length; i++) {
                    var oItem = oData.detail[i];
                    var li = '<li cflag="{dicValue}" class="ms-hover"><a href="#" data-id="{dicKey}"><i class="ec-icon-medium" title="{remark}"></i>{remark}</a></li>'
                    var oli = $(ES.template(li, oItem));
                    this.$_oitmeUl.append(oli);
                }

                this.initEvent();
            },
            this,
            null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });

    }

});

// html数据
ES.MapView.TabPanel.AlarmTypes.include({

    cHtml: '<div class="ex-layout-carlist" style="width:280px">' +
    '   <div class="ex-layout-carlist-title">' +
    '       <h4 class="ec-align-left">车辆列表 [共4000辆]</h4>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-wrap">' +
    '      <div>' +
    '          <ul class="ex-mapview-struct-ul">'+
    //'              <li cflag="Ek" class="ms-hover ec-active"><a href="#" data-id="8"><i class="ec-icon-bolt" title="掉电"></i>掉电</a></li>'+
    //'              <li cflag="open" class="ms-hover"><a href="#" data-id="100"><i class="ec-icon-medium" title="未密闭"></i>未密闭</a></li>'+
    //'              <li cflag="overload" class="ms-hover"><a href="#" data-id="101"><i class="ec-icon-truck" title="超载车辆"></i>超载车辆</a></li>'+
    //'              <li cflag="overspeed" class="ms-hover"><a href="#" data-id="106"><i class="ec-icon-tachometer" title="超速车辆"></i>超速车辆</a></li>'+
    //'              <li cflag="siteA" class="ms-hover"><a href="#" data-id="105"><i class="ec-icon-upload" title="可疑出土"></i>可疑出土</a></li>'+
    //'              <li cflag="unloadA" class="ms-hover" style="display: none"><a href="#" data-id="104"><i class="ec-icon-download" title="可疑消纳"></i>可疑消纳</a></li>'+
    //'              <li cflag="gnssFault" class="ms-hover"><a href="#" data-id="5"><i class="ec-icon-download" title="定位天线被剪断"></i>定位天线被剪断</a></li>'+
    //'              <li cflag="noWorkingTime" class="ms-hover"><a href="#" data-id="301"><i class="ec-icon-warning" title="非工作时间出土"></i>非工作时间运输</a></li>'+
    '          </ul>' +
    '      </div>'+
    '   </div>' +
    '</div>',

});

ES.MapView.TabPanel.AlarmVehLst = ES.MapView.TabPanel.VehLst.extend({

    // 初始化界面
    initData: function (nPage, fnCall) {

        // 添加 遮罩层
        ES.Util.loadAn(this.$_oLstContainer);
        var searchModel = {menu_id:1882,alermType:this.anDeptId[0]};

        var oParam = {
            searchModel:searchModel,
            editModel: {},
            buttonId:3,
            pageIndex: nPage,
            pageSize: ES.MapView.oConfig.nMaxPageSize
        };

        // 分页请求数据
        ES.getData(
            JSON.stringify(oParam),
            this.oOption.cUrl,
            fnCall,
            this,
            null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            }
        );
    },



});

ES.MapView.TabPanel.DeptVehLst = ES.MapView.TabPanel.VehLst.extend({

    initEvent:function () {
        var self = this;

        var $_check =  this.$_oStruck.find('.ex-layout-carlist-query');

        this.$_oOpenBtn.bind('click', function () {
            self.$_oStruck.css({ "opacity": "1"});
            self.$_oCloseBtn.show();
            $(this).hide();
            self._oParent.openTree();
        });

        //车辆列表父选框隐藏事件
        this.$_oCloseBtn.bind('click', function () {
            self.$_oStruck.css({"opacity": "1"});
            self.$_oOpenBtn.show();
            $(this).hide();
            self._oParent.closeTree();
        });

        $_check.bind('mouseover', function () {
            $(this).children('.ec-dropdown-content').show()
        });

        $_check.bind('mouseout', function () {
            $(this).children('.ec-dropdown-content').hide()
        });

        $_check.find('input[type="checkbox"]').bind('click',function () {
            // 触发查询接口
            self.initData(1,function(oData){

                var aoGps = self.toModle(oData);
                self.$_oTitle.find('span').text(oData.detail.total+' 辆');
                self.vehHandler(aoGps);
                self.initPager(oData);
            });
        });

        this.$_oStruck.find('.ec-dropdown-content').on('click','a' ,function () {
            var _icon = $(this).children('i').attr('class');
            // $(this).siblings().removeClass('ec-active');
            // $(this).addClass('ec-active');
            $_check.children('i').attr('class', _icon);
        });
        this.$_oStruck.find('input[type="checkbox"]').uCheck();


    },

    initData: function (nPage, fnCall) {

        ES.Util.loadAn(this.$_oLstContainer);
        var anStatus = []
        var bSpeed = this.$_oStruck.find('.ex-layout-carlist-query').find('input[type="checkbox"].speed').is(':checked');
        if (bSpeed) {
            anStatus.push(1)
        }
        var bStop = this.$_oStruck.find('.ex-layout-carlist-query').find('input[type="checkbox"].stop').is(':checked');
        if (bStop) {
            anStatus.push(2)
        }
        var bAcc = this.$_oStruck.find('.ex-layout-carlist-query').find('input[type="checkbox"].acc').is(':checked');
        if (bAcc) {
            anStatus.push(3)
        }
        var bLocal = this.$_oStruck.find('.ex-layout-carlist-query').find('input[type="checkbox"].local').is(':checked');
        if (bLocal) {
            anStatus.push(4)
        }
        var bLost = this.$_oStruck.find('.ex-layout-carlist-query').find('input[type="checkbox"].lost').is(':checked');
        if (bLost) {
            anStatus.push(5)
        }

        var searchModel = {veh_no: this.oSearchInput.val(), status: anStatus};
        if (this.anDeptId) {
            ES.extend(searchModel, {deptIds: this.anDeptId});
        }
        var oParam = {
            'searchModel': searchModel,
            'editModel': {},
            'pageIndex': nPage,
            'pageSize': ES.MapView.oConfig.nMaxPageSize
        };

        // 分页请求数据
        ES.getData(
            JSON.stringify(oParam),
            this.oOption.cUrl,
            fnCall,
            this,
            null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            }
        );
    },

});

ES.MapView.TabPanel.DeptVehLst.include({

    cHtml: '<div class="ex-layout-carlist">' +
    '   <div class="ex-layout-carlist-title">' +
    '       <h4 class="ec-align-left">车辆列表 [共4000辆]</h4>' +
    '       <a href="javascript:;" class="ex-icon-turn on" ><i class="ec-icon-arrow-circle-right"></i></a>' +
    '       <a href="javascript:;" class="ex-icon-turn off" style="display:none;"><i class="ec-icon-arrow-circle-left"></i></a>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-wrap">' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group"  style="width:80%; float:left">' +
    '               <input type="text" class="ec-form-field" placeholder="请输入车牌号或设备号">' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs" type="button"><span class="ec-icon-search"></span> </button>' +
    '               </span>' +
    '           </div> ' +
    '           <div class="ex-layout-carlist-query"> ' +
    '               <i class="ex-maptool-icon truck green"></i>' +
    '               <ul class="ec-avg-sm-1 ec-dropdown-content">' +
    '                   <li><a href="javascript:void(0);"> <label class="ec-checkbox-inline"><input type="checkbox" checked="checked"  class="ec-ucheck-checkbox speed" /> ' +
    '                           <i class="ex-maptool-icon truck green"></i> &nbsp;行驶车辆  </label>' +
    '                        </a>' +
    '                    </li>' +
    '                   <li><a href="javascript:void(0);"><label class="ec-checkbox-inline"><input type="checkbox" checked="checked"  class="ec-ucheck-checkbox stop" /> ' +
    '                           <i class="ex-maptool-icon truck green"></i>&nbsp;停车车辆</label>' +
    '                       </a>' +
    '                   </li>' +
    '                   <li><a href="javascript:void(0);"><label class="ec-checkbox-inline"><input type="checkbox" checked="checked"  class="ec-ucheck-checkbox acc" /> ' +
    '                           <i class="ex-maptool-icon truck green"></i>&nbsp;熄火车辆</label></a>' +
    '                   </li>' +
    '                   <li><a href="javascript:void(0);"><label class="ec-checkbox-inline"><input type="checkbox" checked="checked" class="ec-ucheck-checkbox local" /> ' +
    '                       <i class="ex-maptool-icon truck red"></i>&nbsp;定位失败</label></a>' +
    '                   </li>' +
    '                   <li><a href="javascript:void(0);"><label class="ec-checkbox-inline"><input type="checkbox" checked="checked" class="ec-ucheck-checkbox lost" /> ' +
    '                       <i class="ex-maptool-icon truck gray"></i>&nbsp;通讯中断</label></a>' +
    '                   </li>' +
    '               </ul>' +
    '           </div>' +
    '           <div class="clearfix"></div>' +
    '       </div>' +
    '       <div class="ex-layout-carlist-content"></div>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-page">' +
    '       <ul class="ec-pagination ec-pagination-center">' +
    '           <li class="ec-disabled"><a href="javascript:;">&laquo;</a></li>' +
    '           <li class="ec-active"><a href="javascript:;">1</a></li>' +
    '           <li><a href="javascript:;">2</a></li>' +
    '           <li><a href="javascript:;">3</a></li>' +
    '           <li><a href="javascript:;">4</a></li>' +
    '           <li><a href="javascript:;">5</a></li>' +
    '           <li><a href="javascript:;">&raquo;</a></li>' +
    '       </ul>' +
    '   </div>' +
    '</div>',

});

ES.MapView.TabPanel.FenceTreeView = ES.Evented.extend({

    // 查询面板控件
    oOption: {
        // 树的ur
        cUrl: '',
        // 面板的最上级容器，不是树容器
        cPContainer: '#classContainer',
        // 树节点容器
        cTreeContainerSel: '.ex-layout-struckbox-content',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn',
        //拖拽容器
        cDragBox: 'ex-layout-drag-box'

    },


    // 车辆列表构造函数
    initialize: function (oParent, oOption, oTOption) {

        // 树配置文档
        this.oTreeOption = oTOption;

        //设置当前树面板参数
        ES.setOptions(this, oOption);
        this._oParent = oParent;


        // 整个页面通信容器
        this._oPage = oParent._oParent;

        // JS 树对象，非jquery 对象
        this.oTree = null;

        this.$_oTreeContainer = null;
        this.$_oSearchInput = null;
        this.$_oSearchBtn = null;

        this.bCheck = true;

        // 初始化界面
        this.initOn();

        if (typeof this.oOption.cPContainer === 'object') {

            this.$_oPContainer = this.oOption.cPContainer
        }
        else {
            this.$_oPContainer = $(this.oOption.cPContainer);
        }

        this.initUI();

    },

    initUI: function () {

        this.$_oStruck = $(this.cHtml);
        this.$_oPContainer.append(this.$_oStruck);
        this.show();
        this.$_oTreeContainer = this.$_oStruck.find(this.oOption.cTreeContainerSel);
        this.$_oSearchInput = this.$_oStruck.find(this.oOption.cSearchInputSel);
        this.$_oSearchBtn = this.$_oStruck.find(this.oOption.cSearchBtnSel);
        this.$_oDragBox = this.$_oStruck.find(this.oOption.cDragBox);

        this.$_OpenBtn = this.$_oStruck.find('a.ex-icon-turn.off');
        this.$_CloseBtn = this.$_oStruck.find('a.ex-icon-turn.on');

        this.$_oStruck.find('h4').html(this.oOption.cTitle);

        this.initSearchEvent();

        this.initTree();

        this.$_OpenBtn.hide();
        this.$_CloseBtn.show();

        var self = this;

        //车辆列表父选框显示事件
        this.$_OpenBtn.bind('click', function () {
            self._oParent.showBox();
            self.$_CloseBtn.show();
            $(this).hide();
        });

        //车辆列表父选框隐藏事件
        this.$_CloseBtn.bind('click', function () {
            //self.$_oPContainer.fadeOut(500);
            self._oParent.hideBox();
            self.$_OpenBtn.show();
            $(this).hide();
            //self._oPage.resize(120);
        });

        this.initDragContainerEvent();
    },
    //拖动边框改变树的宽度
    initDragContainerEvent(){
        var resize = document.getElementById("resize");
        var left = document.getElementById("left");
        var right = document.getElementById("right");
        var box = document.getElementById("box");
        this.$_oDragBox.on('click', function(e){
            debugger
        })
    },

    onOffCtrl: function (bOn) {
        if(bOn){
            this.$_CloseBtn.hide();
            this.$_OpenBtn.show();
        }
        else{
            this.$_CloseBtn.show();
            this.$_OpenBtn.hide();
        }

    },

    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.$_oSearchBtn.bind('click', function () {
            if (!self.oPopTree) {
                return;
            }
            var cSearchVal = self.$_oSearchInput.val();
            // 触发查询
            self.$_oTree.search(cSearchVal, false, false);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.$_oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.$_oSearchInput.val();

                self.$_oTree.search(cSearchVal, false, false);
            }, 250);
        });
    },

    // 移除绘制工地
    removeDrawSite: function (oNode) {
        var anId = this.oPopTree.getSelfChildNode(oNode);
        this._oPage.fire('MV:Site.clearSites', {anId: anId});
    },

    // 画选中的工地
    drawCheckSite: function () {
        //获得所有的工地
        var anSiteId = this.oPopTree.getTreeCheckNode();
        if (!anSiteId || anSiteId.length <= 0) {
            return;
        }
        // 获得工地的GPS信息
        ES.getData({anSiteId: anSiteId}, ES.MapView.oConfig.cSiteInfoUrl, this.drawSite, this);
    },

    // 画一个工地
    drawOneSite: function (nSiteId) {
        ES.getData({anSiteId: [nSiteId]}, ES.MapView.oConfig.cSiteInfoUrl, this.drawSite, this);
    },

    initCheckHandler: function () {
        var self = this;
        this.oPopTree.checkCallBack = function (e, oThisNode) {
            if(self.bCheck) {
                // 定位到当前位置上
                if(oThisNode.node.children && oThisNode.node.children.length>0){
                    self.drawCheckSite();
                }
                else
                {
                    var cId = oThisNode.node.id;
                    self.drawOneSite(parseInt(cId.replace('s', '')));
                }
            }
        };
    },

    // 根据id重新初始化树
    clearTree: function () {
        this.oPopTree.uncheckAll();
        this.initCheckHandler();
    },

    // 显示面板
    show: function () {
        this.$_oStruck.show();
        //this.$_oStruck.fadeIn(500);
    },

    // 隐藏面板
    hide: function () {
        this.$_oStruck.hide();
        //this.$_oStruck.fadeOut(500);
    },

    // 画工地,对地图图层集合操作
    drawSite: function (oData) {
        this._oPage.fire('MV:Site.setSiteData', {aoSiteInfo: oData});
    },

    // 初始化界面
    initOn: function () {
        // 内部面板监听
        this._oParent.on("MapView:Struct.show", this.show, this);
        this._oParent.on("MapView:Struct.hide", this.hide, this);

        // 外部面板监听
        this._oPage.on("MapView:SiteStatic.Select", this.selectNode, this);
    },

    selectNode: function (oData) {
        if (!this.oPopTree || !oData || !oData.anLst) {
            return;
        }

        // 在树上找到id，选择
        this.oPopTree.uncheckAll();
        if(oData.anLst<=0){
            return;
        }

        var acItem = oData.anLst.map(function (nItem) {
            return 's' + nItem;
        });
        this.bCheck = false;
        this.oPopTree.setCheckNode(acItem);
        this.bCheck = true;
        this.drawCheckSite();
    },

    initTreeTitle: function () {
        this.$_oStruck.find("a").each(function () {
            $(this).attr("title", $(this).text());
        });
    },

});

// html 资源
ES.MapView.TabPanel.FenceTreeView.include({
    cHtml:
    // '<div class="ex-layout-drag-box" style="width:20px;background: yellow;height: 100%;position: relative;right: 0px;top: 0;overflow: hidden;z-index: 1011;float: left;"></div>'+
    '<div class="ex-layout-struckbox">' +
    '   <div class="ex-layout-struckbox-title">'+
    '       <h4 class="ec-align-left">车辆区域</h4>'+
    //'       <a href="javascript:;" class="ex-icon-turn"><i class="ec-icon-times-circle"></i></a>'+
    '   </div>'+
    '   <div class="ex-layout-struckbox-wrap">'+
    '       <div class="ex-layout-struckbox-search">'+
    '           <div class="ec-input-group">'+
    '               <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">'+
    '               <span class="ec-input-group-btn">'+
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>'+
    '               </span>'+
    '           </div>'+
    '       </div>'+
    '       <div class="ex-layout-struckbox-content"></div>'+

    '       <div class="ex-layout-advance-search" style="display:none;">'+

    '       </div>'+
    '   </div>'+
    '</div>',

});

// 树结构得包装
ES.MapView.TabPanel.FenceTreeView.include({

    // 构建树
    initTree: function () {

        this.oTree = this.$_oTreeContainer.jstree(this.oTreeOption);

        this.$_oTree = this.$_oTreeContainer.jstree(true);

        this.initTreeEvent();

        this.initCheckEven();
    },

    // 初始化树的事件
    initTreeEvent: function () {
        var self = this;

        this.oTree.on('ready.jstree', function (e, oThisNode) {
            // self.$_oTree.check_all();

            if (!self.readyCallBack) {
                return;
            }

            self.readyCallBack(e, oThisNode);
        });

        this.oTree.on('after_open.jstree', function (e, oThisNode) {
            if (!self.afterOpen) {
                return;
            }
            self.afterOpen(e, oThisNode);
        });

        this.oTree.on('refresh.jstree', function (e, oThisNode) {
            if (!self.refreshCallBack) {
                return;
            }
            self.refreshCallBack(e, oThisNode);
        });

        this.oTree.on('select_node.jstree', function (e, oThisNode) {
            if (!self.selectCallBack) {
                return;
            }
            self.selectCallBack(e, oThisNode);
        });

        this.oTree.on("changed.jstree", function (e, oThisNode) {
            if (!self.changedCallBack) {
                return;
            }
            self.changedCallBack(e, oThisNode);
        });

        this.oTree.on("dblclick.jstree", function (e, oThisNode) {
            if (!self.dblclickCallBack) {
                return;
            }
            self.dblclickCallBack(e, oThisNode);
        });
    },

    // checkbox 相关的事件
    initCheckEven: function () {
        var self = this;

        this.oTree.on('check_node.jstree', function (e, oThisNode) {
            if (!self.checkCallBack) {
                return;
            }
            self.checkCallBack(e, oThisNode);
        });

        // 取消 check 是的查询
        this.oTree.on('uncheck_node.jstree', function (e, oThisNode) {
            if (!self.uncheckCallBack) {
                return;
            }
            // 获得所有选中的数组
            self.uncheckCallBack(e, oThisNode);
        });

        // 选择所有节点触发
        this.oTree.on('check_all.jstree', function (e, oThisNode) {
            if (!self.checkAllCallBack) {
                return;
            }
            self.checkAllCallBack(e, oThisNode);
        });

        this.oTree.on('uncheck_all.jstree', function (e, oThisNode) {
            if (!self.uncheckAllCallBack) {
                return;
            }
            self.uncheckAllCallBack(e, oThisNode);
        });

    },

    /*
     * 树的节点操作
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    getCheckId: function () {
        var cPrefix = this.oOption.cPrefix;
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var acRtn = null;

        if (cPrefix) {
            acRtn = aoNodeId.map(function (cItem) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return cItem;
                }
            });
        }
        else {
            acRtn = aoNodeId;
        }
        return acRtn;
    },

    // 获得自己和 孩子节点id
    getSelfChildId: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }

        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {
            if (cPrefix) {
                if (acNodeId[0].indexOf(cPrefix) === 0) {
                    return acNodeId[0];
                }
                else {
                    return [];
                }
            }
            else {
                return acNodeId;
            }
        }

        $.merge(acNodeId, oNode.children_d);
        var cPrefix = this.oOption.cPrefix;
        var acRtn = null;
        if (cPrefix) {
            acRtn = $.grep(acNodeId, function (cItem, i) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return true;
                }
            });
        }
        else {
            acRtn = acNodeId
        }

        return acRtn;
    },

    // 获得操作节点 自己得和 所有孩子
    getSelfChildNode: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }
        var aoRtn = [];
        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {

            if(cPrefix) {
                if (acNodeId[0].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
            }

            return aoRtn;
        }

        $.merge(acNodeId, oNode.children_d);

        var cPrefix = this.oOption.cPrefix;


        for(var i = 0;i< acNodeId.length;i++){
            if(cPrefix) {
                if (acNodeId[i].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
            }

        }


        return aoRtn;
    },

    /*
     * 勾选回调函数
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    checkCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId()});
    },

    // 取消所有选择
    uncheckCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cUncheckEventName, {acId:this.getCheckId(), acUncheckId: this.getSelfChildId(oNode.node)});
    },
    checkAllCallBack:function(){
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId()});
    },
    uncheckAllCallBack:function(){
        this._oPage.fire(this.oOption.cUncheckEventName, {acId:this.getCheckId(), acUncheckId: this.getSelfChildId(oNode.node)});
    },

    // 取消所有的选择
    uncheckAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.uncheck_all) {
            return;
        }
        this.$_oTree.uncheck_all();
    },

    // 勾选 所有的选择
    checkAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.check_all) {
            return;
        }
        this.$_oTree.check_all();
    },

    // 设置叶子节点为check，参数为叶子节点id
    setCheckNode: function (anData) {
        if (!anData || anData.length <= 0) {
            return;
        }
        for (var i = 0; i < anData.length; i++) {
            this.$_oTree.check_node(this.$_oTree.get_node(anData[i]));
        }
    },
});

ES.MapView.TabPanel.FenceVehLst = ES.Evented.extend({
    // 查询面板控件
    oOption: {
        // 车辆url
        cUrl: '',
        // 当前关注车辆信息
        cAttentUrl: '',
        // 面板的最上级容器，不是车辆容器
        cDivContainerSel: '#classContainer',
        // 车辆容器
        cLstContainerSel: '.ex-layout-carlist-content',
        // 查询框容器
        cSearchInputSel: 'input.ec-form-field',
        // 查询btn容器
        cSearchBtnSel: 'button.ec-btn-secondary',
        // 打开查询列表的宽度 ，车辆列表宽度 + 树宽度

        cCheckEventName:'MapView:DeptTreeView.getDeptId',

        cUncheckEventName:'MapView:UnDeptTreeView.getDeptId',

    },
    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this._oPage = oParent._oParent;
        this.$_oLstContainer = null;
        this.$_oContainer = null;
        this.oSearchInput = null;
        this.oSearchBtn = null;
        // 部门id数组为空
        this.anDeptId = null;
        // 初始化界面
        this.initOn();
        if (typeof this.oOption.cDivContainerSel === 'object') {
            this.$_oContainer = this.oOption.cDivContainerSel
        }
        else {
            this.$_oContainer = $(this.oOption.cDivContainerSel);
        }
        this.initUI();
    },

    initUI: function () {
        // 当前对象集合
        this.$_oStruck = $(this.cHtml);
        this.$_oContainer.append(this.$_oStruck);
        // 车辆容器
        this.$_oLstContainer = this.$_oStruck.find(this.oOption.cLstContainerSel);
        this.oSearchInput = this.$_oStruck.find(this.oOption.cSearchInputSel);
        this.oSearchBtn = this.$_oStruck.find(this.oOption.cSearchBtnSel);
        this.$_oOpenBtn = this.$_oStruck.find('a.ex-icon-turn.on');
        this.$_oCloseBtn = this.$_oStruck.find('a.ex-icon-turn.off');
        this.$_oTitle = this.$_oStruck.find('h4');
        this.$_oTitle.html(this.oOption.cTitle+'<span style="margin-left: 2em;"></span>');
        this.initSearchEvent();
        var self =this;
        if(this._oParent.cFlag == "attend"){
            //第一次按照 用户 的权限加载数据
            this.initData(1,function(oData){
                var aoGps = self.toModle(oData);
                self.$_oTitle.find('span').text(oData.detail.total+' 辆')
                self.vehHandler(aoGps);
                self.initPager(oData);
            });
        }
        // 绑定tab 关闭打开按钮事件
        this.initEvent();
    },

    // 数据转化,
    toModle: function (oData) {
        var aoGps = [];
        if (!oData || !oData.detail|| !oData.detail.list  || oData.detail.list.length <= 0) {
            return aoGps;
        }
        for (var i = 0; i < oData.detail.list.length; i++) {
            var item = oData.detail.list[i]

            var oModel = {
                id:item.id,
                vehNo: item.vehNo,
                devNo: item.devNo,
                latLng: {lat: item.vehGpsData.Poi.MapPoint.Lat, lng: item.vehGpsData.Poi.MapPoint.Lon},
                gpsDate: item.vehGpsData.GpsDateTime,
                dir: item.vehGpsData.Direction,
                poi: item.vehGpsData.Poi.Address,
                speed: item.vehGpsData.Speed,
                status: item.vehGpsData.Status,
                currentState: item.vehGpsData.VehStatusString,
                mile: (item.vehGpsData.Mileage / 1000).toFixed(2),
                gpsTime: item.vehGpsData.GpsTime * 1000,
                cameraNum: item.cameraNum
            };
            aoGps.push(oModel);
        }
        return aoGps;
    },

    getPanel: function () {
        return this.$_oStruck
    },

    /**
     *  加载数据
     * @nPage 加载数据时的页数
     * @fnCall 加载数据的回调函数
     * @return 返回 null
     * */
    initData: function (nPage,fnCall) {
        // 添加 遮罩层
        ES.Util.loadAn(this.$_oLstContainer);
        var searchModel = {veh_no: this.oSearchInput.val(),status:[1,2,3,4,5]};
        if (this.anDeptId) {

            ES.extend(searchModel, {deptIds: this.anDeptId});
        }
        var oParam = {
            'searchModel':searchModel,
            'editModel': {},
            'pageIndex': nPage,
            'pageSize': ES.MapView.oConfig.nMaxPageSize
        };

        // 分页请求数据
        ES.getData(
            JSON.stringify(oParam),
            this.oOption.cUrl,
            fnCall,
            this,
            null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            }
        );
    },

    // 绑定tab 关闭打开按钮事件
    initEvent: function () {
        var self = this;
        this.$_oOpenBtn.bind('click', function () {
            //$struckList.fadeIn(500);
            //self._oParent.fire("MapView:Struct.show");
            self.$_oStruck.css({ "opacity": "1"});
            //self.$_oStruck.animate({"left": "220px", "opacity": "1"}, 300);
            self.$_oCloseBtn.show();
            $(this).hide();
            self._oParent.openTree();
            // self._oParent.fire('MapView:Menu.resize',{nWidth:self.oOption.nHideWidth});
            //treeList("click");
        });



        //车辆列表父选框隐藏事件
        this.$_oCloseBtn.bind('click', function () {
            //$struckList.fadeOut(500);
            //self._oParent.fire("MapView:Struct.hide");
            self.$_oStruck.css({"opacity": "1"});
            //self.$_oStruck.animate({"left": "0", "opacity": "1"}, 300);
            self.$_oOpenBtn.show();
            $(this).hide();
            self._oParent.closeTree();
            self._oParent._oParent.fire('MapView:LayoutContent.resize', {nWidth: $(window).width() - 260});
        });


    },

    // 获得外层容器的宽度
    getWidth: function () {
        if (this.$_oStruck.offset().left <= 80) {
            return 0;
        }
        return this.$_oStruck.width();
    },

    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearchBtn.bind('click', function () {
            self.initData(1,function(oData){
                var aoGps = self.toModle(oData);
                self.$_oTitle.find('span').text(oData.detail.total+' 辆')
                self.vehHandler(aoGps);
                self.initPager(oData);
            });
        });
        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {

                self.initData(1, function (oData) {
                    var aoGps =  self.toModle(oData)
                    self.$_oTitle.find('span').text(oData.detail.total+' 辆');
                    self.vehHandler(aoGps);
                    self.initPager(oData);
                });
            }, 500);
        });
    },

    show: function () {
        this.$_oStruck.show();
    },

    hide: function () {
        this.$_oStruck.hide();
    },

    // 初始化界面
    initOn: function () {
        // 翻页执行
        this._oParent.on('MapView:VehLst.onPagerSearch', this.pagerSearch, this);
        this._oParent.on('MapView:VehLst.initVehLst', this.initVehLst, this);
        if (this.oOption.cCheckEventName) {
            this._oPage.on(this.oOption.cCheckEventName, this.initVehLst, this);
        }
        //cUncheckEventName
        if (this.oOption.cUncheckEventName) {
            this._oPage.on(this.oOption.cUncheckEventName, this.initVehLst, this);
        }
        if(this._oParent.cFlag=="attend"){
            this._oPage.on("MapView:VehLst.refreshConcern", this.initVehLst, this);
        }
    },

    initVehLst: function (oData) {
        var anDeptId = [];
        if (oData.acId && oData.acId.length > 0) {
            for (var i = 0; i < oData.acId.length; i++) {
                anDeptId.push(parseInt(oData.acId[i]));
            }
        }

        this.anDeptId = anDeptId;

        var self = this;
        this.initData(1, function (oData) {
            var aoGps = self.toModle(oData);
            if (oData && oData.detail) {
                self.$_oTitle.find('span').text(oData.detail.total + ' 辆')
                self.vehHandler(aoGps);
                self.initPager(oData);
            }
            else {
                ES.Util.removeAn(this.$_oLstContainer);
            }
        });
    },

    pagerSearch: function (oData) {
        if (!oData || !oData.oSearchParam || !oData.oSearchParam.PageIndex) {
            return;
        }
        var self = this;
        this.initData(oData.oSearchParam.PageIndex, function (oData) {
            var aoGps =  self.toModle(oData)
            self.vehHandler(aoGps);
        });
    },

});

// 初始化界面
ES.MapView.TabPanel.FenceVehLst.include({
    // 初始化车辆列表数据
    vehHandler: function (oData) {
        // 移除遮罩层
        ES.Util.removeAn(this.$_oLstContainer);
        if(!oData){
            return ;
        }
        // 生存车辆列表
        var $_oUL = this.initVehItems(oData);
        if(!$_oUL) {
            return;
        }
        // 对所有车辆列表位置查询,并绘制车辆到地图图层
        //this.initVehLocal($_oUL);
        this.vehItemEvent($_oUL);
        this.initVehByAnimate($_oUL);
        this.initAttendEvent();
        this.initAttend();
    },
    // 加载车辆实时位置信息
    initVehLocal: function ($_oUL) {
        var $_aoLi = $_oUL.find("li");
        if (!$_aoLi || $_aoLi.length <= 0) {
            return;
        }
        var oAlarmData = [];
        for (var i = 0; i < $_aoLi.length; i++) {
            var oData = $($_aoLi[i]).data('data');
            if (!oData) {
                continue;
            }
            oAlarmData.push(oData.devNo);
        }
        // 获得车辆实时位置信息
        ES.getData({devNos : oAlarmData}, ES.MapView.oConfig.curPosUrl, this.curPosHandler, this);
    },
    // 设置车辆位置到地图
    curPosHandler: function (oTemp) {
        if (!oTemp) {
            return;
        }
        var aoTemp = this._oPage.toHeartModle(oTemp);
        var self = this;
        // 要不请求到的值赋值给li对象
        this.$_oLstContainer.find('li').each(function () {
            var oItem = $(this).data('data');
            if (!oItem) {
                return true;
            }
            for (var i = 0; i < aoTemp.length; i++) {
                if (aoTemp[i].devNo === oItem.devNo) {
                    $(this).find(".carlist-title > p.time").html(aoTemp[i].gpsDate);
                    aoTemp[i].id = oItem.id;
                    // 缓存当前也的数据
                    $(this).data('data', aoTemp[i]);
                    var cCls = self.getTruckCls(aoTemp[i]);
                    // 跟新车辆状态
                    $(this).find('.carlist-card>i')
                        .removeClass('green')
                        .removeClass('yellow')
                        .removeClass('gray')
                        .addClass(cCls);
                    break;
                }
            }
        });
    },

    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getTruckCls: function (oData) {

        var cClsType = 'truck';
        var cClsStatus = 'gray';
        // if (oData.carUseIn == 0) {
        //     cClsType = 'tram';
        // }

        if (oData.currentState == '行驶' || oData.currentState == '停车'|| oData.currentState == '熄火') {
            cClsStatus = 'green';
        }
        else {
            cClsStatus = 'gray';
        }

        return cClsType + ' ' + cClsStatus;
    },

    // 初始化所有车辆列表
    initVehItems:function(aoDataList) {
        var $_oUL = $("<ul></ul>");
        if (!aoDataList || aoDataList.length <= 0) {
            this.initVehByAnimate($_oUL);
            return;
        }
        for (var i = 0; i < aoDataList.length; i++) {
            var cHtml = ''
            aoDataList[i].cCls = this.getTruckCls(aoDataList[i]);
            if(aoDataList[i].cCls.indexOf('gray') > -1 ){
                cHtml =ES.Util.template(this.cItemNoVideoHtml, aoDataList[i]);
            }else{
                cHtml =ES.Util.template(this.cItemHtml, aoDataList[i]);
            }
            var oLi = $(cHtml);
            oLi.data('data', aoDataList[i]);

            $_oUL.append(oLi);
        }
        return $_oUL;
    },

    // 给每一项绑定事件,给每一项绑定 定位，点击li 定位位置信息
    vehItemEvent: function ($_oUL) {
        var self = this;
        $_oUL.find("li").each(function () {
            // $(this).find("a").eq(0).bind("click", $(this), function (e) {
            //     var oGpsInfo = e.data.data('data');
            //     //ec-btn-secondary //ec-btn-default
            //     if ($(this).hasClass('ec-btn-secondary')) {
            //         $(this).removeClass('ec-btn-secondary').addClass('ec-btn-default');
            //         $(this).removeClass('track');
            //         self._oPage.fire('HubSvr.unsubGps', {aoGpsInfo: [oGpsInfo]});
            //         self._oPage.fire("MapView:LiveMange.removeAll");
            //     }
            //     else {
            //         $_oUL.find('a.track').click();
            //         self._oPage.fire('MapView:LiveMange.addLivePos', {oGpsInfo: oGpsInfo});
            //         // 加历史轨迹界
            //         self._oPage.fire('HubSvr.subGps', {aoGpsInfo: [oGpsInfo]});
            //         $(this).addClass('track');
            //         $(this).removeClass('ec-btn-default').addClass('ec-btn-secondary')
            //     }
            // });

            $(this).find("a").eq(0).bind("click", $(this), function (e) {
                var oGpsInfo = e.data.data('data');
                window.open("/mapViewHtml/html/trackview.html?token="+ES.MapView.oConfig.token+"&PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo);
            });
            $(this).find("a").eq(1).bind("click", $(this), function (e) {
                e.stopPropagation();
                var oGpsInfo = e.data.data('data');
                // 画当前点到界面
                self._oPage.fire("MapView:VehDetail.showDetail", {oGpsInfo: oGpsInfo});
                // 取消订阅
                self._oPage.fire('HubSvr.unsubGps', {aoGpsInfo: [oGpsInfo]});
                // 移除跟踪列表
                self._oPage.fire("MapView:LiveMange.removeAll");
                // 添加跟踪
                self._oPage.fire('HubSvr.subGps', {aoGpsInfo: [oGpsInfo]});
                // 取消其他设备订阅
                self._oPage.fire('HubSvr.unSubAlarm');
                //订阅车辆告警
                self._oPage.fire('HubSvr.subAlarm', {aoGpsInfo: oGpsInfo});
            });
            // 下发指令
            $(this).find("a").eq(2).bind("click", $(this), function (e) {
                var oGpsInfo = e.data.data('data');
                self._oParent.orderVehicleDialog = new ES.Common.AddType(self._oParent,{bRemove:true},{title: '下发指令',
                    content:'<div class="ex-command-tabs modelType">'+
                    '           <ul class="ex-command-tab ec-avg-sm-3">'+
                    '               <li data-index="1"><i class="ec-icon-btn ec-primary ec-icon-database"></i><span>拍照</span></li>'+
                    '               <li data-index="2"><i class="ec-icon-btn ec-primary ec-icon-life-ring"></i><span>点名</span></li>'+
                    '               <li data-index="3"><i class="ec-icon-btn ec-primary ec-icon-search"></i><span>语音文字</span></li>'+
                    // '               <li data-index="4"><i class="ec-icon-btn ec-primary ec-icon-file-o"></i><span>语音</span></li>'+
                    // '               <li data-index="5"><i class="ec-icon-btn ec-primary ec-icon-star"></i><span>参数设置</span></li>'+
                    '           </ul>'+
                    '         </div>'});
                self._oParent.orderVehicleDialog.del(oGpsInfo);
            });
            // 视频
            $(this).find("a").eq(3).bind("click", $(this), function (e) {
                ES.aSucess('视频页面')
                var oGpsInfo = e.data.data('data');
                window.open("/mapViewHtml/html/video.html?token="+ES.MapView.oConfig.token+"&PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo + "&cameraNum=" + oGpsInfo.cameraNum);
            });

        });
        // 实现定位人，并展示人的数据
        $_oUL.find("li").bind('click', function () {
            var oGpsInfo = $(this).data("data");
            $(this).siblings().removeClass('ec-active');
            $(this).addClass('ec-active');
            self._oPage.fire('MapView:LiveMange.addLivePos', {oGpsInfo: oGpsInfo});
            // 如果详情界面显示，则进行跟踪
            if ($('#MapShowDetail').css('bottom') === '0px') {
                // 取消其他设备订阅
                self._oPage.fire('HubSvr.unSubAlarm');
                //订阅车辆告警
                self._oPage.fire('HubSvr.subAlarm', {aoGpsInfo: oGpsInfo});
                // 取消订阅
                self._oPage.fire('HubSvr.unsubGps', {aoGpsInfo: [oGpsInfo]});
                // 添加跟踪
                self._oPage.fire('HubSvr.subGps', {aoGpsInfo: [oGpsInfo]});
            }

            // 定位到当前车辆
            self._oPage._oMap.flyTo(oGpsInfo.latLng, 16);
            self._oPage.fire("MapView:VehDetail.switchDetail", {oGpsInfo: oGpsInfo});
        });
    },
    // 获得项
    getVehItemConfig: function (oItem,nIndex) {
        oItem.cGpsDate = ES.Util.dateFormat((oItem.GpsTime ? oItem.GpsTime : 946684800) * 1000, 'yyyy-MM-dd hh:mm:ss');
        var oItemConfig = {
            div: [
                {
                    i: { class: 'icon-car-pin green', html: nIndex },
                    div: { class: 'carlist-title', h2: { html: oItem.VehicleNo }, p: { html: oItem.cGpsDate } },
                    //em: { class: 'carlist-fav ' , i: { class: 'ec-icon-star' } }
                },
                {
                    class: 'carlist-bottom',
                    div: {
                        class: 'carlist-btn',
                        a: [{ class: "ec-btn ec-btn-xs ec-round ec-btn-secondary ex-btn-moredetail", href: 'javascript:void(0)', html: '跟踪' },
                            { class: "ec-btn ec-btn-xs ec-round ec-btn-default", href: 'javascript:void(0)', html: '轨迹' },
                            { class: "ec-btn ec-btn-xs ec-round ec-btn-default", href: 'javascript:void(0)', html: '消息' }
                        ]
                    }
                }
            ]
        };
        return oItemConfig;
    },
    // 动画加载车辆列表
    initVehByAnimate: function ($_oUL) {
        var $_aoLi = this.$_oLstContainer.find("ul>li");
        if($_aoLi && $_aoLi.length>0)
        {
            this._oPage.fire("MapView:LiveMange.removeAll");
        }
        // 清除ul时要清除处理定位，实时跟踪
        this.$_oLstContainer.find("ul").remove();
        this.$_oLstContainer.append($_oUL);
        $_oUL.find('li').hide().each(function () {
            var $_oLI = $(this);
            var nIndex = $(this).index();
            setTimeout(function () {
                $_oLI.show().addClass('in')
            }, nIndex * 100);
        });
    },
    // 初始化分页
    initPager: function (oData) {
        // 初始化分页控件
        this._oParent.fire("MapView:Pager.reflashPager", { nTotalCnt: oData.detail.total });
    },
    // 如果没有StruckBox，就隐藏btn
    hideBtn:function () {
        this.$_oOpenBtn.hide();
        this.$_oCloseBtn.hide();
    },
});

// 车辆列表 关注处理
ES.MapView.TabPanel.FenceVehLst.include({
    // 初始关注列表
    initAttend: function () {
        var anVehNo = [];
        // 获得所有的车牌号
        this.$_oLstContainer.find('li').each(function () {
            var oData = $(this).data("data");
            if (!oData) {
                return true;
            }
            anVehNo.push(oData.id);
        });
        if (anVehNo.length <= 0) {
            return;
        }
        var param = {
            "searchModel": {
                vehicleids:anVehNo
            },
            "editModel": {
                //"vehNo": "鄂J82219*"
            },
            "buttonId": 0,
            "pageIndex": 1,
            "pageSize": 2000
        }

        ES.getData(JSON.stringify(param), ES.MapView.oConfig.getFollowVehIds, function (oData) {
                // 设置车辆列表颜色
                if (!oData || oData.code !==1 || !oData.detail||!oData.detail.list|| oData.detail.list.length<=0) {
                    return;
                }

                for (var i = 0; i < oData.detail.list.length; i++) {
                    var oItem = oData.detail.list[i];
                    this.$_oLstContainer.find('li').each(function () {
                        var oVehInfo = $(this).data("data")
                        if (!oVehInfo || !oVehInfo.hasOwnProperty("id")) {
                            return true;
                        }
                        if (oVehInfo.id === oItem.id) {
                            $(this).find("em.ec-icon-star").parent().addClass("carlist-fav");
                            return false;
                        }
                    });
                }
            },
            this,
            null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });
    },
    // 注册关注事件
    initAttendEvent: function () {
        var self = this;
        // 注册关注事件
        this.$_oLstContainer.find(".ec-icon-star").parent().bind("click", function () {
            var oItem = $(this).parent().parent().data("data")
            if (!oItem) return;

            if ($(this).hasClass("carlist-fav")) {
                self.delAttend($(this), oItem);
            }
            else {
                // 添加关注
                self.addAttend($(this), oItem);
            }
        });
    },
    // 取消车辆关注
    delAttend: function ($_oEm, oItem) {
        if (!$_oEm) {
            return;
        }
        var self = this;
        // 车辆已经关注，取消关注
        var oTemp = {
            content: "确认要取消车辆[" + oItem.vehNo + "]关注吗？",
            okValue: '确定',
            ok: function () {
                var oTemp = {
                    searchModel: {
                        //vehNo:oItem.vehNo,
                    },
                    editModel: {
                        vehNo:oItem.vehNo,
                    },
                    buttonId :  4,
                    pageIndex: 1,
                    pageSize: 20
                };
                // 取消车辆
                ES.getData(JSON.stringify(oTemp), ES.MapView.oConfig.getFollowVehIds, function (oData) {
                        if (!oData || oData.code !== 1) {
                            // 取消关注车辆失败
                            return;
                        }
                        $_oEm.removeClass("carlist-fav");
                        self._oPage.fire("MapView:VehLst.refreshConcern");
                        //self._oPage.fire("deptTree:layer",{});
                    }, this,
                    null,
                    {
                        headers: {
                            token: ES.MapView.oConfig.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        }
                    });
            },
            cancelValue: '取消',
            cancel: null
        }
        var oWnd = this.initConfirmWnd(oTemp);
        oWnd.showModal();
    },

    //添加关注
    addAttend: function ($_oEm, oItem) {
        if (!$_oEm) return;
        var self = this;
        var oTemp = {
            searchModel: {
                //vehNo:oItem.vehNo,
            },
            editModel: {
                vehNo: oItem.vehNo,
            },
            buttonId: 2,
            pageIndex: 1,
            pageSize: 20
        };
        ES.getData(JSON.stringify(oTemp), ES.MapView.oConfig.getFollowVehIds, function (oData) {
                if (!oData ||  oData.code !==1) {
                    // 关注车辆失败
                    return;
                }
                $_oEm.addClass("carlist-fav");
                self._oPage.fire("MapView:VehLst.refreshConcern");
            }, this,
            null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            })
    },
    // 弹出层的设置
    initConfirmWnd: function (oOption) {
        var oTemp = {
            title: "提示",
            content: "是否删除数据",
            okValue: '确定',
            ok: null,
            cancelValue: '取消',
            cancel: null
        }
        ES.Util.extend(oTemp, oOption);
        var oWnd = dialog(oTemp);
        return oWnd;
    },

});

// html数据
ES.MapView.TabPanel.FenceVehLst.include({
    cHtml: '<div class="ex-layout-carlist">' +
    '   <div class="ex-layout-carlist-title">' +
    '       <h4 class="ec-align-left">车辆列表 [共4000辆]</h4>' +
    '       <a href="javascript:;" class="ex-icon-turn on" ><i class="ec-icon-arrow-circle-left"></i></a>' +
    '       <a href="javascript:;" class="ex-icon-turn off" style="display:none;"><i class="ec-icon-arrow-circle-right"></i></a>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-wrap">' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group">' +
    '               <input type="text" class="ec-form-field" placeholder="请输入车牌号或设备号">' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs" type="button"><span class="ec-icon-search"></span> </button>' +
    '               </span>' +
    '           </div>' +
    '       </div>' +
    '       <div class="ex-layout-carlist-content"></div>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-page">' +
    '       <ul class="ec-pagination ec-pagination-center">' +
    '           <li class="ec-disabled"><a href="javascript:;">&laquo;</a></li>' +
    '           <li class="ec-active"><a href="javascript:;">1</a></li>' +
    '           <li><a href="javascript:;">2</a></li>' +
    '           <li><a href="javascript:;">3</a></li>' +
    '           <li><a href="javascript:;">4</a></li>' +
    '           <li><a href="javascript:;">5</a></li>' +
    '           <li><a href="javascript:;">&raquo;</a></li>' +
    '       </ul>' +
    '   </div>' +
    '</div>',

    cItemHtml:
    '<li class="slideup in" style="display: list-item;">' +
    '   <div class="carlist-card">' +
    '       <i class="{cCls}"></i>' +
    '       <div class="carlist-title">' +
    '           <h2 class="num">{vehNo}</h2>' +
    '           <p class="time">{gpsDate}</p>' +
    '       </div>' +
    '       <div class="">' +//
    '           <em class="ec-icon-star" style="float: right;"></em>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '   <div class="carlist-bottom">' +
    '       <div class="carlist-btn ex-vehicle-list-4">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">轨迹</a>' +
    '       </div>' +
    '       <div class="carlist-btn ex-vehicle-list-4">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">详情</a>' +
    '       </div>' +
    '       <div class="carlist-btn ex-vehicle-list-4">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">下发指令</a>' +
    '       </div>' +
    '       <div class="carlist-btn ex-vehicle-list-4">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">视频</a>'+ '' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '</li>',

    // 当前不在线并且没有视频按钮
    cItemNoVideoHtml:
    '<li class="slideup in" style="display: list-item;">' +
    '   <div class="carlist-card">' +
    '       <i class="{cCls}"></i>' +
    '       <div class="carlist-title">' +
    '           <h2 class="num">{vehNo}</h2>' +
    '           <p class="time">{gpsDate}</p>' +
    '       </div>' +
    '       <div class="">' +//
    '           <em class="ec-icon-star" style="float: right;"></em>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '   <div class="carlist-bottom">' +
    '       <div class="carlist-btn ex-vehicle-list-3">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">轨迹</a>' +
    '       </div>' +
    '       <div class="carlist-btn ex-vehicle-list-3">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">详情</a>' +
    '       </div>' +
    '       <div class="carlist-btn ex-vehicle-list-3">' +
    '               <a class="ec-btn ec-btn-xs ec-round ec-btn-default" href="javascript:void(0);">下发指令</a>' +
    '       </div>' +
    '       <div class="clearfix"></div>' +
    '   </div>' +
    '</li>',
});

ES.MapView.TabPanel.LstPager = ES.Evented.extend({

    oOption: {
        // 页数
        nPage: 0,
        // 每页的记录数量
        nPageSize: 10,
        nPageIndex: 1,
        nBtnCnt: 8,
        nTotalCnt: 11,
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.$_oPanel = oOption.$_oContainer;

        this.$_aoLI =this.$_oPanel.find('.ex-layout-carlist-page > ul > li');

        this.calPage();
        // 初始化界面
        this.initBtn();
        this.initUI();
        this.initEven();
        this.initOn();

        //记录当前的页号
        this.nPageIndex = 2;
    },

    //计算中页数
    calPage: function () {
        if (this.oOption.nTotalCnt <= 0) {
            this.oOption.nPage = 0;
        }
        else {
            if (this.oOption.nTotalCnt % this.oOption.nPageSize == 0) {
                this.oOption.nPage = this.oOption.nTotalCnt / this.oOption.nPageSize;
            }
            else {
                this.oOption.nPage = parseInt(this.oOption.nTotalCnt / this.oOption.nPageSize) + 1;
            }
        }
    },

    // 根据当前的 页总数，页号，来初始化界面的分页按钮
    initUI: function () {
        // 按钮总数
        var nBtnCnt = this.oOption.nBtnCnt;
        // 页数
        var nPage = this.oOption.nPage;

        var aoLi = this.$_oPanel.find('.ex-layout-carlist-page > ul>li');

        //aoLi.removeClass("ec-disabled");

        //如果一条数据都没有 返回
        if (nPage == 0) {
            aoLi.addClass("ec-disabled");
            return;
        }

        // 初始化按钮数据
        aoLi.each(function (i) {
            if (i == 0 || i == 1) {
                $(this).addClass("ec-disabled");
            }
            else if (i == (nBtnCnt - 1) || i == (nBtnCnt - 2)) {
                if (nPage <= (nBtnCnt - 4)) {
                    $(this).addClass("ec-disabled");
                }
            }
            // 当存在分页按钮的情况下
            if (nBtnCnt > 4) {
                if (i == 2) {
                    $(this).addClass("ec-active");
                }
                else {
                    if ((i - 1) > nPage) {
                        $(this).addClass("ec-disabled");
                    }
                }
            }
        })

    },

    initOn: function () {

        this._oParent.on("MapView:Pager.reflashPager", this.reflashPager, this);
    },

    reflashPager: function (oData) {
        this.oOption.nTotalCnt = oData.nTotalCnt;

        this.calPage();
        this.initBtn();
        this.initUI();
        this.initEven();
        this.nPageIndex = 2;
    },

    initEven: function () {

        var self = this;
        //点击最后一个按钮
        var nLstIndex = this.oOption.nBtnCnt - 1;
        //下一页
        var nNextPage = this.oOption.nBtnCnt - 2;
        //分页按钮个数
        var nBtnPageCnt = this.oOption.nBtnCnt - 4;
        // 总条数
        var nTotalCnt = this.oOption.nTotalCnt
        // 页数
        var nPage = this.oOption.nPage;
        //每页的个数
        var nPageSize = this.oOption.nPageSize;

        var aoLi = this.$_oPanel.find('.ex-layout-carlist-page > ul>li')
        //点击第一个按钮时
        aoLi.eq(0).bind('click', function () {

            if ($(this).hasClass("ec-disabled")) return;

            $(this).addClass("ec-disabled");
            aoLi.eq(1).addClass("ec-disabled");

            //设置翻页可用
            if (nPage > nBtnPageCnt) {
                aoLi.eq(nLstIndex).removeClass("ec-disabled");
                aoLi.eq(nNextPage).removeClass("ec-disabled");
            }

            aoLi.removeClass("ec-active");

            //修改页号,并设置是否可用
            for (var i = 2 ; i < nNextPage; i++) {
                aoLi.eq(i).find("a").html(i - 1);
                if (i == 2) {// 触发查询
                    self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: 1 } });
                    aoLi.eq(i).addClass("ec-active");
                }
                aoLi.eq(i).removeClass("ec-disabled");
                if (i > self.oOption.nPage) {
                    aoLi.eq(i).addClass("ec-disabled");
                }
            }

            if (nBtnPageCnt == 0) {
                self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: 1 } });
            }

            // 按钮的分页 次数
            self.nPageIndex = 2;
        })

        aoLi.eq(nLstIndex).bind('click', function () {

            if ($(this).hasClass("ec-disabled")) return;
            $(this).addClass("ec-disabled");
            aoLi.eq(nNextPage).addClass("ec-disabled");

            if (self.oOption.nPage > nBtnPageCnt) {
                aoLi.eq(0).removeClass("ec-disabled");
                aoLi.eq(1).removeClass("ec-disabled");
            }
            if (nBtnPageCnt == 0) {
                self.nPageIndex = nPage
                self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: nPage } });
            }
            else {
                self.nPageIndex = Math.ceil(nPage / nBtnPageCnt);
            }

            var nBegin = nBtnPageCnt * (self.nPageIndex - 1);

            //修改页号,并设置是否可用
            for (var i = 2 ; i < nNextPage; i++) {

                nBegin = nBegin + 1
                aoLi.eq(i).find("a").html(nBegin);
                if (i == 2) {
                    self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: nBegin } });
                    aoLi.eq(i).addClass("ec-active");
                }
                aoLi.eq(i).removeClass("ec-disabled");
                if (nBegin > nPage) {
                    aoLi.eq(i).addClass("ec-disabled");
                }
            }


            //aoLi.removeClass("ec-active");
            //aoLi.eq(nLstIndex - 1).addClass("ec-active");

            self.nPageIndex = self.nPageIndex + 1;

        })

        // 点击中间的分页按钮，如果分页按钮不可用，不能触发点击，
        aoLi.bind('click', function () {
            // 如果不是点击中间任何一个按钮，返回
            if ($(this).index() == 0
                || $(this).index() == 1
                || $(this).index() == nNextPage
                || $(this).index() == nLstIndex) return;

            if ($(this).hasClass("ec-disabled")) return;

            aoLi.removeClass("ec-active");

            $(this).addClass("ec-active");
            // 触发查询
            var nSearchPage = parseInt($(this).find("a").text());

            self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: nSearchPage } });
        })

        // 绑定下一页按钮事件
        aoLi.eq(nNextPage).bind('click', function () {

            if ($(this).hasClass("ec-disabled")) return;
            //有按钮情况
            if (nBtnPageCnt > 0) {
                var nBegin = nBtnPageCnt * (self.nPageIndex - 1);
                //修改页号,并设置是否可用
                for (var i = 2 ; i < nNextPage; i++) {

                    nBegin = nBegin + 1;
                    aoLi.eq(i).find("a").html(nBegin);
                    aoLi.eq(i).removeClass("ec-active");
                    if (i == 2) {
                        self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: nBegin } });
                        aoLi.eq(i).addClass("ec-active");
                    }

                    aoLi.eq(i).removeClass("ec-disabled");

                    //设置完成后，修改按钮的状态
                    if ((nBegin * nPageSize - nTotalCnt) > nPageSize) {
                        aoLi.eq(i).addClass("ec-disabled");

                    }
                    if (nBegin * nPageSize > nTotalCnt) {
                        $(this).addClass("ec-disabled");
                        aoLi.eq(nLstIndex).addClass("ec-disabled");
                    }

                    aoLi.eq(0).removeClass("ec-disabled");
                    aoLi.eq(1).removeClass("ec-disabled");
                }
            } else {
                //无分页按钮情况
                if (self.nPageIndex * nPageSize < nTotalCnt) {

                    aoLi.eq(0).removeClass("ec-disabled");
                    aoLi.eq(1).removeClass("ec-disabled");
                }
                else {
                    $(this).addClass("ec-disabled");
                    aoLi.eq(nLstIndex).addClass("ec-disabled");
                }

                self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: self.nPageIndex } });
            }

            //下一页的预备
            self.nPageIndex = self.nPageIndex + 1;
        })

        //绑定上一页按钮事件
        aoLi.eq(1).bind('click', function () {
            //如果按钮不可用，返回，不做任何操作
            if ($(this).hasClass("ec-disabled")) return;

            //有按钮情况
            if (nBtnPageCnt > 0) {
                //计算下一页的开始值 nPageIndex 为下一页的值，故实际当前页为 nPageIndex -1
                // 然而你要返回到上一页，则上一页的值为 nPageIndex -1 -1
                var nBegin = nBtnPageCnt * (self.nPageIndex - 3);
                //修改页号,并设置是否可用
                for (var i = 2 ; i < nNextPage; i++) {
                    nBegin = nBegin + 1;
                    aoLi.eq(i).find("a").html(nBegin);
                    if (i == 2) {
                        self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: nBegin } });
                        aoLi.eq(i).addClass("ec-active");
                    }
                    aoLi.eq(i).removeClass("ec-disabled");
                }
                //设置完成后，修改按钮的状态
                if (nBegin == nBtnPageCnt) {
                    $(this).addClass("ec-disabled");
                    aoLi.eq(0).addClass("ec-disabled");
                }

                aoLi.eq(nNextPage).removeClass("ec-disabled");
                aoLi.eq(nLstIndex).removeClass("ec-disabled");

            }
            else {
                //无分页按钮情况
                if (self.nPageIndex == 3) {
                    $(this).addClass("ec-disabled");
                    aoLi.eq(0).addClass("ec-disabled");

                    aoLi.eq(nNextPage).removeClass("ec-disabled");
                    aoLi.eq(nLstIndex).removeClass("ec-disabled");
                }
                self._oParent.fire("MapView:VehLst.onPagerSearch", { oSearchParam: { PageIndex: self.nPageIndex - 2 } });
            }

            //下一页的预备
            self.nPageIndex = self.nPageIndex - 1;
        })
    },

    initBtn: function () {
        var aoUL = this.$_oPanel.find('.ex-layout-carlist-page > ul');
        aoUL.empty();
        // 按钮个数 分页至少有4个按钮
        for (var i = 0; i < this.oOption.nBtnCnt  ; i++) {
            if (i == 0) {
                //添加第一页，和上一页
                aoUL.append($('<li><a href="javascript:;"><i class="ec-icon-angle-double-left"></i></a></li>'));
                continue;
            }
            if (i == 1) {
                aoUL.append($('<li><a href="javascript:;"><i class="ec-icon-angle-left"></i></a></li>'));
                continue;
            }
            if (i == (this.oOption.nBtnCnt - 1)) {
                aoUL.append($('<li><a href="javascript:;"><i class="ec-icon-angle-double-right"></a></li>'));
                continue;
            }
            if (i == (this.oOption.nBtnCnt - 2)) {
                aoUL.append($('<li><a href="javascript:;"><i class="ec-icon-angle-right"></i></a></li>'));
                continue;
            }

            //添加中间按钮
            aoUL.append($('<li><a href="javascript:;">' + (i - 1) + '</a></li>'));

        }
    },

});

ES.MapView.TabPanel.OnlyTreeView = ES.Evented.extend({

    // 查询面板控件
    oOption: {
        // 树的ur
        cUrl: '',
        // 面板的最上级容器，不是树容器
        cPContainer: '#classContainer',
        // 树节点容器
        cTreeContainerSel: '.ex-layout-struckbox-content',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn',
        //拖拽容器
        cDragBox: 'ex-layout-drag-box',

        reqVehDataUrl: 'http://api.bdlbs.comlbs.com/bb/map/mapview'

    },


    // 车辆列表构造函数
    initialize: function (oParent, oOption, oTOption) {

        // 树配置文档
        this.oTreeOption = oTOption;

        //设置当前树面板参数
        ES.setOptions(this, oOption);
        this._oParent = oParent;


        // 整个页面通信容器
        this._oPage = oParent._oParent;

        // JS 树对象，非jquery 对象
        this.oTree = null;

        this.$_oTreeContainer = null;
        this.$_oSearchInput = null;
        this.$_oSearchBtn = null;

        this.bCheck = true;

        // 初始化界面
        this.initOn();

        if (typeof this.oOption.cPContainer === 'object') {

            this.$_oPContainer = this.oOption.cPContainer
        }
        else {
            this.$_oPContainer = $(this.oOption.cPContainer);
        }

        this.initUI();

    },

    initUI: function () {

        this.$_oStruck = $(this.cHtml);
        this.$_oPContainer.append(this.$_oStruck);
        this.show();
        this.$_oTreeContainer = this.$_oStruck.find(this.oOption.cTreeContainerSel);
        this.$_oSearchInput = this.$_oStruck.find(this.oOption.cSearchInputSel);
        this.$_oSearchBtn = this.$_oStruck.find(this.oOption.cSearchBtnSel);
        this.$_oDragBox = this.$_oStruck.find(this.oOption.cDragBox);

        this.$_OpenBtn = this.$_oStruck.find('a.ex-icon-turn.off');
        this.$_CloseBtn = this.$_oStruck.find('a.ex-icon-turn.on');

        this.$_oStruck.find('h4').html(this.oOption.cTitle);

        this.initSearchEvent();

        this.initTree();

        this.$_OpenBtn.hide();
        this.$_CloseBtn.show();

        var self = this;

        //车辆列表父选框显示事件
        this.$_OpenBtn.bind('click', function () {
            self._oParent.showBox();
            self.$_CloseBtn.show();
            $(this).hide();
        });

        //车辆列表父选框隐藏事件
        this.$_CloseBtn.bind('click', function () {
            //self.$_oPContainer.fadeOut(500);
            self._oParent.hideBox();
            self.$_OpenBtn.show();
            $(this).hide();
            //self._oPage.resize(120);
        });
    },
    onOffCtrl: function (bOn) {
        if(bOn){
            this.$_CloseBtn.hide();
            this.$_OpenBtn.show();
        }
        else{
            this.$_CloseBtn.show();
            this.$_OpenBtn.hide();
        }

    },

    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.$_oSearchBtn.bind('click', function () {
            if (!self.oPopTree) {
                return;
            }
            var cSearchVal = self.$_oSearchInput.val();
            // 触发查询
            self.$_oTree.search(cSearchVal, false, false);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.$_oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.$_oSearchInput.val();

                self.$_oTree.search(cSearchVal, false, false);
            }, 250);
        });
    },

    // 移除绘制工地
    removeDrawSite: function (oNode) {
        var anId = this.oPopTree.getSelfChildNode(oNode);
        this._oPage.fire('MV:Site.clearSites', {anId: anId});
    },

    // 画选中的工地
    drawCheckSite: function () {
        //获得所有的工地
        var anSiteId = this.oPopTree.getTreeCheckNode();
        if (!anSiteId || anSiteId.length <= 0) {
            return;
        }
        // 获得工地的GPS信息
        ES.getData({anSiteId: anSiteId}, ES.MapView.oConfig.cSiteInfoUrl, this.drawSite, this);
    },

    // 画一个工地
    drawOneSite: function (nSiteId) {
        ES.getData({anSiteId: [nSiteId]}, ES.MapView.oConfig.cSiteInfoUrl, this.drawSite, this);
    },

    initCheckHandler: function () {
        var self = this;
        this.oPopTree.checkCallBack = function (e, oThisNode) {
            if(self.bCheck) {
                // 定位到当前位置上
                if(oThisNode.node.children && oThisNode.node.children.length>0){
                    self.drawCheckSite();
                }
                else
                {
                    var cId = oThisNode.node.id;
                    self.drawOneSite(parseInt(cId.replace('s', '')));
                }
            }
        };
    },

    // 根据id重新初始化树
    clearTree: function () {
        this.oPopTree.uncheckAll();
        this.initCheckHandler();
    },

    // 显示面板
    show: function () {
        this.$_oStruck.show();
        //this.$_oStruck.fadeIn(500);
    },

    // 隐藏面板
    hide: function () {
        this.$_oStruck.hide();
        //this.$_oStruck.fadeOut(500);
    },

    // 画工地,对地图图层集合操作
    drawSite: function (oData) {
        this._oPage.fire('MV:Site.setSiteData', {aoSiteInfo: oData});
    },
    // 画单个的点
    drawSingleMarker: function(oData){
        this._oPage.fire('MV:Marker.setSingleMarker', oData);
    },

    // 初始化界面
    initOn: function () {
        // 内部面板监听
        this._oParent.on("MapView:Struct.show", this.show, this);
        this._oParent.on("MapView:Struct.hide", this.hide, this);

        // 外部面板监听
        this._oPage.on("MapView:SiteStatic.Select", this.selectNode, this);
    },

    selectNode: function (oData) {
        if (!this.oPopTree || !oData || !oData.anLst) {
            return;
        }

        // 在树上找到id，选择
        this.oPopTree.uncheckAll();
        if(oData.anLst<=0){
            return;
        }

        var acItem = oData.anLst.map(function (nItem) {
            return 's' + nItem;
        });
        this.bCheck = false;
        this.oPopTree.setCheckNode(acItem);
        this.bCheck = true;
        this.drawCheckSite();
    },

    initTreeTitle: function () {
        this.$_oStruck.find("a").each(function () {
            $(this).attr("title", $(this).text());
        });
    },

});

// html 资源
ES.MapView.TabPanel.OnlyTreeView.include({
    cHtml:
    // '<div class="ex-layout-drag-box" style="width:20px;background: yellow;height: 100%;position: relative;right: 0px;top: 0;overflow: hidden;z-index: 1011;float: left;"></div>'+
    '<div class="ex-layout-struckbox">' +
    '   <div class="ex-layout-struckbox-title">'+
    '       <h4 class="ec-align-left">车辆区域</h4>'+
    '       <a href="javascript:;" class="ex-icon-turn"><i class="ec-icon-times-circle" style="display: none"></i></a>'+
    '   </div>'+
    '   <div class="ex-layout-struckbox-wrap">'+
    '       <div class="ex-layout-struckbox-search">'+
    '           <div class="ec-input-group">'+
    '               <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">'+
    '               <span class="ec-input-group-btn">'+
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>'+
    '               </span>'+
    '           </div>'+
    '       </div>'+
    '       <div class="ex-layout-struckbox-content"></div>'+

    '       <div class="ex-layout-advance-search" style="display:none;">'+

    '       </div>'+
    '   </div>'+
    '</div>',

});

// 树结构的包装
ES.MapView.TabPanel.OnlyTreeView.include({

    // 构建树
    initTree: function () {

        this.oTree = this.$_oTreeContainer.jstree(this.oTreeOption);

        this.$_oTree = this.$_oTreeContainer.jstree(true);

        this.initTreeEvent();

        this.initCheckEven();
    },

    // 初始化树的事件
    initTreeEvent: function () {
        var self = this;

        this.oTree.on('ready.jstree', function (e, oThisNode) {
            // self.$_oTree.check_all();

            if (!self.readyCallBack) {
                return;
            }

            self.readyCallBack(e, oThisNode);
        });

        this.oTree.on('after_open.jstree', function (e, oThisNode) {
            if (!self.afterOpen) {
                return;
            }
            self.afterOpen(e, oThisNode);
        });

        this.oTree.on('refresh.jstree', function (e, oThisNode) {
            if (!self.refreshCallBack) {
                return;
            }
            self.refreshCallBack(e, oThisNode);
        });

        this.oTree.on('select_node.jstree', function (e, oThisNode) {
            if (!self.selectCallBack) {
                return;
            }
            self.selectCallBack(e, oThisNode);
        });

        this.oTree.on("changed.jstree", function (e, oThisNode) {
            if (!self.changedCallBack) {
                return;
            }
            self.changedCallBack(e, oThisNode);
        });

        this.oTree.on("dblclick.jstree", function (e, oThisNode) {
            if (!self.dblclickCallBack) {
                return;
            }
            self.dblclickCallBack(e, oThisNode);
        });
    },

    // checkbox 相关的事件
    initCheckEven: function () {
        var self = this;

        this.oTree.on('check_node.jstree', function (e, oThisNode) {
            if (!self.checkCallBack) {
                return;
            }
            self.checkCallBack(e, oThisNode);
        });

        // 取消 check 是的查询
        this.oTree.on('uncheck_node.jstree', function (e, oThisNode) {
            if (!self.uncheckCallBack) {
                return;
            }
            // 获得所有选中的数组
            self.uncheckCallBack(e, oThisNode);
        });

        // 选择所有节点触发
        this.oTree.on('check_all.jstree', function (e, oThisNode) {
            if (!self.checkAllCallBack) {
                return;
            }
            self.checkAllCallBack(e, oThisNode);
        });

        this.oTree.on('uncheck_all.jstree', function (e, oThisNode) {
            if (!self.uncheckAllCallBack) {
                return;
            }
            self.uncheckAllCallBack(e, oThisNode);
        });

    },

    /*
     * 树的节点操作
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    getCheckId: function () {
        var cPrefix = this.oOption.cPrefix;
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var acRtn = null;

        if (cPrefix) {
            acRtn = aoNodeId.map(function (cItem) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return cItem;
                }
            });
        }
        else {
            acRtn = aoNodeId;
        }
        return acRtn;
    },

    // 获得自己和 孩子节点id
    getSelfChildId: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }

        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {
            if (cPrefix) {
                if (acNodeId[0].indexOf(cPrefix) === 0) {
                    return acNodeId[0];
                }
                else {
                    return [];
                }
            }
            else {
                return acNodeId;
            }
        }

        $.merge(acNodeId, oNode.children_d);
        var cPrefix = this.oOption.cPrefix;
        var acRtn = null;
        if (cPrefix) {
            acRtn = $.grep(acNodeId, function (cItem, i) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return true;
                }
            });
        }
        else {
            acRtn = acNodeId
        }

        return acRtn;
    },

    // 获得操作节点 自己得和 所有孩子
    getSelfChildNode: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }
        var aoRtn = [];
        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {

            if(cPrefix) {
                if (acNodeId[0].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
            }

            return aoRtn;
        }

        $.merge(acNodeId, oNode.children_d);

        var cPrefix = this.oOption.cPrefix;


        for(var i = 0;i< acNodeId.length;i++){
            if(cPrefix) {
                if (acNodeId[i].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
            }

        }


        return aoRtn;
    },

    /*
     * 勾选回调函数
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    checkCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId()});
    },

    // 取消所有选择
    uncheckCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cUncheckEventName, {acId:this.getCheckId(), acUncheckId: this.getSelfChildId(oNode.node)});
    },
    checkAllCallBack:function(){
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId()});
    },
    uncheckAllCallBack:function(){
        this._oPage.fire(this.oOption.cUncheckEventName, {acId:this.getCheckId(), acUncheckId: this.getSelfChildId(oNode.node)});
    },

    // 取消所有的选择
    uncheckAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.uncheck_all) {
            return;
        }
        this.$_oTree.uncheck_all();
    },

    // 勾选 所有的选择
    checkAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.check_all) {
            return;
        }
        this.$_oTree.check_all();
    },

    // 设置叶子节点为check，参数为叶子节点id
    setCheckNode: function (anData) {
        if (!anData || anData.length <= 0) {
            return;
        }
        for (var i = 0; i < anData.length; i++) {
            this.$_oTree.check_node(this.$_oTree.get_node(anData[i]));
        }
    },

    // 单击选择回调函数
    selectCallBack: function(e, oNode){
        this.getVehicleData(oNode.node)
    },
    getVehicleData: function(oData){
        var vehicleId = oData.id
        var self = this
        if(vehicleId.indexOf('-') > -1){
            var oParams = {
                "searchModel": {
                    "veh_no":oData.text,
                    "deptIds": [parseInt(oData.parent)],
                    "status":[1,2,3,4,5]
                },
                "editModel":{},
                "pageIndex":1,
                "pageSize":10
            }
            ES.getData(JSON.stringify(oParams), this.oOption.reqVehDataUrl,function(oData){
                if(oData.code == 1){
                    for (var i = 0; i < oData.detail.list.length; i++) {
                        var oLatLng = {
                            lat: oData.detail.list[i].vehGpsData.Lat,
                            lng: oData.detail.list[i].vehGpsData.Lon,
                        };
                        oData.detail.list[i].latLng = oLatLng;
                        self.drawSingleMarker(oData.detail.list[i])
                        self._oPage.fire("MapView:VehDetail.switchDetail", {oGpsInfo: oData.detail.list[i]});
                    }
                }else{
                    ES.aWarn('未查询到车辆信息！')
                    return
                }
            },this,null, {headers: {token: ES.MapView.oConfig.token, "Content-Type": 'application/json; charset=utf-8'}})
        }
    }
});

ES.MapView.TabPanel.RectSearch = ES.Evented.extend({

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this._oPage = oParent._oParent;
        //this.$_oLstContainer = null;
        this.$_oContainer = null;
        // this.oSearchInput = null;
        // this.oSearchBtn = null;
        // // 部门id数组为空
        // this.anDeptId = null;
        // 初始化界面
        this.initOn();
        if (typeof this.oOption.cDivContainerSel === 'object') {
            this.$_oContainer = this.oOption.cDivContainerSel
        }
        else {
            this.$_oContainer = $(this.oOption.cDivContainerSel);
        }
        this.initUI();
    },

    initOn:function(){

    },
    // 高级查询
    initEvent: function () {
        var self =this;
        this.$_SearchBtn.on('click',function(){

            if(self.$_oStruck.siblings().width()==0){
                self.$_oStruck.siblings().find('a.ex-icon-turn.on').click();
            }

            if(self.restTimeType==0){
                self.oParam.StartTs = $('#RectBeginTime').val();
                self.oParam.EndTs = $('#RectEndTime').val();
            }else{
                self.oParam.StartTs =self.desendMinutes(new Date(),5).Format('yyyy-MM-dd HH:mm:ss');
                self.oParam.EndTs = new Date().Format('yyyy-MM-dd HH:mm:ss');
            }

            self.saveSearch();

        });

        this.$_restType.on('click','button.edit',function(){
            $(this).hide().siblings().show();
            self.DrawRect();
        });

        this.$_restType.on('click','button.clear',function(){
            $(this).hide().siblings().show();

            self.reSetSearch();
        });

        this.$_restTimeType.on('click','button',function(){
            $(this).removeClass('white').siblings().addClass('white');
            var _historyBox = $(this).parent().siblings('div.ex-rect-time-history');
            if($(this).index()==0){
                self.restTimeType = 0;
                _historyBox.find('.ex-rect-time').show().siblings('.ex-rect-time-now').hide();
            }else{
                self.restTimeType = 1;
                _historyBox.find('.ex-rect-time-now').show().siblings('.ex-rect-time').hide()

            }
        });

        $("#RectBeginTime").click(function () {
            WdatePicker({
                dateFmt: "yyyy-MM-dd HH:mm:ss",
                isShowClear: false,
                maxDate: '#F{$dp.$D(\'RectEndTime\')}'
            });
        });
        $("#RectEndTime").click(function () {
            WdatePicker({
                dateFmt: "yyyy-MM-dd HH:mm:ss",
                isShowClear: false,
                minDate: '#F{$dp.$D(\'RectBeginTime\')}'
            });
        });
        this._oPage.on("RectSearch:setLayerGps",this.setLayerGps,this)
    },

    DrawRect:function(){
        this._oPage.fire("RectView:layer")

    },
    setLayerGps:function(oData){
        this.oParam =oData.oParam;
        this.$_SearchBtn.removeClass('ec-disabled');
    },
    saveSearch:function(){
        this._oPage.fire(this.oOption.cCheckEventName,{Data:this.oParam})
    },
    reSetSearch:function(){
        this._oPage.fire("unRectView:layer");
        this._oPage.fire("unVehicleLine:layer");
        this._oPage.fire(this.oOption.cCheckEventName,{Data:{}})
        this.$_SearchBtn.addClass('ec-disabled');
    },

    initUI: function () {
        // 当前对象集合
        this.$_oStruck = $(this.cHtml);
        this.$_oContainer.append(this.$_oStruck);
        // 车辆容器

        this.$_oTitle = this.$_oStruck.find('h4');
        this.$_oTitle.html(this.oOption.cTitle);
        this.$_SearchBtn = this.$_oStruck.find('#rectSearch')
        this.$_restType = this.$_oStruck.find('.ex-btn-restType');
        this.$_restTimeType = this.$_oStruck.find('.ex-rect-time-select');
        this.initEvent();
        this.restTimeType = 0;
        this.oParam = {};
    },
    desendMinutes:function(date,minutes){

        minutes=parseInt(minutes);

        var   interTimes=minutes*60*1000;

        interTimes=parseInt(interTimes);

        return   new Date(Date.parse(date)-interTimes);

    }


});

// html数据
ES.MapView.TabPanel.RectSearch.include({
    cHtml: '<div class="ex-layout-carlist" style="width:280px">' +
    '   <div class="ex-layout-carlist-title">' +
    '       <h4 class="ec-align-left"></h4>' +
    '   </div>' +
    '   <div class="ex-layout-carlist-wrap">' +
    '      <div class="ex-rect-box">' +
    '           <ul>' +
    '               <li>' +
    // '                   <h2>选择拉框类型：</h2>' +
    '                   <div class="ec-btn-group ex-btn-restType">' +
    '                       <button type="button" class="ec-btn ec-btn-primary ec-btn-block ec-radius white edit"> 绘制矩形拉框 </button>' +
    '                       <button type="button" class="ec-btn ec-btn-primary ec-btn-block ec-radius clear" style="display:none;margin: 0;"> 清除拉框 </button>' +
    '                   </div>' +
    '               </li>' +
    '               <li>' +
    '                   <h2>查询时间：</h2>' +
    '                   <div class="ec-btn-group ex-rect-time-select">' +
    '                       <button type="button" class="ec-btn ec-btn-primary ec-round">查询历史</button>' +
    '                       <button type="button" class="ec-btn ec-btn-primary ec-round white">查询实时</button>' +
    '                   </div>' +
    '                   <div class="ex-rect-time-history">' +
    '                       <div class="ex-rect-time">' +
    '                           <label for="">开始时间</label>' +
    '                           <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
    '                               <input size="16" type="text" value="" id="RectBeginTime" class="ec-form-field" ">' +
    '                               <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>' +
    '                           </div>' +
    '                       </div>' +
    '                       <div class="ex-rect-time">' +
    '                           <label for="">结束时间</label>' +
    '                           <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
    '                               <input size="16" type="text" value="" id="RectEndTime" class="ec-form-field" ">' +
    '                               <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>' +
    '                           </div>' +
    '                       </div>' +
    '                       <div class="ex-rect-time-now">' +
    '                           <h3>查询当前时间五分钟内的车辆列表</h3>' +
    '                       </div>' +
    '                   </div>' +
    '               </li>' +
    '               <li>' +
    '                   <a type="button"  class="ec-btn ec-btn-success ec-radius ec-btn-block ec-disabled" id="rectSearch"><i class="ec-icon-search"></i>&nbsp;&nbsp;查&nbsp;&nbsp;&nbsp;&nbsp;询</a>' +
    '               </li>' +
    '           </ul>' +
    '      </div>'+
    '   </div>' +
    '</div>',
});

ES.MapView.TabPanel.TreeView = ES.Evented.extend({

    // 查询面板控件
    oOption: {
        // 树的ur
        cUrl: '',
        // 面板的最上级容器，不是树容器
        cPContainer: '#classContainer',
        // 树节点容器
        cTreeContainerSel: '.ex-layout-struckbox-content',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn',
        //拖拽容器
        cDragBox: 'ex-layout-drag-box'

    },


    // 车辆列表构造函数
    initialize: function (oParent, oOption, oTOption) {

        // 树配置文档
        this.oTreeOption = oTOption;

        //设置当前树面板参数
        ES.setOptions(this, oOption);
        this._oParent = oParent;


        // 整个页面通信容器
        this._oPage = oParent._oParent;

        // JS 树对象，非jquery 对象
        this.oTree = null;

        this.$_oTreeContainer = null;
        this.$_oSearchInput = null;
        this.$_oSearchBtn = null;

        this.bCheck = true;

        // 初始化界面
        this.initOn();

        if (typeof this.oOption.cPContainer === 'object') {

            this.$_oPContainer = this.oOption.cPContainer
        }
        else {
            this.$_oPContainer = $(this.oOption.cPContainer);
        }

        this.initUI();

    },

    initUI: function () {

        this.$_oStruck = $(this.cHtml);
        this.$_oPContainer.append(this.$_oStruck);
        this.show();
        this.$_oTreeContainer = this.$_oStruck.find(this.oOption.cTreeContainerSel);
        this.$_oSearchInput = this.$_oStruck.find(this.oOption.cSearchInputSel);
        this.$_oSearchBtn = this.$_oStruck.find(this.oOption.cSearchBtnSel);
        this.$_oDragBox = this.$_oStruck.find(this.oOption.cDragBox);

        this.$_OpenBtn = this.$_oStruck.find('a.ex-icon-turn.off');
        this.$_CloseBtn = this.$_oStruck.find('a.ex-icon-turn.on');

        this.$_oStruck.find('h4').html(this.oOption.cTitle);

        this.initSearchEvent();

        this.initTree();

        this.$_OpenBtn.hide();
        this.$_CloseBtn.show();

        var self = this;

        //车辆列表父选框显示事件
        this.$_OpenBtn.bind('click', function () {
            self._oParent.showBox();
            self.$_CloseBtn.show();
            $(this).hide();
        });

        //车辆列表父选框隐藏事件
        this.$_CloseBtn.bind('click', function () {
            //self.$_oPContainer.fadeOut(500);
            self._oParent.hideBox();
            self.$_OpenBtn.show();
            $(this).hide();
            //self._oPage.resize(120);
        });

        this.initDragContainerEvent();
    },
    //拖动边框改变树的宽度
    initDragContainerEvent(){
        var resize = document.getElementById("resize");
        var left = document.getElementById("left");
        var right = document.getElementById("right");
        var box = document.getElementById("box");
        this.$_oDragBox.on('click', function(e){
            debugger
        })
    },

    onOffCtrl: function (bOn) {
        if(bOn){
            this.$_CloseBtn.hide();
            this.$_OpenBtn.show();
        }
        else{
            this.$_CloseBtn.show();
            this.$_OpenBtn.hide();
        }

    },

    // 初始化查询事件
    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.$_oSearchBtn.bind('click', function () {
            if (!self.oPopTree) {
                return;
            }
            var cSearchVal = self.$_oSearchInput.val();
            // 触发查询
            self.$_oTree.search(cSearchVal, false, false);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.$_oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.$_oSearchInput.val();

                self.$_oTree.search(cSearchVal, false, false);
            }, 250);
        });
    },

    // 移除绘制工地
    removeDrawSite: function (oNode) {
        var anId = this.oPopTree.getSelfChildNode(oNode);
        this._oPage.fire('MV:Site.clearSites', {anId: anId});
    },

    // 画选中的工地
    drawCheckSite: function () {
        //获得所有的工地
        var anSiteId = this.oPopTree.getTreeCheckNode();
        if (!anSiteId || anSiteId.length <= 0) {
            return;
        }
        // 获得工地的GPS信息
        ES.getData({anSiteId: anSiteId}, ES.MapView.oConfig.cSiteInfoUrl, this.drawSite, this);
    },

    // 画一个工地
    drawOneSite: function (nSiteId) {
        ES.getData({anSiteId: [nSiteId]}, ES.MapView.oConfig.cSiteInfoUrl, this.drawSite, this);
    },

    initCheckHandler: function () {
        var self = this;
        this.oPopTree.checkCallBack = function (e, oThisNode) {
            if(self.bCheck) {
                // 定位到当前位置上
                if(oThisNode.node.children && oThisNode.node.children.length>0){
                    self.drawCheckSite();
                }
                else
                {
                    var cId = oThisNode.node.id;
                    self.drawOneSite(parseInt(cId.replace('s', '')));
                }
            }
        };
    },

    // 根据id重新初始化树
    clearTree: function () {
        this.oPopTree.uncheckAll();
        this.initCheckHandler();
    },

    // 显示面板
    show: function () {
        this.$_oStruck.show();
        //this.$_oStruck.fadeIn(500);
    },

    // 隐藏面板
    hide: function () {
        this.$_oStruck.hide();
        //this.$_oStruck.fadeOut(500);
    },

    // 画工地,对地图图层集合操作
    drawSite: function (oData) {
        this._oPage.fire('MV:Site.setSiteData', {aoSiteInfo: oData});
    },

    // 初始化界面
    initOn: function () {
        // 内部面板监听
        this._oParent.on("MapView:Struct.show", this.show, this);
        this._oParent.on("MapView:Struct.hide", this.hide, this);

        // 外部面板监听
        this._oPage.on("MapView:SiteStatic.Select", this.selectNode, this);
    },

    selectNode: function (oData) {
        if (!this.oPopTree || !oData || !oData.anLst) {
            return;
        }

        // 在树上找到id，选择
        this.oPopTree.uncheckAll();
        if(oData.anLst<=0){
            return;
        }

        var acItem = oData.anLst.map(function (nItem) {
            return 's' + nItem;
        });
        this.bCheck = false;
        this.oPopTree.setCheckNode(acItem);
        this.bCheck = true;
        this.drawCheckSite();
    },

    initTreeTitle: function () {
        this.$_oStruck.find("a").each(function () {
            $(this).attr("title", $(this).text());
        });
    },

});

// html 资源
ES.MapView.TabPanel.TreeView.include({
    cHtml:
    // '<div class="ex-layout-drag-box" style="width:20px;background: yellow;height: 100%;position: relative;right: 0px;top: 0;overflow: hidden;z-index: 1011;float: left;"></div>'+
    '<div class="ex-layout-struckbox">' +
    '   <div class="ex-layout-struckbox-title">'+
    '       <h4 class="ec-align-left">车辆区域</h4>'+
    //'       <a href="javascript:;" class="ex-icon-turn"><i class="ec-icon-times-circle"></i></a>'+
    '   </div>'+
    '   <div class="ex-layout-struckbox-wrap">'+
    '       <div class="ex-layout-struckbox-search">'+
    '           <div class="ec-input-group">'+
    '               <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字">'+
    '               <span class="ec-input-group-btn">'+
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>'+
    '               </span>'+
    '           </div>'+
    '       </div>'+
    '       <div class="ex-layout-struckbox-content"></div>'+

    '       <div class="ex-layout-advance-search" style="display:none;">'+

    '       </div>'+
    '   </div>'+
    '</div>',

});

// 树结构的包装
ES.MapView.TabPanel.TreeView.include({

    // 构建树
    initTree: function () {

        this.oTree = this.$_oTreeContainer.jstree(this.oTreeOption);

        this.$_oTree = this.$_oTreeContainer.jstree(true);

        this.initTreeEvent();

        this.initCheckEven();
    },

    // 初始化树的事件
    initTreeEvent: function () {
        var self = this;

        this.oTree.on('ready.jstree', function (e, oThisNode) {
            self.$_oTree.check_all();

            if (!self.readyCallBack) {
                return;
            }

            self.readyCallBack(e, oThisNode);
        });

        this.oTree.on('after_open.jstree', function (e, oThisNode) {
            if (!self.afterOpen) {
                return;
            }
            self.afterOpen(e, oThisNode);
        });

        this.oTree.on('refresh.jstree', function (e, oThisNode) {
            if (!self.refreshCallBack) {
                return;
            }
            self.refreshCallBack(e, oThisNode);
        });

        this.oTree.on('select_node.jstree', function (e, oThisNode) {
            if (!self.selectCallBack) {
                return;
            }
            self.selectCallBack(e, oThisNode);
        });

        this.oTree.on("changed.jstree", function (e, oThisNode) {
            if (!self.changedCallBack) {
                return;
            }
            self.changedCallBack(e, oThisNode);
        });

        this.oTree.on("dblclick.jstree", function (e, oThisNode) {
            if (!self.dblclickCallBack) {
                return;
            }
            self.dblclickCallBack(e, oThisNode);
        });
    },

    // checkbox 相关的事件
    initCheckEven: function () {
        var self = this;

        this.oTree.on('check_node.jstree', function (e, oThisNode) {
            if (!self.checkCallBack) {
                return;
            }
            self.checkCallBack(e, oThisNode);
        });

        // 取消 check 是的查询
        this.oTree.on('uncheck_node.jstree', function (e, oThisNode) {
            if (!self.uncheckCallBack) {
                return;
            }
            // 获得所有选中的数组
            self.uncheckCallBack(e, oThisNode);
        });

        // 选择所有节点触发
        this.oTree.on('check_all.jstree', function (e, oThisNode) {
            if (!self.checkAllCallBack) {
                return;
            }
            self.checkAllCallBack(e, oThisNode);
        });

        this.oTree.on('uncheck_all.jstree', function (e, oThisNode) {
            if (!self.uncheckAllCallBack) {
                return;
            }
            self.uncheckAllCallBack(e, oThisNode);
        });

    },

    /*
     * 树的节点操作
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    getCheckId: function () {
        var cPrefix = this.oOption.cPrefix;
        var aoNodeId = this.$_oTree.get_checked();
        if (!aoNodeId || aoNodeId.length <= 0) {
            return [];
        }
        var acRtn = null;

        if (cPrefix) {
            acRtn = aoNodeId.map(function (cItem) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return cItem;
                }
            });
        }
        else {
            acRtn = aoNodeId;
        }
        return acRtn;
    },

    // 获得自己和 孩子节点id
    getSelfChildId: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }

        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {
            if (cPrefix) {
                if (acNodeId[0].indexOf(cPrefix) === 0) {
                    return acNodeId[0];
                }
                else {
                    return [];
                }
            }
            else {
                return acNodeId;
            }
        }

        $.merge(acNodeId, oNode.children_d);
        var cPrefix = this.oOption.cPrefix;
        var acRtn = null;
        if (cPrefix) {
            acRtn = $.grep(acNodeId, function (cItem, i) {
                if (cItem.indexOf(cPrefix) === 0) {
                    return true;
                }
            });
        }
        else {
            acRtn = acNodeId
        }

        return acRtn;
    },

    // 获得操作节点 自己得和 所有孩子
    getSelfChildNode: function (oNode) {
        var acNodeId = [];
        if (!oNode) {
            return;
        }
        var aoRtn = [];
        acNodeId.push(oNode.id);
        if (!oNode.children || oNode.children.length <= 0) {

            if(cPrefix) {
                if (acNodeId[0].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[0]));
            }

            return aoRtn;
        }

        $.merge(acNodeId, oNode.children_d);

        var cPrefix = this.oOption.cPrefix;


        for(var i = 0;i< acNodeId.length;i++){
            if(cPrefix) {
                if (acNodeId[i].indexOf(cPrefix) === 0) {
                    aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
                }
            }
            else
            {
                aoRtn.push(this.$_oTree.get_node(acNodeId[i]));
            }

        }


        return aoRtn;
    },

    /*
     * 勾选回调函数
     * @cPrefix 树前缀，只返回树前缀数据
     * @bInClude true 表示包含前缀返回，false 不包含前缀返回
     * */
    checkCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId()});
    },

    // 取消所有选择
    uncheckCallBack: function (e, oNode) {
        this._oPage.fire(this.oOption.cUncheckEventName, {acId:this.getCheckId(), acUncheckId: this.getSelfChildId(oNode.node)});
    },
    checkAllCallBack:function(){
        this._oPage.fire(this.oOption.cCheckEventName,{acId:this.getCheckId()});
    },
    uncheckAllCallBack:function(){
        this._oPage.fire(this.oOption.cUncheckEventName, {acId:this.getCheckId(), acUncheckId: this.getSelfChildId(oNode.node)});
    },

    // 取消所有的选择
    uncheckAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.uncheck_all) {
            return;
        }
        this.$_oTree.uncheck_all();
    },

    // 勾选 所有的选择
    checkAll: function () {
        if (!this.$_oTree) {
            return;
        }
        if (!this.$_oTree.check_all) {
            return;
        }
        this.$_oTree.check_all();
    },

    // 设置叶子节点为check，参数为叶子节点id
    setCheckNode: function (anData) {
        if (!anData || anData.length <= 0) {
            return;
        }
        for (var i = 0; i < anData.length; i++) {
            this.$_oTree.check_node(this.$_oTree.get_node(anData[i]));
        }
    },
});

ES.MapView.FrameTab = ES.Evented.extend({

    oOption: {
        //是否用iframe实现轨迹回放，目前分2不走，一步用iframe 来实现，一个用div来实现
        bIsIframe: true,
        nTick: 600,
        nHideTick:150,
    },

    // 保存车辆信息
    oParam:null,

    // nFlag 表示页面加载的内容 0 表示什么都没有加载，1表示加载车辆信息，2表示加载历史轨迹，3表示加载跟踪车辆信息
    nFlag:0,

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initUI();

        // 详细页面的内容
        this.$_oDivVehContent = $('.ex-layout-cardetail-content.veh-other-info');
        // 详细页面的title
        this.$_oDivVehDetailTitle = $('.ex-theme-cardetail-title');
        // 整个详细页面
        this.$_oDivVehDetail = $('.ex-layout-cardetail');


        //初始化事件监听
        this.initOn();
        this.initObj();
        this.initEvent();

    },

    initEvent: function () {
        var self = this;

        $(".ex-layout-cardetail-close.ec-close").eq(0).bind('click', this, function () {

            // 显示X按钮
            self._oParent.setBtn0();
            // 隐藏 实时监控 、轨迹回放
            self._oParent.fire("MapView:VehDetail.hideTrack");
            // 设置地图高度 h - 0
            self._oParent.fire("MapView:Map.setMapConterH", { nH: 0, nTick: 150 });
        });

        // 向下箭头
        $(".ex-layout-cardetail-close.ec-close").eq(1).bind('click', this, function () {
            // 显示向上箭头
            self._oParent.setBtn2();
            // 隐藏实时跟踪的
            self._oParent.fire("MapView:TrackLst.hideTrack");
            //地图显示为 h - 40
            self._oParent.fire("MapView:Map.setMapConterH", { nH: 40, nTick: 150 });
        });

        $(".ex-layout-cardetail-close.ec-close").eq(2).bind('click', this, function () {
            // 显示向下按钮
            self._oParent.setBtn1();
            // 显示实时跟踪的高度
            self._oParent.fire("MapView:TrackLst.reShowTrack");
        })
    },

    // 管理对象
    initObj: function () {
        this.oVehDetail = new ES.MapView.VehDetail(this, {});
        // 初始查询
    },

    // 注册监听事件
    initOn: function () {
        this._oParent.on("MapView:VehDetail.showDetail", this.showDetail, this);
        this._oParent.on("MapView:VehDetail.switchDetail", this.switchDetail, this);

        // 轨迹显示方法
        this._oParent.on("MapView:VehDetail.showTrack", this.showTrack, this);
        this._oParent.on("MapView:VehDetail.reShowTrack", this.reShowTrack, this);
        this._oParent.on("MapView:VehDetail.hideTrack", this.hideTrack, this);
    },

    initUI: function () {
        var $_oContainer = $(this.cHtml);
        $('.ex-layout-content').append($_oContainer);
        this.$_oContainer=$_oContainer;
        this.$_oContainer.show();
    },

    // 隐藏轨迹
    hideTrack: function () {
        var self = this;
        this.$_oDivVehDetail.animate({ "height": "100%", "bottom": "-100%" }, self.oOption.nHideTick);
        this.nFlag = 0;
    },

    // 显示轨迹
    reShowTrack: function () {
        var self = this;
        this.$_oDivVehDetail.animate({ "height": "100%", "bottom": "0" }, self.oOption.nTick);
    },

    // 页面显示情况下 切换页面
    switchDetail:function (oData) {
        this.oParam = oData.oGpsInfo;
        $(".ex-theme-cardetail-title>span").html('<i class="ec-icon-truck"></i>  ' + oData.oGpsInfo.vehNo);
        this.oVehDetail.loadPage(oData);
    },

    // 加载实时状态显示
    showDetail: function (oData) {
        // 保存数据
        this.oParam = oData.oGpsInfo;
        $(".ex-theme-cardetail-title>span").html('<i class="ec-icon-truck"></i>  ' + oData.oGpsInfo.vehNo);
        var nFlag = this._oParent.getDetailStatus();
        if (nFlag == 1) {
            this.oVehDetail.loadPage(oData);
            this.$_oDivVehDetail.animate({"height": "100%", "bottom": "0"}, this.oOption.nTick);
            return;
        }

        //var self = this;
        this.$_oDivVehDetail.animate({"height": "100%", "bottom": "0"}, this.oOption.nTick);
        //loadAnimate(this.$_oDivVehDetail, null);
        //setTimeout(function () {
        // 显示详细页面
        this.oVehDetail.loadPage(oData);
        //loadAnimate(null, 'remove');
        //}, self.oOption.nTick);

        this._oParent.setBtn0();
    },

    // 加载历史轨迹页面
    showTrack: function (oData) {
        // 初始化界面
        $("ul.ec-avg-sm-12").hide();

        var self = this;
        this.$_oDivVehDetail.animate({ "height": "100%", "bottom": "0" }, self.oOption.nTick);
        //loadAnimate(this.$_oDivVehDetail, null);
        setTimeout(function () {
            self.$_oDivVehContent.show();
            self.$_oDivVehContent
                .css({ "width": "100%","overflow":"hidden","height": $('.ex-layout-cardetail').height() - 40 })
                .html(self.getContent(oData));
            //loadAnimate(null, 'remove');
        }, self.oOption.nTick);
        $(".ex-theme-cardetail-title>span").html('<i class="ec-icon-truck"></i>  ' + oData.oGpsInfo.vehNo);

        this._oParent.setBtn0();
    },

    // 获得轨迹回放的内容
    getContent: function (oData) {
        if (this.oOption.bIsIframe) {
            var m_cTrackUrl = "/MapMonitor/TrackView";

            return '<iframe src="' + m_cTrackUrl + '?PhoneNum=' + oData.oGpsInfo.devNo + '&VehicleNo=' + oData.oGpsInfo.vehNo + '" name="MainFrame" id="MainFrame"  frameborder="0" style="width:100%; height:100%; margin:0; padding:0; overflow:hidden;" allowfullscreen mozallowfullscreen webkitallowfullscreen></iframe>'
        }
        else {
            return $('#TempTrackView').html();
        }
    },

});

ES.MapView.FrameTab.include({
    cHtml:
    '<div id="MapShowDetail" class="ex-layout-cardetail ex-theme-cardetail">' +
    '   <a href="javascript:void(0);" class="ex-layout-cardetail-close ec-close">&times;</a>' +
    '   <a href="javascript:void(0);" class="ex-layout-cardetail-close  ec-close ec-btn-sm ex-btn-close-down" style="color:#fff;display:none">' +
    '       <i class="ec-icon-arrow-down"></i>' +
    '   </a>' +
    '   <a href="javascript:void(0);" class="ex-layout-cardetail-close  ec-close ec-btn-sm ex-btn-close-up" style="color:#fff;display:none">' +
    '       <i class="ec-icon-arrow-up"></i>' +
    '   </a>' +
    '   <h4 class="ex-theme-cardetail-title">' +
    '       <span>车辆实时状况</span>' +
    '       <ul class="ec-avg-sm-6">' +
    '           <li class="ec-active" >实时状态</li>' +
    '           <li>车辆详情</li>' +
    '           <li>企业信息</li>' +
    '           <li>审批路线</li> ' +
    '           <li>运输过程</li> ' +
    '           <li>设备控制</li> ' +
    '           <li>变更信息</li> ' +
    '           <li>违法记录</li> ' +
    '           <li>设备信息</li> ' +
    '           <li>安装信息</li> ' +
    '           <li>统计分析</li> ' +
    '       </ul>' +
    '   </h4>    ' +
    '   <div class="ex-layout-cardetail-content veh-other-info"></div>    ' +
    '   <div class="ex-layout-cardetail-content veh-real-status">' +
    '       <div class="ec-g ex-car-state">' +
    '           <div class="ec-u-md-4">' +
    '               <div class="stats-card">' +
    '                   <h4><i class="ec-icon-map-marker"></i>&nbsp;当前位置</h4>' +
    '                   <ul class="ec-avg-md-2">' +
    '                       <li>经度：35.09453242° </li>' +
    '                       <li>纬度：115.09453242°</li>' +
    '                       <li>高度：350m</li>' +
    '                       <li>方向：东南</li>' +
    '                       <li>横向偏差：3m</li>' +
    '                       <li>航向角偏差：35°</li>' +
    '                   </ul>' +
    '                   <p>湖北省;武汉市;江夏区,距离武汉大学科技园停车场83米</p>' +
    '                   <p> 最后记录时间：2016-04-07 10:25:08[10小时前]</p>' +
    '               </div>' +
    '               <div class="stats-card">' +
    '                   <h4><i class="ec-icon-dashboard"></i>&nbsp;实时状态</h4>' +
    '                   <ul class="ec-avg-md-5 ex-acc">' +
    '                       <li><a href="javascript:void(0);" class="icon-acc icc-01 warning" cId ="1" title="ACC"></a><p>ACC</p></li>' +
    '                       <li><a href="javascript:void(0);" class="icon-acc icc-02" cId ="11"  title="左转"></a><p>左转</p></li>' +
    '                       <li><a href="javascript:void(0);" class="icon-acc icc-03" cId ="12"  title="右转"></a><p>右转</p></li>' +
    '                       <li><a href="javascript:void(0);" class="icon-acc icc-04" cId ="14"   title="近光"></a><p>近光</p></li>' +
    '                       <li><a href="javascript:void(0);" class="icon-acc icc-05" cId ="13" title="远光"></a><p>远光</p></li>' +
    '                       <li><a href="javascript:void(0);" class="icon-acc icc-06" cId ="10"   title="刹车"></a><p>刹车</p></li>' +
    // '                       <li><a href="javascript:void(0);" class="icon-acc icc-07" cId ="cz" title="超载"></a><p>超载</p></li>' +
    '                       <li><a href="javascript:void(0);" class="icon-acc icc-08 s_60" cId ="cs" title="超速"></a><p>超速</p></li>' +
    // '                       <li><a href="javascript:void(0);" class="icon-acc icc-09"  cId ="7"  title="断油路"></a><p>断油路</p></li>' +
    // '                       <li><a href="javascript:void(0);" class="icon-acc icc-10"  cId ="OilLinetemp"  title="车身密闭"></a><p>车身密闭</p></li>' +
    '                   </ul>' +
    '               </div>' +
    '           </div>' +
    '           <div class="ec-u-md-8">' +
    '               <div class="truck_box">' +
    '                   <div id="echartsSpeed" class="echarts_box speed"></div>' +
    //'                   <div id="echartsWeight" class="echarts_box weight"></div>' +
    '                   <div class="ex-layout-mobile">' +
    '                       <i class="ex-icon-16 ex-icon-mobile on"></i>' +
    '                       <i class="ex-icon-16 ex-icon-bd"></i>' +
    '                   </div>' +
    // '                   <div class="car-mask">' +
    // '                       <div class="car-cover" style="left: -360px;"></div>' +
    // '                   </div>' +
    // '                   <div class="car-light"></div>' +
    '               </div>' +
    '               <a href="javascript:void(0);" class="ec-btn ec-btn-primary ec-btn-sm ec-radius ex-btn-track"><i class="ec-icon-street-view"></i>&nbsp;&nbsp;历史轨迹</a>' +
    '           </div>' +
    '       </div>' +
    '       <div class="ec-g echart_grid" >' +
    '           <ul class="ec-avg-sm-2">' +
    '               <li>' +
    '                   <div class="stats-card">' +
    '                       <h4>' +
    '                           <i class="ec-icon-tachometer"></i>&nbsp;超速分析' +
    '                           <a href="javascript:void(0);" class="ec-btn ec-btn-link ex-expand "><i class="ec-icon-expand"></i></a>' +
    '                           <a href="javascript:void(0);" class="ec-btn ec-btn-link ex-compress "><i class="ec-icon-compress"></i></a>' +
    '                       </h4>' +
    '                       <div id="speedGridEchart" class="ex-map-car-live"></div>' +
    '                   </div>' +
    '               </li>' +
    '               <li>' +
    '                   <div class="stats-card">' +
    '                       <h4>' +
    '                           <i class="ec-icon-video-camera"></i>&nbsp;实时监控' +
    '                           <a href="javascript:void(0);" class="ec-btn ec-btn-link ex-expand "><i class="ec-icon-expand"></i></a>' +
    '                           <a href="javascript:void(0);" class="ec-btn ec-btn-link ex-compress "><i class="ec-icon-compress"></i></a>' +
    '                       </h4>' +
    '                       <div id="mCarLiveView" class="ex-map-car-live">' +
    '                           <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left"> </div>' +
    '                           <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right"> </div>' +
    '                       </div>' +
    '                   </div>' +
    '               </li>' +
    '           </ul>' +
    '       </div>' +
    '       <div class="ec-g ex-theme-cardetail-warning">' +
    '           <div class="stats-card">' +
    '               <h4><i class="ec-icon-warning"></i>&nbsp;实时报警</h4>' +
    '               <div id="dtAlarmGridContainer" class="dt-grid-container" style="width:100%;"></div>' +
    '               <div id="dtAlarmGridToolBarContainer" class="dt-grid-toolbar-container"></div>' +
    '               <div style="clear:both;"></div>' +
    '           </div>' +
    '       </div>' +
    '   </div>    ' +
    '</div>'
});


ES.MapView.RefreshLoc   = L.Evented.extend({

    oOption: {
        // 加载全屏按钮容器
        cSelfDiv: 'ex-map-reflesh',
        // 父级容器
        acParentDivClass: [
            'ex-layout-maptool',
            'ex-theme-maptool',
            'ex-map-top',
            'ex-map-right'
        ],

        // 地图图层的默认id
        cPContainer: '#MapView',

        cTitle: '刷新车辆位置',

    },

    oUIConfig: {
        div: {
            'class': 'ex-maptool-box ex-map-reflesh',
            i: {'class': 'ec-icon-refresh'},
            html: '&nbsp;&nbsp;刷新'
        }
    },

    // 构造函数
    initialize: function (oParent, options) {
        if (options.oUIConfig) {
            L.extend(this.oUIConfig, options.oUIConfig);
            delete  options.oUIConfig
        }

        L.extend(this.oOption, options);

        // 获得地图控件
        this._oParent= oParent;
        this.$_oPContainer =$(this.oOption.cPContainer).find('.' + this.oOption.acParentDivClass.join('.')).eq(0);

        // 设置父级容器的事件
        this.setParentEvent();

        this.initUI();
    },

    // 设置父级容器的事件
    setParentEvent: function () {
        // 屏蔽事件
        //L.DomEvent.addListener(this.$_oPContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        //L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
    },

    //加载工具事件，初始化工具栏
    initUI: function () {
        L.initTag(this.$_oPContainer, this.oUIConfig);

        this.initToolEvent();
    },

    //初始化工具栏事件
    initToolEvent: function () {
        var self = this;
        //地图全屏按钮
        $('.' + this.oOption.cSelfDiv).bind('click', function () {
            // 刷新地图数据
            self._oParent.fire('VehClusterMange:refreshLoc');
        });
    },

});


ES.MapView.PoiSearch = L.MapLib.MapControl.ESMapSearch.extend({
    // 构造函数
    initialize: function (oMapBase, options) {
        L.extend(this.oOption, options);
        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;
        //图层
        this.oLayer = L.featureGroup();
        this.oInputData = null;
        this.oLayer.addTo(this._oMap);
        var $_oMapContainer = $(this._oMap.getContainer());
        this.$_oPContainer = $_oMapContainer.find('.' + this.oOption.acParentDivClass.join('.')).eq(0);
        this.initUI();
        this.setParentEvent();
        this.initToolEvent();
    },

    //初始化工具栏事件
    initToolEvent: function ()  {
        var self = this;
        var bTo = false;
        // 给input 注册事件,防止快捷查询
        this.$_oInput.keyup(function (e) {
            var myEvent = e || window.event;
            var keyCode = myEvent.keyCode;
            if (keyCode == 38 || keyCode == 40) {
                return;
            }
            // 判断查询结果是否为上次的查询结果
            if(self.oInputData && self.oInputData.name === self.$_oInput.val()) {
                return;
            }

            if (bTo) {
                clearTimeout(bTo);
            }

            bTo = setTimeout(function () {
                self.aMapPoiSearch();
            }, 250);
        });


        $(document).keydown(function (e) {
            // 没有显示不执行
            if (self.$_oSearchRtn.css("display") === "none") {
                return;
            }
            var myEvent = e || window.event;
            var keyCode = myEvent.keyCode;

            if (keyCode === 38) {
                self.movePrev();
            } else if (keyCode === 40) {
                self.moveNext();
            }
            // 扑捉回车按钮 ， 然后定位当前的位置信息
            if(keyCode === 13) {
                self.localPos();
            }
        });

        // 注册按钮事件
        this.$_btnClear.bind('click', function () {
            self.$_oUL.empty();
            self.oLayer.clearLayers();
            self.$_oInput.val('');
        });

        // 查询事件
        this.$_btnSearch.bind('click', function () {
            self.aMapPoiSearch();
        });
    },

    // 调用高德地图API查询地址
    aMapPoiSearch:function() {
        var self = this;
        var cSearchVal = self.$_oInput.val();
        AMap.plugin('AMap.PlaceSearch', function(){
            var autoOptions = {
                city: '全国',
                output: self.$_oUL
            };
            var placeSearch = new AMap.PlaceSearch(autoOptions);
            placeSearch.search(cSearchVal, function(status, result) {
                // 搜索成功时，result即是对应的匹配数据
               self.searchPoiHandler(result);
            })
        })
    },
    // 查询处理
    searchPoiHandler: function (oData) {
        this.$_oUL.empty();
        this.$_oSearchRtn.hide();

        if (!oData || !oData.poiList || oData.poiList.count <= 0) {
            return;
        }
        // 加载数据
        for (var i = 0; i < oData.poiList.pois.length; i++) {
            // if (oData.poiList.pois[i].lng === 0) {
            //     continue;
            // }
            var $_li = $(L.Util.template('<li class="location"><b>{name}</b><span>{address}</span></li>', oData.poiList.pois[i]));
            $_li.data('oData', oData.poiList.pois[i]);
            this.$_oUL.append($_li);

            $_li.bind('click',this, function (e) {
                e.data.localPos();
            });
            $_li.bind('mouseover', function () {
                $(this).addClass('ec-active');
            });
            $_li.bind('mouseout', function () {
                $(this).removeClass('ec-active');
            });
        }
        this.$_oSearchRtn.show();
        if(this.$_oUL){
            $(this.$_oUL).focus();
        }
    },

    // 定位 当前位置,
    localPos:function() {

        this.oLayer.clearLayers();
        var $_oLI = this.$_oUL.find("li.ec-active");
        var oData = $_oLI.data('oData');
        var nLat = oData.location.lat;
        var nLng = oData.location.lng;
        var oMarker = L.marker([nLat, nLng]);
        oMarker.oData = oData;
        // 创建点
        oMarker.addTo(this.oLayer);

        this._oMap.flyTo([nLat, nLng], 16);
        // 给文本框赋值
        this.$_oInput.val(oData.name);

        this.oInputData = oData;

        this.$_oUL.empty();
        this.$_oSearchRtn.hide();
    },

    // 光标上移动 38
    movePrev: function () {
        var index = this.$_oUL.find("li.ec-active").prevAll().length;

        if (index == 0) {
            this.$_oInput.focus();
            // 文本框选中
            return false;
            //不可循环移动
        }
        else {
            this.$_oUL.find("li").removeClass('ec-active').eq(index - 1).addClass('ec-active');
            var oData = this.$_oUL.find("li").eq(index - 1).data('oData');

            this.$_oInput.val(oData.name);

            var cContainerHeight = this.$_oUL.height();// 外容器高度
            var cScrollTop = this.$_oUL.scrollTop(); // 当前滚动的高度
            var cItemTop = this.$_oUL.find("li.ec-active").offset().top; //当前选择项的距离顶部的高度
            var itemHeight = this.$_oUL.find("li.ec-active").height(); // 当前选择项的元素高度

            if(cItemTop<=0){
                if(itemHeight >= cScrollTop){
                    this.$_oUL.scrollTop(0)
                }
            }else{
                this.$_oUL.scrollTop(cScrollTop - itemHeight)
            }
        }
    },

    // 光标下移动 40
    moveNext: function () {
        var index = this.$_oUL.find("li.ec-active").prevAll().length;

        if(index === 0 && !this.$_oUL.find("li").eq(0).hasClass('ec-active')){
            this.$_oUL.find("li").eq(0).addClass('ec-active');
            var oData = this.$_oUL.find("li").eq(0).data('oData');
            this.$_oInput.val(oData.name);
            return;
        }

        if (index === this.$_oUL.find("li").length - 1) {
            return false;
            //不可循环移动
        }
        else {
            this.$_oUL.find("li").removeClass('ec-active').eq(index + 1).addClass('ec-active');
            var oData = this.$_oUL.find("li").eq(index + 1).data('oData');
            this.$_oInput.val(oData.name);

            var cContainerHeight = this.$_oUL.height();// 外容器高度
            var cScrollTop = this.$_oUL.scrollTop(); // 当前滚动的高度
            var cItemTop = this.$_oUL.find("li.ec-active").offset().top; //当前选择项的距离顶部的高度
            var itemHeight = this.$_oUL.find("li.ec-active").height(); // 当前选择项的元素高度
            if(cItemTop<=0){
                // 距离顶部小于0时 返回到最上面一条
                this.$_oUL.scrollTop(0)
            }else{
                if(cItemTop >= cContainerHeight){
                    this.$_oUL.scrollTop(cScrollTop + itemHeight)
                }
            }
        }
    }

});

ES.MapView.VehDetail = ES.Class.extend({

    // li 数据
    oMenuConfig: {
        li: [
            {
                "class": 'ec-active', "data-band": 'VehInfo:RealStatus.loadDetailView',
                "menu-flag":"VehicleState",
                span: { html: "实时状态" }
            },
            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.loadVehInfoView',
            //     "menu-flag":"VehicleInfo",
            //     span: { html: "车辆详情" }
            // },
            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.loadCompanyView',
            //     "menu-flag":"EnterpriseView",
            //     span: { html: "企业信息" }
            // },
            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.loadCheckLine',
            //     "menu-flag":"CheckLineView",
            //     span: { html: "审批路线" }
            // },
            //
            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.loadSetControl',
            //     "menu-flag":"DeviceView",
            //     span: { html: "设备控制" }
            // },

            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.loadLineInfoView',
            //     span: { html: "运输过程" }
            // },
            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.VehChangeHis',
            //     span: { html: "变更信息" }
            // },
            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.DevInfo',
            //     span: { html: "设备信息" }
            // },
            // {
            //     "class": '', "data-band": 'VehInfo:RealStatus.IllegalInfo',
            //     span: { html: "违法记录" }
            // }
        ]
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);

        this._oParent = oParent;
        this._oPage = this._oParent._oParent;

        this.$_oDivVehContent = $('.ex-layout-cardetail-content');
        this.$_oDivVehDetailTitle = $('.ex-theme-cardetail-title');
        this.$_oDivVehDetail = $('.ex-layout-cardetail');

        this.$_oTab = $("ul.ec-avg-sm-6");

        this.initUI();
        this.initTabObj();
        //初始化事件监听
        this.initOn();

        this.hideContent();

    },

    // 影藏控件
    hideContent: function () {
        $(".ex-layout-cardetail-content").hide();
    },

    // 初始化li
    initUI: function () {
        this.$_oTab.empty();
        ES.initTag(this.$_oTab, this.oMenuConfig);
        var self = this;
        //判定数据权限
        this._oParent._oParent.AuthValue(this._oParent.oOption.MapViewAuthDetail,this.$_oTab);

        // 给Li 绑定事件

        this.$_oTab.find("li").bind("click", this, function () {
            $(this).siblings().removeClass("ec-active");
            $(this).addClass("ec-active");
            if (!self.oParam) return;

            self._loadPage($(this));
        })
    },

    // 要初始化所有的对象
    initTabObj: function () {
        this.aoTabObj = [

            // 实时跟踪详细页面的操作
            new ES.VehInfo.RealStatus(this, {}),

            // 车辆信息
            new ES.VehInfo.VehInfoView(this, {
                // 请求的页面url
                cPageUrl: '/MapView/VehicleInfo',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.loadVehInfoView'
            }),

            // 公司信息
            new ES.VehInfo.VehInfoView(this, {
                // 请求的页面url
                cPageUrl: '/MapView/CompanyInfo',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.loadCompanyView'}),

            //审批线路
            new ES.VehInfo.ExamineLine(this, {
                // 请求的页面url
                cPageUrl: '/MapView/LineInfo',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.loadCheckLine'
            }),

            // 设备控制
            new ES.VehInfo.VehInfoView(this, {
                // 请求的页面url
                cPageUrl: '/MapView/Command',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.loadSetControl'
            }),

            //运输过程
            new ES.VehInfo.TripLine(this, {
                // 请求的页面url
                cPageUrl: '/MapMonitor/TripLineView',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.loadLineInfoView'
            }),

            // 变更信息
            new ES.VehInfo.VehChangeHis(this, {
                // 请求的页面url
                cPageUrl: '/MapMonitor/_VehChangeHis',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.VehChangeHis'
            }),

            // 设备信息
            new ES.VehInfo.DevInfo(this, {
                // 请求的页面url
                cPageUrl: '/MapMonitor/_PartialMapDevice',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.DevInfo'
            }),

            new ES.VehInfo.IllegalInfo(this, {
                // 请求的页面url
                cPageUrl: '/Illegal/_IllegalLstForVehNo',
                // 页面加载的监听事件
                cOnLoadEven: 'VehInfo:RealStatus.IllegalInfo'
            })
        ]
    },

    // 添加监听
    initOn: function () {
        // 监听实时推送
        this._oPage.on("HubSvr:setGpsInfo", this.setHubGpsInfo, this);

        // 监听告警推送
        this._oPage.on("HubSvr:setSingleAlarmInfo", this.setAlarmInfo, this);
    },

    // 设置参数
    setHubGpsInfo: function (oData) {
        var oObj = this.aoTabObj[0];
        if (!oObj) return;

        oObj.setHubGpsInfo(oData);

    },

    setAlarmInfo: function (oData) {
        var oObj = this.aoTabObj[0];
        if (!oObj) return;

        oObj.setHubGpsInfo(oData);
    },

    // 外部切换 加载页面,
    loadPage: function (oData) {
        if (this.oParam) {
            this.oParam = oData;
            if (this.oParam.oGpsInfo.devNo !== oData.oGpsInfo.devNo) {
                // 订阅告警
                this._oParent.fire("HubSvr:HubMange.addAlarmHub", { oGpsInfo: oData.oGpsInfo });
                // 给按钮添加事件
                //this.setBtnTrackEven(oData);
            }
        }
        else {
            this.oParam = oData;
            //this.setBtnTrackEven(oData);
        }

        this.$_oTab.show();
        this.hideContent();
        var oLi = this.$_oDivVehDetailTitle.find("ul>li.ec-active");
        var nIndex = oLi.index();
        if (nIndex < 0) return;
        var oObj = this.aoTabObj[nIndex];

        // 加载标准
        if (oLi.attr("bIsLoad") == "1") {
            // 切换
            oObj.switchDetailView(oData);
        }
        else {
            oObj.loadDetailView(oData);
            oLi.attr("bIsLoad", 1);
        }
    },

    // 内部li切换
    _loadPage: function (oLi) {
        this.hideContent();
        var nIndex = oLi.index();
        if (nIndex < 0) return;
        var oObj = this.aoTabObj[nIndex];
        // 加载标准
        if (oLi.attr("bIsLoad") == "1") {
            // 切换
            oObj.switchDetailView(this.oParam);
        }
        else {
            oObj.loadDetailView(this.oParam);
            oLi.attr("bIsLoad", 1);
        }
    },

})

ES.VehInfo = ES.Class.extend({

    version: "0.1",

    loadDetailView: function () {

    },

    switchDetailView: function () {

    },

});

/**
 *  详细界面
 * 管理实时状态 所有组件
 * 判断是切换还是再次加载页面由后台决定
 * Created by liulin on 2017/9/27.
 */

ES.VehInfo.RealStatus = ES.VehInfo.extend({

    //管理基本事件操作,内部事件管理机制，只在内部使用，禁止事件在外部广播
    includes: ES.Mixin.Events,

    oOption: {
        // 实时状态$ 查找标志
        cTagGpsInfo: '.ec-g > .ec-u-md-4 > .stats-card > ul.ec-avg-md-2',

        // 车信号$ 查找标志
        cTagVehStatusInfo: '.ec-g > .ec-u-md-4 > .stats-card > ul.ex-acc',

        //车辆gps信息 和 网络信息
        cTagMobileInfo: '.ex-layout-mobile',

        // 速度图表控件
        cSpeedChartId: 'echartsSpeed',

        cSpeed: ""
    },

    // 加载详情界面
    loadDetailView: function (oData) {

        this.$_oContent.show();
        // 加载注册时，加载图表和grid 对象
        this.oSpeedChart = new ES.VehInfo.SpeedChart(this, {});
        this.oAlarmGrid = new ES.VehInfo.AlarmGridLst(this, {});
        //this.oWeightChart = new ES.VehInfo.WeightChart(this, {});

        this.oMapMonitor = new ES.VehInfo.MapMonitor(this, {
            oMapOption: {
                zoomControl: false,
                layers: [],
                center: new L.LatLng(30.697875, 111.293275),
                zoom: 13,
                attributionControl: false,
            }, cDidId: 'mCarLiveView'
        });

        // 隐藏相关配置信息
        var aoLi = this.$_oContent.find('ul.ex-acc>li[cId=' + ES.MapView.oConfig.carMask + ']');
        if (!aoLi || aoLi.length <= 0) {
            this.oSpeedLineChart = new ES.VehInfo.SpeedLineChart(this, {});
        }
        else {
            this.oSpeedLineChart = new ES.VehInfo.SpeedDoorLineChart(this, {});
        }
        this.bIsLoad = true;
        // 加载成功回调
        this.switchDetailView(oData);
        this.initEven();
        this.oSpeedLineChart.reflesh();
        this.oMapMonitor.reflesh();
    },

    // 第一个，加载GPS状态
    setGpsInfo: function (oGpsInfo) {
        if (!oGpsInfo) {
            oGpsInfo = this.oGpsInfo;
        }
        if(oGpsInfo.poi){
            var cMsg = ES.TrackHelper.getDateMsg(oGpsInfo.gpsTime);
            $(this.oOption.cTagGpsInfo).empty();
            var cHtml = '<li>状态： ' + (oGpsInfo.currentState || "通讯中断") + ' </li>'
                + '<li>速度： ' + oGpsInfo.speed + ' Km/h</li>';
            $(this.oOption.cTagGpsInfo).html(cHtml);
            $(this.oOption.cTagGpsInfo).parent().find("p").eq(0).html("最后记录位置：" + oGpsInfo.poi);
            $(this.oOption.cTagGpsInfo).parent().find("p").eq(1).html("最后记录时间：" + oGpsInfo.gpsDate.substr(0,19).replace('T', ' ') + cMsg);
            $(this.oOption.cTagGpsInfo).parent().find("p").eq(2).html("最后记录状态：" + oGpsInfo.sta);
        }else{
            var cMsg = ES.TrackHelper.getDateMsg(oGpsInfo.vehGpsData.GpsTime * 1000);
            $(this.oOption.cTagGpsInfo).empty();
            var cHtml = '<li>状态： ' + (oGpsInfo.vehGpsData.VehStatusString || "通讯中断") + ' </li>'
                + '<li>速度： ' + oGpsInfo.vehGpsData.Speed + ' Km/h</li>';
            $(this.oOption.cTagGpsInfo).html(cHtml);
            $(this.oOption.cTagGpsInfo).parent().find("p").eq(0).html("最后记录位置：" + oGpsInfo.vehGpsData.Poi.Address);
            $(this.oOption.cTagGpsInfo).parent().find("p").eq(1).html("最后记录时间：" + oGpsInfo.vehGpsData.GpsDateTime.substr(0,19).replace('T', ' ') + cMsg);
            $(this.oOption.cTagGpsInfo).parent().find("p").eq(2).html("最后记录状态：" + oGpsInfo.vehGpsData.VehStatusString);
        }

    },

    // 第二个，设置车辆实时状态,设置顶棚状态，
    setVehStatusInfo: function (oGpsInfo) {
        if (!oGpsInfo.status){
            return;
        }
        $(this.oOption.cTagVehStatusInfo).parent().show();
        $(this.oOption.cTagVehStatusInfo).find('a').removeClass('on');
        $(this.oOption.cTagVehStatusInfo).find('a>span').text('关')
        var oStatus = oGpsInfo.status;
        for (var cKey in oStatus) {
            var oA = $('a[cId="' + oStatus[cKey] + '"]');
            if (oA || oA.length > 0) {
                oA.addClass('on');
                oA.find('span').text('开');
            }
        }

        //设置顶灯状态 开为 -360px ，关 为0px
        $.inArray(15, oStatus)<0 ? $('.car-cover').animate({"left": "0px"}, 500) : $('.car-cover').animate({"left": "-360px"}, 500);

        //设置是否超速
        // $('a[cId="cs"]').find('span').text('');
        // if (oGpsInfo.speed > 60) {
        //     $('a[cId="cs"]').addClass("warning");
        //     $('a[cId="cs"]').find('span').text('超');
        // }
        // else {
        //     $('a[cId="cs"]').removeClass("warning");
        //     $('a[cId="cs"]').find('span').text('');
        // }

        // // 设置未密封
        // $('a[cId="OilLinetemp"]').removeClass("on").removeClass("check");
        // //设置未密封 速度大于0 ，但是门磁为1
        // if (oGpsInfo.speed > 0 && oStatus.FrontDoor) {
        //     $('a[cId="OilLinetemp"]').addClass("on");
        // }
        // else if (oStatus.FrontDoor == false) {
        //     $('a[cId="OilLinetemp"]').addClass("check");
        // }
    },

    // 车顶灯状态
    setVehLight: function (oGpsInfo) {
        if (!oGpsInfo || !oGpsInfo.attach) {
            return;
        }

        $(".car-light").removeClass("l-green").removeClass("l-red").removeClass("l-yellow").removeClass("l-gray");
        $('a[cId="cz"]').removeClass("green").removeClass("warning").removeClass("yellow");

        ES.TrackHelper.convertVehStatus(oGpsInfo);

        var cClass = "";
        if ((oGpsInfo.nGreenOn  + oGpsInfo.nRedOn  + oGpsInfo.nYelloOn ) != 1) {
            cClass = "l-gray";

        }
        else if (oGpsInfo.nGreenOn  == 1) {
            cClass = "l-green";
            $('a[cId="cz"]').addClass('green');
        }
        else if (oGpsInfo.nRedOn == 1) {
            cClass = "l-red";
            $('a[cId="cz"]').addClass('warning');
        }
        else {
            cClass = "l-yellow";
            $('a[cId="cz"]').addClass('yellow');
        }
        $(".car-light").addClass(cClass);
    },

    // 第三个，设置车辆gps信息 和 网络信息
    setMobileInfo: function (oGpsInfo) {
        //去掉on状态
        var $_oIMobile = $(".ex-icon-mobile");
        var $_oIBD = $(".ex-icon-bd");

        $_oIMobile.removeClass("on").removeClass("off");
        $_oIBD.removeClass("on").removeClass("off");

        //判断当前位置信息
        if (oGpsInfo.currentState == "行驶"
            || oGpsInfo.currentState == "停车"
            || oGpsInfo.currentState == "熄火") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("on");
        }
        else if (oGpsInfo.currentState == "通讯中断") {
            $_oIMobile.addClass("l-mobile-off");
            $_oIBD.addClass("l-bd-off");
        }
        else if (oGpsInfo.currentState == "定位失败") {
            $_oIMobile.addClass("on");
            $_oIBD.addClass("off");
        }
        else {
            $_oIMobile.addClass("off");
            $_oIBD.addClass("off");
        }
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.$_oContent = $(".ex-layout-cardetail-content.veh-real-status");
        this.bIsLoad = false;

        // 初始化界面
        this.initUI();

        //初始化事件监听
        this.initOn();

    },

    initEven: function () {
        var self = this;
        //放大
        $('.ex-expand').bind('click', function () {
            var $that = $(this).closest('.stats-card');
            $that.addClass('expand').find('.ex-map-car-live').css({
                'width': $that.width() + 'px',
                'height': $that.height() - 33 + 'px'
            });
            $(this).hide();
            $that.find('.ex-compress').show();
            $('.ex-layout-content').css("z-index", "3");
            self.oMapMonitor.reflesh();
            self.oSpeedLineChart.reflesh();

        });

        //缩小
        $('.ex-compress').bind('click', function () {
            var $that = $(this).closest('.stats-card');
            $that.removeClass('expand').find('.ex-map-car-live').css({'width': $that.width() + 'px', 'height': '100%'});
            $(this).hide();
            $that.find('.ex-expand').show();
            $('.ex-layout-content').css("z-index", "1");
            self.oMapMonitor.reflesh();
            self.oSpeedLineChart.reflesh();

        });

        $(window).resize(function () {
            self.oMapMonitor.reflesh();
            self.oSpeedLineChart.reflesh();
        });
    },

    // 监听事件
    initOn: function () {

    },

    // 设置告警内容
    setAlarmInfo: function (oData) {

        if (!oData || !oData.aoAlarmInfo || oData.aoAlarmInfo.length <= 0) {
            return;
        }

        if (!this.oAlarmGrid) {
            return;
        }
        // 设置告警数据到grid 中
        this.oAlarmGrid.addAlarm(oData.aoAlarmInfo)
    },

    // 订阅车里gps 推送
    setHubGpsInfo: function (oD) {
        if (!oD || !oD.oData || oD.oData.length <= 0) return;
        // 要判断当前detail页面展开的是那个页面

        var self = this;
        if (!self.oGpsInfo) {
            //还没有初始化
            //console.log(ESLang.VehInfo.RealStatus[1]);
            return;
        }
        var Item = this._oParent._oPage.toHeartModle(this._oParent._oPage.getVstatus(oD.oData));
        // 要判断当前的车辆设备号是否为监控的设备号
        $.each(Item, function (nIndex, oItem) {
            if (oItem.devNo == self.oGpsInfo.devNo) {
                if (oItem.vehNo === undefined) {
                    oItem.vehNo = self.oGpsInfo.vehNo;
                    oItem.entName = self.oGpsInfo.entName;
                }

                // 设置监听对象的值
                ES.TrackHelper.convertVehStatus(oItem);
                self.setVehGpsStatus({oGpsInfo: oItem});
            }
        })
    },

    // 切换设备,并缓存订阅的车辆信息
    switchDetailView: function (oData) {

        if(!this.bIsLoad){
            return;
        }

        // 显示对话框
        this.$_oContent.show();


        // 切换车辆设备
        var oGpsInfo = {};
        if (!oData || !oData.oGpsInfo) {
            oGpsInfo = this.clearVehInfo();
        }
        else {
            oGpsInfo = oData.oGpsInfo;
        }

        // 缓存当前页面的值
        this.oGpsInfo = oGpsInfo;

        // 切换车里Gps状态
        this.setVehGpsStatus(oData);

        // 切换告警数据
        this.oAlarmGrid.swithAlarmData(oData.oGpsInfo);

        this.oMapMonitor.setGpsInfo(oData.oGpsInfo);

        this.setBtnTrackEven(oData);
    },

    // 设置gpshub 的状态
    setVehGpsStatus: function (oData) {

        // 设置gps
        this.setGpsInfo(oData.oGpsInfo);

        // 设置车辆状态
        this.setVehStatusInfo(oData.oGpsInfo);

        this.setVehLight(oData.oGpsInfo);

        // 设置信号状态
        this.setMobileInfo(oData.oGpsInfo);

        // 速度仪表盘
        this.oSpeedChart.changeSpeed(oData.oGpsInfo);

        // 重量仪表盘
        //this.oWeightChart.changeWeight(oData.oGpsInfo);

        // 线性图表设置速度和顶棚
        this.oSpeedLineChart.changeSpeedLine(oData.oGpsInfo);

        // 小地图实时监控
        this.oMapMonitor.setHubGpsInfo(oData.oGpsInfo);
    },

    clearVehInfo: function () {

        var oGpsInfo = { vehNo: '',
            devNo: '',
            latLng: null,
            gpsDate: '2017-01-01',
            dir: 0,
            poi:  '',
            speed: 0,
            status: {
                /// 0: ACC关 1：ACC开
                Acc : 1,
                /// 0: 未定位 1：定位
                Located : 2,
                /// 0: 北纬 1：南纬
                LatInfo : 3,
                /// 0: 东经 1：西经
                LonInfo : 4,
                /// 0: 运营状态 1：停运状态
                BusinessStatus : 5,
                /// 0：经纬度未经保密插件加密；1：经纬度已经保密插件加密
                LonLatEncrypt : 6,
                /// 0：车辆油路正常  1：车辆油路断开
                OilLine : 7,
                /// 0：车辆电路正常  1：车辆电路断开
                ElectricCircuit : 8,
                /// 0：车门解锁  1：车门加锁
                DoorLock : 9,
                /// 刹车
                Breaking : 10,
                /// 左转
                LeftTurn : 11,
                /// 右转
                RightTurn : 12,
                /// 远光
                DistanceLight : 13,
                /// 近光
                LowLight : 14,
                /// 0：前门关  1：前门开 （门磁线）
                FrontDoor : 15,
                /// 后门  0：后门关 或自定义高2无效   1：后门开或自定义高2有效
                BackDoor : 16,
                /// 发动机 0：发动机关  1：发动机开
                Engine : 17,
                /// 空调 0：空调关   1：空调开
                AirCondition : 18,
                /// 震动 0：震动关   1：震动开
                Vibration : 19,
                /// 喇叭 0：喇叭关   1：喇叭开
                Horn : 20
            },
            attach: {
                ZtLeightYelloOn: 0,
                ZtLeightGreenOn: 0,
                ZtLeightRedOn: 0,
            },
            currentState: '',
            mile: 0,
            gpsTime: 0,
            img:'/Asset/img/ex_default/law_144.png',
            CompanyName:'',
            sWeightValue:0,
        };

        return oGpsInfo;
    },

    // 给历史轨迹按钮绑定事件
    setBtnTrackEven: function (oData) {
        var self = this;
        // 先解绑
        $(".ex-btn-track").unbind("click");
        $(".ex-btn-track").bind("click", function () {
            window.open("/mapViewHtml/html/trackview.html?token="+ES.MapView.oConfig.token+"&PhoneNum=" + oData.devNo + "&VehicleNo=" + oData.vehNo);
        })
    },

    // 初始化界面
    initUI: function () {
        this.$_oContent.css({
            "width": "100%",
            "height": $('.ex-layout-cardetail').height() - 40,
            "overflow": "auto",
            "background-color": "#fff"
        })
    },

});

/**
 * Created by liulin on 2017/9/27.
 */

ES.VehInfo.SpeedChart = ES.Class.extend({

    oOption: {
        cDivContain: 'echartsSpeed',
        nAvgSpeed: 60,
        nMaxSpeed: 100,
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.oChart = null;
        this.oChartOption = null;

        this.initChart();

    },

    // 初始化图表
    initChart: function () {
        this.oChart = echarts.init(document.getElementById(this.oOption.cDivContain));
        this._setChartConfig();
    },

    // 设置图表属性
    _setChartConfig: function (ec) {

        var nRedSpeed = this.oOption.nAvgSpeed / this.oOption.nMaxSpeed;
        // 农机的样式设计
        this.oChartOption = {
            backgroundColor: '#b68500',
            tooltip: {
                formatter: "{a} <br/>{c}km/h"
            },
            grid: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0

            },
            series: [
                {
                    name: '速度',
                    type: 'gauge',
                    radius: '100%',
                    min: 0,
                    max: this.oOption.nMaxSpeed,
                    splitNumber: 11,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 10,
                            color: [[nRedSpeed, '#e2f4e0'], [1, '#ffc09d']]
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length: 15,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 20,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        formatter: '速度\n{value}km/h', offsetCenter: [0, '45%'], textStyle: {
                            color: '#fff', fontSize: 16, fontWeight: 'bold'
                        }
                    },
                    data: [{ value: 80, name: '速度' }]
                }
            ]
        };

        // 渣土车样式设计
        this.oChartOption = {
            backgroundColor:'#136635',
            tooltip: {
                formatter: "{a} <br/>{c}km/h"
            },
            grid: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0

            },
            series: [
                {
                    name: '速度',
                    type: 'gauge',
                    radius: '90%',
                    min: 0,
                    max: this.oOption.nMaxSpeed,
                    splitNumber: 5,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 3,
                            color: [[nRedSpeed, '#72d572'], [1, '#f4511e']]
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length: 6,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 9,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        formatter: '速度\n{value}km/h', offsetCenter: [0, '45%'], textStyle: {
                            color: '#fff', fontSize: 12, fontWeight: 'bold'
                        }
                    },
                    data: [{ value: 80, name: '速度' }]
                }
            ]
        };

        this.oChart.setOption(this.oChartOption, true);

        // 监听窗体改变事件
        //var self = this;
        //window.on("Wnd:wndResize", function () {
        //    self.oChart.resize();
        //})
    },

    // 设置速度值
    changeSpeed: function (oGpsInfo) {
        this.oChartOption.series[0].data[0].value = oGpsInfo.speed;
        this.oChart.setOption(this.oChartOption, true);
    },

    // 清空图表
    clearChart: function () {
        if (!this.oChart) return;
        this.oChart.clear();
    },

});

/**
 * Created by liulin on 2017/9/27.
 */
ES.VehInfo.VehInfoView = ES.VehInfo.extend({
    oOption: {
        cPageUrl: '/MapMonitor/VehInfoView',
        cOnLoadEven: 'VehInfo:RealStatus.loadVehInfoView',
        cOnSwitchVehInfoView: "VehInfo:RealStatus.switchVehInfoView"
    },
    cHtml:'',
    // 车辆列表构造函数
    initialize: function(oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.$_oContent = $(".ex-layout-cardetail-content.veh-other-info");
        // 初始化界面
        this.initUI();
        //初始化事件监听
        this.initOn();
    },
    // 监听事件
    initOn: function() {
        // 加载界面
        //this._oParent.on(this.oOption.cOnLoadEven, this.loadVehInfoView, this);

        // 切换数据，
        //this._oParent.on(this.oOption.cOnSwitchVehInfoView, this.loadVehInfoView, this);

    },
    // 加载详情界面
    loadDetailView: function (oData) {
        this.$_oContent.show();
        this.$_oContent.load(this.oOption.cPageUrl, { 'devNo': oData.oGpsInfo.devNo,'vehNo': oData.oGpsInfo.vehNo});
    },
    switchDetailView: function (oData) {
        // 切换界面
        this.loadDetailView(oData);
    },
    // 初始化界面
    initUI: function() {
        this.$_oContent.css({
            "width": "100%",
            "height": $('.ex-layout-cardetail').height() - 40,
            "overflow": "auto"
        })
    }
});

ES.VehInfo.ExamineLine = ES.VehInfo.VehInfoView.extend({
    loadDetailView: function (oData) {
        $(".ex-layout-cardetail-content.veh-other-info").load(
            this.oOption.cPageUrl,
            { 'devNo': oData.oGpsInfo.devNo,'vehNo':  oData.oGpsInfo.vehNo}, function (data) { }).show();
    }
});

ES.VehInfo.TripLine = ES.VehInfo.VehInfoView.extend({
    loadDetailView: function (oData) {
        $(".ex-layout-cardetail-content.veh-other-info").load(
            this.oOption.cPageUrl,
            { 'devNo': oData.oGpsInfo.devNo,'vehNo':  oData.oGpsInfo.vehNo},
            function (data) { }
        ).show();
    }
});

ES.VehInfo.VehChangeHis = ES.VehInfo.VehInfoView.extend({
    loadDetailView: function (oData) {
        $(".ex-layout-cardetail-content.veh-other-info").load(
            this.oOption.cPageUrl,
            { 'devNo': oData.oGpsInfo.devNo,'vehNo':  oData.oGpsInfo.vehNo},
            function (data) { }).show();
    }
});

ES.VehInfo.DevInfo = ES.VehInfo.VehInfoView.extend({
    loadDetailView: function (oData) {
        $(".ex-layout-cardetail-content.veh-other-info").load(
            this.oOption.cPageUrl,
            { 'devNo': oData.oGpsInfo.devNo,'vehNo':  oData.oGpsInfo.vehNo},
            function (data) { }).show();
    }
});

ES.VehInfo.IllegalInfo = ES.VehInfo.VehInfoView.extend({
    loadDetailView: function (oData) {
        $(".ex-layout-cardetail-content.veh-other-info").load(
            this.oOption.cPageUrl,
            { 'devNo': oData.oGpsInfo.devNo,'vehNo':  oData.oGpsInfo.vehNo},
            function (data) { }).show();
    }
});

/**
 * Created by liulin on 2017/9/27.
 */

ES.VehInfo.WeightChart = ES.Class.extend({
    oOption : {
        cDivContain: 'echartsWeight',
        nAvgSpeed: 60,
        nMaxSpeed: 100,
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        // 初始化界面
        this.initUI();
    },


    // 初始化图表
    initUI: function () {
        this.oChart = echarts.init(document.getElementById(this.oOption.cDivContain));
        this._setChartConfig();
    },

    // 设置图表属性
    _setChartConfig: function (ec) {

        var nRedSpeed = this.oOption.nAvgSpeed / this.oOption.nMaxSpeed;

        this.oChartOption = {
            backgroundColor: '#136635',
            tooltip: {
                //formatter: "{a} <br/>{c}T"
                formatter: "{a} <br/>{c}"
            },
            grid: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0

            },
            series: [
                {
                    name: '载重',
                    type: 'gauge',
                    radius: '90%',
                    min: 0,
                    max: 30,
                    splitNumber: 5,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 3,
                            color: [[0.1, '#fff'], [0.6, '#00ff00'], [0.8, '#f5c01b'], [1, '#b62d22']]
                            //color: [[0.05, '#72d572'], [0.8, '#fdd835'], [1, '#f4511e']]
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length: 6,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 9,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: {
                        show: false
                    },
                    title: {
                        show: false
                    },
                    detail: {
                        formatter: '载重\n{value}', offsetCenter: [0, '45%'], textStyle: {
                            color: '#fff', fontSize: 12, fontWeight: 'bold'
                        },
                    },
                    data: [{ value: 80, name: '速度' }]
                }
            ]
        };
        this.oChart.setOption(this.oChartOption, true);


    },

    // 设置速度值
    changeWeight: function (oGpsInfo) {

        if (!oGpsInfo) return;
        ES.TrackHelper.convertVehStatus(oGpsInfo);
        var nMax = 100;
        var nDetail = '空载'
        var dWeight = parseInt(oGpsInfo.dWeight) || 0;
        if (oGpsInfo.attach) {
            if ((oGpsInfo.nGreenOn + oGpsInfo.nRedOn + oGpsInfo.nYelloOn ) != 1) {
                //此时为白灯
                nMax = dWeight * 100 / 5;
                nDetail = '空载'
            }
            else if (oGpsInfo.nGreenOn == 1) {
                nMax = dWeight * 100 / 50;
                nDetail = '装载'
            }
            else if (oGpsInfo.nYelloOn == 1) {
                nMax = dWeight * 100 / 70;
                nDetail = '满载'
            }
            else {
                nMax = dWeight * 100 / 90;
                nDetail = '超载'
            }
        }

        this.oChartOption.series[0].max = nMax || 100;
        // this.oChartOption.series[0].max = 1200;
        // this.oChartOption.series[0].detail = {formatter:nDetail,textStyle: {
        //         color: '#fff', fontSize: 12, fontWeight: 'bold'
        //     }};

        if (oGpsInfo.attach) {
            this.oChartOption.series[0].data[0].value = oGpsInfo.dWeight || 0;
        }
        else {
            this.oChartOption.series[0].data[0].value = 0;
        }

        this.oChart.setOption(this.oChartOption, true);
    },

});

/**
 * Created by liulin on 2017/9/27.
 */

ES.VehInfo.AlarmGridLst = ES.Class.extend({

    oOption: {
        cDivContain: 'dtAlarmGridContainer',
        cPager: 'dtAlarmGridToolBarContainer',

        nTop: 600,
        cTagAlarm: '.ex-theme-cardetail-warning >.stats-card'
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this._aoData = [];

        this.oAlarmData = {};

        this.initGrid();
    },

    //初始化所有的gird控件
    initGrid: function () {
        var self = this;

        var dtGridOption = {
            lang: 'zh-cn',
            ajaxLoad: false,
            check: false,
            exportFileName: '告警列表',
            datas: this._aoData,
            columns: this.getColumns(),
            gridContainer: this.oOption.cDivContain,
            toolbarContainer: this.oOption.cPager,
            tools: "",//'refresh|faseQuery|advanceQuery|export[excel,csv,pdf,txt]|print',
            pageSize: 30,
            pageSizeLimit: [10, 20, 30, 50]
        };

        var dtgrid = $.fn.DtGrid.init(dtGridOption);
        this.dtGrid = dtgrid;
        // 设置grid高度
        $("#" + this.oOption.cDivContain).height(200);

        dtgrid.reload(false);
    },

    // 设置列单元
    getColumns: function () {

        var self = this;
        var aoCol = [
            { id: 'VehicleNo', title: '车牌号', type: 'string', columnClass: 'text-center' },
            { id: 'CompanyName', title: '所属企业', type: 'string', columnClass: 'text-center',width:100 },
            { id: 'AlarmTypeStr', title: '报警描述', type: 'string', columnClass: 'text-center'  },
            {id: 'StartAlarmTime', title: '报警开始时间', type: 'string', columnClass: 'text-center'},
            {id: 'EndAlarmTime', title: '报警结束时间', type: 'string', columnClass: 'text-center'},
            { id: 'Address', title: '最后报警位置', type: 'string', columnClass: 'text-center' },
            //{
            //    id: 'operation', title: '操作', type: 'string', columnClass: 'text-center grid-blue', resolution: function (value, record, column, grid, dataNo, columnNo) {
            //        var content = '';
            //        content += '<a  href="javascript:void(0);" title="定位"><i class="ec-icon-link"></i></a>';
            //        content += '&nbsp;&nbsp;';
            //        content += '<a  href="javascript:void(0);"  title="处理" ><i class="ec-icon-pencil"></i></a>';
            //        content += '&nbsp;&nbsp;';
            //        return content;
            //    }
            //}
        ]

        return aoCol;

    },

    //切换告警数据源，需要情况当前的所有告警信息，重新查询数据，绑定数据到grid中
    swithAlarmData: function (oGpsInfo) {
        this.clearGrid();

        // 保存当前订阅的车数据，如果告警查询返回和当前的设备号不一致，不与绑定数据
        this.oGpsInfo = oGpsInfo;

        var oReqAlarm = {
            devNo: oGpsInfo.devNo,
            AlarmType: 0,
            BeginTime: parseInt((new Date().getTime() - 5 * 60 * 60 * 1000) / 1000),
            EndTime: parseInt(new Date().getTime() / 1000),
            PageIndex: 1,
            PageSize: 100,
            DistrictCode: 420000,
            Src: null
        }

        //loadAnimate($(this.oOption.cTagAlarm), null);

        // 获得告警数据
        //ES.getData(oReqAlarm,  ES.MapView.oConfig.getAlarmDetailPaing, this.vehAlarmHandler, this);
    },

    // 生成数据绑定,第一次加载数据
    vehAlarmHandler: function (oAlarmData) {
        if (!oAlarmData || !oAlarmData.dataList || oAlarmData.dataList.length <= 0) {
            return;
        }
        if (this.oGpsInfo.devNo !== oAlarmData.dataList[0].PhoneNum){
            return;
        }
        for(var i = 0;i<oAlarmData.dataList.length;i++){
            oAlarmData.dataList[i].Address = oAlarmData.dataList[i].EndPoi.Address;
        }
        // 合并结果集合
        $.merge(this._aoData, oAlarmData.dataList);

        // 重新加载数据
        this.dtGrid.reload(true);
    },

    // 实时推送的数据加入到grid中
    addAlarm: function (oRealAlarm) {
        if (!oRealAlarm) return;

        for (var cKey in oRealAlarm) {

            // 加告警消息
            this._aoData.unshift(oRealAlarm[cKey]);

            // 删除最后一条记录
            if (this._aoData.length >= this.oOption.nTop) {
                this._aoData.splice(this.oOption.nTop, 1);
            }
        }

        this.dtGrid.reload(true);
    },

    // 清空 grid
    clearGrid: function () {
        if (!this._aoData || this._aoData.length <= 0) return;

        // 清空数据
        this._aoData.splice(0, this._aoData.length);

        if (!this.dtGrid) return;
        this.dtGrid.reload(true)
    },

});

/**
 * 小地图监控
 * Created by liulin on 2017/9/27.
 */

ES.VehInfo.MapLive = ES.MapView.MapLive.extend({

    // 地图弹出的宽带设置
    oPopOption: {maxWidth: 500},
    returnGpsInfoHtml:function(oGpsInfo){
        var cDir = ES.TrackHelper.getDire(oGpsInfo.dir);
        var cMsg = ES.TrackHelper.getDateMsg(oGpsInfo.gpsTime);
        var oTemp = {};

        ES.extend(oTemp, oGpsInfo, {
            cMsg: cMsg,
            cDir: cDir,
            Mileage: oGpsInfo.mile ,
            cGpsDate: ES.Util.dateFormat(oGpsInfo.gpsTime, "yyyy-MM-dd hh:mm:ss"),
            cVehicleStatus: oGpsInfo.currentState || '通讯中断',
            cPoiInfo: oGpsInfo.poi || '',
            map: oGpsInfo.currentState === "通讯中断"||oGpsInfo.currentState === "定位失败" ? 'off' : 'on',
            key: oGpsInfo.status[0] === '1' ? 'on' : '',
            open: oGpsInfo.status[1] === '1' ? 'on' : '',
            signal: oGpsInfo.currentState !== "通讯中断" ? 'on' : '',
        });

        var cHtml =
            '<div class="ex-maptip-wtm"> ' +
            '   <div class="ex-maptip-wtm-content">' +
            '       <div class="ex-content-info-box">' +
            '            <div class="ex-content-info-car ec-u-sm-6">' +
            '               <h3>{vehNo}</h3>' +
            '               <div class="ex-content-img"><img src="../img/login_bg_06.jpg" alt="" /></div>' +
            '               <ul>' +
            '                   <li><i class="ec-icon-car"></i><span>企业名称</span></li>' +
            '               </ul>' +
            '           </div>' +
            '           <div class="ex-content-info-state ec-u-sm-6">' +
            '               <ul>' +
            '                   <li><span>{cGpsDate}{cMsg}</span></li>' +
            '                   <li><strong>状态：</strong><span>{cVehicleStatus}</span></li>' +
            '                   <li><strong>速度：</strong><span>{speed} (Km/h)</span></li>' +
            '                   <li><strong>里程：</strong><span>{Mileage} Km</span></li>' +
            '                   <li><strong>位置：</strong><span>{cPoiInfo}</span></li>' +
            '               </ul>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="ex-maptip-wtm-tool">' +
            '       <ul class="tool-btn ec-avg-sm-3 ec-u-sm-6">' +
            //'           <li><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-truck"> 详情 </a></li>' +
            //'           <li><a href="javascript:void(0)" class="ec-btn ec-radius ec-icon-exchange"> 轨迹 </a></li>' +
            '        </ul>' +
            '       <ul class="tool-state ec-avg-sm-4 ec-u-sm-6">' +
            '           <li><i class="GPS {map}"></i></li>' +
            //'           <li><i class="ACC {key}"></i></li>' +
            '           <li><i class="signal {signal}"></i></li>' +
            //'           <li><i class="door {open}"></i></li>' +
            '        </ul>' +
            '   </div>' +
            '</div>';

        var cHtml = ES.Util.template(cHtml, oTemp);
        return cHtml;
    },
    returnGpsDataHtml:function(oGpsInfo){
        var cDir = ES.TrackHelper.getDire(oGpsInfo.Direction);
        var cMsg = ES.TrackHelper.getDateMsg(oGpsInfo.GpsDateTime);
        var oTemp = {};

        ES.extend(oTemp, oGpsInfo, {
            cMsg: cMsg,
            cDir: cDir,
            Mileage: oGpsInfo.Mileage ,
            cGpsDate: ES.Util.dateFormat(oGpsInfo.GpsDateTime, "yyyy-MM-dd hh:mm:ss"),
            cVehicleStatus: oGpsInfo.VehStatusString || '通讯中断',
            cPoiInfo: oGpsInfo.Poi.Address || '',
            map: oGpsInfo.VehStatusString === "通讯中断"||oGpsInfo.VehStatusString === "定位失败" ? 'off' : 'on',
            key: oGpsInfo.Status[0] === '1' ? 'on' : '',
            open: oGpsInfo.Status[1] === '1' ? 'on' : '',
            signal: oGpsInfo.VehStatusString !== "通讯中断" ? 'on' : '',
            CompanyName: oGpsInfo.CompanyName || '暂无'
        });

        var cHtml =
            '<div class="ex-maptip-wtm"> ' +
            '   <div class="ex-maptip-wtm-content">' +
            '       <div class="ex-content-info-box">' +
            '            <div class="ex-content-info-car ec-u-sm-6">' +
            '               <h3>{VehicleNo}</h3>' +
            '               <div class="ex-content-img"><img src="../img/login_bg_06.jpg" alt="" /></div>' +
            // '               <ul>' +
            // '                   <li><i class="ec-icon-car"></i><span>企业名称</span></li>' +
            // '               </ul>' +
            '           </div>' +
            '           <div class="ex-content-info-state ec-u-sm-6">' +
            '               <ul>' +
            '                   <li><span>{cGpsDate}{cMsg}</span></li>' +
            '                   <li><strong>状态：</strong><span>{cVehicleStatus}</span></li>' +
            '                   <li><strong>速度：</strong><span>{Speed} (Km/h)</span></li>' +
            '                   <li><strong>里程：</strong><span>{Mileage} Km</span></li>' +
            '                   <li><strong>位置：</strong><span>{cPoiInfo}</span></li>' +
            '               </ul>' +
            '           </div>' +
            '       </div>' +
            '   </div>' +
            '   <div class="ex-maptip-wtm-tool">' +
            '       <ul class="tool-btn ec-avg-sm-3 ec-u-sm-6">' +
            '        </ul>' +
            '       <ul class="tool-state ec-avg-sm-4 ec-u-sm-6">' +
            '           <li><i class="GPS {map}"></i></li>' +
            '           <li><i class="signal {signal}"></i></li>' +
            '        </ul>' +
            '   </div>' +
            '</div>';

        var cHtml = ES.Util.template(cHtml, oTemp);
        return cHtml;
    },
    // 注册弹出层事件
    _getVecMarkerHtml: function (oGpsInfo) {
        if(oGpsInfo.poi){
            this.returnGpsInfoHtml(oGpsInfo)
        }else{
            this.returnGpsDataHtml(oGpsInfo.vehGpsData)
        }

    },
    //判断载重
    weightStatus:function(n,Status){
        if(!n){n=0}
        var _weight = parseInt(n);

        if(_weight<=1){
            return "空载";
        }else{
            if($.inArray(15,Status)>=0){
                return "超载";
            }else{
                return "满载";
            }
        }

    },
    // 初始化监听事件
    _initOn: function () {

        // this._oMap.on("moveend", this._mapMoveHandler, this);
        //
        // // 画实时点
        // this._oParent.on("MV:Real.drawLiveTrack", this.drawLiveTrack, this);
        //
        // // 判断是否显示弹出层
        // this._oParent.on("MV:Real.showVecMarkerPop", this._showVecMarkerPop, this);
        //
        // // 放大实时监控点
        // this._oParent.on("MV:Real.setLiveZoomIn", this.setLiveZoomIn, this);
        //
        // // 清除实时跟踪的点、历史点、轨迹线
        // this._oParent.on("MV:Real.clearLiveTrack", this.clearLiveTrack, this);
        //
        // this._oParent.on("MapView:MapLive.setZoomIn", this.setZoomIn, this);

    },

    // 在地图上绘制实时跟踪的点
    _drawLive: function () {

        if (!this._oLivePosGroup) {
            return;
        }
        var oGpsInfo = this.oGpsInfo;
        var oLayer = this.findLayer(this._oLivePosGroup, oGpsInfo.devNo);
        var oLatLng = oGpsInfo.latLng;
        var cHtml = this._getVecMarkerHtml(oGpsInfo);
        if (!oLayer) {
            this.clearLiveTrack();
            oLayer = this._createLive(oGpsInfo);
            oLayer.addTo(this._oLivePosGroup);
            //当弹出层弹出时，界面初始化公司信息，注册按钮事件
            oLayer.bindPopup(cHtml, this.oPopOption);
            this.oLayer = oLayer;
        }
        else {
            oLayer.setLatLng(oLatLng);
            //更新弹出层的信息
            this._updateVecMarkerPop(oLayer, cHtml);
        }
        this._oMap.panTo(oLatLng);
        oLayer._bringToFront();
        this._setHeading(oGpsInfo, 180);
        return oLayer;
    },

    //画布,实时跟踪绘制，如线，轨迹点等，oPosInfo，为当前点信息
    _drawLiveHis: function ( ) {
        var oGpsInfo = this.oGpsInfo;
        var oPrePosInfo = null;
        var oLineLayer = this.findLayer(this._oLineGroup, oGpsInfo.devNo);
        if (!oLineLayer) {
            //创建线图层
            var oPloyLine = L.polyline([oGpsInfo.latLng], ES.MapView.oConfig.oLiveLineConfig);
            oPloyLine.cId = oGpsInfo.devNo;
            oPloyLine.oPrePosInfo = oGpsInfo;
            oPloyLine.addTo(this._oLineGroup);
        }
        else {
            oPrePosInfo = oLineLayer.oPrePosInfo;
            oLineLayer.oPrePosInfo = oGpsInfo;
            oLineLayer.addLatLng(oGpsInfo.latLng);
        }

        //创建轨迹图层
        if (oPrePosInfo) {
            var oTrackLayer = L.circleMarker(oPrePosInfo.latLng, ES.MapView.oConfig.oLiveCircleMarkerConfig);
            var cHTML = this._getVecMarkerHtml(oPrePosInfo);
            oTrackLayer.bindPopup(cHTML, this.oPopOption);
            oTrackLayer.oGpsInfo = oPrePosInfo;
            var oPopup = oTrackLayer.getPopup();
            oPopup.oGpsInfo = oPrePosInfo;
            this.initPopup(oTrackLayer);
            // 设置对象的弹出层
            //this.initPopupEvent(oTrackLayer);

            oTrackLayer.addTo(this._oTrackGroup);
        }
    },

    initPopup:function(oLayer){

        var cHtml = this._getVecMarkerHtml(oLayer.oGpsInfo);
        //更新弹出层的信息,修改的目的是防止注册2次点击事件
        var oPopup = oLayer.getPopup();
        if(!oPopup){
            oPopup = oLayer.bindPopup(cHtml, this.oPopOption).getPopup();
        }
        // 在次注册事件
        oPopup.oGpsInfo = oLayer.oGpsInfo;
        oPopup.setContent(cHtml);

        oLayer.oGpsInfo.bOpenBubble ? oLayer.openPopup() : oLayer.closePopup();
        return oPopup;
    },


});

/**
 * 小地图监控
 * Created by liulin on 2017/9/27.
 */

ES.VehInfo.MapMonitor = L.MapLib.MapMaster.Map.extend({

    oGpsInfo:null,

    initialize:function(oParent,oOption) {
        ES.extend(oOption, {nMapHeight: 300});
        L.MapLib.MapMaster.Map.prototype.initialize.call(this, oParent, oOption);

        //执行自己的方法
        this.loadCtrl()
    },
    // 加载地图控件
    loadCtrl: function () {

        this.loadMapMaster();

        // new L.MapLib.MapControl.ESMapToolArea(this, {
        //     acParentDivClass: [
        //         'ex-layout-maptool',
        //         'ex-theme-maptool',
        //         'ex-map-top',
        //         'ex-map-right'
        //     ],
        //     cUrl: ES.MapView.oConfig.mapAreaLocal,
        //     nZoom:13,
        //     bIsFly:false,
        //     oUIConfig: {
        //         div: {
        //             'class': 'ex-maptool-box ex-control-dropmenu',
        //             i: {'class': 'ec-icon-map-marker'},
        //             html: '&nbsp;&nbsp;区域：',
        //             span: {html: '荆州市'},
        //             i11: {'class': 'ec-icon-angle-down'},
        //             ul: {
        //                 'class': 'ec-avg-sm-2 ec-dropdown-content',
        //             }
        //         }
        //     }});

        // 工具条
        // new L.MapLib.MapControl.ESMapToolBox(this, {
        //     acParentDivClass: [
        //         'ex-layout-maptool',
        //         'ex-theme-maptool',
        //         'ex-map-top',
        //         'ex-map-right'
        //     ]});

        // 地图瓦片
        new L.MapLib.MapControl.ESMapTile(this, {
            acParentDivClass: [
                'ex-layout-maptool',
                'ex-theme-maptool',
                'ex-map-top',
                'ex-map-right'
            ]
        });

    },

    // 设置当前定位的实时车辆信息,第一次设置，或者切换车辆,
    setGpsInfo: function (oGpsInfo) {
        if (!oGpsInfo) {
            //console.log(ESLang.VehInfo.MapMonitor.setGpsInfo.Err);
            return;
        }
        else {
            if (!oGpsInfo.hasOwnProperty("devNo"))
            {
                //console.log(ESLang.VehInfo.MapMonitor.setGpsInfo.ErrPh);
                return;
            }
        }

        if (!this.oGpsInfo || this.oGpsInfo.devNo != oGpsInfo.devNo) {
            this.oGpsInfo = oGpsInfo;
            if (this.oMapLive) {
                this.oMapLive.offEven();
                this.oMapLive.clearLiveTrack();
                // 释放对象
                delete this.oMapLive;
            }
            // 设置监控实体
            this.oMapLive = new ES.VehInfo.MapLive(this._oParent, {}, this._oMap);
            //this.oMapLive.setFristGps(oGpsInfo);
            //画第一点
            oGpsInfo.bOpenBubble = false;
            if(oGpsInfo.vehGpsData){
                this.oMapLive.drawLiveTrack({ oGpsInfo: oGpsInfo.vehGpsData });
            }else{
                this.oMapLive.drawLiveTrack({ oGpsInfo: oGpsInfo });
            }


            // 定位到当前车辆点
            //this.flyTo({ oGpsInfo: oGpsInfo });
        }
    },

    // 设置实时推送数据
    setHubGpsInfo: function (oGpsInfo) {

        if (!oGpsInfo) return;

        if (!this.oMapLive) return;

        this.oMapLive.drawLiveTrack({ "oGpsInfo": oGpsInfo });

        // 要判断是否在地图范围内，不再地图范围内，平移地图
        var oBound = this._oMap.getBounds();

        //var oLatlng = L.latLng(oGpsInfo.Lat, oGpsInfo.Lon);
        //if (!oBound.contains(oLatlng)) {
        //    this.flyTo({ oGpsInfo: oGpsInfo });
        //}

    },
    //加载地图
    _loadMap: function () {

        // 首先要判断是否有地图div ，没有就在地图容器中加载div
        var oDiv = L.DomUtil.get(this.options.cDidId);

        var nWidth = this.options.nMapWidth;
        var nHeight = this.options.nMapHeight;

        if (!oDiv) {

            var oContainer = L.DomUtil.get(this.options.cDivContainerId);
            if (!oContainer) {

                throw new Error(L.MapLib.MapMaster.Err[2]);
            }

            oDiv = L.DomUtil.create(this.cDiv, '', oContainer);
        }

        //oDiv.style.width = nWidth + 'px';
        oDiv.style.height = nHeight + 'px';
        oDiv.id = this.options.cDidId;

        L.Util.extend(this.options.oMapOption, {layers: [this._oDefaultTile]});

        var oMap = this._oMap = new L.Map(this.options.cDidId, this.options.oMapOption);

        if (this._oParent) {
            if (this._oParent.setMap) {
                this._oParent.setMap(oMap);
            }
            this._oParent.fire('Map:loadFinish', {oMap: oMap});

            this.fire('Map:loadFinish', {oMap: oMap});
        }

        return oMap;
    },

});

/**
 * Created by exsun003 on 2018/11/13.
 */

ES.VehInfo.SpeedLineChart = ES.Class.extend({

    oOption: {
        cDivContain: 'speedGridEchart',
        nMaxCnt: 30,
    },
    _aoSpeed: [],
    _aoDoor: [],
    _aoDate:[],

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.oChart = null;
        this.oChartOption = null;

        this.initChart();
    },

    // 初始化图表
    initChart: function () {
        this.oChart = echarts.init(document.getElementById(this.oOption.cDivContain));
        this._setChartConfig();
    },

    // 设置图表属性
    _setChartConfig: function (ec) {

        this.oChartOption = {
            color: ["#72d572", "#29b6f6"],
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    return params[0].name + '<br/>'
                        + params[0].seriesName + ' : ' + params[0].value + ' (km/h)<br/>' ;
                },
                axisPointer: {
                    animation: false
                }
            },
            legend: {
                data: ['速度'],
            },
            grid: {
                bottom: '10%'

            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: []
            },
            yAxis: [
                {
                    name: '速度(km/h)',
                    type: 'value',
                    max: 100
                }
            ],

            series: [{
                name: '速度',
                type: 'line',
                data: [],
                hoverAnimation: false,
                smooth: true,
                areaStyle: {
                    normal: {}
                },
                lineStyle: {
                    normal: {
                        width: 1
                    }
                }
            }]
        };

        this.oChart.setOption(this.oChartOption, true);

        // 监听窗体改变事件
        //var self = this;
        //window.on("Wnd:wndResize", function () {
        //    self.oChart.resize();
        //})
    },

    // 设置数据时，对数据进行处理
    setData: function (oGpsInfo) {
        if (!oGpsInfo){
            return;
        }
        if (this.oGpsInfo) {
            if (this.oGpsInfo.devNo !== oGpsInfo.devNo) {
                // 情况数据
                this._aoSpeed.splice(0, this._aoSpeed.length);
                this._aoDoor.splice(0, this._aoDoor.length);
                this._aoDate.splice(0, this._aoDate.length);
            }
        }

        this.oGpsInfo = oGpsInfo;
    },

    // 数据处理,要对
    setSeriesData: function (oGpsInfo) {
        if (!oGpsInfo) return;

        this._aoSpeed.push(oGpsInfo.speed || 0);

        var nDoor = 0;
        if (!oGpsInfo.Status) {
            nDoor = 0;
        }
        else {
            if (oGpsInfo.Status.FrontDoor === true) {
                nDoor = 1;
            }
            else {
                nDoor = 0;
            }
        }

        this._aoDoor.push(nDoor);

        this._aoDate.push(ES.Util.dateFormat((oGpsInfo.gpsTime || 0), "hh:mm:ss"));

        if (this._aoSpeed.length > this.oOption.nMaxCnt) {
            this._aoSpeed.splice(0, 1);
            this._aoDoor.splice(0, 1);
            this._aoDate.splice(0, 1);
        }
    },

    // 设置速度值
    changeSpeedLine: function (oGpsInfo) {
        // 缓存当前图表值
        this.setData(oGpsInfo)
        this.setSeriesData(oGpsInfo);

        this.oChartOption.series[0].data = this._aoSpeed;
        //this.oChartOption.series[1].data = this._aoDoor;
        this.oChartOption.xAxis.data = this._aoDate;

        this.oChart.setOption(this.oChartOption, true);
    },

    reflesh:function(){
        this.oChart.resize();
    },

    // 清空图表
    clearChart: function () {
        if (!this.oChart){
            return;
        }
        this.oChart.clear();
    },

})

/**
 * Created by liulin on 2019/3/28.
 */

ES.HubSvr = ES.Class.extend({
    oOption: {
        // hub 服务地址
        cHubUrl: '',
        // 超时时长
        nTimeOut: 10000,

        // hub 服务名称
        cSvrName:'GpsHub',

        // 推送服务
        aoClientName:[],//[{cSvrFn:'sendAlarm',on:'ReceiveHGTAlarm'}],
    },

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.afnCallBack = [];
        this.initSvr();
        // 启动hub服务
        this.start();
        // 注册接受回调数据
        this.onReceiveGPS();
        // 开启监听
        this.initOn();
    },

    initSvr: function () {
        var self = this;
        $.connection.hub.url = this.oOption.cHubUrl;
        $.connection.hub.logging = true;
        this.svrBoss = $.connection[this.oOption.cSvrName];
        this.oConnection = $.connection.hub;
        var oConnection = this.oConnection;
        //断开超时时间
        var nTimeOut = this.oOption.nTimeOut;
        if(!this.oConnection.disconnected){
            return;
        }
        this.oConnection.disconnected(function () {
            console.log('disconnected id: ' + oConnection.id + ' state: ' + oConnection.state + '  ' + new Date().getSeconds().toString());
            setTimeout(function () {
                self.start();
            }, nTimeOut);
        });

        this.oConnection.error(function (error) {
            console.log('Error: ' + error);
        });
    },

    //开启hub监听，开启之后 在内存中 读取订阅数据，重新订阅
    start: function () {
        var oConnection = this.oConnection;

        var self = this;
        var hubSvr = null;
        try {
            hubSvr = this.oConnection.start()
        }
        catch (e) {
        }
        if (!hubSvr) {
            return;
        }

        hubSvr.done(function () {
            if (self.afnCallBack && self.afnCallBack.length > 0) {
                for (var i = 0; i < self.afnCallBack.length; i++) {
                    var oTemp = self.afnCallBack[i];
                    oTemp.fn.call(oTemp.oContext, oTemp.oData);
                }
            }
            console.log('started transport: ' + oConnection.transport.name + ' ' + oConnection.id);
        }).fail(function (err) {
            console.log('Could not connect.' + err);
        });
    },

    //停止hub监听
    stop: function () {
        this.oConnection.stop();
    },

    // 取消开始订阅
    removeCallBack: function (fnCall, oGpsInfo) {
        if (!this.afnCallBack || this.afnCallBack.length <= 0) {
            return;
        }

        for (var i = this.afnCallBack.length - 1; i >= 0; i--) {
            var oTemp = this.afnCallBack[i];
            if (oTemp.fn === fnCall && oTemp.PhoneNum === oGpsInfo.PhoneNum) {
                // 删除
                this.afnCallBack.splice(i, 1);
            }
        }
    },

    initOn: function () {
        //unSubAlarm
        this._oParent.on('HubSvr:unSubAlarm', this.unSubAlarm, this);

        // 订阅告警
        this._oParent.on('HubSvr:subAlarm', this.subAlarm, this);

        // 订阅车辆gps
        this._oParent.on('HubSvr.subGps',this.subGpsByLstGpsInfo,this);
        // 取消订阅车辆gps
        this._oParent.on('HubSvr.unsubGps',this.unsubGpsByLstGpsInfo,this);
    },

    // 取消订阅
    unsubGpsByLstGpsInfo: function (oData) {
        if (!oData || !oData.aoGpsInfo || oData.aoGpsInfo.length <= 0) {
            return;
        }
        var cDevNos = '';
        for (var i = 0; i < oData.aoGpsInfo.length; i++) {
            if (i === 0) {
                cDevNos = oData.aoGpsInfo[i].devNo
            } else {
                cDevNos = cDevNos + ',' + oData.aoGpsInfo[i].devNo;
            }
        }
        this.vehicleUnsub(cDevNos);
    },

    // 通过GPSData取消订阅---
    unSubGpsByGpsData: function (oGpsInfo) {

        var oTemp = {fnName: 'unSubGpsByGpsData', cDateTime: new Date().toLocaleString()};

        if (!oGpsInfo) {
            console.log(ES.Util.template(ES.Lang.HubSvr.Err[20], oTemp));
            return;
        }
        ES.extend(oTemp, oGpsInfo);

        this.vehicleUnsub(oGpsInfo.devNo);

    },

    // 订阅车辆
    vehicleUnsub: function (vehicleLst) {

        var oData = {cVehLst: vehicleLst};

        // 取消内存订阅
        this.removeCallBack(this._vehicleSub, {cVehLst: vehicleLst});

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._vehicleUnsub, oContext: this, oData: oData});

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }
        this._vehicleUnsub(oData);
    },


    // 订阅车辆,批量订阅车辆
    _vehicleUnsub: function (oData) {
        var oTemp = {fnName: '_vehicleUnsub', cDateTime: new Date().toLocaleString()};

        if (!oData || !oData.cVehLst) {
            console.log(ES.template(ES.Lang.HubSvr.Err[18], oTemp));
            return;
        }

        oTemp.cVehLst = oData.cVehLst;
        if (!this.svrBoss || !this.svrBoss.server.sub) {
            console.log(ES.template(ES.Lang.HubSvr.Err[16], oTemp));
            return;
        }

        console.log(ES.template('{fnName},{cDateTime} 开始取消订阅车辆{cVehLst}！', oTemp));
        this.svrBoss.server.unSub().done(function (results) {
            oTemp.results = results;
            console.log(ES.template('{fnName},{cDateTime} 取消订阅车辆成功{results}！', oTemp));

        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.template('{fnName},{cDateTime} 取消订阅车辆失败{e}！', oTemp));
        });
    },

    onReceiveGPS: function () {

        if(!this.svrBoss){
            return;
        }

        var self = this;

        var aoClientName = this.oOption.aoClientName;
        var oTempGPS = aoClientName[0];//GPS推送
        this.svrBoss.client[oTempGPS.cSvrFn] = function (oData) {
            self._oParent.fire(oTempGPS.on, {oData: oData});
        };
        var oTempAlarm = aoClientName[1];//报警推送
        this.svrBoss.client[oTempAlarm.cSvrFn] = function (oData) {
            self._oParent.fire(oTempAlarm.on, {oData: oData});
        };

    },

    subGpsByLstGpsInfo: function (oData) {
        if (!oData || !oData.aoGpsInfo || oData.aoGpsInfo.length <= 0) {
            return;
        }
        var cDevNos = '';
        for (var i = 0; i < oData.aoGpsInfo.length; i++) {
            if (i === 0) {
                cDevNos = oData.aoGpsInfo[i].devNo
            } else {
                cDevNos = cDevNos + ',' + oData.aoGpsInfo[i].devNo;
            }
        }
        this.vehicleSub(cDevNos);
    },

    // 订阅车辆
    vehicleSub: function (vehicleLst) {

        var oData = {cVehLst: vehicleLst};

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._vehicleSub, oContext: this, oData: oData});

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._vehicleSub(oData);

    },

    // 订阅车辆,批量订阅车辆
    _vehicleSub: function (oData) {
        var oTemp = {fnName: '_vehicleSub', cDateTime: new Date().toLocaleString()};

        if (!oData || !oData.cVehLst) {
            console.log(ES.template(ES.Lang.HubSvr.Err[18], oTemp));
            return;
        }

        oTemp.cVehLst = oData.cVehLst;
        if (!this.svrBoss || !this.svrBoss.server.sub) {
            console.log(ES.template(ES.Lang.HubSvr.Err[16], oTemp));
            return;
        }

        console.log(ES.template('{fnName},{cDateTime} 开始订阅车辆{cVehLst}！', oTemp));
        this.svrBoss.server.sub(oData.cVehLst).done(function (results) {
            oTemp.results = results;
            console.log(ES.template(ES.Lang.HubSvr.Msg[12], oTemp));

        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.template(ES.Lang.HubSvr.Err[17], oTemp));
        });
    },

    // 订阅车辆,防止连接断开，需要重新连接
    subGpsByGpsData: function (oGpsInfo) {

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({
            fn: this._subGpsByGpsData,
            oContext: this,
            oData: oGpsInfo,
            PhoneNum: oGpsInfo.PhoneNum
        });

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subGpsByGpsData(oGpsInfo);
    },

    // 订阅车辆,---
    _subGpsByGpsData: function (oGpsInfo) {
        var oTemp = {fnName: '_subGpsByGpsData', cDateTime: new Date().toLocaleString()};
        if (!oGpsInfo) {
            console.log(ES.template(ES.Lang.HubSvr.Err[10], oTemp));
            return;
        }
        if (!this.svrBoss ||!this.svrBoss.server.sub) {
            console.log(ES.template(ES.Lang.HubSvr.Err[16], oTemp));
            return;
        }
        console.log(ES.template(ES.Lang.HubSvr.Err[13], oTemp));

        this.svrBoss.server.sub(oGpsInfo.PhoneNum).done(function (results) {
            oTemp.results = results;
            console.log(ES.template(ES.Lang.HubSvr.Msg[11], oTemp));

        }).fail(function (e) {
            oTemp.e = e;
            console.log(ES.template(ES.Lang.HubSvr.Err[15], oTemp));
        });
    },

    //// 取消订阅车辆---
    //vehicleUnSub: function (vehicleLst) {
    //    var oTemp = {fnName: '_subGpsByGpsData', cDateTime: new Date().toLocaleString(), vehicleLst: vehicleLst};
    //    if (!this.svrBoss ||!this.svrBoss.server.unSub) {
    //        console.log(ES.template(ES.Lang.HubSvr.Err[41], oTemp));
    //        return;
    //    }
    //    if (this.oConnection.state !== 1) {
    //        oTemp.state = this.oConnection.state;
    //        console.log(ES.template(ES.Lang.HubSvr.Err[42], oTemp));
    //        return;
    //    }
    //    console.log(ES.template(ES.Lang.HubSvr.Err[43], oTemp));
    //    this.svrBoss.server.unSub().done(function (results) {
    //        oTemp.results = results;
    //        console.log(ES.template(ES.Lang.HubSvr.Msg[41], oTemp));
    //    }).fail(function (e) {
    //        oTemp.e = e;
    //        console.log(ES.template(ES.Lang.HubSvr.Err[44], oTemp));
    //    });
    //},

    subAlarm: function (oData) {

        // 断开重新连接，然后在订阅
        this.afnCallBack.push({fn: this._subAlarm, oContext: this, oData: oData});

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subAlarm(oData);

    },

    // 添加告警 -----
    _subAlarm: function (oGpsInfo) {
        var oTemp = {fnName: '_subAlarm', cDateTime: new Date().toLocaleString()};

        if (this.oConnection.state !== 1) {
            oTemp.state = this.oConnection.state;
            console.log(ES.template('设备订阅失败，订阅服务器状态错误state:{state}！', oTemp));
            return;
        }

        if (!this.svrBoss.server.subAlarm) {
            console.log(ES.template('{devNo}订阅失败，服务器段没有此订阅方法！', oTemp));
            return;
        }

        console.log(ES.template(ES.Lang.HubSvr.Err[30], oTemp));
        this.svrBoss.server.subAlarm(oGpsInfo.devNo, oGpsInfo.nDeptId).done(function (results) {
            oTemp.results = results;
            console.log('单个设备定义成功');

        }).fail(function (e) {
            oTemp.e = e;
            console.log('设备订阅失败');
        });

    },

    unSubAlarm: function () {
        if (!this.svrBoss.server.unSubAlarm) {
            return;
        }
        if (this.oConnection.state !== 1) {
            return;
        }
        this.svrBoss.server.unSubAlarm().done(function (results) {
            console.log('Seccuss at unSubAlarm: ' + results);

        }).fail(function (e) {
            console.log('Failed at unSubAlarm: ' + e);
        });
    },

    // 通过GpsData 订阅单台车辆 防止断开订阅
    subSingleAlarmByGpsData: function (oGpsInfo) {

        // 断开后重新订阅
        this.afnCallBack.push({
            fn: this._subSingleAlarmByGpsData,
            oContext: this,
            oData: oGpsInfo,
            PhoneNum: oGpsInfo.PhoneNum
        });

        // 没有启动服务，启动服务后会再次订阅
        if (this.oConnection.state !== 1) {
            return;
        }

        this._subSingleAlarmByGpsData(oGpsInfo);

    },

    // 取消单台车辆的订阅 ---
    _subSingleAlarmByGpsData: function (oGpsInfo) {
        var oTemp = {fnName: '_subSingleAlarmByGpsData', cDateTime: new Date().toLocaleString()};

        var oMsg = ES.Lang.HubSvr.Err;

        if (!oGpsInfo) {
            console.log(ES.Util.template(oMsg[56], oTemp));
            return;
        }
        if (!this.svrBoss ||!this.svrBoss.server.subSingleDeviceAlarm) {
            console.log(ES.Util.template(oMsg[54], oTemp));
            return;
        }
        console.log(ES.Util.template(oMsg[50], oGpsInfo) + new Date());
        this.svrBoss.server.subSingleDeviceAlarm(oGpsInfo.PhoneNum).done(function (results) {
            oTemp.results = results;
            console.log(ES.Util.template(ES.Lang.HubSvr.Msg[51], oTemp));

        }).fail(function (e) {

            oTemp.e = e;
            console.log(ES.Util.template(oMsg[55], oTemp));
        });

    },

    // 取消订阅
    unSubSingleAlarmByGpsData: function (oGpsInfo) {
        if (!oGpsInfo) {
            return;
        }

        this.removeCallBack(this._subSingleAlarmByGpsData, oGpsInfo);
    },

    //----报警推送
    subSingleDeviceAlarm: function (deviceId) {

        if (!this.svrBoss ||!this.svrBoss.server.subSingleDeviceAlarm) {
            return;
        }
        this.svrBoss.server.subSingleDeviceAlarm(deviceId).done(function (results) {
            console.log('Seccuss at subSingleDeviceAlarm: ' + results);

        }).fail(function (e) {
            console.log('Failed at subSingleDeviceAlarm: ' + e);
        });
    }

});

﻿
ES.MonitorTimer = ES.Class.extend({

    oOption: {
        // 定时器执行时间间隔
        nIntervalSpeed: 1000 * 60 * 10,

        // 是否默认开始执行
        bIsStart: true,

        // 注册执行的方法
        aoActive: [],
    },

    //定时器 id
    _nIntervalId: null,

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        if (this.oOption.bIsStart) {
            this.start();
        }
    },

    // 增加回调
    on: function (oActive) {
        if (!this.oOption.aoActive) {
            this.oOption.aoActive = [];
        }
        var bIn = false;
        $.each(this.oOption.aoActive, function (nIndex, oItem) {
            if (oItem.fnCallBack === oActive.fnCallBack && oItem.oContext === oActive.oContext) {
                oItem.fnCallBack = oActive.fnCallBack;
                bIn = true;
            }
        });
        if (bIn) {
            return;
        }
        this.oOption.aoActive.push(oActive);
    },

    // 注销回调
    off: function (fnCallBack, oContext) {
        if (!this.oOption.aoActive || this.oOption.aoActive.length <= 0) {
            return;
        }
        var aoActive = this.oOption.aoActive;

        for (var i = aoActive.length - 1; i >= 0; i--) {
            if (aoActive[i].oContext === oContext && aoActive[i].fnCallBack === fnCallBack) {
                // 删除该元素
                aoActive.slice(i, 1);
            }
        }
    },

    //开始轨迹回放
    start: function () {
        if (this._nIntervalId) {
            return;
        }
        //定时器
        this._nIntervalId = window.setInterval(
            this._tick,
            this.oOption.nIntervalSpeed,
            this);
    },

    stop: function () {
        if (!this._nIntervalId) {
            return;
        }
        clearInterval(this._nIntervalId);
        this._nIntervalId = null;
    },

    //暂停timer 后在按照时间启动


    // 获得定时器的状态,false表示定时器已经关闭，true表示定时器开，正在回放轨迹
    getStatus: function () {
        if (!this._nIntervalId) {
            return false;
        }
        return true;
    },

    //设置播放轨迹速度
    setSpeed: function (nIntervalSpeed) {
        this.oOption.nIntervalSpeed = nIntervalSpeed;

        if (this.oOption.nIntervalSpeed) {
            this.stop();
            this.start();
        }
    },

    //定时触发
    _tick: function (self) {
        self._callbacks();
    },

    //设置播放进度条,移动轨迹点到下一个位置
    _callbacks: function () {
        if (!this.oOption.aoActive || this.oOption.aoActive.length <= 0) {
            return;
        }
        var aoActive = this.oOption.aoActive;
        $.each(aoActive, function (nIndex, oItem) {
            if (!oItem.fnCallBack) {
                return;
            }
            if (!oItem.oContext && oItem.fnCallBack) {
                oItem.fnCallBack.call(this, {});
            }
            if (oItem.oContext && oItem.fnCallBack) {
                oItem.fnCallBack.call(oItem.oContext, {});
            }
            return true;
        });
    },

});

ES.Lang.HubSvr = {
    _subSingleAlarmByGpsData: {
        1: '无法订阅车辆,原因：oGpsInfo 为空！',
        2: '无法订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hub服务没有订阅接口！',
        3: '开始订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hub服务没有订阅接口！时间:',
        4: '开始订阅车辆{PhoneNum};车牌号{VehicleNo}返回值:{results}时间:',
        5: '开始订阅车辆{PhoneNum};车牌号{VehicleNo}原因：{e}！时间:',
        6: '订阅车辆{PhoneNum}失败，原因:{e},时间:{cDateTime}',
    },

    unSubGpsByGpsData: {

        1: '无法取消订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hub服务没有订阅接口！',
        2: '无法取消订阅车辆{PhoneNum};车牌号{VehicleNo}原因：hubhub服务断开！服务状态为:',
        3: '开始取消订阅车辆{PhoneNum};车牌号{VehicleNo}',
        4: '取消订阅车辆成功{PhoneNum};车牌号{VehicleNo}返回值:{results}时间:',
        5: '取消订阅车辆失败{PhoneNum};车牌号{VehicleNo}原因：{e}！时间:',
        6: '无法取消订阅车辆,原因：oGpsInfo 为空！',
    },

    // 正确 定义规则
    Msg: {
        11: '{fnName},{cDateTime} 订阅车辆：{PhoneNum}车牌号{VehicleNo}成功，返回值为：{results}',
        12: '{fnName},{cDateTime} 订阅车辆{cVehLst}成功，返回值为：{results}',
        21: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum} 成功,车牌号{VehicleNo}，返回值为：{results} ',
        41: '{fnName},{cDateTime} 取消订阅车辆{vehicleLst} 成功，返回值为：{results} ',

        31: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum}/{VehicleNo} 告警成功，返回值为：{results} ',
        51: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum}/{VehicleNo} 告警成功，返回值为：{results} ',
    },

    // 错误 定义规则 接口定义
    Err: {
        10: '{fnName},{cDateTime} 订阅车辆失败，原因：oGpsInfo 为空！',
        12: '{fnName},{cDateTime} 无法订阅车辆{PhoneNum};车牌号{VehicleNo}，原因：hub服务没有订阅接口！',
        13: '{fnName},{cDateTime} 开始订阅车辆{PhoneNum};车牌号{VehicleNo}！',
        15: '{fnName},{cDateTime} 订阅车辆：{PhoneNum}车牌号{VehicleNo}失败，原因:{e}',

        16: '{fnName},{cDateTime} 订阅车辆{cVehLst}失败，原因：hub接口 为空！',
        17: '{fnName},{cDateTime} 订阅车辆：{cVehLst}失败，原因:{e}',
        18: '{fnName},{cDateTime} 订阅车辆失败，原因：参数为空！',


        20: '{fnName},{cDateTime} 取消订阅失败，原因参数为空！',
        22: '{fnName},{cDateTime} 开始取消订阅车辆{PhoneNum};车牌号{VehicleNo}！',
        23: '{fnName},{cDateTime} 取消订阅车辆{vehicleLst}成功，返回值为：{results}',

        40: '{fnName},{cDateTime} 订阅车辆失败，原因：vehicleLst 为空！',
        41: '{fnName},{cDateTime} 取消订阅车辆失败，原因：hub接口 为空！',
        42: '{fnName},{cDateTime} 无法取消订阅车辆{vehicleLst}，原因：hub 服务断开！服务状态为：{state}',
        43: '{fnName},{cDateTime} 开始取消订阅车辆{vehicleLst}！',
        44: '{fnName},{cDateTime} 取消订阅车辆{vehicleLst}失败，原因:{e}',

        30: '{fnName},{cDateTime} 开始订阅所有车辆{PhoneNum}/{VehicleNo}告警，时间：{cDateTime}!',
        31: '{fnName},{cDateTime} 订阅所有车辆告警成功，时间：{cDateTime}!',
        32: '{fnName},{cDateTime} 订阅所有车辆告警成功失败，时间：{cDateTime}',
        33: '{fnName},{cDateTime} 无法取消订阅车辆{PhoneNum}/{VehicleNo}，原因：hub 服务断开！服务状态为：{state}',
        34: '{fnName},{cDateTime} 订阅所有车辆告警失败，原因：hub接口 为空！',
        35: '{fnName},{cDateTime} 取消订阅车辆{PhoneNum}/{VehicleNo}告警失败，原因:{e}',


        50: '{fnName},{cDateTime} 开始订阅单台车辆{PhoneNum}/{VehicleNo}告警，时间：{cDateTime}!',
        51: '{fnName},{cDateTime} 订阅单台车辆告警成功，时间：{cDateTime}!',
        52: '{fnName},{cDateTime} 订阅单台车辆告警成功失败，时间：{cDateTime}',
        53: '{fnName},{cDateTime} 无法取消订阅单台车辆{PhoneNum}/{VehicleNo}，原因：hub 服务断开！服务状态为：{state}',
        54: '{fnName},{cDateTime} 订阅单台车辆告警失败，原因：hub接口 为空！',
        55: '{fnName},{cDateTime} 取消订阅单台车辆{PhoneNum}/{VehicleNo}告警失败，原因:{e}',
        56: '{fnName},{cDateTime} 取消订阅单台车辆告警失败，原因:oGpsInfo 为空',
    }


};

ES.TrackHelper = {

    //获取告警类型
    getAlarmTypeName: function (type) {
        var oData = this.getAlarmType();
        if (!oData) return;
        return oData[type];
    },

    //告警字典
    getAlarmType: function () {
        var alarmType = {
            1: '紧急报警', 2: '超速报警', 3: '疲劳驾驶', 4: '预警', 5: 'GNSS模块发生故障',
            6: '定位天线被剪断', 7: 'GNSS天线短路', 8: '终端主电源欠压', 9: '电源掉电', 10: '终端LCD或显示器故障',
            11: 'TTS模块故障', 12: '摄像头故障', 13: '当天累计驾驶超时', 14: '超时停车', 15: '进出区域',
            16: '进出路线', 17: '路段行驶时间不足_过长', 18: '路线偏离报警', 19: '车辆VSS故障', 20: '车辆油量异常',
            21: '车辆被盗', 22: '车辆非法点火', 23: '车辆非法位移', 24: '碰撞侧翻报警', 25: 'SD卡异常',
            26: '进区域报警', 27: '出区域报警', 28: '超线报警',

            200: '重量传感器可疑故障', 201: '顶棚可疑故障', 107: '不按线路行驶',

            106: '平台超速报警',
            100: '未密闭', 101: '超载',
            206: '无运输许可证', 103: '正常出土', 105: '可疑出土', 104: '可疑消纳', 102: '正常消纳', 210: '非工作时间运输',
            211: '工地可疑出土', 212: '工地正常出土', 213: '消纳场可疑消纳', 214: '消纳场正常消纳'
        };
        return alarmType;
    },

    // 获取对象类型
    getObjType: function (oLayer) {
        if (oLayer instanceof L.Rectangle) {
            return 501001;
        }
        if (oLayer instanceof L.Polygon) {
            return 501003;
        }
        if (oLayer instanceof L.Polyline) {
            return 501004;
        }
        if (oLayer instanceof L.Circle) {
            return 501002;
        }
        return 1;
    },

    getPosW: function (cKey) {
        var oParam = {vPos: 10, aPos: 20};
        if (oParam.hasOwnProperty(cKey)) {
            return oParam[cKey];
        }
        return null;
    },

    //方向处理
    getDire: function (dataItem) {
        var nDir = 0;
        if (typeof dataItem == 'object') {
            if (dataItem.Direction) {
                nDir = dataItem.Direction;
            }
            else {
                nDir = dataItem.dir;
            }
            nDir = dataItem.Direction;
        }
        else {
            nDir = dataItem;
        }
        if ((nDir >= 0 && nDir <= 15) || (nDir > 345 && nDir <= 360))
            return '正北';
        if (nDir > 15 && nDir <= 75)
            return '东北';
        if (nDir > 75 && nDir <= 105)
            return '正东';
        if (nDir > 105 && nDir <= 165)
            return '东南';
        if (nDir > 165 && nDir <= 195)
            return '正南';
        if (nDir > 195 && nDir <= 255)
            return '西南';
        if (nDir > 255 && nDir <= 285)
            return '正西';
        if (nDir > 285 && nDir <= 345)
            return '西北';
    },

    getDateMsg: function (nTick) {
        var nCurTick = new Date().getTime();
        var nInt = nCurTick - nTick;
        if (nInt > 24 * 60 * 60 * 1000) {
            var nDay = (nCurTick - nTick) / (24 * 60 * 60 * 1000);
            return "[" + parseInt(nDay) + "天前]";
        }
        else if (nInt > 1 * 60 * 60 * 1000 && nInt <= 24 * 60 * 60 * 1000) {

            var nH = nInt / (1 * 60 * 60 * 1000);
            return "[" + parseInt(nH) + "小时前]";
        }
        else {
            var nH = parseInt(nInt / (60 * 1000));
            if (nH <= 0) {
                return "";
            }
            return "[" + parseInt(nH) + "分钟前]";
        }
    },

    // 设置车辆的在线状态
    getVehStatusClass: function (oPosInfo) {
        var oClass = {};
        //判断当前位置信息
        if (oPosInfo.VehicleStatus == "行驶"
            || oPosInfo.VehicleStatus == "停车"
            || oPosInfo.VehicleStatus == "熄火") {
            oClass.cStatus = 'l-bd-on l-mobile-on';
            oClass.cLstClass = ''
        }
        else if (oPosInfo.VehicleStatus == "通讯中断") {//通讯中断;定位失败
            oClass.cStatus = 'l-bd-off l-mobile-off';
            oClass.cLstClass = 'gray'
        }
        else if (oPosInfo.VehicleStatus == "定位失败") {
            oClass.cStatus = 'l-bd-off l-mobile-on';
            oClass.cLstClass = 'gray'
        }
        return oClass;
    },

    // 获得顶灯的状态
    convertVehStatus: function (oGpsInfo) {
        oGpsInfo.nGreenOn = 0;
        oGpsInfo.nRedOn = 0;
        oGpsInfo.nYelloOn = 0;
        oGpsInfo.cLight = "白灯";
        oGpsInfo.cClsLight = "gray";
        if(!oGpsInfo.attach)
        {
            return;
        }
        var oAttach = oGpsInfo.attach;
        if (oAttach.ZtLeightGreenOn === 'True') {
            oGpsInfo.nGreenOn = 1
            oGpsInfo.cLight = "绿灯"
            oGpsInfo.cClsLight = "green"
        }
        if (oAttach.ZtLeightRedOn === 'True') {
            oGpsInfo.nRedOn = 1;
            oGpsInfo.cLight = "红灯";
            oGpsInfo.cClsLight = "red"
        }
        if (oAttach.ZtLeightYelloOn === 'True') {
            oGpsInfo.nYelloOn = 1;
            oGpsInfo.cLight = "黄灯";
            oGpsInfo.cClsLight = "yellow"
        }
        oGpsInfo.dWeight = oAttach.ZtWeightValue;


    },

    // 获得时间相关信息
    getTrackDateMsg: function (nTick) {
        //var nInt = nCurTick - nTick;
        var nInt = nTick;
        if (nInt > 24 * 60 * 60 * 1000) {
            var nDay = (nInt / (24 * 60 * 60 * 1000)).toFixed(2);

            var oTime = {nTime: nDay, cMsg: '天'};
            return oTime;
        }
        else if (nInt > 1 * 60 * 60 * 1000 && nInt <= 24 * 60 * 60 * 1000) {
            var nH = (nInt / (1 * 60 * 60 * 1000)).toFixed(2);
            var oTime = {nTime: nH, cMsg: '小时'}
            return oTime;
        }
        else if (nInt > 1 * 60 * 1000 && nInt <= 60 * 60 * 1000) {
            var nH = (nInt / (60 * 1000)).toFixed(0);
            if (nH < 0) {
                nH = 0;
            }
            var oTime = {nTime: nH, cMsg: '分钟'}
            return oTime;
        }
        else {
            var nH = (nInt / 1000).toFixed(0);
            if (nH <= 0) {
                return {nTime: 0, cMsg: ''}
            }
            var oTime = {nTime: nH, cMsg: '秒'}
            return oTime;
        }
    },
};

/**
 * Created by liulin on 2019/3/28.
 */

ES.MapView.BaseMonitor = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag:'demo',

        cUrl:'/MapView/GetSubDeptByTotal',

    },

    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this.oPenStyle = this.oOption.oPenStyle;
        // 获得地图控件
        this._oParent = oParent;

        //this._oContainer = $('.' + this.oOption.acParentDivClass.join('.'));

        // 初始化界面
        this.initUI();

        // 初始化事件
        this.initOn();


        this.initMenuBox();

        this.initBtn();

        // 设置父级容器的事件，是为了屏蔽地图的操作
        this.setParentEvent();
    },


    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);

    },


    initUI: function () {

        this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));
        this.TimeFormat(0);
        this.$_oContainer = $(ES.template(this.cHTML, this.oOption));
        this.$_oPContainer.html(this.$_oContainer);

        this.loadAn(this.$_oContainer);

        // 用于查询
        this.$_oRoadBox = this.$_oContainer.find('.ex-monitor-road-wbox');
        this.$_oChart = this.$_oContainer.find('.ex-layout-monitor-charts-content');
    },
    TimeFormat:function(type){
        if(type == 0){
            var _h = ("0"+this.oOption.cDayHour).slice(-2);
        }else{
            var _h = ("0"+this.oOption.cNightHour).slice(-2);
        }
        var newDate = new Date();
        var _y = newDate.getFullYear();
        var _M = ("0"+(newDate.getMonth()+1)).slice(-2);
        var _d = ("0"+newDate.getDate()).slice(-2);

        this.oOption.cTime= _y+' / '+_M+' / '+_d+' '+_h+':00 至现在';
    },
    initBtn: function () {
        var nWidth = -(this.$_oPContainer.width() - 6);

        this.$_oMinitorOpenBtn = this.$_oContainer.find('a.ex-btn-close-right');
        this.$_oMinitorCloseBtnvar = this.$_oContainer.find('a.ex-btn-close-left');

        this.$_oMinitorCloseBtnvar.hide();
        this.$_oMinitorOpenBtn.show();
        //this.$_oPContainer.stop().animate({ "left": '1rem' }, 800);
        this.$_oPContainer.css({ "left": nWidth + 32 });
        //this.$_oList = this.$_oContainer.find('.ex-layout-monitor-wbox-content');


        var self =this;
        this.$_oMinitorCloseBtnvar.bind('click', function () {
            self.$_oMinitorOpenBtn.show();
            $(this).hide();
            self.$_oPContainer.stop().animate({ "left": nWidth + 32 }, 800);
        });

        this.$_oMinitorOpenBtn.bind('click', function () {
            self.$_oMinitorCloseBtnvar.show();
            $(this).hide()
            self.$_oPContainer.stop().animate({ "left": "1rem" }, 800);
        });
    },



    show: function () {
        this.$_oContainer.show();
    },

    hide: function () {
        this.$_oContainer.hide();
    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {

        // 包括资产类型和资产类型数据
        ES.Util.reqData({url:this.oOption.cUrl,data:{}},this.initMenuBoxHandler,this);


    },

    // 初始化类型
    initMenuBoxHandler:function(oData) {
        if (!oData.rtnData || oData.rtnData.length<=0) {
            return;
        }

        // 初始化图表和菜单
        for (var i = 0; i < oData.rtnData.length; i++) {
            var cLi = ES.template(this.cItem, oData.rtnData[i]);
            this.$_oRoadBox.append($(cLi));
        }

        this.$_oRoadBox.find('.ex-monitor-wbox').bind('click', function () {
            $(this).find('.box').addClass('ec-active');
            $(this).siblings().find('.box').removeClass('ec-active');
        });

    },

    initOn:function(){
        var self = this;
        if(!$('#switch-onText')){}else{
            $('#switch-onText').bootstrapSwitch();
            $('#switch-onText').on('switchChange.bootstrapSwitch', function(event, state) {
                //console.log(this); // DOM element
                //console.log(event); // jQuery event
                //console.log(state); // true | false
                if(state){
                    self.initMenuBoxHandler(self.DayData);
                    self.TimeFormat(0);
                    $('.ex-title>h2>font>sub').html('( '+ self.oOption.cTime +' )');
                }else{
                    self.initMenuBoxHandler(self.NightData);
                    self.TimeFormat(1);
                    $('.ex-title>h2>font>sub').html('( '+ self.oOption.cTime +' )');
                }
            });
        }
    },
    loadAn: function (cTag, cFlag) {
        //加载进度条
        var loadMaskHtml = '<div class="ex-layout-loading monitor"><div class="spinner"></div></div>';
        var oDiv = $(loadMaskHtml);
        if (typeof cTag === 'object') {
            cTag.append(oDiv);
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }

        $(cFlag + cTag).append(oDiv);
    },
    removeAn: function (cTag, cFlag) {
        if (typeof cTag === 'object') {
            cTag.find('.ex-layout-loading').remove();
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }
        $(cFlag + cTag).find('.ex-layout-loading').remove();
    },
    noData: function (cTag, cFlag) {
        //加载进度条
        var loadMaskHtml = '<div class="ex-layout-loading noData"></div>';
        var oDiv = $(loadMaskHtml);
        if (typeof cTag === 'object') {
            cTag.append(oDiv);
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }
        $(cFlag + cTag).append(oDiv);
    },
    removeNoData: function (cTag, cFlag) {
        if (typeof cTag === 'object') {
            cTag.find('.ex-layout-loading.noData').remove();
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }
        $(cFlag + cTag).find('.ex-layout-loading.noData').remove();

    },

});


ES.MapView.BaseMonitor.include({

    cHTML:
    '<div class="ex-layout-monitor-wbox-content ec-align-left" style="display: none">' +
    '<div class="ex-title">' +
    '     <h2>' +
    '        <font>{cFlag}<sub>( {cTime} )</sub></font>' +
    '        <span class="ec-align-right ec-margin-left">' +
    '              <a href="javascript:void(0);" class="ex-btn-close-left" style="color:#fff;display:none"><i class="ec-icon-arrow-left"></i></a>' +
    '              <a href="javascript:void(0);" class="ex-btn-close-right" style="color:#fff"><i class="ec-icon-arrow-right"></i></a>' +
    '          </span>' +
    '    </h2>' +
    '</div>' +
    '   <div class="ex-layout-monitor-charts">' +
    '       <div class="ex-layout-monitor-charts-content"></div>' +
    '   </div>' +
    '   <div class="ex-monitor-road-wbox ec-align-right"></div>' +
    '</div>',



    cItem:
    ' <div class="ex-monitor-wbox">' +
    '   <div class="box" data-id="{FeatureId}"> ' +
    '       <i class="icon-tree"></i>  {FeatureName}' +
//'       <span class="num"><strong>{Total}</strong></span>' +
    '   </div>' +
    '</div>'




});

/**
 * Created by liulin on 2019/3/28.
 */

ES.MapView.SiteMonitor = ES.MapView.BaseMonitor.extend({
    cHTML:
    '<div class="ex-layout-monitor-wbox-content ec-align-left">' +
    '<div class="ex-title">' +
    '     <h2>' +
    '        <font>{cFlag}<sub>( {cTime} )</sub></font>' +
    '        <span class="ec-align-right ec-margin-left-sm">' +
    '              <a href="javascript:void(0);" class="ex-btn-close-left" style="color:#fff;display:none"><i class="ec-icon-arrow-left"></i></a>' +
    '              <a href="javascript:void(0);" class="ex-btn-close-right" style="color:#fff"><i class="ec-icon-arrow-right"></i></a>' +
    '          </span>' +
    '    </h2>' +
    '</div>' +
    '   <div class="ex-layout-monitor-charts">' +
    '       <div class="ex-layout-monitor-charts-content"></div>' +
    '   </div>' +
    '   <div class="ex-monitor-road-wbox ec-align-right"></div>' +
    '</div>',
    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: '工地违规数据统计',
        cUrl: '/AssetStatic/ReportAssetStatic',
        cDayHour:5,
        cNightHour:18,
        //cTime:'2017/12/28 18:00 至现在',
        data:{
            rtnData:{
                Tech:[
                    { TypeId:1,TypeName: "武汉市", Cnt: (Math.floor(Math.random() * 100) + 1), Icon: "Assets" },
                    { TypeId:2,TypeName: "蔡甸区", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                ],
                TechGroup:[
                    {Value:[
                        { TypeId:1,AlarmName: "提前出土", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "未上报", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "停工", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "可疑", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "出土", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "上报", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                    ],TypeId:1,TypeName:'武汉市',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]},
                    {Value:[
                        { TypeId:1,AlarmName: "提前出土", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "未上报", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "停工", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "可疑", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "出土", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "上报", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                    ],TypeId:2,TypeName:'蔡甸区',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]}
                ],
            }
        }
    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {
        this.nTotal = 0;
        this.setDefaultData();
        this.initChart();
        // 包括资产类型和资产类型数据
        //ES.Util.reqData({url: this.oOption.cUrl, data: {}}, this.initMenuBoxHandler, this);
        //this.initMenuBoxHandler(this.oOption.data);

        var self = this;
        ES.getData({},'/MapView/NormalSiteStat',function(data){
            self.initMenuBoxHandler(data);
            self.removeAn(self.$_oContainer);
            if(data.length == 0){
                self.noData(self.$_oContainer);
            }else{
                //self.$_oMinitorOpenBtn.click();
            }
        })
    },
    // 初始化类型
    initMenuBoxHandler: function (oData) {
        if (!oData) {return;}

        this.oBusData = oData;
        for(var i = 0;i< oData.length;i++) {
            oData[i].FeatureId = oData[i].Id;
            oData[i].FeatureName = oData[i].Name;
            // 初始化图表和菜单
            var cLi = ES.template(this.cItem, oData[i]);
            $_oLi = $(cLi);
            $_oLi.data('data', oData[i]);
            this.$_oRoadBox.append($_oLi);
        }
        this.nTotal = oData[0].Total;
        this.initEvent();
    },
    // 要执行父类方法
    initEvent: function () {
        var self = this;
        this.$_oRoadBox.find('.ex-monitor-wbox').bind('click', function () {
            $(this).find('.box').addClass('ec-active');
            $(this).siblings().find('.box').removeClass('ec-active');

            var dataId = $(this).find('.box').attr('data-id');
            // 添加数据
            var oData = null;

            for (var i = 0; i < self.oBusData.length; i++) {
                if (self.oBusData[i].Id === parseInt(dataId)) {
                    oData = self.oBusData[i];
                    break;
                }
            }
            self.updateChart(oData);
        });
        this.$_oRoadBox.find('.ex-monitor-wbox').eq(0).click();
    }
});

ES.MapView.SiteMonitor.include({
    // 设置默认值
    setDefaultData: function () {
        this.oDeptStatic = [ ];
        this.aoSer = [];
        this.aoDept1=[];
        this.nMaxMile1 =1;
        this.aoDept2=[];
        this.nMaxMile2 =1;
        //this.nTotal = 0
    },
    // 初始化图表
    initChart: function () {
        var oChart = echarts.init(this.$_oChart.get(0));
        this.oChart = oChart;
        this.getOption();
        oChart.setOption(this.oOpt);
    },
    // 更新chart 图表数据
    updateChart: function (oData) {
        if (!oData) {return;}

        this.aoDept1.splice(0, this.aoDept1.length);
        this.aoDept2.splice(0, this.aoDept2.length);
        this.aoSer.splice(0, this.aoSer.length);

        // for (var i = 0; i < oData.rtnData.Value.length; i++) {
        //     this.aoDept.unshift(oData.rtnData.Value[i].AlarmName);
        // }
        this.aoDept1 = ['上报提前','上报未出土'];
        this.aoDept2 = ['未上报出土'];
        this.aoSer = [];

        var aoTemp1 = [oData.Early,oData.NotUnearthed];
        for (var i = 0; i < aoTemp1.length; i++) {
            //this.nTotal = this.nTotal + oData.rtnData.Value[i].Cnt;
            if (aoTemp1[i] > this.nMaxMile1) {
                this.nMaxMile1 = aoTemp1[i] ;
            }
        }
        var aoTemp2 = [oData.NotReport];
        for (var j = 0; j < aoTemp2.length; j++) {
            //this.nTotal = this.nTotal + oData.rtnData.Value[i].Cnt;
            if (aoTemp2[j] > this.nMaxMile2) {
                this.nMaxMile2 = aoTemp2[j] ;
            }
        }
        var oSer1 = {
            name: oData.Name,
            type: 'bar',
            stack: 'Site',
            silent: true,
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true,
                    formatter:'{c}个'
                }
            },
            data: aoTemp1
        };
        var oSer2 = {
            name: oData.Name,
            type: 'bar',
            stack: 'upSite',
            silent: true,
            z: 3,
            xAxisIndex: 1,
            yAxisIndex: 1,
            label: {
                normal: {
                    position: 'right',
                    show: true,
                    formatter:'{c}个'
                }
            },
            data: aoTemp2
        };
        this.aoSer.push(oSer1);
        this.aoSer.push(oSer2);

        //var oPie = this.getPieConfig(oData);
        //this.aoSer.push(oPie);

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getPieConfig: function (oData) {
        var aoData =  oData.rtnData.OnlineRate;
        this.oDeptStatic.splice(0, this.oDeptStatic.length);
        var oPie = {
            type: 'pie',
            radius: [0, '30%'],
            center: ['75%', '25%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: this.oDeptStatic
        }
        for(var i=0;i< aoData.length;i++){
            this.oDeptStatic.push({name:aoData[i].Name,value:aoData[i].Value,itemStyle:{normal:{color:aoData[i].type==1?'#f72b2e':'#2bb743'}}});
        };
        return oPie;
    },
    // 设置图表参数
    getOption: function () {
        // 指定图表的配置项和数据
        var oOpt = {
            title: [{
                text: '上报工地违规统计',
                //subtext: '总计 '+ this.nTotal +' 个工地',
                x: '50%',
                y:'3%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 15
                }
            },{
                text: '未上报工地违规统计',
                //subtext: '总计 '+ this.nTotal +' 个工地',
                x: '50%',
                y:'58%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 15
                }
            }],
            tooltip :{
                formatter: "{b} : {c} ({d}%)"
            },
            grid: [{
                top: '12%',
                width: '80%',
                bottom: '42%',
                left: 10,
                containLabel: true
            }, {
                top: '68%',
                width: '80%',
                bottom: 0,
                left: 10,
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                max: this.nMaxMile1 * 2.5,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                },
            },{
                type: 'value',
                max: this.nMaxMile2 * 2.5,
                gridIndex: 1,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                },
            }],
            yAxis: [{
                type: 'category',
                data: this.aoDept1,
                axisLabel: {
                    show: true,
                },
                splitLine: {
                    show: false
                }
            },{
                type: 'category',
                data: this.aoDept2,
                gridIndex: 1,
                axisLabel: {
                    show: true,
                },
                splitLine: {
                    show: false
                }
            }],
            series: this.aoSer
        };
        this.oOpt = oOpt;
    },
});

/**
 * Created by liulin on 2019/3/28.
 */

ES.MapView.SuspicSiteMonitor = ES.MapView.BaseMonitor.extend({
    cHTML:
    '<div class="ex-layout-monitor-wbox-content ec-align-left ex-lg">' +
    '<div class="ex-title">' +
    '     <h2>' +
    '        <font>{cFlag}<sub>( {cTime} )</sub></font>' +
    '        <span class="ec-align-right ec-margin-left-sm">' +
    '              <a href="javascript:void(0);" class="ex-btn-close-left" style="color:#fff;display:none"><i class="ec-icon-arrow-left"></i></a>' +
    '              <a href="javascript:void(0);" class="ex-btn-close-right" style="color:#fff"><i class="ec-icon-arrow-right"></i></a>' +
    '          </span>' +
    '        <div class="ec-btn-group">' +
    '           <input id="switch-onText" data-size="xs" type="checkbox" checked data-on-text="白班" data-off-text="晚班">' +
    '        </div>' +
    '    </h2>' +
    '</div>' +
    '   <div class="ex-layout-monitor-charts">' +
    '       <div class="ex-layout-monitor-charts-content"></div>' +
    '   </div>' +
    '   <div class="ex-monitor-road-wbox ec-align-right"></div>' +
    '</div>',
    cItem:
    ' <div class="ex-monitor-wbox">' +
    '   <div class="box" data-id="{FeatureId}"> ' +
    '       <i class="icon-tree"></i> ' +
    '       <div class="ex-scroll-title"><p>{FeatureName}:</p></div> ' +
    '       <span class="num"><strong>出土 {Count} 次</strong></span>' +
    '   </div>' +
    '</div>',

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: '可疑工地违规公司信息',

        cUrl: '/AssetStatic/ReportAssetStatic',
        //cTime:'2017/12/28 18:00 至现在',
        cDayHour:5,
        cNightHour:18,
        data:{
            rtnData:{
                Tech:[
                    { TypeId:1,TypeName: "洪山区,距离武汉市洪山区毛坦小学159米", Cnt: (Math.floor(Math.random() * 50) + 51), Icon: "Assets" },
                    { TypeId:2,TypeName: "新洲区,距离武钢集团武汉江北钢铁公司900米", Cnt: (Math.floor(Math.random() * 50) + 1), Icon: "Denoter" },
                ],
                TechGroup:[
                    {Value:[
                        { TypeId:1,AlarmName: "鄂A111111", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "鄂A222222", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "鄂A333333", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "鄂A444444", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "鄂A555555", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "鄂A666666", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                        { TypeId:6,AlarmName: "鄂A777777", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                        { TypeId:6,AlarmName: "鄂A888888", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                    ],TypeId:1,TypeName:'武汉市xx公司',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]},
                    {Value:[
                        { TypeId:1,AlarmName: "鄂A111111", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "鄂A222222", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "鄂A333333", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "鄂A444444", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "鄂A555555", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "鄂A666666", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                        { TypeId:6,AlarmName: "鄂A777777", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                        { TypeId:6,AlarmName: "鄂A888888", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                    ],TypeId:2,TypeName:'蔡甸区',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]}
                ],

            }
        }

    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {
        this.nTotal = 0;
        this.setDefaultData();
        this.initChart();
        // 包括资产类型和资产类型数据
        //ES.Util.reqData({url: this.oOption.cUrl, data: {}}, this.initMenuBoxHandler, this);
        //this.initMenuBoxHandler(this.oOption.data);

        var self = this;
        ES.getData({},'/MapView/SuspicStat?type=1',function(data){
            self.DayData = data.Day;
            self.NightData = data.Night;
            self.initMenuBoxHandler(self.DayData);
            self.removeAn(self.$_oContainer);
            if(data.Day.length == 0){
                self.DayNoData = true;
                self.noData(self.$_oContainer);
            }else{
                //self.$_oMinitorOpenBtn.click();
            }
        })


    },
    // 初始化类型
    initMenuBoxHandler: function (oData) {
        if (!oData||oData.length == 0) {
            if(this.$_oContainer.find('.ex-layout-loading.noData').length ==0){
                this.noData(this.$_oContainer);
            }
            return;
        }

        if(this.$_oContainer.find('.ex-layout-loading.noData').length !=0){
            this.removeNoData(this.$_oContainer);
        }

        if(oData.length == 0){
            this.$_oChart.hide();
        }else{
            this.$_oChart.show();
        }
        this.$_oRoadBox.empty();
        this.oBusData = oData;

        for(var i = 0;i< oData.length;i++) {
            oData[i].FeatureId = oData[i].Id;
            oData[i].FeatureName = oData[i].Addr;
            // 初始化图表和菜单
            var cLi = ES.template(this.cItem, oData[i]);

            $_oLi = $(cLi);
            $_oLi.data('data', oData[i]);
            this.$_oRoadBox.append($_oLi);

        }
        //this.nTotal = oData[0].Total;
        this.initEvent();
    },

    // 要执行父类方法
    initEvent: function () {

        var self = this;
        this.$_oRoadBox.find('.ex-monitor-wbox').bind('click', function () {
            $(this).find('.box').addClass('ec-active');
            $(this).siblings().find('.box').removeClass('ec-active');

            var dataId = $(this).find('.box').attr('data-id');
            // 添加数据
            var oData = null;

            for (var i = 0; i < self.oBusData.length; i++) {
                if (self.oBusData[i].Id === parseInt(dataId)) {
                    oData = self.oBusData[i];
                    break;
                }
            }
            self.updateChart(oData);

            var latlng = {lat: oData.Lat, lng: oData.Lng};
            var item = $('.suSpicSite .ex-layout-struckbox-content').jstree('get_node', 's' + dataId);
            if (!item.state.checked) {
                $('.suSpicSite .ex-layout-struckbox-content').jstree('check_node', 's' + dataId);
                if ($('.suSpicSite .ex-layout-struckbox-content').jstree('get_checked').length > 1) {
                    self._oParent._oMap.setView(latlng, 16);
                }
            } else {
                //定位就行
                self._oParent._oMap.setView(latlng, 16);
            }

        });


        this.$_oRoadBox.find('.ex-monitor-wbox').eq(0).click();
        if(!this._Interval){
            this._Interval = window.setInterval(function(){
                self.$_oRoadBox.find('.ex-scroll-title>p').toggleClass('ec-active');
            },10000);
        }else{
            window.clearInterval(this._Interval);
            this._Interval = window.setInterval(function(){
                self.$_oRoadBox.find('.ex-scroll-title>p').toggleClass('ec-active');
            },10000);
        }

    }

});

ES.MapView.SuspicSiteMonitor.include({

    // 设置默认值
    setDefaultData: function () {
        this.oDeptStatic = [ ];
        this.aoSer = [];
        this.aoDept=[];
        this.nMaxMile =1;

        //this.nTotal = 0
    },

    // 初始化图表
    initChart: function () {
        var oChart = echarts.init(this.$_oChart.get(0));
        this.oChart = oChart;
        this.getOption();
        oChart.setOption(this.oOpt);
    },


    // 更新chart 图表数据
    updateChart: function (oData) {

        if (!oData) {
            return;
        }

        this.aoDept.splice(0, this.aoDept.length);
        this.aoSer.splice(0, this.aoSer.length);
        this.aoCompany = oData.Company.Name;
        this.nTotal = oData.Company.Count;


        for (var i = 0; i < oData.Company.Vehs.length; i++) {
            this.aoDept.unshift(oData.Company.Vehs[i].VehicleNo);
        }
        this.aoSer = [];


        var aoTemp = [];
        for (var j = 0; j < oData.Company.Vehs.length; j++) {
            aoTemp.unshift(oData.Company.Vehs[j].Count);
            //this.nTotal = this.nTotal + oData.rtnData.Value[i].Count;
            if (oData.Company.Vehs[j].Count > this.nMaxMile) {
                this.nMaxMile = oData.Company.Vehs[j].Count;
            }
        }

        var oSer = {
            name:  oData.Company.Name,
            type: 'bar',
            stack: 'chart',
            silent: true,
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true,
                    formatter:'{c}次'
                }
            },
            data: aoTemp
        }

        this.aoSer.push(oSer);


        //var oPie = this.getPieConfig(oData);

        //this.aoSer.push(oPie);

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getPieConfig: function (oData) {
        var aoData =  oData.rtnData.OnlineRate;
        this.oDeptStatic.splice(0, this.oDeptStatic.length);
        var oPie = {
            type: 'pie',
            radius: [0, '30%'],
            center: ['75%', '25%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: this.oDeptStatic
        }

        for(var i=0;i< aoData.length;i++){
            this.oDeptStatic.push({name:aoData[i].Name,value:aoData[i].Value,itemStyle:{normal:{color:aoData[i].type==1?'#f72b2e':'#2bb743'}}});
        };

        return oPie;
    },


    // 设置图表参数
    getOption: function () {
        // 指定图表的配置项和数据
        var oOpt = {
            title: [{
                text: '<可疑出土最多> \n '+ this.aoCompany ,
                subtext:'总计 '+ this.nTotal +' 次',
                x: '50%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 14
                }
            },
                //     {
                //     text: '违规率',
                //
                //     x: '75%',
                //     textAlign: 'center',
                //     textStyle: {
                //         fontSize: 14
                //     }
                // }
            ],
            tooltip :{
                formatter: "{b} : {c} ({d}%)"
            },
            grid: [{
                top: 70,
                width: '90%',
                bottom: '0',
                left: 10,
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                max: this.nMaxMile * 1.5,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                },

            }],
            yAxis: [{
                type: 'category',
                data: this.aoDept,
                axisLabel: {
                    show: true,
                },
                splitLine: {
                    show: false
                }
            }],
            series: this.aoSer
        };

        this.oOpt = oOpt;
    },


});



/**
 * Created by liulin on 2019/3/28.
 */

ES.MapView.SuspicUnloadMonitor = ES.MapView.BaseMonitor.extend({
    cHTML:
    '<div class="ex-layout-monitor-wbox-content ec-align-left ex-lg">' +
    '<div class="ex-title">' +
    '     <h2>' +
    '        <font>{cFlag}<sub>( {cTime} )</sub></font>' +
    '        <span class="ec-align-right ec-margin-left-sm">' +
    '              <a href="javascript:void(0);" class="ex-btn-close-left" style="color:#fff;display:none"><i class="ec-icon-arrow-left"></i></a>' +
    '              <a href="javascript:void(0);" class="ex-btn-close-right" style="color:#fff"><i class="ec-icon-arrow-right"></i></a>' +
    '          </span>' +
    '    </h2>' +
    '</div>' +
    '   <div class="ex-layout-monitor-charts">' +
    '       <div class="ex-layout-monitor-charts-content"></div>' +
    '   </div>' +
    '   <div class="ex-monitor-road-wbox ec-align-right"></div>' +
    '</div>',
    cItem:
    ' <div class="ex-monitor-wbox">' +
    '   <div class="box" data-id="{FeatureId}"> ' +
    '       <i class="icon-tree"></i> ' +
    '       <div class="ex-scroll-title"><p>{FeatureName}</p></div> ' +
    '       <span class="num"><strong>消纳 {Count} 次</strong></span>' +
    '   </div>' +
    '</div>',

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: '可疑消纳点违规情况',
        //cTime: '2017/12/28 18:00 至现在',
        cDayHour:5,
        cUrl: '/AssetStatic/ReportAssetStatic',

        data:{
            rtnData:{
                Tech:[
                    { TypeId:1,TypeName: "洪山区,距离武汉市洪山区毛坦小学159米", Cnt: (Math.floor(Math.random() * 50) + 51), Icon: "Assets" },
                    { TypeId:2,TypeName: "新洲区,距离武钢集团武汉江北钢铁公司900米", Cnt: (Math.floor(Math.random() * 50) + 1), Icon: "Denoter" },
                ],
                TechGroup:[
                    {Value:[
                        { TypeId:1,AlarmName: "鄂A111111", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "鄂A222222", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "鄂A333333", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "鄂A444444", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "鄂A555555", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "鄂A666666", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                        { TypeId:6,AlarmName: "鄂A777777", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                        { TypeId:6,AlarmName: "鄂A888888", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                    ],TypeId:1,TypeName:'武汉市xx公司',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]},
                    {Value:[
                        { TypeId:1,AlarmName: "鄂A111111", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "鄂A222222", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "鄂A333333", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "鄂A444444", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "鄂A555555", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "鄂A666666", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                        { TypeId:6,AlarmName: "鄂A777777", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                        { TypeId:6,AlarmName: "鄂A888888", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                    ],TypeId:2,TypeName:'蔡甸区',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]}
                ],

            }
        }

    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {
        this.nTotal = 0;
        this.aoSiteName = "暂无";
        this.aoCompany="暂无";
        this.nTotalSite=0;

        this.setDefaultData();
        this.initChart();
        // 包括资产类型和资产类型数据
        //ES.Util.reqData({url: this.oOption.cUrl, data: {}}, this.initMenuBoxHandler, this);

        var self = this;
        ES.getData({},'/MapView/SuspicStat?type=2',function(data){
            self.initMenuBoxHandler(data);
            self.removeAn(self.$_oContainer);
            if(data.length == 0){
                self.noData(self.$_oContainer);
            }else{
                //self.$_oMinitorOpenBtn.click();
            }
        })




    },
    // 初始化类型
    initMenuBoxHandler: function (oData) {
        if (!oData) {
            return;
        }

        this.oBusData = oData;

        for(var i = 0;i< oData.length;i++) {
            oData[i].FeatureId = oData[i].Id;
            oData[i].FeatureName = oData[i].Addr;
            // 初始化图表和菜单
            var cLi = ES.template(this.cItem, oData[i]);

            $_oLi = $(cLi);
            $_oLi.data('data', oData[i]);
            this.$_oRoadBox.append($_oLi);

        }
        //this.nTotal = oData[0].Total;
        this.initEvent();
    },

    // 要执行父类方法
    initEvent: function () {

        var self = this;
        this.$_oRoadBox.find('.ex-monitor-wbox').bind('click', function () {
            $(this).find('.box').addClass('ec-active');
            $(this).siblings().find('.box').removeClass('ec-active');

            var dataId = $(this).find('.box').attr('data-id');
            // 添加数据
            var oData = null;

            for (var i = 0; i < self.oBusData.length; i++) {
                if (self.oBusData[i].Id === parseInt(dataId)) {
                    oData = self.oBusData[i];
                    break;
                }
            }
            self.updateChart(oData);


            var latlng = {lat:oData.Lat,lng:oData.Lng};
            var item = $('.suSpicUnloadMap .ex-layout-struckbox-content').jstree('get_node', 's'+dataId);
            if(!item.state.checked){
                $('.suSpicUnloadMap .ex-layout-struckbox-content').jstree('check_node', 's'+dataId);
                if($('.suSpicUnloadMap .ex-layout-struckbox-content').jstree('get_checked').length>1){
                    self._oParent._oMap.setView( latlng,16);
                }
            }else{
                //定位就行
                self._oParent._oMap.setView( latlng,16);
            }

        });


        this.$_oRoadBox.find('.ex-monitor-wbox').eq(0).click();

        if(!this._Interval){
            this._Interval = window.setInterval(function(){
                self.$_oRoadBox.find('.ex-scroll-title>p').toggleClass('ec-active');
            },10000);
        }else{
            window.clearInterval(this._Interval);
            this._Interval = window.setInterval(function(){
                self.$_oRoadBox.find('.ex-scroll-title>p').toggleClass('ec-active');
            },10000);
        }
    }

});

ES.MapView.SuspicUnloadMonitor.include({

    // 设置默认值
    setDefaultData: function () {
        this.oDeptStatic = [ ];
        this.aoSer = [];
        this.aoDept=[];
        this.nMaxMile =1;

        //this.nTotal = 0
    },

    // 初始化图表
    initChart: function () {
        var oChart = echarts.init(this.$_oChart.get(0));
        this.oChart = oChart;
        this.getOption();
        oChart.setOption(this.oOpt);
    },


    // 更新chart 图表数据
    updateChart: function (oData) {

        if (!oData) {
            return;
        }

        this.aoDept.splice(0, this.aoDept.length);
        this.aoSer.splice(0, this.aoSer.length);
        this.aoCompany = this.aoCompany!==undefined?oData.Company.Name:"暂无";
        this.nTotal =this.nTotal!==undefined? oData.Company.Count:"暂无";
        this.aoSiteName =this.aoSiteName!==undefined?oData.Site.Name:"暂无";
        this.nTotalSite =this.nTotalSite !==undefined?oData.Site.Count:"暂无";

        for (var i = 0; i < (oData.Company.Vehs.length<8?oData.Company.Vehs.length:8); i++) {
            this.aoDept.unshift(oData.Company.Vehs[i].VehicleNo);
        }
        this.aoSer = [];


        var aoTemp = [];
        for (var j = 0; j < (oData.Company.Vehs.length<8?oData.Company.Vehs.length:8); j++) {
            aoTemp.unshift(oData.Company.Vehs[j].Count);
            //this.nTotal = this.nTotal + oData.rtnData.Value[i].Count;
            if (oData.Company.Vehs[j].Count > this.nMaxMile) {
                this.nMaxMile = oData.Company.Vehs[j].Count;
            }
        }

        var oSer = {
            name: oData.Company.Name,
            type: 'bar',
            stack: 'chart',
            silent: true,
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true,
                    formatter:'{c}次'
                }
            },
            data: aoTemp
        }

        this.aoSer.push(oSer);


        //var oPie = this.getPieConfig(oData);

        //this.aoSer.push(oPie);

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);


    },

    getPieConfig: function (oData) {
        var aoData =  oData.rtnData.OnlineRate;
        this.oDeptStatic.splice(0, this.oDeptStatic.length);
        var oPie = {
            type: 'pie',
            radius: [0, '30%'],
            center: ['75%', '25%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: this.oDeptStatic
        }

        for(var i=0;i< aoData.length;i++){
            this.oDeptStatic.push({name:aoData[i].Name,value:aoData[i].Value,itemStyle:{normal:{color:aoData[i].type==1?'#f72b2e':'#2bb743'}}});
        };

        return oPie;
    },


    // 设置图表参数
    getOption: function () {
        // 指定图表的配置项和数据
        var oOpt = {
            title: [{
                text: '<可疑消纳最多的公司及车辆> \n '+ this.aoCompany ,
                subtext:'总计 '+ this.nTotal +' 次',
                x: '50%',
                y:'3%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 14
                }
            },{
                text: '<可疑消纳最多的工地> \n '+ this.aoSiteName ,
                subtext:'总计 '+ this.nTotalSite +' 次',
                x: '50%',
                y:'78%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 14
                }
            }
                //     {
                //     text: '违规率',
                //
                //     x: '75%',
                //     textAlign: 'center',
                //     textStyle: {
                //         fontSize: 14
                //     }
                // }
            ],
            tooltip :{
                formatter: "{b} : {c} ({d}%)"
            },
            grid: [{
                top: 90,
                width: '90%',
                bottom: '25%',
                left: 10,
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                max: this.nMaxMile * 1.5,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                },

            }],
            yAxis: [{
                type: 'category',
                data: this.aoDept,
                axisLabel: {
                    show: true,
                },
                splitLine: {
                    show: false
                }
            }],
            series: this.aoSer
        };

        this.oOpt = oOpt;
    },


});


/**
 * Created by liulin on 2019/3/28.
 */

ES.MapView.UnloadMonitor = ES.MapView.BaseMonitor.extend({
    cHTML:
    '<div class="ex-layout-monitor-wbox-content ec-align-left ex-lg">' +
    '<div class="ex-title">' +
    '     <h2>' +
    '        <font>{cFlag}<sub>( {cTime} )</sub></font>' +
    '        <span class="ec-align-right ec-margin-left-sm">' +
    '              <a href="javascript:void(0);" class="ex-btn-close-left" style="color:#fff;display:none"><i class="ec-icon-arrow-left"></i></a>' +
    '              <a href="javascript:void(0);" class="ex-btn-close-right" style="color:#fff"><i class="ec-icon-arrow-right"></i></a>' +
    '          </span>' +
    '    </h2>' +
    '</div>' +
    '   <div class="ex-layout-monitor-charts">' +
    '       <div class="ex-layout-monitor-charts-content"></div>' +
    '   </div>' +
    '   <div class="ex-monitor-road-wbox ec-align-right"></div>' +
    '</div>',

    cItem:
    ' <div class="ex-monitor-wbox">' +
    '   <div class="box" data-id="{FeatureId}"> ' +
    '       <i class="icon-tree"></i> ' +
    '       <div class="ex-scroll-title"><p>{FeatureName}</p></div> ' +
    '       <span class="num"><strong>消纳 {Count} 次</strong></span>' +
    '   </div>' +
    '</div>',
    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: '消纳点消纳工地数据统计',

        cUrl: '/AssetStatic/ReportAssetStatic',
        //cTime:'2017/12/28 18:00 至现在',
        cDayHour:5,
        data:{
            rtnData:{
                Tech:[
                    { TypeId:1,TypeName: "消纳点1", Cnt: (Math.floor(Math.random() * 50) + 51), Icon: "Assets" },
                    { TypeId:2,TypeName: "消纳点2", Cnt: (Math.floor(Math.random() * 50) + 1), Icon: "Denoter" },
                ],
                TechGroup:[
                    {Value:[
                        { TypeId:1,AlarmName: "工地1", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "工地2", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "工地3", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "工地4", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "工地5", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "工地6", Cnt: (Math.floor(Math.random() * 20) + 1), Icon: "Traffic" },
                    ],TypeId:1,TypeName:'武汉市',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]},
                    {Value:[
                        { TypeId:1,AlarmName: "工地1", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "工地2", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "工地3", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "工地4", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "工地5", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "工地6", Cnt: (Math.floor(Math.random() * 10) + 1), Icon: "Traffic" },
                    ],TypeId:2,TypeName:'蔡甸区',OnlineRate:[
                        {Name:"违规工地",Value: (Math.floor(Math.random() * 50) + 1),type:1},
                        {Name:"正常工地",Value:(Math.floor(Math.random() * 50) + 1),type:2}
                    ]}
                ],

            }
        }

    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {
        this.nTotal = 0;
        this.setDefaultData();
        this.initChart();
        // 包括资产类型和资产类型数据
        //ES.Util.reqData({url: this.oOption.cUrl, data: {}}, this.initMenuBoxHandler, this);
        //this.initMenuBoxHandler(this.oOption.data);
        var self = this;
        ES.getData({},'/MapView/NormalUnloadStat',function(data){
            self.initMenuBoxHandler(data);
            self.removeAn(self.$_oContainer);
            if(data.length == 0){
                self.noData(self.$_oContainer);
            }else{
                //self.$_oMinitorOpenBtn.click();
            }
        })



    },
    // 初始化类型
    initMenuBoxHandler: function (oData) {
        if (!oData) {
            return;
        }

        this.oBusData = oData;

        for(var i = 0;i< oData.length;i++) {
            oData[i].FeatureId = oData[i].Id;
            oData[i].FeatureName = oData[i].Name;
            // 初始化图表和菜单
            var cLi = ES.template(this.cItem, oData[i]);

            $_oLi = $(cLi);
            $_oLi.data('data', oData[i]);
            this.$_oRoadBox.append($_oLi);

        }
        //this.nTotal = oData[0].Total;
        this.initEvent();
    },

    // 要执行父类方法
    initEvent: function () {

        var self = this;
        this.$_oRoadBox.find('.ex-monitor-wbox').bind('click', function () {
            $(this).find('.box').addClass('ec-active');
            $(this).siblings().find('.box').removeClass('ec-active');

            var dataId = $(this).find('.box').attr('data-id');
            // 添加数据
            var oData = null;

            for (var i = 0; i < self.oBusData.length; i++) {
                if (self.oBusData[i].Id === parseInt(dataId)) {
                    oData = self.oBusData[i];
                    break;
                }
            }
            self.updateChart(oData);


            var latlng = {lat:oData.Lat,lng:oData.Lng};
            var item = $('.unloadMap .ex-layout-struckbox-content').jstree('get_node', -dataId);
            if(!item.state.checked){
                $('.unloadMap .ex-layout-struckbox-content').jstree('check_node', -dataId);
                if($('.unloadMap .ex-layout-struckbox-content').jstree('get_checked').length>1){
                    self._oParent._oMap.setView( latlng,16);
                }
            }else{
                //定位就行
                self._oParent._oMap.setView( latlng,16);
            }


        });

        this.$_oRoadBox.find('.ex-monitor-wbox').eq(0).click();

        if(!this._Interval){
            this._Interval = window.setInterval(function(){
                self.$_oRoadBox.find('.ex-scroll-title>p').toggleClass('ec-active');
            },10000);
        }else{
            window.clearInterval(this._Interval);
            this._Interval = window.setInterval(function(){
                self.$_oRoadBox.find('.ex-scroll-title>p').toggleClass('ec-active');
            },10000);
        }
    }

});

ES.MapView.UnloadMonitor.include({

    // 设置默认值
    setDefaultData: function () {
        this.oDeptStatic = [ ];
        this.aoSer = [];
        this.aoDept=[];
        this.nMaxMile =1;

        //this.nTotal = 0
    },

    // 初始化图表
    initChart: function () {
        var oChart = echarts.init(this.$_oChart.get(0));
        this.oChart = oChart;
        this.getOption();
        oChart.setOption(this.oOpt);
    },


    // 更新chart 图表数据
    updateChart: function (oData) {

        if (!oData) {
            return;
        }

        this.aoDept.splice(0, this.aoDept.length);
        this.aoSer.splice(0, this.aoSer.length);


        for (var i = 0; i < (oData.Sites.length<5?oData.Sites.length:5); i++) {
            this.aoDept.unshift(oData.Sites[i].Name);
        }
        this.aoSer = [];


        var aoTemp = []
        for (var j = 0; j < (oData.Sites.length<5?oData.Sites.length:5); j++) {
            aoTemp.unshift(oData.Sites[j].Count);
            //this.nTotal = this.nTotal + oData.rtnData.Sites[i].Count;
            if (oData.Sites[j].Count > this.nMaxMile) {
                this.nMaxMile = oData.Sites[j].Count;
            }
        }

        var oSer = {
            name: oData.Name,
            type: 'bar',
            stack: 'chart',
            silent: true,
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true
                }
            },
            data: aoTemp
        }

        this.aoSer.push(oSer);


        //var oPie = this.getPieConfig(oData);

        //this.aoSer.push(oPie);

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getPieConfig: function (oData) {
        var aoData =  oData.rtnData.OnlineRate;
        this.oDeptStatic.splice(0, this.oDeptStatic.length);
        var oPie = {
            type: 'pie',
            radius: [0, '30%'],
            center: ['75%', '25%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: this.oDeptStatic
        }

        for(var i=0;i< aoData.length;i++){
            this.oDeptStatic.push({name:aoData[i].Name,value:aoData[i].Value,itemStyle:{normal:{color:aoData[i].type==1?'#f72b2e':'#2bb743'}}});
        };

        return oPie;
    },


    // 设置图表参数
    getOption: function () {
        // 指定图表的配置项和数据
        var oOpt = {
            title: [{
                text: '消纳点工地消纳排名前5',
                //subtext: '总计 '+ this.nTotal +' 个工地',
                x: '50%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 15
                }
            },
                //     {
                //     text: '违规率',
                //
                //     x: '75%',
                //     textAlign: 'center',
                //     textStyle: {
                //         fontSize: 14
                //     }
                // }
            ],
            tooltip :{
                formatter: "{b} : {c} ({d}%)"
            },
            grid: [{
                top: 50,
                width: '90%',
                bottom: '0',
                left: 10,
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                max: this.nMaxMile * 1.5,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                },

            }],
            yAxis: [{
                type: 'category',
                data: this.aoDept,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: true,
                    formatter: function (value) {
                        if(value.length>7){
                            var _t = parseInt(value.length/7)+1;
                            var content="";
                            for(var i =0;i<_t;i++){
                                content += value.substr(i*7,7)+'\n';
                            }
                            return content;

                        }else{
                            return value;
                        }
                    },
                    rich: {
                        value: {
                            verticalAlign:'middle',
                            align: 'center',
                            width:90,
                        }
                    }

                }
            }],
            series: this.aoSer
        };

        this.oOpt = oOpt;
    },


});

/**
 * Created by liulin on 2019/3/28.
 */


ES.MapView.VehicleMonitor = ES.MapView.BaseMonitor.extend({
    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag: '车辆违规数据统计',
        cDayHour:5,
        cUrl: '/AssetStatic/ReportAssetStatic',

        data:{
            rtnData:{
                Tech:[
                    { TypeId:1,TypeName: "武汉市", Cnt: (Math.floor(Math.random() * 200000) + 1), Icon: "Assets" },
                    { TypeId:2,TypeName: "蔡甸区", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Denoter" },
                ],
                TechGroup:[
                    {Value:[
                        { TypeId:1,AlarmName: "未密闭", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "违规行驶", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "超载", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "超速", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "可疑出土", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "可疑消纳", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Traffic" },
                    ],TypeId:1,TypeName:'武汉市',OnlineRate:[
                        {Name:"在线车辆",Value: (Math.floor(Math.random() * 200000) + 1),type:1},
                        {Name:"离线车辆",Value:(Math.floor(Math.random() * 200000) + 1),type:2}
                    ]},
                    {Value:[
                        { TypeId:1,AlarmName: "未密闭", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Assets" },
                        { TypeId:2,AlarmName: "违规行驶", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Denoter" },
                        { TypeId:3,AlarmName: "超载", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Isolated" },
                        { TypeId:4,AlarmName: "超速", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Gantry" },
                        { TypeId:5,AlarmName: "可疑出土", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Guide" },
                        { TypeId:6,AlarmName: "可疑消纳", Cnt: (Math.floor(Math.random() * 20000) + 1), Icon: "Traffic" },
                    ],TypeId:2,TypeName:'蔡甸区',OnlineRate:[
                        {Name:"在线车辆",Value: (Math.floor(Math.random() * 200000) + 1),type:1},
                        {Name:"离线车辆",Value:(Math.floor(Math.random() * 200000) + 1),type:2}
                    ]}
                ],

            }
        }

    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {
        this.nTotal = 0;
        this.setDefaultData();
        this.initChart();
        // 包括资产类型和资产类型数据
        //ES.Util.reqData({url: this.oOption.cUrl, data: {}}, this.initMenuBoxHandler, this);


        var self = this;
        ES.getData({},'/MapView/AlarmStat',function(data){
            if(data){
                self.initMenuBoxHandler(data);
                self.removeAn(self.$_oContainer);
                if(data.length == 0){
                    self.noData(self.$_oContainer);
                }else{
                    //self.$_oMinitorOpenBtn.click();
                }
            }
        })

    },
    // 初始化类型
    initMenuBoxHandler: function (oData) {
        if (!oData) {
            return;
        }

        this.oBusData = oData;

        for(var i = 0;i< oData.length;i++) {
            oData[i].FeatureId = oData[i].Id;
            oData[i].FeatureName = oData[i].Name;
            // 初始化图表和菜单
            var cLi = ES.template(this.cItem, oData[i]);

            $_oLi = $(cLi);
            $_oLi.data('data', oData[i]);
            this.$_oRoadBox.append($_oLi);

        }
        this.nTotal = oData[0].Total;
        this.initEvent();
    },

    // 要执行父类方法
    initEvent: function () {

        var self = this;
        this.$_oRoadBox.find('.ex-monitor-wbox').bind('click', function () {
            $(this).find('.box').addClass('ec-active');
            $(this).siblings().find('.box').removeClass('ec-active');

            var dataId = $(this).find('.box').attr('data-id');
            // 添加数据
            var oData = null;

            for (var i = 0; i < self.oBusData.length; i++) {
                if (self.oBusData[i].Id === parseInt(dataId)) {
                    oData = self.oBusData[i];
                    break;
                }
            }
            self.updateChart(oData);

        });

        this.$_oRoadBox.find('.ex-monitor-wbox').eq(0).click();
    }

});

ES.MapView.VehicleMonitor.include({

    // 设置默认值
    setDefaultData: function () {
        this.oDeptStatic = [ ];
        this.aoSer = [];
        this.aoDept=[];
        this.nMaxMile =1;

        //this.nTotal = 0
    },

    // 初始化图表
    initChart: function () {
        var oChart = echarts.init(this.$_oChart.get(0));
        this.oChart = oChart;
        this.getOption();
        oChart.setOption(this.oOpt);
    },


    // 更新chart 图表数据
    updateChart: function (oData) {

        if (!oData) {
            return;
        }

        this.aoDept.splice(0, this.aoDept.length);
        this.aoSer.splice(0, this.aoSer.length);


        // for (var i = 0; i < oData.length; i++) {
        //     this.aoDept.unshift(oData[i].AlarmName);
        // }
        this.aoDept = ['可疑消纳','可疑出土','超载','超速','未密闭']
        this.aoSer = [];


        var aoTemp = [oData.Unload,oData.Unearth,oData.Overload,oData.Overspeed,oData.Noclosed]
        for (var i = 0; i < aoTemp.length; i++) {
            //this.nTotal = this.nTotal + oData.rtnData.Value[i].Cnt;
            if (aoTemp[i] > this.nMaxMile) {
                this.nMaxMile = aoTemp[i] ;
            }
        }

        var oSer = {
            name: oData.Name,
            type: 'bar',
            stack: 'chart',
            silent: true,
            z: 3,
            label: {
                normal: {
                    position: 'right',
                    show: true,
                    formatter:'{c}辆'
                }
            },
            data: aoTemp
        }

        this.aoSer.push(oSer);


        var oPie = this.getPieConfig(oData);

        this.aoSer.push(oPie);

        this.getOption();
        // 刷新图表
        this.oChart.setOption(this.oOpt, true);
    },

    getPieConfig: function (oData) {
        var aoData =  oData;
        this.oDeptStatic.splice(0, this.oDeptStatic.length);

        this.oDeptStatic = [
            {name:'在线车辆',value:aoData.Online,itemStyle:{normal:{color:'#17c97b'}}},
            {name:'离线车辆',value:(parseInt(aoData.Total) - parseInt(aoData.Online)),itemStyle:{normal:{color:'#d0d4df'}}}
        ];

        var oPie = {
            type: 'pie',
            radius: [0, '30%'],
            center: ['75%', '25%'],
            label: {
                normal: {
                    show: false
                }
            },
            data: this.oDeptStatic
        };


        return oPie;
    },


    // 设置图表参数
    getOption: function () {
        // 指定图表的配置项和数据
        var oOpt = {
            tooltip : {
                //trigger: 'axis',
                //axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                //    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                //}
            },
            title: [{
                text: '违规类型统计',
                //subtext: '总计 '+ this.nTotal +' 辆车',
                x: '25%',
                y:'5%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 14
                }
            }, {
                text: '实时在线率(5分钟前)',

                x: '72%',
                y: '5%',
                textAlign: 'center',
                textStyle: {
                    fontSize: 14
                }
            }],
            tooltip :{
                formatter: "{b} : {c} ({d}%)"
            },
            grid: [{
                top: 50,
                width: '70%',
                bottom: '0',
                left: 10,
                containLabel: true
            }],
            xAxis: [{
                type: 'value',
                max: this.nMaxMile * 2.5,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    show: false,
                },

            }],
            yAxis: [{
                type: 'category',
                data: this.aoDept,
                axisLabel: {
                    show: true,
                },
                splitLine: {
                    show: false
                }
            }],
            series: this.aoSer
        };

        this.oOpt = oOpt;
    },


});

/**
 * Created by liulin on 2019/3/28.
 */

ES.MapView.JobStatusMonitor = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-monitor-wbox'],
        // 用来区分当前实体
        cFlag:'作业状况',

        cUrl:'/Department/DepartmentList',

    },

    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this.oPenStyle = this.oOption.oPenStyle;
        // 获得地图控件
        this._oParent = oParent;
        // 初始化界面
        this.initUI();

        this.initBtn();

        this.setParentEvent();

        this.initMenuBox();
    },


    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);

    },


    initUI: function () {

        this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));
        this.TimeFormat(0);
        this.$_oContainer = $(ES.template(this.cHTML, this.oOption));
        this.$_oPContainer.html(this.$_oContainer);

        this.loadAn(this.$_oContainer);

        // 用于查询
        this.$_oRoadBox = this.$_oContainer.find('.ex-monitor-road-wbox');
    },
    TimeFormat:function(type){
        if(type == 0){
            var _h = ("0"+this.oOption.cDayHour).slice(-2);
        }else{
            var _h = ("0"+this.oOption.cNightHour).slice(-2);
        }
        var newDate = new Date();
        var _y = newDate.getFullYear();
        var _M = ("0"+(newDate.getMonth()+1)).slice(-2);
        var _d = ("0"+newDate.getDate()).slice(-2);

        this.oOption.cTime= _y+' / '+_M+' / '+_d+' '+_h+':00 至现在';
    },
    initBtn: function () {
        var nWidth = -(this.$_oPContainer.width() - 6);

        this.$_oMinitorOpenBtn = this.$_oContainer.find('a.ex-btn-close-right');
        this.$_oMinitorCloseBtnvar = this.$_oContainer.find('a.ex-btn-close-left');

        this.$_oMinitorCloseBtnvar.hide();
        this.$_oMinitorOpenBtn.show();
        //this.$_oPContainer.stop().animate({ "left": '1rem' }, 800);
        this.$_oPContainer.css({ "left": nWidth + 32 });
        //this.$_oList = this.$_oContainer.find('.ex-layout-monitor-wbox-content');


        var self =this;
        this.$_oMinitorCloseBtnvar.bind('click', function () {
            self.$_oMinitorOpenBtn.show();
            $(this).hide();
            self.$_oPContainer.stop().animate({ "left": nWidth + 32 }, 800);
        });

        this.$_oMinitorOpenBtn.bind('click', function () {
            self.$_oMinitorCloseBtnvar.show();
            $(this).hide()
            self.$_oPContainer.stop().animate({ "left": "1rem" }, 800);
        });
    },



    show: function () {
        this.$_oContainer.show();
    },

    hide: function () {
        this.$_oContainer.hide();
    },

    // 加载 类型 // 如资产类型
    initMenuBox: function () {
        // 包括资产类型和资产类型数据
        this.removeAn(this.$_oContainer);
        $("#jobStatusGrid").jqGridExt({
            url: '/Department/DepartmentList',
            width:'100%',
            height:'100%',
            autowidth:true,
            mtype: "POST",
            colModel: [
                {name : 'ResourceTypeId',index : 'ResourceTypeId',width : '70', align: "center"},
                {label: '区域名称', name: 'Name', align: "center", sortable: false},
                {label: '作业线路总数', name: 'Name', align: "center", sortable: false,
                     formatter: function (cellValue, options, rowObject) {
                        var content = rowObject.Name + ' 条 ' ;
                        return content;
                    }
                },
            ],
            viewrecords : true,
            altRows : true,
            multiselect : true,//是否允许多选
            multiboxonly:true,//复选框
            loadComplete : function() {
                console.log('加载完成')
            },
            onSelectRow: function(rowid,status){
                console.log(rowid)
                console.log(status)


            },
            onSelectAll: function(aRowids,status){
                console.log(aRowids)
                console.log(status)
            }
        }).data("jqGridExt");;

    },

    // 初始化类型
    initMenuBoxHandler:function(oData) {
         this.removeAn(this.$_oContainer);
        $("#gridWorkDetial1").jqGridExt({
            data : oData,
            datatype : "local",
            width: 600,
            height: 320,
            colModel : [
                {label: '区域名称', name: 'Name', align: "center", sortable: false},
            ] ,
            viewrecords : true,
            altRows : true,
            multiselect : true,//是否允许多选
            multiboxonly:true,//复选框
            loadComplete : function() {
                //数据加载完后执行的方法
            },
            onSelectRow: function(){
                var self = this;
                var urlStr = '/MapView/QueryVehicleByCloupMapType?CloudType=16&AlarmRuleType=7'
                if(this.anDeptId.length>0){
                    for(var i=0;i<this.anDeptId.length;i++){
                        urlStr+= "&id="+Math.abs(this.anDeptId[i])
                    }
                }
                $.ajax({
                    url:urlStr,
                    type:'get',
                    dataType:'json',
                    success:function (res) {
                    }
                })

            },

            onSelectAll: function(){
                console.log(222)
            }
        });


    },

    loadAn: function (cTag, cFlag) {
        //加载进度条
        var loadMaskHtml = '<div class="ex-layout-loading monitor"><div class="spinner"></div></div>';
        var oDiv = $(loadMaskHtml);
        if (typeof cTag === 'object') {
            cTag.append(oDiv);
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }

        $(cFlag + cTag).append(oDiv);
    },
    removeAn: function (cTag, cFlag) {
        if (typeof cTag === 'object') {
            cTag.find('.ex-layout-loading').remove();
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }
        $(cFlag + cTag).find('.ex-layout-loading').remove();
    },
    noData: function (cTag, cFlag) {
        //加载进度条
        var loadMaskHtml = '<div class="ex-layout-loading noData"></div>';
        var oDiv = $(loadMaskHtml);
        if (typeof cTag === 'object') {
            cTag.append(oDiv);
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }
        $(cFlag + cTag).append(oDiv);
    },
    removeNoData: function (cTag, cFlag) {
        if (typeof cTag === 'object') {
            cTag.find('.ex-layout-loading.noData').remove();
            return;
        }

        if (!cFlag) {
            cFlag = '.';
        }
        $(cFlag + cTag).find('.ex-layout-loading.noData').remove();

    },

});


ES.MapView.JobStatusMonitor.include({

    cHTML:
        '<div class="ex-layout-monitor-wbox-content ec-align-left">' +
        '<div class="ex-title">' +
        '     <h2>' +
        '        <span>{cFlag}</span>' +
        '        <span class="ec-align-right ec-margin-left">' +
        '              <a href="javascript:void(0);" class="ex-btn-close-left" style="color:#fff;display:none"><i class="ec-icon-arrow-left"></i></a>' +
        '              <a href="javascript:void(0);" class="ex-btn-close-right" style="color:#fff"><i class="ec-icon-arrow-right"></i></a>' +
        '          </span>' +
        '    </h2>' +
        '</div>' +
        '<div class="ex-layout-monitor-charts" style="width:98%;height: 95%">' +
        '<div class="ex-layout-monitor-charts-content" style="width:100%;height: 100%">' +
                '<table id="jobStatusGrid" style="width: 100%;height: 100%;overflow-y: auto"></table>'+
        '</div>'+
        '   </div>' +
        '   <div class="ex-monitor-road-wbox ec-align-right"></div>' +
        '</div>',

    cItem:
        ' <div class="ex-monitor-wbox">' +
        '   <div class="box" data-id="{FeatureId}"> ' +
        '       <i class="icon-tree"></i>  {FeatureName}' +
        //'       <span class="num"><strong>{Total}</strong></span>' +
        '   </div>' +
        '</div>'
});

/**
 * 图例
 * Created by liulin on 2019/3/28.
 */



ES.MapView.TypeExample = ES.Evented.extend({
    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-type-wbox'],
        // 用来区分当前实体
        cFlag:'地图图例',

        cUrl:'/MapView/GetSubDeptByTotal',

    },

    // 构造函数
    initialize: function (oParent, options) {
        ES.setOptions(this, options);
        this.oPenStyle = this.oOption.oPenStyle;
        // 获得地图控件
        this._oParent = oParent;

        // 初始化界面
        this.initUI();

        // 初始化事件
        this.initOn();


        //this.initMenuBox();

        this.initBtn();

        // 设置父级容器的事件，是为了屏蔽地图的操作
        this.setParentEvent();
    },
    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oPContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);

    },


    initUI: function () {

        this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));
        this.$_oContainer = $(ES.template(this.cHTML, this.oOption));
        this.$_oPContainer.html(this.$_oContainer);


        // 用于查询
        // this.$_oRoadBox = this.$_oContainer.find('.ex-monitor-road-wbox');
        // this.$_oChart = this.$_oContainer.find('.ex-layout-monitor-charts-content');
    },
    initOn:function(){

    },
    initBtn: function () {
        this.$_oMinitorOpenBtn = this.$_oContainer.find('a.ex-btn-close-left');
        this.$_oMinitorCloseBtnvar = this.$_oContainer.find('a.ex-btn-close-right');

        this.$_oMinitorCloseBtnvar.show();
        this.$_oMinitorOpenBtn.hide();
        this.$_oPContainer.stop().animate({ "right": '1rem' }, 800);
        //this.$_oList = this.$_oContainer.find('.ex-layout-monitor-wbox-content');

        var nWidth = -(this.$_oPContainer.width() - 6);
        var self =this;
        this.$_oMinitorCloseBtnvar.bind('click', function () {
            self.$_oMinitorOpenBtn.show();
            $(this).hide();
            self.$_oPContainer.stop().animate({ "right": nWidth + 44 }, 800);
        });

        this.$_oMinitorOpenBtn.bind('click', function () {
            self.$_oMinitorCloseBtnvar.show();
            $(this).hide()
            self.$_oPContainer.stop().animate({ "right": "1rem" }, 800);
        });
    },


});

ES.MapView.TypeExample.include({
    cHTML:
        '<div class="ex-maptool-type">'+
        '   <h3 style="padding-left: 15px;">{cFlag}'+
        '       <span class="ec-align-left ec-margin-right">'+
        '           <a href="javascript:void(0);" class="ex-btn-close-left" style="color:#fff;display:none;"><i class="ec-icon-arrow-left"></i></a>'+
        '           <a href="javascript:void(0);" class="ex-btn-close-right" style="color:#fff;"><i class="ec-icon-arrow-right"></i></a>'+
        '       </span>'+
        '   </h3>'+
        '<ul class="ec-list ex-maptool-icon-type ex-maptool-item-type">' +
        '   <li class="ec-form-group show" data-type="truck-state"><label class="ec-checkbox-inline ec-success"><em class="ex-maptool-icon sanitation green"></em>  作业车辆(在线) </label> </li>' +
        '   <li class="ec-form-group show" data-type="truck-state"><label class="ec-checkbox-inline ec-success"><em class="ex-maptool-icon sanitation gray"></em>  作业车辆(离线) </label> </li>' +
        '   <li class="ec-form-group show" data-type="truck-state"><label class="ec-checkbox-inline ec-success"><em class="ex-maptool-icon truck green"></em>  渣土车(在线) </label> </li>' +
        '   <li class="ec-form-group show" data-type="truck-state"><label class="ec-checkbox-inline ec-success"><em class="ex-maptool-icon truck yellow"></em>  渣土车(离线) </label> </li>' +
        '   <li class="ec-form-group show" data-type="truck-state"><hr /></li>' +
        '   <li class="ec-form-group show" data-type="truck-state"><label class="ec-checkbox-inline ec-success"><em class="ex-maptool-icon user green"></em>  在线人员 </label> </li>' +
        '   <li class="ec-form-group show" data-type="truck-state"><label class="ec-checkbox-inline ec-success"><em class="ex-maptool-icon user gray"></em>  离线人员 </label> </li>' +
        '   <li class="ec-form-group show" data-type="suspicUnload"><hr /></li>' +
        '</ul>' +
        '</div>'

});

ES.MapView.FenceLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {
        onEvenSetData: 'MV:Site.setSiteData',
        onEvenSetStatusData: 'MV:Site.setStatusData',
        onEvenClearSites: 'MV:Site.clearSites',

        cHtml: '<div class="{cCls}"><div class="{cBCls}"></div><div class="{cTCls}">{Name}</div></div>'
    },

    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
        // 执行自己的方法
        this._initGroup();
        this._loadOn();
    },

    // 初始化Group
    _initGroup: function () {

        //把所有的圆点区域绘制在分组图层中
        this._oSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oSiteGroup);

        this._oPolygonSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oPolygonSiteGroup);

        this.aoSiteInfo = null;
    },

    //初始化时加载数据
    _loadOn: function () {

        //this._oParent.fire('MV:Site.setSiteData', { aoSiteInfo: oData });
        //给界面赋值，并画工地
        this._oParent.on(this.oOption.onEvenSetData, this.setSiteData, this);

        // 通过id获得工地数据
        this._oParent.on("fenceTree:layer", this.getSiteId, this);

        this._oParent.on("unfenceTree:layer", this.getUncheckSiteId, this);

        // 设置工地状态
        this._oParent.on(this.oOption.onEvenSetStatusData, this.setStatusData, this);

        //监听地图放大缩小时间
        this._oMap.on("zoomend", this.drawSites, this);

        // 清除工地
        this._oParent.on(this.oOption.onEvenClearSites, this.clearSites, this);

        this._oParent.on('SiteLayer:clearAll', this.clearAll, this);
    },

    getUncheckSiteId: function (oData) {
        var anId = [];
        for (var i = 0; i < oData.acUncheckId.length; i++) {
            if (oData.acUncheckId[i].indexOf('_') !== 0) {
                continue;
            }
            anId.push(parseInt( oData.acUncheckId[i].replace('_', '')));
        }
        this.clearSites({anId:anId});
    },
    treeNodeClick(e, i){
        let self = this
        let sV = true
        let treeValue = {}
        if(!e.data.selected) {
            sV = false
        }
        let cIds = []
        if(i.data.type == 'cloudMap'){
            cIds.push(i.id)
        } else {
            if (i.children){
                cIds = Util.getTreeNodesByName(i.children, cIds, 'cloudMap')
            }
        }
        if(cIds.length <= 0){
            i.selected = false
            if(i.children){
                this.unSelectChildren(i.children)
            }
            self.$Notice.error({
                title: '错误提示！',
                desc: '无云图类型！请重新选择',
                duration: 5
            })
            return
        }
        treeValue = {
            searchModel: {ids: cIds},
            menuId: 1884
        }
        Util.ojax.post(PostDataUrl + '/1884', treeValue).then(function (response) {
            if (response.data.code == 1) {
                self.initTagList(response.data.detail.list, sV)
            }else{
                self.$Notice.error({
                    title: '错误提示！',
                    desc: response.data.msg,
                    duration: 5
                })
            }
        }).catch(function (error) {
            console.log(error)
        })
    },
    getSiteId: function (oData) {
        var acSiteId = oData.acId;

        ES.getData({anId: acSiteId}, '/Site/GetSiteByIds', function (oData) {
            this.setSiteData({aoSiteInfo: oData});
        }, this);

        // var aoSiteInfo = oData.acData;
        // for(var i = 0;i<aoSiteInfo.length;i++){
        //     aoSiteInfo[i].Points =[];
        //     var lats = aoSiteInfo[i].MapY.split(",");
        //     var lngs = aoSiteInfo[i].MapX.split(",");
        //     for(var j=0;j<lats.length;j++){
        //         aoSiteInfo[i].Points.push({lat:lats[j],lng:lngs[j]});
        //     }
        // }
        // this.setSiteData({aoSiteInfo: aoSiteInfo});
    },

    clearAll: function () {
        if (this.aoSiteInfo && this.aoSiteInfo.length > 0) {

            this.aoSiteInfo.splice(0, this.aoSiteInfo.length);
        }

        // 清空数据
        this._oSiteGroup.clearLayers();
        this._oPolygonSiteGroup.clearLayers();
    },

    // 保存节点状态数据
    setStatusData: function (oData) {
        this.aoStatusData = oData.aoStatusData;
    },

    //设置数据时才进行操作
    setSiteData: function (oData) {
        // 把数据保存到界面上
        this.addSiteData(oData)
        // 画当前工地
        this.drawSites(oData);
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawSites: function (oData) {

        var aoSiteInfo = this.aoSiteInfo;
        if (!aoSiteInfo) {
            return;
        }

        //获得当前图层层级，如果是1-5层
        var nZoom = this._oMap.getZoom();

        for (var i = 0; i < aoSiteInfo.length; i++) {
            if (!aoSiteInfo[i].Points || aoSiteInfo[i].Points.length <= 0) {
                continue;
            }
            if (nZoom <= 4) {
                this._oSiteGroup.clearLayers();
                this._oPolygonSiteGroup.clearLayers();
            }
            else if (nZoom > 4 && nZoom <= 13) {
                this._oPolygonSiteGroup.clearLayers();
                this._drawSiteMarker(aoSiteInfo[i]);
            }
            else {
                this._oSiteGroup.clearLayers();
                this._drawPolygonSite(aoSiteInfo[i]);
            }
        }



        if (oData.aoSiteInfo && oData.aoSiteInfo.length === 1) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup,oData.aoSiteInfo[0].Id);
            if(oLayer){

                this._oMap.fitBounds(oLayer.getLatLngs());
            }

            oLayer = this.findLayer(this._oSiteGroup,oData.aoSiteInfo[0].Id);
            if(oLayer){
                var oLatLng = oLayer.getLatLng();
                this.flyTo({oGpsInfo: {Lat: oLatLng.lat, Lon: oLatLng.lng}}, {zoom: 14});

            }
        }
    },

    // 画单个点
    _drawSiteMarker: function (oPosInfo) {

        if (!this._oSiteGroup || !oPosInfo) return;

        var oLayer = this.findLayer(this._oSiteGroup, oPosInfo.Id);
        if (oLayer) {
            return oLayer;
        }


        var oBound = new L.LatLngBounds(oPosInfo.Points);
        var oLatLng = oBound.getCenter()
        if (oPosInfo.FenceType == 2) {
            oLatLng = oPosInfo.Points[0];
        }


        var oIcon = this._getIcon(this._getIconHtml(oPosInfo));

        var oMarker = L.marker(oLatLng, { icon: oIcon });

        oMarker.cId = oPosInfo.Id;
        oMarker.oPosInfo = oPosInfo;

        oMarker.addTo(this._oSiteGroup);

        this.initEventForMarker(oMarker);

        return oMarker;
    },


    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        if (!oMarker) {
            return;
        }

        oMarker.on('click', function () {
            // var oPop = new ES.MapView.PopSiteInfo(this, oMarker.oPosInfo);
            // oPop.showModal();
        }, this);

    },

    // 画多边形
    _drawPolygonSite: function (oPosInfo) {
        if (!this._oPolygonSiteGroup || !oPosInfo) {
            return;
        }
        var oTemp = this.findLayer(this._oPolygonSiteGroup, oPosInfo.Id);
        if (oTemp) {
            return;
        }

        var oPolygon = null;


        // 中心点
        var oLatLng = null;
        if (oPosInfo.FenceType === 2) {
            var nZoom = this.oMap.getZoom();
            var oBPos = this.oMap.options.crs.latLngToPoint(L.latLng(oPosInfo.Points[0]), nZoom);
            var oEPos = this.oMap.options.crs.latLngToPoint(L.latLng(oPosInfo.Points[1]), nZoom);
            oPolygon = L.circle(oPosInfo.Points[0], oBPos.distanceTo(oEPos), oInfo.oOption).addTo(this._oPolygonSiteGroup);

            oLatLng = oPosInfo.Points[0];
        }
        else {
            oPolygon = L.polygon(oPosInfo.Points,  ES.MapView.oConfig.oSiteConfig).addTo(this._oPolygonSiteGroup);
            var oBound = new L.LatLngBounds(oPosInfo.Points);
            oLatLng = oBound.getCenter();

            oPolygon.cId = oPosInfo.Id;
        }

        oPolygon.bindTooltip(oPosInfo.Name).openTooltip();
        oPolygon.oPosInfo = oPosInfo;
        this.initEventForMarker(oPolygon);
        return oPolygon;
    },

    // 工地数据
    _getIconHtml: function (oPosInfo) {
        oPosInfo.cCls = 'ex-monitor-mapicon-site now';
        oPosInfo.cBCls = 'site-body'
        oPosInfo.cTCls = 'site-title';
        // 核准工地
        // if(oPosInfo.SiteType ===1){
        //
        //     oPosInfo.cCls = 'ex-monitor-mapicon-site green';
        //     if(oPosInfo.ApprovalType ===1)
        //     {
        //         oPosInfo.cCls = 'ex-monitor-mapicon-site green-unearthed';
        //     }
        //
        //     oPosInfo.cBCls = 'site-body'
        //
        //     oPosInfo.cTCls = 'site-title green';
        // }
        // else if(oPosInfo.SiteType ===2){
        //     // 临时工地
        //     oPosInfo.cCls = 'ex-monitor-mapicon-site  yellow ';
        //     oPosInfo.cBCls = 'site-body'
        //     oPosInfo.cTCls = 'site-title green';
        // }
        // else if(oPosInfo.SiteType ===3){
        //     // 违规工地
        //     oPosInfo.cCls = 'ex-monitor-mapicon-site  red';
        //     oPosInfo.cBCls = 'site-body'
        //     oPosInfo.cTCls = 'site-title green';
        // }
        // //  核准工地 没有开工
        // else if(oPosInfo.SiteType ===4){
        //     // 核准未开工工地
        //     oPosInfo.cCls = 'ex-monitor-mapicon-site  gray';
        //     oPosInfo.cBCls = 'site-body'
        //     oPosInfo.cTCls = 'site-title green';
        // }

        if(oPosInfo.icon ==="SiteNow"){
            /* 上报正常出土工地 */
            oPosInfo.cCls = 'ex-monitor-mapicon-site now';
        }else if(oPosInfo.icon ==="SiteAdvance"){
            /* 上报提前出土工地 */
            oPosInfo.cCls = 'ex-monitor-mapicon-site temp-site';
        }else if(oPosInfo.icon ==="SiteNull"){
            /* 上报未出土工地 */
            oPosInfo.cCls = 'ex-monitor-mapicon-site no-report';
        }else if(oPosInfo.icon ==="UnSiteNow"){
            /* 未上报出土工地 */
            oPosInfo.cCls = 'ex-monitor-mapicon-site alert';
        }


        var cHtml = ES.Util.template(this.cHtml, oPosInfo);

        return cHtml;
    },

    // 画点
    _getIcon: function (cHtml) {

        var oIcon = L.divIcon({
            iconSize: [20, 20], iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: "",
            html: cHtml,
        });
        return oIcon;
    },

    // 获得弹出层的内容
    _getPopHtml: function (oPosInfo) {

        return '';
    },

    // 清空界面所有的工地数据
    clearSites: function (oData) {
        //this.oInfo = null;
        this.clearPolygonSite(oData);
        this.clearMarkerSite(oData);
        this.deleteSite(oData);
    },

    // 删除对象
    deleteSite: function (oData) {
        if (!this.aoSiteInfo || !oData || !oData.anId || oData.anId.length <= 0) return;
        var aoSiteInfo = this.aoSiteInfo
        var anId = oData.anId;
        for (var i = aoSiteInfo.length - 1; i >= 0; i--) {

            var aoTemp = $.grep(anId, function (k, nIndex) {
                if (aoSiteInfo[i].Id === parseInt(k)) {
                    return true;
                }
            })
            if (!aoTemp || aoTemp.length <= 0) continue;

            aoSiteInfo.splice(i, 1);
        }
    },

    addSiteData: function (oData) {
        //测试结果
        if (!this.aoSiteInfo) {
            this.aoSiteInfo = oData.aoSiteInfo;
            return;
        }

        $.merge(this.aoSiteInfo, oData.aoSiteInfo);

    },

    clearPolygonSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolygonSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolygonSiteGroup.removeLayer(oLayer);
        };


    },

    clearMarkerSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oSiteGroup.removeLayer(oLayer);
        };


    },

    // 删除所有的数据
    clearAllPolygonSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolygonSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolygonSiteGroup.removeLayer(oLayer);
        }
    },

});

ES.MapView.FenceLayer.include({
    cHtml:
    '<div class="ex-monitor-mapicon-grid">' +
    '   <div class="pin-tip" style="display: none;">' +
    '       <div class="pin-dome"><b></b><c></c><d></d></div>' +
    '       <div class="pin-number">{Name}</div>' +
    '   </div>' +
    '   <div class="site-body">' +
    '   </div>' +
    '</div>',
});

ES.MapView.LineLayer = L.MapLib.MapMaster.MapOpr.extend({
    //执行画点，画线操作
    oOption: {
        onEventDrawLayers: 'MapView:ShowLayer.DrawLayers',
        onEventClearLayers: 'MapView:ShowLayer.clearLayer',
        onEventRemoveLayers: 'MapView:ShowLayer.removeLayers',
        oStyleConfig: {
            stroke: true,
            color: 'green',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 5,
            opacity: 1,
            fill: false,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false
        },
        cHtml: '<div class="{cCls}"><div class="{cBCls}"></div><div class="{cTCls}">{Name}</div></div>'
    },
    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
        // 执行自己的方法
        this._initGroup();
        this._loadOn();
    },
    // 初始化Group
    _initGroup: function () {
        this._oPolylineGroup = L.featureGroup();
        this._oMap.addLayer(this._oPolylineGroup);
    },
    //初始化时加载数据
    _loadOn: function () {
        // 画所有的工地数据
        this._oParent.on(this.oOption.onEventDrawLayers, this.drawLayers, this);
        this._oParent.on(this.oOption.onEventClearLayers, this.clearLayer, this);
        this._oParent.on(this.oOption.onEventRemoveLayers, this.removeLayers, this);
    },
    removeLayers: function (oData) {
        if (!this._oPolylineGroup || !oData || oData.acId.length <= 0) {
            return;
        }
        var aoInfo = oData.acId;
        for (var i = 0; i < aoInfo.length; i++) {
            var nId = - parseInt(aoInfo[i]);
            var oLayer = this.findLayer(this._oPolylineGroup, nId);
            if (!oLayer) {
                continue;
            }

            this._oPolylineGroup.removeLayer(oLayer);
        }
    },
    clearLayer: function () {
        this._oPolylineGroup.clearLayers();
    },
    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function(oData) {
        if (!oData || !oData.aoData) {
            return;
        }
        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {
            var oLayer = this.findLayer(this._oPolylineGroup, oData.aoData[i].id);
            if (oLayer) {
                continue;
            }
            this.drawLayer(oData.aoData[i]);
            $.merge(aoLatLnt, oData.aoData[i].lstLatLnt);
        }
        if (aoLatLnt && aoLatLnt.length > 0) {
            this._oMap.fitBounds(aoLatLnt);
        }
    },
    drawLayer: function (oData) {
        if (!oData) {
            return ;
        }
        // 编辑邮路,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oData);
        if (!oVehLine) {
            return;
        }
        oVehLine.cId = oData.id;
        oVehLine.cName  = oData.name;
    },
    // 设置图层设置
    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData) {
            return oVehLine;
        }
        var aoLatLng = [];
        for (var i = oData.lstLatLnt.length - 1; i >= 0; i--) {

            aoLatLng.push(oData.lstLatLnt[i]);
        }
        oVehLine = L.polyline(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);
        oVehLine.setText(oData.MaintainName + ':' + oData.name + '        ', {
            repeat: true,
            offset: 20,
            attributes: {'font-size': '16', fill: 'red'}
        });
        return oVehLine;
    },
});

ES.MapView.RectLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {
        onEvenSetData: 'MV:Rect.setSiteData',
        onEvenSetStatusData: 'MV:Rect.setStatusData',
        onEvenClearSites: 'MV:Rect.clearSites',

        cHtml: '<div class="{cCls}"><div class="{cBCls}"></div><div class="{cTCls}">{Name}</div></div>',
        oRectConfig: {
            stroke: true,
            color: '#6a7ac3',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 3,
            opacity: 1,
            fill: true,
            fillColor: "#6a7ac3",
            fillOpacity: 0.2,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false
        },
        oVehLineConfig:{
            stroke: true,
            color: '#00bd01',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 5,
            opacity: 1,
        }
    },

    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
        // 执行自己的方法
        this._initGroup();
        this._loadOn();
        this.initPen();
        this.initOn();

        this._oParam = null;
    },
    initPen: function () {
        this.oDrawPen = {
            enabled: {shapeOptions: this.oOption.oRectConfig},
            handler: new L.Draw.Rectangle(this._oMap, {shapeOptions: this.oOption.oRectConfig}),
            title: L.drawLocal.draw.toolbar.buttons.rectangle
        };
    },
    initOn:function(){
        var self = this;
        self._oMap.on('draw:created', this.createdCallBack, this)
    },
    createdCallBack:function(e){
        var oLayer = e.layer;

        this._oRectGroup.addLayer(oLayer);

        //var aoLatLng = oLayer.getLatLngs();

        // var _aoLatLng = aoLatLng[0].map(function (oItem) {
        //
        //     return {lat: oItem.lat, lng: oItem.lng}
        // });
        var oB = oLayer.getBounds()

        this._oParam = {
            LeftPoint: { Lon: oB.getWest(), Lat: oB.getNorth() },
            RightPoint: { Lon: oB.getEast(), Lat: oB.getSouth()}
        };

        this._oParent.fire('RectSearch:setLayerGps',{oParam:this._oParam})

    },
    // 初始化Group
    _initGroup: function () {

        //新建拉框图层
        this._oRectGroup = L.layerGroup();
        this._oMap.addLayer(this._oRectGroup);
        //新建车辆轨迹图层
        this._oVehicleLine = L.layerGroup();
        this._oMap.addLayer(this._oVehicleLine);

        this.aoSiteInfo = null;
    },

    //初始化时加载数据
    _loadOn: function () {

        // 通过id获得工地数据
        this._oParent.on("RectView:layer", this.drawRectLayer, this);

        this._oParent.on("unRectView:layer", this.clearRectLayer, this);

        this._oParent.on("VehicleLine:layer", this.drawVehicleLineLayer, this);

        this._oParent.on("unVehicleLine:layer", this.clearVehicleLineLayer, this);
    },

    drawRectLayer:function(oData){
        this.oDrawPen.handler.enable();
    },
    clearRectLayer:function(){
        this._oRectGroup.clearLayers();
    },
    drawVehicleLineLayer:function(oData){

        this.clearVehicleLineLayer();

        var data = oData.oGpsInfo;
        var aoLatLng=[];
        $.each(data,function(i,v){
            aoLatLng.push({lat:v.Lat,lng:v.Lon})
        });

        if(aoLatLng.length === 1 ){

            var oIcon = this._getIcon(0);
            oRectTrack = L.marker(aoLatLng[0],{ icon: oIcon}).addTo(this._oVehicleLine);
        }else{
            var oIconStart = this._getIcon(1);
            var oIconEnd = this._getIcon(2);
            oRectTrack = L.polyline(aoLatLng, this.oOption.oVehLineConfig).addTo(this._oVehicleLine);
            oRectTrack.startMarker = L.marker(aoLatLng[aoLatLng.length-1],{ icon: oIconStart}).addTo(this._oVehicleLine);
            oRectTrack.EndMarker = L.marker(aoLatLng[0],{ icon: oIconEnd}).addTo(this._oVehicleLine);
        }
    },
    clearVehicleLineLayer:function(){
        this._oVehicleLine.clearLayers();
    },

    _getIcon:function(type){
        switch (type){
            case 0:
                var oIcon = L.divIcon({
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-1, -32],
                    className: "parkMarker",
                });
                break;
            case 1:
                var oIcon = L.divIcon({
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-1, -32],
                    className: "beginMarker",
                });
                break;
            case 2:
                var oIcon = L.divIcon({
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [-1, -32],
                    className: 'endMarker',
                });
                break;
        }

        return oIcon;
    }

});

ES.MapView.RectLayer.include({
    cHtml:
    '<div class="{cCls}">' +
    '   <div class="pin-tip" style="display: none;">' +
    '       <div class="pin-dome"><b></b><c></c><d></d></div>' +
    '       <div class="pin-number">{Name}</div>' +
    '   </div>' +
    '   <div class="site-body">' +
    '   </div>' +
    '</div>',

});

ES.MapView.SiteLayer = L.MapLib.MapMaster.MapOpr.extend({
    //执行画点，画线操作
    oOption: {
        onEvenSetData: 'MV:Site.setSiteData',
        onEvenSetStatusData: 'MV:Site.setStatusData',
        onEvenClearSites: 'MV:Site.clearSites',
        onEventSetSingleMarker: 'MV:Marker.setSingleMarker',
        cHtml: '<div class="{cCls}"><div class="{cBCls}"></div><div class="{cTCls}">{Name}</div></div>',
        cHtmlName:
        '<div class="ex-monitor-mapicon-pin  {icon} ">' +
        '   <i></i>' +
        '   <div class="pin-tip">' +
        '       <div class="pin-dome"></div>' +
        '       <div class="pin-number">{name}</div>' +
        '   </div>' +
        '</div>',
        cIcon:'/Asset/img/ex_default/control_big_icon.png'
    },
    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
        // 执行自己的方法
        this._initGroup();
        this._loadOn();
    },
    // 初始化Group
    _initGroup: function () {
        //把所有的圆点区域绘制在分组图层中
        this._oSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oSiteGroup);
        this._oPolygonSiteGroup = L.layerGroup();
        this._oMap.addLayer(this._oPolygonSiteGroup);
        this.aoSiteInfo = null;
    },
    //初始化时加载数据
    _loadOn: function () {
        //this._oParent.fire('MV:Site.setSiteData', { aoSiteInfo: oData });

        //给界面赋值，并画工地
        this._oParent.on(this.oOption.onEvenSetData, this.setSiteData, this);
        // 通过id获得工地数据
        this._oParent.on("siteTree:layer", this.getSiteId, this);
        this._oParent.on("unsiteTree:layer", this.getUncheckSiteId, this);
        // 设置工地状态
        this._oParent.on(this.oOption.onEvenSetStatusData, this.setStatusData, this);
        //监听地图放大缩小时间
        this._oMap.on("zoomend", this.drawSites, this);
        // 清除工地
        this._oParent.on(this.oOption.onEvenClearSites, this.clearSites, this);
        this._oParent.on('SiteLayer:clearAll', this.clearAll, this);

        this._oParent.on(this.oOption.onEventSetSingleMarker, this._drawSiteMarkerV2, this);
    },
    getUncheckSiteId: function (oData) {
        var anId = [];
        for (var i = 0; i < oData.acUncheckId.length; i++) {
            if (oData.acUncheckId[i].indexOf('-') !== 0) {
                continue;
            }
            anId.push(parseInt( oData.acUncheckId[i].replace('-', '')));
        }
        this.clearSites({anId:anId});
    },
    getSiteId: function (oData) {
        // var acSiteId = oData.acId;
        // ES.getData({anId: acSiteId}, '/Site/GetSiteByIds', function (oData) {
        //     this.setSiteData({aoSiteInfo: oData});
        // }, this);
        var aoSiteInfo = oData.acData;
        for(var i = 0;i<aoSiteInfo.length;i++){
            aoSiteInfo[i].Points =[];
            var lats = aoSiteInfo[i].MapY.split(",");
            var lngs = aoSiteInfo[i].MapX.split(",");
            for(var j=0;j<lats.length;j++){
                aoSiteInfo[i].Points.push({lat:lats[j],lng:lngs[j]});
            }
        }
        this.setSiteData({aoSiteInfo: aoSiteInfo});
    },

    clearAll: function () {
        if (this.aoSiteInfo && this.aoSiteInfo.length > 0) {
            this.aoSiteInfo.splice(0, this.aoSiteInfo.length);
        }

        // 清空数据
        this._oSiteGroup.clearLayers();
        this._oPolygonSiteGroup.clearLayers();
    },

    // 保存节点状态数据
    setStatusData: function (oData) {
        this.aoStatusData = oData.aoStatusData;
    },

    //设置数据时才进行操作
    setSiteData: function (oData) {
        // 把数据保存到界面上
        this.addSiteData(oData)
        // 画当前工地
        this.drawSites(oData);
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawSites: function (oData) {

        var aoSiteInfo = this.aoSiteInfo;
        if (!aoSiteInfo) {
            return;
        }

        //获得当前图层层级，如果是1-5层
        var nZoom = this._oMap.getZoom();

        for (var i = 0; i < aoSiteInfo.length; i++) {
            if (!aoSiteInfo[i].Points || aoSiteInfo[i].Points.length <= 0) {
                continue;
            }
            if (nZoom <= 4) {
                this._oSiteGroup.clearLayers();
                this._oPolygonSiteGroup.clearLayers();
            }
            else if (nZoom > 4 && nZoom <= 16) {
                this._oPolygonSiteGroup.clearLayers();
                this._drawSiteMarker(aoSiteInfo[i]);
            }
            else {
                this._oSiteGroup.clearLayers();
                this._drawPolygonSite(aoSiteInfo[i]);
            }
        }
        if (oData.aoSiteInfo && oData.aoSiteInfo.length === 1) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup,oData.aoSiteInfo[0].Id);
            if(oLayer){
                this._oMap.fitBounds(oLayer.getLatLngs());
            }
            oLayer = this.findLayer(this._oSiteGroup,oData.aoSiteInfo[0].Id);
            if(oLayer){
                var oLatLng = oLayer.getLatLng();
                this.flyTo({oGpsInfo: {Lat: oLatLng.lat, Lon: oLatLng.lng}}, {zoom: 16});
            }
        }
    },
    // 画单个点
    _drawSiteMarker: function (oPosInfo) {
        if (!this._oSiteGroup || !oPosInfo) return;
        var oLayer = this.findLayer(this._oSiteGroup, oPosInfo.Id);
        if (oLayer) {
            return oLayer;
        }
        var oBound = new L.LatLngBounds(oPosInfo.Points);
        var oLatLng = oBound.getCenter()
        if (oPosInfo.FenceType == 2) {
            oLatLng = oPosInfo.Points[0];
        }
        var oIcon = this._getIcon(this._getIconHtml(oPosInfo));
        var oMarker = L.marker(oLatLng, { icon: oIcon });
        oMarker.cId = oPosInfo.Id;
        oMarker.oPosInfo = oPosInfo;
        oMarker.addTo(this._oSiteGroup);
        this.initEventForMarker(oMarker);
        // this.initEventForMarkerV2(oMarker);
        return oMarker;
    },

    // 设置弹出层的位置
    oPopOption: { maxWidth: 500 ,autoPan: false},

    //点击树直接弹出车辆信息
    _drawSiteMarkerV2: function (oPosInfo) {
        if (!this._oSiteGroup || !oPosInfo) return;
        var oLatLng = oPosInfo.latLng
        var toHeartModleData = this._oParent.toHeartModleForSingle(oPosInfo)
        var cHtml = this._oParent._getVecMarkerHtml(toHeartModleData)
        this._setHeading(oPosInfo, 180);
        var oIcon = this._getPosIconInfo(oPosInfo);
        var oMarker = L.marker(oLatLng, { icon: oIcon });
        oMarker.cId = oPosInfo.id;
        oMarker.oPosInfo = oPosInfo;
        oMarker.addTo(this._oSiteGroup);
        oMarker.bindPopup(cHtml, this.oPopOption)
        this._oMap.flyTo(oLatLng, 16);
        var oPopup = oMarker.getPopup()
        oPopup.oGpsInfo = oPosInfo;
        this.initPopEventForMarker(oPopup)
        oMarker.openPopup()
    },

    // 给查询出来的车辆直接注册点击事件
    initPopEventForMarker: function (oPopup) {
        var self = this;
        if (!oPopup) return;
        oPopup.self = this;
        oPopup.on("contentupdate", function (){
            // 车辆详情按钮
            var oBtnDetail = $(".leaflet-popup").find("a.ec-icon-truck").parent();
            // 车辆轨迹按钮
            var oBtnTrack = $(".leaflet-popup").find("a.ec-icon-exchange").parent();
            var oMeassageClick = $(".leaflet-popup").find("a.ec-icon-commenting").parent();
            // 下发指令按钮
            var oVehicleOrder = $(".leaflet-popup").find("a.ec-icon-cloud").parent();
            // 查看视频按钮
            var oVehicleVideo = $(".leaflet-popup").find("a.ec-icon-video-camera").parent();
            var oGpsInfo = this.oGpsInfo;
            // 绑定事件
            oBtnDetail.bind("click", function () {
                self._oParent.fire("MapView:VehDetail.showDetail",{oGpsInfo:oGpsInfo});
                // 取消订阅
                self._oParent.fire('HubSvr.unsubGps',{aoGpsInfo:[oGpsInfo]});
                // 移除跟踪列表
                self._oParent.fire("MapView:LiveMange.removeAll");
                // 添加跟踪
                self._oParent.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});

            });
            oBtnTrack.bind("click", function () {
                // 单独的页面打开
                window.open("/mapViewHtml/html/trackview.html?token="+ES.MapView.oConfig.token+"&PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo);

            });
            // 下发指令
            oVehicleOrder.bind('click', function(){
                self._oParent.orderVehicleDialog = new ES.Common.AddType(self._oParent,{bRemove:true},{title: '下发指令',
                    content:'<div class="ex-command-tabs modelType">'+
                    '           <ul class="ex-command-tab ec-avg-sm-3">'+
                    '               <li data-index="1"><i class="ec-icon-btn ec-primary ec-icon-database"></i><span>拍照</span></li>'+
                    '               <li data-index="2"><i class="ec-icon-btn ec-primary ec-icon-life-ring"></i><span>点名</span></li>'+
                    '               <li data-index="3"><i class="ec-icon-btn ec-primary ec-icon-search"></i><span>语音文字</span></li>'+
                    '           </ul>'+
                    '         </div>'});
                self._oParent.orderVehicleDialog.del(oGpsInfo);
            })

            // 查看视频
            oVehicleVideo.bind('click', function(){
                window.open("/mapViewHtml/html/video.html?token="+ES.MapView.oConfig.token+"&PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo + "&cameraNum=" + oGpsInfo.cameraNum);
            })

            // 发送消息
            oMeassageClick.bind("click", function () {
                ES.aWarn('系统正在开发过程！');
            });
        }, oPopup);
    },

    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        if (!oMarker) {
            return;
        }
        oMarker.on('click', function () {
            // 以地图自带的形式更新
            var oPop = new ES.MapView.PopSiteInfo(this, oMarker.oPosInfo);
            oPop.showModal();
        }, this);
    },
    // 画多边形
    _drawPolygonSite: function (oPosInfo) {
        if (!this._oPolygonSiteGroup || !oPosInfo) {
            return;
        }
        var oTemp = this.findLayer(this._oPolygonSiteGroup, oPosInfo.Id);
        if (oTemp) {
            return;
        }
        var oPolygon = null;
        // 中心点
        var oLatLng = null;
        if (oPosInfo.FenceType === 2) {
            var nZoom = this.oMap.getZoom();
            var oBPos = this.oMap.options.crs.latLngToPoint(L.latLng(oPosInfo.Points[0]), nZoom);
            var oEPos = this.oMap.options.crs.latLngToPoint(L.latLng(oPosInfo.Points[1]), nZoom);
            oPolygon = L.circle(oPosInfo.Points[0], oBPos.distanceTo(oEPos), oInfo.oOption).addTo(this._oPolygonSiteGroup);
            oLatLng = oPosInfo.Points[0];
        }
        else {
            oPolygon = L.polygon(oPosInfo.Points,  ES.MapView.oConfig.oSiteConfig).addTo(this._oPolygonSiteGroup);
            var oBound = new L.LatLngBounds(oPosInfo.Points);
            oLatLng = oBound.getCenter();
            oPolygon.cId = oPosInfo.Id;
        }
        oPolygon.bindTooltip(oPosInfo.Name).openTooltip();
        oPolygon.oPosInfo = oPosInfo;
        this.initEventForMarker(oPolygon);
        return oPolygon;
    },

    // 工地数据
    _getIconHtml: function (oPosInfo) {
        oPosInfo.cCls = 'ex-monitor-mapicon-site now';
        oPosInfo.cBCls = 'site-body'
        oPosInfo.cTCls = 'site-title';

        // if(oPosInfo.icon ==="SiteNow"){
        //     //上报正常出土工地
        //     oPosInfo.cCls = 'ex-monitor-mapicon-site now';
        // }else if(oPosInfo.icon ==="SiteAdvance"){
        //     // 上报提前出土工地
        //     oPosInfo.cCls = 'ex-monitor-mapicon-site temp-site';
        // }else if(oPosInfo.icon ==="Site"){
        //     // 上报未出土工地
        //     oPosInfo.cCls = 'ex-monitor-mapicon-site no-report';
        // }else if(oPosInfo.icon ==="UnSiteNow"){
        //     // 未上报出土工地
        //     oPosInfo.cCls = 'ex-monitor-mapicon-site alert';
        // }
        //var cHtml = ES.Util.template(this.cHtml, oPosInfo);

        if(oPosInfo.icon ==="SiteNow"){
            /** 上报正常出土工地 */
            oPosInfo.cCls = 'ex-monitor-mapicon-site now';
        }else if(oPosInfo.icon ==="SiteAdvance"){
            /** 上报提前出土工地 */
            oPosInfo.cCls = 'ex-monitor-mapicon-site temp-site';
        }else if(oPosInfo.icon ==="SiteNull"){
            /** 上报未出土工地 */
            oPosInfo.cCls = 'ex-monitor-mapicon-site no-report';
        }else if(oPosInfo.icon ==="UnSiteNow"){
            /** 未上报出土工地 */
            oPosInfo.cCls = 'ex-monitor-mapicon-site alert';
        }
        var cHtml = ES.Util.template(this.cHtml, oPosInfo);
        return cHtml;
    },

    // 画点
    _getIcon: function (cHtml) {

        var oIcon = L.divIcon({
            iconSize: [20, 20], iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: "",
            html: this._getIconHtmlMarker(),
        });
        return oIcon;
    },

    // 获得实时跟踪点,
    _getPosIconInfo: function (oItem) {
        return new L.DivIcon({
            html: ES.template(this._getIconHtmlMarker(), oItem),
            className: this.getLeightOnCls(oItem),
            iconSize: L.point(30, 40),
            iconAnchor: [10, 20],
            popupAnchor: L.point(-1, -20),
        });
    },
    //顶灯
    getLeightOnCls: function (oData) {

        var cClsType = 'ex-monitor-mapicon-truck';
        var cClsStatus = 'gray';
        if (oData.carType == 0) {
            cClsType = 'ex-monitor-mapicon-tram';
        }

        if (oData.currentState == '行驶' || oData.currentState == '停车') {
            cClsStatus = 'green';
        }
        else if (oData.scurrentStateta == '熄火') {
            cClsStatus = 'green';
        }
        else if(oData.currentState == '定位失败'){
            cClsStatus = 'yellow';
        }else if(oData.currentState == '通讯中断'){
            cClsStatus = 'gray';
        }

        return cClsType+' '+ cClsStatus;
    },

    //车辆点的布局
    _getIconHtmlMarker: function () {
        var cHtml =
            '<div cid="{devNo}" class="car-body" style="transform:rotateZ({nDir}deg);-webkit-transform: rotate({nDir}deg);"></div>' +
            '    <div class="pin-tip " style="display: block;">' +
            '        <div class="pin-dome"><b></b><c></c><d></d></div>' +
            '        <div class="pin-number">{vehNo}</div>' +
            '        <div class="pin-state">' +
            '        </div>' +
            '</div>';

        return cHtml;
    },

    // 设置车辆的角度
    _setHeading: function (oPosInfo, nInitDir) {
        if (!oPosInfo) {
            return;
        }
        if (!nInitDir) {
            nInitDir = 0;
        }
        oPosInfo.nDir = oPosInfo.vehGpsData.Direction + nInitDir;
        $('div[cId="' + oPosInfo.devNo + '"]').attr('style',ES.template( 'transform: rotate({nDir}deg);-webkit-transform: rotate({nDir}deg);',oPosInfo));
    },

    // 清空界面所有的工地数据
    clearSites: function (oData) {
        //this.oInfo = null;
        this.clearPolygonSite(oData);
        this.clearMarkerSite(oData);
        this.deleteSite(oData);
    },

    // 删除对象
    deleteSite: function (oData) {
        if (!this.aoSiteInfo || !oData || !oData.anId || oData.anId.length <= 0) return;
        var aoSiteInfo = this.aoSiteInfo
        var anId = oData.anId;
        for (var i = aoSiteInfo.length - 1; i >= 0; i--) {

            var aoTemp = $.grep(anId, function (k, nIndex) {
                if (aoSiteInfo[i].Id === parseInt(k)) {
                    return true;
                }
            })
            if (!aoTemp || aoTemp.length <= 0) continue;

            aoSiteInfo.splice(i, 1);
        }
    },

    addSiteData: function (oData) {
        //测试结果
        if (!this.aoSiteInfo) {
            this.aoSiteInfo = oData.aoSiteInfo;
            return;
        }

        $.merge(this.aoSiteInfo, oData.aoSiteInfo);

    },

    clearPolygonSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolygonSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolygonSiteGroup.removeLayer(oLayer);
        };


    },

    clearMarkerSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oSiteGroup.removeLayer(oLayer);
        };


    },

    // 删除所有的数据
    clearAllPolygonSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oPolygonSiteGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolygonSiteGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolygonSiteGroup.removeLayer(oLayer);
        }
    },

});

ES.MapView.SiteLayer.include({
    cHtml:
    '<div class="{cCls}">' +
    '   <div class="pin-tip" style="display: none;">' +
    '       <div class="pin-dome"><b></b><c></c><d></d></div>' +
    '       <div class="pin-number">{Name}</div>' +
    '   </div>' +
    '   <div class="site-body">' +
    '   </div>' +
    '</div>',
});

ES.MapView.VehClusterLayer = L.MapLib.MapMaster.MapOpr.extend({
    //执行画点，画线操作
    oOption: {
        onDrawLayers: 'MapView:ClusterLayer.DrawLayers',
        onClearLayers: 'MapView:ClusterLayer.clearLayer',
        onRemoveLayers: 'MapView:ClusterLayer.removeLayers',

        cHtml: '<div cid="{devNo}" class="car-body" style="transform:rotate({dir}deg);-webkit-transform: rotate({dir}deg);"></div>' +
        '    <div class="pin-tip " style="display: block;">' +
        '        <div class="pin-dome"><b></b><c></c><d></d></div>' +
        '        <div class="pin-number">{vehNo}</div>' +
        '        <div class="pin-state">' +
        '        </div>' +
        '</div>'
    },
    oPopOption: { maxWidth: 500 ,autoPan: false},
    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, {});
        ES.setOptions(this, oOption);
        this._initGroup();
        this._loadOn();
    },
    // 初始化Group
    _initGroup: function () {
        var self = this;
        // 使用计划来画图
        this._oPosGroup = L.markerClusterGroup({
            // animateAddingMarkers: false,
            // showCoverageOnHover: false,
            // maxClusterRadius: function (z) {
            //     if (z <= 11) {
            //         return 1100;
            //     } else {
            //         return 100;
            //     }
            // },
            // iconCreateFunction: function (cluster) {
            //     var childCount = cluster.getChildCount();
            //     var c = ' marker-cluster-';
            //
            //     if (childCount == self.oOption.maxItem) {
            //         return new L.DivIcon({
            //             iconSize: [20, 20],
            //             html: '<div class="ex-monitor-mapicon-site alert">' +
            //             '           <div class="pin-tip" style="display: block;">' +
            //             '               <div class="areaCount-number">' + self.oOption.areaName + '</div>' +
            //             '           </div>' +
            //             '           <div class="site-body areaCount">' + childCount +
            //             '           </div>' +
            //             '       </div>'
            //         });
            //     } else {
            //         if (childCount < 10) {
            //             c += 'small';
            //             return new L.DivIcon({
            //                 html: '<div><span>' + childCount + '</span></div>',
            //                 className: 'marker-cluster' + c,
            //                 iconSize: new L.Point(40, 40)
            //             });
            //         } else if (childCount < 100) {
            //             c += 'medium';
            //             return new L.DivIcon({
            //                 html: '<div><span>' + childCount + '</span></div>',
            //                 className: 'marker-cluster' + c,
            //                 iconSize: new L.Point(40, 40)
            //             });
            //         } else if (childCount >= 100 && childCount < self.oOption.maxItem) {
            //             c += 'large';
            //             return new L.DivIcon({
            //                 html: '<div><span>' + childCount + '</span></div>',
            //                 className: 'marker-cluster' + c,
            //                 iconSize: new L.Point(40, 40)
            //             });
            //         }
            //     }
            // }
        });
        this._oMap.addLayer(this._oPosGroup);
    },

    //初始化时加载数据
    _loadOn: function () {
        // 画所有的工地数据
        this._oParent.on(this.oOption.onDrawLayers, this.drawLayers, this);
        this._oParent.on(this.oOption.onClearLayers, this.clearLayer, this);
        this._oParent.on(this.oOption.onRemoveLayers, this.removeLayers, this);
        //this._oMap.on('moveend', this.getData, this);

        // 去除重复车辆
        this._oParent.on("MapView:ClusterLayer.removeLayer", this.removeLayer, this);

        // 添加数据
        this._oParent.on("MapView:MapLive.addMarker",function (oData) {
            this.drawLayer(oData.oGpsInfo);
        },this);
    },

    removeLayer:function (oData) {
        if (!this._oPosGroup || !oData || !oData.oGpsInfo) {
            return;
        }
        this._removeLayer(oData.oGpsInfo);
    },

    removeLayers: function (oData) {
        if (!this._oPosGroup || !oData || oData.acId.length <= 0) {
            return;
        }
        var aoInfo = oData.acId;
        for (var i = 0; i < aoInfo.length; i++) {
            var nId = -parseInt(aoInfo[i]);
            this._removeLayer(nId);
        }
    },

    _removeLayer: function (oGpsInfo) {
        var aoLayer = $.grep(this._oPosGroup.getLayers(), function (oLayer) {
            if (oLayer.cId === oGpsInfo.devNo) {
                return true;
            }
        });
        if (!aoLayer || aoLayer.length <= 0) {
            return;
        }
        for (var i = 0; i < aoLayer.length; i++) {
            this._oPosGroup.removeLayer(aoLayer[i]);
        }
    },

    clearLayer: function () {
        this._oPosGroup.clearLayers();
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function (oData) {
        if (!oData || !oData.aoData || oData.aoData.code !== 1 || oData.aoData.detail.length <= 0) {
            return;
        }
        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.detail.length; i++) {


            var oLatLng = {
                lat: oData.aoData.detail[i].lat,
                lng: oData.aoData.detail[i].lon,
            };
            oData.aoData.detail[i].latLng = oLatLng;
            this.drawLayer(oData.aoData.detail[i]);
            aoLatLnt.push(oLatLng);
        }
    },

    drawLayer: function (oGpsInfo) {
        if (!oGpsInfo || !oGpsInfo.latLng) {
            return;
        }
        var oLayer = this.findLayer(this._oPosGroup, oGpsInfo.devNo);
        if (oLayer) {
            if (!this._oMap.hasLayer(oLayer)) {
                this._oMap.addLayer(oLayer);
            }
            oLayer.setLatLng(oGpsInfo.latLng);
            return;
        }
        var cCls = this.getTruckCls(oGpsInfo);

        //try {
        var oIcon = this._getIcon(cCls, ES.Util.template(this.oOption.cHtml, oGpsInfo));
        var oMarker = L.marker(oGpsInfo.latLng, {icon: oIcon}).addTo(this._oPosGroup);
        oMarker.oGpsInfo = oGpsInfo;
        oMarker.cId = oGpsInfo.devNo;

        // 绑定弹出层
        this.initEventForMarker(oMarker);
        // } catch (e) {
        //     var iiii = 0;
        // }
    },

    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        var self = this;
        if (!oMarker) {
            return;
        }
        var oParams = {
            "devnos": [oMarker.oGpsInfo.devNo]
        }
        oMarker.on('click', function () {
            var that = this

            $.ajax({
                url: ES.MapView.oConfig.curPosUrl,
                data: JSON.stringify(oParams),
                type: 'post',
                dataType: 'text',
                headers: {
                    "token": ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                    // "Content-Type": "application/json; charset=UTF-8"
                },
                success: function (oData) {
                    var oTemp1 = JSON.parse(oData)
                    if(oTemp1.code != 1){
                        return
                    }
                    var oTemp = oTemp1.detail.list
                    var aoTemp = self._oParent.toHeartModle(oTemp);
                    if (!aoTemp || aoTemp.length <= 0) {
                        return
                    }
                    var cHtml = self._oParent._getVecMarkerHtml(aoTemp[0]);
                    that.bindPopup(cHtml, self.oPopOption);
                    var oPopup = that.getPopup();
                    oPopup.oGpsInfo = aoTemp[0];
                    self.initPopEven(oPopup);
                    that.openPopup();
                },
                error: function (err) {
                    console.log(err)
                }
            })





            // ES.getData(oParams, ES.MapView.oConfig.curPosUrl, function (oTemp) {
            //     if (!oTemp) {
            //         return;
            //     }
            //     var aoTemp = self._oParent.toHeartModle(oTemp);
            //     if (!aoTemp || aoTemp.length <= 0) {
            //         return
            //     }
            //     var cHtml = self._oParent._getVecMarkerHtml(aoTemp[0]);
            //     this.bindPopup(cHtml, self.oPopOption);
            //     var oPopup = this.getPopup();
            //     oPopup.oGpsInfo = aoTemp[0];
            //     self.initPopEven(oPopup);
            //
            //     this.openPopup();
            //
            // }, this, {}, {
            //     headers: {
            //         token: ES.MapView.oConfig.token,
            //         // "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            //     }
            // });
        });
    },

    initPopEven: function (oPopup) {
        var self = this;
        if (!oPopup) return;
        oPopup.self = this;
        oPopup.on("contentupdate", function (){
            // 车辆详情按钮
            var oBtnDetail = $(".leaflet-popup").find("a.ec-icon-truck").parent();
            // 车辆轨迹按钮
            var oBtnTrack = $(".leaflet-popup").find("a.ec-icon-exchange").parent();
            var oMeassageClick = $(".leaflet-popup").find("a.ec-icon-commenting").parent();
            // 下发指令按钮
            var oVehicleOrder = $(".leaflet-popup").find("a.ec-icon-cloud").parent();
            // 查看视频按钮
            var oVehicleVideo = $(".leaflet-popup").find("a.ec-icon-video-camera").parent();
            var oGpsInfo = this.oGpsInfo;
            // 绑定事件
            oBtnDetail.bind("click", function () {
                self._oParent.fire("MapView:VehDetail.showDetail",{oGpsInfo:oGpsInfo});
                // 取消订阅
                self._oParent.fire('HubSvr.unsubGps',{aoGpsInfo:[oGpsInfo]});
                // 移除跟踪列表
                self._oParent.fire("MapView:LiveMange.removeAll");
                // 添加跟踪
                self._oParent.fire('HubSvr.subGps',{aoGpsInfo:[oGpsInfo]});

            });
            oBtnTrack.bind("click", function () {
                // 单独的页面打开
                window.open("/mapViewHtml/html/trackview.html?token="+ES.MapView.oConfig.token+"&PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo);

            });
            // 下发指令
            oVehicleOrder.bind('click', function(){
                self._oParent.orderVehicleDialog = new ES.Common.AddType(self._oParent,{bRemove:true},{title: '下发指令',
                    content:'<div class="ex-command-tabs modelType">'+
                    '           <ul class="ex-command-tab ec-avg-sm-3">'+
                    '               <li data-index="1"><i class="ec-icon-btn ec-primary ec-icon-database"></i><span>拍照</span></li>'+
                    '               <li data-index="2"><i class="ec-icon-btn ec-primary ec-icon-life-ring"></i><span>点名</span></li>'+
                    '               <li data-index="3"><i class="ec-icon-btn ec-primary ec-icon-search"></i><span>语音文字</span></li>'+
                    // '               <li data-index="4"><i class="ec-icon-btn ec-primary ec-icon-file-o"></i><span>语音</span></li>'+
                    // '               <li data-index="5"><i class="ec-icon-btn ec-primary ec-icon-star"></i><span>参数设置</span></li>'+
                    '           </ul>'+
                    '         </div>'});
                self._oParent.orderVehicleDialog.del(oGpsInfo);
            })

            // 查看视频
            oVehicleVideo.bind('click', function(){
                window.open("/mapViewHtml/html/video.html?token="+ES.MapView.oConfig.token+"&PhoneNum=" + oGpsInfo.devNo + "&VehicleNo=" + oGpsInfo.vehNo + "&cameraNum=" + oGpsInfo.cameraNum);
            })

            // 发送消息
            oMeassageClick.bind("click", function () {
                ES.aWarn('系统正在开发过程！');
            });
        }, oPopup);
    },

    // 画点
    _getIcon: function (cCls,cHtml) {
        var oIcon = L.divIcon({
            iconSize: [30, 40], iconAnchor: [10, 20],
            popupAnchor: [-1, -20],
            className: cCls,
            html: cHtml,
        });
        return oIcon;
    },

    // 车辆类型 carUseIn 0 补电车 ，1 物流车，2 其他车，车辆 状态 行驶，停车/ 熄火 / 离线
    getTruckCls: function (oData) {

        var cClsType = 'ex-monitor-mapicon-truck';
        var cClsStatus = 'green';
        // if (oData.carType == 0) {
        //     cClsType = 'ex-monitor-mapicon-tram';
        // }
        if (oData.status == '1' || oData.status == '2') {
            cClsStatus = 'green';
        }
        else if (oData.status == '3') {
            cClsStatus = 'green';
        }
        else if (oData.status == '4') {
            cClsStatus = 'yellow';
        }
        else  {
            cClsStatus = 'gray';
        }
        return cClsType+' '+ cClsStatus;
    },

    getData: function () {
        ES.getData({}, ES.MapView.oConfig.getVehsLoc, function (oData) {
                this.drawLayers({aoData: oData});
            }, this, null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            }
        );
    }
});

/**
 * Created by liulin on 2019/3/28.
 */

/**
 * 管理 车辆 集合数据，当地图乘积小于8时，显示区域集合图层
 * Created by liulin on 2018/4/25.
 */

ES.MapView.VehClusterMange = ES.Evented.extend({

    // 车辆列表构造函数
    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this._oMap = oParent.getMap();

        this.initOn();

        // 集合图层的数据
        this.aoGroup = null;
        // 车辆图层数据
        this.aoVehInfo = null;

        this.aoGroupLayer = [];

        this.oVehLayer = new ES.MapView.VehDetailClusterLayer(oParent, {});

        this.showVehInfo();
    },

    // 监听数据 做缩放管理
    initOn: function () {
        this._oMap.on('moveend', this.showVehInfo, this);
        this._oParent.on('VehClusterMange:refreshLoc',this.refreshLoc,this);

        // 去掉原本的定位 防止页面出现两辆相同的车辆
        this._oParent.on('VehClusterMange:removeOldLocation',this.removeOldLocation,this);
    },

    removeOldLocation:function(){
        this.showDetail();
    },

    refreshLoc:function () {
        this.aoGroup = null;
        this.aoVehInfo = null;

        this.showVehInfo();
    },

    // 显示数据到集合中
    showVehInfo: function () {
        var nZoom = this._oMap.getZoom();
        if (nZoom < 12) {
            this.showGroup();
        }
        else {
            this.showDetail();
        }

    },

    // 显示分组图层数据
    showGroup: function () {
        this._oMap.removeLayer(this.oVehLayer.getLayer());
        if (this.aoGroup) {
            this.initGroup();

        } else {
            ES.loadAn($('#MapView'));
            this._oMap.off('moveend', this.showVehInfo, this);
            ES.getData({}, ES.MapView.oConfig.getVehsLoc, function (oData) {

                this.aoGroup = oData;
                if(oData){
                    for (var i = 0; i < oData.length; i++) {
                        var oLayer = new ES.MapView.VehClusterLayer(this._oParent, {
                            maxItem: oData[i].items.length,
                            areaName: oData[i].name
                        });
                        oLayer.drawLayers({aoData: oData[i].items});
                        this.aoGroupLayer.push(oLayer);
                    }
                }
                this.initGroup();
                ES.removeAn($('#MapView'));
                this._oMap.on('moveend', this.showVehInfo, this);
            }, this);
        }


    },

    initGroup: function () {
        for (var i = 0; i < this.aoGroupLayer.length; i++) {
            this._oMap.addLayer(this.aoGroupLayer[i].getLayer());
        }
    },

    showDetail: function () {

        for (var i = 0; i < this.aoGroupLayer.length; i++) {
            this._oMap.removeLayer(this.aoGroupLayer[i].getLayer());
        }

        if (this.aoVehInfo) {
            this.initVehInfo();
        } else {
            ES.loadAn($('#MapView'));
            this._oMap.off('moveend', this.showVehInfo, this);
            ES.getData({}, ES.MapView.oConfig.getVehsDetailLoc, function (oData) {

                this.aoVehInfo = oData;
                this.oVehLayer.drawLayers({aoData: oData});
                this.initVehInfo();

                ES.removeAn($('#MapView'));
                this._oMap.on('moveend', this.showVehInfo, this);
            }, this);
        }

    },

    initVehInfo: function () {

        this._oMap.addLayer(this.oVehLayer.getLayer());
    },

});

/**
 * Created by liulin on 2019/3/28.
 */

/**
 * 车辆明细图层，只显示10层以上的数据
 * Created by liulin on 2018/4/25.
 */

ES.MapView.VehDetailClusterLayer= ES.MapView.VehClusterLayer.extend({

    // 初始化Group
    _initGroup: function () {
        var self = this;
        // 使用计划来画图
        this._oPosGroup = L.markerClusterGroup({ });

    },

    getData: function () {

        ES.getData({},ES.MapView.oConfig.getVehsDetailLoc, function (oData) {
            this.drawLayers({aoData: oData});
        }, this);
    }

});

//全部的时候点击出来的弹出层再去选择对应的类型进行操作
ES.Common.AddType =ES.Common.DialogDel.extend({
    initialize: function (oParent, oOption, oDOption) {
        ES.Common.BaseDialog.prototype.initialize.call(this, oParent, oOption, oDOption);
        // 窗体保存的业务数据
        this.oBusData = null;
    },
    initButton: function () {
    },
    // 注册事件
    initOn: function () {
    },
    afterOpen: function () {
        var self = this;
        $('.ex-command-tabs.modelType').on('click', 'li', function () {
            var nIndex = parseInt($(this).attr('data-index'));
            // if (self.oOption.bRemove) {
            //     self.oDialog.remove();
            // }
            // else {
            //     self.oDialog.close();
            // }
            self.getDialogTypeV2(nIndex);
        })
    },
    getDialogTypeV2:function(nIndex){
        var self = this;
        var oModel = self.oBusData
        switch (nIndex)
        {
            case 1:
                //拍照
                self._oParent.oEditD = new ES.Common.TakePhoto(self._oParent, { bRemove: true, cUrl: cH_Url + '/instructionRelease/photo',title: '下发指令 - 拍照'});
                self._oParent.oEditD.showModal(oModel);
                break;
            case 2:
                //点名
                self._oParent.oEditD = new ES.Common.DelEntity(self._oParent, { bRemove: true, cUrl:cH_Url+ '/instructionRelease/rollcall', title: '下发指令 - 点名'});
                self._oParent.oEditD.showModal(oModel);
                break;
            case 3:
                //文字
                self._oParent.oEditD = new ES.Common.TextAreaDialog(self._oParent,{bRemove:true,cUrl:cH_Url + '/instructionRelease/broadcast',nIndex: nIndex, title: '下发指令 - 文字'});
                self._oParent.oEditD.showModal(oModel);
                break;
            case 4:
                //语音
                self._oParent.oEditD = new ES.Common.SetTtsSwitch(self._oParent,{bRemove:true,cUrl:'/DeviceCommand/SetTtsSwitch',nIndex: nIndex, title: '下发指令 - 语音'});
                self._oParent.oEditD.showModal(oModel);
                break;
            case 5:
                //设置参数
                self._oParent.oEditD = new ES.Common.SetMuckParam(self._oParent,{bRemove:true,cUrl:'/DeviceCommand/SetMuckParam',nIndex: nIndex, title: '下发指令 - 设置参数'});
                self._oParent.oEditD.showModal(oModel);
                break;
        }
    },
    getDialogType:function (nIndex) {
        var self = this;
        switch (nIndex)
        {
            case 1:
                //设置载重阈值
                self._oParent.oEditD = new ES.Common.Threshold(self._oParent,{bRemove:true,cUrl:'/DeviceCommand/SetLoadThreshold',nIndex: nIndex});
                self._oParent.oEditD.showModal();
                break;
            case 2:
                //设置顶灯
                self._oParent.oEditD = new ES.Common.SetLight(self._oParent,{bRemove:true,cUrl:'/DeviceCommand/SetLight',nIndex: nIndex});
                self._oParent.oEditD.showModal();
                break;
            case 3:
                //设置密闭检测模式
                self._oParent.oEditD = new ES.Common.SetCloseCheckMode(self._oParent,{bRemove:true,cUrl:'/DeviceCommand/SetCloseCheckMode',nIndex: nIndex});
                self._oParent.oEditD.showModal();
                break;
            case 4:
                //设置语音播报开关
                self._oParent.oEditD = new ES.Common.SetTtsSwitch(self._oParent,{bRemove:true,cUrl:'/DeviceCommand/SetTtsSwitch',nIndex: nIndex});
                self._oParent.oEditD.showModal();
                break;
            case 5:
                self._oParent.oEditD = new ES.Common.SetMuckParam(self._oParent,{bRemove:true,cUrl:'/DeviceCommand/SetMuckParam',nIndex: nIndex});
                self._oParent.oEditD.showModal();
                break;
            case 6:
                //查询传感器参数
                this._oParent.oConfigD = new ES.SelectTruck.Dialog(this._oParent,{bRemove:true,cUrl:'/DeviceCommand/GetSensorParam',nIndex:nIndex},{ title: "查询传感器参数"});
                this._oParent.oConfigD.showModal();
                break;
            case 7:
                //查询传感器版本
                this._oParent.oConfigD = new ES.SelectTruck.Dialog(this._oParent,{bRemove:true,cUrl:'/DeviceCommand/GetSensorVersion',nIndex:nIndex},{ title: "查询传感器版本"});
                this._oParent.oConfigD.showModal();
                break;
        }
    }
});
//设置阈值
ES.Common.Threshold = ES.Evented.extend({
    cHtml: '<form class="ex-layout-site-reports" style="width:550px" id="setThresholdModel">' +
    '        <div class="ec-g ex-layout-site-reports-top">' +
    '            <ul class="ec-avg-sm-1">' +
    '                <li class="ec-form-group">' +
    '                    <label for="Fullload" class="ec-u-sm-4 ec-form-label">满载阈值：</label>' +
    '                    <div class="ec-u-sm-8">' +
    '                        <input id="Fullload" class="ec-text-truncate ec-form-field ec-radius ec-input-sm ec-fl ec-margin-right-sm" type="number" value="1" name="Fullload">' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="Overload" class="ec-u-sm-4 ec-form-label">满载阈值：</label>' +
    '                    <div class="ec-u-sm-8">' +
    '                        <input id="Overload" class="ec-text-truncate ec-form-field ec-radius ec-input-sm ec-fl ec-margin-right-sm" type="number" value="1" name="Overload">' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="MaxOverload" class="ec-u-sm-4 ec-form-label">严重超载：</label>' +
    '                    <div class="ec-u-sm-8">' +
    '                        <input id="MaxOverload" class="ec-text-truncate ec-form-field ec-radius ec-input-sm ec-fl ec-margin-right-sm" type="number" value="1" name="MaxOverload">' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="MaxOverload" class="ec-u-sm-12 ec-form-label"><span class="ec-text-danger ec-text-truncate">提示：严重超载 > 超载阈值 > 满载阈值</span></label>' +
    '                </li>' +
    '            </ul>' +
    '        </div>' +
    '    </form>',
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '阈值设置',
            content: this.cHtml
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
    },
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }
        });

        this.oDialog.addEventListener('close', function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
        $("input[type='number']").on('input propertychange', function () {
            if ($(this).val() <= 0) {
                $(this).val(0)
            }
        })
    },
    //初始化确定取消按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: '确定',
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: '取消',
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            },
        ];
        this.oDOption.button = aoButton;
    },
    afterOpen:function(){

    },
    save: function () {
        var MaxOverload = $('#MaxOverload').val(), Overload = $('#Overload').val(),Fullload = $('#Fullload').val();
        if(parseInt(MaxOverload) < parseInt(Overload) || parseInt(Overload) < parseInt(Fullload) || parseInt(MaxOverload) < parseInt(Fullload)){
            ES.aWarn('请按提示输入正确阈值！');
            return;
        }
        if(MaxOverload == '0' || Overload == '0' || Fullload == '0'){
            ES.aWarn('阈值不能为0！');
            return;
        }
        var oModel = {
            MaxOverload:MaxOverload,
            Overload:Overload,
            Fullload:Fullload,
        }
        ES.loadAn($(this.oDialog.node));
        ES.getData(oModel,this.oOption.cUrl,this.saveHandler,this);
    },
    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.orderVehicleDialog.remove();
        }
    },
});
//设置顶灯
ES.Common.SetLight = ES.Evented.extend({
    cHtml: '<form class="ex-layout-site-reports" style="width:550px" id="setLightModel">' +
    '        <div class="ec-g ex-layout-site-reports-top">' +
    '            <ul class="ec-avg-sm-1">' +
    '                <li class="ec-form-group">' +
    '                    <label for="LightType" class="ec-u-sm-5 ec-form-label"><span class="ec-text-danger ec-text-truncate">(*)</span>顶灯类型：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="LightType" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="">请选择</option>' +
    '                            <option value="1">红灯</option>' +
    '                            <option value="2">黄灯</option>' +
    '                            <option value="3">绿灯</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="LightTime" class="ec-u-sm-5 ec-form-label">顶灯持续时长(30秒)：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <input id="LightTime" class="ec-text-truncate ec-form-field ec-radius ec-input-sm ec-fl ec-margin-right-sm" type="number" value="1" name="">' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="IsFlashed" class="ec-u-sm-5 ec-form-label">亮灯是否闪烁：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="IsFlashed" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="true">是</option>' +
    '                            <option value="false">否</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '            </ul>' +
    '        </div>' +
    '    </form>',


    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '顶灯设置',
            content: this.cHtml
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
    },
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }
        });

        this.oDialog.addEventListener('close', function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
        $("input[type='number']").on('input propertychange', function () {
            if ($(this).val() <= 0) {
                $(this).val(0)
            }
        })
    },
    //初始化确定取消按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: '确定',
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: '取消',
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            },
        ];
        this.oDOption.button = aoButton;
    },
    afterOpen:function(){

    },
    save: function () {
        var LightType = $('#LightType option:selected').val(), LightTime = $('#LightTime').val(),IsFlashed = $('#IsFlashed option:selected').val();
        if(!LightType){
            ES.aWarn('请选择顶灯类型！');
            return;
        }
        var oModel = {
            LightType:LightType,
            LightTime:LightTime,
            IsFlashed:IsFlashed,
        };
        ES.loadAn($(this.oDialog.node));
        ES.getData(oModel,this.oOption.cUrl,this.saveHandler,this);
    },
    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.orderVehicleDialog.remove();
        }
    },
});
//设置密闭传感器密闭检测模式
ES.Common.SetCloseCheckMode = ES.Evented.extend({
    cHtml: '    <form class="ex-layout-site-reports" style="width:700px" id="setTtsSwitchModel">' +
    '        <div class="ec-g ex-layout-site-reports-top">' +
    '            <ul class="ec-avg-sm-2">' +
    '                <li class="ec-form-group">' +
    '                    <label for="NoclosedTts" class="ec-u-sm-5 ec-form-label">未密闭语音播报开关：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="NoclosedTts" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="true">开</option>' +
    '                            <option value="false">关</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="OverloadTts" class="ec-u-sm-5 ec-form-label">超载语音播报开关：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="OverloadTts" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="true">开</option>' +
    '                            <option value="false">关</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="OilRecoveryTts" class="ec-u-sm-5 ec-form-label">油路恢复语音播报：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="OilRecoveryTts" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="true">开</option>' +
    '                            <option value="false">关</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="OilCutoffTts" class="ec-u-sm-5 ec-form-label">油路断开语音播报：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="OilCutoffTts" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="true">开</option>' +
    '                            <option value="false">关</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="GnssfaultTts" class="ec-u-sm-5 ec-form-label">gnss故障语音播报：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="GnssfaultTts" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="false">关</option>' +
    '                            <option value="true">开</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="GnssfaultFlash" class="ec-u-sm-5 ec-form-label">gnss故障闪烁：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="GnssfaultFlash" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="false">关</option>' +
    '                            <option value="true">开</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '            </ul>' +
    '        </div>' +
    '    </form>',

    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: '设置密闭传感器密闭检测模式',
            content: this.cHtml
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
    },
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }
        });

        this.oDialog.addEventListener('close', function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
    },
    //初始化确定取消按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: '确定',
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: '取消',
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            },
        ];
        this.oDOption.button = aoButton;
    },
    afterOpen:function(){

    },
    save: function () {
        var ValueMode = $('#ValueMode option:selected').val();
        var oModel = {
            ValueMode:ValueMode,
        };
        ES.loadAn($(this.oDialog.node));
        ES.getData(oModel,this.oOption.cUrl,this.saveHandler,this);
    },
    saveHandler: function (oData) {
        ES.Common.DialogEdit.prototype.saveHandler.call(this,oData);
        if(oData.IsSuccess) {
            this._oParent.orderVehicleDialog.remove();
        }
    },
});
//设置语音播报开关
ES.Common.SetTtsSwitch = ES.Evented.extend({
    cHtml: '<form class="ex-layout-site-reports" style="width:700px" id="setTtsSwitchModel">' +
    '        <div class="ec-g ex-layout-site-reports-top">' +
    '            <ul class="ec-avg-sm-2">' +
    '                <li class="ec-form-group">' +
    '                    <label for="NoclosedTts" class="ec-u-sm-5 ec-form-label">未密闭语音播报开关：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="NoclosedTts" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="true">开</option>' +
    '                            <option value="false">关</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="OverloadTts" class="ec-u-sm-5 ec-form-label">超载语音播报开关：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="OverloadTts" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="true">开</option>' +
    '                            <option value="false">关</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="OilRecoveryTts" class="ec-u-sm-5 ec-form-label">油路恢复语音播报：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="OilRecoveryTts" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="true">开</option>' +
    '                            <option value="false">关</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="OilCutoffTts" class="ec-u-sm-5 ec-form-label">油路断开语音播报：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="OilCutoffTts" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="true">开</option>' +
    '                            <option value="false">关</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="GnssfaultTts" class="ec-u-sm-5 ec-form-label">gnss故障语音播报：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="GnssfaultTts" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="false">关</option>' +
    '                            <option value="true">开</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="GnssfaultFlash" class="ec-u-sm-5 ec-form-label">gnss故障闪烁：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="GnssfaultFlash" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="false">关</option>' +
    '                            <option value="true">开</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '            </ul>' +
    '        </div>' +
    '    </form>',
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: this.oOption.title,
            content: this.cHtml
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
    },
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }
        });

        this.oDialog.addEventListener('close', function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
    },
    //初始化确定取消按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: '确定',
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: '取消',
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            },
        ];
        this.oDOption.button = aoButton;
    },
    afterOpen:function(){

    },
    save: function () {
        var NoclosedTts = $('#NoclosedTts option:selected').val(), OverloadTts = $('#OverloadTts option:selected').val(), OilRecoveryTts = $('#OilRecoveryTts option:selected').val(),
            OilCutoffTts = $('#OilCutoffTts option:selected').val(),GnssfaultTts = $('#GnssfaultTts option:selected').val(),GnssfaultFlash = $('#GnssfaultFlash option:selected').val();
        var userInfo = JSON.parse(localStorage.getItem('$userstatus'))
        var oModel = {
            phoneNum: this.oBusData.devNo,
            userId:userInfo.id,
            userName:userInfo.account,
            NoclosedTts:NoclosedTts,
            OverloadTts:OverloadTts,
            OilRecoveryTts:OilRecoveryTts,
            OilCutoffTts:OilCutoffTts,
            GnssfaultTts:GnssfaultTts,
            GnssfaultFlash:GnssfaultFlash
        };
        ES.loadAn($(this.oDialog.node));
        ES.getData(JSON.stringify(oModel),this.oOption.cUrl,this.saveHandler,this,null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });
    },
    saveHandler: function (oData) {
        if(oData.msg == "Success") {
            this.oDialog.remove()
            this._oParent.orderVehicleDialog.oDialog.remove();
        }
    },
});
//参数设置
ES.Common.SetMuckParam = ES.Evented.extend({
    cHtml: '<form class="ex-layout-site-reports" style="width:550px" id="setMuckParamModel">' +
    '        <div class="ec-g ex-layout-site-reports-top">' +
    '            <ul class="ec-avg-sm-1">' +
    '                <li class="ec-form-group">' +
    '                    <label for="AuthPwd" class="ec-u-sm-5 ec-form-label"><span class="ec-text-danger ec-text-truncate">(*)</span>授权密码：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <input type="password" name="name" id="AuthPwd" class="ec-form-field"/>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="FilteringTime" class="ec-u-sm-5 ec-form-label">滤波时间参数(5s)：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <input id="FilteringTime" class="ec-text-truncate ec-form-field ec-radius ec-input-sm ec-fl ec-margin-right-sm" type="number" value="1" name="">' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="BackpassMode" class="ec-u-sm-5 ec-form-label">回传模式：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="BackpassMode" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="0">查询模式</option>' +
    '                            <option value="1">主动回传</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="QryInterval" class="ec-u-sm-5 ec-form-label">查询指令间隔(500ms)：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <input id="QryInterval" class="ec-text-truncate ec-form-field ec-radius ec-input-sm ec-fl ec-margin-right-sm" type="number" value="1" name="">' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="Mode" class="ec-u-sm-5 ec-form-label">模式：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="Mode" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="">请选择</option>' +
    '                            <option value="0">debug</option>' +
    '                            <option value="1">正常模式</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '            </ul>' +
    '        </div>' +
    '    </form>',
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: this.oOption.title,
            content: this.cHtml
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
    },
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }
        });

        this.oDialog.addEventListener('close', function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
        $("input[type='number']").on('input propertychange', function () {
            if ($(this).val() <= 0) {
                $(this).val(0)
            }
        })
    },
    //初始化确定取消按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: '确定',
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: '取消',
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            },
        ];
        this.oDOption.button = aoButton;
    },
    afterOpen:function(){

    },
    save: function () {
        var Mode = $('#Mode option:selected').val(), BackpassMode = $('#BackpassMode option:selected').val(), QryInterval = $('#QryInterval').val(),
            FilteringTime = $('#FilteringTime').val(),AuthPwd = $('#AuthPwd').val();
        if(!AuthPwd){
            ES.aErr('请设置密码！')
            return;
        }
        var userInfo = JSON.parse(localStorage.getItem('$userstatus'))
        var oModel = {
            phoneNum: this.oBusData.devNo,
            userId:userInfo.id,
            userName:userInfo.account,
            Mode:Mode,
            BackpassMode:BackpassMode,
            QryInterval:QryInterval,
            FilteringTime:FilteringTime,
            AuthPwd:AuthPwd,
        };
        ES.loadAn($(this.oDialog.node));
        ES.getData(JSON.stringify(oModel),this.oOption.cUrl,this.saveHandler,this,null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });
    },
    saveHandler: function (oData) {
        if(oData.msg == "Success") {
            this.oDialog.remove()
            this._oParent.orderVehicleDialog.oDialog.remove();
        }
    },
});

//点名
ES.Common.DelEntity = ES.Evented.extend({
    cHtml: '<form style="width:550px"><h3>确定下发指令？</h3></form>',
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: this.oOption.title,
            content: this.cHtml
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
    },
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }
        });

        this.oDialog.addEventListener('close', function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
    },
    //初始化确定取消按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: '确定',
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: '取消',
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            },
        ];
        this.oDOption.button = aoButton;
    },
    afterOpen:function(){},
    save: function () {
        var userInfo = JSON.parse(localStorage.getItem('$userstatus'))
        var oModel = {
            phoneNum: this.oBusData.devNo,
            userId:userInfo.id,
            userName:userInfo.account
        }

        ES.loadAn($(this.oDialog.node));
        ES.getData(JSON.stringify(oModel),this.oOption.cUrl,this.saveHandler,this,null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });
    },
    saveHandler: function (oData) {
        if(oData.msg == "Success") {
            ES.aSucess('下发成功！')
            this.oDialog.remove()
            this._oParent.orderVehicleDialog.oDialog.remove();
        }
    },
});
//下发文字
ES.Common.TextAreaDialog = ES.Evented.extend({
    cHtml: '<form class="ex-layout-site-reports" style="width:550px" id="setTextModel">' +
    '        <div class="ec-g ex-layout-site-reports-top">' +
    '            <ul class="ec-avg-sm-2">' +
    '                <li class="ec-form-group">' +
    '                    <label for="urgency" class="ec-u-sm-5 ec-form-label">紧急：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="urgency" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="true">是</option>' +
    '                            <option value="false">否</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="tts" class="ec-u-sm-5 ec-form-label">终端TTS播读：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="tts" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="false">否</option>' +
    '                            <option value="true">是</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="screen" class="ec-u-sm-5 ec-form-label">终端显示器显示：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="screen" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="false">否</option>' +
    '                            <option value="true">是</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="advertising" class="ec-u-sm-5 ec-form-label">广告屏显示：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="advertising" class="ec-form-field chosen-select ec-radius ec-input-sm">' +
    '                            <option value="false">否</option>' +
    '                            <option value="true">是</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '            </ul>' +
    '        </div>' +
    '        <div class="ec-form">' +
    '            <textarea placeholder="请输入需要下发的文字内容" id="textAreaDialog" style="min-height: 70px;font-size: 1.3rem"></textarea>' +
    '        </div>' +
    '    </form>',
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: this.oOption.title,
            content: this.cHtml
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
    },
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }
        });

        this.oDialog.addEventListener('close', function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
    },
    //初始化确定取消按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: '确定',
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: '取消',
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            },
        ];
        this.oDOption.button = aoButton;
    },
    afterOpen:function(){},
    save: function () {
        var textAreaDialog = $('#textAreaDialog').val(),
            urgency = $('#urgency').val(),
            screen = $('#screen').val(),
            tts = $('#tts').val(),
            advertising = $('#advertising').val()
        if(!textAreaDialog){
            ES.aWarn('请输入文字内容');
            return;
        }
        var userInfo = JSON.parse(localStorage.getItem('$userstatus'))
        var oModel = {
            phoneNum: this.oBusData.devNo,
            userId:userInfo.id,
            userName:userInfo.account,
            text:textAreaDialog,
            "urgency":urgency,
            "screen":screen,
            "tts":tts,
            "advertising":advertising
        }

        ES.loadAn($(this.oDialog.node));
        ES.getData(JSON.stringify(oModel),this.oOption.cUrl,this.saveHandler,this,null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });
    },
    saveHandler: function (oData) {
        if(oData.msg == "Success") {
            ES.aSucess('下发成功！')
            this.oDialog.remove()
            this._oParent.orderVehicleDialog.oDialog.remove();
        }
    },
});

//拍照
ES.Common.TakePhoto = ES.Evented.extend({
    cHtml: '<form class="ex-layout-site-reports" style="width:550px" id="setTextModel">' +
    '        <div class="ec-g ex-layout-site-reports-top">' +
    '            <ul class="ec-avg-sm-2">' +
    '                <li class="ec-form-group">' +
    '                    <label for="ChannelId" class="ec-u-sm-5 ec-form-label">通道：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="ChannelId" class="ec-form-field chosen-select ec-radius ec-input-sm" name="ChannelId">' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="SaveFlag" class="ec-u-sm-5 ec-form-label">保存方式：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="SaveFlag" class="ec-form-field chosen-select ec-radius ec-input-sm" name="SaveFlag">' +
    '                            <option value="0">实时上传</option>' +
    '                            <option value="1">保存</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="Resolution" class="ec-u-sm-5 ec-form-label">分辨率：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="Resolution" class="ec-form-field chosen-select ec-radius ec-input-sm" name="Resolution">' +
    '                            <option value="1">320 * 240</option>' +
    '                            <option value="2">640 * 480</option>' +
    '                            <option value="3">800 * 600</option>' +
    '                            <option value="4">1024 * 768</option>' +
    '                            <option value="5">176 * 144</option>' +
    '                            <option value="6">352 * 288</option>' +
    '                            <option value="7">704 * 288</option>' +
    '                            <option value="8">704 * 576</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="PhotoInterval" class="ec-u-sm-5 ec-form-label">拍照间隔(秒)：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <input id="PhotoInterval" class="ec-form-field ec-input-sm" name="PhotoInterval" value="1"/>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="ImageQuality" class="ec-u-sm-5 ec-form-label">照片质量：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <select id="ImageQuality" class="ec-form-field chosen-select ec-radius ec-input-sm" name="ImageQuality">' +
    '                            <option value="1">1</option>' +
    '                            <option value="2">2</option>' +
    '                            <option value="3">3</option>' +
    '                            <option value="4">4</option>' +
    '                            <option value="5">5</option>' +
    '                            <option value="6">6</option>' +
    '                            <option value="7">7</option>' +
    '                            <option value="8">8</option>' +
    '                            <option value="9">9</option>' +
    '                            <option value="10">10</option>' +
    '                        </select>' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="ImageQuality" class="ec-u-sm-12 ec-form-label">1代表质量损失最小,10表示压缩比最大</label>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="ShootCommand" class="ec-u-sm-5 ec-form-label">拍摄指令：</label>' +
    '                    <div class="ec-u-sm-7">' +
    '                        <input id="ShootCommand" class="ec-form-field ec-input-sm" name="ShootCommand" value="1" />' +
    '                    </div>' +
    '                </li>' +
    '                <li class="ec-form-group">' +
    '                    <label for="ShootCommand" class="ec-u-sm-12 ec-form-label">0表示停止拍照,其他表示拍照张数</label>' +
    '                </li>' +
    '            </ul>' +
    '        </div>' +
    '    </form>',
    initialize: function (oParent, oOption, oDOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        this.oDOption = {};
        this.initButton();
        this.initDialog();
        this.initEvent();
        this.initUI();
    },
    initDialog: function () {
        var oDOption = {
            fixed: true,
            align: 'right bottom',
            title: this.oOption.title,
            content: this.cHtml
        };
        ES.extend(oDOption, this.oDOption)
        var oDiaLog = dialog(oDOption);
        this.oDialog = oDiaLog;
        return oDiaLog;
    },
    showModal: function (oData) {
        this.oBusData = oData;
        this.oDialog.showModal();
    },
    // 初始化界面对象
    initUI: function () {
    },
    initEvent: function () {
        if (!this.oDialog) {
            return;
        }
        var self = this;
        this.oDialog.addEventListener('show', function () {
            if (self.afterOpen) {
                self.afterOpen();
            }
        });

        this.oDialog.addEventListener('close', function () {
            if (self.afterClose) {
                self.afterClose();
            }
        });
    },
    //初始化确定取消按钮
    initButton: function () {
        var self = this;
        var aoButton = [
            {
                value: '确定',
                callback: function () {
                    self.save();
                    return false;
                },
                autofocus: true
            },
            {
                value: '取消',
                callback: function () {
                    if (self.oOption.bRemove) {
                        this.remove();
                    }
                    else {
                        this.close();
                    }
                    return false;
                }
            },
        ];
        this.oDOption.button = aoButton;
    },
    afterOpen:function(){
        var oC = this.oBusData.cameraNum
        if(oC){
            var item = ''
            for(var i = 1; i<=parseInt(oC); i++){
                item += '<option value="'+ i +'">通道'+i+'</option>'
            }
            $('#ChannelId').html(item)
        }
    },
    save: function () {
        var userInfo = JSON.parse(localStorage.getItem('$userstatus'))
        var oModel = {
            phoneNum: this.oBusData.devNo,
            userId:userInfo.id,
            userName:userInfo.account,
            ChannelId:$('#ChannelId').val(),
            SaveFlag:$('#SaveFlag').val(),
            Resolution:$('#Resolution').val(),
            PhotoInterval:$('#PhotoInterval').val(),
            ImageQuality:$('#ImageQuality').val(),
            ShootCommand:$('#ShootCommand').val(),
        }

        ES.loadAn($(this.oDialog.node));
        ES.getData(JSON.stringify(oModel),this.oOption.cUrl,this.saveHandler,this,null,
            {
                headers: {
                    token: ES.MapView.oConfig.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });
    },
    saveHandler: function (oData) {
        if(oData.msg == "Success") {
            ES.aSucess('下发成功！')
            this.oDialog.remove()
            this._oParent.orderVehicleDialog.oDialog.remove();
        }
    },
});

}(window, document, L, jQuery));
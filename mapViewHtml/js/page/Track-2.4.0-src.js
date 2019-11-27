

/*
Track-2.4.0 code for exsun

Copyright©2015-2018 武汉依迅北斗空间技术有限公司 All Rights Reserved.

http://www.exsun.cn
*/

(function (window, document, L, $) {/**
 *
 *  车辆历史轨迹
 *
 *  历史轨迹 V2.1
 *  修改功能：历史轨迹修改为一次加载
 *
 *  界面没有div元素，全部集成到js代码中
 *
 * Created by liulin on 2017/2/22.
 */

// var m_cSignal = 'http://61.136.223.44:8002/';
// var m_cTrackUrl = 'http://192.168.1.244:30000/bb/map/GetHisLocPaing';
// var m_nBTick = 0;
// // 查询报警类型、报警数据
// var m_cAlarmUrl = 'http://192.168.1.244:30000/bb/map/UserAlarm';
// var m_exportTrackUrl = 'http://192.168.1.244:30000/bb/reports/export/HisLocExport'

var m_cSignal = 'http://61.136.223.44:8002/';
var m_cTrackUrl = 'http://api.bdlbs.comlbs.com/bb/map/GetHisLocPaing';
var m_nBTick = 0;
// 查询报警类型、报警数据
var m_cAlarmUrl = 'http://api.bdlbs.comlbs.com/bb/map/UserAlarm';
var m_exportTrackUrl = 'http://api.bdlbs.comlbs.com/bb/reports/export/HisLocExport'

// 加载页面是加载数据
$(function () {

    var nMapHeight = $(window).height();
    var nMapWidth = $(window).width();

    //页面容器
    var oPage = new ES.TrackView.Page("MapView", {});

    // 容器内容布局
    new ES.TrackView.Layout(oPage, { nWidth: nMapWidth, nHeight: nMapHeight });

    var oMapMaster = new L.MapLib.MapMaster.Map(oPage, {
        cDidId: 'MapView',
        oMapOption: {
            zoomControl: false,
            layers: [],
            center: new L.LatLng(30.697875,111.293275),//经度:114.306221,纬度:30.576746
            zoom: 13
        },
        nMapWidth: nMapWidth,
        nMapHeight: nMapHeight
    });

    // 加载地图
    oMapMaster.loadMapMaster();

    new L.MapLib.MapControl.ESMapToolBox(oMapMaster, {});
    new L.MapLib.MapControl.ESMapTile(oMapMaster, {});

    var oBar = new ES.TrackView.Bar(oPage, {});
    new ES.TrackView.TrackChart(oPage, {});
    var oCtrl = new ES.TrackView.Control(oPage, {});

    new ES.TrackView.TrackData(oPage, {});
    new ES.TrackView.RealTrack.TrackPos(oPage, {});

    new ES.TrackView.RealTrack.TrackLine(oPage, {});
    new ES.TrackView.RealTrack.TrackMarker(oPage, {});

    // 画开始点
    new ES.TrackView.PointLayer.BeginMarker(oPage, { cPosName: "轨迹开始点", });
    // 画结束点
    new ES.TrackView.PointLayer.EndMarker(oPage, { cPosName: "轨迹结束点", });
    new ES.TrackView.PointLayer.SubMarkerMgr(oPage, { cPosName: "轨迹点", });
    new ES.TrackView.PointLayer.ParkMarkerMgr(oPage, { cPosName: "停留点", });
    new ES.TrackView.PointLayer.AlarmMarkerMgr(oPage, { cPosName: "告警点" });
    new ES.TrackView.PanelBox.ParkPanel(oPage, {});
    var oAlarmPanel = new ES.TrackView.PanelBox.AlarmPanel(oPage, {});
    oAlarmPanel.alarmFilter();

    new ES.TrackView.PanelBox.SpeedDoorWeightPanel(oPage, {});

    //new ES.VehTrackInfo.RealStatus(oPage, {});
    //new ES.VehTrackInfo.WeightChart(oPage, {});
    new ES.VehTrackInfo.SpeedChart(oPage, {});

    new ES.TrackView.AlarmTrack(oPage, {});
    new ES.TrackView.HistoryTrack(oPage, {})

    // 直接查询历史轨迹数据
    oCtrl.searchTrack();
    // 画所有工地数据到地图
    new ES.TrackView.SiteLayer(oPage, {});
    // 画所有消纳点数据到地图
    new ES.TrackView.UnloadLayer(oPage, {});

    new ES.TrackView.WorkSiteLayer(oPage,{});

    new ES.TrackView.WorkUnloadLayer(oPage,{});

    var oSusLayer = new ES.TrackView.SusSiteLayer(oPage,{});
    oSusLayer.drawLayers();

    var oSusUnload = new ES.TrackView.SusUnloadLayer(oPage,{});
    oSusUnload.drawLayers();

    $(window).resize(function () {
        $("#MapView , .ex-layout-content").css({
            height: $(window).height(),
            width: $(window).width()
        })

        $(".ex-layout-track-chart").stop().animate({
            "max-height": $(window).height() - 275 + "px",
        }, 500)
    });
})



/**
 * Created by liulin on 2017/2/22.
 */
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
}

/**
 * 车辆历史轨迹
 *
 *
 * Created by liulin on 2017/2/22.
 *
 *
 * 依赖关系：
 * 1. 依赖 echart 库
 * 2. 依赖 dialog 库
 * 3. 依赖 MapLib 库
 * 4. 依赖 ESLib 库
 * 5. 依赖 MovingMarker 库
 */

ES.TrackView = {};

ES.TrackView.Version = '0.1.0';

ES.TrackView.Config= {

    oEditRoadConfig: {
        stroke: true,
        color: '#FF3300',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 3,
        opacity: 1,
        fill: false,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    //线路样式
    oRoadConfig: {
        stroke: true,
        color: '#5eb95e',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 7,
        opacity: 0.8,
        fill: false,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    //工地样式
    oSiteConfig: {
        stroke: true,
        color: '#0FFF05',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 3,
        opacity: 1,
        fill: true,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    //笑纳点样式
    oUnloadConfig: {
        stroke: true,
        color: '#FF3300',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 3,
        opacity: 1,
        fill: true,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    //笑纳点样式
    oBandConfig: {
        stroke: true,
        color: '#FF3300',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 3,
        opacity: 1,
        fill: true,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    //实时跟踪外层圆的样式
    oLiveCircleConfig: {
        stroke: true,
        color: '#FF3300',
        dashArray: null,
        lineCap: null,
        lineJoin: null,
        weight: 1,
        opacity: 1,
        fill: true,
        fillColor: null,
        fillOpacity: 0.2,
        clickable: true,
        smoothFactor: 1.0,
        noClip: false
    },

    oLiveCircleMarkerConfig: {
        fill: true,
        fillColor: '#fff',
        radius: 3,
        weight: 1,
        opacity: 1,
        fillOpacity: 1
    },

    oTrackPosConfig:{
        fill: true,
        fillColor: '#fff',
        radius: 5,
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    },

    // 轨迹线样式
    oLiveLineConfig: {
        opacity: 1,
        color: 'blue',
        weight: 3,

    },
};

/**
 *
 * 历史轨迹在企业版本上进行修改
 * 依靠一个js 可以直接查看历史轨迹
 *
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.Layout = ES.Evented.extend({


    oOption: {
        //父亲级容器
        cContainerSel: '.ex-layout-main',
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initUI();

        this.initOn();

        this.setParentEvent();
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

    reflesh: function (nWidth,nHeight) {
        this.$_oContainer.css({width:nWidth,height:nHeight});
    },

    initUI: function () {
        this.$_oContainer =$(this.cHtml);
        $(this.oOption.cContainerSel).append(this.$_oContainer);

        this.$_oContainer.css({width:this.oOption.nWidth,height:this.oOption.nHeight});

        $('input[type="checkbox"]').uCheck();//这是统一写法
        $('input[type="checkbox"].ec-ucheck-checkbox').uCheck();//这是根据class调用

        var self = this;
        $('#Site').bind('change', function (oData) {

            if ($(this).is(':checked')) {
                ES.Util.reqData({data:{},url: '/Site/SiteInfoForTrack'}, function (oData) {
                    self._oParent.fire('TrackView.SiteLayer:DrawArea', {aoData: oData.rtnData});

                }, this);
            } else {
                self._oParent.fire('TrackView.SiteLayer:ClearArea');
            }
        });

        $('#Unload').bind('change', function (oData) {

            if ($(this).is(':checked')) {
                ES.Util.reqData({data:{ }, url: '/Unload/UnloadInfoForTrack'}, function (oData) {

                    self._oParent.fire('TrackView.UnloadLayer:DrawArea', {aoData: oData.rtnData});

                }, this);
            } else {
                self._oParent.fire('TrackView.UnloadLayer:ClearArea');
            }
        });



    },

    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        var oTemp =this.$_oContainer.find('.ex-layout-track-chart').get(0);
        L.DomEvent.addListener(oTemp, 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'mousewheel', L.DomEvent.stopPropagation);

        var oTemp =this.$_oContainer.find('.ex-layout-trackbar').get(0);
        L.DomEvent.addListener(oTemp, 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(oTemp, 'mousewheel', L.DomEvent.stopPropagation);
    },

});


ES.TrackView.Layout.include({
    // 渣土车V2.1历史轨迹
cHtml:
'<div class="ex-layout-content">' +
'   <div id="MapView" class="ex-layout-map-content">' +
'       <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left"></div>' +
'       <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right">' +
'           <div class="ex-layout-trackbar">' +
'               <div class="ex-maptool-box" >' +
'                   <i class="ec-icon-tachometer"></i>&nbsp;&nbsp;状态' +
'               </div>' +
'               <div class="ex-maptool-box">' +
'                   <i class="ec-icon-line-chart"></i>&nbsp;&nbsp;速度' +
'               </div>' +
'               <div class="ex-maptool-box" style = "display:none">' +
'                   <i class="ec-icon-check-square"></i>&nbsp;&nbsp;顶棚' +
'               </div>' +
'               <div class="ex-maptool-box" style = "display:none">' +
'                   <i class="ec-icon-map-signs"></i>&nbsp;&nbsp;行程' +
'               </div>' +
'               <div class="ex-maptool-box"  even-name="Track:Bar.dealParkMarkers">' +
'                   <i class="ec-icon-get-pocket" ></i>&nbsp;&nbsp;停留' +
'               </div>' +
'               <div class="ex-maptool-box"  even-name="Track:Bar.dealAlarmMarkers">' +
'                   <i class="ec-icon-warning"></i>&nbsp;&nbsp;报警' +
'               </div>' +
'               <div class="ex-maptool-box" style = "display:none">' +
'                   <i class="ec-icon-ils"></i>&nbsp;&nbsp;线路' +
'               </div>' +
'               <div class="ex-maptool-box pass">' +
'                   <i class="ec-icon-area-chart"></i>&nbsp;&nbsp;报表' +
'               </div>' +

// '               <div class="ex-maptool-box passCheck">' +
// '                   <i class="ec-icon-ils"></i>' +
// '                   <label for="Site" class=" ec-checkbox-inline ec-success">' +
// '                         <input type="checkbox" id="Site" name="form-checkbox" class="ec-ucheck-checkbox">工地' +
// '                   </label>' +
// '               </div>' +
//
// '               <div class="ex-maptool-box passCheck">' +
// '                   <i class="ec-icon-check-square"></i>' +
// '                   <label for="Unload" class=" ec-checkbox-inline ec-success">' +
// '                       <input type="checkbox" id="Unload" name="form-checkbox" class="ec-ucheck-checkbox">消纳点' +
// '                   </label>' +
// '               </div>' +

'           </div>' +
'       </div>' +
'       <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right" style="top:50px; box-shadow:none;">' +
'           <ul class="ex-layout-track-chart chart-width">' +
'               <li class="track-chart-box" style="height:145px;overflow:hidden">' +
'                   <dl class="ex-layout-track-chart-box">' +
'                       <a href="javascript:void(0);" class="ec-close">&times;</a>' +
'                       <dt><i class="ec-icon-tachometer"></i>&nbsp;&nbsp;状态</dt>' +
'                       <dd>' +
'                       <table class="TrackPanel-Tabel">' +
'                           <tbody>' +
'                               <tr>' +
'                                   <td><strong>行驶时长</strong></td>' +
'                                       <td class="TrackPanel-emOrStrong ec-text-right" id="total_travelPeriod"></td>' +
'                                       <td > &nbsp;&nbsp;<span id="travelPeriod_msg"></span></td>' +
'                                       <td><strong>行驶里程</strong></td>' +
'                                       <td class="TrackPanel-emOrStrong ec-text-right" id="total_mileage"></td>' +
'                                       <td> &nbsp;&nbsp;Km</td>' +
'                               </tr>' +
'                               <tr>' +
'                                   <td><strong>平均速度</strong></td>' +
'                                   <td class="TrackPanel-emOrStrong ec-text-right" id="total_avgSpeed"></td>' +
'                                   <td> &nbsp;&nbsp;Km/h</td>' +
'                                   <td><strong>轨迹点</strong></td>' +
'                                   <td class="TrackPanel-emOrStrong ec-text-right" id="total_points"></td>' +
'                                   <td>&nbsp;&nbsp;个</td>' +
'                               </tr>' +
'                               <tr>' +
'                                   <td><strong>开始时间</strong></td>' +
'                                   <td colspan="5" class="TrackPanel-emOrStrong" id="tdBeginDate" style="text-align:center;"></td>' +
'                                   <td></td>' +
'                               </tr>' +
'                               <tr>' +
'                                       <td><strong>结束时间</strong></td>' +
'                                   <td colspan="5" class="TrackPanel-emOrStrong" id="tdEndDate" style="text-align:center;"></td>' +
'                                   <td></td>' +
'                               </tr>' +
'                           </tbody>' +
'                       </table>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box">' +
'               <dl class="ex-layout-track-chart-box" style="max-height:340px;padding:0;">' +
'                   <a href="javascript:void(0);" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-line-chart"></i>&nbsp;&nbsp;速度</dt>' +
'                   <dd  style="max-height:340px">' +
'                       <div id="speedWeightDoorChartView">' +
'                           <div id="divSpeedWeightChart" style="width:380px;height:300px"> </div>' +
//'                           <div id="divDoorChart" style="width:380px;height:150px" > </div>' +
'                       </div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box">' +
'               <dl class="ex-layout-track-chart-box">' +
'                   <a href="javascript:void(0);" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-check-square"></i>&nbsp;&nbsp;顶棚</dt>' +
'                   <dd>' +
'                       <div id="speedChartsView"></div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box">' +
'               <dl class="ex-layout-track-chart-box">' +
'                   <a href="javascript:void(0);" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-map-signs"></i>&nbsp;&nbsp;行程</dt>' +
'                   <dd>' +
'                       <div id="runChartsView"></div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box">' +
'               <dl class="ex-layout-track-chart-box">' +
'                   <a href="javascript:void(0);" even-name="Track:Bar.dealParkMarkers" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-get-pocket"></i>&nbsp;&nbsp;停留</dt>' +
'                   <dd>' +
'                       <div id="parkChartView"></div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box" style="height:260px;padding:0 !important">' +
'               <dl class="ex-layout-track-chart-box">' +
'                   <a href="javascript:void(0);" even-name="Track:Bar.dealAlarmMarkers" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-warning"></i>&nbsp;&nbsp;报警</dt>' +
'                   <ul class="alarm-type">' +
'                       <li class="active" cid="">全部</li>' +
//'                       <li class="" cid="cover">未密闭</li>' +
//'                       <li class="" cid="o-earth">可疑出土</li>' +
//'                       <li class="" cid="i-earth">可疑消纳</li>' +
//'                       <li class="" cid="speed">平台超速</li>' +
//'                       <li class="" cid="work" style="display:none">非工作时间</li>' +
'                   </ul>' +
'                   <dd>' +
'                       <div id="alarmChartView"></div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box">' +
'               <dl class="ex-layout-track-chart-box">' +
'                   <a href="javascript:void(0);" class="ec-close">&times;</a>' +
'                   <dt><i class="ec-icon-ils"></i>&nbsp;&nbsp;线路</dt>' +
'                   <dd>' +
'                       <div id="speedChartsView"></div>' +
'                   </dd>' +
'               </dl>' +
'           </li>' +
'           <li class="track-chart-box"></li>' +
'       </ul>' +
'    </div>' +
'               <div id="echartsSpeed" class="echarts_box speed" style="right:0; left:inherit;bottom: 20px;"></div>' +
// '       <div class="ex-layout-maptool ex-theme-maptool ex-map-bottom ex-map-right">' +
// '           <div class="truck_box" style="display: none; zoom: 0.6; margin: 0px; background-color: rgba(255, 255, 255, 0.85098);">' +
// '               <div id="echartsWeight" class="echarts_box weight" style="display:none; width: 200px; height: 200px;top:50px;right: 20px"></div>' +
// '               <div class="ex-layout-mobile">' +
// '                   <i class="ex-icon-16 ex-icon-mobile on"></i>' +
// '                   <i class="ex-icon-16 ex-icon-bd"></i>' +
// '               </div>' +
// '               <div class="car-mask" style="display:none;">' +
// '                   <div class="car-cover" style="left: 0px;"></div>' +
// '               </div>' +
// '               <div class="car-light l-gray" style="display:none; "></div>' +
// '           </div>' +
// '       </div>' +
'   </div>' +
'   <div class="ex-layout-trackcontrol " style="width:450px">' +
'       <div class="track-control-box slideup">' +
'           <ul class="ex-layout-trackcontrol-query">' +
'               <li class="ec-form-group ec-form-select ec-form-icon">' +
'                   <label class=" ec-checkbox-inline ec-success"><input type="checkbox" checked  class="ckbPopup"/>气泡</label>' +
'               </li>' +
'               <li class="ec-form-group ec-form-select ec-form-icon">' +
'                   <label  class=" ec-checkbox-inline ec-success"><input type="checkbox" checked class="ckbTrackLine" />轨迹线</label>' +
'               </li>' +
'               <li class="ec-form-group ec-form-select ec-form-icon">' +
'                   <label  class=" ec-checkbox-inline ec-success"><input type="checkbox" class="ckbTrackPos"/>轨迹点</label>' +
'               </li>' +
'               <li class="ec-form-group">' +
'                   <label  class="ec-checkbox-inline ec-success" id="VehNo"> </label>' +
'               </li>' +
'               <li class="ec-form-group ec-form-select ec-form-icon" style="float:right;">' +
'                   <i class="ec-icon-line-chart"></i>' +
'                   <select class="ec-form-field ec-handle-playSpeed">' +
'                       <option value="50">播放速度[极速]</option>' +
'                       <option value="100">播放速度[快速]</option>' +
'                       <option value="200">播放速度[较快]</option>' +
'                       <option value="500">播放速度[一般]</option>' +
'                       <option value="1000">播放速度[慢速]</option>' +
'                   </select>' +
'               </li>' +
'           </ul>' +
'           <ul class="ex-layout-trackcontrol-console">' +
'               <li>' +
'                   <button class="ec-btn ec-btn-secondary ec-radius track-play" style="width:4rem"><i class="ec-icon-play"></i></button>' +
'                   <button class="ec-btn ec-btn-secondary ec-radius track-pause" style="width:4rem;display:none;"><i class="ec-icon-pause"></i></button>' +
'               </li>' +
'               <li>' +
'                   <button class="ec-btn ec-btn-secondary ec-radius track-replay"><i class="ec-icon-repeat"></i></button>' +
'               </li>' +
'               <li style="margin-right: inherit;">' +
'                   <div class="track-control-slider" data-range_min="0" data-range_max="100" data-cur_min="100" data-cur_max="0">' +
'                       <div class="track-control-bar"></div>' +
'                       <div class="track-control-leftGrip"></div>' +
'                   </div>' +
'                   <ul class="track-control-label"></ul>' +
'               </li>' +
'            </ul>' +
'       </div>' +
'       <ul class="ex-layout-trackcontrol-search">' +
'           <li class="ec-form-group">' +
'               <label>查找轨迹：</label>' +
'           </li>' +
'           <ul class="ex-datetime-box ec-avg-sm-2">' +
'               <li class="ec-form-group">' +
'                   <label for="form-dateStart" class="ec-form-label">开始时间：</label>' +
'                   <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
'                       <input size="16" type="text" id="txtBeginDate" value="2015-02-14 14:45" class="ec-form-field">' +
'                           <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>' +
'                   </div>' +
'               </li>' +
'               <li class="ec-form-group">' +
'                   <label for="form-dateEnd" class="ec-form-label">结束时间：</label>' +
'                   <div class="ec-input-group ec-input-group-sm date ec-form-datetime">' +
'                       <input size="16" type="text" id="txtEndDate" value="2015-02-14 14:45" class="ec-form-field">' +
'                       <span class="ec-input-group-label add-on"><i class="icon-th ec-icon-calendar"></i></span>' +
'                   </div>' +
'               </li>' +
'           </ul>' +
'           <li class="ec-form-group ec-form-select ec-form-icon">' +
'               <i class="ec-icon-clock-o"></i>' +
'               <select class="ec-form-field ec-handle-time">' +
'                   <option value="1">最近1小时</option>' +
'                   <option value="3">最近3小时</option>' +
'                   <option value="6">最近6小时</option>' +
'                   <option value="12">最近半天</option>' +
'                   <option value="24">最近1天</option>' +
'                   <option value="72">最近3天</option>' +
'                   <option value="0">手动选择</option>' +
'               </select>' +
'           </li>' +
'           <li class="ec-form-group ec-form-select ec-form-icon">' +
'               <i class="ec-icon-line-chart"></i>' +
'               <select class="ec-form-field ec-handle-speed">' +
'                   <option value="0">0km/h</option>' +
'                   <option value="2">2km/h以内</option>' +
'                   <option value="5">5km/h以内</option>' +
'                   <option value="10">10km/h以内</option>' +
'                   <option value="60">60km/h以内</option>' +
'                   <option value="80">80km/h以内</option>' +
'                   <option value="-1">不屏蔽</option>' +
'               </select>' +
'           </li>' +
'           <li class="ec-form-group">' +
'               <button class="ec-btn ec-btn-sm ec-btn-success track-search"><i class="ec-icon-search"></i> 查询轨迹</button>' +
'           </li>' +
'       </ul>' +
'    </div>' +
'</div>'


});

/**
 * name:Page.js
 * des: 负责整个页面的通信，数据共享
 * 车辆历史已经是一个公共模块
 *
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.Page = ES.Page.extend({

    oReqUrl: {
        // 查询实时状态,停留、行程数据
        oStatusUrl: {cUrl: null, cType: 'api'},

        // 查询历史轨迹
        oTrackUrl: {cUrl: m_cTrackUrl, cType: 'api', PageSize: 300, PageIndex: 1},

        // 查询告警数据
        oAlarmUrl: {cUrl: m_cAlarmUrl, cType: 'api'},

        // 查询当前中心位置信息
        oCenterPOIUrl: {cUrl: m_cSignal + '../api/util/GetPointRegion', cType: 'api'}
    },

    getUrl: function (cKey) {
        var oUrl = this.oReqUrl[cKey];
        if (!oUrl) return "";
        return oUrl.cUrl;
    },

    //页面id
    initialize: function (id, options) {

        ES.Page.prototype.initialize.call(this, id, options);

        this.initEvent();

        // 设置面板高度
        $(".ex-layout-track-chart").stop().animate({
            "max-height": $(window).height() - 275 + "px",
        }, 500);

        var cUrl = window.location.href;
        this.oWinUrl = this.getArgs(cUrl);
    },

    initEvent: function () {

    },

    getEvenName: function (cKey) {
        return this.oEvenName[cKey];
    },

    // 页面所有的事件
    oEvenName: {

        // 第一次请求数据回调
        firstReqTrackBC: 'TrackView:TrackData:firstReqTrackBC',

        // 开始轨迹回放
        play: "TrackView:Control.Play",

        // 通知定时器开始播放轨迹，
        noticeTimerPlay: 'TrackView:TrackPos.noticeTimerPlay',

        // 停止轨迹播放，定时器播放完成后,通知别人播放完成
        playFinish: 'TrackView:TrackPos.playFinish',

        // 停止播放轨迹
        pause: 'TrackView:Contorl.pause',

        // 请求下次的轨迹点
        nextReq: "TrackView:TrackData.timerReqTrack",

        // 滑块滑动完成后，开始请求推荐事件
        sliderReq: "TrackView:TrackData.sliderReq",

        // 设置播放速度
        setPlaySpeed: "TrackView:TrackPos.setPlaySpeed",

        // 设置线条的样式
        setTrackClass: "TrackView:Control.setTrackClass",

        setPosClass: "TrackView:Control.setPosClass",

        setPopupOpen: 'TrackView:Control.setPopupOpen',

        // 设置箭头图层叠加
        setToFront: "TrackView:TrackArrow.setToFront",

        // 画停留点触发事件
        drawParkMarker: "TrackView:Penal.drawParkMarker",

        localParkMarker: "TrackView:Penal.localParkMarker",

        setParkData: "TrackView:Penal.setParkData",

        // 告警数据处理
        // 画停留点触发事件
        drawAlarmMarker: "TrackView:Penal.drawAlarmMarker",

        // 定位停留点
        localAlarmMarker: "TrackView:Penal.localAlarmMarker",

        // 设置停留点数据
        setAlarmData: "TrackView:Penal.setAlarmData",

        clearMap: "Track:Cotrol.clearMap",
    },

    getArgs: function (cUrl) {
        var query = location.search.substring(1);
        if (!cUrl) {
            query = cUrl;
        }
        var args = {};
        var pairs = query.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos === -1) {
                continue;
            }
            var argname = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            args[argname] = value;
        }
        return args;
    },

    getDevNo:function() {
        return this.oWinUrl.PhoneNum;
    },

    getToken:function(){
        return this.oWinUrl.token;
    },

    // 获得可疑工地多变形的数据
    getLatLngs:function () {

        if (!this.oWinUrl.LeftTop || !this.oWinUrl.RightBottom) {
            return;
        }

        var acBegin = this.oWinUrl.LeftTop.split(',');
        var acEnd = this.oWinUrl.RightBottom.split(',');

        var dX = parseFloat(acBegin[0]);
        var dY = parseFloat(acBegin[1]);

        var dX1 = parseFloat(acEnd[0]);
        var dY1 = parseFloat(acEnd[1]);

        var aoLatLng = [{lat: dY, lng: dX}, {lat: dY, lng: dX1}, {lat: dY1, lng: dX1}, {lat: dY1, lng: dX}];

        return aoLatLng;

    },

    // 获得可疑消纳场多变形的数据
    getSusUnloadLatLngs:function () {

        if (!this.oWinUrl.UnloadLeftTop || !this.oWinUrl.UnloadRightBottom) {
            return;
        }

        var acBegin = this.oWinUrl.UnloadLeftTop.split(',');
        var acEnd = this.oWinUrl.UnloadRightBottom.split(',');

        var dX = parseFloat(acBegin[0]);
        var dY = parseFloat(acBegin[1]);

        var dX1 = parseFloat(acEnd[0]);
        var dY1 = parseFloat(acEnd[1]);

        var aoLatLng = [{lat: dY, lng: dX}, {lat: dY, lng: dX1}, {lat: dY1, lng: dX1}, {lat: dY1, lng: dX}];

        return aoLatLng;

    },

    getVehNo:function() {
        return this.oWinUrl.VehicleNo;
    },

    getSiteId:function() {
        return this.oWinUrl.SiteId;
    },



    getUnloadId:function() {
        return this.oWinUrl.UnloadId;
    },

});




ES.TrackView.Page.include({


    trackSearch: function () {

        if (!this.GetQueryString("nBTick")) {
            return;
        }

        $(".track-search").click();

    },

    GetQueryString:function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null){
            return unescape(r[2]);
        }
        return null;
    },

})

/**
 * des: 对状态条的控制操作
 *
 *
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.Bar = ES.Class.extend({
    oOption: {
        cEvenShowBox: 'TrackView:TrackChart.showBox',
    },
    // 构造函数
    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        // bar 的操作
        this.$_oBar = $(".ex-layout-trackbar");

        this.initEven()
    },

    initEven: function () {

        var self = this;
        this.$_oBar.find(".ex-maptool-box:not(.pass.passCheck)").bind('click', function () {
            var oBox = { nIndex: $(this).index(), bIsShow: false };

            self._oParent.fire(self.oOption.cEvenShowBox, { oBox: oBox });
            var cColor = oBox.bIsShow ?  '#5e7aea':'#3bb4f2';

            var cEvenName = $(this).attr("even-name");
            if (cEvenName) {
                self._oParent.fire(cEvenName, { bIsDraw: !oBox.bIsShow });
            }

            $(this).css('background-color', cColor);
        });

    },
});

/**
 * 播放轨迹控制 -- 在页面的下左方
 *
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.Control = ES.Class.extend({

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.initControl();
        this.initEvent();
        this.initOn();
    },

    // 检查是否查询数据
    searchTrack:function() {
        if (!m_nBTick || !m_nETick) {
            return;
        }
        $('#txtBeginDate').val(ES.Util.dateFormat(m_nBTick * 1000, 'yyyy-MM-dd hh:mm:ss'));
        $('#txtEndDate').val(ES.Util.dateFormat(m_nETick * 1000, 'yyyy-MM-dd hh:mm:ss'));
        $(".ec-handle-time").val('0');
        $('.track-search').click();
    },

    initEvent: function () {
        $('#txtBeginDate').val(ES.Util.dateFormat(new Date().getTime() - 60 * 60 * 1000, 'yyyy-MM-dd hh:mm:ss'));
        $('#txtEndDate').val(ES.Util.dateFormat(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss'));

        $('.ec-form-datetime').datetimepicker({
            language: 'zh-CN',
            format: 'yyyy-mm-dd hh:ii:ss',
            autoclose: true,
            todayBtn: true,
            pickerPosition: 'top-left',
        });

        $('.ec-handle-time').bind('click', function () {
            if ($(this).val() == '0') {
                $('.ex-datetime-box').show();
            } else {
                $('.ex-datetime-box').hide();
            }
        });

        // 初始化查询按钮
        this.initSearchEven();

        // 设置暂停和播放
        this.initPlayEven();

        // 设置播放速度
        this.initPlaySpeedEven();

        // 重新播放轨迹
        this.initReplay();

        this.initCkbEven();
    },

    // 注册查询事件
    initSearchEven: function () {

        var self = this;
        $('.track-search').bind('click', function () {

            self._oParent.fire("TV:firstReqTrack");
            self._oParent.fire(self._oParent.getEvenName("clearMap"));
            self.backStatus();
        })
    },

    initControl: function () {
        var _poi = [1, 2];
        var _poiNum = _poi.length;
        $('.track-control-label').addClass('ec-avg-sm-' + _poiNum);
        for (var i = 0; i <= _poiNum - 1; i++) {
            $('.track-control-label').append('<li>' + _poi[i] + '</li>');
        }

        $('.track-control-label > li:first-child').html('<span class="ec-align-left">起</span>')
        $('.track-control-label > li:last-child').html('终')

        var self = this;
        $('.track-control-slider').attr({ 'data-range_max': 100, 'data-cur_min': 0 }).nstSlider({
            "left_grip_selector": ".track-control-leftGrip",
            "value_bar_selector": ".track-control-bar",

            // 注册事件
            "user_mouseup_callback": function (leftValue, rightValue, isLeftGrip) {
                // 移动滑块 触发事件，如果是播放，直接修改位置
                self._oParent.fire('Track:moveSliderCursor', { nIndex: leftValue });
                self._oParent.on('Track:setSliderCursor', self.setSliderCursor, self);
            },
            "user_drag_start_callback":function(leftValue, rightValue, isLeftGrip){
                self._oParent.off('Track:setSliderCursor', self.setSliderCursor, self);
            }
        });

        $('#VehNo').html(this._oParent.getVehNo());
    },

    // 初始化滑块
    initSlider: function (oData) {
        if (!oData || !oData.hasOwnProperty("nTotalPage")) {
            console.log(ESLang.TrackView.Contorl[1]);
            return;
        }
        this.setCursor(0);

        $('.ex-datetime-box').hide();
        $('.track-control-box').show().addClass('in');
    },

    // 设置控制
    initOn: function () {
        // 第一次查询，设置查询控件,初始化滑块控件
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.firstReqTrackBC, this);
        this._oParent.on(this._oParent.getEvenName("playFinish"), this.playFinish, this);
        // timer 查询轨迹结束时设置滑块的值
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.setSliderCursor, this);
        this._oParent.on('Track:setSliderCursor', this.setSliderCursor, this);
        // 注册委托事件
        this._oParent.getSearchTime = this.getSearchTime;
        this._oParent.getSearchSpeed = this.getSearchSpeed;
        this._oParent.getCkbStatus = this.getCkbStatus
    },

    setSliderCursor: function (oData) {
        this.setCursor(oData.nIndex);
    },

    setCursor:function(nIndex){
        $('.track-control-slider').nstSlider("set_position", nIndex);
    },

    // 第一次请求要初始化滑块
    firstReqTrackBC: function (oData) {
        if (oData.nTotalPage <= 0) {
            ES.aWarn("没有查询到车辆的历史轨迹！");
            return;
        }
        var aoTrack = oData.aoTrack;
        if (!aoTrack || aoTrack.length <= 0) {
            // 设置值
            ES.aWarn("当前车辆停留，请播放轨迹，查看轨迹数据！");
            //return;
        }

        this.initSlider(oData);

    },

    // 获得每个控件的值
    //  查询时间
    getSearchTime: function () {
        var nVal = parseInt($(".ec-handle-time").val());
        var nBeginT = 0
        var nEndT = 0;

        if (nVal === 0) {
            nBeginT = $("#txtBeginDate").val();
            nEndT = $("#txtEndDate").val();
        }
        else {
            nEndT = new Date().getTime();
            nBeginT = nEndT - nVal * 60 * 60 * 1000;
        }

        var cEndDate = ES.Util.dateFormat(nEndT, "yyyy-MM-dd hh:mm:ss");
        var cBeginData = ES.Util.dateFormat(nBeginT, "yyyy-MM-dd hh:mm:ss");
        var oParam = {
            //nBeginT: nBeginT,
            //nEndT: nEndT,
            EndTime: cEndDate,
            StartTime: cBeginData
        }
        return oParam;
    },

    getSearchSpeed: function () {
        var nVal = parseInt($(".ec-handle-speed").val());
        return nVal;
    },

    // 获得ckb 的基本状态
    getCkbStatus: function () {

        var oCkbStatus = {
            bIsPopup: false,
            bIsTrackLine: false,
            bIsTrackPos: false,
        };
        oCkbStatus.bIsPopup = $("ul.ex-layout-trackcontrol-query").find("input.ckbPopup").is(":checked");
        oCkbStatus.bIsTrackLine = $("ul.ex-layout-trackcontrol-query").find("input.ckbTrackLine").is(":checked");
        oCkbStatus.bIsTrackPos = $("ul.ex-layout-trackcontrol-query").find("input.ckbTrackPos").is(":checked");
        return oCkbStatus;
    },

    //轨迹播放
    initPlayEven: function () {
        var self = this;
        $('.track-play').bind('click', function () {
            $(this).hide();
            $('.track-pause').show();
            // 广播开始播放轨迹

            self._oParent.fire(self._oParent.getEvenName("play"));
        });

        // 暂停播放
        $('.track-pause').bind('click', function () {
            $(this).hide();
            $('.track-play').show();
            self._oParent.fire(self._oParent.getEvenName("pause"));
        });
    },

    // 设置当前状态为停止播放
    playFinish: function (oData) {
        //var nIndex = oData.nPage - 1;
        //this.setCursor(nIndex);

        $('.track-pause').hide();
        $('.track-play').show();

    },

    backStatus: function () {
        $('.track-pause').hide();
        $('.track-play').show();
    },

    notBackStatus: function () {
        $('.track-pause').show();
        $('.track-play').hide();
    },

    // 设置播放速度
    initPlaySpeedEven: function () {
        var self = this;
        $(".ec-handle-playSpeed").bind("change", function () {
            self._oParent.fire(self._oParent.getEvenName("setPlaySpeed"), { nSpeed: parseInt($(this).val()) });
        })
    },

    // 设置重新播放
    initReplay: function () {

        var self = this;
        // 重新播放轨迹
        $(".track-replay").bind("click", function () {
            self.notBackStatus();
            self._oParent.fire(self._oParent.getEvenName("sliderReq"), { nPage: 0 });
        })
    },

    initCkbEven: function () {
        //setTrackClass
        var self = this;
        $("ul.ex-layout-trackcontrol-query").find("input.ckbTrackLine").bind("click", function () {
            self._oParent.fire(self._oParent.getEvenName("setTrackClass"));
        })
        $("ul.ex-layout-trackcontrol-query").find("input.ckbTrackPos").bind("click", function () {
            self._oParent.fire(self._oParent.getEvenName("setPosClass"));
        })
        $("ul.ex-layout-trackcontrol-query").find("input.ckbPopup").bind("click", function () {
            self._oParent.fire(self._oParent.getEvenName("setPopupOpen"));
        })
    },
})

/**
 * 对显示面板的控制
 * 对 box 的显示控制操作
 *
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.TrackChart = ES.Class.extend({

    oOption: {
        cJTab: '.ex-layout-track-chart > li.track-chart-box',
        cEvenShowBox: 'TrackView:TrackChart.showBox',
    },

    // 构造函数
    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);
        // bar 的操作
        this.$_oTab = $(this.oOption.cJTab);

        this.initEven();

        this.initOn();
    },

    initOn: function () {
        this._oParent.on(this.oOption.cEvenShowBox, this.showBox, this);
    },

    // 显示box 的操作
    showBox: function (oData) {
        if (!oData || !oData.oBox || isNaN(oData.oBox.nIndex)) return;

        var oTab = this.$_oTab.eq(oData.oBox.nIndex);
        var cState = oTab.css("display");
        if (cState === "none") {
            oData.oBox.bIsShow = false;
            oTab.slideDown();
        }
        else {
            oTab.slideUp();
            oData.oBox.bIsShow = true;
        }
    },


    initEven: function () {
        var self = this;
        $('.ex-layout-track-chart-box > a.ec-close').bind('click', function () {
            var $this = $(this).closest('li.track-chart-box');
            var $that = $('.ex-layout-trackbar > .ex-maptool-box:not(".pass")').eq($this.index());
            $this.slideUp();
            $that.css('background-color', '#5e7aea');

            var cDataEven = $(this).attr("even-name")
            if (cDataEven)
            {
                self._oParent.fire(cDataEven, { bIsDraw: true });
            }
        });


    }
});

/**
 * des: 负责整个历史轨迹数据处理
 *
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.TrackData = ES.Class.extend({

    initialize: function (oParent, oOption) {

        this._oParent = oParent;
        ES.setOptions(this, oOption);

        // 轨迹请求参数
        this.cUrl = oParent.getUrl('oTrackUrl');

        //保存请求的轨迹数据，数组引用不能清空，每次请求的数据都需要按照时间排序处理
        this.aoTrack = new Array();

        //实例对象，用于缓存轨迹数值
        this.m_oTrack = {};

        // 缓存每次请求的分页数
        this.nPage = 0;

        //请求轨迹的相关信息
        this.m_oTrackInfo = { nTotalCnt: 0, nTotalPage: 0, nPageSize: 100, nPage: 0 };

        this.initOn();

    },

    initOn: function () {

        //监听timer 时间到请求timerReqTrack
        this._oParent.on(this._oParent.getEvenName('nextReq'), this.timerReqTrack, this);
        //监听滑块请求
        this._oParent.on('TV:sliderQueryTrack', this.sliderQueryTrack, this);

        this._oParent.on('TV:firstReqTrack', this.firstReqTrack, this);

        this._oParent.on(this._oParent.getEvenName('sliderReq'), this.sliderReq, this);
    },

    // 获得查询参数，如果获得成功返回true，否则返回false,查询所有轨迹
    getReqParam: function () {
        var oParam = this._oParent.getSearchTime();
        if (!oParam) return false;
        //this._oParent.getSearchSpeed()
        this.oReqParam= {
            searchModel: {
                PhoneNums: [this._oParent.getDevNo()],
                StartTime: oParam.StartTime,
                EndTime: oParam.EndTime
            },
            editModel: {},
            pageIndex: 1,
            pageSize: 10000
        }

        // this.oReqParam = {
        //     exparameters: {
        //         PhoneNums_parms: this._oParent.getDevNo(),
        //         StartTime: oParam.StartTime,
        //         EndTime: oParam.EndTime,
        //         PhoneNums: [this._oParent.getDevNo()],
        //         MinSpeed: -1,
        //         IsGpsTimeDesc: -1,
        //     },
        //     page:1,
        //     rows:10000
        // };

        //ES.extend(this.oReqParam, this._oParent.getSearchTime());
        return true;
    },

    //首次加载轨迹数据，点击查询时
    firstReqTrack: function () {

        var bVal = this.getReqParam();
        if (!bVal) {
            return;
        }

        //第一次请求时，要清除查询数据，
        delete this.m_oTrack;
        // 然后在加载数据
        this.m_oTrack = {};
        this.m_oTrackInfo = { nTotalCnt: 0, nTotalPage: 0, nPageSize: 100, nPage: 0 };
        //请求数据时，清空数据
        this.aoTrack.splice(0, this.aoTrack.length);
        this.nPage = 1;

        ES.loadAn('body',' ');
        // 执行请求
        ES.getData(JSON.stringify(this.oReqParam), this.cUrl, this.fristCallBack, this,
            null,
            {
                headers: {
                    token: this._oParent.getToken(),
                    "Content-Type": 'application/json; charset=utf-8'
                }
            }
        );

    },

    // 第一次请求返回处理
    fristCallBack: function (oTrackInfo) {

        if (!oTrackInfo || !oTrackInfo.detail || !oTrackInfo.detail.DataItems || oTrackInfo.detail.DataItems.length <= 0) {
            // 移除遮罩层
            ES.removeAn('body', ' ');
            ES.aWarn('没有查询到历史轨迹！');
            return;
        }

        var oRtn = this.reqTrackCallBack(oTrackInfo);

        //以事件机制加载数据,广播查询结果，广播轨迹数据
        this._oParent.fire(this._oParent.getEvenName('firstReqTrackBC'), oRtn);
    },

    // 处理轨迹，让他满足要求
    reqTrackCallBack: function (oTrackInfo) {
        // 移除遮罩层
        ES.removeAn('body', ' ');

        var nSpeed = this._oParent.getSearchSpeed()
        var aoTotalTrack = [];
        var aoTrack = [];
        for (var i = oTrackInfo.detail.DataItems.length - 1; i >= 0; i--) {

            oTrackInfo.detail.DataItems[i].Lng = oTrackInfo.detail.DataItems[i].Poi.MapPoint.Lon;
            oTrackInfo.detail.DataItems[i].Lat = oTrackInfo.detail.DataItems[i].Poi.MapPoint.Lat;
            if (oTrackInfo.detail.DataItems[i].Speed > nSpeed) {
                aoTrack.push(oTrackInfo.detail.DataItems[i]);
            }
            aoTotalTrack.push(oTrackInfo.detail.DataItems[i]);
        }
        // 设置当页轨迹
        this.m_oTrack[1] = aoTrack;

        var oRtn = {
            // 总的轨迹数据
            aoTotalTrack:aoTotalTrack,
            // 实际过滤轨迹数据
            aoTrack: aoTrack,
            // 当前分页的轨迹数据
            aoPageTrack: aoTrack,
            // 轨迹当前页
            nPage: 1,
            // 总页数
            nTotalPage: 1
        }

        return oRtn
        //this.aoTrack.sort(function (a, b) { return a.GpsTime > b.GpsTime ? 1 : -1 });
    },

    //timer时间到了，再次请求数据
    timerReqTrack: function () {

        //在请求前判断是否结束请求
        var nBeginReqPage = this.oReqParam.page;

        if (nBeginReqPage > this.m_oTrackInfo.nTotalPage) {
            //结束轨迹回放,修改按钮状态
            this._oParent.fire(this._oParent.getEvenName('playFinish'), { nPage: nBeginReqPage });
            ES.aWarn('历史轨迹播放完毕！');
            return;
        }

        if (this.m_oTrack.hasOwnProperty(nBeginReqPage)) {

            this._oParent.fire(this._oParent.getEvenName('noticeTimerPlay'), {
                aoTrack: this.aoTrack,
                aoPageTrack: this.m_oTrack[nBeginReqPage],
                nPage: nBeginReqPage,
                nTotalPage: this.m_oTrackInfo.nTotalPage,
            });

            // 下一次请求的分页数
            this.oReqParam.page = nBeginReqPage + 1;

            return;
        };

        ES.loadAn('body');

        // 执行请求
        ES.getData(JSON.stringify(this.oReqParam), this.cUrl, this.timerReqCallBack, this,
            null,
            {
                headers: {
                    token: this._oParent.getToken(),
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });

    },

    timerReqCallBack: function (oTrackInfo) {
        if (!oTrackInfo || !oTrackInfo.DataList || oTrackInfo.DataList.length<=0) {
            // 移除遮罩层
            ES.removeAn('body', ' ');
            ES.aWarn('没有查询到历史轨迹！');
            return;
        }

        this.ReqTrackCallBack(oTrackInfo);

        //以事件机制加载数据,广播查询结果，广播轨迹数据
        this._oParent.fire(this._oParent.getEvenName('noticeTimerPlay'), {
            // 总的轨迹数据
            aoTrack: this.aoTrack,
            // 当前分页的轨迹数据
            aoPageTrack: oTrackInfo.DataList,
            // 轨迹当前页
            nPage: oTrackInfo.page,
            // 总页数
            nTotalPage: this.m_oTrackInfo.nTotalPage,
        });
    },

    sliderReq: function (oData) {
        var nPage = oData.nPage + 1;
        //判断是否有该属性
        if (this.m_oTrack.hasOwnProperty(nPage)) {

            this._oParent.fire(this._oParent.getEvenName('noticeTimerPlay'), {
                aoTrack: this.aoTrack,
                aoPageTrack: this.m_oTrack[nPage],
                nPage: nPage,
                nTotalPage: this.m_oTrackInfo.nTotalPage,
            });


            //判断是发有这个属性,返回轨迹
            this.oReqParam.page = nPage + 1;
            return;
        }

        this.oReqParam.page = nPage;
        ES.loadAn('body');
        ES.getData(JSON.stringify(this.oReqParam), this.cUrl, this.sliderReqCallBack, this,
            null,
            {
                headers: {
                    token: this._oParent.getToken(),
                    "Content-Type": 'application/json; charset=utf-8'
                }
            }
        );

    },

    sliderReqCallBack: function (oTrackInfo) {


        if (!oTrackInfo || !oTrackInfo.detail || !oTrackInfo.detail.DataItems || oTrackInfo.detail.DataItems.length <= 0) {
            // 移除遮罩层
            ES.removeAn('body', ' ');
            ES.aWarn('没有查询到历史轨迹！');
            return;
        }

        this.ReqTrackCallBack(oTrackInfo);
        //以事件机制加载数据,广播查询结果，广播轨迹数据
        this._oParent.fire(this._oParent.getEvenName('noticeTimerPlay'), {
            // 总的轨迹数据
            aoTrack: this.aoTrack,
            // 当前分页的轨迹数据
            aoPageTrack: oTrackInfo.DataList,
            // 轨迹当前页
            nPage: oTrackInfo.page,
            // 总页数
            nTotalPage: this.m_oTrackInfo.nTotalPage,
        });
    },

})

/**
 * 报表内容弹出
 * Created by liulin on 2017/2/23.
 */


ES.TrackView.HistoryTrack = ES.Class.extend({
    oOption: {
        nTrackWinWidth: 1000,
        nTrackWinHeight:500,
    },

    _aoHistoryTrackData: [],

    initialize: function (oParent, options,oJqGridOption) {
        this._oParent = oParent;
        options = ES.setOptions(this, options);
        this.initEvent();
        this.initOn();
    },

    initOn: function () {
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.fristHandler, this);
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.setAllTrackInfo, this);
    },

    initEvent: function () {
        var self = this;
        $(".ex-layout-trackbar .ex-maptool-box.pass").bind("click", function () {
            self.historyTrackWindow()
        });
    },

    //报表容器
    msg: function () {
        var cHtml = '<div class="ex-layout-warning-grid-box">' +
            '<div style="float:left;width:80%"></div>' +
            '<div style="float:right;width:60px"></div>' +
            '<div id="dtHistoryTrackContainer" class="dt-grid-container" style="width:100%;max-height:400px;clear:both"></div>' +
            '<div id="historyTracGrdTbar" class="dt-grid-toolbar-container"></div>' +
            '</div>';
        return cHtml;
    },

    //历史轨迹窗口设置
    historyTrackWindow: function () {
        if (!this.oWnd) {
            this.oWnd = this.getWnd();
            this.initGrid();
        }
        this.oWnd.show();
    },
    //空白窗口
    getWnd: function () {
        var cTitle = '历史轨迹';
        var self = this;
        var oHistoryWindow = dialog({
            fixed: true,
            align: "right bottom",
            title: cTitle,

            content: this.msg(),
            width: this.oOption.nTrackWinWidth,
            //height:this.oOption.nTrackWinHeight,
            button:[
                {
                    value: "导出数据",
                    callback: function () {
                        self.exportGrid();
                        return false;
                    },
                    autofocus: true
                },
            ],
            onclose: function () {
                self.oWnd = null;
            }
        });
        return oHistoryWindow;
    },
    exportGrid:function() {
        var VP = this._oParent.oWinUrl;
        var oParam = this._oParent.getSearchTime();
        var StartTime = oParam.StartTime;
        var EndTime = oParam.EndTime;
        var PhoneNums_parms = VP.PhoneNum;
        var VehicleNo = VP.VehicleNo;
        var IsGpsTimeDesc = -1;
        var MinSpeed = this._oParent.getSearchSpeed();
        window.location.href = m_exportTrackUrl + '?StartTime='+StartTime+
            '&EndTime='+EndTime+
            '&PhoneNums_parms='+PhoneNums_parms+
            '&VehicleNo='+VehicleNo+
            '&IsGpsTimeDesc='+IsGpsTimeDesc+
            '&MinSpeed='+MinSpeed;
    },
    initGrid: function () {
        var dtGridOption = {
            lang: 'zh-cn',
            ajaxLoad: false,
            datas: this._aoHistoryTrackData,
            columns: this.getDtGridColumns(),
            gridContainer: 'dtHistoryTrackContainer',
            toolbarContainer: "historyTracGrdTbar",
            tools: "",
            pageSize: 10,
            pageSizeLimit: [10, 20, 30, 50],
            onSelectRow: function (cId, d, e) {
                var record = $(this).data('oData').dataList[parseInt(cId) - 1];
                self.initClick(e, record);
            }
        };
        //报表内容设置
        var dtgrid = this.oAlarmGrid = $.fn.DtGrid.init(dtGridOption);
        dtgrid.load();
    },

    //行名
    getDtGridColumns: function () {
        var dtGridColumns = [
            //VehicleNo、、CompanyName
            { id: 'VehicleNo', title: '车牌', columnClass: 'ec-text-center' },
            { id: 'CompanyName', title: '企业', columnClass: 'ec-text-center' },
            { id: 'Speed', title: '速度(Km/h)', columnClass: 'ec-text-center' },
            { id: 'Direction', title: '方向', columnClass: 'ec-text-center' },
            { id: 'Mileage', title: '累积里程(Km)', columnClass: 'ec-text-center' },
            { id: 'Lng', title: '经度', columnClass: 'ec-text-center' },
            { id: 'Lat', title: '纬度', columnClass: 'ec-text-center' },
            { id: 'PoiInfo', title: '位置', columnClass: 'ec-text-center' },
            { id: 'GpsTime', title: '定位时间', columnClass: 'ec-text-center' }

        ];
        return dtGridColumns;
    },
    initClick:function(e,oModel){
    },
    //第一段轨迹
    fristHandler: function (oData) {
        if (this._aoHistoryTrackData && this._aoHistoryTrackData.length >= 0) {
            this._aoHistoryTrackData.splice(0, this._aoHistoryTrackData.length);
        }
        var aoTrack = this.convertData(oData);
        $.merge(this._aoHistoryTrackData, aoTrack);

        if (!this.oAlarmGrid) return;
        this.oAlarmGrid.reload(true);
    },
    //第二次及以后数据
    setAllTrackInfo: function (oData) {
        var aoTrack = this.convertData(oData);
        $.merge(this._aoHistoryTrackData, aoTrack);

        if (!this.oAlarmGrid) return;
        this.oAlarmGrid.reload(true);
    },
    convertData: function (oData) {
        var aoTrack = oData.aoPageTrack.map(function (oItem) {
            var oTemp = {};
            oTemp.VehicleNo = oItem.VehicleNo;
            oTemp.CompanyName = oItem.CompanyName;
            oTemp.Direction = ES.TrackHelper.getDire(oItem.Direction);
            oTemp.Mileage = (oItem.Mileage * 0.001).toFixed(2);
            oTemp.Lng =oItem.Poi.GeoPoint.Lon;// parseFloat(oItem.Lng).toFixed(6);
            oTemp.Lat =oItem.Poi.GeoPoint.Lat;// oItem.Lat;//parseFloat(oItem.Lat).toFixed(6);
            oTemp.GpsTime =  oItem.GpsDateTime ;
            oTemp.Speed = oItem.Speed;
            oTemp.PoiInfo = oItem.Poi.Address;

            return oTemp;
        });
        return aoTrack;
    },

});

/**
 * Created by liulin on 2017/2/23.
 */

ES.TrackView.AlarmTrack = L.MapLib.MapMaster.MapOpr.extend({

    oOption: {
        trackConfig:{ color: 'orange',opacity: 1 },
    },

    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption);
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.cUrl = this._oParent.getUrl("oTrackUrl");

        this.initLayer();
        this.initOn();
    },

    initLayer: function () {
        this._oAlarmLayerGroup = new L.featureGroup();
        this._oAlarmLayerGroup.addTo(this._oMap);
    },

    initOn: function () {
        this._oParent.on(this._oParent.getEvenName('localAlarmMarker'), this.getReqParam, this);
        this._oParent.on("ES.MapOpr.TrackView.TrackArrow: moveend", this.bringToTop, this);
        this._oParent.on("Track:Bar.dealAlarmMarkers", this.closeWindow, this);
    },

    //轨迹线置顶
    bringToTop: function () {
        if (!this._oAlarmLayerGroup) return;
        this._oAlarmLayerGroup.bringToFront();
    },

    //获取查询参数
    getReqParam: function (oData) {
        var oParam = this.getSearchTime(oData);

        if (!oParam) return false;

        this.oReqParam = {
            StartTime: "2000-01-01",
            EndTime: "2000-01-02",
            PhoneNum: m_PhoneNum,
            MinSpeed: this._oParent.getSearchSpeed(),
            PageSize: 800,
            PageIndex: 1,
        };

        ES.extend(this.oReqParam, oParam);
        this.getAlarmTrack()

    },

    //获取查询时间
    getSearchTime: function (oData) {

        var nBeginT = oData.oItem.AlarmStartTimeStamp * 1000;
        var nEndT = oData.oItem.LastUpdateTimeStamp * 1000;

        var cBeginData = ES.Util.dateFormat(nBeginT, "yyyy-MM-dd hh:mm:ss");
        var cEndDate = ES.Util.dateFormat(nEndT, "yyyy-MM-dd hh:mm:ss");

        var oParam = {
            nBeginT: nBeginT,
            nEndT: nEndT,
            EndTime: cEndDate,
            StartTime: cBeginData
        }
        return oParam;

    },

    //获取告警轨迹数据
    getAlarmTrack: function () {
        ES.getData(JSON.stringify(this.oReqParam), this.cUrl, this.fnCallBack, this);
    },

    //画告警轨迹线
    fnCallBack: function (oData) {
        this.clearMap();
        var aoLatLng = oData.dataList.map(function (oItem) {
            return [oItem.Poi.MapPoint.Lat, oItem.Poi.MapPoint.Lon]
        })
        var oLineLayer = L.polyline(aoLatLng, this.oOption.trackConfig);
        oLineLayer.addTo(this._oAlarmLayerGroup);
    },

    //关闭窗口时，清除告警线
    closeWindow: function (oData) {
        if (!oData.bIsDraw) {
            this.clearMap()
        }
    },

    clearMap: function () {
        this._oAlarmLayerGroup.clearLayers();
    },
})

/**
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.PanelBox={};

ES.TrackView.PanelBox.BasePanel = ES.Class.extend({

});

/**
 * 告警查询操作
 * 告警 按照类型来查询
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.PanelBox.AlarmPanel = ES.TrackView.PanelBox.BasePanel.extend({

    oOption: {
        cAlarmDiv: "alarmChartView",
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.initOn();

    },

    // 设置报警类型
    initAlarmTypeUI:function () {

        $('ul.alarm-type').empty();
        var oParam = {
            searchModel: {
                menu_id: 1892,
            },
            buttonId: 1,
            pageIndex: 1,
            pageSize: 10,
        };

        ES.getData(JSON.stringify(oParam),this._oParent.getUrl("oAlarmUrl"),function(oData) {
                //初始化数据到界面
                if (!oData || oData.code !== 1 || !oData.detail || oData.detail.length <= 0) {
                    return;
                }
                oData.detail.unshift({dicKey:'',remark:'全部'});
                for (var i = 0; i < oData.detail.length; i++) {
                    var oItem = oData.detail[i];
                    oItem.cCls = '';
                    if (i === 0) {
                        oItem.cCls = 'active';
                    }
                    var li = '<li cid="{dicKey}" class="{cCls}">{remark}</li>'
                    var oli = $(ES.template(li, oItem));
                    $('ul.alarm-type').append(oli);
                }


            },this,null,
            {
                headers: {
                    token: this._oParent.getToken(),
                    "Content-Type": 'application/json; charset=utf-8'
                }
            }
        );

    },

    // 点击查询
    initOn: function () {
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.initUI, this);

        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    clearMap: function () {
        $("#" + this.oOption.cAlarmDiv).empty();
    },

    // 获得查询参数，如果获得成功返回true，否则返回false
    getReqParam: function () {
        var oParam = this._oParent.getSearchTime();
        if (!oParam) {
            return false;
        }

        // 查询所有的高级明细
        this.oReqParam = {
            searchModel: {
                menu_id: 1892,
                startTime: oParam.StartTime,
                endTime: oParam.EndTime,
                devNo: this._oParent.getDevNo(),
            },
            buttonId: 2,
            pageIndex: 1,
            pageSize: 200,
        };

        return true;
    },

    // 设置界面
    initUI: function () {

        if (!this.getReqParam()) return;
        if (!this._oParent.getUrl("oAlarmUrl")) {
            return
        }
        ES.loadAn(this.oOption.cAlarmDiv, "#");

        this.initAlarmTypeUI();

        ES.getData(JSON.stringify(this.oReqParam), this._oParent.getUrl("oAlarmUrl"), this.InitUIHandler, this,
            null,
            {
                headers: {
                    token: this._oParent.getToken(),
                    "Content-Type": 'application/json; charset=utf-8'
                }
            }
        );
    },

    // 设置值
    InitUIHandler: function (oData) {
        if (!oData  || oData.length <= 0) {
            ES.removeAn("body", ' ');
            return;
        };

        var aoAlarm = oData;

        // 请求的停留数据要做标记
        for (var i = 0 ; i < aoAlarm.length; i++) {
            aoAlarm[i].nIndex = i;
        };

        // 设置数据
        this._oParent.fire(this._oParent.getEvenName("setAlarmData"), {aoAlarm:aoAlarm});

        this.initDataAlarm(aoAlarm);

        var $_oLI = $("#" + this.oOption.cAlarmDiv).parent().parent();
        // 判断是否要加载
        if ($_oLI.css("display") === "none") {
            return;
        }

        //显示告警框时触发事件，返回true
        this._oParent.fire("Track:Bar.dealAlarmMarkers", { bIsDraw: false });
    },

    initDataAlarm: function (oData) {
        var self = this;
        if (!oData || oData.length <= 0) {
            return;
        }
        var aoAlarm = oData;

        var oLi = $("#" + this.oOption.cAlarmDiv).empty();

        for (var i = 0 ; i < aoAlarm.length ; i++) {
            ES.Util.initTag(oLi, this.getAlarmConfig(aoAlarm[i]));
            $("div.alarmRecord[cId='" + aoAlarm[i].nIndex + "']").data("oItem", { oItem: aoAlarm[i] });
        }


        // 注册点击事件
        $(".alarmRecord").bind("click", this, function (e) {
            var oItem = $(this).data('oItem');
            self._oParent.fire(self._oParent.getEvenName('localAlarmMarker'), oItem);

            $(this).removeClass("selected");
            $(this).addClass("selected");
        });

        //this.oParent.fire("TV:stopFinish");
    },

    //获得告警记录数据
    getAlarmConfig: function (oItem) {

        oRunConfig = {

            div: {
                class: 'TrackPanel-mRow TrackPanel-hoverRow alarmRecord',
                cId: oItem.nIndex,
                span: [
                    { class: 'TrackPanel-icon over-speed' },
                    { class: 'TrackPanel-emOrStrong', html: '[' + ES.TrackHelper.getAlarmTypeName(oItem.AlarmType) + ']' },
                    { html: oItem.AlarmPoi.Address +'</br>'},
                    { html: '时间：' + ES.Util.dateFormat(oItem.AlarmTime * 1000, "yyyy-MM-dd hh:mm") },
                    { html: '到' + ES.Util.dateFormat((oItem.AlarmTime + oItem.ContinueTime*60) * 1000, "yyyy-MM-dd hh:mm") },
                    { html: '(' + oItem.ContinueTime + '分)' },
                    //{ html: ES.TrackHelper.getTrackDateMsg((oItem.LastUpdateTimeStamp - oItem.AlarmStartTimeStamp) * 1000) }

                ]
            }
        }

        return oRunConfig;
    },
})

//告警类型过滤
ES.TrackView.PanelBox.AlarmPanel.include({
    //选择项样式设置
    alarmFilter: function () {
        var self = this;

        $(".alarm-type>li").click(function () {
            $(".alarm-type>li").removeClass("active");
            $(this).addClass("active");
            var cAlarmType = $(this).text();
            self.selectAlarmTyle(cAlarmType);
        })
    },
    //告警类型过滤
    selectAlarmTyle: function (cAlarmType) {

        if (cAlarmType == "全部") {
            $(".alarmRecord").css("display", "block");
        } else {

            var $_aoT = $(".alarmRecord").siblings();
            for (var i = 0; i < $_aoT.length; i++) {

                var cLiType = ES.TrackHelper.getAlarmTypeName($($_aoT[i]).data("oItem").oItem.AlarmType);

                if (cLiType.indexOf(cAlarmType) != -1) {
                    $($(".alarmRecord")[i]).css("display", "block");
                } else {
                    $($(".alarmRecord")[i]).css("display", "none");
                }
            }
        }
    },

})

/**
 * Created by liulin on 2017/2/22.
 */
    // 停留面板操作,由于停留和行驶是同一个请求参数，所有这2个面板的初始化子同一个界面完成
ES.TrackView.PanelBox.ParkPanel = ES.TrackView.PanelBox.BasePanel.extend({

    oOption: {
        cParkDiv: "parkChartView",
        cRunDiv: "runChartsView",
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

        this.initOn();
    },

    // 点击查询
    initOn: function () {
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.initUI, this);

        //this._oParent.on("Track:Bar.drawParkMarkers", this.drawAllParkMarker, this);

        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    clearMap: function () {
        this.clearPark();
        this.clearRun();
        this.clearReport();
    },

    // 获得查询参数，如果获得成功返回true，否则返回false
    getReqParam: function () {
        var oParam = this._oParent.getSearchTime();
        if (!oParam) return false;
        this.oReqParam = {
            StartTime: "2000-01-01",
            EndTime: "2000-01-02",
            PhoneNum: m_PhoneNum,
            MinSpeed: this._oParent.getSearchSpeed(),
            PageSize: 100,
            PageIndex: 1,
        };
        ES.extend(this.oReqParam, oParam);
        return true;
    },

    // 设置界面
    initUI: function (oData) {

        // 情况统计报表
        this.clearReport();

        if(!oData || !oData.aoTotalTrack || oData.aoTotalTrack.length<=0){
            return;
        }

        var aoTrack = oData.aoTotalTrack;
        // 保存停留点
        var aoStop = [];
        var oTemp =null;
        for(i = 0;i < aoTrack.length;i++){
            if(aoTrack[i].Speed <= 0){
                if(oTemp){
                    if(i == aoTrack.length-1)
                    {
                        aoStop.push({
                            cBeginDate: oTemp.GpsDateTime,
                            oBeginPos: oTemp.Poi.MapPoint,
                            cBeginAddr: oTemp.Poi.Address,
                            cEndDate: aoTrack[i].GpsDateTime,
                            oEndPos:aoTrack[i].Poi.MapPoint,
                            cEndAddr: aoTrack[i].Poi.Address,
                            nIndex:nIndex,
                        });
                    }

                    continue;
                }
                oTemp = aoTrack[i];
            }
            else {
                if(!oTemp)
                {
                    continue;
                }
                else {
                    // 如果小于2分钟不计算停留点
                    if (ES.Util.toDate(aoTrack[i].GpsDateTime).getTime() - ES.Util.toDate(oTemp.GpsDateTime).getTime() >= 120000) {
                        var nIndex = aoStop.length;
                        aoStop.push({
                            cBeginDate: oTemp.GpsDateTime,
                            oBeginPos: oTemp.Poi.MapPoint,
                            cBeginAddr: oTemp.Poi.Address,
                            cEndDate: aoTrack[i].GpsDateTime,
                            oEndPos: aoTrack[i].Poi.MapPoint,
                            cEndAddr: aoTrack[i].Poi.Address,
                            nIndex:nIndex,
                        })
                    }
                    oTemp = null;
                }
            }
        }

        // 获得行驶状态
        var nLen = aoTrack.length;
        var nTime = ES.Util.toDate(aoTrack[nLen-1].GpsDateTime).getTime() - ES.Util.toDate(aoTrack[0].GpsDateTime).getTime();
        var oTime = ES.TrackHelper.getTrackDateMsg(nTime);
        var nMil = (aoTrack[nLen-1].Mileage - aoTrack[0].Mileage);
        var oStatus ={
            nTime:oTime.nTime,
            dMileage:(nMil/1000).toFixed(2),
            AverageSpeed : (nMil*3600/nTime).toFixed(2),
            TraceCount:nLen,
            StartTime:aoTrack[0].GpsDateTime,
            EndTime:aoTrack[nLen-1].GpsDateTime,
            cMsg:oTime.cMsg
        };
        this.initReportUI(oStatus);

        this.initDataPark(aoStop);

        this._oParent.fire(this._oParent.getEvenName("setParkData"), {DataStop:aoStop});
    },

    getDefaultData: function () {
        return {
            "RetCode": 0,
            "RetMsg": "OK",
            "StartTime": '',
            "EndTime": '',
            "Data": {
                "RunTimeSec": 0,
                "Mileage": 0,
                "AverageSpeed": 0,
                "TraceCount": 0,
                "DataRange": [],
                "DataStop": [],
            }
        };
    },

    // 设置值
    InitUIHandler: function (oData) {
        // 请求的停留数据要做标记
        if (!oData || !oData.Data) return;
        for (var i = 0 ; i < oData.Data.DataStop.length; i++) {
            oData.Data.DataStop[i].nIndex = i;
        };

        // 设置数据
        this._oParent.fire(this._oParent.getEvenName("setParkData"), oData.Data);

        this.initDataPark(oData.Data);
        this.initDataRange(oData.Data);

        this.initReportUI(oData)
    },
})

// 停留处理
ES.TrackView.PanelBox.ParkPanel.include({

    clearPark: function () {
        $("#" + this.oOption.cParkDiv).empty();
    },

    //加载停留,数据要进行处理，方便定位
    initDataPark: function (aoData) {
        var self = this;
        if (!aoData  || aoData.length <= 0) {
            return;
        }
        var oLi = $("#" + this.oOption.cParkDiv).empty();

        for (var i = 0 ; i <aoData.length ; i++) {
            ES.Util.initTag(oLi, this.getParkConfig(aoData[i]));
            $("div.parkRecord[cId='" + aoData[i].nIndex + "']").data("oItem", { oItem: aoData[i] });
        }

        // 注册点击事件
        $(".parkRecord").bind("click", this, function (e) {
            var oItem = $(this).data('oItem');
            self._oParent.fire(self._oParent.getEvenName('localParkMarker'), oItem);

            $('.parkRecord').removeClass("selected");
            $(this).addClass("selected");
        })

    },

    // 初始化停留面板的值
    //停留告警设置
    getParkConfig: function (oItem) {

        var nTime = ES.Util.toDate(oItem.cEndDate).getTime() - ES.Util.toDate(oItem.cBeginDate).getTime();
        var oTime = ES.TrackHelper.getTrackDateMsg(nTime);
        //var oDate = ES.TrackHelper.getTrackDateMsg((oItem.EndGps.GpsTime - oItem.StartGps.GpsTime) * 1000);
        var oRunConfig = {
            div: {
                div: [
                    { class: 'travel-date', span: { html: oItem.cBeginDate }, html: '停留记录' },
                    {
                        class: 'TrackPanel-mRow TrackPanel-hoverRow parkRecord',
                        cId: oItem.nIndex,
                        span: [{ class: 'TrackPanel-icon stay' },
                            { html: oItem.cBeginDate + " 至 " + oItem.cEndDate },
                            { html: '  停留时长：' },
                            { class: 'TrackPanel-emOrStrongWithoutWeight', html: oTime.nTime + oTime.cMsg + " " },
                            { html: oItem.cEndAddr }]
                    }]
            }
        }

        return oRunConfig;
    },

    // 画所有停留点


})

// 行程处理
ES.TrackView.PanelBox.ParkPanel.include({

    clearRun: function () {
        $("#" + this.oOption.cRunDiv).empty();
    },

    //加载行程
    initDataRange: function (oData) {

        if (!oData || !oData.DataRange || oData.DataRange.length <= 0) return;
        var oLiTrackTrip = $("#" + this.oOption.cRunDiv).empty();

        for (var i = 0 ; i < oData.DataRange.length ; i++) {
            ES.Util.initTag(oLiTrackTrip, this.getRunConfig(oData.DataRange[i].StartGps, oData.DataRange[i].EndGps));
        }
    },

    //行驶停留告警设置
    getRunConfig: function (oBItem, oEItem) {
        //设置时间格式
        var oDate = ES.TrackHelper.getTrackDateMsg((oEItem.GpsTime - oBItem.GpsTime) * 1000);
        var oRunConfig = {
            div: {
                div: [
                    { class: 'travel-date', span: { html: oBItem.GpsDateTime.replace("T", " ") }, html: '行程记录' },
                    {
                        div: {
                            class: 'travel-item',
                            div: [{
                                class: 'TrackPanel-mRow',
                                i: { class: 'glyphicon glyphicon-map-marker text-success' },
                                span: [{ html: oBItem.GpsDateTime.replace("T", " ") },
                                    { html: '从:' },
                                    { html: oBItem.PoiInfo }]
                            },
                                {
                                    class: 'TrackPanel-mRow',
                                    i: { class: 'glyphicon glyphicon-map-marker text-danger' },
                                    span: [{ class: 'js_endTime', html: oEItem.GpsDateTime.replace("T", " ") },
                                        { html: '到:' },
                                        { html: oEItem.PoiInfo }]
                                },
                                {
                                    table: {
                                        class: 'travel-item-table',
                                        tbody: {
                                            tr: {
                                                td: [
                                                    { html: '行驶里程' },
                                                    {
                                                        class: 'text-right TrackPanel-emOrStrongWithoutWeight',
                                                        cid: 'total_travelPeriod',
                                                        html: ((oEItem.Mileage - oBItem.Mileage) / 1000).toFixed(2)
                                                    }, { html: 'km' },
                                                    { html: '行驶时耗' },
                                                    {
                                                        class: 'text-right TrackPanel-emOrStrongWithoutWeight',
                                                        cid: 'total_travelPeriod',
                                                        html: oDate.nTime
                                                    }, { html: oDate.cMsg }
                                                ]
                                            }
                                        }

                                    }
                                }]
                        }
                    }],
            }
        }
        return oRunConfig;
    },

})

// 加载统计面板数据
ES.TrackView.PanelBox.ParkPanel.include({
    // 行驶时长,行驶里程,平均速度,轨迹点,开始时间,结束时间
    _oItem: {
        "total_travelPeriod": "nTime",
        "total_mileage": "dMileage",
        "total_avgSpeed": "AverageSpeed",
        "total_points": "TraceCount",
        "tdBeginDate": "StartTime",
        "tdEndDate": "EndTime",
        "travelPeriod_msg": 'cMsg',
    },

    // 清空界面
    clearReport: function () {
        for (var cKey in this._oItem) {
            $("#" + cKey).text("");
        }
    },

    // 初始化面板
    initReportUI: function (oData) {

        // if (!oData || oData.RetMsg !== "OK" || !oData.Data) return;
        // var oTemp = oData.Data;
        // oTemp.dMileage = (oTemp.Mileage / 1000).toFixed(2);
        // var oMsg = ES.TrackHelper.getTrackDateMsg(oTemp.RunTimeSec * 1000);
        //
        // // 还有和查询条件合并
        // ES.Util.extend(oTemp, this.oReqParam, oMsg);
        for (var cKey in this._oItem) {
            $("#" + cKey).text(oData[this._oItem[cKey]]);
        }
    },

})

/**
 * 对图表的操作，如速度图表、密闭图表、载重图表
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.PanelBox.SpeedDoorWeightPanel = ES.TrackView.PanelBox.BasePanel.extend({
    aoTrack:[],
    oOption: {
        cDivDoor: "divDoorChart",
        cDivSpeedWeight: 'divSpeedWeightChart'
    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        this.initOn();
        this.initEvent();
    },
    initEvent:function() {
        var self = this;
        $('#divSpeedWeightChart').on('click', function (Params) {
        });
    },
    // 点击查询
    initOn: function () {
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.initUI, this);
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.refreshUI, this);
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    // 清除图表
    clearMap: function () {
        if (!this.aoTrack) {
            this.aoTrack.splice(0, this.aoTrack.length);
        }
        var oTemp = { acTime: [], adSpeed: [], adWeight: [], adDoor: [] };
        var oOption = this.getSpeedWeightChartOption(oTemp);
        if (this.oChart){
            this.oChart.setOption(oOption, true);
        }
    },

    // 设置界面
    initUI: function (oData) {
        this.aoTrack.splice(0, this.aoTrack.length);
        $.merge(this.aoTrack, oData.aoPageTrack);
        var oData = this.dataConvert();

        // 创建第一个图表
        var oOption = this.getSpeedWeightChartOption(oData);

        this.oChart = echarts.init(document.getElementById(this.oOption.cDivSpeedWeight));
        this.oChart.setOption(oOption, true);

    },

    refreshUI: function (oData) {
        $.merge(this.aoTrack, oData.aoPageTrack);

        // 刷新图表数据
        var oData = this.dataConvert();

        // 创建第一个图表
        var oOption = this.getSpeedWeightChartOption(oData);

        this.oChart = echarts.init(document.getElementById(this.oOption.cDivSpeedWeight));
        this.oChart.setOption(oOption, true);

    },

    // 获得速度、载重 的配置
    getSpeedWeightChartOption: function (oDataTemp) {
        var oOption = {
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    if (params.length) {
                        var res = params[0].name + '<br/>'
                        res += params[0].seriesName + '： ' + params[0].value + ' Km/h<br/> ';
                        return res;
                    }
                }
            },
            calculable: true,
            dataZoom: {
                show: true,
                realtime: true,
                start: 0,
                end: 100,
                height:15
            },
            legend: {
                selected: {
                    '速度': true,
                },
                data: ['速度']
            },
            smooth: true,
            grid: {
                x: "12%",
                y: "20%",
                x2: "10%",
                y2: "20%"
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: oDataTemp.acTime.length == 0 ? ['2015-01-01'] : oDataTemp.acTime
                }
            ],
            yAxis: [
                {
                    name: '速度',
                    type: 'value',
                    boundaryGap: false,
                    axisLabel: {
                        formatter: '{value}'
                    },

                },
                // {
                //     name: '载重',
                //     type: 'value',
                //     boundaryGap: false,
                //     axisLabel: {
                //         formatter: '{value}'
                //     }
                // }
            ],
            series: [
                {
                    name: '速度',
                    type: 'line',
                    data: oDataTemp.adSpeed.length == 0 ? [0] : oDataTemp.adSpeed,
                    itemStyle: { normal: { color: 'green', lineStyle: { color: 'green' } } },
                    stack: '速度',
                    markPoint: {
                        data: [
                            { type: 'max', name: '最大值', itemStyle: { normal: { color: '#b62d22' } }, },
                            { type: 'min', name: '最小值', itemStyle: { normal: { color: '#3c924c' } }, }
                        ],
                    },
                    itemStyle: { normal: { color: '#f60', lineStyle: { color: '#f60' } } },
                },
                // {
                //     name: '载重',
                //     type: 'line',
                //     yAxisIndex: 1,
                //     data: oDataTemp.adWeight.length == 0 ? [0] : oDataTemp.adWeight,
                //     stack: '载重',
                //     markPoint: {
                //         data: [
                //             { type: 'max', name: '最大值', itemStyle: { normal: { color: '#b62d22' } }, },
                //             { type: 'min', name: '最小值', itemStyle: { normal: { color: '#3c924c' } }, }
                //         ],
                //     },
                //     itemStyle: { normal: { color: '#f60', lineStyle: { color: '#f60' } } },
                // }
            ]
        }
        return oOption;
    },

    //时间速度设置,数据转换工具，转换个数为{时间：[]，速度：[]}
    dataConvert: function () {
        if (!this.aoTrack || this.aoTrack.length <= 0) return { acTime: [], adSpeed: [], adWeight: [], adDoor:[]};
        // gps 时间
        var acGPSDate = [];
        // 门磁
        var adDoor = [];
        // 速度
        var adSpeed = [];
        // 重量
        var adWeight = [];
        for (var i = 0 ; i < this.aoTrack.length ; i++) {
            acGPSDate.push(this.aoTrack[i].GpsDateTime);
            //adDoor.push((this.aoTrack[i].FrontDoor ? 1 : 0));
            adSpeed.push(this.aoTrack[i].Speed);
            //adWeight.push(this.aoTrack[i].sWeightValue);
        }

        return { acTime: acGPSDate, adSpeed: adSpeed, adWeight: adWeight, adDoor: adDoor };
    },

});

/**
 * 所有div 点的 基本接口
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.PointLayer ={};

ES.TrackView.PointLayer.BaseMarker = L.MapLib.MapMaster.MapOpr.extend({

    oOption: {
        // 像素显示
        cPosName: "轨迹开始点",

    },

    // 系统构造函数
    initialize: function (oParent, oOption) {
        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption);
        this._oParent = oParent;

        this.initOn();
        this.initGroup();
    },

    // 初始化图层
    initGroup: function () {
        this._oMarkerGroup = new L.featureGroup();
        this._oMarkerGroup.addTo(this._oMap);
    },

    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        this._oParent.on(this._oParent.getEvenName("drawMarker"), this.drawMarker, this);
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.firstReqTrackBC, this);
        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.firstReqTrackBC, this);

    },

    clearMap: function () {
        this._oMarkerGroup.clearLayers();
    },
    // 获得popup 的html
    getHtml: function (oPosInfo) {

        var oTemp = ES.extend({}, oPosInfo, {cPoiInfo: oPosInfo.Poi.Address || ''});
        var cHtml =
            '<div class="ex-maptip-ztc">' +
            '   <div class="ex-content-info-box">' +
            '       <ul class="ec-u-sm-12">' +
            '           <li><span><b>{cPosName}</b></span></li>'+
            '           <li><span>位置：{cPoiInfo} <span></li>' +
            '           <li><span>时间：{cGpsDateTime} </span></li>' +
            '       </ul>'+
            '   </div>' +
            '</div>';

        return ES.Util.template(cHtml, oTemp);
    },

    getIcon: function () {
        var oIcon = L.divIcon({
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [-1, -32],
            className: '',
            html: '<div class="track-marker track-site-marker"></div>',
        });
        return oIcon
    },

    // 开始画点
    drawMarker: function (oData) {
        if (!oData || !oData.oGpsInfo) return;

        var oLayer = this.findLayer(this._oMarkerGroup, oData.oGpsInfo.PhoneNum);
        if (!oLayer) {
            oLayer = L.marker([oData.oGpsInfo.Lat, oData.oGpsInfo.Lng], { icon: this.getIcon() });
            oLayer.addTo(this._oMarkerGroup);
        } else {
            // 更新位置信息
            oLayer.setLatLng([oData.oGpsInfo.Lat, oData.oGpsInfo.Lng]);
        }
        var oTemp = {};
        ES.extend(oTemp, {
            cPosName: this.oOption.cPosName,
            cGpsDateTime: oData.oGpsInfo.GpsDateTime.replace("T", " "),
            dMileage: (parseInt(oData.oGpsInfo.Mileage)/1000).toFixed(2),
        });
        oLayer.bindPopup(this.getHtml(oTemp));

    },
})

/**
 *
 * 告警点
 *
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.PointLayer.AlarmMarkerMgr = ES.TrackView.PointLayer.BaseMarker.extend({

    // 监听多个事件
    initOn: function () {

        // 设置停留点的数据
        this._oParent.on(this._oParent.getEvenName("setAlarmData"), this.setAlarmData, this);
        //通知定时器开始执行播放轨迹
        this._oParent.on("Track:Bar.dealAlarmMarkers", this.dealAlarmMarkers, this);

        this._oParent.on("Track:Bar.clearAlarmMarkers", this.clearMarkers, this);

        this._oParent.on(this._oParent.getEvenName("localAlarmMarker"), this.localAlarmMarker, this);

        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    // 定位点
    localAlarmMarker: function (oData) {
        if (!oData) return;
        var oItem = oData.oItem;
        if (!oItem) return;
        this.drawMarker(oItem);

        // 定位
        var oLatLng = L.latLng(oItem.AlarmPoi.MapPoint.Lat, oItem.AlarmPoi.MapPoint.Lon);
        this.flyTo(oLatLng);
    },

    setAlarmData: function (oData) {
        this.aoData = oData.aoAlarm;
    },

    // 画告警点的入口
    dealAlarmMarkers: function (oData) {
        if (!oData) return;

        if (oData.bIsDraw) {
            this.drawMarkers()
        } else {
            this.clearMarkers();
        }
    },

    drawMarkers: function () {
        if (!this.aoData || this.aoData.length <= 0) return;
        for (var i = 0; i < this.aoData.length ; i++) {
            this.drawMarker(this.aoData[i]);
        }
    },

    clearMarkers: function () {
        if (!this._oMarkerGroup) return;

        this._oMarkerGroup.clearLayers();
    },

    drawMarker: function (oData) {

        var oLayer = this.findLayer(this._oMarkerGroup, oData.nIndex);
        if (!oLayer) {
            oLayer = L.marker([oData.AlarmPoi.MapPoint.Lat, oData.AlarmPoi.MapPoint.Lon], { icon: this.getIcon(oData) });
            oLayer.cId = oData.nIndex;
            oLayer.addTo(this._oMarkerGroup);
            oLayer.bindPopup(this.getHtml(oData));
        } else {
            // 更新位置信息
            oLayer.setLatLng([oData.AlarmPoi.MapPoint.Lat, oData.AlarmPoi.MapPoint.Lon]);
            oLayer.openPopup();
        }
    },

    //设置告警图标样式
    getIcon: function (oData) {
        var oIconStyle = {
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [-1, -32],
            className: '',
            html: '<div class="track-marker track-alarm-marker"></div>',
        }
        //告警类型数字
        var nAlarmType = oData.AlarmType;
        //告警类型的class
        var cAlarmClass = this.getAlarmTypeName(nAlarmType);

        //设置oIconStyle的值
        if (cAlarmClass) {
            var cHtml = "<div class='track-marker track-alarm-marker'><div class= 'car-state " + cAlarmClass + "' ></div></div>";
            oIconStyle = ES.extend(oIconStyle, { html: cHtml })
        }
        var oIcon = L.divIcon(oIconStyle);
        return oIcon;
    },

    //获得告警类型的class
    getAlarmTypeName: function (type) {
        var oData = this.getAlarmType();
        if (!oData) return;
        return oData[type];
    },

    //告警字典
    getAlarmType: function () {
        var alarmType = {
            //未密闭 可疑出土 非工作时间运输 可疑消纳  平台超速报警
            100: 'cover', 105: 'o-earth', 210: 'work', 104: 'i-earth', 106: 'speed',
        };
        return alarmType;
    },

    // 获得popup 的html
    getHtml: function (oItem) {
        var oTime = ES.TrackHelper.getTrackDateMsg(oItem.ContinueTime * 60 * 1000)
        var cHtml =
            '<div class="ex-maptip-ztc">' +
            '   <div class="ex-content-info-box">'+
            '       <ul class="ec-u-sm-12">' +
            '           <li><span>次数：' + oItem.AlarmCount + ' </span></li>'+
            '           <li><span>时长：' + oTime.nTime + ' ' + oTime.cMsg + '  <span></li>' +
            '           <li><span>类型：' + ES.TrackHelper.getAlarmTypeName(oItem.AlarmType) + ' </span></li>' +
            '           <li><span>位置：' + oItem.AlarmPoi.Address + ' </span></li>' +
            '           <li><span>时间：' + ES.Util.dateFormat(oItem.AlarmTime * 1000, "yyyy-MM-dd hh:mm:ss") + ' </span></li>' +
            '       </ul>'+
            '   </div>' +
            '</div>';

        return cHtml;
    },

})

/**
 *
 * 起点、
 *
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.PointLayer.BeginMarker = ES.TrackView.PointLayer.BaseMarker.extend({
    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        //this._oParent.on(this._oParent.getEvenName("drawMarker"), this.drawMarker, this);
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.drawMarker, this);

        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },



    // 第一次请求时的处理
    drawMarker: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0 ) return;

        var oGpsInfo = oData.aoTrack[0];

        var oLayer = this.findLayer(this._oMarkerGroup, oGpsInfo.PhoneNum);
        if (!oLayer) {
            oLayer = L.marker([oGpsInfo.Lat, oGpsInfo.Lng], { icon: this.getIcon() });
            oLayer.addTo(this._oMarkerGroup);
        } else {
            // 更新位置信息
            oLayer.setLatLng([oGpsInfo.Lat, oGpsInfo.Lng]);
        }
        var oTemp = {};
        ES.extend(oTemp, oGpsInfo, {
            cPosName: this.oOption.cPosName,
            cGpsDateTime: oGpsInfo.GpsDateTime.replace("T", " "),
            dMileage: (parseInt(oGpsInfo.Mileage) / 1000).toFixed(2),
        });
        oLayer.bindPopup(this.getHtml(oTemp));

    },

    getIcon: function () {
        var oIcon = L.divIcon({
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [-1, -32],
            className: '',
            html: '<div class="track-marker track-begin-marker"></div>',
        });
        return oIcon
    },
})

/**
 * 终止点，
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.PointLayer.EndMarker = ES.TrackView.PointLayer.BaseMarker.extend({
    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        //this._oParent.on(this._oParent.getEvenName("drawMarker"), this.drawMarker, this);
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.drawMarker, this);
        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.drawMarker, this);

        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);

    },


    // 第一次请求时的处理
    drawMarker: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) return;
        if (oData.nPage < oData.nTotalPage) return;
        var oGpsInfo = oData.aoPageTrack[oData.aoPageTrack.length - 1];
        if (!oGpsInfo) return;

        var oLayer = this.findLayer(this._oMarkerGroup, oGpsInfo.PhoneNum);
        if (!oLayer) {
            oLayer = L.marker([oGpsInfo.Lat, oGpsInfo.Lng], { icon: this.getIcon() });
            oLayer.addTo(this._oMarkerGroup);
        } else {
            // 更新位置信息
            oLayer.setLatLng([oGpsInfo.Lat, oGpsInfo.Lng]);
        }
        var oTemp = {};
        ES.extend(oTemp, oGpsInfo, {
            cPosName: this.options.cPosName, cGpsDateTime: oGpsInfo.GpsDateTime.replace("T", " "),
            // cPosName: this.oOption.cPosName, cGpsDateTime: oGpsInfo.GpsDateTime.replace("T", " "),
            dMileage: (parseInt(oGpsInfo.Mileage) / 1000).toFixed(2),
        });
        oLayer.bindPopup(this.getHtml(oTemp));
    },

    getIcon: function () {
        var oIcon = L.divIcon({
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [-1, -32],
            className: '',
            html: '<div class="track-marker track-end-marker"></div>',
        });
        return oIcon
    },
})

/**
 *
 * 停留点，停留请求,停留点的数据有停留面板决定
 *
 * Created by liulin on 2017/2/22.
 */



ES.TrackView.PointLayer.ParkMarkerMgr = ES.TrackView.PointLayer.BaseMarker.extend({

    // 监听多个事件
    initOn: function () {

        // 设置停留点的数据
        this._oParent.on(this._oParent.getEvenName("setParkData"), this.setParkData, this);
        //通知定时器开始执行播放轨迹
        this._oParent.on("Track:Bar.dealParkMarkers", this.dealParkMarkers, this);

        this._oParent.on("Track:Bar.clearParkMarkers", this.clearMarkers, this);

        this._oParent.on(this._oParent.getEvenName("localParkMarker"), this.localParkMarker, this);
        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },
    getIcon: function () {
        var oIcon = L.divIcon({
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [-1, -32],
            className: '',
            html: '<div class="track-marker track-park-marker"></div>',
        });
        return oIcon
    },
    // 定位点
    localParkMarker: function (oData) {
        if (!oData ||!oData.oItem) {
            return;
        }
        var oItem = oData.oItem;

        this.drawMarker(oItem);

        // 定位
        var oLatLng = L.latLng(oItem.oEndPos.Lat, oItem.oEndPos.Lon);
        this.flyTo(oLatLng);
    },

    setParkData: function (oData) {
        this.aoData = oData.DataStop;
    },

    // 画停留点的入口
    dealParkMarkers: function (oData) {
        if (!oData) return;

        if (oData.bIsDraw) {
            this.drawMarkers()
        } else {
            this.clearMarkers();
        }
    },

    drawMarkers: function () {
        if (!this.aoData || this.aoData.length <= 0) return;
        for (var i = 0; i < this.aoData.length ; i++) {
            this.drawMarker(this.aoData[i]);
        }
    },

    clearMarkers: function () {
        if (!this._oMarkerGroup) return;

        this._oMarkerGroup.clearLayers();
    },

    drawMarker: function (oData) {

        var oLayer = this.findLayer(this._oMarkerGroup, oData.nIndex);
        if (!oLayer) {
            oLayer = L.marker([oData.oEndPos.Lat, oData.oEndPos.Lon], { icon: this.getIcon() });
            oLayer.cId = oData.nIndex;
            oLayer.addTo(this._oMarkerGroup);
            oLayer.bindPopup(this.getHtml(oData));
        } else {
            // 更新位置信息
            oLayer.setLatLng([oData.oEndPos.Lat, oData.oEndPos.Lon]);
            oLayer.openPopup();
        }
    },

    // 获得popup 的html
    getHtml: function (oGpsInfo) {
        var nTime = ES.Util.toDate(oGpsInfo.cEndDate).getTime() - ES.Util.toDate(oGpsInfo.cBeginDate).getTime();
        var oTime = ES.TrackHelper.getTrackDateMsg(nTime);

        var nParkdue = oTime.nTime + " " + oTime.cMsg;
        var cParkTime = oGpsInfo.cBeginDate + ' 到 ' + oGpsInfo.cEndDate;

        var cHtml =
        '<div class="ex-maptip-ztc">' +
        '   <div class="ex-content-info-box ">'+
        '       <ul class="ec-u-sm-12">' +
        '           <li><span><b>停车点</b></span></li>'+
        '           <li><span>停车时长：' + nParkdue + ' <span></li>' +
        '           <li><span>停车位置：' + oGpsInfo.cEndAddr + ' </span></li>' +
        '           <li><span>停车时间：' + cParkTime + ' </span></li>' +
        '       </ul>'+
        '   </div>' +
        '</div>';
        return cHtml;
    },
})

/**
 *
 * 每段轨迹线的点的处理方式，不同的地方是在一个图层里添加没有个分段点
 *
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.PointLayer.SubMarkerMgr = ES.TrackView.PointLayer.BaseMarker.extend({

    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        //this._oParent.on(this._oParent.getEvenName("drawMarker"), this.drawMarker, this);
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.drawMarker, this);
        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.drawMarker, this);
        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    // 设置
    getIcon: function (oData) {
        var oIcon = L.divIcon({
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [-1, -32],
            className: '',
            html: '<div class="track-marker track-page-marker"><div>' + oData.nPage + '</div></div>',
        });
        return oIcon;
    },

    drawMarker: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) return;
        if (oData.nPage === oData.nTotalPage ) return;
        var oGpsInfo = oData.aoPageTrack[oData.aoPageTrack.length - 1];
        if (!oGpsInfo) return;

        var oLayer = this.findLayer(this._oMarkerGroup, oData.nPage);
        if (!oLayer) {
            oLayer = L.marker([oGpsInfo.Lat, oGpsInfo.Lng], { icon: this.getIcon(oData) });
            oLayer.addTo(this._oMarkerGroup);
        } else {
            // 更新位置信息
            oLayer.setLatLng([oGpsInfo.Lat, oGpsInfo.Lng]);
        }
        var oTemp = {};
        ES.extend(oTemp, oGpsInfo, {
            cPosName: this.oOption.cPosName,
            cGpsDateTime: oGpsInfo.GpsDateTime.replace("T", " "),
            dMileage: (parseInt(oGpsInfo.Mileage) / 1000).toFixed(2),
        });
        oLayer.bindPopup(this.getHtml(oTemp));
    },

})

/**
 * Created by liulin on 2017/2/22.
 */

ES.TrackView.RealTrack = {};

ES.TrackView.RealTrack.BaseRealTrack = L.MapLib.MapMaster.MapOpr.extend({
    initialize: function (oParent, oOption) {

        L.MapLib.MapMaster.MapOpr.prototype.initialize.call(this, oParent, oOption);

        this._oParent = oParent;

        // 清除点数据
        this._oParent.on(this._oParent.getEvenName("clearMap"), this.clearMap, this);
    },

    // 灯的转换
    getLight: function (oGpsInfo) {
        var oClass = { cClsLight: 'gray', cClsDoor: 'red', cClsWeight: 'yellow' };

        if (oGpsInfo.nGreenOn === 1) {
            oGpsInfo.cLight = "绿灯";
            oClass.cClsLight = "green";
            return;
        }
        if (oGpsInfo.nRedOn === 1) {
            oGpsInfo.cLight = "红灯";
            oClass.cClsLight = "red";
            return;
        }

        if (oGpsInfo.nYelloOn === 1) {
            oGpsInfo.cLight = "黄灯";
            oClass.cClsLight = "yellow";
            return;
        }

        oGpsInfo.cLight = "白灯";
        oClass.cClsLight = "gray";
        return oClass;
    },

    // 轨迹点tooltip
    getVecMarkerHtmlNotBtn: function (oGpsInfo) {

        var oClass = this.getLight(oGpsInfo);

        //要判断
        var oTemp = {};
        ES.extend(oTemp, oGpsInfo,
            {
                cDir: ES.TrackHelper.getDire(oGpsInfo.Direction),
                cGpsDateTime: oGpsInfo.GpsDateTime.replace("T", " "),
                dMileage: (parseFloat(oGpsInfo.Mileage) / 1000).toFixed(2),
                cPoiInfo: oGpsInfo.Poi.Address || '',
                //VehicleNo:m_VehicleNo
            }, oClass);

        var popupContent = ES.Util.template(
            '<div class="ex-maptip-ztc">' +
            '   <div class="ex-content-info-box">'+
            '       <ul class="ec-u-sm-12">' +
            '           <li><span>车牌号：{VehicleNo}</span></li>'+
            '           <li><span>企业：{CompanyName}</span></li>'+
            //'         <li><span>所属区：{VehicleNo}</span></li>'+
            //'           <li><span>载重：{sWeightValue}</span></li>'+
            '           <li><span>速度：{Speed} Km/h </span></li>' +
            '           <li><span>方向：{cDir} </span></li>' +
            '           <li><span>位置：{cPoiInfo} </span></li>' +
            '           <li><span>时间：{cGpsDateTime} </span></li>' +
            '       </ul>'+
            '   </div>' +
            '</div>', oTemp)
        return popupContent;
    },

    // 实时点为车辆时 才能 设置 该点信息获得实时跟踪点, 地图统计点数据
    _getPosIconInfo: function (oItem, oOption) {

        // var cHtml ='"<div cid='" + oItem.PhoneNum + "' class='car-body' style='transform: rotate(" +
        //     (oItem.Direction + 180) + "deg);-webkit-transform: rotate(" + (oItem.Direction + 180) + "deg);'></div> <div class='car-state'></div>"'

        var cHtml =
            '<div cid="{PhoneNum}"  class="car-body" ' +
            '   style="transform:rotate({nDir}deg);-webkit-transform: rotate({nDir}deg);">' +
            '</div>    ' +
            '<div class="pin-tip " style="display: none;">        ' +
            '   <div class="pin-dome"><b></b><c></c><d></d></div>        ' +
            '   <div class="pin-number">{VehicleNo}</div>        ' +
            '   <div class="pin-state"> </div>' +
            '</div>'
        oItem.nDir = oItem.Direction + 180;

        cHtml = ES.template(cHtml,oItem);

        return new L.DivIcon({
            html: cHtml,
            className: "ex-monitor-mapicon-truck green",
            iconSize: L.point(oOption.nSize, oOption.nSize),
            iconAnchor:L.point(16, 16),
            popupAnchor: L.point(-0, -20),

        });
    },

    // 设置车辆的角度
    _setHeading: function (oGpsInfo, nInitDir) {
        if (!oGpsInfo) return;
        if (!nInitDir) nInitDir = 0;
        var nDir = oGpsInfo.Direction + nInitDir;
        $("div[cId='" + oGpsInfo.PhoneNum + "']").attr('style', 'transform: rotate('
            + nDir + 'deg);-webkit-transform: rotate('
            + nDir + 'deg);');
    },

    // 初始化图层
    initGroup: function () {
        this._oLayerGroup = new L.featureGroup();
        this._oLayerGroup.addTo(this._oMap);
    },

    clearMap: function () {
        if (!this._oLayerGroup) {
            return;
        }
        this._oLayerGroup.clearLayers();
    },
});

/**
 *
 * name：    TrackPos.js
 *
 * des:     车辆位置实时点，播放轨迹运动是的动点
 *
 * Created by liulin on 2017/2/22.
 *
 *
 *
 */

ES.TrackView.RealTrack.TrackPos = ES.TrackView.RealTrack.BaseRealTrack.extend({

    // 系统构造函数
    initialize: function (oParent, oOption) {
        ES.TrackView.RealTrack.BaseRealTrack.prototype.initialize.call(this, oParent, oOption);
        this._oParent = oParent;

        // 定时器
        this.oTimes = new ES.MonitorTimer(this, { nIntervalSpeed: 100, bIsStart: false });

        //单次轨迹停车计算
        this.aoParkInfo = new Array();

        //重置当前游标
        this._nCursor = 0;
        this.initOn();
        // 移动速度
        this.nSpeed = 100;
        this.initGroup();
    },

    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.initPos, this);

        // 移动游标
        this._oParent.on('Track:moveSliderCursor', this.moveCursor, this);

        this._oParent.on(this._oParent.getEvenName("play"), this.play, this);

        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.noticeTimerPlay, this);

        //setPlaySpeed//playFinish
        this._oParent.on(this._oParent.getEvenName("setPlaySpeed"), this.setPlaySpeed, this);

        // 判断是否播放轨迹
        //this._oParent.on(this._oParent.getEvenName("setPopupOpen"), this.setPopupOpen, this);

        // 暂停轨迹回放
        this._oParent.on(this._oParent.getEvenName("pause"), this.stop, this);

        // 触发停止播放轨迹
        this._oParent.on(this._oParent.getEvenName("playFinish"), this.stop, this);
    },

    setPopupOpen: function () {
        //var oCkbStatus = this._oParent.getCkbStatus();
        //if (!oCkbStatus) return;
        //var aoLayer = this._oLineGroup.getLayers();
        //if (!aoLayer || aoLayer.length <= 0) return;

        //for (var i = 0 ; i < aoLayer.length; i++) {
        //    if (oCkbStatus.bIsTrackLine) {
        //        L.DomUtil.removeClass(aoLayer[i]._path, 'ec-hide');
        //    }
        //    else {
        //        L.DomUtil.addClass(aoLayer[i]._path, 'ec-hide');
        //    }
        //}
    },

    getPopupOpen: function () {
        var oCkbStatus = this._oParent.getCkbStatus();
        if (!oCkbStatus){
            return false;
        }
        return oCkbStatus.bIsPopup;
    },

    // 点击开始回放轨迹
    play: function () {
        this.oTimes.on({ oContext: this, fnCallBack: this.playing });
        // 开始回放轨迹
        this.oTimes.start();
    },

    stop: function () {
        if (!this.oTimes){
            return;
        }
        this.oTimes.stop();
    },

    //设置播放速度
    setPlaySpeed: function (oData) {
        this.oTimes.setSpeed(oData.nSpeed);
        this.nSpeed = oData.nSpeed;
        //当处于暂停状态时，设置播放速度时，仍处于播放状态
        if ($(".track-play").css("display") == "inline-block") {
            this.oTimes.stop();
        }
    },

    // 定时执行这个函数,播放轨迹
    playing:function(){
        if (this._nCursor >= this.aoGpsInfo.length) {
            // 开始下一次的请求
            this.oTimes.stop();

            this._oParent.fire('Track:setSliderCursor',{nIndex:100});

            //修改
            ES.aWarn("轨迹播放完成！");

            // 广播通知播放完成
            this._oParent.fire(this._oParent.getEvenName("playFinish"));

            // 没有分页不用请求下一页数据
            //this._oParent.fire(this._oParent.getEvenName("nextReq"));
        }
        else {
            this.drawVecPos(this._nCursor);

            var nIndex =parseInt(this._nCursor * 100/ this.aoGpsInfo.length);

            this._oParent.fire('Track:setSliderCursor',{nIndex:nIndex});

            this._nCursor = this._nCursor + 1;
        }
    },

    // 轨迹在外部过滤，不再内部过滤
    initPos: function (oData) {
        // 停止播放
        this._nCursor = 0;
        this.stop();

        // 当前页的轨迹数据
        this.aoGpsInfo = oData.aoPageTrack;
        if (this.aoGpsInfo.length <= 0) {
            return;
        }
        // 画第一个点
        this.drawVecPos(this._nCursor);
    },

    moveCursor:function(oData){
        if(!this.aoGpsInfo ||this.aoGpsInfo.length <=0){
            return;
        }

        var bStatus = this.oTimes.getStatus();
        if(bStatus)
        {
            //this.oTimes.stop();
            this._nCursor =parseInt(  this.aoGpsInfo.length * oData.nIndex/100);
            //this.oTimes.start();
        }
        else
        {
            this._nCursor =parseInt(  this.aoGpsInfo.length * oData.nIndex/100);
            this.drawVecPos(this._nCursor);
        }


    },

    //判断是否结束播放,或者继续播放轨迹
    noticeTimerPlay: function (oData) {
        this.aoGpsInfo = oData.aoPageTrack;
        this._nCursor = 0;

        if (!this.aoGpsInfo || this.aoGpsInfo.length <= 0) {
            //结束本次播放
            this.oTimes.stop();

            //修改
            ES.aWarn("轨迹播放完成！");

            // 广播通知播放完成
            this._oParent.fire(this._oParent.getEvenName("playFinish"));

        }
        else {

            if ($(".track-play").css("display") !== "none") {
                this.oTimes.stop();

            }
            else {
                // 要获得当前状态，才决定是否要轨迹回放,如果定时器已经关闭，不要播放轨迹
                this.oTimes.start();
            }

        }
    },

    drawVecPos: function (nIndex) {
        var oGpsInfo = this.aoGpsInfo[nIndex];
        if (!oGpsInfo) {
            var i = 0;
        }
        var oLatLng = L.latLng(oGpsInfo.Lat, oGpsInfo.Lng);
        if (!this.posInSrceen(oLatLng)) {
            this._oMap.panTo(oLatLng);
        }

        this._oParent.fire("ES.MapOpr.TrackView.TrackPos:drawVecPos", { oGpsInfo: oGpsInfo });

        // 画矢量点
        this._drawVecPos(nIndex);
    },

    //画矢量点数据，带有方向的矢量数据，不使用滑板进行绘制，使用div来画数字
    _drawVecPos: function (nIndex) {
        if (!this._oLayerGroup) return;
        var oGpsInfo = this.aoGpsInfo[nIndex];
        var oLatLng = L.latLng(oGpsInfo.Lat, oGpsInfo.Lng);

        var oLivePosLayer = this.findLayer(this._oLayerGroup, oGpsInfo.PhoneNum);
        if (!oLivePosLayer) {
            //创建当前点【500】
            var oLayer = L.Marker.movingMarker([oLatLng], 100, { icon: this._getPosIconInfo(oGpsInfo, { nSize: 32 }) });


            oLayer.cId = oGpsInfo.PhoneNum;
            oLayer.cVehNo = oGpsInfo.VehicleNo;

            oLayer.oData = oGpsInfo;

            //把矢量点添加到地图上
            oLayer.addTo(this._oLayerGroup);

            //设置图片的方向，即是设置i的style的transform属性
            this._setHeading(oGpsInfo, 180);

            var cHtml = this.getVecMarkerHtmlNotBtn(oGpsInfo);

            if (this.getPopupOpen()) {
                oLayer.bindPopup(cHtml, { autoPan: false }).openPopup();
            }
            else {
                oLayer.bindPopup(cHtml, { autoPan: false });
            }

            //注册点击事件，
            return oLayer;
        }
        else {

            oLivePosLayer.moveTo(oLatLng, this.nSpeed);

            this._setHeading(oGpsInfo,180);

            var cHtml = this.getVecMarkerHtmlNotBtn(oGpsInfo);
            oLivePosLayer.setPopupContent(cHtml);

            if (this.getPopupOpen()) {
                oLivePosLayer.openPopup();
            }
            else {
                oLivePosLayer.closePopup();
            }
        }
        oLivePosLayer._bringToFront();
        return oLivePosLayer;
    },

});

/**
 * 画箭头 ， 在轨迹线上画箭头、画箭头
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.RealTrack.TrackArrow = ES.TrackView.RealTrack.BaseRealTrack.extend({

    oOption: {
        // 像素显示
        nLenPx: 20,

    },

    // 系统构造函数
    initialize: function (oParent, oOption) {
        ES.TrackView.RealTrack.BaseRealTrack.prototype.initialize.call(this, oParent, oOption);
        this._oParent = oParent;

        this.initOn();

        this.initGroup();

        this._reDrawArrow();
    },


    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.firstReqTrackBC, this);

        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.setTrackClass, this);

        this._oParent.on(this._oParent.getEvenName("setTrackClass"), this.setTrackClass, this);


    },

    // 画箭头
    firstReqTrackBC: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) return;
        if (!this._oLayerGroup) return;
        this.oTrackData = oData;
        this.clearMap();

        this._drawArrow(this.oTrackData);

        this.setTrackClass();
    },
    /*
     setTrackClass: function () {
     var oCkbStatus = this._oParent.getCkbStatus();
     if (!oCkbStatus) return;
     var aoLayer = this._oLayerGroup.getLayers();
     if (!aoLayer || aoLayer.length <= 0) return;

     for (var i = 0 ; i < aoLayer.length; i++) {
     if (oCkbStatus.bIsTrackLine) {
     L.DomUtil.removeClass(aoLayer[i]._path, 'ec-hide');
     }
     else {
     L.DomUtil.addClass(aoLayer[i]._path, 'ec-hide');
     }
     }
     },
     */
    setTrackClass: function () {
        var oCkbStatus = this._oParent.getCkbStatus();
        if (!oCkbStatus) return;

        if (oCkbStatus.bIsTrackLine) {
            this._drawArrow(this.oTrackData);
        }
        else {
            this.clearMap();
        }

    },

    //画箭头，在线上画箭头
    //画箭头的思想
    //1.按照像素来画，相隔10个像素画一个箭头
    _drawArrow: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) return;

        this.aoTrack = oData.aoTrack;

        var PhoneNum = oData.aoTrack[0].PhoneNum;
        var oLineLayer = this.findLayer(this._oLineGroup, PhoneNum);

        var aoLatLng = oData.aoTrack.map(function (oItem) {
            return L.latLng(oItem.Lat, oItem.Lng);
        })

        //像素间隔
        var nZoom = this._oMap.getZoom();

        // 累计长度
        var nPlen = 0;
        // 判断是否画箭头
        var bDrawA = false;
        for (var i = 0; i < aoLatLng.length; i++) {
            if (i == (aoLatLng.length - 1)) break;
            var nBP = this._oMap.project(aoLatLng[i], nZoom);
            var nEp = this._oMap.project(aoLatLng[i + 1], nZoom);

            // 累计长度
            var nPlen = nPlen + nBP.distanceTo(nEp);

            // 分段长度
            var nPSub = nBP.distanceTo(nEp);

            if (bDrawA) {
                if (nPSub < 2) {
                    continue;
                }
                bDrawA = false;
                //当前i值必须画箭头
                //添加点，在中间
                var oMidLatLng = L.latLng({ lat: ((aoLatLng[i].lat + aoLatLng[i + 1].lat) / 2).toFixed(6), lng: ((aoLatLng[i].lng + aoLatLng[i + 1].lng) / 2).toFixed(6) });

                var aoTemp = [aoLatLng[i], oMidLatLng];
                var oTempConfig = {};
                ES.extend(oTempConfig, ES.TrackView.Config.oLiveLineConfig, { bEndArrow: true,weight:2 });
                var oPloyLine = L.polyline(aoTemp, oTempConfig);
                oPloyLine.addTo(this._oLayerGroup);
                oPloyLine.bringToFront();

                nPlen = 0;
                continue;
            }

            if (nPlen > this.oOption.nLenPx) {
                //下一个点画箭头
                bDrawA = true;
            }
        }

        this._oParent.fire(this._oParent.getEvenName("setToFront"));
    },


    // 清除非法箭头
    _reDrawArrow: function () {
        var self = this;
        this._oMap.on("moveend", function (e) {
            if (!self.aoTrack || !self._oLayerGroup) return;
        self._oLayerGroup.clearLayers();
        self._drawArrow({ aoTrack: self.aoTrack });
        $("path[d='M0 0'][marker-end='url(#arrow)']").remove();
        self.setTrackClass();
        self._oParent.fire("ES.MapOpr.TrackView.TrackArrow: moveend")
        self._oParent.fire(this._oParent.getEvenName("setToFront"));
    }, this)
    },

});


/**
 * Created by liulin on 2017/2/22.
 */

    // 实时画线操作
ES.TrackView.RealTrack.TrackLine =ES.TrackView.RealTrack.BaseRealTrack.extend({

    // 引用内部事件
    includes: ES.Mixin.Events,

    oEvenName:{ // 画起始点对象
        drawMarker: "Track:BeginEndMarker.drawMarker",
    },

    // 系统构造函数
    initialize: function (oParent, oOption) {
        ES.TrackView.RealTrack.BaseRealTrack.prototype.initialize.call(this, oParent, oOption);
        this._oParent = oParent;

        //单次轨迹停车计算
        this.aoParkInfo = new Array();
        this.initOn();
        this.initGroup();
    },

    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.firstReqTrackBC, this);

        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.noticeTimerPlay, this);

        this._oParent.on(this._oParent.getEvenName("setTrackClass"), this.setTrackClass, this);
    },

    // 画轨迹线
    firstReqTrackBC: function (oData) {
        this.noticeTimerPlay(oData);
        var oBound = this._oLayerGroup.getBounds();
        if (!oBound) {
            return;
        }
        if (!oBound.hasOwnProperty('_northEast')) {
            return;
        }

        this._oMap.fitBounds(oBound);

    },

    noticeTimerPlay: function (oData) {
        this.drawTrack(oData)
        this.setTrackClass(oData);
    },

    drawTrack: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) {
            this.aoLatLng = [];
            return;
        }
        this.PhoneNum = oData.aoTrack[0].PhoneNum;

        this.aoLatLng = oData.aoTrack.map(function (oItem) {
            return [oItem.Lat, oItem.Lng]
        })
    },
    setTrackClass: function () {
        var oCkbStatus = this._oParent.getCkbStatus();
        if (!oCkbStatus) return;
        if (oCkbStatus.bIsTrackLine) {
            var oLineLayer = this.findLayer(this._oLayerGroup, this.PhoneNum);
            if (oLineLayer) {
                oLineLayer.setLatLngs(this.aoLatLng);
            }
            else {
                oLineLayer = L.polyline(this.aoLatLng, ES.TrackView.Config.oLiveLineConfig);
                oLineLayer.addTo(this._oLayerGroup);
            }
        } else {
            this.clearMap();
        }
    },

    //画线,传递经纬度数据
    drawLine: function (oData) {
        //this.reSizeMap();

        var oLineLayer = this.findLayer(this._oLayerGroup, oPosInfo.cDevId);
        if (!oLineLayer) {
            //创建线图层 fill-opacity
            oLineLayer = L.polyline(oPosInfo.aoLatLng, ES.TrackView.Config.oLiveLineConfig);
            oLineLayer.addTo(this._oLayerGroup);
            this._drawArrow(oPosInfo.aoLatLng);

            this.clearNullArrow(oPosInfo.cDevId);
        }
        else {
            oLineLayer.setLatLngs(oPosInfo.aoLatLng);
            this._drawArrow(oLineLayer.getLatLngs());
        }

        return oLineLayer;

    },


});

/**
 * 轨迹点在地图上的展示,存在问题，轨迹点可能重复画
 * Created by liulin on 2017/2/22.
 */


ES.TrackView.RealTrack.TrackMarker = ES.TrackView.RealTrack.BaseRealTrack.extend({
    // 系统构造函数
    initialize: function (oParent, oOption) {
        ES.TrackView.RealTrack.BaseRealTrack.prototype.initialize.call(this, oParent, oOption);
        this._oParent = oParent;

        //单次轨迹停车计算
        this.aoParkInfo = new Array();
        this.initOn();
        this.initGroup();
    },

    // 监听多个事件
    initOn: function () {

        // 监听点击查询事件
        // 监听第一次请求数据回调
        this._oParent.on(this._oParent.getEvenName("firstReqTrackBC"), this.firstReqTrackBC, this);
        //通知定时器开始执行播放轨迹
        this._oParent.on(this._oParent.getEvenName("noticeTimerPlay"), this.firstReqTrackBC, this);
        this._oParent.on(this._oParent.getEvenName("setPosClass"), this.setPosClass, this);

        this._oParent.on(this._oParent.getEvenName("setToFront"), this.setToFront, this);
    },

    setToFront: function () {
        this._oLayerGroup.bringToFront();
    },

    //轨迹点
    firstReqTrackBC: function (oData) {
        if (!oData || !oData.aoTrack || oData.aoTrack.length <= 0) return;
        this.aoTrack = oData.aoTrack;
        this.setPosClass();
    },

    setPosClass: function () {
        var oCkbStatus = this._oParent.getCkbStatus();
        if (!oCkbStatus) return;
        if (oCkbStatus.bIsTrackPos) {
            var self = this;
            $.each(this.aoTrack, function (nIndex, oItem) {
                var oPosMarker = L.circleMarker([oItem.Lat, oItem.Lng], ES.TrackView.Config.oTrackPosConfig);
                var cHtml = self.getVecMarkerHtmlNotBtn(oItem);
                oPosMarker.bindPopup(cHtml);
                oPosMarker.addTo(self._oLayerGroup);
            })
        } else {
            this.clearMap();
        }
    },



});

/**
 * Created by liulin on 2017/2/23.
 */

ES.VehTrackInfo = ES.Class.extend({

})

/**
 * 密闭、顶灯、GPS、网络信息
 * Created by liulin on 2017/2/23.
 */

ES.VehTrackInfo.RealStatus = ES.VehTrackInfo.extend({

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

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;
        //this.$_oContent = $(".ex-layout-cardetail-content.veh-real-status");
        this.$_oContent = $(".ex-layout-maptool.ex-theme-maptool.ex-map-bottom.ex-map-right");
        this.$_oContent.css("visibility", "hidden");

        //初始化事件监听
        this.initOn();

    },


    // 监听事件
    initOn: function () {
        this._oParent.on("ES.MapOpr.TrackView.TrackPos:drawVecPos", this.callBack, this);

    },

    callBack: function (oData) {
        this.$_oContent.css("visibility", "visible");
        this.setVehLight(oData.oGpsInfo);
        this.setMobileInfo(oData.oGpsInfo);
        this.setVehStatusInfo(oData.oGpsInfo);
    },
    // 车顶灯状态
    setVehLight: function (oGpsInfo) {
        if (!oGpsInfo) return;

        $(".car-light").removeClass("l-green").removeClass("l-red").removeClass("l-yellow").removeClass("l-gray");
        $('a[cId="cz"]').removeClass("green").removeClass("warning").removeClass("yellow");
        var cClass = "l-gray";
        // if ((oGpsInfo.nGreenOn + oGpsInfo.nRedOn + oGpsInfo.nYelloOn) != 1) {
        //     cClass = "l-gray";
        //     //$('a[cid="cz"]').addClass('noline');
        // }
        // else if (oGpsInfo.nGreenOn == 1) {
        //     cClass = "l-green";
        //     $('a[cId="cz"]').addClass('green');
        // }
        // else if (oGpsInfo.nRedOn == 1) {
        //     cClass = "l-red";
        //     $('a[cId="cz"]').addClass('warning');
        // }
        // else {
        //     cClass = "l-yellow";
        //     $('a[cId="cz"]').addClass('yellow');
        // }

        if (oGpsInfo.Property.ZtLeightGreenOn ==='True') {
            cClass = "l-green";
            $('a[cId="cz"]').addClass('green');
        }
        else if (oGpsInfo.Property.ZtLeightRedOn ==='True') {
            cClass = "l-red";
            $('a[cId="cz"]').addClass('warning');
        }
        else if (oGpsInfo.Property.ZtLeightYelloOn ==='True'){
            cClass = "l-yellow";
            $('a[cId="cz"]').addClass('yellow');
        }

        $(".car-light").addClass(cClass);
    },

    // 设置顶棚状态
    setVehStatusInfo: function (oGpsInfo) {
        if (!oGpsInfo.Status) return;
        $(this.oOption.cTagVehStatusInfo).parent().show();
        //var oStatus = oGpsInfo.Status;
        // for (var cKey in oStatus) {
        //     var oA = $('a[cId="' + cKey + '"]');
        //     if (!oA) continue;
        //     oStatus[cKey] ? oA.addClass('warning') : oA.removeClass('warning');
        // }

        //设置顶灯状态 开为 -360px ，关 为0px
        oGpsInfo.FrontDoor ? $('.car-cover').animate({ "left": "-360px" }, 500) : $('.car-cover').animate({ "left": "0px" }, 500);
        oGpsInfo.FrontDoor ? $('.car-cover').css("left", "-360px") : $('.car-cover').css("left", "0px");

        //设置是否超速
        // if (oGpsInfo.Speed > 60) {
        //     $('a[cId="cs"]').addClass("warning");
        // }
        // else {
        //     $('a[cId="cs"]').removeClass("warning");
        // }

        // 设置未密封
        //$('a[cId="OilLinetemp"]').removeClass("warning").removeClass("check");
        //设置未密封 速度大于0 ，但是门磁为1
        // if (oGpsInfo.Speed > 0 && oGpsInfo.Status.FrontDoor) {
        //     $('a[cId="OilLinetemp"]').addClass("warning");
        // }
        // else if (oGpsInfo.Status.FrontDoor == false) {
        //    $('a[cId="OilLinetemp"]').addClass("check");
        // }
    },

    // 设置车辆gps信息 和 网络信息
    setMobileInfo: function (oGpsInfo) {
        //去掉on状态
        var $_oIMobile = $(".ex-icon-mobile");
        var $_oIBD = $(".ex-icon-bd");

        $_oIMobile.removeClass("on").removeClass("off");
        $_oIBD.removeClass("on").removeClass("off");
        $_oIMobile.addClass("on");
        $_oIBD.addClass("on");

        // //判断当前位置信息
        // if (oGpsInfo.VehicleStatus == "行驶"
        //     || oGpsInfo.VehicleStatus == "停车"
        //     || oGpsInfo.VehicleStatus == "熄火") {
        //     $_oIMobile.addClass("on");
        //     $_oIBD.addClass("on");
        // }
        // else if (oGpsInfo.VehicleStatus == "通讯中断") {
        //     $_oIMobile.addClass("l-mobile-off");
        //     $_oIBD.addClass("l-bd-off");
        // }
        // else if (oGpsInfo.VehicleStatus == "定位失败") {
        //     $_oIMobile.addClass("on");
        //     $_oIBD.addClass("off");
        // }
        // else {
        //     $_oIMobile.addClass("off");
        //     $_oIBD.addClass("off");
        // }
    },

})

/**
 * Created by liulin on 2017/2/23.
 */

ES.VehTrackInfo.SpeedChart = ES.VehTrackInfo.extend({
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
        //初始化事件监听
        this.initOn();

    },

    // 初始化图表
    initChart: function () {
        this.oChart = echarts.init(document.getElementById(this.oOption.cDivContain));
        this._setChartConfig();
    },

    // 监听事件
    initOn: function () {
        this._oParent.on("ES.MapOpr.TrackView.TrackPos:drawVecPos", this.callBack, this);

    },
    callBack: function (oData) {
        this.changeSpeed(oData.oGpsInfo);
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
            backgroundColor: '#136635',
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
                    axisLine: {
                        lineStyle: {
                            width: 3,
                            color: [[nRedSpeed, '#72d572'], [1, '#f4511e']]
                        }
                    },
                    axisTick: {
                        length: 6,
                        lineStyle: {
                            color: 'auto'
                        }
                    },
                    splitLine: {
                        length: 9,
                        lineStyle: {
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
                    data: [{ value: 0, name: '速度' }]
                }
            ]
        };

        this.oChart.setOption(this.oChartOption, true);
    },

    // 设置速度值
    changeSpeed: function (oGpsInfo) {
        this.oChartOption.series[0].data[0].value = oGpsInfo.Speed;
        this.oChart.setOption(this.oChartOption, true);
    },

    // 清空图表
    clearChart: function () {
        if (!this.oChart) return;
        this.oChart.clear();
    },

})

/**
 * 载重码表
 * Created by liulin on 2017/2/23.
 */

ES.VehTrackInfo.WeightChart = ES.VehTrackInfo.extend({
    oOption: {
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
        //初始化事件监听
        this.initOn();

    },

    // 初始化图表
    initUI: function () {
        this.oChart = echarts.init(document.getElementById(this.oOption.cDivContain));
        this._setChartConfig();
    },
    initOn: function () {
        this._oParent.on("ES.MapOpr.TrackView.TrackPos:drawVecPos", this.callBack, this);

    },
    callBack: function (oData) {
        this.changeWeight(oData.oGpsInfo);

    },
    // 设置图表属性
    _setChartConfig: function (ec) {

        var nRedSpeed = this.oOption.nAvgSpeed / this.oOption.nMaxSpeed;

        this.oChartOption = {
            backgroundColor: '#136635',
            tooltip: {
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
                    axisLine: {
                        lineStyle: {
                            width: 5,
                            color: [[0.1, '#fff'], [0.6, '#00ff00'], [0.8, '#f5c01b'], [1, '#b62d22']]
                        }
                    },
                    axisTick: {
                        length: 6,
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {
                        length: 9,
                        lineStyle: {
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
                            color: '#fff', fontSize: 20, fontWeight: 'bold'
                        },
                    },
                    data: [{ value: 0, name: '速度' }]
                }
            ]
        };
        this.oChart.setOption(this.oChartOption, true);


    },
    // 设置载重值
    changeWeight: function (oGpsInfo) {
        //return;
        if (!oGpsInfo) {
            return;
        }
        //ES.TrackHelper.convertVehStatus(oGpsInfo);
        var nMax = 100;
        var dWeight = parseInt(oGpsInfo.sWeightValue) || 0;

        if (oGpsInfo.Property.ZtLeightGreenOn ==='True') {
            nMax = dWeight * 100 / 50;
        }
        else if (oGpsInfo.Property.ZtLeightRedOn ==='True') {
            nMax = dWeight * 100 / 90;
        }
        else if (oGpsInfo.Property.ZtLeightYelloOn ==='True'){
            nMax = dWeight * 100 / 70;
        }
        else {
            nMax = dWeight * 100 / 5;

        }

        // if ((oGpsInfo.nGreenOn + oGpsInfo.nRedOn + oGpsInfo.nYelloOn) != 1) {
        //    //此时为白灯
        //    nMax = dWeight * 100 / 5;
        // }
        // else if (oGpsInfo.nGreenOn == 1) {
        //    nMax = dWeight * 100 / 50;
        // }
        // else if (oGpsInfo.nYelloOn == 1) {
        //    nMax = dWeight * 100 / 70;
        // }
        // else {
        //    nMax = dWeight * 100 / 90;
        // }


        this.oChartOption.series[0].max = nMax || 100;


        this.oChartOption.series[0].data[0].value =parseInt(oGpsInfo.sWeightValue) ;
        this.oChart.setOption(this.oChartOption, true);
    },

})

/**
 * 负责画工地图层
 * Created by liulin on 2018/4/15.
 */


ES.TrackView.SiteLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {

        oStyleConfig: {

            stroke: true,
            color: 'green',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 0.6,
            fill: true,
            fillColor: 'green',
            fillOpacity: 0.1,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

        oStyleSmallConfig: {

            stroke: true,
            color: 'green',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: false,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

    },


    _getLineColor: function (oData, cTarget) {

        return {color: 'green'};
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
        this._oParent.on('TrackView.SiteLayer:DrawArea', this.drawLayers, this);
        this._oParent.on('TrackView.SiteLayer:ClearArea', this.clearLayer, this);
        this._oParent.on('TrackView.SiteLayer:RemoveArea', this.removeLayers, this);

    },

    removeLayers: function (oData) {
        var aoData = oData.aoData;
        for (var i = 0; i < aoData.length; i++) {
            var oLayer = this.findLayer(this._oPolylineGroup, aoData[i].Id);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oPolylineGroup.removeLayer(oLayer.oMarker);
            }
            this._oPolylineGroup.removeLayer(oLayer);
        };
    },

    clearLayer: function () {
        this._oPolylineGroup.clearLayers();
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function (oData) {

        if (!oData || !oData.aoData) {
            return;
        }

        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {

            var oLayer = this.findLayer(this._oPolylineGroup, oData.aoData[i].Id);
            if (oLayer) {
                continue;
            }
            this.drawLayer(oData.aoData[i], oData.cTarget);
        }

    },

    drawLayer: function (oData, cTarget) {
        if (!oData) {
            return;
        }

        // 编辑邮路,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oData, cTarget);
        if (!oVehLine) {
            return;
        }
        oVehLine.cId = oData.Id;
        oVehLine.bindTooltip(oData.Name);
        // var cHtml = ES.Util.template(this.cHtml, oData);
        //
        // var oIcon = this._getIcon(cHtml);
        //
        // var oMarker = L.marker(oVehLine.getCenter(), { icon: oIcon });
        //
        // oMarker.addTo(this._oPolylineGroup);
        // oVehLine.oMarker = oMarker;
    },

    _getIcon: function (cHtml) {

        var oIcon = L.divIcon({
            iconSize: [0, 0], iconAnchor: [15,20],
            popupAnchor: [-1, -20],
            className: "ex-monitor-mapicon-truck",
            html: cHtml,
        });
        return oIcon;
    },

    initEventForMarker: function (oMarker) {
        var self = this;
        if (!oMarker) {
            return;
        }

        oMarker.on('click', function () {

            ES.Util.reqData({
                    url: '/AssessSegment/GetMapPopup',
                    data: {Mseg: this.SegmentCode},
                    dataType: 'html',
                },
                function (oData) {
                    this.bindPopup(oData.rtnData, {maxWidth: 400});
                    this.openPopup();
                },
                this);

        }, oMarker);

    },

    // 设置图层设置
    createLayer: function (oData, cTarget) {

        var oVehLine = this.findLayer(this._oPolylineGroup, oData.Id)

        if (oVehLine) {
            return oVehLine;
        }
        if (!oData  || !oData.MapY) {
            return oVehLine;
        }

        var aoLatLng = [];
        var lats = oData.MapY.split(",");
        var lngs = oData.MapX.split(",");
        for (var j = 0; j < lats.length; j++) {
            aoLatLng.push({lat: lats[j], lng: lngs[j]});
        }

        //ES.extend(this.oOption.oStyleConfig, this._getLineColor(oData, cTarget));

        oVehLine = L.polygon(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);


        return oVehLine;
    },


});

ES.TrackView.SiteLayer.include({
    cHtml:
    '<div class="car-body"></div>' +
    '<div class="pin-tip" style="display: block;">' +
    '     <div class="areaCount-number" ' +
    '           style="height: 22px;' +
    '           position: absolute;' +
    '           left: 13px;bottom: -25px;' +
    '           z-index: 17;background-color: #447e2a;color: #fff;' +
    '           border: 2px solid #fff;white-space: nowrap;' +
    '           box-shadow: 0 0 3px rgba(0,0,0,.55);' +
    '           padding: 0 10px 0 20px;border-radius: 0 2rem 2rem 0;">{Name}' +
    '   </div>' +
    '</div>'  ,

});

/**
 * Created by liulin on 2018/4/15.
 */

ES.TrackView.UnloadLayer = ES.TrackView.SiteLayer.extend({

    //执行画点，画线操作
    oOption: {

        oStyleConfig: {

            stroke: true,
            color: 'red',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 0.6,
            fill: true,
            fillColor: 'red',
            fillOpacity: 0.1,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

        oStyleSmallConfig: {

            stroke: true,
            color: 'red',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: false,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

    },


    //初始化时加载数据
    _loadOn: function () {

        // 画所有的工地数据
        this._oParent.on('TrackView.UnloadLayer:DrawArea', this.drawLayers, this);
        this._oParent.on('TrackView.UnloadLayer:ClearArea', this.clearLayer, this);
        this._oParent.on('TrackView.UnloadLayer:RemoveArea', this.removeLayers, this);


    },
});

/**
 * 可疑工地 图层绘制
 * 2018-05-12 修改： 要做可以工地里绘制可以出土点，显示可以出土时间、可疑车辆
 * Created by liulin on 2018/4/16.
 */

ES.TrackView.SusSiteLayer  = ES.TrackView.SiteLayer.extend({
    //执行画点，画线操作
    oOption: {

        oStyleConfig: {

            stroke: true,
            color: 'orange',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: true,
            fillColor: 'orange',
            fillOpacity: 0.1,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

        oStyleSmallConfig: {

            stroke: true,
            color: 'orange',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: false,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

    },

    //初始化时加载数据
    _loadOn: function () {

        // 画所有的工地数据
        this._oParent.on('TrackView.SusSiteLayer:DrawArea', this.drawLayers, this);
        this._oParent.on('TrackView.SusSiteLayer:ClearArea', this.clearLayer, this);

    },

    drawLayers: function (oData) {

        this._oPolylineGroup.clearLayers();

        var aoLatLng = this._oParent.getLatLngs();
        if (!aoLatLng) {
            return;
        }
        var oVehLine = L.polygon(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);

        var cHtml = ES.Util.template(this.cHtml, {Name: '可疑工地'});

        var oIcon = this._getIcon(cHtml);

        var oMarker = L.marker(oVehLine.getCenter(), {icon: oIcon});

        oMarker.addTo(this._oPolylineGroup);

        oVehLine.oMarker = oMarker;

        var oBound = this._oPolylineGroup.getBounds();

        if (!oBound.isValid()) {
            return;
        }
        this._oMap.fitBounds(oBound);
    },


    drawSusSite: function () {
        if (m_cLatLng === "" || !m_cLatLng) {
            return;
        }

        var acTemp = m_cLatLng.split(',');
        if(!acTemp ||acTemp.length!=2){
            return;
        }

        var oLatLng = L.latLng(acTemp[1],acTemp[0]);

        this.drawLayers({oLatLng:oLatLng});



    }

});

/**
 * 工地
 * Created by liulin on 2018/4/25.
 */

ES.TrackView.WorkSiteLayer = ES.TrackView.SiteLayer.extend({

    initialize: function (oParent, oOption) {
        ES.TrackView.SiteLayer.prototype.initialize.call(this, oParent, {});

        // 初始化界面
        this.initUI();

    },
    initUI:function() {

        var nSiteId = this._oParent.getSiteId();

        if (!nSiteId) {
            return
        }

        ES.Util.reqData({data: {anId: [-nSiteId]}, url: '/Site/GetSiteByIds'}, function (oData) {

            this.drawLayer(oData);

        }, this);

    },

    //初始化时加载数据
    _loadOn: function () {

    },

    drawLayer: function (oData, cTarget) {
        if (!oData || !oData.rtnData || oData.rtnData.length<=0) {
            return;
        }

        var oSite = oData.rtnData[0];
        // 编辑邮路,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oSite, cTarget);
        if (!oVehLine) {
            return;
        }
        oVehLine.cId = oSite.Id;

        var cHtml = ES.Util.template(this.cHtml, oSite);

        var oIcon = this._getIcon(cHtml);

        var oMarker = L.marker(oVehLine.getCenter(), { icon: oIcon });

        oMarker.addTo(this._oPolylineGroup);
        oVehLine.oMarker = oMarker;
    },

    // 设置图层设置
    createLayer: function (oData, cTarget) {

        var oVehLine = this.findLayer(this._oPolylineGroup, oData.Id)

        if (oVehLine) {
            return oVehLine;
        }
        if (!oData  || !oData.Points) {
            return oVehLine;
        }

        oVehLine = L.polygon(oData.Points, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);

        return oVehLine;
    },

});

/**
 * 可疑消纳点
 * Created by liulin on 2018/5/2.
 */


ES.TrackView.SusUnloadLayer  = ES.TrackView.SiteLayer.extend({
    //执行画点，画线操作
    oOption: {

        oStyleConfig: {

            stroke: true,
            color: 'orange',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: true,
            fillColor: 'orange',
            fillOpacity: 0.1,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

        oStyleSmallConfig: {

            stroke: true,
            color: 'orange',
            dashArray: null,
            lineCap: null,
            lineJoin: null,
            weight: 2,
            opacity: 1,
            fill: false,
            fillColor: null,
            fillOpacity: 0.2,
            clickable: false,
            smoothFactor: 1.0,
            noClip: false

        },

    },

    //初始化时加载数据
    _loadOn: function () {

        // 画所有的工地数据
        this._oParent.on('TrackView.SusUnloadLayer:DrawArea', this.drawLayers, this);
        this._oParent.on('TrackView.SusUnloadLayer:ClearArea', this.clearLayer, this);

    },

    drawLayers: function (oData) {

        this._oPolylineGroup.clearLayers();

        var aoLatLng =this._oParent.getSusUnloadLatLngs();
        if(!aoLatLng) {
            return;
        }
        var oVehLine = L.polygon(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);

        var cHtml = ES.Util.template(this.cHtml, {Name :'可疑消纳'});

        var oIcon = this._getIcon(cHtml);

        var oMarker = L.marker(oVehLine.getCenter(), { icon: oIcon });

        oMarker.addTo(this._oPolylineGroup);

        oVehLine.oMarker = oMarker;

        var oBound = this._oPolylineGroup.getBounds();

        if (!oBound.isValid()) {
            return;
        }
        this._oMap.fitBounds(oBound);
    },


    drawSusSite: function () {
        if (m_cLatLng === "" || !m_cLatLng) {
            return;
        }

        var acTemp = m_cLatLng.split(',');
        if(!acTemp ||acTemp.length!=2){
            return;
        }

        var oLatLng = L.latLng(acTemp[1],acTemp[0]);

        this.drawLayers({oLatLng:oLatLng});



    }

});

/**
 * 单画一个工地数据
 * Created by liulin on 2018/5/2.
 */

ES.TrackView.WorkUnloadLayer = ES.TrackView.UnloadLayer.extend({

    initialize: function (oParent, oOption) {
        ES.TrackView.UnloadLayer.prototype.initialize.call(this, oParent, {});

        // 初始化界面
        this.initUI();

    },
    initUI:function() {

        var nSiteId = this._oParent.getUnloadId();

        if (!nSiteId) {
            return
        }

        ES.Util.reqData({data: {anId: [nSiteId]}, url: '/Unload/GetUnloadByIds'}, function (oData) {

            this.drawLayer(oData);

        }, this);

    },

    //初始化时加载数据
    _loadOn: function () {

    },

    drawLayer: function (oData, cTarget) {
        if (!oData || !oData.rtnData || oData.rtnData.length<=0) {
            return;
        }

        var oSite = oData.rtnData[0];
        // 编辑邮路,画围栏时要表明自己的名称
        var oVehLine = this.createLayer(oSite, cTarget);
        if (!oVehLine) {
            return;
        }
        oVehLine.cId = oSite.Id;

        var cHtml = ES.Util.template(this.cHtml, oSite);

        var oIcon = this._getIcon(cHtml);

        var oMarker = L.marker(oVehLine.getCenter(), { icon: oIcon });

        oMarker.addTo(this._oPolylineGroup);
        oVehLine.oMarker = oMarker;
    },

    // 设置图层设置
    createLayer: function (oData, cTarget) {

        var oVehLine = this.findLayer(this._oPolylineGroup, oData.Id)

        if (oVehLine) {
            return oVehLine;
        }
        if (!oData  || !oData.Points) {
            return oVehLine;
        }

        oVehLine = L.polygon(oData.Points, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);

        return oVehLine;
    },

});

}(window, document, L, jQuery));
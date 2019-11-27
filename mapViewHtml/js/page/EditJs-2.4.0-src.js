/*
EditJs-2.4.0 code for exsun

Copyright©2015-2018 武汉依迅北斗空间技术有限公司 All Rights Reserved.

http://www.exsun.cn
*/




var jsFunc = function() {/**
 * Created by exsun003 on 2018/11/14.
 */

L.MapLib = {};
L.MapLib.MapMaster = {};
L.MapLib.MapMaster.vertion = '0.0.1';
L.MapLib.MapMaster.TileProvider = {

    oTianDiTu: {
        oNormal: {
            cName: '天地图',
            cMap: "http://t{s}.tianditu.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}",
            cAnnotion: "http://t{s}.tianditu.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}",
            acSubdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
        },
        oSatellite: {
            cName: '天地卫星图',
            cMap: "http://t{s}.tianditu.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}",
            cAnnotion: "http://t{s}.tianditu.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}",
            acSubdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
        },
        oTerrain: {
            cName: '天地地形图',
            cMap: "http://t{s}.tianditu.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}",
            cAnnotion: "http://t{s}.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}",
            acSubdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
        },
    },

    oMapABC: {
        oNormal: {
            cName: 'MapABC',
            cMap: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            acSubdomains: ["a", "b", "c"]
        }
    },

    oGaoDe: {
        oNormal: {
            cName: '高德地图',
            cMap: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            acSubdomains: ["1", "2", "3", "4"]
        },
        oSatellite: {
            cName: '高德卫星图',
            cMap: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',

            acSubdomains: ["1", "2", "3", "4"]
        },
        oNetRoad: {
            cName: '高德路网图',
            cMap: 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
            acSubdomains: ["1", "2", "3", "4"]
        }
    },

    oExSun: {
        oNormal: {
            cName: '依迅地图',
            cMap: 'http://title.comlbs.com/map/get/{x}/{y}/{z}',
            acSubdomains: ["1", "2", "3", "4"]
        },
        oNormalSvr: {
            cName: '依迅服务器图',
            cMap: 'http://title.comlbs.com/mapimg.aspx?t=mapabc&z={z}&x={x}&y={y}',
            acSubdomains: ["1", "2", "3", "4"]
        },
    },

    oGoogleMap: {
        oNormal: {
            cName: '谷歌地图',
            cMap: 'http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
            acSubdomains: ["1", "2", "3", "4"]
        },
        oSatellite: {
            cName: '谷歌卫星图',
            cMap: 'http://mt3.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
            acSubdomains: ["1", "2", "3", "4"]
        },
        oTopographic: {
            cName: '谷歌地形图',
            cMap: 'http://mt0.google.cn/vt/lyrs=t&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
            nMaxLevel: 16,
            acSubdomains: ["1", "2", "3", "4"]
        },

    },

    oArcMap: {
        oFoursquare: {
            cMap: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
            cName: '灰度图',
            acSubdomains: ["1", "2", "3", "4"]
        },

    },

    oTDMap: {
        oNormal: {
            cName: '立体图',
            cMap: 'https://a.tiles.mapbox.com/v3/foursquare.map-0y1jh28j/{z}/{x}/{y}.png',
            acSubdomains: ["1", "2", "3", "4"]
        },
    },


};

// 定义快捷方式0,1,2 为天地图瓦片
L.MapLib.MapMaster.TileProvider[0]=L.MapLib.MapMaster.TileProvider.oTianDiTu.oNormal;
L.MapLib.MapMaster.TileProvider[1]=L.MapLib.MapMaster.TileProvider.oTianDiTu.oSatellite;
L.MapLib.MapMaster.TileProvider[2]=L.MapLib.MapMaster.TileProvider.oTianDiTu.oTerrain;

// 定义快捷方式 3 为MABC瓦片
L.MapLib.MapMaster.TileProvider[3]=L.MapLib.MapMaster.TileProvider.oMapABC.oNormal;

// 定义快捷方式 4，5，6 为高德瓦片
L.MapLib.MapMaster.TileProvider[4]=L.MapLib.MapMaster.TileProvider.oGaoDe.oNormal;
L.MapLib.MapMaster.TileProvider[5]=L.MapLib.MapMaster.TileProvider.oGaoDe.oSatellite;
L.MapLib.MapMaster.TileProvider[6]=L.MapLib.MapMaster.TileProvider.oGaoDe.oNetRoad;

// 依迅地图瓦片
L.MapLib.MapMaster.TileProvider[7]=L.MapLib.MapMaster.TileProvider.oExSun.oNormal;
L.MapLib.MapMaster.TileProvider[8]=L.MapLib.MapMaster.TileProvider.oExSun.oNormalSvr;

L.MapLib.MapMaster.TileProvider[9]=L.MapLib.MapMaster.TileProvider.oGoogleMap.oNormal;
L.MapLib.MapMaster.TileProvider[10]=L.MapLib.MapMaster.TileProvider.oGoogleMap.oSatellite;
L.MapLib.MapMaster.TileProvider[11]=L.MapLib.MapMaster.TileProvider.oGoogleMap.oTopographic;

L.MapLib.MapMaster.TileProvider[12]=L.MapLib.MapMaster.TileProvider.oArcMap.oFoursquare;
L.MapLib.MapMaster.TileProvider[13]=L.MapLib.MapMaster.TileProvider.oTDMap.oNormal;


L.MapLib.MapMaster.Err= {

    1: '没有设置图层！',
    2: 'Map parent container not found.',

};

L.MapLib.MapMaster.EventName= {

    // 地图加载完毕事件
    loadFinish: 'Map:loadFinish',

};


L.MapLib.MapMaster.Map = L.Evented.extend({

    //对象的固有参数
    options: {

        // 地图div
        cDidId: 'divMap',

        // 地图容器上级容器
        cDivContainerId: 'divContainer',

        // 默认的图层
        nDefaultTile: 4,

        // 地图配置
        oMapOption: {
            zoomControl: false,
            layers: [],
            // center: new L.LatLng(30.55072, 114.29471), // 武汉中心点
            center: new L.LatLng(31.17547255, 115.00334782), // 麻城中心点
            zoom: 13
        },

        //瓦片参数
        oTileOption: {
            maxZoom: 18,
            minZoom: 3,
            attribution: 'Map &copy;GB-20263—2018 <a target="_blank" href="#">电子地图</a> '
        },

        // 加载的瓦片,依据快捷方式加载
        anLoadTile: [4, 5, 6, 9, 10, 11, 12],

        // 地图图层提供者
        oProvider: L.MapLib.MapMaster.TileProvider,

        nMapWidth: 1200,
        nMapHeight: 550

    },

    // 一下参数是一些常量
    cDiv: 'div',

    //对象的构造函数,oParent为外部对象
    initialize: function (oParent, options) {
        L.setOptions(this, options);

        // 加载外部page数据
        this._oParent = oParent;

        // 加载的图层数据
        this._oBaseLayer = {};
        // 默认图层
        this._oDefaultTile = undefined;
        // 加载图层
        this._initTile();

        this._getDefaultLayer();

        return this;
    },


    //一下为公共方法，地图有创建容器，或者在已经有的容器中添加数据

    //获得默认的瓦片设置
    getDefaultTile: function () {
        var cName = this.options.oProvider[this.options.nDefaultTile].cName;
        return this._oBaseLayer[cName];
    },

    //外部要重写此方法 当前html加载到页面中后触发
    loadMapMaster: function () {

        this._loadMap();
        return this;
    },

    //获得地图控件
    getMap: function () {
        return this._oMap;
    },

    //设置基本图层，外部可以获取当前图层瓦片
    getBaseLayers: function () {

        if (!this._oBaseLayer) {
            throw new Error('地图瓦片图层为空');
        }

        return this._oBaseLayer;
    },

    //获得默认的图层设置
    _getDefaultLayer: function () {

        var cName = this.options.oProvider[this.options.nDefaultTile].cName;

        this._oDefaultTile = this._oBaseLayer[cName];
        return this._oDefaultTile;
    },

    //加载地图
    _loadMap: function () {

        // 首先要判断是否有地图div ，没有就在地图容器中加载div
        var oDiv = L.DomUtil.get(this.options.cDidId);
        var nWidth = null, nHeight = null
        // if(this.options.drawType){
        //     nWidth = this.options.nMapWidth;
        //     nHeight = this.options.nMapHeight;
        // }else{
        //     nWidth = this.nMapWidth;
        //     nHeight = this.nMapHeight;
        // }
        nWidth = this.nMapWidth;
        nHeight = this.nMapHeight;
        if (!oDiv) {

            var oContainer = L.DomUtil.get(this.options.cDivContainerId);
            if (!oContainer) {

                throw new Error('不存在地图加载容器');
            }

            oDiv = L.DomUtil.create(this.cDiv, '', oContainer);
        }

        oDiv.style.width = nWidth + 'px';
        oDiv.style.height = nHeight + 'px';
        oDiv.id = this.options.cDidId;

        L.Util.extend(this.options.oMapOption, {layers: [this._oDefaultTile]});

        var oMap = this._oMap = new L.Map(this.options.cDidId, this.options.oMapOption);

        if (this._oParent) {
            if (this._oParent.setMap) {
                this._oParent.setMap(oMap);
            }
            //this._oParent.fire('Map:loadFinish', {oMap: oMap});

            this.fire('Map:loadFinish', {oMap: oMap});
        }

        return oMap;
    },

    // 初始化 瓦片数据
    _initTile: function () {

        var oOption = L.extend({}, this.options.oTileOption);
        var oProvider = this.options.oProvider;
        var anLoadTile = this.options.anLoadTile;

        if (!anLoadTile || anLoadTile.length <= 0) {
            return;
        }

        if (!oProvider) {
            return;
        }

        var oBaseLayer = {};
        for (var i = 0; i < anLoadTile.length; i++) {
            var oTemp = oProvider[anLoadTile[i]];
            oOption.maxZoom = oTemp.nMaxLevel || oOption.maxZoom;
            oOption.minZoom = oTemp.nMinLevel || oOption.minZoom;
            oOption.subdomains = oTemp.acSubdomains;

            var oTile = L.tileLayer(oTemp.cMap, oOption);

            oBaseLayer[oTemp.cName] = oTile;
        }

        this._oBaseLayer = oBaseLayer;

        if (this._oParent) {
            //this._oParent.fire('Map:loadTileFinish', {oBaseLayer: oBaseLayer});
        }

        this.fire('Map:loadTileFinish', {oBaseLayer: oBaseLayer});

    },

    reflesh: function (nW, nH) {
        if (!this._oMap) {
            return;
        }
        var oContainer = this._oMap.getContainer();
        if (nW) {
            oContainer.style.width = nW + 'px';
        }
        if (nH) {
            oContainer.style.height = nH + 'px';
        }

        this._oMap._onResize();
    },

});

// 地图容器的扩展 给地图容器添加控件容器，不用地图自带的容器
L.MapLib.MapMaster.Map.include({

    cTopLeftConfig: {
        div: {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'}

    },

    cTopRightConfig: {
        div: {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'}

    },

    // 一种是自带的容器，一种是系统默认的容器
    initTopLeft: function (cHtml) {

        var oDiv = L.DomUtil.get(this.options.cDidId);
        if (!oDiv) {
            return;
        }

    },

    initTopRight: function () {

    },

});

/**
 * 编辑按钮操作
 *
 * Created by exsun003 on 2018/11/14.
 */

L.MapLib.MapEditControl = L.Evented.extend({

    //****
    options: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left','ex-maptool-edit'],
        cBtnContain: '.ex-map-tool-edit',
        className: '',
        title: '图层编辑',
        oPenStyle: {
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
        oPenLineStyle: {
            stroke: true,
            color: '#0FFF05',
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
    },

    // ****加载工具事件，初始化工具栏
    initUI: function () {

        this.oTool =  L.DomUtil.create('div','ex-maptool-box',this._oContainer);
        this.oUl=  L.DomUtil.create('ul','ec-avg-sm-1 ex-map-tool-edit',this.oTool);
        this.liPlus = L.DomUtil.create('li','',this.oUl);
        this.liPlus.innerHTML = '<i class="ec-icon-plus"></i>&nbsp;绘制';
        this.liPlus.href ='javascript:void(0);';

        this.liEdit = L.DomUtil.create('li','',this.oUl);
        this.liEdit.innerHTML = '<i class="ec-icon-pencil"></i>&nbsp;编&nbsp;&nbsp;辑';
        this.liEdit.href ='javascript:void(0);';

        this.liDel = L.DomUtil.create('li','',this.oUl);
        this.liDel.innerHTML = '<i class="ec-icon-power-off"></i>&nbsp;删&nbsp;&nbsp;除';
        this.liDel.href ='javascript:void(0);';

        this.liSave = L.DomUtil.create('li','',this.oUl);
        this.liSave.innerHTML = '<i class="ec-icon-save"></i>&nbsp;确&nbsp;&nbsp;定';
        this.liSave.href ='javascript:void(0);';

        this.liCal = L.DomUtil.create('li','ex-map-tool-cancel',this.oUl);
        this.liCal.innerHTML = '<i class="ec-icon-ban"></i>&nbsp;取&nbsp;&nbsp;消';
        this.liCal.href ='javascript:void(0);';

        this.initEven();


        this.liPlus.style.display = 'none';
        this.liEdit.style.display = 'none';
        this.liCal.style.display = 'none';
        this.liSave.style.display = 'none';
        this.liDel.style.display = 'none';

        this.dealEditUI();


    },

    // ****构造函数
    initialize: function (oParent, options) {
        L.extend(this, options);
        this.oPenStyle = this.options.oPenStyle;
        this.oPenLineStyle = this.options.oPenLineStyle;
        // 获得地图控件
        this._oMapBase = oParent.oMapMaster;
        this._oMap = oParent.oMapMaster._oMap;
        this._oParent = oParent;

        // 添加编辑图层
        this._oDrawLayer = L.featureGroup();
        this._oDrawLayer.addTo(this._oMap);
        this._oContainer = document.getElementsByClassName('ex-map-left')[0];

        this.cFlag = 'add';

        // 设置父级容器的事件，是为了屏蔽地图的操作
        this.setParentEvent();

        // 初始化画笔
        this.initPen();

        // 初始化界面
        this.initUI();

        // 加载地图回调函数
        this.initCallBack();

        this.initOn();

    },

    // ***注册监听事件
    initOn: function () {

        // 触发显示编辑按钮，并默认画
        this._oParent.on('ESMapEdit:showEditDraw', this.showEditAdd, this);
        this._oParent.on('ESMapEdit:clearLayers', this.clearLayers, this);

        // 删除围栏时要这的事情
        this._oParent.on('ESMapEdit:deleteFence', this.deleteFence, this);
        this._oParent.on('ESMapEdit:editDraw', this.editDraw, this);


        this._oParent.on('ESMap:removeMap', this.removeMap, this);


    },


    //移除地图图层
    removeMap:function(oData){

        if(this._oMap){
            this._oMap.remove()
        }

    },

    // ***编辑围栏数据,画围栏时要表明自己的名称
    editDraw: function (oData) {
        //画线加载时，加载图标
        this.cFlag = 'edit';
        // var aX = oData.MapX.split(',');
        // var aY = oData.MapY.split(',');
        // if (!aX || !aY || aX.length <= 0) {
        //     return;
        // }
        // var aoLatLng = oData.aoLatLng;
        var aoLatLng = [];
        // for (var i = 0; i < aX.length; i++) {
        //     var oLatLng = L.latLng(parseFloat(aY[i]), parseFloat(aX[i]));
        //     aoLatLng.push(oLatLng);
        // }
        var nData = oData.aoLatLng
        for (var i = 0; i < nData.length; i++) {
            var oLatLng = L.latLng(parseFloat(nData[i].lat), parseFloat(nData[i].lng));
            aoLatLng.push(oLatLng);
        }
        if(this._oParent.options.drawType == 'polyline'){
            var oVehLine = L.polyline(aoLatLng, this.oPenLineStyle).addTo(this._oDrawLayer);
        }else{
            var oVehLine = L.polygon(aoLatLng, this.oPenStyle).addTo(this._oDrawLayer);
        }

        oVehLine.cId = oData.Id;
        oVehLine.oFenceInfo = oData;

        oVehLine.bindTooltip(oData.Name).openTooltip();

        this.fitBound();

        // 点击编辑时 控制按钮显示，显示编辑，其他隐藏
        this.liPlus.style.display = 'none';
        this.liEdit.style.display = 'block';
        this.liCal.style.display = 'none';
        this.liSave.style.display = 'none';
        this.liDel.style.display = 'block';

        this.dealEditUI();
    },

    //****
    fitBound: function () {
        if (!this._oDrawLayer) return;
        var oBound = this._oDrawLayer.getBounds();
        this._oMap.fitBounds(oBound);
    },

    // ****画tip
    drawTip: function (oTemp) {
        var oOption = {
            bIsNotEdit: true,
            cName: '测试tip显示名称',
            oLatLng: {lat: 30.333, lng: 113.333},
            bNoHide: true
        };
        L.extend(oOption, oTemp);
        var oIcon = new L.DivIcon({
            html: '<div> </div>',
            className: '',
        });

        var oMarker = L.marker(oOption.oLatLng, {icon: oIcon, bIsNotEdit: oOption.bIsNotEdit});
        oMarker.cId = oOption.cId;

        //给oMarker绑定tip
        oMarker.bindLabel(oOption.cName, {noHide: oOption.bNoHide, direction: 'auto'});
        return oMarker;
    },

    //***
    deleteFence: function () {
        this._oDrawLayer.clearLayers();

        this.liCal.style.display = 'none';
        this.liEdit.style.display = 'none';

        this.dealEditUI();
    },

    //***
    clearLayers: function () {
        this._oDrawLayer.clearLayers();

        // 隐藏取消按钮
        this.liCal.style.display = 'none';
        this.dealEditUI();
    },

    //***
    showEditAdd: function () {
        this.cFlag = 'add';
        this.show();
        this.clearLayers();
        this.liPlus.click();
    },

    // 显示编辑框
    show: function () {
        this.oTool.style.display='block';
    },

    // 隐藏编辑框
    hide: function () {
        this.oTool.style.display='none';
    },

    // 界面处理
    dealEditUI: function () {
        var aoA =   this.oTool.getElementsByTagName('li');
        var bShow = false;
        for (var i = 0; i < aoA.length; i++) {
            if (L.DomUtil.getStyle(aoA[i], 'display') !==  'none') {
                bShow = true;
            }
        }
        if (!bShow) {
            this.hide();
        }
        else {
            this.show();
        }
    },

    _drawType: function(n) {
        var nType = null
        switch (n){
            case 'polygon':
                nType = {
                    enabled: {shapeOptions: this.oPenStyle},
                    handler: new L.Draw.Polygon(this._oMap, {shapeOptions: this.oPenStyle}),
                    title: L.drawLocal.draw.toolbar.buttons.polygon
                }
                break
            case 'polyline':
                nType = {
                    enabled: {shapeOptions: this.oPenLineStyle},
                    handler: new L.Draw.Polyline(this._oMap, {shapeOptions: this.oPenLineStyle}),
                    title: L.drawLocal.draw.toolbar.buttons.polyline
                }
                break
            case 'marker':
                nType = {
                    enabled: {shapeOptions: this.oPenStyle},
                    handler: new L.Draw.Marker(this._oMap, {shapeOptions: this.oPenStyle}),
                    title: L.drawLocal.draw.toolbar.buttons.marker
                }
                break
        }
        return nType
    },

    // 初始化画笔控件
    initPen: function () {
        // 画笔
        this.oDrawPen = this._drawType(this._oParent.options.drawType)

        // this.oDrawPen = {
        //     enabled: {shapeOptions: this.oPenStyle},
        //     handler: new L.Draw.Polygon(this._oMap, {shapeOptions: this.oPenStyle}),
        //     title: L.drawLocal.draw.toolbar.buttons.polygon
        // };

        // 画笔
        this.oEditPen = {
            enabled: this.oPenStyle,
            handler: new L.EditToolbar.Edit(this._oMap, {
                featureGroup: this._oDrawLayer,
                selectedPathOptions: {
                    dashArray: '10, 10',
                    fill: true,
                    fillColor: '#fe57a1',
                    fillOpacity: 0.1,
                    maintainColor: false
                },
                poly: {allowIntersection: false}
            }),
            title: L.drawLocal.edit.toolbar.buttons.edit
        };
    },

    // ****设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.on(this._oContainer, 'click', L.DomEvent.stopPropagation)
         .on(this._oContainer, 'dblclick', L.DomEvent.stopPropagation)
         .on(this._oContainer, 'mousemove', L.DomEvent.stopPropagation)
         .on(this._oContainer, 'mousewheel', L.DomEvent.stopPropagation)
         .on(this._oContainer, 'mousedown', L.DomEvent.stopPropagation)
         .on(this._oContainer, 'click', L.DomEvent.preventDefault);
    },


    // ***初始化工具栏事件
    initEven: function () {
        var self = this;

        L.DomEvent.on(this.liPlus, 'click', function () {
            self.oDrawPen.handler.enable();

            self.liPlus.style.display = 'none';
            self.liEdit.style.display = 'none';
            self.liCal.style.display = 'block';
            self.liSave.style.display = 'none';
            self.liDel.style.display = 'none';

            self.dealEditUI();

        }, this);


        L.DomEvent.on(this.liSave, 'click', function () {
            self.oEditPen.handler.save();
            self.oEditPen.handler.disable();

            self.liPlus.style.display = 'none';
            self.liEdit.style.display = 'none';
            self.liCal.style.display = 'none';
            // self.liSave.style.display = 'block';
            self.liDel.style.display = 'block';
            self.dealEditUI();

        }, this);


        L.DomEvent.on(this.liEdit, 'click', function () {

            // 点击编辑隐藏自身，和添加功能，显示确定和取消
            self.liPlus.style.display = 'none';
            self.liSave.style.display = 'block';
            self.liCal.style.display = 'block';
            self.liEdit.style.display = 'none';
            self.liDel.style.display = 'none';
            self.dealEditUI();

            self.oEditPen.handler.enable();
        }, this);

        L.DomEvent.on(this.liCal, 'click', function () {

            this.liCal.style.display = 'none';

            if (self.cFlag === 'add') {
                // 全部隐藏
                self.liPlus.style.display = 'block';
                self.liSave.style.display = 'none';
                self.liCal.style.display = 'none';
                self.liEdit.style.display = 'none';
                self.liDel.style.display = 'none';

                self.clearLayers();
            }

            if (self.cFlag === 'edit') {

                self.liPlus.style.display = 'none';
                self.liSave.style.display = 'none';
                self.liCal.style.display = 'none';
                self.liEdit.style.display = 'block';
                self.liDel.style.display = 'none';

            }

            self.oDrawPen.handler.disable();
            // 撤销修改
            self.oEditPen.handler.revertLayers();
            self.oEditPen.handler.disable();

            self.dealEditUI();


        }, this);

        L.DomEvent.on(this.liDel, 'click', function () {

            self.liDel.style.display = 'none';

            if (self.cFlag === 'add') {
                // 全部隐藏
                self.liPlus.style.display = 'none';
                self.liSave.style.display = 'none';
                self.liCal.style.display = 'none';
                self.liEdit.style.display = 'none';
                self.liDel.style.display = 'none';
            }

            if (self.cFlag === 'edit') {
                self.liPlus.style.display = 'block';
                self.liSave.style.display = 'none';
                self.liCal.style.display = 'none';
                self.liEdit.style.display = 'none';
                self.liDel.style.display = 'none';
            }
            self.deleteFence();
            self.dealEditUI();
        }, this);
    },

    //***
    initCallBack: function () {
        var self = this;

        this._oMap.on('draw:created', function (e) {

            var oLayer = e.layer;

            self._oDrawLayer.addLayer(oLayer);
            var oInfo = self._getGisObj(oLayer);
            self._oParent.fire('FenceView:UI.addFence', oInfo);
            //self.fire('FenceView:UI.addFence', oInfo);
        });

        this._oMap.on('draw:edited', function (e) {

            var aoLayer = e.layers;
            aoLayer.eachLayer(function (oLayer) {
                var oInfo = self._getGisObj(oLayer);
                self._oDrawLayer.addLayer(oLayer);
                oInfo.cId = oLayer.cId;
                oInfo.oFenceInfo = oLayer.oFenceInfo;

                self._oParent.fire('FenceView:UI.updateFence', oInfo);
                //self.fire('FenceView:UI.updateFence', oInfo);
            });
        });
    },

    // ***获得所有画的model
    getDrawModeHandlers: function () {

        return [
            {
                enabled: this.options.polyline,
                handler: new L.Draw.Polyline(this._oMap, this.options.polyline),
                title: L.drawLocal.draw.toolbar.buttons.polyline
            },
            {
                enabled: {shapeOptions: this.oPenStyle},
                handler: new L.Draw.Polygon(this._oMap, {shapeOptions: this.oPenStyle}),
                title: L.drawLocal.draw.toolbar.buttons.polygon
            },
            {
                enabled: this.options.rectangle,
                handler: new L.Draw.Rectangle(this._oMap, this.options.rectangle),
                title: L.drawLocal.draw.toolbar.buttons.rectangle
            },
            {
                enabled: this.options.circle,
                handler: new L.Draw.Circle(this._oMap, this.options.circle),
                title: L.drawLocal.draw.toolbar.buttons.circle
            },
            {
                enabled: this.options.marker,
                handler: new L.Draw.Marker(this._oMap, this.options.marker),
                title: L.drawLocal.draw.toolbar.buttons.marker
            }
        ];
    },

    // ***获得所有的编辑model
    getEditModeHandlers: function () {

        return [
            {
                enabled: this.oPenStyle,
                handler: new L.EditToolbar.Edit(this._oMap, {
                    featureGroup: this._oDrawLayer,
                    selectedPathOptions: this.options.edit.selectedPathOptions,
                    poly: this.options.poly
                }),
                title: L.drawLocal.edit.toolbar.buttons.edit
            },
            {
                enabled: {},
                handler: new L.EditToolbar.Delete(this._oMap, {
                    featureGroup: this._oDrawLayer
                }),
                title: L.drawLocal.edit.toolbar.buttons.remove
            }
        ];
    },

    // ***获得编辑对象
    _getGisObj: function (oLayer) {
        var oInfo = {};
        var oOption = oLayer.options;

        if (oLayer instanceof L.Circle) {
            //还要取一个经纬度
            var oLatLng = oLayer.getLatLng();
            var oLatLngTemp = L.latLng([oLatLng.lat + oLayer._getLatRadius(), oLatLng.lng]);
            oInfo = {
                aoLatLng: [oLatLng, oLatLngTemp],
                dRadius: oLayer.getRadius(),
                oOption: oOption,
                nType: this.getObjType(oLayer),
                centerPoint: oLayer.getCenter()
            };
        }
        else {
            oInfo = {aoLatLng: oLayer.getLatLngs(), oOption: oOption, nType: this.getObjType(oLayer), centerPoint: oLayer.getCenter()};
        }

        return oInfo;
    },

    // ***
    getObjType: function (oLayer) {
        if (oLayer instanceof L.Rectangle) {
            return 3;
        }
        if (oLayer instanceof L.Polygon) {
            return 1;
        }
        if (oLayer instanceof L.Polyline) {
            return 4;
        }
        if (oLayer instanceof L.Circle) {
            return 2;
        }
        return 1;
    },

    // 添加数据
    addFence: function () {
        this.liPlus.style.display = 'block';
        this.liEdit.style.display = 'none';
        this.liCal.style.display = 'none';
        this.liSave.style.display = 'none';

        this.dealEditUI();
    },
})


/**
 * 基础地图控件
 * Created by exsun003 on 2018/11/14.
 */

L.MapLib.MapMaster.PopMap =L.Evented.extend({

    options: {
        parentContainer: null,
        mapId : null
    },


    initialize: function (oParent, options) {
        L.setOptions(this, options);
        this._oParent = oParent;
        if (!options.parentContainer) {
            return;
        }
        // 初始化界面
        this.initUI();
        options.parentContainer.appendChild(this.mapPanel);
    },

    initUI: function () {
        this.mapPanel = L.DomUtil.create('div', 'ex-layout-map-content');
        this.mapPanel.id =this.options.mapId;
        this.topLeftPanel = L.DomUtil.create('div', 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left',this.mapPanel);
        this.topRightPanel = L.DomUtil.create('div', 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right',this.mapPanel);
        this.bottomLeftPanel = L.DomUtil.create('div', 'ex-layout-maptool ex-map-bottom ex-map-left',this.mapPanel);
        this.bottomRightPanel = L.DomUtil.create('div', 'ex-layout-maptool ex-theme-maptool ex-map-bottom ex-map-right',this.mapPanel);
    },

    loadMap: function (nMapWidth,nMapHeight) {
        this.oMapMaster = new L.MapLib.MapMaster.Map(this._oParent, {
            cDidId: this.options.mapId,
            oMapOption: {
                zoomControl: false,
                layers: [],
                // center: new L.LatLng(30.2215, 114.2588),
                center: new L.LatLng(31.17547255, 115.00334782), // 麻城中心点
                zoom: 12
            }
        });
        // this.searchPoiPanel = new L.MapLib.ESMapSearch(this._oParent, {})
        this.oMapMaster.nMapWidth = nMapWidth;
        this.oMapMaster.nMapHeight = nMapHeight;
        this.oMapMaster.loadMapMaster();

        return this.oMapMaster;
    },

    resize: function (nW,nH) {
        this.$_oContainer.width(nW);
        this.$_oContainer.height(nH);
        this.oMapMaster.reflesh(nW,nH);
    },

    // 加载工具栏
    loadMapToolArea: function () {
        // 编辑工具
        this.oToolEdit = new L.MapLib.MapEditControl(this,
            {
                acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-right', 'ex-maptool-edit'],

            });
    },

});

}() 
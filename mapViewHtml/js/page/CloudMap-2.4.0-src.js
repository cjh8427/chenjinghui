

/*
CloudMap-2.4.0 code for exsun

Copyright©2015-2018 武汉依迅北斗空间技术有限公司 All Rights Reserved.

http://www.exsun.cn
*/

(function (window, document, L, $) {/**
 * 云图的设计
 *
 * Created by exsun on 2017-01-09.
 */

ES.CloudMap = {
    //version: '{version}',
    version: '1.0.1'
};



// 存储页面公共的模块,保存页面当前编辑的模式
ES.CloudMap.Page = ES.Page.extend({

    //页面id
    initialize: function (id, oOption) {

        ES.Page.prototype.initialize.call(this, id, oOption);

        this.cFlag = 'Grid';
    },

    setFlag: function (cVal) {
        this.cFlag = cVal;
    },

    getFlag: function () {
        return this.cFlag;
    },

    getPosByLatLng: function (oLatLng) {
        if (!this._oMap || !oLatLng) {
            return null;

        }

        var oPos = this._oMap.latLngToLayerPoint(oLatLng);

        return oPos
    }

});


// 补丁
L.extend(L.Edit.PolyVerticesEdit, {

    _createMarker: function (latlng, index) {
        // Extending L.Marker in TouchEvents.js to include touch.
        var bDrag = true;
        if (latlng.alt) {
            bDrag = false;
        }
        var marker = new L.Marker.Touch(latlng, {
            draggable: bDrag,
            icon: this.options.icon,
        });

        marker._origLatLng = latlng;
        marker._index = index;

        if (bDrag) {
            marker
                .on('dragstart', this._onMarkerDragStart, this)
                .on('drag', this._onMarkerDrag, this)
                .on('dragend', this._fireEdit, this)
                .on('touchmove', this._onTouchMove, this)
                .on('touchend', this._fireEdit, this)
                .on('MSPointerMove', this._onTouchMove, this)
                .on('MSPointerUp', this._fireEdit, this);
        }


        this._markerGroup.addLayer(marker);

        return marker;
    },
});

/**
 * 整体页面布局
 *
 * Created by liulin on 2017/2/22.
 */



ES.CloudMap.LayoutContent = ES.Evented.extend({

    cHTML:'<div class="ex-layout-content"></div>',
    oOption: {
        cPContainer: '.ex-layout-main',

    },

    initialize: function (oParent, oOption) {
        ES.setOptions(this, oOption);
        this._oParent = oParent;

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

    reflesh: function (nWidth,nHeight) {
        this.$_oContainer.css({width: nWidth, height: nHeight});
    },

    initUI: function () {
        //ES.initTag($(this.oOption.cContainerSel),this.oUIConfig);
        //this.$_oContainer=  $(this.oOption.cContainerSel).find('.ex-layout-content');
        this.$_oContainer = $(this.cHTML);
        $(this.oOption.cPContainer).append(this.$_oContainer);
        this.$_oContainer.css({width:this.oOption.nWidth,height:this.oOption.nHeight});
    },

});




/**
 * Created by liulin on 2017/3/17.
 */

ES.CloudMap.BaseTool = ES.Evented.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>删除</p></li>',

    // 构造函数
    initialize: function (oParent, options) {

        ES.setOptions(this, options);

        this._oParent = oParent;
        this._oPage = oParent._oParent;

        this._oMap = this._oPage.getMap();

        this.initUI();

        this.initOn();
    },

    initUI: function () {
        this.$_oLi = $(this.cHtml);
        //this.bandClick();
        this.setParentEvent();
    },
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this.$_oLi.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oLi.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oLi.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oLi.get(0), 'mousewheel', L.DomEvent.stopPropagation);

        L.DomEvent.addListener(this.$_oLi.get(0), 'touchmove', L.DomEvent.stopPropagation);

    },

    removeActive: function () {
        this.$_oLi.find('button').removeClass('ec-active');
    },

    addActive: function () {
        this.$_oLi.find('button').addClass('ec-active');
    },

    getActive: function () {
        if (this.$_oLi.find('button').hasClass('ec-active')) {
            return true;
        }
        return false;
    },

    initOn: function () {
        this._oParent.on('CloudMap:BaseTool.removeActive',this.removeActive,this);
        this._oParent.on('CloudMap:BaseTool.setActive',this.addActive,this);
    },

    // 绑定事件
    bandClick: function () {
        var self = this;
        this.$_oLi.find('button').bind('click', function () {
            self._oParent.fire('CloudMap:BaseTool.removeActive');
            self.addActive();
        });
    },
});

/**
 * Created by liulin on 2017/3/17.
 */

ES.CloudMap.CalEditTool = ES.CloudMap.BaseTool.extend({

    cHtml:
        '<li>' +
        '   <button class="ec-btn ec-btn-secondary ec-radius" >' +
        '       <i class="ec-icon-dot-circle-o"></i>' +
        '   </button>' +
        '   <p>取消</p>' +
        '</li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);

    },

    initUI: function () {
        this.$_oLi = $(this.cHtml);
    },

    // 绑定事件
    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self._oParent.fire('CloudMap:BaseTool.removeActive');
            self._oParent.fire('CloudMap:EditTool.calEdit');
            // 显示新增按钮
            self._oParent.addDrawToUI();
            self._oParent.clearLayers();
        });
    },




});


/**
 * Created by liulin on 2017/3/17.
 */


ES.CloudMap.EditTool = ES.CloudMap.BaseTool.extend({

    cHtml:
    '<li>' +
    '   <button class="ec-btn ec-btn-secondary ec-radius" >' +
    '       <i class="ec-icon-dot-circle-o"></i>' +
    '   </button>' +
    '   <p>编辑</p>' +
    '</li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);
        this._oDrawLayer =oParent.getDrawLayer();
        this.oPen = null;

        this.initPen();

    },


    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this);
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPen.handler.enable();
            self._oParent.addSaveACalToUI();

        });
    },

    //  画点
    initPen: function () {
        this.oPen = {
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
            title: ''
        }
    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

        this._oParent.on('CloudMap:EditTool.calEdit',this.calEdit,this);
        this._oParent.on('CloudMap:EditTool.edit',this.edit,this);
        this._oParent.on('CloudMap:EditTool.SaveEdit',this.saveEdit,this);

        var self =this;
        this._oMap.on('draw:edited', function (e) {
            if(!self._oParent.getActive()){
                return
            }
            var oMap = this;
            var aoLayer = e.layers;

            aoLayer.eachLayer(function (oLayer) {

                var oLatLng = oLayer.getLatLng();

                var oInfo = {
                    aoLatLng: [{lat: oLatLng.lat, lng: oLatLng.lng}],
                    oOption: {},
                };

                self._oDrawLayer.addLayer(oLayer);

                // 弹出层显示的位置信息
                var oPos = oMap.latLngToLayerPoint(oLatLng);

                // 告诉外面弹出层的位置
                self._oParent.fire('CloudMap:PopWnd.editShow', {
                    oInfo: oInfo,
                    oPos: oPos,
                    oBusData:oLayer.oBusData
                });
            });
        });
    },

    // 保存编辑
    saveEdit: function () {
        this.oPen.handler.save();
        this.oPen.handler.disable();

    },

    // 取消编辑
    calEdit: function () {
        this.oPen.handler.revertLayers();
        this.oPen.handler.disable();
    },

    // 编辑数据oData:oNode.node.data,
    edit: function (oVal) {

        this._oParent.clearLayers();

        if (!oVal  || !oVal.oNode) {
            return ;
        }

        // 编辑围栏数据,画围栏时要表明自己的名称
        var oVehLine = L.marker(oVal.oNode.data,{});
        oVehLine.edited = true;
        this._oMap.flyTo(oVal.oNode.data);

        var oData = {
            oLatLng: oVal.oNode.data,
            cId: oVal.oNode.id,
            cName: oVal.oNode.text,
            cParentId:oVal.oNode.parent,
            cParentText :oVal.oNode.parentText,
        }
        oVehLine.cId = oVal.oNode.id;
        oVehLine.oBusData = oData;
        oVehLine.addTo(this._oDrawLayer);

        this._oParent.addEditToUI();
    },


});


/**
 * Created by liulin on 2017/3/17.
 */

ES.CloudMap.SaveTool = ES.CloudMap.BaseTool.extend({

    cHtml:
        '<li>' +
        '   <button class="ec-btn ec-btn-secondary ec-radius" >' +
        '       <i class="ec-icon-dot-circle-o"></i>' +
        '   </button>' +
        '   <p>确定</p>' +
        '</li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);
    },

    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
             self._oParent.fire('CloudMap:EditTool.SaveEdit');
        });
    },

});

/**
 * Created by liulin on 2017/3/17.
 */
// 添加菜单容器工具为空
ES.CloudMap.MenuTool = ES.Evented.extend({

    cHtml:
    '<div class="ex-maptool-box ex-maptool-box-white">' +
    '   <ul class="ex-map-tab ec-text-center ex-maptool-tab ex-cloud-map-menu">' +
    '   </ul>' +
    '</div>' +
    '<div class="ex-maptool-box  ex-maptool-tab-draw">' +
    '    <ul class="ex-map-tab ec-text-center ex-maptool-tab ex-cloud-map-tool">' +
    '   </ul>' +
    '</div>',

    oOption: {
        // 父级容器
        //cParentDiv: 'MapView',
        acParentDivClass: ["ex-layout-maptool", "ex-theme-maptool", "ex-map-top", "ex-map-left"],

    },


    // 构造函数
    initialize: function (oMapBase, options) {
        ES.setOptions(this, options);
        this.$_oContainer = $(this.cHtml);

        this.$_oPContainer = $("." + this.oOption.acParentDivClass.join("."));


        this.$_oPContainer.eq(0).append(this.$_oContainer);

        this.aoCtrl = [];

        this.setParentEvent();
    },

    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

        L.DomEvent.addListener(this.$_oContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);


    },

    //提供添加菜单功能
    appendMenu: function (oCtrl) {
        var $_oLi = oCtrl.getMenu();
        if(!$_oLi) {
            return;
        }
        oCtrl.setPContainer(this);

        this.$_oContainer.find('ul.ex-cloud-map-menu').append($_oLi);

        this.aoCtrl.push(oCtrl);

    },

    clearTool: function () {
        this.$_oContainer.find('ul.ex-cloud-map-tool').empty();
    },

    showTool: function () {
        this.$_oPContainer.find('.ex-maptool-tab-draw').fadeIn();
    },

    // 操作
    appendTool: function (oCtrl) {
        //this.$_oContainer.find('ul.ex-cloud-map-tool').empty();
        this.$_oContainer.find('ul.ex-cloud-map-tool').append(oCtrl.$_oLi);
    },



});

/** * Created by Administrator on 2017/8/4. */ES.CloudMap.BaseWnd = ES.Evented.extend({});

/**
 * Created by liulin on 2017/3/22.
 *
 */

// 基础菜单
ES.CloudMap.BaseMenu = ES.Evented.extend({

    oOption: {
        nTreePanelHeight: 300,
        nTreePanelWidth: 280,
        oTreePanelUrl: {},
        oTreePopUrl:{},
    },

    cHtml:
    '<li>' +
    '   <button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1">' +
    '       <i class="ec-icon-th-large"></i>' +
    '   </button>' +
    '   <p>邮路</p>' +
    '</li>',

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        ES.setOptions(this, oOption);

        this._oMap = oParent.getMap();
        this._oDrawLayer = L.featureGroup();
        this._oDrawLayer.addTo(this._oMap);

        this.aoDrawTool = [];
        this.aoEditTool=[];
        this.aoSaveACalTool= [];
        this.aoPopWnd = [];


        // 存在统一的编辑、删除
        this.oEditTool = null;
        this.oDelTool = null;

        this.$_oLi = null;

        this.initOn();
        this.initUI();

    },

    getDrawLayer:function() {
        return this._oDrawLayer;
    },

    getLayer: function () {
       return this._oDrawLayer.getLayers();
    },


    initOn: function () {
        this._oParent.on('CloudMap:BaseMenu.addActive',this.addActive,this);
        this._oParent.on('CloudMap:BaseMenu.removeActive',this.removeActive,this);
        this._oParent.on('CloudMap:BaseMenu.hidePenal',this.hidePenal,this);


        this._oParent.on('CloudMap:BaseMenu.endMenu',this.endMenu,this);
    },

    initUI:function(){

        this.$_oLi = $(this.cHtml);

        var self = this;

        this.$_oLi.find('button').bind('click', function () {
            if (self.oPenal) {

                self._oParent.fire('CloudMap:BaseMenu.hidePenal');
                self.oPenal.show();

                self._oParent.fire('CloudMap:BaseMenu.removeActive');
                self.addActive();

                // 显示工具面板
                self.oPContainer.showTool();

                // 添加画图按钮
                self.addDrawToUI();
                // 结束各个Tool的工作状态
                self._oParent.fire('CloudMap:BaseMenu.endMenu');

            }

        });

    },

    defaultClick: function () {
        this.$_oLi.find('button').click();
    },

    hidePenal: function () {

    },

    clearLayers: function () {
        this._oDrawLayer.clearLayers();
    },

    addLayer: function (oLayer) {
        oLayer.addTo( this._oDrawLayer);
    },

    getMenu: function () {
        return this.$_oLi;
    },

    addActive: function () {
        this.$_oLi.find('button').addClass('ec-active');
    },

    removeActive: function () {
        this.$_oLi.find('button').removeClass('ec-active');
    },

    getActive: function () {
        if (this.$_oLi.find('button').hasClass('ec-active')) {
            return true;
        }
        return false;
    },


    // 设置父级对象
    setPContainer: function (oPContainer) {
        this.oPContainer = oPContainer;
    },

    endMenu: function () {

    },

});

/**
 * Created by liulin on 2017/4/24.
 */


ES.CloudMap.BaseTreePanel = ES.Evented.extend({

    oOption: {
        // 树的ur
        cUrl: '',
        // 外层容器
        cDivContainer: '.tree-layout-map',

        cCheckUrl: '',
        // 树节点容器
        cTreeContainerSel: '.ex-layout-struckbox-content',
        // 查询框容器
        cSearchInputSel: '.ex-tree-search-ipt',
        // 查询btn容器
        cSearchBtnSel: '.ex-tree-search-btn',
        // 监听事件，对外接口
        cEventName: 'cPermission',

        cTitle:'组织架构',
        nHeight:350,
        nWidth:280,
    },


    oTreeOption: {
        // 树的url
        //cTreeUrl: '',
        // 树所用的插件
        //acPlugin: ['checkbox', 'types', 'search', 'state', 'unique'],
        // 树的check数据来源
    },

    initialize: function (oParent, oOption, oTOption) {
        //this.initContain(oOption);
        this._oParent = oParent;

        this.oTOption = {};
        ES.setOptions(this,oOption);
        ES.extend(this.oTOption, this.oTreeOption, oTOption);

        if (typeof this.oOption.cDivContainer === 'object') {
            this.$_oPContainer = this.oOption.cDivContainer;
        }
        else {
            this.$_oPContainer = $(this.oOption.cDivContainer);
        }

        this.initOn();

        this.$_oContainer = null;
        this.oPopTree = null;
        this.oTreeContainer = null;
        this.oSearchInput = null;
        this.oSearvhBtn = null;
        // 缓存上次树选择的节点数据
        this._oSelData = null;
    },

    // 给树的上级容器做id
    initContain: function (oOption) {
        // 设置container 容器的id
        oOption.content = ES.template(oOption.content, oOption);
    },

    initOn: function () {
        this._oParent.on('PostPosTreeView.reflesh',this.reflesh,this);
    },

    reflesh: function () {
        if (!this.oPopTree) {
            return;
        }
        //this.oPopTree.$_oTree.settings.core.data.url = ES.template(this.oTOption.cTreeUrl, this.oBusData);
        this.oPopTree.$_oTree.refresh();
    },

    initButton: function () {

        var self = this;

        var aoButton = [
            {
                value: ES.Lang.Boss[1],
                callback: function () {
                    self.ok();
                    return false;
                },
                autofocus: true
            }
        ];

        this.oOption.button = aoButton;
    },

    initUI: function () {
        var oTemp = $(ES.template(this.cHtml, {cTitle: this.oOption.cTitle})).addClass(this.oOption.cFlag);

        this.$_oPContainer.append(oTemp);
        oTemp.find('div.ex-layout-sider').width(this.oOption.nWidth);
        this.$_oContainer = oTemp;
        this.oTreeContainer = this.$_oContainer.find(this.oOption.cTreeContainerSel);

        this.oTreeContainer.css({'margin-bottom':10,height:this.oOption.nHeight});

        this.oSearchInput = this.$_oContainer.find(this.oOption.cSearchInputSel);
        this.oSearvhBtn = this.$_oContainer.find(this.oOption.cSearchBtnSel);
        this.initSearchEvent();
        this.initTree();

        this.setParentEvent();

    },

    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

        L.DomEvent.addListener(this.$_oContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);

    },


    show: function (oData) {
        if (this.$_oContainer) {
            this.$_oContainer.show();
        }
        else {

            this.initUI();
            this.$_oContainer.show();
        }

    },

    hide: function (oData) {
        if(!this.$_oContainer) {
            return;
        }
        this.$_oContainer.hide();
    },

    // 根据id重新初始化树
    clearTree: function () {
        this.oPopTree.uncheckAll();
        // 加载选择节点
        if (this.oTOption.cCheckUrl) {
            ES.getData({nRoleId: this.oBusData.RoleId}, this.oTOption.cCheckUrl, this.initCheck, this);
        }
    },

    initCheck: function (anPerm) {
        if (!anPerm || anPerm.length <= 0) {
            return;
        }
        this.oPopTree.uncheckAll();
        this.oPopTree.setCheckNode(anPerm);

    },

});

// 注册查询事件 高度控制由外层来完成
ES.CloudMap.BaseTreePanel.include({

    cHtml:
    '<div class="ex-maptool-box ex-maptool-box-white ex-maptool-property ec-padding-0">' +
    '   <div class="ex-layout-sider ex-theme-tree ec-fl"  >' +
    '       <h3 class="ex-theme-sider-title">' +
    '           <i class="ec-icon-sitemap"></i>&nbsp;{cTitle}' +

    '       </h3>' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group">' +
    '               <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字"> </input>' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    '               </span>' +
    '           </div>' +
    '       </div>' +
    '       <div class="ex-layout-struckbox-content" ></div>' +
    '   </div>' +
    '</div>',

    initSearchEvent: function () {
        var self = this;
        // 注册查询事件
        this.oSearvhBtn.bind('click', function () {
            if (!self.oPopTree) {
                return;
            }
            var cSearchVal = self.oSearchInput.val();
            // 触发查询
            self.oPopTree.oTree.jstree(true).search(cSearchVal);

        });

        // 注册键盘事件,防止查询刷屏
        var bTo = false;
        this.oSearchInput.keyup(function () {
            if (bTo) {
                clearTimeout(bTo);
            }
            bTo = setTimeout(function () {
                var cSearchVal = self.oSearchInput.val();
                self.oPopTree.oTree.jstree(true).search(cSearchVal,false,true);
            }, 250);
        });
    },

    // 初始化树
    initTree: function () {
        var self = this;
        if (!this.oPopTree) {
            this.oPopTree = new ES.Common.JsTree(this._oParent,
                {cPContainer: this.oTreeContainer},
                this.oTOption);
            this.oPopTree.readyCallBack = function () {
                //self.drawNode();
            };
            this.oPopTree.refreshCallBack = function () {
                //self.drawNode();
            };
            this.oPopTree.selectCallBack = function (e, oNode) {
                self.selectDeal(oNode);
            }
        }
    },

    selectDeal: function (oNode) {
        if (!oNode || !oNode.node) {
            return;
        }

        // 如果是部门 就显示部门信息
        if(oNode.node.id ==='0' || oNode.node.id.indexOf('d_')===0) {

            // 请求后台 画所有的线路
            ES.Util.reqData({data: {deptId: oNode.node.id}, url: '/Line/GetLineInfo'}, function (oData) {

                this._oParent.fire('MapView:ShowLayer.DrawLayers', {aoData: oData.rtnData});

            }, this);

            return;
        }

        var oTemp = this.oPopTree.$_oTree.get_node(oNode.node.parent);
        oNode.node.parentText = oTemp.text;
        this._oParent.fire('CloudMap:EditTool.edit', {oNode: oNode.node});

    },

    getChildNode: function (oNode) {

        if (!oNode) {
            return;
        }

        var aoNode = [];

        if (!oNode.children_d || oNode.children_d.length <= 0) {
            return
        }
        for (var i = 0; i < oNode.children_d.length; i++) {
            var oTemp = this.oPopTree.$_oTree.get_node(oNode.children_d[i]);

            if (!oTemp.data) {
                continue;
            }
            aoNode.push(oTemp.data);
        }
        return aoNode;
    },
});


/**
 * Created by liulin on 2017/6/1.
 */

// 菜单项 站点,一个菜单管理面板、操作、弹出层
ES.CloudMap.LineMenu = ES.CloudMap.BaseMenu.extend({

    cHtml:'<li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1"><i class="ec-icon-th-large"></i></button><p> 线 路 </p></li>',

    initialize: function (oParent, oOption) {

        ES.CloudMap.BaseMenu.prototype.initialize.call(this, oParent, oOption);

        this.initPenal();
        this.initEditTool();
        this.initDrawTool();
        this.initPopWnd();
        this.initSaveACalTool();

        this.oLineLayer = new ES.CloudMap.LineLayer(this, {});

        this.oCtrlLayer = new ES.CloudMap.MarkerLayer(this, {});

        this.oCityCtrlLayer = new ES.CloudMap.MarkerLayer(this, {
            onEventDrawLayers: 'ES:CloudMap.DrawCityCtrlLayer',
            onEventClearLayers: 'ES:CloudMap.ClearCityCtrlLayer',
            onEventRemoveLayers: 'ES:CloudMap.RemoveCityCtrlLayer',
            cIcon:'/Asset/img/ex_default/i_cityop_big_icon.png',});
    },

    initOn: function () {
        ES.CloudMap.BaseMenu.prototype.initOn.call(this);

        var self = this;

        this._oMap.on('moveend', function (e) {
            if (!self.getActive()) {
                return;
            }
            var aoLayer = self._oDrawLayer.getLayers();
            if (!aoLayer || aoLayer.length <= 0) {
                return;
            }
            var oPos = this.latLngToLayerPoint(aoLayer[0].getLatLngs()[0]);

            self.fire('CloudMap:PopWnd.setPos', {oPos: oPos});
        });
    },


    endMenu: function () {
        if (this.oEditTool) {
            this.oEditTool.calEdit();
        }
        if (this.oDrawTool) {
            this.oDrawTool.calDraw();
        }

        this.clearLayers();
    }
});


// 管理面板
ES.CloudMap.LineMenu.include({

    // 树面板
    initPenal: function () {

        this.oPenal = new ES.CloudMap.LineTreePanel(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': function (obj, callback) {
                    var self = this;
                    var oReqParam = {
                        type: 'POST',
                        'url': m_Url + '/base/tree',
                        headers: {
                            token: m_oParam.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        },
                        dataType: 'json',
                        data: '{"tree":"cloudMapRegionTree"}',
                        success: function (oData) {
                            callback.call(self, oData.detail);
                        },
                        error: function () {
                            callback.call(self, null);
                        },
                    }
                    $.ajax(oReqParam);

                }

            },
            plugins: ['types', 'search', 'unique']
        });
    },

    hidePenal: function () {
        this.oPenal.hide();
    },
});


// 对图形进行编辑
ES.CloudMap.LineMenu.include({

    // 树面板
    initEditTool:function(){

        this.oEditTool = new ES.CloudMap.EditLineTool(this,{oDrawLayer: this._oDrawLayer});
        this.oDelTool = new ES.CloudMap.DeleteTool(this,{});
        // 编辑
        this.aoEditTool.push(this.oEditTool);
        // 取消编辑
        this.aoEditTool.push(this.oDelTool);
    },

    // 添加到UI
    addEditToUI:function() {
        if (!this.oPContainer || this.aoEditTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoEditTool.length; i++) {
            this.oPContainer.appendTool(this.aoEditTool[i]);
            this.aoEditTool[i].bandClick();
        }
    },
});

// 对图形进行绘制
ES.CloudMap.LineMenu.include({

    // 树面板
    initDrawTool:function() {
        this.oDrawTool = new ES.CloudMap.DrawLineTool(this, {})
        this.aoDrawTool.push(this.oDrawTool);
    },

    // 添加到UI
    addDrawToUI:function() {
        if (!this.oPContainer || this.aoDrawTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();

        for (var i = 0; i < this.aoDrawTool.length; i++) {
            this.oPContainer.appendTool(this.aoDrawTool[i]);
            this.aoDrawTool[i].bandClick();
        }
    },
});

// 对图形进行保存和取消
ES.CloudMap.LineMenu.include({

    // 树面板
    initSaveACalTool:function(){
        this.oSaveTool = new ES.CloudMap.SaveTool(this,{oDrawLayer: this._oDrawLayer});
        this.oCalTool =  new ES.CloudMap.CalEditTool(this,{});

        this.aoSaveACalTool.push( this.oSaveTool );
        this.aoSaveACalTool.push( this.oCalTool );
    },

    // 添加到UI
    addSaveACalToUI:function() {

        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoSaveACalTool.length; i++) {
            this.oPContainer.appendTool(this.aoSaveACalTool[i]);
            this.aoSaveACalTool[i].bandClick();
        }
    },
});

// 弹出层的基本操作
ES.CloudMap.LineMenu.include({

    // 树面板 新增 弹出层
    initPopWnd:function() {

        this.oEditWnd = new ES.CloudMap.LineWnd(this, {
            oOffset: {nW: 10, nH: 80},
            cContainerSel: this._oParent.getMap()._mapPane
        });

        this.oDelWnd = new ES.CloudMap.DelWnd(this, { cUrl: '/CloudMap/Delete',}, {
            title: '删除操作-线路',
            cancelValue: '取消',
            content: '是否要删除数据！',

        });
        //this.oDelWnd.initOn();

        this.aoPopWnd.push(this.oEditWnd);
        this.aoPopWnd.push(this.oDelWnd);
    },

});

/**
 * Created by liulin on 2017/6/1.
 */
ES.CloudMap.PopWnd = ES.Evented.extend({

});

ES.CloudMap.LineWnd = ES.CloudMap.PopWnd.extend({

    oOption: {
        cContainerSel: '#MapView',
        cFlag: 'Grid',
        oText: {},
        oOffset: {nW: 0, nH: 30}
    },

    initialize: function (oParent, oOption) {
        this._oParent = oParent;

        ES.setOptions(this, oOption);

        this.cFlag = 'PostPos';

        // 窗体在地图上弹出的位置信息
        this.oPopLatLng = null;

        this.initUI();
        this.initOn();

        this.setParentEvent();

    },

    initUI: function () {
        this.$_oContainer = $(this.cContent);
        $(this.oOption.cContainerSel).append(this.$_oContainer);
        this.$_oContainer.hide();
        this.afterOpen();
    },

    afterOpen: function () {
        var self = this;
        this.$_oContainer.find('.ec-icon-save').parent().bind('click', function () {
            self.save();
        });

        //type="button"
        this.$_oContainer.find('a[type="button"]').bind('click', function () {
            self.$_oContainer.hide();
            self._oParent.clearLayers();
        });


        // 分类树
        if (!this.oSelectTree) {
            this.oSelectTree = new ES.Common.SelectTreeNode(this, {
                    cBandSel: $('#DeptName')
                },
                {
                    core: {
                        'animation': 0,
                        'check_callback': true,

                        'state': {'opened': true},
                        'data': function (obj, callback) {
                            var self = this;
                            var oReqParam = {
                                type: 'POST',
                                'url': m_Url + '/base/tree',
                                headers: {
                                    token: m_oParam.token,
                                    "Content-Type": 'application/json; charset=utf-8'
                                },
                                dataType: 'json',
                                data: '{"tree":"cloudMapRegionTree"}',
                                success: function (oData) {
                                    callback.call(self, oData.detail);
                                },
                                error: function () {
                                    callback.call(self, null);
                                },
                            }
                            $.ajax(oReqParam);
                        }

                    },
                    plugins: ['types', 'search', 'unique']
                });
        }
        this.oSelectTree.on('selectVal',  this.setVal,this);


    },

    setVal: function (oData) {

        if (oData.data.type != 1) {
            $('#DeptName').val(oData.text);
            this.cParentId = oData.id;
            $('.ex-cover-tree-select').hide().siblings('div').hide();
        }
    },

    setParentEvent: function () {
        //屏蔽事件
        L.DomEvent.addListener( this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
    },

    check: function () {

        if (!$('#GridName').val()) {
            ES.aWarn('请录入名称！');
            return false;
        }

        return true;
    },

    save: function () {
        if (!this.check()) {
            return;
        }

        ES.loadAn(this.$_oContainer);
        this.oBusData.oInfo.nType = 4;
        var oId = 0;
        if(this.oBusData.Id){
            //oId = '_' + -this.oBusData.Id;
            oId = -this.oBusData.Id;
        };

        var xyArr = this.oBusData.oInfo.aoLatLng;
        var xArr = [], yArr = [];
        for (var i = 0; i < xyArr.length; i++) {
            xArr.push(xyArr[i].lng.toFixed(6));
            yArr.push(xyArr[i].lat.toFixed(6));
        }
        var nxyArr = [];
        for (var i = 0; i < xArr.length; i++) {
            nxyArr.push(xArr[i] + "," + yArr[i]);
        }
        var self = this;
        ES.getData({ xy: nxyArr },m_transAddressUrl, function (gArr) {
            $('.ex-layout-loading').remove();
            if (!gArr.mapx) { //转换失败
                ES.aErr("位置信息获取失败");
            }else{
                var oParam = {
                    Id: oId,
                    CloudName: $('#GridName').val(),
                    DeptId:self.cParentId,
                    CloudType: 7,
                    Map: self.oBusData.oInfo,
                    Source: 1,
                    MapType: 4,
                    MapX:gArr.mapx,
                    MapY:gArr.mapy,
                    GpsX:gArr.gpsx,
                    GpsY:gArr.gpsy,
                    Address:gArr.poi,
                };

                ES.getData(oParam, m_postUrl, self.saveHandler, self, {nId: oParam.Id,Map:oParam.Map,CloudName:oParam.CloudName}, {},
                    {
                        headers: {
                            token: m_oParam.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        }
                    });
            }
        });
    },
    saveHandler: function (oTemp) {
        ES.removeAn(this.$_oContainer);
        var oData = oTemp.oData;
        var bAdd = false;
        if (!oTemp.nId) {
            bAdd = true;
        }

        if (oData && oData.IsSuccess) {
            ES.aSucess(bAdd ? ES.Common.Lang[10] : ES.Common.Lang[20]);
            // 刷新grid列表
            this._oParent.fire('CloudMap:EditTool.clearLayer');
            // 刷新listview
            this._oParent.fire('PostPosTreeView.reflesh');

            this._oParent.fire('CloudMap:LineLayer.reflesh', {Id:oTemp.nId,Json:JSON.stringify(oTemp.Map),CloudName:oTemp.CloudName} );

            this.$_oContainer.hide();
        }
        else {
            ES.aErr(ES.template(bAdd ? '添加数据失败,原因:{Msg}' : '修改数据失败,原因:{Msg}', oData));
            this._oParent.fire('Edit:saveFail');
        }
    },

    // 接口
    initOn: function () {

        this._oParent.on('CloudMap:PopWnd.show', this.showModal, this);
        this._oParent.on('CloudMap:PopWnd.editShow', this.editShow, this);
        this._oParent.on('CloudMap:PopWnd.setPos', this.setPos, this);
    },

    setPos:function(oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();
        if(!oData) {return;}
        var oPos = oData.oPos
        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});
    },


    editShow: function (oData) {
        if (!oData || !oData.oInfo) {
            return;
        }
        var oPos = oData.oPos;

        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        this.$_oContainer.css({
            top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px',
            left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'
        });

        $('#GridName').val(oData.oBusData.cName);
        $('#DeptName').val(oData.oBusData.cParentText);
        //$('#DeptId').val(oData.oBusData.DeptId);

        this.oBusData = {};
        this.oBusData.Id = -parseInt(oData.oBusData.cId);
        this.oBusData.oInfo = oData.oInfo;
        this.cParentId = oData.oBusData.cParentId;

        this.$_oContainer.show();
    },

    showModal: function (oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        var oPos = oData.oPos;

        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});

        $('#GridName').val('');
        $('#DeptName').val('');

        this.oBusData = oData;
        this.oBusData.Id = oData.cId;
        this.$_oContainer.show();
    },
});

// 树的选择初始化
ES.CloudMap.LineWnd.include({

    cContent:'<div class="ex-mapgrid-tip-box  GridWnd"  style="top:150px; left:450px;">'+
    '<ul class="ec-avg-sm-1">'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">线路名称：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="GridName" name="form-sitename" autocomplete="off" placeholder="请输入线路名称" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">行政编号：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="AreaCode" name="form-sitename" autocomplete="off" placeholder="请输入行政编号" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+

    '    <li class="ec-form-group">'+
    '    <label for="form-selectDate" class="ec-u-sm-4 ec-form-label"> 区域：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="DeptName" name="form-sitename" autocomplete="off" placeholder="请输入区域" class="ec-form-field ec-radius ec-input-sm">'+
    '    </div>'+
    '    </li>'+


    '    <li class="ec-form-group">'+
    '       <div class="ec-u-sm-12 ex-final-button">'+
    '           <button type="button" class="ec-btn ec-btn-sm ec-btn-primary"><i class="ec-icon-save"></i> 保存 </button>'+
    '           <a href="#" type="button" class="ec-btn ec-btn-sm ec-btn-warning" style="color:#fff;">' +
    '               <i class="ec-icon-link"></i> 关闭 ' +
    '           </a>'+
    '       </div>'+
    '   </li>'+
    '</ul>'+
    '</div>',


});

ES.MapControl.Layout = ES.Class.extend({
    //oUIConfig: {
    //    div: {
    //        'class': 'ex-layout-map-content',
    //        div: [
    //            {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left'},
    //            {'class': 'ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right'},
    //            {'class': 'ex-layout-maptool ex-map-bottom ex-map-left'},
    //            {'class': 'ex-layout-maptool ex-theme-maptool ex-map-bottom ex-map-right'}
    //        ]
    //    }
    //},

    oOption: {
        cPContainer: '.ex-layout-content',
        cDidId: 'MapView',
    },

    initialize: function (oParent, oOption) {
        //if(!oOption.cHTML)
        //{
        //    this.cHTML = oOption.cHTML;
        //    delete  oOption.cHTML;
        //}

        ES.setOptions(this, oOption);
        this._oParent = oParent;


        this.$_oPContainer = oOption.cPContainer;
        if (typeof oOption.cContainerSel !== 'object') {
            this.$_oPContainer = $(this.oOption.cPContainer);
        }

        // 初始化界面
        this.initUI();

        // 添加项
        this.initOn();

    },

    initUI: function () {
        this.$_oContainer = $(this.cHTML);
        this.$_oContainer.attr({'id': this.oOption.cDidId});
        this.$_oPContainer.append(this.$_oContainer);
    },

    initOn:function() {
        if (!this._oParent) {
            return;
        }
        this._oParent.on('MapControl:Layout.addToolItem', this.addToolItem, this);

    },

    addToolItem: function (oData) {
        this._addToolItem(oData.cHTML);
    },

    // 添加项
    _addToolItem: function (cHTML) {
        var　$_oItem = $(cHTML);
        this.$_oContainer.append($_oItem);
    }
});

// 地图容器 和 相关的布局要求
ES.MapControl.Layout.include({

    cHTML:
    '<div  class="ex-layout-map-content">' +
    '    <div class="ex-layout-type-wbox ex-map-bottom ex-map-right"></div>' +
    '    <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-left  ec-padding-0">   </div>' +
    '    <div class="ex-layout-maptool ex-theme-maptool ex-map-top ex-map-right"></div>' +
    '    <div class="ex-layout-monitor-wbox">  </div>' +
    ' </div>'
});

ES.MapControl.ESMapToolBox = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ["ex-layout-maptool", "ex-theme-maptool", "ex-map-top", "ex-map-left"],

        cClassName: '',//ec-margin-right
        title: '图层切换',
    },

    oUIConfig: {
        div: {
            'class': 'ex-maptool-box ex-control-dropmenu ',
            i: {'class': 'ec-icon-briefcase'},
            html: '&nbsp;&nbsp;',
            span: {html: '工具'},
            i11: {'class': 'ec-icon-angle-down'},
            ul: {
                'class': 'ec-avg-sm-1 ec-dropdown-content',
                li: [{
                    a: {
                        href: 'javascript:void(0);',
                        i: {'class': 'ex-icon-maptool ex-maptool-china'},
                        html: '&nbsp;全国'
                    }
                },
                    {
                        a: {
                            href: 'javascript:void(0);',
                            i: {'class': 'ex-icon-maptool ex-maptool-range'},
                            html: '&nbsp;测距'
                        }
                    },
                    {
                        a: {
                            href: 'javascript:void(0);',
                            i: {'class': 'ex-icon-maptool ex-maptool-area'},
                            html: '&nbsp;测面'
                        }
                    },
                    {
                        a: {
                            href: 'javascript:void(0);',
                            i: {'class': 'ex-icon-maptool ex-maptool-scale-big'},
                            html: '&nbsp;拉框放大'
                        }
                    },
                    {
                        a: {
                            href: 'javascript:void(0);',
                            i: {'class': 'ex-icon-maptool ex-maptool-scale-small'},
                            html: '&nbsp;拉框缩小'
                        }
                    },
                    {
                        a: {
                            href: 'javascript:void(0);',
                            i: {'class': 'ex-icon-maptool ex-maptool-location'},
                            html: '&nbsp;坐标查询'
                        }
                    },
                    //{ a: { href: 'javascript:void(0);', i: { 'class': 'ex-icon-maptool ex-maptool-reset' }, html: '&nbsp;清除' } }
                ]
            }
        }
    },

    // 构造函数
    initialize: function (oMapBase, options) {

        if(options.oUIConfig)
        {
            ES.extend(this.oUIConfig,options.oUIConfig);
            delete  options.oUIConfig
        }

        ES.setOptions(this, options);

        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;

        this.$_oContainer = $("." + this.oOption.acParentDivClass.join("."));

        //L.drawLocal = ES.TrackView.Config.getDrawConfig();
        //L.drawLocal = ES.MapControl.Config.getDrawConfig()

        this.initUI();

        // 设置父级容器的事件
        this.setParentEvent();

        this.initMapTool();

        this.oActHandler = null;
    },

    initMapTool: function () {
        this.oScaleBig = new L.Map.ScaleBig(this._oMap);
        this.oScaleSmall = new L.Map.ScaleSmall(this._oMap);

        //地图测距查询
        this.oDistantHandler = L.MapLib.Measure.distMgr(this._oMap);

        //地图面积查询
        this.oAreaHandler = L.MapLib.Measure.areaMgr(this._oMap, {});

        //地图坐标查询 new L.Measure.LocaltionSearch(map)
        this.oMapToolLocal = new L.MapLib.LocaltionSearch.Search(this._oMap);
    },



    // 设置父级容器的事件
    setParentEvent: function () {

        ////屏蔽事件
        L.DomEvent.addListener(this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

        L.DomEvent.addListener(this.$_oContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);

    },

    //加载工具事件，初始化工具栏
    initUI: function () {
        ES.initTag(this.$_oContainer.eq(0), this.oUIConfig);
        this.initToolEvent();

    },

    //初始化工具栏事件
    initToolEvent: function () {
        var self = this;
        this.$_oContainer.find("div.map-tool-box>ul>li>a").bind('click', this, function (e) {
            var cName = $(this).get(0).innerText.trim();
            self.$_oContainer.find("div.map-tool-box>span").html(cName);
            //self._oContainer.find("span").eq(1).html(cName);
        });

        $(".ex-maptool-scale-big").parent().bind("click", function () {
            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            self.oActHandler = self.oScaleBig;
            self.oActHandler.enable();
        })

        $(".ex-maptool-scale-small").parent().bind("click", function () {
            if (self.oActHandler) {
                self.oActHandler.disable();

            }
            self.oActHandler = self.oScaleSmall;
            self.oActHandler.enable();

        })

        $(".ex-maptool-china").parent().bind("click", function () {
            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            self._oMap.setView(new L.LatLng(35, 103.5), 4);
        })


        $(".ex-maptool-reset").parent().bind("click", function () {

            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            //self.oAreaHandler.clearPoly();
        })

        $(".ex-maptool-location").parent().bind("click", function () {
            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            self.oActHandler = self.oMapToolLocal;
            self.oActHandler.enable();

        })
        $(".ex-maptool-range").parent().bind("click", function () {

            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            self.oActHandler = self.oDistantHandler;
            self.oActHandler.enable();

        })
        $(".ex-maptool-area").parent().bind("click", function () {

            if (self.oActHandler) {
                self.oActHandler.disable();
            }
            //self.oAreaHandler.clearPoly();
            self.oActHandler = self.oAreaHandler;
            self.oActHandler.enable();

        })

    },


});

ES.MapControl.ESMapTile = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left'],

        cClassName: '',//ec-margin-right
        title: '图层切换',

    },

    oUIConfig: {
        div: {
            'class': 'ex-maptool-box ex-control-dropmenu  map-tile',
            i: {'class': 'ec-icon-clone'},
            html: '&nbsp;&nbsp;',
            span: {html: '高德地图'},
            i11: {'class': 'ec-icon-angle-down'},
            ul: {
                'class': 'ec-avg-sm-1 ec-dropdown-content',
                li: [{a: {href: 'javascript:void(0);', html: '高德地图'}},
                    {a: {href: 'javascript:void(0);', html: '高德卫星图'}},
                    {a: {href: 'javascript:void(0);', html: '谷歌地图'}},
                    {a: {href: 'javascript:void(0);', html: '谷歌卫星图'}},
                    {a: {href: 'javascript:void(0);', html: '谷歌地形图'}},
                    {a: {href: 'javascript:void(0);', html: '灰度图'}}
                ]
            }
        }
    },

    // 构造函数
    initialize: function (oMapBase, options) {

        if(options.oUIConfig)
        {
            ES.extend(this.oUIConfig,options.oUIConfig);
            delete  options.oUIConfig
        }

        ES.setOptions(this, options);

        //this._oParent = oParent;

        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;

        //图层
        this._layers = {};
        //记录最近一次的div Z-index
        this._lastZIndex = 0;

        this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));
        var aoLayer = this._oMapBase.getBaseLayers();
        // 添加图层
        for (var i in aoLayer) {
            this._addLayer(aoLayer[i], i);
        }
        // 设置父级容器的事件
        this.setParentEvent();

        this.initUI();
    },

    _addLayer: function (layer, name, overlay) {
        // 获得图层id
        var id = L.stamp(layer);

        this._layers[id] = {
            layer: layer,
            name: name,
            overlay: overlay
        };

        if (this.oOption.autoZIndex && layer.setZIndex) {
            this._lastZIndex++;
            layer.setZIndex(this._lastZIndex);
        }
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

    //加载工具事件，初始化工具栏
    initUI: function () {
        ES.initTag(this.$_oPContainer.eq(0), this.oUIConfig);
        this.initToolEvent();

    },

    //初始化工具栏事件
    initToolEvent: function () {
        var self = this;
        this.$_oPContainer.find('div.map-tile>ul>li>a').bind('click', this, function () {
            var cName = $(this).get(0).innerText.trim();
            self.selectLayer(cName);
            self.$_oPContainer.find('div.map-tile>span').html(cName);

        });
        this.$_oPContainer.find('div.map-tile>ul>li>a').mouseover(function () {
            self._oMap.doubleClickZoom.disable();//禁止默认双击
        });
        this.$_oPContainer.find('div.map-tile>ul>li>a').mouseout(function () {
            self._oMap.doubleClickZoom.enable();//禁止默认双击
        });

    },

    // 选择图层
    selectLayer: function (cName) {
        if (cName === '灰度图') {
            if (this._oMap.getZoom() > 16) {
                this._oMap.setZoom(16);
            }
        }

        //var oLayer = null;
        for (var key in this._layers) {
            var oItem = this._layers[key];
            if (oItem.name === cName && !this._oMap.hasLayer(oItem.layer)) {
                //添加图层
                this._oMap.addLayer(oItem.layer);
            }
            else if (this._oMap.hasLayer(oItem.layer) && oItem.name !== cName) {

                this._oMap.removeLayer(oItem.layer);
            }
        }
    },

});

ES.MapControl.ESMapSearch = ES.Evented.extend({

    oOption: {
        // 父级容器
        cParentDiv: 'MapView',
        acParentDivClass: ['ex-layout-maptool', 'ex-theme-maptool', 'ex-map-top', 'ex-map-left'],

        className: '',
        title: '图层切换',
        // poi 查询地址
        cUrl: '/MapView/PoiSearch',

        // 具体参数含有可以查看高德MapApi
        oParam: {
            key: '',
            keywords: '',
            types: '050301',
            location: '113.22,30.333',
            city: '',
            citylimit: '',
            datatype: 'poi',
            output: 'JSON',
        },

    },

    // 查询的html代码
    cHtml: '<div class="ex-maptool-box"><div class="ec-input-group ex-maptool-search-box"> ' +
    '   <input type="text" name="name" placeholder="搜索" class="ec-form-field"/> ' +
    '   <span class="ec-input-group-btn"> ' +
    '       <button class="ec-btn ec-btn-primary ec-btn-sm search" type="button"><span class="ec-icon-search"></span></button>   ' +
    '       <button class="ec-btn ec-btn-default ec-btn-sm clear" type="button"><span class="ec-icon-close"></span></button>' +
    '   </span>' +
    '    ' +
    '       <ul class="ex-maptool-box-search-result">      </ul>' +
    '     ' +
    ' </div> </div>',

    // 构造函数
    initialize: function (oMapBase, options) {
        ES.setOptions(this, options);
        // 获得地图控件
        this._oMapBase = oMapBase;
        this._oMap = oMapBase._oMap;
        //图层
        this.oLayer = L.featureGroup();
        this.oInputData = null;
        this.oLayer.addTo(this._oMap);
        this.$_oPContainer = $('.' + this.oOption.acParentDivClass.join('.'));

        this.initUI();
        this.setParentEvent();
        // 注册事件
        this.initToolEvent();
    },


    // 设置父级容器的事件
    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener(this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'touchmove', L.DomEvent.stopPropagation);
    },

    //加载工具事件，初始化工具栏
    initUI: function () {

        this.$_oContainer = $(this.cHtml);

        this.$_oPContainer.eq(0).append(this.$_oContainer);

        this.$_oSearchRtn = this.$_oContainer.find('.ex-maptool-box-search-result');

        this.$_oSearchRtn.hide();

        // 查询项
        this.$_oUL = this.$_oContainer.find('ul.ex-maptool-box-search-result');

        // 清空
        this.$_oUL.empty();

        // 查询输入框
        this.$_oInput = this.$_oContainer.find('input');

        // 清空
        this.$_btnClear = this.$_oContainer.find('button.clear');

        // 查询
        this.$_btnSearch = this.$_oContainer.find('button.search');

    },

    //初始化工具栏事件
    initToolEvent: function () {
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
                var cSearchVal = self.$_oInput.val();
                var oLatLng = self._oMap.getCenter();
                var oParam = {};
                ES.extend(oParam, self.oOption.oParam, {
                    keywords: cSearchVal,
                    location: oLatLng.lng + ',' + oLatLng.lat
                });
                ES.getData(oParam, self.oOption.cUrl, self.searchPoiHandler, self);
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

        // 注册按钮时间
        this.$_btnClear.bind('click', function () {
            self.oLayer.clearLayers();
            self.$_oInput.val('');
        });

        // 查询事件
        this.$_btnSearch.bind('click', function () {
            var cSearchVal = self.$_oInput.val();
            var oLatLng = self._oMap.getCenter();
            var oParam = {};
            ES.extend(oParam, self.oOption.oParam, {
                keywords: cSearchVal,
                location: oLatLng.lng + ',' + oLatLng.lat
            });
            ES.getData(oParam, self.oOption.cUrl, self.searchPoiHandler, self);
        });
    },

    // 定位 当前位置,
    localPos:function() {

        this.oLayer.clearLayers();
        var $_oLI = this.$_oUL.find("li.ec-active");
        var oData = $_oLI.data('oData');

        var oMarker = L.marker([oData.lat, oData.lng]);
        oMarker.oData = oData;
        // 创建点
        oMarker.addTo(this.oLayer);

        this._oMap.flyTo([oData.lat, oData.lng], 16);
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
            return false;                                                            //不可循环移动
        }
        else {
            this.$_oUL.find("li").removeClass('ec-active').eq(index - 1).addClass('ec-active');
            var oData = this.$_oUL.find("li").eq(index - 1).data('oData');

            this.$_oInput.val(oData.name);
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
            return false;                                                //不可循环移动
        }
        else {
            this.$_oUL.find("li").removeClass('ec-active').eq(index + 1).addClass('ec-active');
            var oData = this.$_oUL.find("li").eq(index + 1).data('oData');
            this.$_oInput.val(oData.name);
        }
    },

    // 查询处理
    searchPoiHandler: function (oData) {
        this.$_oUL.empty();
        this.$_oSearchRtn.hide();

        if (oData.status === 0 || oData.count <= 0) {
            return;
        }
        // 加载数据
        for (var i = 0; i < oData.tips.length; i++) {
            if (oData.tips[i].lng === 0) {
                continue;
            }
            oData.tips[i].cDist = oData.tips[i].district||'';
            var $_li = $(ES.template('<li class="location"><b>{name}</b><span>{cDist}</span></li>', oData.tips[i]));
            $_li.data('oData', oData.tips[i]);
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

    }


});

ES.CloudMap.SiteTreePanel = ES.CloudMap.BaseTreePanel.extend({

});

ES.CloudMap.EditSiteTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>编 辑</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);
        this._oDrawLayer =oParent.getDrawLayer();
        this.oPen = null;

        this.initPen();

    },


    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this);
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPen.handler.enable();
            self._oParent.addSaveACalToUI();

        });
    },

    //  画点
    initPen: function () {
        this.oPen = {
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
            title: ''
        }
    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

        this._oParent.on('CloudMap:EditTool.calEdit',this.calEdit,this);
        this._oParent.on('CloudMap:EditTool.edit',this.edit,this);
        this._oParent.on('CloudMap:EditTool.SaveEdit',this.saveEdit,this);

        var self =this;
        this._oMap.on('draw:edited', function (e) {
                if(!self._oParent.getActive()){
                return
            }
            var oMap = this;
            var aoLayer = e.layers;

            aoLayer.eachLayer(function (oLayer) {

                var aoLatLng = oLayer.getLatLngs()[0].map(function (oItem) {
                    return {lat:oItem.lat,lng:oItem.lng};
                });


                var oInfo = {
                    aoLatLng: aoLatLng,
                    oOption: {},
                };

                self._oDrawLayer.addLayer(oLayer);

                // 弹出层显示的位置信息
                var oPos = oMap.latLngToLayerPoint(aoLatLng[0]);

                // 告诉外面弹出层的位置
                self._oParent.fire('CloudMap:PopWnd.editShow', {
                    oInfo: oInfo,
                    oPos: oPos,
                    oBusData:oLayer.oBusData
                });
            });
        });
    },

    // 保存编辑
    saveEdit: function () {
        this.oPen.handler.save();
        this.oPen.handler.disable();

    },

    // 取消编辑
    calEdit: function () {
        this.oPen.handler.revertLayers();
        this.oPen.handler.disable();
    },

    // 编辑数据
    edit: function (oVal) {

        this._oParent.clearLayers();

        if (!oVal  || !oVal.oNode) {
            return ;
        }

        var oVehLine = this.createLayer(oVal.oNode.data);

        if(!oVehLine){
            return;
        }

        // 编辑围栏数据,画围栏时要表明自己的名称
        //var oVehLine = L.marker(oVal.oNode.data,{});
        oVehLine.edited = true;

        this.fitBound();

        var oData = {
            oLatLng: oVal.oNode.data,
            cId: oVal.oNode.id,
            cName: oVal.oNode.text,
            cParentId:oVal.oNode.parent,
            cParentText :oVal.oNode.parentText,
        }
        oVehLine.cId = oVal.oNode.id;
        oVehLine.oBusData = oData;
        oVehLine.addTo(this._oDrawLayer);

        this._oParent.addEditToUI();
    },

    // 多边形定位到地图中间
    fitBound: function () {
        if (!this._oDrawLayer) {
            return;
        }
        var oBound = this._oDrawLayer.getBounds();
        this._oMap.fitBounds(oBound);
    },

    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData || !oData.Json) return oVehLine;

        var oTemp = null;

        try {
            oTemp = JSON.parse(oData.Json);
            oTemp.oOption = this.oPenStyle;
        } catch (e) {
            oTemp = null;
        }
        if (!oTemp) {
            return oVehLine;
        }
        oVehLine = L.polyline(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);


        return oVehLine;
    },

});

ES.CloudMap.DrawSiteTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画站场</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);

        this.initPen();

        this.initOn();

        this.initUI();


    },

    // 点击callback
    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this );

        var self =this;
        this.$_oLi.find('button').bind('click', function () {

            // 开启
            self.oPen.handler.enable();
            self._oMap.once('draw:created', self.createdCallBack, self);

        });
    },

    // 画点
    initPen: function () {
        this.oPen = {
            enabled: {},
            handler: new L.Draw.Polygon(this._oMap, {}),
            title: ''
        }
    },

    calDraw:function(){
        if(this.oPen){
            this.oPen.handler.disable();
        }

    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

    },



    createdCallBack:function(e) {
        var oLayer = e.layer;

        this._oParent.addLayer(oLayer);

        var aoLatLng = oLayer.getLatLngs();

        var aoTemp = aoLatLng[0].map(function (oItem) {

            return {lat: oItem.lat, lng: oItem.lng}
        });

        var oInfo = {
            aoLatLng: aoTemp,
            oOption: {},
        };

        var oPos = this._oMap.latLngToLayerPoint(aoTemp[aoTemp.length - 1]);

        this._oParent.fire('CloudMap:PopWnd.show', {oInfo: oInfo, oPos: oPos});
    }


});

ES.CloudMap.SiteWnd = ES.CloudMap.BaseWnd.extend({

    oOption: {
        cContainerSel: '#MapView',
        cFlag: 'Grid',
        oText: {},
        oOffset: {nW: 0, nH: 0},

    },

    initialize: function (oParent, oOption,oTreeOption) {
        this._oParent = oParent;
        this.oTreeOption = oTreeOption;
        ES.setOptions(this, oOption);

        this.cFlag = 'PostPos';

        // 窗体在地图上弹出的位置信息
        this.oPopLatLng = null;

        this.initUI();
        this.initOn();

        this.setParentEvent();

    },

    initUI: function () {
        this.$_oContainer = $(this.cContent);
        $(this.oOption.cContainerSel).append(this.$_oContainer);
        this.$_oContainer.hide();
        this.afterOpen();
    },

    afterOpen: function () {
        var self = this;
        this.$_oContainer.find('.ec-icon-save').parent().bind('click', function () {
            self.save();
        });

        //type="button"
        this.$_oContainer.find('a[type="button"]').bind('click', function () {
            self.$_oContainer.hide();
            self._oParent.clearLayers();
        });

        // 分类树
        if (!this.oSelectTree) {
            this.oSelectTree = new ES.Common.SelectTreeNode(this, {
                cBandSel: $('#DeptName')
            }, this.oTreeOption);
        }
        this.oSelectTree.on('selectVal',  this.setVal,this);
    },

    setVal: function (oData) {

        if (oData.id.indexOf('d_') >= 0) {
            $('#DeptName').val(oData.text);
            this.cParentId = oData.id;
        }

    },

    setParentEvent: function () {
        //屏蔽事件
        L.DomEvent.addListener( this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);
    },

    check: function () {

        if (!$('#GridName').val()) {
            ES.aWarn('请录入名称！');
            return false;
        }

        return true;
    },

    save: function () {
        if (!this.check()) {
            return;
        }

        ES.loadAn(this.$_oContainer);

        var oParam = {
            Id: -this.oBusData.Id,
            CloudName: $('#GridName').val(),
            DeptId:this.cParentId.replace('d_',''),
            CloudType: 1,
            Map: this.oBusData.oInfo,
            Source: 1,
            MapType: 1,
        };

        ES.getData(oParam, '/Line/Edit', this.saveHandler, this, {nId: oParam.Id,Map:oParam.Map,CloudName:oParam.CloudName});
    },

    saveHandler: function (oTemp) {
        ES.removeAn(this.$_oContainer);
        var oData = oTemp.oData;
        var bAdd = false;
        if (!oTemp.nId) {
            bAdd = true;
        }

        if (oData && oData.IsSuccess) {
            ES.aSucess(bAdd ? ES.Common.Lang[10] : ES.Common.Lang[20]);
            // 刷新grid列表
            this._oParent.fire('CloudMap:EditTool.clearLayer');
            // 刷新listview
            this._oParent.fire('PostPosTreeView.reflesh');

            this._oParent.fire('CloudMap:LineLayer.reflesh', {Id:oTemp.nId,Json:JSON.stringify(oTemp.Map),CloudName:oTemp.CloudName} );

            this.$_oContainer.hide();
        }
        else {
            ES.aErr(ES.template(bAdd ? '添加数据失败,原因:{Msg}' : '修改数据失败,原因:{Msg}', oData));
            this._oParent.fire('Edit:saveFail');
        }
    },

    // 接口
    initOn: function () {

        this._oParent.on('CloudMap:PopWnd.show', this.showModal, this);
        this._oParent.on('CloudMap:PopWnd.editShow', this.editShow, this);
        this._oParent.on('CloudMap:PopWnd.setPos', this.setPos, this);
    },

    setPos:function(oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();
        if(!oData) {return;}
        var oPos = oData.oPos
        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});
    },

    editShow: function (oData) {
        if (!oData || !oData.oInfo) {
            return;
        }
        var oPos = oData.oPos;

        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        this.$_oContainer.css({
            top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px',
            left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'
        });

        $('#GridName').val(oData.oBusData.cName);
        $('#DeptName').val(oData.oBusData.cParentText);
        //$('#DeptId').val(oData.oBusData.DeptId);

        this.oBusData = {};
        this.oBusData.Id = -parseInt(oData.oBusData.cId);
        this.oBusData.oInfo = oData.oInfo;
        this.cParentId = oData.oBusData.cParentId;

        this.$_oContainer.show();
    },

    showModal: function (oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        var oPos = oData.oPos;

        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});

        $('#GridName').val('');
        $('#DeptName').val('');

        this.oBusData = oData;
        this.oBusData.Id = oData.cId;
        this.$_oContainer.show();
    },
});

// 树的选择初始化
ES.CloudMap.SiteWnd.include({

    cContent:'<div class="ex-mapgrid-tip-box  GridWnd"  style="top:150px; left:450px;">'+
    '<ul class="ec-avg-sm-1">'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">站场名称：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="GridName" name="form-sitename" autocomplete="off" placeholder="请输入站场名称" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+

    '    <li class="ec-form-group">'+
    '    <label for="form-selectDate" class="ec-u-sm-4 ec-form-label"> 区域：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="DeptName" name="form-sitename" autocomplete="off" placeholder="请输入区域" class="ec-form-field ec-radius ec-input-sm">'+
    '    </div>'+
    '    </li>'+


    '    <li class="ec-form-group">'+
    '       <div class="ec-u-sm-12 ex-final-button">'+
    '           <button type="button" class="ec-btn ec-btn-sm ec-btn-primary"><i class="ec-icon-save"></i> 保存 </button>'+
    '           <a href="#" type="button" class="ec-btn ec-btn-sm ec-btn-warning" style="color:#fff;">' +
    '               <i class="ec-icon-link"></i> 关闭 ' +
    '           </a>'+
    '       </div>'+
    '   </li>'+
    '</ul>'+
    '</div>',


});

/**
 * Created by liulin on 2017/6/1.
 */

ES.CloudMap.DelWnd = ES.Common.DialogDel.extend({
    initOn: function () {
        this._oParent.on('CloudMap:DelCloudMap.del', this.del, this);
    },
    save: function () {
        if (!this.oBusData) {
            ES.aWarn(ES.Lang.BaseDialog[30]);
            return;
        }

        ES.loadAn($(this.oDialog.node));
        ES.getData({id:this.oBusData.Id}, this.oOption.cUrl, this.saveHandler, this,null,
            {
                headers: {
                    token: m_oParam.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });
    },

    saveHandler: function (oData) {
        ES.removeAn($(this.oDialog.node));

        if (oData && oData.IsSuccess) {
            ES.aSucess(ES.Common.Lang[32]);
            this._oParent.fire('PostPosTreeView.reflesh');
            this._oParent.clearLayers();
            this._oParent.fire('CloudMap:EditTool.calEdit');
            this._oParent.addDrawToUI();
        }
        else {
            ES.aErr(ES.template(ES.Common.Lang[33], oData));
        }

        this.oDialog.close();
    },

});


/**
 * Created by liulin on 2017/6/1.
 */


ES.CloudMap.MarkerWnd = ES.CloudMap.PopWnd.extend({

    oOption: {
        cContainerSel: '#MapView',
        cFlag: 'Grid',
        oText: {},
        oOffset: {nW: 0, nH: 30}
    },

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        //ES.Common.Pop.prototype.initialize.call(this, oParent, oOption);
        ES.setOptions(this, oOption);
        //this.hideDefaultButton();
        this.cFlag = 'PostPos';
        // 窗体在地图上弹出的位置信息
        this.oPopLatLng = null;

        this.initUI();
        this.initOn();

        this.setParentEvent();

    },

    initUI: function () {
        this.$_oContainer = $(this.cContent);
        $(this.oOption.cContainerSel).append(this.$_oContainer);
        this.$_oContainer.hide();
        this.afterOpen();
    },

    afterOpen: function () {
        var self = this;
        this.$_oContainer.find('.ec-icon-save').parent().bind('click', function () {
            self.save();
        });

        //type="button"
        this.$_oContainer.find('a[type="button"]').bind('click', function () {
            self.$_oContainer.hide();
            self._oParent.clearLayers();
        });

        // 分类树
        if (!this.oSelectTree) {
            this.oSelectTree = new ES.Common.SelectTreeNode(this, {
                    cBandSel: $('#MarkerDeptName')
                },
                {
                    core: {
                        'animation': 0,
                        'check_callback': true,

                        'state': {'opened': true},
                        'data': function (obj, callback) {
                            var self = this;
                            var oReqParam = {
                                type: 'POST',
                                'url': m_Url + '/base/tree',
                                headers: {
                                    token: m_oParam.token,
                                    "Content-Type": 'application/json; charset=utf-8'
                                },
                                dataType: 'json',
                                data: '{"tree":"cloudMapRegionTree"}',
                                success: function (oData) {
                                    callback.call(self, oData.detail);
                                },
                                error: function () {
                                    callback.call(self, null);
                                },
                            }
                            $.ajax(oReqParam);
                        }

                    },
                    plugins: ['types', 'search', 'unique']
                });
        }
        this.oSelectTree.on('selectVal',  this.setVal,this);
    },

    setVal: function (oData) {
        $('#MarkerDeptName').val(oData.text);

        this.cParentId =  oData.id ;

        $('.ex-cover-tree-select').hide().siblings('div').hide();
    },

    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener(this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener(this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    check: function () {

        if (!$('#MarkerName').val()) {
            ES.aWarn('请录入名称！');
            return false;
        }

        return true;
    },

    save: function () {
        if (!this.check()) {
            return;
        }

        ES.loadAn(this.$_oContainer);
        this.oBusData.oInfo.nType = 4;
        var oId = 0;
        if(this.oBusData.Id){
            oId = -this.oBusData.Id;
        };

        var xyArr = this.oBusData.oInfo.aoLatLng;
        var xArr = [], yArr = [];
        for (var i = 0; i < xyArr.length; i++) {
            xArr.push(xyArr[i].lng.toFixed(6));
            yArr.push(xyArr[i].lat.toFixed(6));
        }
        var nxyArr = [];
        for (var i = 0; i < xArr.length; i++) {
            nxyArr.push(xArr[i] + "," + yArr[i]);
        }
        var self = this;
        ES.getData({ xy: nxyArr },m_transAddressUrl, function (gArr) {
            $('.ex-layout-loading').remove();
            if (!gArr.mapx) { //转换失败
                ES.aErr("位置信息获取失败");
            }else{
                var oParam = {
                    Id: oId,
                    CloudName: $('#MarkerName').val(),
                    DeptId:self.cParentId,
                    CloudType: 9,
                    Map: self.oBusData.oInfo,
                    Source: 1,
                    MapType: 5,
                    MapX:gArr.mapx,
                    MapY:gArr.mapy,
                    GpsX:gArr.gpsx,
                    GpsY:gArr.gpsy,
                    Address:gArr.poi,
                };
                ES.getData(oParam, m_postUrl, self.saveHandler, self, {nId: oParam.Id},{},{
                    headers: {
                        token: m_oParam.token,
                        "Content-Type": 'application/json; charset=utf-8'
                    }
                });
            }
        });
     },

    saveHandler: function (oTemp) {
        ES.removeAn(this.$_oContainer);
        var oData = oTemp.oData;
        var bAdd = false;
        if (!oTemp.nId) {
            bAdd = true;
        }

        if (oData && oData.IsSuccess) {
            ES.aSucess(bAdd ? ES.Common.Lang[10] : ES.Common.Lang[20]);
            // 刷新grid列表
            this._oParent.fire('CloudMap:EditTool.clearLayer');
            // 刷新listview
            this._oParent.fire('PostPosTreeView.reflesh');

            this.$_oContainer.hide();
        }
        else {
            ES.aErr(ES.template(bAdd ? '添加数据失败,原因:{Msg}' : '修改数据失败,原因:{Msg}', oData));
            this._oParent.fire('Edit:saveFail');
        }
    },

    // 接口
    initOn: function () {

        this._oParent.on('CloudMap:PopWnd.show', this.showModal, this);
        this._oParent.on('CloudMap:PopWnd.editShow', this.editShow, this);
        this._oParent.on('CloudMap:PopWnd.setPos', this.setPos, this);

    },

    setPos: function (oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();
        if (!oData) {
            return;
        }
        var oPos = oData.oPos
        this.$_oContainer.css({
            top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px',
            left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'
        });
    },


    editShow: function (oData) {
        if (!oData || !oData.oInfo) {
            return;
        }
        var oPos = oData.oPos;

        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        this.$_oContainer.css({
            top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px',
            left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'
        });

        $('#MarkerName').val(oData.oBusData.cName);
        $('#MarkerDeptName').val(oData.oBusData.cParentText);

        this.oBusData = {};
        this.oBusData.Id = -parseInt(oData.oBusData.cId);
        this.oBusData.oInfo = oData.oInfo;
        this.cParentId = oData.oBusData.cParentId;

        this.$_oContainer.show();
    },

    showModal: function (oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        var oPos = oData.oPos;

        this.$_oContainer.css({
            top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px',
            left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'
        });

        $('#GridName').val('');
        $('#MarkerDeptName').val('');

        this.oBusData = oData;
        this.oBusData.Id = 0;
        this.$_oContainer.show();

    },

});

// 树的选择初始化
ES.CloudMap.MarkerWnd.include({

    cContent:'<div class="ex-mapgrid-tip-box  GridWnd"  style="top:150px; left:450px;">'+
    '<ul class="ec-avg-sm-1">'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">国控点：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="MarkerName" name="form-sitename" autocomplete="off" placeholder="请输入国控点名称" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+

    '    <li class="ec-form-group">'+
    '    <label for="form-selectDate" class="ec-u-sm-4 ec-form-label"> 区域：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="MarkerDeptName" name="form-sitename" autocomplete="off" placeholder="请输入区域" class="ec-form-field ec-radius ec-input-sm">'+
    '    </div>'+
    '    </li>'+


    '    <li class="ec-form-group">'+
    '       <div class="ec-u-sm-12 ex-final-button">'+
    '           <button type="button" class="ec-btn ec-btn-sm ec-btn-primary"><i class="ec-icon-save"></i> 保存 </button>'+
    '           <a href="#" type="button" class="ec-btn ec-btn-sm ec-btn-warning" style="color:#fff;">' +
    '               <i class="ec-icon-link"></i> 关闭 ' +
    '           </a>'+
    '       </div>'+
    '   </li>'+
    '</ul>'+
    '</div>',


});


/**
 * Created by liulin on 2017/6/1.
 * 国控点
 */


ES.CloudMap.RegionMarkerWnd = ES.CloudMap.PopWnd.extend({

    oOption: {
        cContainerSel: '#MapView',
        cFlag: 'Grid',
        oText: {},
        oOffset: {nW: 0, nH: 30}
    },

    initialize: function (oParent, oOption) {
        this._oParent = oParent;
        //ES.Common.Pop.prototype.initialize.call(this, oParent, oOption);
        ES.setOptions(this, oOption);
        //this.hideDefaultButton();
        this.cFlag = 'PostPos';
        // 窗体在地图上弹出的位置信息
        this.oPopLatLng = null;

        this.initUI();
        this.initOn();

        this.setParentEvent();

    },

    initUI: function () {
        this.$_oContainer = $(this.cContent);
        $(this.oOption.cContainerSel).append(this.$_oContainer);
        this.$_oContainer.hide();
        this.afterOpen();
    },

    afterOpen: function () {
        var self = this;
        this.$_oContainer.find('.ec-icon-save').parent().bind('click', function () {
            self.save();
        });

        //type="button"
        this.$_oContainer.find('a[type="button"]').bind('click', function () {
            self.$_oContainer.hide();
            self._oParent.clearLayers();
        });

        // 分类树
        if (!this.oSelectTree) {
            this.oSelectTree = new ES.Common.SelectTreeNode(this, {
                    cBandSel: $('#RegionMarkerDeptName')
                },
                {
                    core: {
                        'animation': 0,
                        'check_callback': true,

                        'state': {'opened': true},
                        'data': function (obj, callback) {
                            var self = this;
                            var oReqParam = {
                                type: 'POST',
                                'url': m_Url + '/base/tree',
                                headers: {
                                    token: m_oParam.token,
                                    "Content-Type": 'application/json; charset=utf-8'
                                },
                                dataType: 'json',
                                data: '{"tree":"cloudMapRegionTree"}',
                                success: function (oData) {
                                    callback.call(self, oData.detail);
                                },
                                error: function () {
                                    callback.call(self, null);
                                },
                            }
                            $.ajax(oReqParam);
                        }

                    },
                    plugins: ['types', 'search', 'unique']
                });
        }
        this.oSelectTree.on('selectVal',  this.setVal,this);
    },

    setVal: function (oData) {
        $('#RegionMarkerDeptName').val(oData.text);

        this.cParentId = oData.id ;
        $('.ex-cover-tree-select').hide().siblings('div').hide();
    },

    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener( this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    check: function () {

        if (!$('#RegionMarkerName').val()) {
            ES.aWarn('请录入名称！');
            return false;
        }

        return true;
    },

    save: function () {
        if (!this.check()) {
            return;
        }

        // ES.loadAn(this.$_oContainer);
        //
        // var oParam = {
        //     Id: -this.oBusData.Id,
        //     CloudName: $('#RegionMarkerName').val(),
        //     DeptId:this.cParentId.replace('d_',''),
        //     CloudType: 10,
        //     Map: this.oBusData.oInfo,
        //     Source: 1,//图形类型，1多边形、2圆、3矩形、4线点、
        //     MapType: 4,
        // };
        //
        // ES.getData(oParam, '/CloudMap/Edit', this.saveHandler, this, {nId: oParam.Id});
        ES.loadAn(this.$_oContainer);
        this.oBusData.oInfo.nType = 10;
        var oId = 0;
        if(this.oBusData.Id){
            oId = -this.oBusData.Id;
        };

        var xyArr = this.oBusData.oInfo.aoLatLng;
        var xArr = [], yArr = [];
        for (var i = 0; i < xyArr.length; i++) {
            xArr.push(xyArr[i].lng.toFixed(6));
            yArr.push(xyArr[i].lat.toFixed(6));
        }
        var nxyArr = [];
        for (var i = 0; i < xArr.length; i++) {
            nxyArr.push(xArr[i] + "," + yArr[i]);
        }
        var self = this;
        ES.getData({ xy: nxyArr },m_transAddressUrl, function (gArr) {
            $('.ex-layout-loading').remove();
            if (!gArr.mapx) { //转换失败
                ES.aErr("位置信息获取失败");
            }else{
                var oParam = {
                    Id: oId,
                    CloudName: $('#RegionMarkerName').val(),
                    DeptId:self.cParentId,
                    CloudType: 10,
                    Map: self.oBusData.oInfo,
                    Source: 1,
                    MapType: 5,
                    MapX:gArr.mapx,
                    MapY:gArr.mapy,
                    GpsX:gArr.gpsx,
                    GpsY:gArr.gpsy,
                    Address:gArr.poi,
                };
                ES.getData(oParam, m_postUrl, self.saveHandler, self, {nId: oParam.Id,Map:oParam.Map,CloudName:oParam.CloudName},{},
                    {
                        headers: {
                            token: m_oParam.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        }
                    });
            }
        });
    },

    saveHandler: function (oTemp) {
        ES.removeAn(this.$_oContainer);
        var oData = oTemp.oData;
        var bAdd = false;
        if (!oTemp.nId) {
            bAdd = true;
        }

        if (oData && oData.IsSuccess) {
            ES.aSucess(bAdd ? ES.Common.Lang[10] : ES.Common.Lang[20]);
            // 刷新grid列表
            this._oParent.fire('CloudMap:EditTool.clearLayer');
            // 刷新listview
            this._oParent.fire('PostPosTreeView.reflesh');

            this.$_oContainer.hide();
        }
        else {
            ES.aErr(ES.template(bAdd ? '添加数据失败,原因:{Msg}' : '修改数据失败,原因:{Msg}', oData));
            this._oParent.fire('Edit:saveFail');
        }
    },

    // 接口
    initOn: function () {

        this._oParent.on('CloudMap:PopWnd.show', this.showModal, this);
        this._oParent.on('CloudMap:PopWnd.editShow', this.editShow, this);
        this._oParent.on('CloudMap:PopWnd.setPos', this.setPos, this);
    },

    setPos:function(oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();
        if(!oData) {return;}
        var oPos = oData.oPos
        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});
    },


    editShow: function (oData) {
        if (!oData || !oData.oInfo) {
            return;
        }
        var oPos = oData.oPos;

        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        this.$_oContainer.css({
            top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px',
            left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'
        });

        $('#RegionMarkerName').val(oData.oBusData.cName);
        $('#RegionMarkerDeptName').val(oData.oBusData.cParentText);

        this.oBusData = {};
        this.oBusData.Id = -parseInt(oData.oBusData.cId);
        this.oBusData.oInfo = oData.oInfo;
        this.cParentId = oData.oBusData.cParentId;

        this.$_oContainer.show();
    },

    showModal: function (oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        var oPos = oData.oPos;

        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});

        $('#RegionMarkerName').val('');
        $('#RegionMarkerDeptName').val('');

        this.oBusData = oData;
        this.oBusData.Id = 0;
        this.$_oContainer.show();

    },

});

// 树的选择初始化
ES.CloudMap.RegionMarkerWnd.include({

    cContent:'<div class="ex-mapgrid-tip-box  GridWnd"  style="top:150px; left:450px;">'+
    '<ul class="ec-avg-sm-1">'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">市控点：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="RegionMarkerName" name="form-sitename" autocomplete="off" placeholder="请输入市控点名称" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+

    '    <li class="ec-form-group">'+
    '    <label for="form-selectDate" class="ec-u-sm-4 ec-form-label"> 区域：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="RegionMarkerDeptName" name="form-sitename" autocomplete="off" placeholder="请输入区域" class="ec-form-field ec-radius ec-input-sm">'+
    '    </div>'+
    '    </li>'+

    '    <li class="ec-form-group">'+
    '       <div class="ec-u-sm-12 ex-final-button">'+
    '           <button type="button" class="ec-btn ec-btn-sm ec-btn-primary"><i class="ec-icon-save"></i> 保存 </button>'+
    '           <a href="#" type="button" class="ec-btn ec-btn-sm ec-btn-warning" style="color:#fff;">' +
    '               <i class="ec-icon-link"></i> 关闭 ' +
    '           </a>'+
    '       </div>'+
    '   </li>'+
    '</ul>'+
    '</div>',


});


/**
 * Created by liulin on 2017/6/1.
 */


ES.CloudMap.LineTreePanel = ES.CloudMap.BaseTreePanel.extend({

    initUI: function () {

        ES.CloudMap.BaseTreePanel.prototype.initUI.call(this);

        $('input[type="checkbox"]').uCheck();//这是统一写法
        $('input[type="checkbox"].ec-ucheck-checkbox').uCheck();//这是根据class调用

        var self = this;
        //国控点
        $('#Ctrl').bind('change', function (oData) {

            if ($(this).is(':checked')) {

                // ES.Util.reqData({data:{CloudType: 9},url: '/CloudMap/ListPaging'}, function (oData) {
                ES.getData({typeIds:9,districtId:"3"}, m_getList,function(oData){

                    self._oParent.fire('ES:CloudMap.DrawCtrlLayer', {aoData: oData[9]});

                }, this, null,
                    {
                        headers: {
                            token: m_oParam.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        }
                    });
            } else {
                self._oParent.fire('ES:CloudMap.ClearCtrlLayer');
            }

        });

        //市控点
        $('#CityCtrl').bind('change', function (oData) {

            if ($(this).is(':checked')) {
                ES.getData({typeIds:10,districtId:"3"}, m_getList,function(oData){
                    self._oParent.fire('ES:CloudMap.DrawCityCtrlLayer', {aoData: oData[10]});

                }, this, null,
                    {
                        headers: {
                            token: m_oParam.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        }
                    });
            } else {
                self._oParent.fire('ES:CloudMap.ClearCityCtrlLayer');
            }
        });
    },
    // 获取选中树节点的子节点
    getTreeChildren:function(children, node, newArr) {
        let self = this
        for(var i = 0;i<children.length;i++) {
            var cNode = node.instance.get_node(children[i]);
            if (cNode.data.type == 1 && cNode.children.length == 0) {
                newArr.push(cNode.data.id)
            } else if (cNode.children.length > 0) {
                self.getTreeChildren(cNode.children, node, newArr)
            }
        }
        return newArr
    },

    selectDeal:function(oNode){
        if (!oNode || !oNode.node) {
            return;
        };
        var self = this;
        var newArr = new Array()
        var aoData = []
        var singleData = null;
        this._oParent.oDrawTool.calDraw();
        // 当前点击单条
        if(oNode.node.data.type == 1){
            aoData = [oNode.node.data.id]
            ES.getData(JSON.stringify({id: aoData}), m_getList, function (oData) {
                    var oTemp = this.oPopTree.$_oTree.get_node(oNode.node.parent);
                    oNode.node.parentText = oTemp.text;
                    for(var i = 0; i<oData.detail.length;i++){
                        if(oNode.node.data.id == oData.detail[i].code){
                            singleData = oData.detail[i];
                            break;
                        }
                    }
                    if(singleData){
                        self._oParent.fire('MapView:ShowLayer.DrawLayers', {aoData: [singleData]});
                        self._oParent.fire('CloudMap:EditTool.edit', {oNode: singleData});
                    }
                }, this, null,
                {
                    headers: {
                        token: m_oParam.token,
                        "Content-Type": 'application/json; charset=utf-8'
                    }
                });
        }else{
            //当前点击集合 传云图ID集合请求云图数据画地图
            if(oNode.node.children_d.length > 0){
                aoData = self.getTreeChildren(oNode.node.children_d, oNode, newArr)
            }
            ES.getData(JSON.stringify({id: aoData}), m_getList, function (oData) {

                    self._oParent.fire('MapView:ShowLayer.DrawLayers', {aoData: oData.oData.detail});
                    self._oParent.fire('CloudMap:EditTool.calEdit');
                    self._oParent.addDrawToUI();
                }, this, {},
                {
                    headers: {
                        token: m_oParam.token,
                        "Content-Type": 'application/json; charset=utf-8'
                    }
                });
        }





        // 选择部门以上时，画所有返回的数据
        // if(oNode.node.data.type <=2){
        //     ES.getData({typeIds:7,districtId:nId}, m_getList, function (oData) {
        //
        //         this._oParent.fire('MapView:ShowLayer.DrawLayers', {aoData: oData[7]});
        //         self._oParent.fire('CloudMap:EditTool.calEdit');
        //         self._oParent.addDrawToUI();
        //         // if(oData[7].length == 1){
        //         //     self._oParent.fire('CloudMap:EditTool.edit', {oNode: oData[7][0]});
        //         // }
        //     }, this, null,
        //         {
        //             headers: {
        //                 token: m_oParam.token,
        //                 "Content-Type": 'application/json; charset=utf-8'
        //             }
        //         });
        // }else{
        //     //选择单条数据的时候进行筛选画单个线路并显示编辑、删除按钮
        //     ES.getData({typeIds:7,districtId:nId}, m_getList, function (oData) {
        //
        //         if(oNode.node.data.type == '7') {
        //             var oTemp = this.oPopTree.$_oTree.get_node(oNode.node.parent);
        //             oNode.node.parentText = oTemp.text;
        //             for(var i = 0; i<oData[7].length;i++){
        //                 if(nId == oData[7][i].Id){
        //                     singleData = oData[7][i];
        //                     break;
        //                 }
        //             }
        //             if(singleData){
        //                 self._oParent.fire('MapView:ShowLayer.DrawLayers', {aoData: [singleData]});
        //                 self._oParent.fire('CloudMap:EditTool.edit', {oNode: singleData});
        //             }
        //         }
        //     }, this, null,
        //         {
        //             headers: {
        //                 token: m_oParam.token,
        //                 "Content-Type": 'application/json; charset=utf-8'
        //             }
        //         });
        // }
    },

    cHtml:
    '<div class="ex-maptool-box ex-maptool-box-white ex-maptool-property ec-padding-0">' +
    '   <div class="ex-layout-sider ex-theme-tree ec-fl" style = "width:280px">' +
    '       <h3 class="ex-theme-sider-title">' +
    '           <i class="ec-icon-sitemap"></i>&nbsp;{cTitle}' +
    // '           <label for="Ctrl" class="ec-margin-left ec-checkbox-inline ec-success">' +
    // '               <input type="checkbox" id="Ctrl" name="form-checkbox" class="ec-ucheck-checkbox">国控点' +
    // '           </label>' +
    // '           <label for="CityCtrl" class="ec-checkbox-inline ec-success">' +
    // '               <input type="checkbox" id="CityCtrl" name="form-checkbox2" class="ec-ucheck-checkbox">市控点' +
    // '           </label>' +

    '       </h3>' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group">' +
    '               <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字"> </input>' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    '               </span>' +
    '           </div>' +
    '       </div>' +
    '       <div class="ex-layout-struckbox-content" style="height:350px;"></div>' +
    '   </div>' +
    '</div>',
});


/**
 * Created by liulin on 2017/6/1.
 */

ES.CloudMap.NationTreePanel = ES.CloudMap.BaseTreePanel.extend({

    initUI: function () {
        ES.CloudMap.BaseTreePanel.prototype.initUI.call(this);
    },
    selectDeal:function(oNode){
        if (!oNode || !oNode.node) {
            return;
        };
        var self = this;
        var nId = oNode.node.id;
        var tpId = 9;
        if(nId.indexOf('_')>-1){
            nId = nId.replace('_','');
        }
        var singleData = null;
        this._oParent.oDrawTool.calDraw();
        this._oParent.oEditWnd;
        // 选择部门以上时，画所有返回的数据
        if(oNode.node.data.type <= 2){
            ES.getData({typeIds:tpId,districtId:nId}, m_getList,function(oData){
                self._oParent.fire('ES:CloudMap.DrawCtrlLayer', {aoData: oData[tpId]});
                self._oParent.fire('CloudMap:EditTool.calEdit');
                self._oParent.addDrawToUI();
            }, this, null,
                {
                    headers: {
                        token: m_oParam.token,
                        "Content-Type": 'application/json; charset=utf-8'
                    }
                });
        }else{
            //选择单条数据的时候进行筛选画单个国控点并显示编辑、删除按钮
            ES.getData({typeIds:tpId,districtId:nId}, m_getList,function(oData){
                for(var  i=0;i<oData[tpId].length;i++){
                    if(nId == oData[tpId][i].Id){
                        self._oParent.fire('ES:CloudMap.DrawCtrlLayer', {aoData: oData[tpId][i]});
                        self._oParent.fire('CloudMap:EditTool.edit', {oNode: oData[tpId][i]});
                        break;
                    }
                }
            }, this, null,
                {
                    headers: {
                        token: m_oParam.token,
                        "Content-Type": 'application/json; charset=utf-8'
                    }
                });
        }
    },

    cHtml:
    '<div class="ex-maptool-box ex-maptool-box-white ex-maptool-property ec-padding-0">' +
    '   <div class="ex-layout-sider ex-theme-tree ec-fl" style = "width:280px">' +
    '      <h3 class="ex-theme-sider-title">' +
    '          <i class="ec-icon-sitemap"></i>&nbsp;{cTitle}' +
    '       </h3>' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group">' +
    '               <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字"> </input>' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    '               </span>' +
    '           </div>' +
    '       </div>' +
    '       <div class="ex-layout-struckbox-content" style="height:350px;"></div>' +
    '   </div>' +
    '</div>',
});

/**
 * Created by liulin on 2017/6/1.
 */

ES.CloudMap.CityTreePanel = ES.CloudMap.BaseTreePanel.extend({

    initUI: function () {
        ES.CloudMap.BaseTreePanel.prototype.initUI.call(this);
    },
    selectDeal:function(oNode){
        if (!oNode || !oNode.node) {
            return;
        };
        var self = this;
        var nId = oNode.node.id;
        var tpId = 10;
        if(nId.indexOf('_')>-1){
            nId = nId.replace('_','');
        }
        this._oParent.oDrawTool.calDraw();
        // 选择部门以上时，画所有返回的数据
        if(oNode.node.data.type <= 2){
            ES.getData({typeIds:tpId,districtId:nId}, m_getList,function(oData){
                self._oParent.fire('ES:CloudMap.DrawCtrlLayer', {aoData: oData[tpId]});
                self._oParent.fire('CloudMap:EditTool.calEdit');
                self._oParent.addDrawToUI();
            }, this, null,
                {
                    headers: {
                        token: m_oParam.token,
                        "Content-Type": 'application/json; charset=utf-8'
                    }
                });
        }else{
            //选择单条数据的时候进行筛选画单个市控点并显示编辑、删除按钮
            ES.getData({typeIds:tpId,districtId:nId}, m_getList,function(oData){
                for(var  i=0;i<oData[tpId].length;i++){
                    if(nId == oData[tpId][i].Id){
                        self._oParent.fire('ES:CloudMap.DrawCtrlLayer', {aoData: oData[tpId][i]});
                        self._oParent.fire('CloudMap:EditTool.edit', {oNode: oData[tpId][i]});
                        break;
                    }
                }
            }, this, null,
                {
                    headers: {
                        token: m_oParam.token,
                        "Content-Type": 'application/json; charset=utf-8'
                    }
                });
        }
    },

    cHtml:
    '<div class="ex-maptool-box ex-maptool-box-white ex-maptool-property ec-padding-0">' +
    '   <div class="ex-layout-sider ex-theme-tree ec-fl" style = "width:280px">' +
    '      <h3 class="ex-theme-sider-title">' +
    '          <i class="ec-icon-sitemap"></i>&nbsp;{cTitle}' +
    '       </h3>' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group">' +
    '               <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字"> </input>' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    '               </span>' +
    '           </div>' +
    '       </div>' +
    '       <div class="ex-layout-struckbox-content" style="height:350px;"></div>' +
    '   </div>' +
    '</div>',
});


/**
 * Created by liulin on 2017/6/1.
 */


ES.CloudMap.GridTreePanel = ES.CloudMap.BaseTreePanel.extend({

    initUI: function () {

        ES.CloudMap.BaseTreePanel.prototype.initUI.call(this);

        $('input[type="checkbox"]').uCheck();//这是统一写法
        $('input[type="checkbox"].ec-ucheck-checkbox').uCheck();//这是根据class调用
    },
    // 获取选中树节点的子节点
    getTreeChildren:function(children, node, newArr) {
        let self = this
        for(var i = 0;i<children.length;i++) {
            var cNode = node.instance.get_node(children[i]);
            if (cNode.data.type == 1 && cNode.children.length == 0) {
                newArr.push(cNode.data.id)
            } else if (cNode.children.length > 0) {
                self.getTreeChildren(cNode.children, node, newArr)
            }
        }
        return newArr
    },

    selectDeal:function(oNode){
        if (!oNode || !oNode.node) {
            return;
        };
        var self = this;
        var newArr = new Array()
        var aoData = []
        var singleData = null;
        this._oParent.oDrawTool.calDraw();
        // 当前点击单条
        if(oNode.node.data.type == 1){
            aoData = [oNode.node.data.id]
            ES.getData(JSON.stringify({id: aoData}), m_getList, function (oData) {
                    var oTemp = this.oPopTree.$_oTree.get_node(oNode.node.parent);
                    oNode.node.parentText = oTemp.text;
                    for(var i = 0; i<oData.detail.length;i++){
                        if(oNode.node.data.id == oData.detail[i].code){
                            singleData = oData.detail[i];
                            break;
                        }
                    }
                    if(singleData){
                        self._oParent.fire('MapView:ShowLayer.DrawLayers', {aoData: [singleData]});
                        self._oParent.fire('CloudMap:EditTool.edit', {oNode: singleData});
                    }
                }, this, null,
                {
                    headers: {
                        token: m_oParam.token,
                        "Content-Type": 'application/json; charset=utf-8'
                    }
                });
        }else{
            //当前点击集合 传云图ID集合请求云图数据画地图
            if(oNode.node.children_d.length > 0){
                aoData = self.getTreeChildren(oNode.node.children_d, oNode, newArr)
            }
            ES.getData(JSON.stringify({id: aoData}), m_getList, function (oData) {

                    self._oParent.fire('MapView:ShowLayer.DrawLayers', {aoData: oData.oData.detail});
                    self._oParent.fire('CloudMap:EditTool.calEdit');
                    self._oParent.addDrawToUI();
                }, this, {},
                {
                    headers: {
                        token: m_oParam.token,
                        "Content-Type": 'application/json; charset=utf-8'
                    }
                });
        }
    },

    cHtml:
    '<div class="ex-maptool-box ex-maptool-box-white ex-maptool-property ec-padding-0">' +
    '   <div class="ex-layout-sider ex-theme-tree ec-fl" style = "width:280px">' +
    '       <h3 class="ex-theme-sider-title">' +
    '           <i class="ec-icon-sitemap"></i>&nbsp;{cTitle}' +
    '       </h3>' +
    '       <div class="ex-layout-struckbox-search">' +
    '           <div class="ec-input-group">' +
    '               <input type="text" class="ec-form-field ex-tree-search-ipt" placeholder="请输入关键字"> </input>' +
    '               <span class="ec-input-group-btn">' +
    '                   <button class="ec-btn ec-btn-secondary ec-btn-xs ex-tree-search-btn" type="button"><span class="ec-icon-search"></span></button>' +
    '               </span>' +
    '           </div>' +
    '       </div>' +
    '       <div class="ex-layout-struckbox-content" style="height:350px;"></div>' +
    '   </div>' +
    '</div>',
});


/**
 * Created by liulin on 2017/6/1.
 */


ES.CloudMap.DrawLineTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画线路</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);

        this.initPen();

        this.initOn();

        this.initUI();


    },

    // 点击callback
    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this );

        var self =this;
        this.$_oLi.find('button').bind('click', function () {

            // 开启
            self.oPen.handler.enable();
            self._oMap.once('draw:created', self.createdCallBack, self);

        });
    },

    // 画点
    initPen: function () {
        this.oPen = {
            enabled: {},
            handler: new L.Draw.Polyline(this._oMap, {}),
            title: ''
        }
    },

    calDraw:function(){
        if(this.oPen){
            this.oPen.handler.disable();
        }

    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

    },

    //initMapEvent: function () {
    //
    //    var self = this;
    //
    //    //this._oMap.on('draw:created', this.createdCallBack, this);
    //},




    createdCallBack:function(e){
        var oLayer = e.layer;

        this._oParent.addLayer(oLayer);

        var aoLatLng = oLayer.getLatLngs();

        var aoTemp = aoLatLng.map(function (oItem) {

            return {lat: oItem.lat, lng: oItem.lng}
        });

        var oInfo = {
            aoLatLng: aoTemp,
            oOption: {},
        };

        var oPos = this._oMap.latLngToLayerPoint(aoTemp[0]);

        this._oParent.fire('CloudMap:PopWnd.show', {oInfo: oInfo, oPos: oPos});
    }


});


/**
 * Created by liulin on 2017/6/1.
 */


ES.CloudMap.EditLineTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>编 辑</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);
        this._oDrawLayer =oParent.getDrawLayer();
        this.oPen = null;

        this.initPen();
    },

    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this);
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPen.handler.enable();
            self._oParent.addSaveACalToUI();

        });
    },

    //  画点
    initPen: function () {
        this.oPen = {
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
            title: ''
        }
    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

        this._oParent.on('CloudMap:EditTool.calEdit',this.calEdit,this);
        this._oParent.on('CloudMap:EditTool.edit',this.edit,this);
        this._oParent.on('CloudMap:EditTool.SaveEdit',this.saveEdit,this);

        var self =this;
        this._oMap.on('draw:edited', function (e) {
            if(!self._oParent.getActive()){
                return
            }
            var oMap = this;
            var aoLayer = e.layers;

            aoLayer.eachLayer(function (oLayer) {

                var aoLatLng = oLayer.getLatLngs().map(function (oItem) {
                    return {lat:oItem.lat,lng:oItem.lng};
                });

                var oInfo = {
                    aoLatLng: aoLatLng,
                    oOption: {},
                };

                self._oDrawLayer.addLayer(oLayer);

                // 弹出层显示的位置信息
                var oPos = oMap.latLngToLayerPoint(aoLatLng[0]);

                // 告诉外面弹出层的位置
                self._oParent.fire('CloudMap:PopWnd.editShow', {
                    oInfo: oInfo,
                    oPos: oPos,
                    oBusData:oLayer.oBusData
                });
            });
        });
    },

    // 保存编辑
    saveEdit: function () {
        this.oPen.handler.save();
        this.oPen.handler.disable();

    },

    // 取消编辑
    calEdit: function () {
        this.oPen.handler.revertLayers();
        this.oPen.handler.disable();
    },

    // 编辑数据
    edit: function (oVal) {

        this._oParent.clearLayers();

        if (!oVal  || !oVal.oNode) {
            return ;
        }

        var oVehLine = this.createLayer(oVal.oNode);

        if(!oVehLine){
            return;
        }

        // 编辑围栏数据,画围栏时要表明自己的名称
        //var oVehLine = L.marker(oVal.oNode.data,{});
        oVehLine.edited = true;

        this.fitBound();

        var oData = {
            oLatLng: oVal.oNode.MapJson,
            cId: oVal.oNode.Id,
            cName: oVal.oNode.CloudName,
            cParentId:oVal.oNode.DeptId,
            cParentText :oVal.oNode.DeptName,
        }
        oVehLine.cId = oVal.oNode.Id;
        oVehLine.oBusData = oData;
        oVehLine.addTo(this._oDrawLayer);

        this._oParent.addEditToUI();
    },

    // 多边形定位到地图中间
    fitBound: function () {
        if (!this._oDrawLayer) {
            return;
        }
        var oBound = this._oDrawLayer.getBounds();
        this._oMap.fitBounds(oBound);
    },

    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData || !oData.mapJson) return oVehLine;

        var oTemp = null;

        try {
            oTemp = JSON.parse(oData.mapJson);
            oTemp.oOption = this.oPenStyle;
        } catch (e) {
            oTemp = null;
        }
        if (!oTemp) {
            return oVehLine;
        }
        oVehLine = L.polyline(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        return oVehLine;
    },
});

/**
 * Created by liulin on 2017/6/1.
 */

ES.CloudMap.DrawMarkerTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画国(市)控点</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);

        this.initPen();

        this.initOn();

        this.initUI();
    },

    // 点击callback
    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this );

        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPen.handler.enable();

            self._oMap.once('draw:created', self.createdCallBack, self);

        });
    },

    // 画点
    initPen: function () {
        this.oPen = {
            enabled: {},
            handler: new L.Draw.Marker(this._oMap, {}),
            title: ''
        }
    },

    calDraw:function(){
        if(this.oPen){
            this.oPen.handler.disable();
        }
    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);
    },

    createdCallBack: function (e) {

        var oLayer = e.layer;

        this._oParent.addLayer(oLayer);

        var oLatLng = oLayer.getLatLng();


        var oInfo = {
            aoLatLng: [{lat: oLatLng.lat, lng: oLatLng.lng}],
            oOption: {},
        };

        var oPos = this._oMap.latLngToLayerPoint(oLatLng);

        this._oParent.fire('CloudMap:PopWnd.show', {oInfo: oInfo, oPos: oPos});

    },
});

/**
 * Created by liulin on 2017/6/1.
 */


ES.CloudMap.EditMarkerTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>编 辑</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);
        this._oDrawLayer =oParent.getDrawLayer();
        this.oPen = null;

        this.initPen();

    },


    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this);
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPen.handler.enable();
            self._oParent.addSaveACalToUI();
        });
    },

    //  画点
    initPen: function () {
        this.oPen = {
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
            title: ''
        }
    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

        this._oParent.on('CloudMap:EditTool.calEdit',this.calEdit,this);
        this._oParent.on('CloudMap:EditTool.edit',this.edit,this);
        this._oParent.on('CloudMap:EditTool.SaveEdit',this.saveEdit,this);

        var self =this;
        this._oMap.on('draw:edited', function (e) {
            if(!self._oParent.getActive()){
                return
            }
            var oMap = this;
            var aoLayer = e.layers;

            aoLayer.eachLayer(function (oLayer) {

                var oLatLng = oLayer.getLatLng() ;


                var oInfo = {
                    aoLatLng: [{lat:oLatLng.lat,lng:oLatLng.lng}],
                    oOption: {},
                };

                self._oDrawLayer.addLayer(oLayer);

                // 弹出层显示的位置信息
                var oPos = oMap.latLngToLayerPoint(oLatLng);

                // 告诉外面弹出层的位置
                self._oParent.fire('CloudMap:PopWnd.editShow', {
                    oInfo: oInfo,
                    oPos: oPos,
                    oBusData:oLayer.oBusData
                });
            });
        });
    },



    // 保存编辑
    saveEdit: function () {
        this.oPen.handler.save();
        this.oPen.handler.disable();

    },

    // 取消编辑
    calEdit: function () {
        this.oPen.handler.revertLayers();
        this.oPen.handler.disable();
    },

    // 编辑数据
    edit: function (oVal) {

        this._oParent.clearLayers();

        if (!oVal  || !oVal.oNode) {
            return ;
        }

        var oVehLine = this.createLayer(oVal.oNode);

        if(!oVehLine){
            return;
        }

        // 编辑围栏数据,画围栏时要表明自己的名称
        //var oVehLine = L.marker(oVal.oNode.data,{});
        oVehLine.edited = true;

        this.fitBound();

        // var oData = {
        //     oLatLng: oVal.oNode.data,
        //     cId: oVal.oNode.id,
        //     cName: oVal.oNode.text,
        //     cParentId:oVal.oNode.parent,
        //     cParentText :oVal.oNode.parentText,
        // }
        // oVehLine.cId = oVal.oNode.Id;
        // oVehLine.oBusData = oData;
        // oVehLine.addTo(this._oDrawLayer);
        //
        // this._oParent.addEditToUI();

        var oData = {
            oLatLng: oVal.oNode.MapJson,
            cId: oVal.oNode.Id,
            cName: oVal.oNode.CloudName,
            cParentId:oVal.oNode.DeptId,
            cParentText :oVal.oNode.DeptName,
        }
        oVehLine.cId = oVal.oNode.Id;
        oVehLine.oBusData = oData;
        oVehLine.addTo(this._oDrawLayer);

        this._oParent.addEditToUI();
    },

    // 多边形定位到地图中间
    fitBound: function () {
        if (!this._oDrawLayer) {
            return;
        }
        var oBound = this._oDrawLayer.getBounds();
        this._oMap.fitBounds(oBound);
    },

    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData) return oVehLine;

        var oTemp = null;

        try {
            oTemp = JSON.parse(oData.MapJson);
            oTemp.oOption = this.oPenStyle;
        } catch (e) {
            oTemp = null;
        }
        if (!oTemp) {
            return oVehLine;
        }
        oVehLine = L.marker(oTemp.aoLatLng[0], oTemp.oOption).addTo(this._oDrawLayer);

        //switch (oData.MapType) {
        //    case 1:
        //        oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 2:
        //        // 计算2个点的距离，在来画圆
        //        var dDis = L.latLng(oTemp.aoLatLng[0]).distanceTo(L.latLng(oTemp.aoLatLng[1]))
        //        oVehLine = L.circle(oTemp.aoLatLng[0], dDis, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 3:
        //        oVehLine = L.rectangle(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 4:
        //        oVehLine = L.polyline(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 5:
        //        oVehLine = L.marker(oTemp.aoLatLng[0], oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    default :
        //        oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //}
        return oVehLine;
    },

});



/**
 * Created by liulin on 2017/3/17.
 *
 */

ES.CloudMap.DeleteTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>删除</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this, oParent, options);
    },


    // 绑定事件
    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this);

        var self = this;
        this.$_oLi.find('button').bind('click', function () {
            // 获得数据
            var aoLayer = self._oParent.getLayer();
            if (!aoLayer || aoLayer.length <= 0) {
                ES.aWarn('没有可以删除的数据');
                return;
            }
            // self._oParent.fire('CloudMap:DelCloudMap.del', {oBusData: {Id: parseInt(aoLayer[0].oBusData.cId)}});
            self._oParent.fire('CloudMap:DelCloudMap.del',  {oBusData: aoLayer[0].oBusData});
            // self._oParent.fire('CloudMap:DelCloudMap.del', {Id: parseInt(aoLayer[0].oBusData.cId)});
        });
    },

});

/**
 * 国控点菜单
 *
 * Created by liulin on 2017/6/1.
 *
 */

// 菜单项 站点,一个菜单管理面板、操作、弹出层
ES.CloudMap.NationalCtrlMenu = ES.CloudMap.BaseMenu.extend({

    cHtml:'<li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1"><i class="ec-icon-th-large"></i></button><p> 国控点 </p></li>',

    initialize: function (oParent, oOption) {

        ES.CloudMap.BaseMenu.prototype.initialize.call(this,oParent, oOption);

        this.initPenal();
        this.initEditTool();
        this.initDrawTool();
        this.initPopWnd();
        this.initSaveACalTool();
        this.oCtrlLayer = new ES.CloudMap.MarkerLayer(this, {});
    },

    initOn: function () {
        ES.CloudMap.BaseMenu.prototype.initOn.call(this);

        var self =this;

        this._oMap.on('moveend', function (e) {

            if(!self.getActive())
            {
               return;
            }

            var aoLayer = self._oDrawLayer.getLayers();
            if(!aoLayer ||aoLayer.length<=0){
                return;
            }

            // 要判断是否有这个分发

            var oPos = this.latLngToLayerPoint(aoLayer[0].getLatLng());

            self.fire('CloudMap:PopWnd.setPos', {oPos:oPos});
        });
    },


    endMenu: function () {
        if (this.oEditTool) {
            this.oEditTool.calEdit();
        }
        if (this.oDrawTool) {
            this.oDrawTool.calDraw();
        }

        this.clearLayers();
    }
});


// 管理面板
ES.CloudMap.NationalCtrlMenu.include({

    // 树面板 通用
    initPenal: function () {

        this.oPenal = new ES.CloudMap.LineTreePanel(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': function (obj, callback) {
                    var self = this;
                    var oReqParam = {
                        type: 'POST',
                        'url': m_Url + '/base/tree',
                        headers: {
                            token: m_oParam.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        },
                        dataType: 'json',
                        data: '{"tree":"cloudMapRegionTree"}',
                        success: function (oData) {
                            callback.call(self, oData.detail);
                        },
                        error: function () {
                            callback.call(self, null);
                        },
                    }
                    $.ajax(oReqParam);

                }

            },
            plugins: ['types', 'search', 'unique']
        });
    },

    hidePenal: function () {
        this.oPenal.hide();
    },
});


// 对图形进行编辑、删除操作
ES.CloudMap.NationalCtrlMenu.include({

    // 树面板
    initEditTool:function(){

        this.oEditTool = new ES.CloudMap.EditMarkerTool(this,{oDrawLayer: this._oDrawLayer});
        this.oDelTool = new ES.CloudMap.DeleteTool(this,{});

        // 编辑
        this.aoEditTool.push(this.oEditTool);
        // 取消编辑
        this.aoEditTool.push(this.oDelTool);
    },

    // 添加到UI
    addEditToUI:function() {
        if (!this.oPContainer || this.aoEditTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoEditTool.length; i++) {
            this.oPContainer.appendTool(this.aoEditTool[i]);
            this.aoEditTool[i].bandClick();
        }
    },
});

// 对图形进行绘制
ES.CloudMap.NationalCtrlMenu.include({

    // 树面板
    initDrawTool:function() {
        this.oDrawTool = new ES.CloudMap.DrawMarkerTool(this, {})
        this.aoDrawTool.push(this.oDrawTool);
    },

    // 添加到UI
    addDrawToUI:function() {
        if (!this.oPContainer || this.aoDrawTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();

        for (var i = 0; i < this.aoDrawTool.length; i++) {
            this.oPContainer.appendTool(this.aoDrawTool[i]);
            this.aoDrawTool[i].bandClick();
        }
    },

});

// 对图形进行保存和取消
ES.CloudMap.NationalCtrlMenu.include({

    // 树面板
    initSaveACalTool:function(){
        this.oSaveTool = new ES.CloudMap.SaveTool(this,{oDrawLayer: this._oDrawLayer});
        this.oCalTool =  new ES.CloudMap.CalEditTool(this,{});

        this.aoSaveACalTool.push( this.oSaveTool );
        this.aoSaveACalTool.push( this.oCalTool );
    },

    // 添加到UI
    addSaveACalToUI:function() {

        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoSaveACalTool.length; i++) {
            this.oPContainer.appendTool(this.aoSaveACalTool[i]);
            this.aoSaveACalTool[i].bandClick();
        }
    },



});

// 弹出层的基本操作
ES.CloudMap.NationalCtrlMenu.include({

    // 树面板 新增 弹出层
    initPopWnd:function() {

        this.oEditWnd = new ES.CloudMap.MarkerWnd(this, {
            oOffset: {nW: 10, nH: 80},
            cContainerSel: this._oParent.getMap()._mapPane
        });
        this.oDelWnd = new ES.CloudMap.DelWnd(this, { cUrl: '/CloudMap/Delete',}, {
            title: '删除操作-国控点',
            cancelValue: '取消',
            content: '是否要删除数据！',

        });
        //this.oDelWnd.initOn();

        this.aoPopWnd.push(this.oEditWnd);
        this.aoPopWnd.push(this.oDelWnd);
    },

});


/**
 * Created by liulin on 2017/6/1.
 */

ES.CloudMap.RegionCtrlMenu = ES.CloudMap.BaseMenu.extend({

    cHtml:'<li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1"><i class="ec-icon-th-large"></i></button><p> 市控点 </p></li>',

    initialize: function (oParent, oOption) {

        ES.CloudMap.BaseMenu.prototype.initialize.call(this,oParent, oOption);

        this.initPenal();
        this.initEditTool();
        this.initDrawTool();
        this.initPopWnd();
        this.initSaveACalTool();
        this.oRegionLayer = new ES.CloudMap.MarkerLayer(this, {});
    },

    initOn: function () {
        ES.CloudMap.BaseMenu.prototype.initOn.call(this);

        var self =this;

        this._oMap.on('moveend', function (e) {

            if(!self.getActive())
            {
                return;
            }

            var aoLayer = self._oDrawLayer.getLayers();
            if(!aoLayer ||aoLayer.length<=0){
                return;
            }

            // 要判断是否有这个分发

            var oPos = this.latLngToLayerPoint(aoLayer[0].getLatLng());

            self.fire('CloudMap:PopWnd.setPos', {oPos:oPos});
        });
    },

    endMenu: function () {
        if (this.oEditTool) {
            this.oEditTool.calEdit();
        }
        if (this.oDrawTool) {
            this.oDrawTool.calDraw();
        }

        this.clearLayers();
    }
});

// 管理面板
ES.CloudMap.RegionCtrlMenu.include({

    // 树面板 通用
    initPenal: function () {

        this.oPenal = new ES.CloudMap.LineTreePanel(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': function (obj, callback) {
                    var self = this;
                    var oReqParam = {
                        type: 'POST',
                        'url': m_Url + '/base/tree',
                        headers: {
                            token: m_oParam.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        },
                        dataType: 'json',
                        data: '{"tree":"cloudMapRegionTree"}',
                        success: function (oData) {
                            callback.call(self, oData.detail);
                        },
                        error: function () {
                            callback.call(self, null);
                        },
                    }
                    $.ajax(oReqParam);

                }

            },
            plugins: ['types', 'search', 'unique']
        });
    },

    hidePenal: function () {
        this.oPenal.hide();
    },
});

// 对图形进行编辑、删除操作
ES.CloudMap.RegionCtrlMenu.include({

    // 树面板
    initEditTool:function(){

        this.oEditTool = new ES.CloudMap.EditMarkerTool(this,{oDrawLayer: this._oDrawLayer});
        this.oDelTool = new ES.CloudMap.DeleteTool(this,{});

        // 编辑
        this.aoEditTool.push(this.oEditTool);
        // 取消编辑
        this.aoEditTool.push(this.oDelTool);
    },

    // 添加到UI
    addEditToUI:function() {
        if (!this.oPContainer || this.aoEditTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoEditTool.length; i++) {
            this.oPContainer.appendTool(this.aoEditTool[i]);
            this.aoEditTool[i].bandClick();
        }
    },
});

// 对图形进行绘制
ES.CloudMap.RegionCtrlMenu.include({

    // 树面板
    initDrawTool:function() {
        this.oDrawTool = new ES.CloudMap.DrawMarkerTool(this, {})
        this.aoDrawTool.push(this.oDrawTool);
    },

    // 添加到UI
    addDrawToUI:function() {
        if (!this.oPContainer || this.aoDrawTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();

        for (var i = 0; i < this.aoDrawTool.length; i++) {
            this.oPContainer.appendTool(this.aoDrawTool[i]);
            this.aoDrawTool[i].bandClick();
        }
    },
});

// 对图形进行保存和取消
ES.CloudMap.RegionCtrlMenu.include({

    // 树面板
    initSaveACalTool:function(){
        this.oSaveTool = new ES.CloudMap.SaveTool(this,{oDrawLayer: this._oDrawLayer});
        this.oCalTool =  new ES.CloudMap.CalEditTool(this,{});

        this.aoSaveACalTool.push( this.oSaveTool );
        this.aoSaveACalTool.push( this.oCalTool );
    },

    // 添加到UI
    addSaveACalToUI:function() {

        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoSaveACalTool.length; i++) {
            this.oPContainer.appendTool(this.aoSaveACalTool[i]);
            this.aoSaveACalTool[i].bandClick();
        }
    },
});

// 弹出层的基本操作
ES.CloudMap.RegionCtrlMenu.include({

    // 树面板 新增 弹出层
    initPopWnd:function() {

        this.oEditWnd = new ES.CloudMap.RegionMarkerWnd(this, {
            oOffset: {nW: 10, nH: 80},
            cContainerSel: this._oParent.getMap()._mapPane
        });

        this.oDelWnd = new ES.CloudMap.DelWnd(this, { cUrl: '/CloudMap/Delete',}, {
            title: '删除操作-市控点',
            cancelValue: '取消',
            content: '是否要删除数据！',

        });
        //this.oDelWnd.initOn();
        this.aoPopWnd.push(this.oEditWnd);
        this.aoPopWnd.push(this.oDelWnd);
    },

});

/**
 * 站场菜单说明
 * Created by Administrator on 2017/8/2.
 */

// 菜单项 站点,一个菜单管理面板、操作、弹出层
ES.CloudMap.SiteMenu = ES.CloudMap.BaseMenu.extend({

    cHtml:'<li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1"><i class="ec-icon-th-large"></i></button><p> 绘制站场 </p></li>',

    initialize: function (oParent, oOption) {

        ES.CloudMap.BaseMenu.prototype.initialize.call(this, oParent, oOption);

        this.initPenal();
        this.initEditTool();
        this.initDrawTool();
        this.initPopWnd();
        this.initSaveACalTool();

        this.oLineLayer = new ES.CloudMap.SiteLayer(this, {});

        //this.oCtrlLayer = new ES.CloudMap.MarkerLayer(this, {});
        //
        //this.oCityCtrlLayer = new ES.CloudMap.MarkerLayer(this, {
        //    onEventDrawLayers: 'ES:CloudMap.DrawCityCtrlLayer',
        //    onEventClearLayers: 'ES:CloudMap.ClearCityCtrlLayer',
        //    onEventRemoveLayers: 'ES:CloudMap.RemoveCityCtrlLayer',
        //    cIcon:'/Asset/img/ex_default/citycontrol_big_icon.png',});
    },

    initOn: function () {
        ES.CloudMap.BaseMenu.prototype.initOn.call(this);

        var self = this;

        this._oMap.on('moveend', function (e) {
            if (!self.getActive()) {
                return;
            }
            var aoLayer = self._oDrawLayer.getLayers();
            if (!aoLayer || aoLayer.length <= 0) {
                return;
            }
            var nLen = aoLayer[0].getLatLngs()[0].length;
            var oPos = this.latLngToLayerPoint(aoLayer[0].getLatLngs()[0][nLen-1]);

            self.fire('CloudMap:PopWnd.setPos', {oPos: oPos});
        });
    },


    endMenu: function () {
        if (this.oEditTool) {
            this.oEditTool.calEdit();
        }
        if (this.oDrawTool) {
            this.oDrawTool.calDraw();
        }

        this.clearLayers();
    }
});


// 管理面板
ES.CloudMap.SiteMenu.include({

    // 树面板
    initPenal: function () {
        this.oPenal = new ES.CloudMap.SiteTreePanel(this,
            {
                nHeight: this.oOption.nTreePanelHeight,
                nWidth: this.oOption.nTreePanelWidth,
            },
            this.oOption.oTreePanelUrl);
    },

    hidePenal: function () {
        this.oPenal.hide();
    },
});

// 对图形进行编辑、删除操作
ES.CloudMap.SiteMenu.include({

    // 树面板
    initEditTool:function(){

        this.oEditTool = new ES.CloudMap.EditSiteTool(this,{oDrawLayer: this._oDrawLayer});
        this.oDelTool = new ES.CloudMap.DeleteTool(this,{});
        // 编辑
        this.aoEditTool.push(this.oEditTool);
        // 取消编辑
        this.aoEditTool.push(this.oDelTool);
    },

    // 添加到UI
    addEditToUI:function() {
        if (!this.oPContainer || this.aoEditTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoEditTool.length; i++) {
            this.oPContainer.appendTool(this.aoEditTool[i]);
            this.aoEditTool[i].bandClick();
        }
    },
});

// 对图形进行绘制
ES.CloudMap.SiteMenu.include({

    // 树面板
    initDrawTool:function() {
        this.oDrawTool = new ES.CloudMap.DrawSiteTool(this, {})
        this.aoDrawTool.push(this.oDrawTool);
    },

    // 添加到UI
    addDrawToUI:function() {
        if (!this.oPContainer || this.aoDrawTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();

        for (var i = 0; i < this.aoDrawTool.length; i++) {
            this.oPContainer.appendTool(this.aoDrawTool[i]);
            this.aoDrawTool[i].bandClick();
        }
    },

});

// 对图形进行保存和取消
ES.CloudMap.SiteMenu.include({

    // 树面板
    initSaveACalTool:function(){
        this.oSaveTool = new ES.CloudMap.SaveTool(this,{oDrawLayer: this._oDrawLayer});
        this.oCalTool =  new ES.CloudMap.CalEditTool(this,{});

        this.aoSaveACalTool.push( this.oSaveTool );
        this.aoSaveACalTool.push( this.oCalTool );
    },

    // 添加到UI
    addSaveACalToUI:function() {

        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoSaveACalTool.length; i++) {
            this.oPContainer.appendTool(this.aoSaveACalTool[i]);
            this.aoSaveACalTool[i].bandClick();
        }
    },
});

// 弹出层的基本操作
ES.CloudMap.SiteMenu.include({

    // 树面板 新增 弹出层
    initPopWnd:function() {

        this.oEditWnd = new ES.CloudMap.SiteWnd(this, {
            //弹出点相对位移
            oOffset: {nW: 10, nH: 30},
            cContainerSel: this._oParent.getMap()._mapPane
        },this.oOption.oTreePopUrl);

        this.oDelWnd = new ES.CloudMap.DelWnd(this, { cUrl: '/Line/Delete',}, {
            title: '删除操作-线路',
            cancelValue: '取消',
            content: '是否要删除数据！',

        });
        this.aoPopWnd.push(this.oEditWnd);
        this.aoPopWnd.push(this.oDelWnd);
    },

});

/**
 *
 * Boss 画网格
 *
 * Created by liulin on 2017/4/24.
 *
 */

// 菜单项 站点,一个菜单管理面板、操作、弹出层
ES.CloudMap.GridMenu = ES.CloudMap.BaseMenu.extend({

    cHtml:'<li><button class="ec-btn ec-btn-secondary ec-circle" data-flag="Grid"  data-tab-index="1"><i class="ec-icon-th-large"></i></button><p>区域</p></li>',

    initialize: function (oParent, oOption) {

        ES.CloudMap.BaseMenu.prototype.initialize.call(this,oParent, oOption);

        this.initPenal();
        this.initEditTool();
        this.initDrawTool();
        this.initPopWnd();
        this.initSaveACalTool();

        this.oLineLayer = new ES.CloudMap.MuckEPGridLayer(this, {});
    },

    initOn: function () {
        ES.CloudMap.BaseMenu.prototype.initOn.call(this);

        var self =this;

        this._oMap.on('moveend', function (e) {
            var aoLayer = self._oDrawLayer.getLayers();
            if(!aoLayer ||aoLayer.length<=0){
                return;
            }
            var nG = null
            if(aoLayer[0].getLatLngs()[0][0]){
                nG = aoLayer[0].getLatLngs()[0][0]
            }else{
                nG = aoLayer[0].getLatLngs()[0]
            }
            var oPos = this.latLngToLayerPoint(nG);

            self.fire('CloudMap:PopWnd.setPos', {oPos:oPos});
        });
    },


    endMenu: function () {
        if (this.oEditTool) {
            this.oEditTool.calEdit();
        }
        if (this.oDrawTool) {
            this.oDrawTool.calDraw();
        }

        this.clearLayers();
    }
});


// 管理面板
ES.CloudMap.GridMenu.include({

    // 树面板
    initPenal: function () {

        this.oPenal = new ES.CloudMap.GridTreePanel(this, {}, {
            core: {
                'animation': 0,
                'check_callback': true,

                'state': {'opened': true},
                'data': function (obj, callback) {
                    var self = this;
                    var oReqParam = {
                        type: 'POST',
                        'url': m_Url + '/base/tree',
                        headers: {
                            token: m_oParam.token,
                            "Content-Type": 'application/json; charset=utf-8'
                        },
                        dataType: 'json',
                        data: '{"tree":"cloudMapRegionTree"}',
                        success: function (oData) {
                            callback.call(self, oData.detail);
                        },
                        error: function () {
                            callback.call(self, null);
                        },
                    }
                    $.ajax(oReqParam);

                }

            },
            plugins: ['types', 'search', 'unique']
        });
    },

    hidePenal: function () {
        this.oPenal.hide();
    },
});


// 对图形进行编辑、删除操作
ES.CloudMap.GridMenu.include({

    // 树面板
    initEditTool:function(){

        this.oEditTool = new ES.CloudMap.GridEditTool(this,{oDrawLayer: this._oDrawLayer});
        this.oDelTool = new ES.CloudMap.DeleteTool(this,{});
        // 编辑
        this.aoEditTool.push(this.oEditTool);
        // 取消编辑
        this.aoEditTool.push(this.oDelTool);
    },

    // 添加到UI
    addEditToUI:function() {
        if (!this.oPContainer || this.aoEditTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoEditTool.length; i++) {
            this.oPContainer.appendTool(this.aoEditTool[i]);
            this.aoEditTool[i].bandClick();
        }
    },
});

// 对图形进行绘制
ES.CloudMap.GridMenu.include({

    // 树面板
    initDrawTool:function() {
        this.oDrawTool = new ES.CloudMap.DrawGridTool(this, {})
        this.aoDrawTool.push(this.oDrawTool);
    },

    // 添加到UI
    addDrawToUI:function() {
        if (!this.oPContainer || this.aoDrawTool.length <= 0) {
            return;
        }
        this.oPContainer.clearTool();

        for (var i = 0; i < this.aoDrawTool.length; i++) {
            this.oPContainer.appendTool(this.aoDrawTool[i]);
            this.aoDrawTool[i].bandClick();
        }
    },

});

// 对图形进行保存和取消
ES.CloudMap.GridMenu.include({

    // 树面板
    initSaveACalTool:function(){
        this.oSaveTool = new ES.CloudMap.SaveTool(this,{oDrawLayer: this._oDrawLayer});
        this.oCalTool =  new ES.CloudMap.CalEditTool(this,{});

        this.aoSaveACalTool.push( this.oSaveTool );
        this.aoSaveACalTool.push( this.oCalTool );
    },

    // 添加到UI
    addSaveACalToUI:function() {

        this.oPContainer.clearTool();
        for (var i = 0; i < this.aoSaveACalTool.length; i++) {
            this.oPContainer.appendTool(this.aoSaveACalTool[i]);
            this.aoSaveACalTool[i].bandClick();
        }
    },



});

// 弹出层的基本操作
ES.CloudMap.GridMenu.include({

    // 树面板 新增 弹出层
    initPopWnd:function() {

        this.oEditWnd = new ES.CloudMap.GridWnd(this, {
            oOffset: {nW: 10, nH: 80},
            cContainerSel: this._oParent.getMap()._mapPane
        },this.oOption.oTreePopUrl);
        this.oDelWnd = new ES.CloudMap.DelGridWnd(this, { cUrl: m_deletePostUrl,}, {
            title: '删除操作-区域',
            cancelValue: '取消',
            content: '是否要删除数据！',

        });

        this.aoPopWnd.push(this.oEditWnd);
        this.aoPopWnd.push(this.oDelWnd);
    },

});

ES.CloudMap.DelGridWnd = ES.Common.DialogDel.extend({
    initOn: function () {
        this._oParent.on('CloudMap:DelCloudMap.del', this.del, this);
    },
    save: function () {
        if (!this.oBusData) {
            ES.aWarn(ES.Lang.BaseDialog[30]);
            return;
        }

        ES.loadAn($(this.oDialog.node));
        ES.getData(JSON.stringify({code:this.oBusData.oBusData.cCode}), this.oOption.cUrl, this.saveHandler, this,null,
            {
                headers: {
                    token: m_oParam.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });
    },

    saveHandler: function (oData) {
        ES.removeAn($(this.oDialog.node));

        if (oData && oData.code == 1) {
            ES.aSucess(ES.Common.Lang[32]);
            this._oParent.fire('PostPosTreeView.reflesh');
            this._oParent.clearLayers();
            this._oParent.fire('CloudMap:EditTool.calEdit');
            this._oParent.addDrawToUI();
        }
        else {
            ES.aErr(ES.template(ES.Common.Lang[33], oData));
        }

        this.oDialog.close();
    },

});





/**
 * 线图层，环保线路
 * Created by liulin on 2017/6/27.
 */


ES.CloudMap.LineLayer = L.MapLib.MapMaster.MapOpr.extend({
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
        this._oParent.on('CloudMap:LineLayer.reflesh', this.reflesh, this);

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

        this.clearLayer();

        if (!oData || !oData.aoData) {
            return;
        }

        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {
            var oLayer = this.findLayer(this._oPolylineGroup, oData.aoData[i].Id);
            if (oLayer) {
                continue;
            }
            this.drawLayer(oData.aoData[i]);

        }

        this._oMap.fitBounds(  this._oPolylineGroup.getBounds());

    },

    // 刷新线路信息数据
    reflesh: function (oData) {
        var oLayer = this.findLayer(this._oPolylineGroup, oData.Id);
        if (oLayer) {
            this._oPolylineGroup.removeLayer(oLayer);
        }

        this.drawLayer(oData);


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
        oVehLine.cName  = oData.cloudName;
    },

    // 设置图层设置
    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData) {
            return oVehLine;
        }
        if(oData.mapJson){
            var oParam = JSON.parse(oData.mapJson);
        }else if(oData.gpsPoint){
            var oParam = JSON.parse(oData.gpsPoint);
        }

        var aoLatLng =oParam.aoLatLng;
        // 为了显示汉字正确性，对线路进行优化显示
        if(!oParam.aoLatLng || oParam.aoLatLng.length>1) {

            if (oParam.aoLatLng[0].lng > oParam.aoLatLng[oParam.aoLatLng.length - 1].lng) {
                aoLatLng = [];
                for (var i = oParam.aoLatLng.length - 1; i >= 0; i--) {

                    aoLatLng.push(oParam.aoLatLng[i]);
                }
            }
        }

        oVehLine = L.polyline(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);

        // oVehLine.setText( oData.CloudName + '          ', {
        //     repeat: true,
        //     offset: 20,
        //     attributes: {'font-size': '14', fill: 'red'}
        // });
        return oVehLine;
    },
});

/**
 * Created by liulin on 2017/3/17.
 *
 * 只负责编辑点，需要地图控件
 */



ES.CloudMap.MarkerLayer = L.MapLib.MapMaster.MapOpr.extend({

    //执行画点，画线操作
    oOption: {
        onEventDrawLayers: 'ES:CloudMap.DrawCtrlLayer',

        onEventClearLayers: 'ES:CloudMap.ClearCtrlLayer',

        onEventRemoveLayers: 'ES:CloudMap.RemoveCtrlLayer',

        cIcon:'/Asset/img/ex_default/i_nationop_big_icon.png',

        cCityIcon:'/Asset/img/ex_default/i_cityop_big_icon.png',

        cHtml:
        '<div class="ex-monitor-mapicon-pin  {icon} ">' +
        '   <i></i>' +
        '   <div class="pin-tip">' +
        '       <div class="pin-dome"></div>' +
        '       <div class="pin-number">{name}</div>' +
        '   </div>' +
        '</div>'
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
        this._oCtrlGroup = L.featureGroup();
        this._oMap.addLayer(this._oCtrlGroup);
    },

    //初始化时加载数据
    _loadOn: function () {

        //this._oParent.fire('MV:Site.setSiteData', { aoSiteInfo: oData });
        //给界面赋值，并画工地
        this._oParent.on(this.oOption.onEventDrawLayers, this.drawLayers, this);

        // 清除工地
        this._oParent.on(this.oOption.onEventClearLayers, this.clearAll, this);


    },

    clearAll: function () {
        // 清空数据
        this._oCtrlGroup.clearLayers();
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function (oData) {

        this.clearAll();

        if (!oData || !oData.aoData) {
            return;
        }

        if(oData.aoData.length && oData.aoData.length >0){
            var aoLatLnt = [];
            for (var i = 0; i < oData.aoData.length; i++) {
                var oLayer = this.findLayer(this._oCtrlGroup, oData.aoData[i].Id);
                if (oLayer) {
                    continue;
                }
                this.drawLayer(oData.aoData[i]);
            }

            // this._oMap.fitBounds(this._oCtrlGroup.getBounds());
        }else{
            this.drawLayer(oData.aoData);
        }
        this._oMap.fitBounds(this._oCtrlGroup.getBounds());

    },

    // 画单个点
    drawLayer: function (oData) {

        if (!this._oCtrlGroup || !oData) {
            return;
        }

        var oParam = JSON.parse(oData.MapJson);
        var oIcon = this._getIcon();
        if(oData.CloudType == 10){
            var oIcon = this._getCityIcon();
        }

        var oMarker = L.marker(oParam.aoLatLng[0],{icon: oIcon});

        L.circle(oParam.aoLatLng[0], {radius: 3000}).addTo(this._oCtrlGroup);

        oMarker.cId = oData.Id;
        oMarker.oData = oData;

        oMarker.addTo(this._oCtrlGroup);

        oMarker.bindTooltip(oData.CloudName).openTooltip();
        //this.initEventForMarker(oMarker);

        return oMarker;
    },

    //给点注册点击事件
    initEventForMarker: function (oMarker) {
        var self = this;
        if (!oMarker) {
            return;
        }

        oMarker.on('click', function () {

            ES.Util.reqData({
                    url: this.oPosInfo.MapPopUrl,
                    data: {id: this.oPosInfo.Id},
                    dataType: 'html',

                },
                function (oData) {
                    this.bindPopup(oData.rtnData,{maxWidth:400});
                    var oPopup = this.getPopup();
                    oPopup.id = this.cId;
                    oPopup.on('contentupdate', function () {
                        $('li[band-id=' + this.id + ']').unbind('click');
                        $('li[band-id=' + this.id + ']').bind('click', function () {
                            var aa = 0;
                            // 创建弹出层
                            var oD = new ES.MapView.PopAssetInfo(self, {
                                cId: $(this).attr('band-id'),
                                cUrl: $(this).attr('band-url'),
                                cTypeName: $(this).attr('band-type')
                            });

                            oD.showModal();

                        });
                    });

                    this.openPopup();
                },
                this);

        }, oMarker);

    },

    // 画点
    _getIcon: function () {
        var oIcon = L.icon({
            iconUrl: this.oOption.cIcon,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
        });
        return oIcon;
    },
    _getCityIcon: function () {
        var oIcon = L.icon({
            iconUrl: this.oOption.cCityIcon,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
        });
        return oIcon;
    },

    // 获得弹出层的内容
    _getPopHtml: function (oPosInfo) {

        return '';
    },

    clearMarkerSite: function (oData) {
        var anId = oData.anId;
        for (var i = 0; i < anId.length; i++) {
            var oLayer = this.findLayer(this._oCtrlGroup, anId[i]);
            if (!oLayer) continue;
            if (oLayer.oMarker) {
                this._oCtrlGroup.removeLayer(oLayer.oMarker);
            }
            this._oCtrlGroup.removeLayer(oLayer);
        };
    },

});

/**
 * 沃特玛项目站点图层的显示方法
 *
 * Created by Administrator on 2017/8/2.
 */


ES.CloudMap.SiteLayer = L.MapLib.MapMaster.MapOpr.extend({
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
        this._oParent.on('CloudMap:LineLayer.reflesh', this.reflesh, this);

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

        this.clearLayer();

        if (!oData || !oData.aoData) {
            return;
        }

        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {
            var oLayer = this.findLayer(this._oPolylineGroup, oData.aoData[i].Id);
            if (oLayer) {
                continue;
            }
            this.drawLayer(oData.aoData[i]);

        }

        this._oMap.fitBounds(  this._oPolylineGroup.getBounds());

    },

    // 刷新线路信息数据
    reflesh: function (oData) {
        var oLayer = this.findLayer(this._oPolylineGroup, oData.Id);
        if (oLayer) {
            this._oPolylineGroup.removeLayer(oLayer);
        }

        this.drawLayer(oData);
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
        oVehLine.cId = oData.Id;
        oVehLine.cName  = oData.CloudName;
    },

    // 设置图层设置
    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData) {
            return oVehLine;
        }

        var oParam = JSON.parse(oData.MapJson);
        var aoLatLng =oParam.aoLatLng;
        // 为了显示汉字正确性，对线路进行优化显示
        if(!oParam.aoLatLng || oParam.aoLatLng.length>1) {

            if (oParam.aoLatLng[0].lng > oParam.aoLatLng[oParam.aoLatLng.length - 1].lng) {
                aoLatLng = [];
                for (var i = oParam.aoLatLng.length - 1; i >= 0; i--) {

                    aoLatLng.push(oParam.aoLatLng[i]);
                }
            }
        }

        oVehLine = L.polyline(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolylineGroup);

        oVehLine.setText( oData.CloudName + '          ', {
            repeat: true,
            offset: 20,
            attributes: {'font-size': '14', fill: 'red'}
        });
        return oVehLine;
    },
});

/**
 * 提交数据保持到服务器
 *
 * Created by liulin on 2017/3/17.
 *
 */

ES.CloudMap.DeleteTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" >' +
            '<i class="ec-icon-dot-circle-o"></i></button><p>删除</p>' +
            '</li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this, oParent, options);
    },


    // 绑定事件
    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this);

        var self = this;
        this.$_oLi.find('button').bind('click', function () {
            // 获得数据
            var aoLayer = self._oParent.getLayer();
            if (!aoLayer || aoLayer.length <= 0) {
                ES.aWarn('没有可以删除的数据');
                return;
            }
            // self._oParent.fire('CloudMap:DelCloudMap.del',  {Id:aoLayer[0].oBusData.cId});
            self._oParent.fire('CloudMap:DelCloudMap.del',  {Id:aoLayer[0].oBusData.cId, oBusData: aoLayer[0].oBusData});
        });
    },

});

/**
 *  负责画线路
 * Created by liulin on 2017/9/2.
 */

ES.CloudMap.DrawGridTool = ES.CloudMap.BaseTool.extend({


    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" data-object="0" ><i class="ec-icon-dot-circle-o"></i></button><p>画区域</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);

        this.initPen();

        this.initOn();

        this.initUI();


    },


    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this );

        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPen.handler.enable();
            //self._oParent.addSaveACalToUI();
        });
    },

    //  画点
    initPen: function () {
        this.oPen = {
            enabled: {},
            handler: new L.Draw.Polygon(this._oMap, {}),
            title: ''
        }
    },

    calDraw:function(){
        if(this.oPen){
            this.oPen.handler.disable();
        }

    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

        var self = this;

        this._oMap.on('draw:created', function (e) {

            var oLayer = e.layer;

            self._oParent.addLayer(oLayer);

            var aoLatLng = oLayer.getLatLngs();

            var oInfo = {
                aoLatLng: aoLatLng,
                oOption: null,
                nType: 0
            };

            var oPos = this.latLngToLayerPoint(aoLatLng[0][0]);

            self._oParent.fire('CloudMap:PopWnd.show', {oInfo: oInfo, oPos: oPos});
        });


    },


});


/**
 * Created by liulin on 2017/4/27.
 */


ES.CloudMap.GridEditTool = ES.CloudMap.BaseTool.extend({

    cHtml: '<li><button class="ec-btn ec-btn-secondary ec-radius" ><i class="ec-icon-dot-circle-o"></i></button><p>编辑</p></li>',

    // 构造函数
    initialize: function (oParent, options) {
        ES.CloudMap.BaseTool.prototype.initialize.call(this,oParent, options);
        this._oDrawLayer =oParent.getDrawLayer();
        this.oPen = null;

        this.initPen();

    },


    bandClick: function () {
        ES.CloudMap.BaseTool.prototype.bandClick.call(this);
        var self =this;
        this.$_oLi.find('button').bind('click', function () {
            self.oPen.handler.enable();
            self._oParent.addSaveACalToUI();
        });
    },

    //  画点
    initPen: function () {
        this.oPen = {
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
            title: ''
        }
    },

    // 添加事件
    initOn: function () {
        ES.CloudMap.BaseTool.prototype.initOn.call(this);

        this._oParent.on('CloudMap:EditTool.calEdit',this.calEdit,this);
        this._oParent.on('CloudMap:EditTool.edit',this.edit,this);
        this._oParent.on('CloudMap:EditTool.SaveEdit',this.saveEdit,this);

        var self =this;
        this._oMap.on('draw:edited', function (e) {
            if(!self._oParent.getActive()){
                return
            }
            var oMap = this;
            var aoLayer = e.layers;

            aoLayer.eachLayer(function (oLayer) {
                var aoLatLng = oLayer.getLatLngs()[0].map(function (oItem) {
                    return oItem
                });

                //oInfo = {aoLatLng: aoLatLng, oOption: oOption, nType: this.getObjType(oLayer)};

                //var oLatLng = oLayer.getLatLng();

                var oInfo = {
                    aoLatLng: aoLatLng,
                    oOption: null,
                    nType: 0
                };

                self._oDrawLayer.addLayer(oLayer);

                // 弹出层显示的位置信息
                var oPos = oMap.latLngToLayerPoint(aoLatLng[0]);

                // 告诉外面弹出层的位置
                self._oParent.fire('CloudMap:PopWnd.editShow', {
                    oInfo: oInfo,
                    oPos: oPos,
                    oBusData:oLayer.oBusData
                });
            });
        });
    },

    // 保存编辑
    saveEdit: function () {
        this.oPen.handler.save();
        this.oPen.handler.disable();

    },

    // 取消编辑
    calEdit: function () {
        this.oPen.handler.revertLayers();
        this.oPen.handler.disable();
    },

    // 编辑数据oData:oNode.node.data,
    edit: function (oVal) {

        this._oParent.clearLayers();

        if (!oVal  || !oVal.oNode) {
            return ;
        }

        // oVal.oNode.mapJson={};
        // oVal.oNode.mapJson.aoLatLng=[];
        // oVal.oNode.mapJson.nType = 0;
        // oVal.oNode.mapJson.oOption = null;
        // var _lat = oVal.oNode.data.MapY.split(",");
        // var _lng = oVal.oNode.data.MapX.split(",");
        // for (var i=0;i<_lat.length;i++){
        //     var _aoLatLng = {};
        //     _aoLatLng.lat = parseFloat(_lat[i]);
        //     _aoLatLng.lng = parseFloat(_lng[i]);
        //     oVal.oNode.MapJson.aoLatLng.push(_aoLatLng);
        // }

        // oVal.oNode.MapJson = JSON.parse(oVal.oNode.mapJson).aoLatLng

        // oVal.oNode.MapJson = JSON.stringify(oVal.oNode.MapJson)
        var oVehLine = this.createLayer(oVal.oNode);


        // 编辑围栏数据,画围栏时要表明自己的名称
        //var oVehLine = L.marker(oVal.oNode.data,{});
        //oVehLine.edited = true;

        this.fitBound();
        var oData = {
            oLatLng: oVal.oNode.data,
            cCode:oVal.oNode.code,
            cId: oVal.oNode.id,
            cName: oVal.oNode.cloudName,
            cParentId:oVal.oNode.code,
            cParentText :oVal.oNode.addr,
        };
        oVehLine.cId = oVal.oNode.id;
        oVehLine.oBusData = oData;
        oVehLine.addTo(this._oDrawLayer);

        this._oParent.addEditToUI();
    },

    // 多边形定位到地图中间
    fitBound: function () {
        if (!this._oDrawLayer) {
            return;
        }
        var oBound = this._oDrawLayer.getBounds();
        this._oMap.fitBounds(oBound);
    },

    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData || !oData.mapJson) return oVehLine;

        var oTemp = null;

        try {
            oTemp = JSON.parse(oData.mapJson);
            oTemp.oOption = this.oPenStyle;
        } catch (e) {
            oTemp = null;
        }
        if (!oTemp) {
            return oVehLine;
        }
        oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);

        //switch (oData.MapType) {
        //    case 1:
        //        oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 2:
        //        // 计算2个点的距离，在来画圆
        //        var dDis = L.latLng(oTemp.aoLatLng[0]).distanceTo(L.latLng(oTemp.aoLatLng[1]))
        //        oVehLine = L.circle(oTemp.aoLatLng[0], dDis, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 3:
        //        oVehLine = L.rectangle(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 4:
        //        oVehLine = L.polyline(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    case 5:
        //        oVehLine = L.marker(oTemp.aoLatLng[0], oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //    default :
        //        oVehLine = L.polygon(oTemp.aoLatLng, oTemp.oOption).addTo(this._oDrawLayer);
        //        break;
        //}
        return oVehLine;
    },

});


/**
 * Created by Administrator on 2017/8/2.
 */

ES.CloudMap.DelWnd = ES.Common.DialogDel.extend({
    initOn: function () {
        this._oParent.on('CloudMap:DelCloudMap.del', this.del, this);
    },

    save: function () {
        if (!this.oBusData) {
            ES.aWarn(ES.Lang.BaseDialog[30]);
            return;
        }

        ES.loadAn($(this.oDialog.node));

        ES.getData({Id:this.oBusData.Id}, this.oOption.cUrl, this.saveHandler, this);
    },

    saveHandler: function (oData) {
        ES.removeAn($(this.oDialog.node));

        if (oData && oData.IsSuccess) {
            ES.aSucess(ES.Common.Lang[32]);

            this._oParent.fire('PostPosTreeView.reflesh');
            this._oParent.fire('CloudMap:EditTool.calEdit');
            this._oParent.addDrawToUI();
            this._oParent.clearLayers();
        }
        else {
            ES.aErr(ES.template(ES.Common.Lang[33], oData));
        }

        this.oDialog.close();
    },
    afterClose:function(){
        this._oParent.fire('CloudMap:BaseTool.removeActive');
    }

});

/**
 *
 * 站点 弹出层
 *(1=网格 2=线 3=围栏 4=兴趣点 5=卡口)
 *
 * 图形类型(1=多边形 2=圆 3=矩形 4=线,5=点)
 * Created by liulin on 2017/3/17.
 */


ES.CloudMap.GridWnd = ES.CloudMap.BaseWnd.extend({

    oOption: {
        cContainerSel: '#MapView',
        cFlag: 'Grid',
        oText: {},
        oOffset: {nW: 0, nH: -15}
    },

    initialize: function (oParent, oOption,oTreeOption) {
        this._oParent = oParent;
        this.oTreeOption = oTreeOption;
        //ES.Common.Pop.prototype.initialize.call(this, oParent, oOption);
        ES.setOptions(this, oOption);
        //this.hideDefaultButton();
        this.cFlag = 'PostPos';
        // 窗体在地图上弹出的位置信息
        this.oPopLatLng = null;

        this.initUI();
        this.initOn();

        this.setParentEvent();

    },

    initUI: function () {
        this.$_oContainer = $(this.cContent);
        $(this.oOption.cContainerSel).append(this.$_oContainer);
        this.$_oContainer.hide();
        this.afterOpen();
    },

    afterOpen: function () {
        var self = this;
        this.$_oContainer.find('.ec-icon-save').parent().bind('click', function () {
            self.save();
        });

        //type="button"
        this.$_oContainer.find('.ec-icon-close').parent().bind('click', function () {
            self.$_oContainer.hide();
            self._oParent.clearLayers();
            self._oParent.fire('CloudMap:BaseTool.removeActive');
        });
        // 分类树
        if (!this.oSelectTree) {
            this.oSelectTree = new ES.Common.SelectTreeNode(this, {
                    cBandSel: $('#DeptId')
                },this.oTreeOption

            );
        }
        this.oSelectTree.on('selectVal',  this.setVal,this);
    },

    setVal: function (oData) {
        if(oData.data.type == 1){
            ES.aWarn('请重新选择区域!')
            return
        }
        $('#DeptId').val(oData.text);

        this.cParentId = parseInt(oData.id);
        this.cParentVal = oData.text;
        $('.ex-cover-tree-select').hide().siblings('div').hide();
    },
    setParentEvent: function () {

        //屏蔽事件
        L.DomEvent.addListener( this.$_oContainer.get(0), 'click', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'dblclick', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousemove', L.DomEvent.stopPropagation);
        L.DomEvent.addListener( this.$_oContainer.get(0), 'mousewheel', L.DomEvent.stopPropagation);

    },

    check: function () {

        if (!$('#GridName').val()) {
            ES.aWarn('请录入站点名称！');
            return false;
        }

        return true;
    },

    save: function () {
        if (!this.check()) {
            return;
        }

        ES.loadAn(this.$_oContainer);

        if(!this.cParentId || !$('#GridName').val() || !$('#GridCode').val()){
            ES.aWarn('请将信息填写完整！');
            return false;
        }

        var oPar = {
            cloudName: $('#GridName').val(),
            code: parseInt($('#GridCode').val()),
            mapJson: JSON.stringify(this.oBusData.oInfo),
            parentId: this.cParentId
        }
        var postUrl = ''
        if(this.oBusData.Id == 0){ //新增
            postUrl = m_addPostUrl
        }else{                      //编辑
            postUrl = m_postUrl
        }
        ES.getData(JSON.stringify(oPar), postUrl, this.saveHandler, this, {},
            {
                headers: {
                    token: m_oParam.token,
                    "Content-Type": 'application/json; charset=utf-8'
                }
            });
    },

    saveHandler: function (oTemp) {
        ES.removeAn(this.$_oContainer);
        var oData = oTemp.oData;
        var bAdd = false;
        if (!oTemp.nId) {
            bAdd = true;
        }

        if (oData && oData.code == 1) {
            ES.aSucess(bAdd ? ES.Common.Lang[10] : ES.Common.Lang[20]);
            // 刷新grid列表
            this._oParent.fire('CloudMap:EditTool.clearLayer');
            // 刷新listview
            this._oParent.fire('PostPosTreeView.reflesh');
            //取消按钮active
            this._oParent.fire('CloudMap:BaseTool.removeActive');
            this.$_oContainer.hide();
        }
        else {
            ES.aErr(ES.template(bAdd ? '添加数据失败,原因:{Msg}' : '修改数据失败,原因:{msg}', oData));
            this._oParent.fire('Edit:saveFail');
        }
    },
    // 接口
    initOn: function () {

        this._oParent.on('CloudMap:PopWnd.show', this.showModal, this);
        this._oParent.on('CloudMap:PopWnd.editShow', this.editShow, this);
        this._oParent.on('CloudMap:PopWnd.setPos', this.setPos, this);
    },

    setPos:function(oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();
        if(!oData) {return;}
        var oPos = oData.oPos
        this.$_oContainer.css({top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});
    },


    editShow: function (oData) {
        if (!oData || !oData.oInfo) {
            return;
        }
        var oPos = oData.oPos;

        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        this.$_oContainer.css({
            top: (oPos.y - nH - this.oOption.oOffset.nH) + 'px',
            left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'
        });

        if(oData.oBusData.cName){
            $('#GridName').attr('readonly', true)
            $('#DeptId').attr('readonly', true)
            $('#GridCode').attr('readonly', true)
        }
        $('#GridName').val(oData.oBusData.cName);
        $('#DeptId').val(oData.oBusData.cParentText);
        $('#GridCode').val(oData.oBusData.cCode);

        this.oBusData = {};
        this.oBusData.Id = parseInt(oData.oBusData.cId);
        this.oBusData.oInfo = oData.oInfo;
        this.cParentId = oData.oBusData.cParentId;

        this.$_oContainer.show();
    },

    showModal: function (oData) {
        var nH = this.$_oContainer.height();
        var nW = this.$_oContainer.width();

        var oPos = oData.oPos;

        this.$_oContainer.css({top: (oPos.y - this.oOption.oOffset.nH) + 'px', left: (oPos.x - nW / 2 - this.oOption.oOffset.nW) + 'px'});

        $('#GridName').val('');
        $('#DeptId').val('');
        $('#GridCode').val('');

        this.oBusData = oData;
        this.oBusData.oInfo.aoLatLng = this.oBusData.oInfo.aoLatLng[0]
        this.oBusData.Id = 0;
        this.$_oContainer.show();

    },

});

// 树的选择初始化
ES.CloudMap.GridWnd.include({

    cContent:'<div class="ex-mapgrid-tip-box  GridWnd"  style="top:150px; left:450px;">'+
    '<ul class="ec-avg-sm-1">'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">区域名称：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="GridName" name="form-sitename" autocomplete="off" placeholder="请输入区域名称" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+
    '    <li class="ec-form-group"> ' +
    '       <label for="form-sitename" class="ec-u-sm-4 ec-form-label">区域编码：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="GridCode" name="form-sitename" autocomplete="off" placeholder="请输入区域编码" class="ec-form-field ec-radius ec-input-sm"></div>'+
    '    </li>'+
    '    <li class="ec-form-group">'+
    '    <label for="form-selectDate" class="ec-u-sm-4 ec-form-label"> 所属部门：</label>'+
    '       <div class="ec-u-sm-8"><input type="text" id="DeptId" name="form-sitename" autocomplete="off" placeholder="请输入所属部门" class="ec-form-field ec-radius ec-input-sm">'+
    '    </div>'+
    '    </li>'+
    '    <li class="ec-form-group">'+
    '       <div class="ec-u-sm-12 ex-final-button">'+
    '           <button type="button" class="ec-btn ec-btn-sm ec-btn-primary"><i class="ec-icon-save"></i> 保存 </button>'+
    '           <a href="#" type="button" class="ec-btn ec-btn-sm ec-btn-warning" style="color:#fff;">' +
    '               <i class="ec-icon-close"></i> 关闭 ' +
    '           </a>'+
    '       </div>'+
    '   </li>'+
    '</ul>'+
    '</div>',


});




//删除操作
ES.CloudMap.DelCloudMap = ES.Common.DialogDel.extend({
    initOn: function () {
        this._oParent.on('CloudMap:DelCloudMap.del', this.del, this);
    },

    saveHandler: function (oData) {
        ES.removeAn($(this.oDialog.node));

        if (oData && oData.IsSuccess) {
            ES.aSucess(ES.Common.Lang[32]);

            this._oParent.fire('PostPosTreeView.reflesh');
        }
        else {
            ES.aErr(ES.template(ES.Common.Lang[33], oData));
        }

        this.oDialog.close();
    },

});



/**
 * 线图层，环保线路
 * Created by liulin on 2017/6/27.
 */


ES.CloudMap.MuckEPGridLayer = L.MapLib.MapMaster.MapOpr.extend({
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

        this._oPolygonGroup = L.featureGroup();

        this._oMap.addLayer(this._oPolygonGroup);

    },

    //初始化时加载数据
    _loadOn: function () {

        // 画所有的工地数据
        this._oParent.on(this.oOption.onEventDrawLayers, this.drawLayers, this);
        this._oParent.on(this.oOption.onEventClearLayers, this.clearLayer, this);
        this._oParent.on(this.oOption.onEventRemoveLayers, this.removeLayers, this);
        this._oParent.on('CloudMap:LineLayer.reflesh', this.reflesh, this);

    },

    removeLayers: function (oData) {

        if (!this._oPolygonGroup || !oData || oData.acId.length <= 0) {
            return;
        }

        var aoInfo = oData.acId;

        for (var i = 0; i < aoInfo.length; i++) {
            var nId = - parseInt(aoInfo[i]);


            var oLayer = this.findLayer(this._oPolygonGroup, nId);
            if (!oLayer) {
                continue;
            }

            this._oPolygonGroup.removeLayer(oLayer);
        }
    },

    clearLayer: function () {
        this._oPolygonGroup.clearLayers();
    },

    // 画所有工地，数据保护所有工地,存在相同的工地和消纳点就不用画
    drawLayers: function(oData) {

        this.clearLayer();

        if (!oData || !oData.aoData) {
            return;
        }

        var aoLatLnt = [];
        for (var i = 0; i < oData.aoData.length; i++) {
            var oLayer = this.findLayer(this._oPolygonGroup, oData.aoData[i].id);
            if (oLayer) {
                continue;
            }
            this.drawLayer(oData.aoData[i]);

        }

        this._oMap.fitBounds(  this._oPolygonGroup.getBounds());

    },

    // 刷新线路信息数据
    reflesh: function (oData) {
        var oLayer = this.findLayer(this._oPolygonGroup, oData.id);
        if (oLayer) {
            this._oPolygonGroup.removeLayer(oLayer);
        }

        this.drawLayer(oData);


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
        oVehLine.cName  = oData.cloudName;
    },

    // 设置图层设置
    createLayer:function(oData) {
        var oVehLine = null;
        if (!oData) {
            return oVehLine;
        }
        if(oData.mapJson){
            var oParam = JSON.parse(oData.mapJson);
        }else if(oData.gpsPoint){
            var oParam = JSON.parse(oData.gpsPoint);
        }

        var aoLatLng =oParam.aoLatLng;
        // 为了显示汉字正确性，对线路进行优化显示
        if(!oParam.aoLatLng || oParam.aoLatLng.length>1) {

            if (oParam.aoLatLng[0].lng > oParam.aoLatLng[oParam.aoLatLng.length - 1].lng) {
                aoLatLng = [];
                for (var i = oParam.aoLatLng.length - 1; i >= 0; i--) {

                    aoLatLng.push(oParam.aoLatLng[i]);
                }
            }
        }

        oVehLine = L.polygon(aoLatLng, this.oOption.oStyleConfig).addTo(this._oPolygonGroup);

        // oVehLine.setText( oData.CloudName + '          ', {
        //     repeat: true,
        //     offset: 20,
        //     attributes: {'font-size': '14', fill: 'red'}
        // });
        return oVehLine;
    },
});

}(window, document, L, jQuery));
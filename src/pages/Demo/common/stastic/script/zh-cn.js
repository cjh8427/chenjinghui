/**
 * Created by liulin on 2017/1/16.
 *
 * 功能： 中文语言基类，
 * 描述： 在MapLibFor 后使用， 
 *
 */

// 位置查询翻译
L.Msg = {

    addHooks: {
        locText: '移动鼠标查询地理位置',
    },

    _onMouseMove: {
        locTemp: '经度:{lng},纬度:{lat}',
    },

};

// 测量中文翻译
L.Msg2 = {
    TipMarker: {
        setText: {
            beginText: '开始  '
        },
        createIcon: {
            closeText: '&times;'
        },
        addTotalPenal: {
            total: ' 总共 ',
        },
        setSubTotalDistTag: {
            total: ' 共 ',
        }
    },
    Dist: {
        _getTooltipText: {
            start: '点击鼠标开始测量距离 .',
            cont: '点击鼠标继续测量距离 .',
            end: '点击最后一个节点结束测量 .'
        }
    },
    Area: {
        _getTooltipText: {
            start: '点击鼠标开始测量面积 .',
            cont: '点击鼠标继续测量面积 .',
            end: '点击最后一个节点结束测量 .'
        }
    },

    error: '<strong>错误:</strong> 边界不能交错 !',
};

// 画点画线翻译查询
L.drawLocal = {
    draw: {
        toolbar: {
            actions: {
                title: '取消画图',
                text: '取消'
            },
            undo: {
                title: '删除最后一个画图点',
                text: '删除最后一个点'
            },
            buttons: {
                polyline: '画线',
                polygon: '画多边形',
                rectangle: '画矩形',
                circle: '画圆',
                marker: '画点'
            }
        },
        handlers: {
            circle: {
                tooltip: {
                    start: '点击地图并拖拽画圆.'
                },
                radius: '半径'
            },
            marker: {
                tooltip: {
                    start: '点击地图画点.'
                }
            },
            polygon: {
                tooltip: {
                    start: '点击地图开始画多边形.',
                    cont: '点击地图继续画多边形.',
                    end: '点击第一点结束画多边形.'
                }
            },
            polyline: {
                error: '<strong>错误:</strong> 线段边缘不能交叉!',
                tooltip: {
                    start: '点击地图开始画线.',
                    cont: '点击地图继续画线.',
                    end: '点击最后一个点结束画线.'
                }
            },
            rectangle: {
                tooltip: {
                    start: '点击地图并拖拽画矩形.'
                }
            },
            simpleshape: {
                tooltip: {
                    end: '释放鼠标完成绘图.'
                }
            }
        }
    },
    edit: {
        toolbar: {
            actions: {
                save: {
                    title: '保存画图数据.',
                    text: '保存'
                },
                cancel: {
                    title: '取消编辑，还原编辑前的图形.',
                    text: '取消'
                }
            },
            buttons: {
                edit: '编辑图层.',
                editDisabled: '没有可编辑图层.',
                remove: '删除图层.',
                removeDisabled: '没有可删除图层.'
            }
        },
        handlers: {
            edit: {
                tooltip: {
                    text: '拖动鼠标，编辑图形.',
                    subtext: '单击“取消”以撤消更改.'
                }
            },
            remove: {
                tooltip: {
                    text: '点击删除一个图形'
                }
            }
        }
    }
};

L.Measure = {
    TipMarker: {
        setText: {
            beginText: '开始  '
        },
        createIcon: {
            closeText: '&times;'
        },
        addTotalPenal: {
            total: ' 总共 ',
        },
        setSubTotalDistTag: {
            total: ' 共 ',
        }
    },
    Dist: {
        _getTooltipText: {
            start: '点击开始测量距离.',
            cont: '点击继续测量距离.',
            end: '双击或者点击最后一个点结束测量.'
        }
    },
    Area: {
        _getTooltipText: {
            start: '点击开始测量面积.',
            cont: '点击继续测量面积.',
            end: '双击或者点击第一个点结束测量.'
        }
    },

    error: '<strong>错误:</strong> 线段不能相交!',

};



L.MarkerMgr = L.Class.extend({
    statics: {
        TYPE: 'DIST'
    },

    //Marker data,in line marker ,where dist line in the line
    //_markers: [],

    // point total distance for map
    //_dTotalDist: 0,


    options: {
        icon: new L.DivIcon({
            iconSize: new L.Point(8, 8),
            className: 'leaflet-div-icon leaflet-editing-icon'
        }),
        zIndexOffset: 2000
    },

    initialize: function (map, oParent, options) {
        this._map = map;
        this._oParent = oParent;
        L.setOptions(this, options);

        this._dTotalDist = 0;
        this._markers = [];
        this._layerGroup = L.featureGroup();
        this._map.addLayer(this._layerGroup);

    },

    // create marker
    createMarker: function (latlng, options) {

        var oTemp = L.extend({}, options, {
            icon: this.options.icon,
            zIndexOffset: this.options.zIndexOffset * 2
        });
        var oMarker = new L.Marker(latlng, oTemp);

        this._layerGroup.addLayer(oMarker);
        this._markers.push(oMarker);
        return oMarker;
    },

    // get marker length for de array
    getLen: function () {
        if (!this._markers) {
            return 0;
        }
        return this._markers.length;

    },

    getLastMarker: function () {

        if (!this._markers || this._markers.length <= 0) {
            return null;
        }

        return this._markers[this._markers.length - 1];
    },

    getLastGeoPos: function () {
        var oMarker = this.getLastMarker();

        return oMarker.getLatLng();
    },

    // get all marker  point  in the array
    getPointMarkers: function () {
        var aoLatLng = [];
        if (!this._markers || this._markers.length <= 0) {
            return aoLatLng;
        }
        for (var i = 0; i < this._markers.length; i++) {
            aoLatLng.push(this._markers[i].getLatLng());
        }
        return aoLatLng;
    },

    // judge finish draw for map
    updateFinishHandler: function () {
        var markerCount = this._markers.length;

        // The first marker should have a click handler to close the polygon
        if (markerCount > 1) {
            this._markers[markerCount-1].on('click', this._finishShape, this);
            this._markers[markerCount-1].on('dblclick', this._finishShape, this);
        }

        // Add and update the double click handler
        if (markerCount > 2) {
            this._markers[markerCount - 2].off('click', this._finishShape, this);
            this._markers[markerCount-2].on('dblclick', this._finishShape, this);
        }
    },


    cleanUpShape: function () {

        if (this._markers <= 1) {

            return;
        }

        this.getLastMarker().off('click', this._finishShape, this);

    },


    _finishShape: function () {

        //delegated parent execute
        this._oParent._finishShape();

    },

    // delete tipmarker and marker catch
    removeMarker: function (marker) {

        // Update Tipmarker text  for distance
        for (var i = this._markers.length - 1; i >= 0; i--) {
            if (this._markers[i] === marker) {
                // delete layer
                this._markers.splice(i, 1);
                break;
            }
        }

        this._layerGroup.removeLayer(marker);

    },


    updateDist: function () {
        for (var i = 0; i < this._markers; i++) {
            if (i === 0) {
                this._tipMarkers[i].setDist(0);
                continue;
            }

            var dist = this._tipMarkers[i].getLatLng().distanceTo(this._tipMarkers[i - 1]);
            this._tipMarkers[i].setDist(dist);
        }
    },


    clearData: function () {
        this._markers.splice(0, this._markers.length);
        this._layerGroup.clearLayers();
    },

    remove: function () {
        this._map.removeLayer(this._layerGroup);
        delete this._layerGroup;
        delete this._markers;
    }
});

L.TipMarkerMgr = L.Class.extend({
    statics: {
        TYPE: 'DIST'
    },


    initialize: function (map, oParent, options) {
        this._map = map;
        L.setOptions(this, options);

        this._markers = [];
        // create layergourp add marker
        this._layerGroup = L.featureGroup();
        // add marker layer
        this._map.addLayer(this._layerGroup);
        // distance
        this._oParent = oParent;
    },

    options: {metric: true},


    // create marker
    createMarker: function (oLatLng, oRelaMarker, options) {

        var tipMarker = L.TipMarker(oLatLng, this, options);
        tipMarker.addTo(this._layerGroup);
        this._markers.push(tipMarker);


        var oPreMarker = this.getSecLastMarker();
        var dDist = this.calDist(tipMarker, oPreMarker);
        tipMarker.setDist(dDist);

        if(this._markers.length  === 1)
        {
            tipMarker.setBeginText();
        }

        if (this._markers.length > 1) {
            dDist = this.getTotalDist();
            // set sub total dist for marker
            tipMarker.setSubTotalDist(dDist);
        }

        // rela marker that show in map
        if (oRelaMarker) {
            tipMarker.oRelaMarker = oRelaMarker;
        }

        return tipMarker;
    },

    // cal distance for two marker and set label for de oCurMarker
    calDist: function (oCurMarker, oPreMarker) {

        if (!oPreMarker) {

            return 0;
        }

        var oELatLng = oCurMarker.getLatLng();
        var oBLatLng = oPreMarker.getLatLng();
        return oELatLng.distanceTo(oBLatLng);
    },

    // get total distance
    getTotalDist: function () {
        if (this._markers.length <= 0) {
            return 0;
        }
        var dToTalDist = 0;
        for (var i = 0; i < this._markers.length; i++) {
            dToTalDist += this._markers[i].dDist;
        }

        return dToTalDist;
    },

    getLastMarker: function () {

        if (!this._markers || this._markers.length <= 0) {
            return null;
        }
        return this._markers[this.getLen() - 1];
    },

    getLastGeoPos: function () {
        var oMarker = this.getLastMarker();
        return oMarker.getLatLng();
    },

    getSecLastMarker: function () {
        if (!this._markers || this._markers.length <= 1) {
            return null;
        }
        return this._markers[this.getLen() - 2];

    },

    // get marker length
    getLen: function () {
        if (!this._markers) {
            return 0;
        }
        return this._markers.length;
    },


    // when finish dist  add close btn
    addCloseBtn: function () {
        var oMarker = this.getLastMarker();
        if (!oMarker) {
            return;
        }
        oMarker.addAllClose();
    },

    // add total tag
    addTotalDist: function () {

        var oMarker = this.getLastMarker();
        if (!oMarker) {
            return;
        }
        var dDist = this.getTotalDist();
        oMarker.addTotalPenal(dDist);

    },

    setTipTotalDist: function () {

        var oMarker = this.getLastMarker();
        if (!oMarker) {
            return;
        }
        var dDist = this.getTotalDist();

        oMarker.setTotalDist(dDist);
    },

    // set all marker distance and label
    setSubDist: function () {

        if (!this._markers || this._markers.length <= 0) {
            return;
        }

        this._markers[0].setDist(0);
        this._markers[0].deleteSubTotalTag();

        for (var i = 1; i < this._markers.length; i++) {
            var dDist = this.calDist(this._markers[i], this._markers[i - 1]);
            this._markers[i].setDist(dDist);
        }
    },

    // befor cal ,you need update marker dist
    setTipSubTotalDist: function () {

        if (!this._markers || this._markers.length <= 0) {
            return;
        }


        var dDist = 0;
        for (var i = 1; i < this._markers.length; i++) {
            dDist = this._markers[i].dDist + dDist;

            this._markers[i].setSubTotalDist(dDist);
        }

    },

    update: function () {

        this.setSubDist();

        this.setTipSubTotalDist();

        if (this._oParent.options.bIsTotalDist) {
            this.addTotalDist();
        }
        else {
            this.setTipTotalDist();
        }

        this.addCloseBtn();
    },

    // delete tipmarker and marker catch
    removeTipMarker: function (marker) {

        if (this._markers.length === 2) {
            this.clearData();
            this._oParent.clearData();
            return;
        }

        // Update Tipmarker text  for distance
        for (var i = this._markers.length - 1; i >= 0; i--) {
            if (this._markers[i] === marker) {
                // delete layer
                this._markers.splice(i, 1);
                break;
            }
        }

        this.update();


        if (marker.oRelaMarker) {
            // remove rela marker
            this._oParent.deleteHandler(marker.oRelaMarker);//fire("removeRelaMarker", {oRelaMarler: marker.oRelaMarler});
        }

        this._layerGroup.removeLayer(marker);


    },

    clearData: function () {
        // delete all data
        this._markers.splice(0, this._markers.length);
        this._layerGroup.clearLayers();
    },

    // delete dist,but draw dist is exist in catch
    deleteDist: function () {
        this.clearData();
        this._oParent.clearData();
    },

    remove: function () {
        this._map.removeLayer(this._layerGroup);
        delete this._layerGroup;
        delete  this._markers;
    }

});

L.TipMarker = L.Marker.extend({
    options: {
        oShowConfig: {
            bIsSubDist: false,
            bIsSubTotalDist: true,
            bIsSubClose: true

        },
        metric: true
    },

    // config tag is create or order,set all site
    oUIConfig: {
        oSubBeginTxt: {
            nOrder: 1,
            cTagName: 'span',
        },
        oSubDist: {
            nOrder: 2,
            cTagName: 'span',
        },
        oSubTotalDist: {
            nOrder: 3,
            cTagName: 'span'
        },
        oTotalDist: {
            nOrder: 4,
            cTagName: 'span'
        },
        oSubClose: {
            nOrder: 5,
            cTagName: 'a',
            cClassName: 'ex-dist-subclose ec-text-lg',
            cText: '',
            cHtml: L.Measure.TipMarker.createIcon.closeText,
            bIsClick: true
        },
        oTotalClose: {
            nOrder: 6,
            cTagName: 'a',
            cClassName: 'ex-dist-close ec-icon-trash',
            cText:'',
            cHtml: '',
            //fnCallBack:null
        },
    },

    initialize: function (latlng, oParent, options) {

        L.Util.extend(this.oUIConfig, options.oUIConfig);

        for (var cKey in this.oUIConfig) {
            if (this.oUIConfig[cKey].cTagName === 'span') {
                this.oUIConfig[cKey].metric = this.options.metric;
            }
        }

        L.Marker.prototype.initialize.call(this, latlng, options);

        this._oParent = oParent;

        // save tag for the tip marker
        this.aoTag = [];
    },

    _initIcon: function () {
        var options = this.options,
            map = this._map,
            animation = (map.options.zoomAnimation && map.options.markerZoomAnimation),
            classToAdd = animation ? 'leaflet-zoom-animated' : 'leaflet-zoom-hide';

        // create div for marker
        var icon = this.createIcon();

        L.DomUtil.addClass(icon, classToAdd);

        if (options.keyboard) {
            icon.tabIndex = '0';
        }

        this._icon = icon;

        this._initInteraction();

        if (options.riseOnHover) {
            this.on({
                mouseover: this._bringToFront,
                mouseout: this._resetZIndex
            });
        }


        if (options.opacity < 1) {
            this._updateOpacity();
        }

        var panes = this._map._panes;

        panes.markerPane.appendChild(this._icon);

    },

    // set position for the marker div
    _setIconStyles: function (img, name) {
        var options = this.options,
            size = L.point(options[name + 'Size']),
            anchor;

        anchor = L.point(options.iconAnchor);

        if (!anchor && size) {
            anchor = size.divideBy(2, true);
        }

        img.className = 'leaflet-marker-' + name + ' ' + options.className;

        if (anchor) {
            img.style.marginLeft = (-anchor.x) + 'px';
            img.style.marginTop = (-anchor.y) + 'px';
        }

        if (size) {
            img.style.width = size.x + 'px';
            img.style.height = size.y + 'px';
        }
    },

    // create icon and init event
    createIcon: function () {
        var divContainer = L.DomUtil.create('div', '');
        this._setIconStyles(divContainer, 'icon');

        this.oTagContanier = divContainer;
        this.createTag();

        return divContainer;
    },

    createTag: function () {
        var oShowConfig = this.options.oShowConfig;
        for (var cKey in oShowConfig) {
            if (!oShowConfig[cKey]) {
                continue;
            }
            var cTag = cKey.replace('bIs', 'o');
            if (this.oUIConfig.hasOwnProperty(cTag)) {
                var oTag = new L.TipTag(this, this.oUIConfig[cTag]);
                oTag.setFlag(cTag);
                this.addTag(oTag);
                if (this.oUIConfig[cTag].bIsClick) {

                    oTag.setClick(this.closeHanler, this);
                }
            }
        }
    },


    // add html tag for list
    addTag: function (oTag) {
        var aoTag = this.aoTag;

        if (aoTag.length <= 0) {
            aoTag.push(oTag);
            this.oTagContanier.appendChild(oTag.oTag);
            return;
        }
        var nIndex = aoTag.length;
        for (var i = 0; i < aoTag.length; i++) {
            if (oTag.nOrder < aoTag[i].nOrder) {
                nIndex = i;
                break;
            }
        }
        if (nIndex === aoTag.length) {
            this.oTagContanier.appendChild(oTag.oTag);
            this.aoTag.push(oTag);
        }
        else {

            this.oTagContanier.insertBefore(oTag.oTag, this.aoTag[nIndex].oTag);
            this.aoTag.splice(nIndex, 0, oTag);
        }

    },

    // add tag close all marker
    addAllClose: function () {

        var oTag = this.getTagByFlag('oTotalClose');
        if (oTag) {
            return;
        }
        oTag = L.TipTag(this, this.oUIConfig.oTotalClose);
        oTag.setFlag('oTotalClose');
        this.addTag(oTag);

        oTag.setClick(function () {

            this._oParent.deleteDist();
        }, this);
    },


    // delet oTag
    deleteTag: function (cFlag) {
        var aoTag = this.aoTag;
        if (!aoTag || aoTag.length <= 0) {
            return;
        }

        for (var i = 0; i < aoTag.length; i++) {
            if (aoTag[i].cFlag === cFlag) {
                this.oTagContanier.removeChild(aoTag[i].oTag);
                aoTag.splice(i, 1);
                break;
            }
        }
    },

    deleteSubTotalTag: function () {

        this.deleteTag('oSubTotalDist');
    },

    addTotalPenal: function (dTotal) {
        var oTag = this.getTagByFlag('oTotalDist');
        if (!oTag) {
            oTag = L.Measure.TipTag(this, this.oUIConfig.oTotalDist);
            oTag.setFlag('oTotalDist');
            this.addTag(oTag);
        }
        this.setTotalDist(dTotal, oTag);
    },

    setTotalDist: function (dTotal, oTag) {
        if (!oTag) {
            oTag = this.getTagByFlag('oTotalDist');
        }
        if (!oTag) {
            return;
        }
        this.deleteTag('oSubTotalDist');
        var cTemp = L.Measure.TipMarker.addTotalPenal.total;

        oTag.setHTML(dTotal, cTemp);
    },

    // set marker length
    setDist: function (dDist) {
        this.dDist = dDist;
        var oTag = this.getTagByFlag('oSubDist');
        if (!oTag) {
            return;
        }

        oTag.setHTML(dDist);
    },

    setBeginText: function () {
        var cTag= 'oSubBeginTxt';
        var oTag = new L.TipTag(this, this.oUIConfig[cTag]);
        oTag.setFlag(cTag);
        this.addTag(oTag);
        var cText = L.Measure.TipMarker.setText.beginText;
        oTag.setHTML(cText);
    },

    getTagByFlag: function (cFlag) {
        var aoTag = this.aoTag;
        if (!aoTag || aoTag.length <= 0) {
            return undefined;
        }
        for (var i = 0; i < aoTag.length; i++) {
            if (aoTag[i].cFlag === cFlag) {
                return aoTag[i];

            }
        }

        return undefined;
    },

    setSubTotalDist: function (dTotal) {
        var oTag = this.getTagByFlag('oSubTotalDist');
        if (!oTag) {
            return;
        }
        var cTemp = L.Measure.TipMarker.setSubTotalDistTag.total;
        //var cDist = (dTotal / 1000).toFixed(2) + L.measure.TipMarker.setSubTotalDistTag.until;

        oTag.setHTML(dTotal, cTemp);
    },


    closeHanler: function () {

        this._oParent.removeTipMarker(this);
    },

});

L.TipTag = L.Class.extend({
    // config tag is create or order
    options: {
        // show sub distance in marker
        cTagName: 'span',
        // class for the tag
        cClassName: '',
        // show sub marker total distance
        nOrder: 1,
        // show total dist
        cText: '',
        //metric
    },

    // init tag for control
    initialize: function (oParent, options) {
        L.setOptions(this, options);
        this._oParent = oParent;
        this.createTag();
        //this.cPreText = '';
    },


    // create icon and init event
    createTag: function () {
        var oTag = L.DomUtil.create(this.options.cTagName, '');
        this.nOrder = this.options.nOrder;
        if (this.options.cClassName) {
            L.DomUtil.addClass(oTag, this.options.cClassName);
        }

        oTag.text = this.options.cText;
        oTag.innerHTML =  this.options.cHtml||'';
        this.oTag = oTag;

        return oTag;
    },

    setFlag: function (cFlag) {
        this.cFlag = cFlag;
        this.oTag.setAttribute('cFlag', cFlag);
    },

    // set html
    setHTML: function (dDist, cPreText) {
        if (typeof dDist === 'string') {
            this.oTag.innerText = dDist;
            return;
        }

        var cDist = '';
        if (dDist !== 0) {
            //metric
            cDist = L.GeometryUtil.readableDistance(dDist, true);
        }
        this.oTag.innerHTML = (cPreText || '') + cDist;
    },

    setClick: function (fnCall, oContext) {
        L.DomEvent.on(this.oTag, 'click', fnCall, oContext);
    }

});
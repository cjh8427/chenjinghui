<template>
    <div class="ex-pages" style="overflow: hidden">
        <div class="ex-pages-content" style="height: 100%;width:100%;padding: inherit">
            <div class="ex-table-content" style="height: 100%;width:100%;padding: inherit">
                <div id="mapViewContainer"></div>
                <div class="ex-layout-maptool top-panel left-panel">
                    <div class="ex-maptool-box">
                        <div class="ex-maptool-search-box">
                            <el-input placeholder="请输入内容" v-model="poiSearch" clearable size="small"></el-input>
                            <span class="ec-input-group-btn">
                                <el-button type="primary" icon="el-icon-search" size="small"></el-button>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="ex-layout-maptool top-panel right-panel mapTool">
                    <div class="ex-maptool-box">
                        <el-dropdown placement="bottom-start" @command="handleDrawMap">
                            <el-button type="primary" size="small">
                                <i class="el-icon-setting el-icon--left"></i>工具<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item><i class="el-icon-picture-outline-round el-icon--left"></i> 全国</el-dropdown-item>
                                <el-dropdown-item command="checkLine"><i class="el-icon-paperclip el-icon--left"></i> 测距</el-dropdown-item>
                                <el-dropdown-item command="checkRe"><i class="el-icon-crop el-icon--left"></i> 测面</el-dropdown-item>
                                <el-dropdown-item><i class="el-icon-zoom-in el-icon--left"></i> 拉框放大</el-dropdown-item>
                                <el-dropdown-item><i class="el-icon-zoom-out el-icon--left"></i> 拉框缩小</el-dropdown-item>
                                <el-dropdown-item><i class="el-icon-location-outline el-icon--left"></i> 坐标查询</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-dropdown @command="handleChangeMap">
                            <el-button type="primary" size="small">
                                <i class="el-icon-map-location el-icon--left"></i> 高德地图<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="gaode"><i class="el-icon-place el-icon--left"></i> 高德地图</el-dropdown-item>
                                <el-dropdown-item command="gaodeweixing"><i class="el-icon-paperclip el-icon--left"></i> 高德卫星图</el-dropdown-item>
                                <el-dropdown-item command="google"><i class="el-icon-paperclip el-icon--left"></i> 谷歌地图</el-dropdown-item>
                                <el-dropdown-item command="googleweixing"><i class="el-icon-paperclip el-icon--left"></i> 谷歌卫星图</el-dropdown-item>
                                <el-dropdown-item command="googledixing"><i class="el-icon-paperclip el-icon--left"></i> 谷歌地形图</el-dropdown-item>
                                <el-dropdown-item command="huidu"><i class="el-icon-paperclip el-icon--left"></i> 灰度图</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button type="primary" size="small">
                            <i class="el-icon-refresh el-icon--left"></i> 刷新
                        </el-button>
                    </div>
                </div>
                <div class="ex-layout-type-wbox bottom-panel right-panel" :class="{'hideExample' : hideExample}">
                    <div class="ex-layout-map-type-box">
                        <div class="ex-layout-map-example-title">
                            <i class="el-icon-right el-icon--left" v-on:click="handleExample()" v-if="!hideExample"></i>
                            <i class="el-icon-back el-icon--left" v-on:click="handleExample()" v-if="hideExample"></i>
                            <span>地图图例</span>
                        </div>
                        <ul class="ex-layout-map-example">
                            <li><label><em class="ex-maptool-icon truck green"></em> 在线车辆 [ 正常车辆 ]</label></li>
                            <li><label><em class="ex-maptool-icon truck yellow"></em>  在线车辆 [ 定位失败 ]</label></li>
                            <li><label><em class="ex-maptool-icon truck gray"></em>  离线车辆 [ 通讯中断 ]</label> </li>
                            <li><hr></li>
                            <li><label><em class="ex-maptool-icon site now"></em>  上报正常工地</label></li>
                            <li><label><em class="ex-maptool-icon site temp-site"></em>   上报提前出土工地</label></li>
                            <li><label><em class="ex-maptool-icon site no-report"></em>   未出土工地</label></li>
                            <li><label><em class="ex-maptool-icon site alert"></em>   未上报出土工地</label></li>
                            <li><hr></li>
                            <li><label><em class="ex-maptool-icon unload normal"></em>   正常消纳点</label></li>
                            <li><label><em class="ex-maptool-icon site hacked"></em>   可疑出土工地</label></li>
                            <li><label><em class="ex-maptool-icon unload hacked"></em>   可疑消纳点</label></li>
                            <li><label><em class="ex-maptool-icon noise"></em>   扬尘噪音设备</label></li>
                        </ul>
                    </div>
                </div>
                <div class="ex-layout-map-menu">
                    <el-tabs :tab-position="tabPositoin" :stretch="true">
                        <!--<el-tabs :tab-position="tabPositoin" :stretch="true" @mouseenter.native="enterTab()" @mouseleave.native="leaveTab()">-->
                        <el-tab-pane>
                            <span slot="label"><i class="el-icon-truck mg-right-1"></i> 车辆列表</span>
                            <div class="ex-layout-carlist">
                                <div class="ex-layout-carlist-title">
                                    <span>车辆列表</span>
                                    <span>7897 辆</span>
                                    <span style="margin-left: 2rem;cursor: pointer">
                                        <i class="el-icon-arrow-right el-icon--right" v-on:click="handleCarlistFunc()" v-if="!handleCarlist"></i>
                                        <i class="el-icon-arrow-left el-icon--left" v-on:click="handleCarlistFunc()" v-if="handleCarlist"></i>
                                    </span>
                                </div>
                                <div class="ex-layout-carlist-wrap">
                                    <div class="ex-layout-struckbox-search">
                                        <div class="search-group">
                                            <el-input placeholder="请输入内容" size="small" v-model="vehicleSearch">
                                                <el-button slot="append" icon="el-icon-search" type="primary" size="small"></el-button>
                                            </el-input>
                                        </div>
                                        <div class="ex-layout-carlist-query">
                                            <el-dropdown :hide-on-click="false">
                                                <div class="ex-carlist-query-btn" style="">
                                                    <i class="ex-maptool-icon truck green"></i>
                                                </div>
                                                <el-dropdown-menu slot="dropdown">
                                                    <el-dropdown-item v-for="item in carListStatus">
                                                        <el-checkbox v-model="item.selected"><i :class="item.iconClass" style="margin-top: 0.15rem"></i>{{item.label}}</el-checkbox>
                                                    </el-dropdown-item>
                                                </el-dropdown-menu>
                                            </el-dropdown>
                                        </div>
                                    </div>
                                    <!--车辆容器的列表-->
                                    <div class="ex-layout-carlist-content">
                                        <ul>
                                            <li class="slideup in" v-for="item in carlistData">
                                                <div class="carlist-card">
                                                    <i class="truck gray"></i>
                                                    <div class="carlist-title">
                                                        <p class="num">{{item.vehicleNo}}</p>
                                                        <p class="time">{{item.gpsTime}}</p></div>
                                                    <div class="carlist-icon-star">
                                                        <em class="el-icon-star-off"></em>
                                                    </div>
                                                    <div class="clearfix"></div>
                                                </div>
                                                <div class="carlist-bottom">
                                                    <el-row>
                                                        <el-col :span="8"><el-button v-on:click="handleFollow(item)" type="default" size="small" round>跟踪</el-button></el-col>
                                                        <el-col :span="8"><el-button v-on:click="handleTrack(item)"  type="default" size="small" round>轨迹</el-button></el-col>
                                                        <el-col :span="8"><el-button v-on:click="handleVehicleDetail(item)" type="default" size="small" round>详情</el-button></el-col>
                                                    </el-row>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="ex-layout-carlist-page">
                                    <el-pagination
                                            :small="true"
                                            layout="prev, pager, next"
                                            :total="50">
                                    </el-pagination>
                                </div>
                            </div>
                            <div class="ex-layout-struckbox" v-if="handleCarlist">
                                <div class="ex-layout-carlist-title">
                                    <span>组织架构</span>
                                </div>
                                <div class="ex-layout-carlist-wrap">
                                    <div class="ex-layout-struckbox-search">
                                        <div class="search-group">
                                            <el-input placeholder="请输入内容" size="small" v-model="treeSearch">
                                                <el-button slot="append" icon="el-icon-search" type="primary" size="small"></el-button>
                                            </el-input>
                                        </div>
                                    </div>
                                    <!--树容器-->
                                    <div class="ex-layout-carlist-content">
                                        <el-tree
                                                class="filter-tree"
                                                :data="treeData"
                                                :props="defaultProps"
                                                default-expand-all
                                                :filter-node-method="filterNode"
                                                ref="tree">
                                        </el-tree>
                                    </div>
                                </div>
                            </div>

                        </el-tab-pane>
                        <el-tab-pane><span slot="label"><i class="el-icon-star-off mg-right-1"></i> 关注车辆</span>关注车辆</el-tab-pane>
                        <el-tab-pane><span slot="label"><i class="el-icon-bangzhu mg-right-1"></i> 工地列表</span>工地列表</el-tab-pane>
                        <el-tab-pane><span slot="label"><i class="el-icon-cpu mg-right-1"></i> 消纳点列表</span>消纳点列表</el-tab-pane>
                        <el-tab-pane><span slot="label"><i class="el-icon-news mg-right-1"></i> 可疑工地</span>可疑工地</el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>/* eslint-disable quotes,no-console,semi,linebreak-style,no-var,indent,no-undef,init-declarations,camelcase,no-case-declarations */
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import * as L from 'leaflet';
import LeafletDraw from 'leaflet-draw/dist/leaflet.draw-src'
import '../common/stastic/script/zh-cn'


export default {
    data() {
        return {
            mapOption:{
                zoom: 13,
                center: L.latLng(37.870368, 112.548967),
                url: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
                subdomains: ["1", "2", "3", "4"],
                attribution: '武汉依迅',
                height: '',
                width: ''
            },
            mapOptionConfig: {
                gaode:{
                    zoom: 12,
                    center: L.latLng(37.870368, 112.548967),
                    url: 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}',
                    subdomains: ["1", "2", "3", "4"],
                    attribution: '武汉依迅',
                },
                gaodeweixing:{
                    zoom: 12,
                    center: L.latLng(37.870368, 112.548967),
                    url: 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
                    subdomains: ["1", "2", "3", "4"],
                    attribution: '武汉依迅',
                },
                google:{
                    zoom: 12,
                    center: L.latLng(37.870368, 112.548967),
                    url: 'http://mt2.google.cn/vt/lyrs=m@167000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
                    subdomains: ["1", "2", "3", "4"],
                    attribution: '武汉依迅',
                },
                googleweixing:{
                    zoom: 12,
                    center: L.latLng(37.870368, 112.548967),
                    url: 'http://mt3.google.cn/vt/lyrs=s&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
                    subdomains: ["1", "2", "3", "4"],
                    attribution: '武汉依迅',
                },
                googledixing:{
                    zoom: 12,
                    center: L.latLng(37.870368, 112.548967),
                    url: 'http://mt0.google.cn/vt/lyrs=t&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}',
                    subdomains: ["1", "2", "3", "4"],
                    attribution: '武汉依迅',
                },
                huidu:{
                    zoom: 12,
                    center: L.latLng(37.870368, 112.548967),
                    url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
                    subdomains: ["1", "2", "3", "4"],
                    attribution: '武汉依迅',
                }
            },

            mapTile: null,
            mapObj: null,
            poiSearch: '',
            vehicleSearch:'',
            treeSearch: '',
            screenWidth: document.body.clientWidth,
            screenHeight: document.body.clientHeight - 80,
            hideExample: false,
            handleCarlist: false,
            isShowStruckBox: false,
            tabPositoin: 'right',
            // 车辆列表多选框
            carListStatus:[
                {label: '行驶车辆', value: 1, selected: false, iconClass:'ex-maptool-icon truck green'},
                {label: '停车车辆', value: 2, selected: false, iconClass:'ex-maptool-icon truck green'},
                {label: '熄火车辆', value: 3, selected: false, iconClass:'ex-maptool-icon truck green'},
                {label: '定位失败', value: 4, selected: false, iconClass:'ex-maptool-icon truck yellow'},
                {label: '通讯中断', value: 5, selected: false, iconClass:'ex-maptool-icon truck gray'},
                {label: '其他', value: 6, selected: false, iconClass:'ex-maptool-icon truck green'},
            ],
            carlistData:[
                {'id': 1, 'vehicleNo': '鄂A12345', 'phoneNum': '01575848698', 'gpsTime': '2018-08-08 08:08:08', 'lat':'113.4258582', 'lng': '37.457821144'},
                {'id': 2, 'vehicleNo': '鄂A12346', 'phoneNum': '01575848698', 'gpsTime': '2018-08-08 08:08:08', 'lat':'113.4258582', 'lng': '37.457821144'},
                {'id': 3, 'vehicleNo': '鄂A12347', 'phoneNum': '01575848698', 'gpsTime': '2018-08-08 08:08:08', 'lat':'113.4258582', 'lng': '37.457821144'},
                {'id': 4, 'vehicleNo': '鄂A12348', 'phoneNum': '01575848698', 'gpsTime': '2018-08-08 08:08:08', 'lat':'113.4258582', 'lng': '37.457821144'},
                {'id': 5, 'vehicleNo': '鄂A12349', 'phoneNum': '01575848698', 'gpsTime': '2018-08-08 08:08:08', 'lat':'113.4258582', 'lng': '37.457821144'},
                {'id': 6, 'vehicleNo': '鄂A12340', 'phoneNum': '01575848698', 'gpsTime': '2018-08-08 08:08:08', 'lat':'113.4258582', 'lng': '37.457821144'},
                {'id': 7, 'vehicleNo': '鄂A12341', 'phoneNum': '01575848698', 'gpsTime': '2018-08-08 08:08:08', 'lat':'113.4258582', 'lng': '37.457821144'}
            ],
            filterText: '',
            treeData: [
                {
                id: 1,
                label: '一级 1',
                children: [{
                    id: 4,
                    label: '二级 1-1',
                    children: [{
                        id: 9,
                        label: '三级 1-1-1'
                    }, {
                        id: 10,
                        label: '三级 1-1-2'
                    }]
                }]
            }, {
                id: 2,
                label: '一级 2',
                children: [{
                    id: 5,
                    label: '二级 2-1'
                }, {
                    id: 6,
                    label: '二级 2-2'
                }]
            }, {
                id: 3,
                label: '一级 3',
                children: [{
                    id: 7,
                    label: '二级 3-1'
                }, {
                    id: 8,
                    label: '二级 3-2'
                }]
            }],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            drawnItems: {},
            drawPolylineConfig: {},
            drawPolygonConfig: {},
            drawText: {
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

            },
            oDrawLinePen: {},
            oPenStyle: {
                stroke: true,
                color: '#f06eaa',
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
            drawLocal: {
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
            },

            options: {
                allowIntersection: true,
                repeatMode: false,
                drawError: {
                    color: '#b00b00',
                    timeout: 2500
                },

                touchIcon: new L.DivIcon({
                    iconSize: new L.Point(20, 20),
                    className: 'leaflet-div-icon leaflet-editing-icon leaflet-touch-icon'
                }),
                guidelineDistance: 20,
                maxGuideLineLength: 4000,
                shapeOptions: {
                    stroke: true,
                    color: '#f06eaa',
                    weight: 2,
                    opacity: 1,
                    fill: false,
                    clickable: true
                },

                metric: true, // Whether to use the metric measurement system or imperial

                feet: true, // When not metric, to use feet instead of yards for display.
                showLength: true, // Whether to display distance in the tooltip
                //zIndexOffset: 2000 // This should be > than the highest z-index any map layers
                // is show total dist for measure
                bIsTotalDist: true
            },

            toolTipConfig:{
                mapMarkerCount: 0,
                measureString: '',
                distanceString: ''
            },
            markerConfig: {
                previousMarker:{},
                currentMarker: {},
                nextMarker: {}
            },
            markerList:[]
        }
    },
    mounted() {
        const self = this
        self.$nextTick(()=>{
            self.initMap()
        })

        window.onresize = () => {
            return (() => {
                window.screenWidth = document.body.clientWidth
                self.screenWidth = window.screenWidth
            })()
        }
    },
    methods: {
        // 初始化地图
        initMap(){
            let nWidth = window.innerWidth;
            let nHeight = window.innerHeight - 80;
            document.getElementById('mapViewContainer').style.width = nWidth + 'px';
            document.getElementById('mapViewContainer').style.height = nHeight + 'px';
            this.mapObj = L.map('mapViewContainer', this.mapOption);
            this.mapTile = L.tileLayer(this.mapOption.url, this.mapOption).addTo(this.mapObj);

        },
        // 注册地图事件
        initMapEvent(){
            this.drawnItems = new L.FeatureGroup();
            this.mapObj.addLayer(this.drawnItems);
            this.mapObj.on('click', this.clickMap, this.mapObj)
            this.mapObj.on('dblclick ', this.dbclickMap, this.mapObj)
            let self = this;

            this.mapObj.on(L.Draw.Event.CREATED, function (event) {
                var layer = event.layer;
                self.drawnItems.addLayer(layer);
                // self.drawPolylineConfig.removeHooks();

                // self.oDrawLinePen.handler.disable();
            });

            // this.mapObj.on(L.Draw.Event.DRAWSTART, function (event) {
            //
            // });
            //
            // this.mapObj.on(L.Draw.Event.DRAWSTOP, function (event) {
            //
            // });
            //
            //
            // if (!this._mouseMarker) {
            //     this._mouseMarker = L.marker(this.mapObj.getCenter(), {
            //         icon: L.divIcon({
            //             className: 'leaflet-mouse-marker',
            //             iconAnchor: [20, 20],
            //             iconSize: [40, 40]
            //         }),
            //         opacity: 0,
            //         zIndexOffset: this.options.zIndexOffset
            //     });
            // }
            //
            // if (!L.Browser.touch) {
            //     this.mapObj.on('mouseup', this._onMouseUp, this); // Necessary for 0.7 compatibility
            // }
            //
            // this._mouseMarker
            //     .on('mousedown', this._onMouseDown, this)
            //     .on('mouseout', this._onMouseOut, this)
            //     .on('mouseup', this._onMouseUp, this) // Necessary for 0.8 compatibility
            //     .on('mousemove', this._onMouseMove, this) // Necessary to prevent 0.8 stutter
            //     .addTo(this.mapObj);
            //
            // this.mapObj
            //     .on('mouseup', this._onMouseUp, this) // Necessary for 0.7 compatibility
            //     .on('mousemove', this._onMouseMove, this)
            //     .on('zoomlevelschange', this._onZoomEnd, this)
            //     //.on('click', this._onTouch, this)
            //     .on('zoomend', this._onZoomEnd, this);
        },
        dbclickMap: function(oData){
            debugger
            this.mapObj.fire('draw:drawstop', {});
        },

        clickMap: function(oData){
            // this.setMarkers(oData)
            // this.drawPolylineConfig._onMouseUp(oData);
            this.createMarker(oData.latlng, {
                className: 'rule_text_box',
                iconAnchor: [-10, 20]
            });
            // this._mouseMarker.bindTooltip('adasd').openTooltip()
            // let toolTip = this._bindToolTipMarker(oData);
            // this.updateContent(toolTip)
            // this.toolTipConfig.mapMarkerCount = this.toolTipConfig.mapMarkerCount + 1;
        },

        // 创建新的地图点
        createMarker: function (latlng, options) {

            var oTemp = L.extend({}, options, {
                // icon: this.options.icon,
                zIndexOffset: this.options.zIndexOffset * 2
            });
            var oMarker = new L.Marker(latlng, oTemp).addTo(this.mapObj);

            // this.mapObj.addLayer(oMarker);
            this.markerList.push(oMarker);
            return oMarker;
        },

        // 确定上一个点和下一个点
        setMarkers: function(oData){
            this.markerConfig.previousMarker = this.markerConfig.currentMarker;
            this.markerConfig.currentMarker = oData;
        },

        // 绑定弹窗
        _bindToolTipMarker: function(oData){
            let labelText = '';
            let showLength = this.options.showLength;
            if(this.toolTipConfig.mapMarkerCount == 0){
                labelText = {
                    text: this.drawText.Dist._getTooltipText.start
                };
            }else{
                this.toolTipConfig.distanceString = showLength ? this.drawPolylineConfig._getMeasurementString() : '';

                if (this.toolTipConfig.mapMarkerCount === 1) {
                    labelText = {
                        text: this.drawText.Dist._getTooltipText.cont,
                        subtext: this.toolTipConfig.distanceString
                    };
                } else {
                    labelText = {
                        text: this.drawText.Dist._getTooltipText.end,
                        subtext: this.toolTipConfig.distanceString
                    };
                }
            }
            return labelText;
        },

        updateContent: function (labelText) {
            if (!this._container) {
                return this;
            }
            labelText.subtext = labelText.subtext || '';

            // update the vertical position (only if changed)
            if (labelText.subtext.length === 0 && !this._singleLineLabel) {
                L.DomUtil.addClass(this._container, 'leaflet-draw-tooltip-single');
                this._singleLineLabel = true;
            }
            else if (labelText.subtext.length > 0 && this._singleLineLabel) {
                L.DomUtil.removeClass(this._container, 'leaflet-draw-tooltip-single');
                this._singleLineLabel = false;
            }

            this._container.innerHTML =
                (labelText.subtext.length > 0 ? '<span class="leaflet-draw-tooltip-subtext">' + labelText.subtext + '</span>' + '<br />' : '') +
                '<span>' + labelText.text + '</span>';

            return this;
        },

        // 画图测距之类的
        handleDrawMap(command){
            if(command == 'checkLine'){
                this._oMarkerMgr = new L.MarkerMgr(this.mapObj, this);
                this.drawPolylineConfig = new L.Draw.Polyline(this.mapObj,this);
                this.initMapEvent();
                this.oDrawLinePen = {
                    enabled: {shapeOptions: this.oPenStyle},
                    handler: new L.Draw.Polyline(this.mapObj, {shapeOptions: this.oPenStyle}),
                    title: this.drawLocal.draw.toolbar.buttons.polyline
                };

                this.oDrawLinePen.handler.enable();
            }
        },

        // 改变地图
        handleChangeMap: function(command){
            // this.mapObj.options.url = this.mapOptionConfig[command].url
            this.mapTile = L.tileLayer(this.mapOptionConfig[command].url, this.mapOptionConfig[command]).addTo(this.mapObj);
            this.mapObj.invalidateSize(true);
        },

        // 刷新地图
        refleshMap() {
            let oContainer = document.getElementById('mapViewContainer');
            let nWidth = window.innerWidth;
            let nHeight = window.innerHeight - 80;
            oContainer.style.width = nWidth + 'px';
            oContainer.style.height = nHeight + 'px';
            this.mapObj.invalidateSize({animate:true,pan:false,debounceMoveend:false});
        },
        // 处理地图图例点击事件
        handleExample(){
            this.hideExample = !this.hideExample
        },
        // 处理车辆列表显示隐藏
        handleCarlistFunc(){
            this.handleCarlist = !this.handleCarlist
        },
        // 跟踪车辆
        handleFollow(item){

        },
        // 轨迹
        handleTrack(item){

        },
        // 详情
        handleVehicleDetail(item){

        },
        // 树结构数据筛选方法
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        // 地图右侧菜单鼠标上移事件
        enterTab(){
            document.getElementsByClassName('ex-layout-map-menu')[0].style.right = '0px';
            let nWidth = document.getElementsByClassName('ex-layout-map-menu')[0].style.width;
        },
        // 地图右侧菜单鼠标移除事件
        leaveTab(){
            document.getElementsByClassName('ex-layout-map-menu')[0].style.right = '-95px';
        },
    },
    watch: {
        // 监听窗口大小改变地图画布大小
        screenWidth (val) {
            this.screenWidth = val
            this.refleshMap()
        },
        // 监听输入数据 改变树的数据
        treeSearch(val) {
            this.$refs.tree.filter(val);
        },
        handleCarlist(v){
            if(v){
                document.getElementsByClassName('mapTool').style.right = '32rem'
            }else{
                document.getElementsByClassName('mapTool').style.right = '18rem'
            }
        }
    }
}
</script>

<style lang="scss">
    @import "~leaflet/dist/leaflet.css";
    @import "~leaflet-draw/dist/leaflet.draw.css";
    *{list-style: none;outline: none;}
    .clearfix {clear: both;}
    .leaflet-div-icon{    background: transparent !important;border: none !important;}
    .mg-right-1{margin-right: 1rem}
    .slideup.in {-webkit-transform: translateY(0);-webkit-animation-name: slideinfrombottom;-webkit-animation-duration: 250ms;transform: translateY(0);animation-name: slideinfrombottom;animation-duration: 250ms;}
    .in {-webkit-animation-timing-function: ease-out;-webkit-animation-duration: 350ms;animation-timing-function: ease-out;animation-duration: 350ms;}
    .ex-layout-maptool{
        background-color: #fff;position: absolute;z-index: 1030;box-shadow: 0 3px 3px rgba(0,0,0,.15);border-radius: .4rem;padding: 0 !important;

        .ex-maptool-box{
            background-color: #d0d4df; color: #fff; line-height: 2.5; cursor: pointer; float: left; padding: 0 0.55rem; min-height: 2.8rem;
        }
        .ex-maptool-box:first-child { border-top-left-radius: .4rem; border-bottom-left-radius: .4rem; }
        .ex-maptool-box:last-child { border-top-right-radius: .4rem; border-bottom-right-radius: .4rem; }
        .ex-maptool-box-white { background-color: #fff; color: #585858; }
        .ex-maptool-search-box{
            width: 300px;position: relative;display: table;border-collapse: separate;
            .ec-input-group-btn{
                position: relative;font-size: 0;white-space: nowrap;width: 1%;display: table-cell;
            }
        }
    }
    .left-panel{left: 1rem;}
    .right-panel{right:18rem;}
    .top-panel{top:1rem;}
    .bottom-panel{bottom:1.5rem;}
    .ex-maptool-box .el-dropdown{
        .el-button{border: inherit;}
    }

    .ex-layout-type-wbox{
        position: absolute;z-index: 1010;background: #fff;border-radius: 10px 10px 0 0;
        .ex-maptool-type {
            float: left;
            margin-left: .55rem;
            background-color: #fff;
            h3{
                line-height: 2.2;padding: 0 .75rem;background-color: #4a71d4;color: #fff;font-size: 1.2rem;
                :first-child {
                    border-radius: .4rem .4rem 0 0;
                }
                .ec-align-icon{float: left; margin-right: 1.6rem;margin-bottom: 0;cursor: pointer}
            }
        }
        .ex-layout-map-example{}
    }
    .ex-layout-type-wbox.hideExample{
        right:-9.5rem!important;
        transition: right 1s;
        -moz-transition: right 1s; /* Firefox 4 */
        -webkit-transition: right 1s; /* Safari 和 Chrome */
        -o-transition: right 1s; /* Opera */
    }
    .ex-layout-map-type-box{
        min-width: 10rem;
        .ex-layout-map-example-title{
            cursor: pointer;
            background: #4a71d4;color:#fff;line-height: 2;padding-left: 1rem;padding-right: 2rem;border-radius: 10px 10px 0 0;
            span{margin-left: 1rem;}
        }
        .ex-layout-map-example{
            padding-left: 0;
            li{position: relative;line-height: 2.2;font-size: 0.85rem;padding: 0 1rem}
        }
    }

    /**地图工具图标*/
    .ex-maptool-icon {
        display: block; width: 18px; height: 16px; background: url('../common/stastic/img/ex_default/map_script.png') no-repeat; float: left; margin: 0.55rem .55rem 0 0;cursor:default
    }
    .ex-maptool-icon.truck.green { background-position: -360px 0; }
    .ex-maptool-icon.truck.yellow { background-position: -380px 0; }
    .ex-maptool-icon.truck.red { background-position: -400px 0; }
    .ex-maptool-icon.truck.gray { background-position: -420px 0; }
    .ex-maptool-icon.truck-state.online { background-position: -360px -40px; }
    .ex-maptool-icon.truck-state.offline { background-position: -380px -40px; }
    .ex-maptool-icon.truck-state.wireless { background-position: -400px -40px; }
    .ex-maptool-icon.site.no-report { background-position: -360px -80px; }
    .ex-maptool-icon.site.now { background-position: -380px -80px; }
    .ex-maptool-icon.site.alert { background-position: -420px -80px; }
    .ex-maptool-icon.site.temp-site { background-position: -400px -80px; }
    .ex-maptool-icon.site.hacked { background-position: -440px -80px; }
    .ex-maptool-icon.law-car { background-position: -360px -100px; }
    .ex-maptool-icon.user { background-position: -380px -100px; }
    .ex-maptool-icon.unload.normal { background-position: -400px -100px; }
    .ex-maptool-icon.unload.hacked { background-position: -420px -100px; }
    .ex-maptool-icon.unload.bayonet{background-position: -460px -100px}
    .ex-maptool-icon.environ { background-position: -440px -100px; }
    .ex-maptool-icon.grid { background-position: -460px -100px; }
    .ex-maptool-icon.environ.excellent { background-position: -340px -140px; }
    .ex-maptool-icon.environ.nice { background-position: -360px -140px; }
    .ex-maptool-icon.environ.good { background-position: -380px -140px; }
    .ex-maptool-icon.environ.light { background-position: -400px -140px; }
    .ex-maptool-icon.environ.middle { background-position: -420px -140px; }
    .ex-maptool-icon.environ.grave { background-position: -440px -140px; }
    .ex-maptool-icon.environ.weighty { background-position: -460px -140px; }
    .ex-maptool-icon.star.on { background-position: -340px -180px; }
    .ex-maptool-icon.star.off { background-position: -360px -180px; }
    .ex-maptool-icon.signal.on { background-position: -380px -180px; }
    .ex-maptool-icon.signal.off { background-position: -400px -180px; }
    .ex-maptool-icon.noise { background-position: -382px -140px; }/*扬尘噪音*/

    /**地图右侧菜单栏*/
    .ex-layout-map-menu{
        position: absolute;z-index: 1032;height: calc(100% - 20px);right:-95px;top:0;padding: 10px 0;-moz-transition: right 1s; -webkit-transition: right 1s; -o-transition: right 1s;
        .el-tabs{
            height: 100%;
            .el-tabs__header{
                background-color: #4a71d4;
                margin-left: inherit!important;
                span{color:#fff;}
            }
            .el-tabs__item:hover{background-color: #f5690c;}
            .el-tabs__item.is-active{background-color: #f5690c;}
            .el-tabs__content{height: 100%;background: #fff;}
            .el-tab-pane{height: 100%}
        }
    }

    /**车辆列表*/
    .ex-layout-carlist{
        background-color: #f8f8f8;box-shadow: -3px 0px 8px rgba(0,0,0,.15), inset -3px 0px 8px rgba(0,0,0,.15);height: 100%;position: relative;top: 0;right: 0;overflow: hidden;z-index: 1011;opacity: 1;float: left;
        .ex-layout-carlist-title{
            background-color: #4a71d4;color: #fff; width: 100%;height: 40px;line-height: 40px;padding: 0 2rem; font-size: 14px;font-weight: bolder;
        }
        /*车辆列表中间样式*/
        .ex-layout-carlist-wrap{
            position: absolute;top: 40px;left: 0;width: 100%;height: 100%;
            .ex-layout-struckbox-search {
                width: 92%;margin: .5rem auto;
                .search-group{
                    position: relative;display: table;border-collapse: separate;width: 80%;float: left;
                }
                .ex-layout-carlist-query{
                    position: relative;float: right;width: 18%;border: 1px solid #dfdfdf;height: 30px;line-height: 30px;background: #fff;border-radius: 4px;cursor: pointer;
                    .ex-carlist-query-btn{
                        padding: 12px 9px 13px;
                        i{margin-top: -5px;}
                    }
                }
            }
            .ex-layout-carlist-content {
                height: calc(100% - 114px );overflow-x: hidden;padding: 7px;
                ul{
                    padding: 0;
                    margin: 0;
                    li{
                        padding: .35rem;display: list-item;
                        .carlist-card:hover, .carlist-card:focus{box-shadow: 0 0 1.2rem #f60;}
                        .carlist-card{
                            cursor: pointer;
                            margin-bottom: .25rem;
                            background: rgba(255,255,255,.85);
                            background: -moz-linear-gradient(top, #ffffff 0%, #efefef 100%);
                            background: -webkit-linear-gradient(top, #ffffff 0%,#efefef 100%);
                            background: linear-gradient(to bottom, #ffffff 0%,#efefef 100%);
                            filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ffffff', endColorstr='#efefef',GradientType=0 );
                            border-radius: .4rem;
                            width: 100%;
                            padding: .25rem;
                            box-shadow: 0 1px 2px rgba(0,0,0,.15);
                            .carlist-icon-star{float: right;margin-right: 5px}
                            i{
                                float: left; width: 30px; height: 40px; display: block; color: #fff; font-weight: 700; font-style: normal; margin-right: .25rem; text-align: center; line-height: 22px; background: url('../common/stastic/img/ex_default/map_script.png') no-repeat; background-position: 0 0; text-shadow: 0 1px 1px rgba(0,0,0,.15);
                            }
                            i.green { background-position: 0 -40px; }
                            i.yellow { background-position: -30px -40px; }
                            i.red { background-position: -60px -40px; }
                            i.gray { background-position: -90px -40px; }
                            /*车辆在线状态*/
                            i.online { background-position: 0 -100px; }
                            i.offline { background-position: -30px -100px; }
                            i.wireless { background-position: -60px -100px; }
                        }
                        .carlist-title { width: 60%;white-space: nowrap;float: left;box-sizing: border-box;}
                        .carlist-title .num { margin: 0;line-height: 1.6;font-size: 16px;color: #585858; }
                        .carlist-title .time { margin: 0;line-height: 2;font-size: 13px;color: #999; }
                        .carlist-fav { position: absolute; right: 1rem; color: #ffad44; }
                    }
                    li.ec-active .carlist-card { box-shadow: 0 0 1.2rem #f60; }
                }
                .carlist-bottom {clear: both;line-height: 1.9;color: #585858;}
            }
        }
        /*页脚样式*/
        .ex-layout-carlist-page {
            position: absolute;right: 0;bottom: 0;width: 100%; text-align: center;background: #fff;
        }
    }

    /**组织架构列表*/
    .ex-layout-struckbox{
        background-color: #f8f8f8;box-shadow: -3px 0px 8px rgba(0,0,0,.15), inset -3px 0px 8px rgba(0,0,0,.15);height: 100%;position: relative;top: 0;right: 0;overflow: hidden;z-index: 1011;opacity: 1;float: left;min-width: 220px;
        .ex-layout-carlist-title{
            background-color: #4a71d4;color: #fff; width: 100%;height: 40px;line-height: 40px;padding: 0 2rem; font-size: 14px;font-weight: bolder;
        }
        /*车辆列表中间样式*/
        .ex-layout-carlist-wrap{
            position: absolute;top: 40px;left: 0;width: 100%;height: 100%;
            .ex-layout-struckbox-search {
                width: 92%;margin: .5rem auto;
                .search-group{
                    position: relative;display: table;border-collapse: separate;width: 100%;float: left;
                }
            }
            .ex-layout-carlist-content {
                height: calc(100% - 114px );overflow-x: hidden;padding: 7px;float: left;width: 90%;
                .el-tree{background: inherit}
            }
        }

    }

    /*测距样式*/
    .rule_text_box { float: left; white-space: nowrap; background-color: #fff; padding: 0 .5rem; border: 1px solid #f60; border-radius: 3px; box-shadow: 0 3px 5px rgba(0,0,0,.25); }
    /*leaflet.label 样式*/
    .leaflet-label { background: rgb(235, 235, 235); background: rgba(235, 235, 235, 0.81); background-clip: padding-box; border-color: #777; border-color: rgba(0,0,0,0.25); border-radius: 4px; border-style: solid; border-width: 4px; color: #111; display: block; font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif; font-weight: bold; padding: 1px 6px; position: absolute; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none; white-space: nowrap; z-index: 6; }
    .leaflet-label.leaflet-clickable { cursor: pointer; pointer-events: auto; }
    .leaflet-label:before,
    .leaflet-label:after { border-top: 6px solid transparent; border-bottom: 6px solid transparent; content: none; position: absolute; top: 5px; }
    .leaflet-label:before { border-right: 6px solid black; border-right-color: inherit; left: -10px; }
    .leaflet-label:after { border-left: 6px solid black; border-left-color: inherit; right: -10px; }
    .leaflet-label-right:before,
    .leaflet-label-left:after { content: ""; }

    /*leaflet.label 样式 结束*/

</style>
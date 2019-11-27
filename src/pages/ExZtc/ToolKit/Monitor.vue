<template>
  <div class="ex-pages-bigdata">
    <Header
      v-on:openReports="openReports"
      v-on:pantoPoi="pantoPoi"
      v-on:changeRegion="changeRegion"
    />
    <Stastic :mRadius="mRadius" :StasticData="StasticData" />

    <el-amap
      :vid="'amap-vue-monitor'"
      :center="mapOptions.center"
      :zoom="mapOptions.zoom"
      :zooms="mapOptions.zooms"
      :viewMode="'2D'"
      :mapStyle="mapOptions.mapStyle"
      :pitch="mapOptions.pitch"
      :rotation="mapOptions.rotation"
      :features="mapOptions.features"
      :showLabel="mapOptions.showLabel"
      :resizeEnable="mapOptions.resizeEnable"
      :buildingAnimation="mapOptions.buildingAnimation"
      :expandZoomRange="mapOptions.expandZoomRange"
      :animateEnable="mapOptions.animateEnable"
      :events="events"
      :amap-manager="amapManager"
      style="width:100%;height:100%"
    >
      <div>
        <!-- 工地 -->
        <!-- <el-amap-marker
          v-for="(marker, index) in siteListData"
          :position="[marker.GeoLng,marker.GeoLat]"
          :icon="marker.icon"
          :vid="index"
          :zIndex="5"
          v-if="toolSwitch.siteShow"
        ></el-amap-marker>-->
        <!-- 消纳点 -->
        <!-- <el-amap-marker
          v-for="(marker, index) in uploadListData" :key="index"
          :position="[marker.GeoLng,marker.GeoLat]"
          :icon="marker.icon"
          :vid="index"
          :zIndex="5"
          v-if="toolSwitch.uploadShow"
        ></el-amap-marker>-->
        <el-amap-marker
          v-for="(marker, index) in uploadListData"
          :key="index"
          :position="[marker.GeoLng,marker.GeoLat]"
          :icon="marker.icon"
          :vid="index"
          :zIndex="5"
        ></el-amap-marker>
      </div>
      <!-- 车辆信息窗 -->
      <el-amap-info-window
        :position="infoWindow.position"
        :showShadow="true"
        :autoMove="true"
        :closeWhenClickMap="true"
        :visible="infoWindow.visible"
        :events="infoWindow.events"
        :offset="[17,-30]"
      >
        <div>
          <h3>
            {{infoWindow.VecNo}} - {{infoWindow.vecState.EnterpriseName}}
            <div
              class="vec-state"
              :class="infoWindow.vecState.stateClass"
            >{{infoWindow.vecState.DeviceStatusStr}}</div>
            <div class="vec-stateus">
              <i class="ex-icon ex-icon-xinhao" :class="{'on':infoWindow.vecState.ConectStatus}"></i>
              <i class="ex-icon ex-icon-weixing" :class="{'on':infoWindow.vecState.DWStatus}"></i>
            </div>
          </h3>

          <ul class="vec-content">
            <li class="vec-speed">
              <h5>速度:</h5>
              <div>
                {{infoWindow.vecState.Speed}}
                <sub>km/h</sub>
              </div>
            </li>
            <li class="vec-cover">
              <h5>顶棚:</h5>
              <div>{{infoWindow.vecState.coverState}}</div>
            </li>
            <li class="vec-direction">
              <h5>载重:</h5>
              <!-- <div :style="{transform:'rotate('+infoWindow.vecState.dirState+'deg)'}">
                <i class="el-icon-position"></i>
              </div>-->
            </li>
          </ul>
          <div class="vec-time">最后定位时间：{{infoWindow.vecState.LastDWTime}}</div>
          <div class="vec-address">最后定位位置：{{infoWindow.vecState.SerAddress}}</div>
          <el-button-group>
            <el-button
              type="primary"
              size="small"
              icon="el-icon-copy-document"
              @click="infoDetail"
            >详情</el-button>
            <el-button type="primary" size="small" icon="el-icon-place" @click="watchThis">跟踪</el-button>
            <el-dropdown @command="hisTrackThis">
              <el-button
                type="warning"
                size="small"
                icon="el-icon-timer"
                v-show="!hisTrackLoading"
                @click="hisTrackThis"
              >回溯</el-button>
              <el-button
                type="warning"
                size="small"
                icon="el-icon-loading"
                :disabled="true"
                v-show="hisTrackLoading"
                @click="hisTrackThis"
              >回溯...</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="600000">10分钟内</el-dropdown-item>
                <el-dropdown-item command="1800000">30分钟内</el-dropdown-item>
                <el-dropdown-item command="3600000">1小时内</el-dropdown-item>
                <el-dropdown-item command="7200000">2小时内</el-dropdown-item>
                <el-dropdown-item command="18000000">源头回溯</el-dropdown-item>
                <el-dropdown-item command="track">更多轨迹</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button type="primary" size="small" icon="el-icon-refrigerator">违规</el-button>
            <el-button type="primary" size="small" icon="el-icon-key">指令</el-button>
          </el-button-group>
        </div>
      </el-amap-info-window>

      <!-- 工地信息窗 -->
      <el-amap-info-window
        :position="siteWindow.siteData.LngLat"
        :showShadow="true"
        :autoMove="true"
        :closeWhenClickMap="true"
        :visible="siteWindow.visible"
        :events="siteWindow.events"
        :offset="[17,-30]"
      >
        <div>
          <h3>{{siteWindow.siteData.Name}} - {{siteWindow.siteData.DepartmentName}}</h3>
          <ul class="vec-content">
            <li class="vec-speed">
              <h5>工地状态:</h5>
              <div>{{siteWindow.siteData.Poi.SiteState}}</div>
            </li>
            <li class="vec-cover">
              <h5>门禁过车数量:</h5>
              <div>{{siteWindow.siteData.ControlCarRecordCount}}</div>
            </li>
            <li class="vec-direction">
              <h5>门禁上线状态:</h5>
              <div>{{siteWindow.siteData.Online}}</div>
            </li>
          </ul>
          <div class="vec-address">位置：{{siteWindow.siteData.Address}}</div>
          <el-button-group>
            <!-- <el-button type="primary" size="small" icon="el-icon-copy-document">详情</el-button> -->
            <el-button
              type="primary"
              size="small"
              icon="el-icon-place"
              v-if="siteWindow.siteData.ControlCarRecordCount >0"
              @click.native="showCross(siteWindow.siteData.CloudMapId)"
            >过车记录(日)</el-button>
            <!-- <el-button type="primary" size="small" icon="el-icon-refrigerator">工地视频</el-button> -->
            <!-- <el-button type="primary" size="small" icon="el-icon-key">门禁指令</el-button> -->
          </el-button-group>
        </div>
      </el-amap-info-window>

      <!-- 24小时过车记录 -->
      <reDialog
        v-dialogDrag
        :title="'24小时内 '+detaileDialog.siteCross.recodeData.length+' 辆渣土车进入'+siteWindow.siteData.Name"
        :modal="false"
        :modal-append-to-body="false"
        :append-to-body="true"
        width="960px"
        height="480px"
        :visible.sync="detaileDialog.siteCross.show"
      >
        <el-table :data="detaileDialog.siteCross.recodeData" height="480px" style="width: 100%">
          <el-table-column prop="VehicleNo" align="center" sortable label="车牌号" width="120"></el-table-column>
          <el-table-column prop="RecTime" align="center" sortable label="记录时间" width="180"></el-table-column>
          <el-table-column prop="Note" align="center" label="在线状况"></el-table-column>
          <el-table-column prop="CompanyName" align="center" label="所属企业"></el-table-column>
          <el-table-column prop="PicAddress" align="center" label="抓拍照片">
            <template slot-scope="scope">
              <a
                :href="'http://ztc.comlbs.com/Files/GuardImg/'+scope.row.PicAddress"
                target="_blank"
              >
                <img
                  :src="'http://ztc.comlbs.com/Files/GuardImg/'+scope.row.PicAddress"
                  style="height:80px;"
                />
              </a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="查看轨迹">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain @click="hisTrackSearch(scope.row)">轨迹</el-button>
            </template>
          </el-table-column>
        </el-table>
      </reDialog>

      <!-- 跟踪窗口 -->
      <reDialog
        v-dialogDrag
        title="车辆跟踪"
        :modal="false"
        :modal-append-to-body="false"
        :append-to-body="true"
        width="480px"
        :visible.sync="detaileDialog.dialogWatchVisible"
      >
        <ul class="map-watch-list">
          <li v-for="(item,index) in watchList" :key="index">{{item.VecNo}}</li>
        </ul>
      </reDialog>

      <!-- 详情窗口 -->
      <reDialog
        v-dialogDrag
        :title=" infoWindow.VecNo + ' - '+ infoWindow.vecState.EnterpriseName"
        :modal="false"
        :modal-append-to-body="false"
        :append-to-body="true"
        width="480px"
        :visible.sync="detaileDialog.dialogTableVisible"
      >
        <div class="vec-stateus">
          <span style="margin-right:25px;">{{infoWindow.vecState.DeviceStatusStr}}</span>
          <i class="ex-icon ex-icon-xinhao" :class="{'on':infoWindow.vecState.ConectStatus}"></i>
          <i class="ex-icon ex-icon-weixing" :class="{'on':infoWindow.vecState.DWStatus}"></i>
        </div>
        <el-tabs v-model="detaileDialog.activeDetailName" :stretch="true" @tab-click="changeTab">
          <el-tab-pane label="车辆详情" name="vechileinfo">
            <ul class="vec-content">
              <li class="vec-speed">
                <h5>速度:</h5>
                <div>
                  {{infoWindow.vecState.Speed}}
                  <sub>km/h</sub>
                </div>
              </li>
              <li class="vec-cover">
                <h5>顶棚:</h5>
                <div>{{infoWindow.vecState.coverState}}</div>
              </li>
              <li class="vec-direction">
                <h5>方向:</h5>
                <div :style="{transform:'rotate('+infoWindow.vecState.dirState+'deg)'}">
                  <i class="el-icon-position"></i>
                </div>
              </li>
            </ul>
            <div class="vec-time">最后定位时间：{{infoWindow.vecState.LastDWTime}}</div>
            <div class="vec-address">最后定位位置：{{infoWindow.vecState.SerAddress}}</div>
            <el-button-group>
              <el-button type="primary" size="small" icon="el-icon-place" @click="watchThis">跟踪</el-button>
              <el-button type="primary" size="small" icon="el-icon-refrigerator">违规</el-button>
              <el-button type="primary" size="small" icon="el-icon-key">指令</el-button>
            </el-button-group>
          </el-tab-pane>
          <el-tab-pane label="违规信息" name="breakrule">违规信息</el-tab-pane>
          <el-tab-pane label="当日运输" name="transport">当日运输</el-tab-pane>
          <el-tab-pane label="指令下发" name="instructions">指令下发</el-tab-pane>
        </el-tabs>
      </reDialog>

      <!-- 工具栏 -->
      <el-tooltip content="工具栏" placement="left">
        <el-button
          @click="toolSwitch.toolShow = true"
          size="small"
          icon="el-icon-set-up"
          class="map-layout"
          style="top:55px;"
        />
      </el-tooltip>

      <!-- 刷新地图 -->
      <el-tooltip content="刷新地图" placement="left">
        <el-button
          @click="refreshMap"
          size="small"
          icon="el-icon-loading"
          class="map-layout"
          style="top:105px;"
          v-if="toolSwitch.refreshShow"
        />
        <el-button
          @click="refreshMap"
          size="small"
          icon="el-icon-refresh-right"
          class="map-layout"
          style="top:105px;"
          v-if="!toolSwitch.refreshShow"
        />
      </el-tooltip>

      <MapRadius :mRadius="mRadius" v-on:changeMRadius="changeMRadius" />

      <!-- 工具栏切换 -->
      <el-drawer
        title="工具栏"
        :visible.sync="toolSwitch.toolShow"
        size="330px"
        class="map-tips"
        direction="rtl"
      >
        <el-form label-width="120px">
          <el-form-item label="卫星图:">
            <el-switch v-model="toolSwitch.satelliteShow" @change="changeSatellite"></el-switch>
          </el-form-item>
          <el-form-item label="路网:" v-if="toolSwitch.satelliteShow">
            <el-switch v-model="toolSwitch.roadNetLayerShow" @change="changeRoadNetLayer"></el-switch>
          </el-form-item>
          <el-form-item label="车流量热力图:">
            <el-switch v-model="toolSwitch.trafficShow" @change="changeTraffic"></el-switch>
          </el-form-item>
          <el-form-item label="工地名称:">
            <el-switch v-model="toolSwitch.siteShow" @change="changeSiteShow"></el-switch>
          </el-form-item>
          <el-form-item label="显示消纳点:">
            <el-switch v-model="toolSwitch.uploadShow"></el-switch>
          </el-form-item>
          <el-form-item label="在线车辆">
            <el-switch v-model="toolSwitch.onlineShow" @change="changeOnlineShow"></el-switch>
          </el-form-item>
          <el-form-item label="预警及离线车辆">
            <el-switch v-model="toolSwitch.blackShow" @change="changeBlackShow"></el-switch>
          </el-form-item>
          <el-form-item label="渣土车车流量:">
            <el-switch v-model="toolSwitch.flowline"></el-switch>
          </el-form-item>
          <el-form-item label="监控范围:">
            <el-switch v-model="toolSwitch.radiusShow" @change="changeRadius"></el-switch>
          </el-form-item>
        </el-form>
      </el-drawer>

      <!-- 统计报表切换 -->
      <el-drawer
        title="监控报表"
        :visible.sync="toolSwitch.stasticShow"
        :modal="false"
        size="90%"
        class="map-tips"
        direction="btt"
      >
        <el-tabs v-model="reportTable.activeName">
          <el-tab-pane label="车辆列表" name="vechileList">
            <VecTable v-on:pinToV="pinToV" />
          </el-tab-pane>
          <el-tab-pane label="工地列表" name="siteList">
            <siteTable
              :siteTableData="siteTableData"
              v-on:getSiteList="getSiteList"
              v-on:pinToS="pinToS"
              v-on:toMapMarker="toMapMarker"
            />
          </el-tab-pane>
          <el-tab-pane label="企业列表" name="companyList">
            <div class="table-query">
              <el-form :inline="true" size="mini">
                <el-form-item label="企业名称">
                  <el-input placeholder="请输入企业名称"></el-input>
                </el-form-item>
                <el-form-item label="切换区域:">
                  <el-dropdown @command="changeRegion" size="mini">
                    <el-button icon="el-icon-map-location" size="mini">
                      {{cityRegion}}
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="武汉市">武汉市</el-dropdown-item>
                      <el-dropdown-item command="硚口区">硚口区</el-dropdown-item>
                      <el-dropdown-item command="江汉区">江汉区</el-dropdown-item>
                      <el-dropdown-item command="江岸区">江岸区</el-dropdown-item>
                      <el-dropdown-item command="汉阳区">汉阳区</el-dropdown-item>
                      <el-dropdown-item command="汉南区">汉南区</el-dropdown-item>
                      <el-dropdown-item command="青山区">青山区</el-dropdown-item>
                      <el-dropdown-item command="武昌区">武昌区</el-dropdown-item>
                      <el-dropdown-item command="洪山区">洪山区</el-dropdown-item>
                      <el-dropdown-item command="江夏区">江夏区</el-dropdown-item>
                      <el-dropdown-item command="蔡甸区">蔡甸区</el-dropdown-item>
                      <el-dropdown-item command="东西湖区">东西湖区</el-dropdown-item>
                      <el-dropdown-item command="黄陂区">黄陂区</el-dropdown-item>
                      <el-dropdown-item command="新洲区">新洲区</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
              </el-form>
            </div>

            <el-table :data="reportTable.companyData" max-height="700" border style="width: 100%">
              <el-table-column prop="Name" label="企业简称"></el-table-column>
              <el-table-column prop="DistName" align="center" sortable label="所属区域" width="180"></el-table-column>
              <el-table-column prop="TotalCount" align="center" sortable label="车辆总数"></el-table-column>
              <el-table-column prop="OnlineRate" align="center" sortable label="在线率(已安装)"></el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-drawer>

      <div class="map-tool-pin" :style="{'left':showPin.left,'top':showPin.top}">
        <el-tooltip content="钉住线路">
          <el-button
            type="success"
            size="mini"
            v-if="showPin.show"
            icon="el-icon-paperclip"
            @click="pinHisPolyline"
            circle
          ></el-button>
        </el-tooltip>

        <el-tooltip content="清除">
          <el-button
            type="danger"
            size="mini"
            v-if="showDeletePoly.show"
            icon="el-icon-delete"
            @click="deleteHisPolyline"
            circle
          ></el-button>
        </el-tooltip>
      </div>
    </el-amap>
    <Copyright />
    <MapTips />
    <HisTrackWd :vecData="trackWdData" />
  </div>
</template>
<script>
import api from "../Configs/api";
import axios from "axios";
import Util from "../Configs/util.lib";
import VueAMap from "vue-amap";
let amapManager = new VueAMap.AMapManager();

let wgs84togcj02 = require("../../../common/plugin/gps").wgs84togcj02;

import Vue from "vue";
import ViewUI from "view-design";
Vue.use(ViewUI);

import Header from "../Components/header.vue";
import Stastic from "../Components/stastic.vue";
import Copyright from "../Components/copyright.vue";
import MapTips from "../Components/maptips.vue";
import HisTrackWd from "../Components/histrack.vue";
import MapRadius from "../Components/changeradius.vue";

import VecTable from "../Components/Reports/vechileList.vue";
import siteTable from "../Components/Reports/siteList.vue";

let dataID = null,
  siteId = null,
  hisId = null,
  loadingId = null;
export default {
  components: {
    Header,
    Stastic,
    Copyright,
    MapTips,
    HisTrackWd,
    MapRadius,
    VecTable,
    siteTable
  },
  data() {
    let self = this;
    return {
      mapOptions: {
        mapStyle: "amap://styles/whitesmoke", //whitesmoke //8ef17ea2354d5c3d45ec46141986a67b',//样式URL
        zoom: 10,
        zooms: [1, 22],
        showLabel: true,
        resizeEnable: true,
        animateEnable: true,
        features: ["bg", "point", "road", "building"],
        center: [114.34253, 30.49984], // 宜昌[111.28642, 30.69186],
        pitch: 0,
        rotation: 0,
        buildingAnimation: true, //楼块出现是否带动画
        expandZoomRange: true
      },
      amapManager,
      mapObj: null,
      truckMarkerGps: [],
      events: {
        //初始化地图
        init(instance) {
          let that = this;
          self.mapObj = amapManager.getMap();
          //车辆聚合初始化
          self.vecMarkers = new AMap.OverlayGroup();

          let vecClusteImg = require("../../../stastic/img/ExZtc/alerm_vec_cluste_bg.png");
          var _renderVecClusterMarker = function(context) {
            var factor = Math.pow(context.count / context.count, 1 / 18);
            var div = document.createElement("div");
            div.style.background = "url(" + vecClusteImg + ") center no-repeat";
            var size = Math.round(
              30 + Math.pow(context.count / context.count, 1 / 5) * 20
            );
            // console.log(context.count);
            div.style.width = size + "px";
            div.style.height = size + 6 + "px";
            div.innerHTML = context.count;
            div.style.lineHeight = size + "px";
            div.style.color = "#fff";
            div.style.fontSize = "15px";
            div.style.textAlign = "center";
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
            context.marker.setContent(div);
          };

          self.clusterVechile = new AMap.MarkerClusterer(self.mapObj, [], {
            gridSize: 50,
            minClusterSize: 10,
            renderClusterMarker: _renderVecClusterMarker
          });

          self.clusterOnlineVechile = new AMap.MarkerClusterer(
            self.mapObj,
            [],
            {
              gridSize: 1,
              minClusterSize: 50
            }
          );

          //工地聚合初始化
          let siteClusteImg = require("../../../stastic/img/ExZtc/site_cluste_bg.png");
          var _renderClusterMarker = function(context) {
            var factor = Math.pow(context.count / context.count, 1 / 18);
            var div = document.createElement("div");
            div.style.background =
              "url(" + siteClusteImg + ") center no-repeat";
            var size = Math.round(
              30 + Math.pow(context.count / context.count, 1 / 5) * 20
            );
            div.style.width = size + "px";
            div.style.height = size + 6 + "px";
            div.innerHTML = context.count;
            div.style.lineHeight = size + "px";
            div.style.color = "#fff";
            div.style.fontSize = "15px";
            div.style.textAlign = "center";
            context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
            context.marker.setContent(div);
          };
          self.siteMonitorGroup = new AMap.OverlayGroup([]);
          self.mapObj.add(self.siteMonitorGroup);
          self.clusterSite = new AMap.MarkerClusterer(self.mapObj, [], {
            gridSize: 50,
            renderClusterMarker: _renderClusterMarker
          });

          //工地围栏
          self.sitePath = new AMap.Polygon({
            map: self.mapObj,
            strokeColor: "#008aff",
            strokeWeight: 3,
            strokeOpacity: 0.5,
            fillColor: "#008aff",
            fillOpacity: 0.15,
            zIndex: 110
          });
          self.sitePathGroup = new AMap.OverlayGroup([]);
          self.mapObj.add(self.sitePathGroup);

          //范围控制
          self.mCenterMker = new AMap.Marker({
            id: 1000000,
            map: self.mapObj,
            icon: new AMap.Icon({
              size: new AMap.Size(18, 29),
              image: require("../../../stastic/img/ExZtc/singlecar_location.png"),
              imageOffset: (-9, -29)
            }),
            position: self.mapOptions.center,
            title: "我可以拖哦~！",
            draggable: true,
            clickable: false,
            zIndex: 1000
          });

          self.mCenterMker.on("dragend", function(e) {
            self.mapObj.panTo(e.lnglat);
            // console.log(e.lnglat);
            self.mapOptions.center = [e.lnglat.lng, e.lnglat.lat];
            self.addCompents();
            self.getCenterVechile();
            self.infoWindow.visible = false;
          });

          self.mCircle = new AMap.Circle({
            map: self.mapObj,
            center: self.mapOptions.center,
            strokeWeight: 1,
            strokeColor: "#0060ff",
            strokeOpacity: 0.55,
            fillColor: "#0060ff",
            fillOpacity: 0.15,
            radius: self.mRadius,
            zIndex: 10
          });

          //轨迹图层初始化
          self.pathGroup = new AMap.OverlayGroup([]);
          self.mapObj.add(self.pathGroup);

          //自定义线路初始化
          self.ownPathGroup = new AMap.OverlayGroup([]);
          self.mapObj.add(self.ownPathGroup);

          //范围控制图层初始化
          self.activeVecGroup = new AMap.OverlayGroup([
            self.mCenterMker,
            self.mCircle
          ]);
          self.mapObj.add(self.activeVecGroup);

          //切换区域遮罩
          self.regionPath = new AMap.OverlayGroup([]);
          self.mapObj.add(self.regionPath);
          self.changeRegion(self.cityRegion);

          //图层切换
          //卫星图
          self.satelliteLayer = new AMap.TileLayer.Satellite({ zIndex: 10 });
          self.roadNetLayer = new AMap.TileLayer.RoadNet({ zIndex: 10 });
          self.satelliteLayer.setMap(self.mapObj);
          self.roadNetLayer.setMap(self.mapObj);
          if (!self.satelliteShow) {
            self.satelliteLayer.hide();
            self.roadNetLayer.hide();
          }
          //实时路况
          self.trafficLayer = new AMap.TileLayer.Traffic({ zIndex: 20 });
          self.trafficLayer.setMap(self.mapObj);
          if (!self.trafficShow) self.trafficLayer.hide();

          //地图操作
          self.mapObj.on("click", function(e) {
            self.mapObj.panTo(e.lnglat);
            // console.log(e.lnglat);
            self.mapOptions.center = [e.lnglat.lng, e.lnglat.lat];
            self.addCompents();
            self.getCenterVechile();
            self.infoWindow.visible = false;
          });
          self.mapObj.on("zoomchange", self.zoomMap);

          self.HisTrackPolyline = new AMap.Polyline({
            path: self.infoWindow.vecState.arrHis,
            isOutline: true,
            outlineColor: "#0078ff",
            showDir: true,
            strokeColor: "#00b4ff",
            strokeWeight: 5,
            lineJoin: "round",
            lineCap: "round",
            zIndex: 100
          });
          self.ownPolyline = new AMap.Polyline({
            path: self.ownPathArr,
            isOutline: true,
            outlineColor: "#c56600",
            showDir: true,
            strokeColor: "#ff9524",
            strokeWeight: 5,
            lineJoin: "round",
            lineCap: "round",
            zIndex: 110
          });

          //钉住轨迹按钮事件
          self.HisTrackPolyline.on("mouseover", function(e) {
            console.log(e);
            self.showPin = {
              show: true,
              left: e.pixel.x + "px",
              top: e.pixel.y + "px"
            };
          });

          //删除钉住轨迹按钮事件
          self.ownPolyline.on("mouseover", function(e) {
            console.log(e);
            self.showDeletePoly = {
              show: true
            };
            self.showPin = {
              left: e.pixel.x + "px",
              top: e.pixel.y + "px"
            };

            setTimeout(function() {
              self.showDeletePoly = {
                show: false
              };
              self.showPin = {
                left: "0px",
                top: "0px"
              };
            }, 3000);
          });

          //判断是否登录
          self.token = localStorage.$demoToken;
        }
      },
      cityRegion: "武汉市",
      token: null,
      vechileList: [],
      clusterVechile: null,
      clusterOnlineVechile: null,
      clusterSite: null,
      activeVecList: [],
      activeVecGroup: null,
      pathGroup: null,
      sitePath: null,
      sitePathArr: [],
      sitePathGroup: null,
      siteMonitorGroup: null,
      siteListData: [],
      uploadListData: [],
      regionPath: null,
      PathSimplifier: null,
      pathSimplifierIns: null,
      mCenterMker: null,
      mCircle: null,
      markers: null,
      graspRoad: null,
      heatmapObj: null,
      mRadius: 5000,
      infoWindow: {
        VecNo: null,
        DeviceNo: null,
        oldDeviceNo: null,
        position: [114.34253, 30.49984],
        content: "",
        visible: false,
        vecState: {
          Speed: 0,
          dirState: 0,
          ConectStatus: null,
          DWStatus: null,
          DeviceStatusStr: null,
          coverState: "未知",
          LastDWTime: null,
          SerAddress: null,
          arrHis: []
        },
        events: {
          change(v) {},
          close() {
            self.infoWindow.DeviceNo = null;
            self.infoWindow.vecState.arrHis = [];
            self.pathGroup.clearOverlays();
          }
        }
      },
      siteWindow: {
        siteData: {
          Name: "",
          Address: "",
          ControlCarRecordCount: 0,
          DepartmentName: "",
          LngLat: [0, 0],
          Poi: {
            Lat: "",
            Lon: "",
            SiteState: ""
          }
        },
        content: "",
        visible: false,
        events: {
          change() {},
          close() {}
        }
      },
      relativeVecList: [],
      StasticData: {
        alermCounter: 0,
        vechileCounter: 0,
        siteForwardCounter: 0,
        siteNoOrderCounter: 0,
        siteFenceCounter: 0,
        siteFenceOffCounter: 0,
        siteCounter: 0,
        uploadCounter: 0,
        siteOrderCounter: 0
      },
      toolSwitch: {
        refreshShow: true,
        siteShow: false,
        uploadShow: false,
        toolShow: false,
        stasticShow: false,
        trafficShow: true,
        satelliteShow: false,
        radiusShow: true,
        onlineShow: true,
        blackShow: false
      },
      postValue: {
        vechileList: {
          CenrtPoint: {
            Lon: "114.34253",
            Lat: "30.49984"
          }
        }
      },
      watchList: [],
      HisTrackPolyline: null,
      ownPathGroup: null,
      ownPolyline: null,
      ownPathArr: [],
      showPin: {
        show: false,
        left: 0,
        top: 0
      },
      showDeletePoly: {
        show: false,
        left: 0,
        top: 0
      },
      detaileDialog: {
        dialogWatchVisible: false,
        dialogTableVisible: false,
        activeDetailName: "vechileinfo",
        siteCross: {
          show: false,
          recodeData: []
        }
      },
      reportTable: {
        activeName: "vechileList",
        vecSearchNum: null,
        siteSearchName: "",
        vechileData: [],
        vechilePageIndex: 1,
        vechilePageSize: 50,
        vechileTotal: 0,
        siteData: [],
        companyData: []
      },
      menuIndex: "1",
      hisTrackLoading: false,
      trackWdData: { show: false, VecNo: "" },
      siteTableData: []
    };
  },
  mounted() {
    this.$Loading.config({
      height: 5
    });
    //异步事件
    this.$nextTick(() => {
      this.getSiteList();
      if (dataID != null) {
        //判断计时器是否为空
        clearInterval(dataID);
        dataID = null;
      }
      if (siteId != null) {
        //判断计时器是否为空
        clearInterval(siteId);
        siteId = null;
      }
      //this.getSiteList();
      // this.getVechileList();
      siteId = setInterval(() => {
        // this.getSiteList();
      }, 1000 * 60 * 30);

      // this.getUploadData();
    });
  },
  destroyed() {
    clearInterval(dataID);
    clearInterval(siteId);
    dataID = null;
    siteId = null;
  },
  methods: {
    //打开监控列表
    openReports(b) {
      this.toolSwitch.stasticShow = b;
    },
    //切换行政区
    changeRegion(v) {
      let self = this;
      self.cityRegion = v;
      if (v === "青山区") v = "420107";
      self.regionPath.clearOverlays();
      new AMap.DistrictSearch({
        extensions: "all",
        subdistrict: 0
      }).search(v, (status, result) => {
        // console.log(result);
        self.mapOptions.center = [
          result.districtList[0].center.lng,
          result.districtList[0].center.lat
        ];
        self.addCompents();
        self.getCenterVechile();
        self.infoWindow.visible = false;
        var outer = [
          new AMap.LngLat(-360, 90, true),
          new AMap.LngLat(-360, -90, true),
          new AMap.LngLat(360, -90, true),
          new AMap.LngLat(360, 90, true)
        ];
        var holes = result.districtList[0].boundaries;
        var pathArray = [outer];
        pathArray.push.apply(pathArray, holes);
        var polygon = new AMap.Polygon({
          pathL: pathArray,
          strokeColor: "#333",
          strokeWeight: 5,
          fillColor: "#666",
          fillOpacity: 0.75,
          zIndex: 100
        });

        polygon.setPath(pathArray);
        // self.mapObj.add(polygon);
        self.regionPath.addOverlay(polygon);

        if (self.reportTable.companyData.length > 0) {
          self.GetEnterpriseTheWholePoint();
        }
      });
    },

    //改变监控范围半径
    changeMRadius(v) {
      const self = this;
      self.activeVecList = [];
      self.mRadius = v;
      self.mCircle.setRadius(self.mRadius);
      self.getCenterVechile();
    },

    //获取工地列表
    getSiteList() {
      let self = this;
      const BeginTime = Util.setDate(new Date()) + " 19:00:00";
      const EndTime = Util.getNow(
        new Date(BeginTime).getTime() + 60 * 1000 * 60 * 12
      );
      console.log(BeginTime);
      self.$http
        .post(
          api.host +
            api.GetSiteListUrl +
            "?BeginTime=" +
            BeginTime +
            "&EndTime=" +
            EndTime
        )
        .then(res => {
          console.log(res);
          if (res.data.Code == 0) {
            let siteList = res.data.Data.siteList;
            let sitePoi = res.data.Data.HomeSiteDataModelWeb;
            let parkList = res.data.Data.parkingLotList;
            let siteAll = siteList.concat(parkList);

            //初始化围栏和图标
            let siteMarkers = [];
            let siteMonitorMarkers = [];
            let sitePathArr = [];

            //初始化工地计数
            self.StasticData.siteForwardCounter = 0;
            self.StasticData.siteNoOrderCounter = 0;
            self.StasticData.siteOrderCounter = 0;
            self.StasticData.siteFenceCounter = 0;
            self.StasticData.siteFenceOffCounter = 0;

            for (var i in siteAll) {
              let iconImage = "";
              let siteTxtMker = null,
                siteMker = null;
              let styles = {
                padding: "5px 12px",
                "border-radius": "5px",
                "box-shadow": "0 2px 6px 0 rgba(0, 0, 0, .15)",
                "font-size": "12px",
                background: "rgba(98, 72, 113, 0.85)",
                color: "#fff",
                "text-shadow": "1px 1px 0 rgba(0,0,0,.35)"
              };
              if (siteAll[i].UnearthedTime)
                siteAll[i].UnearthedTime = Util.getNow(
                  siteAll[i].UnearthedTime
                );
              for (var x in sitePoi) {
                //POI定位
                if (siteAll[i].Id == sitePoi[x].SiteId)
                  siteAll[i]["Poi"] = sitePoi[x];
              }
              //工地类型
              switch (siteAll[i].Poi.SiteType) {
                case 0:
                  siteAll[i].Poi["SiteState"] = "停车场";
                  siteTxtMker = new AMap.Text({
                    extData: {
                      id: siteAll[i].SiteId,
                      name: siteAll[i].Name
                    },
                    text: siteAll[i].Name,
                    offset: new AMap.Pixel(3, 12),
                    zIndex: 10,
                    style: {
                      padding: "5px 12px",
                      "border-radius": "5px",
                      "box-shadow": "0 2px 6px 0 rgba(0, 0, 0, .15)",
                      "font-size": "12px",
                      background: "rgba(162, 79, 255, 0.85)",
                      color: "#fff",
                      "text-shadow": "1px 1px 0 rgba(0,0,0,.35)"
                    },
                    position: [siteAll[i].Poi.Lon, siteAll[i].Poi.Lat]
                  });
                  break;
                case 1:
                  siteAll[i].Poi["SiteState"] = "提前出土";
                  iconImage = require("../../../stastic/img/ExZtc/site_forward.png");
                  siteTxtMker = new AMap.Text({
                    extData: {
                      id: siteAll[i].SiteId,
                      name: siteAll[i].Name
                    },
                    text: siteAll[i].Name,
                    offset: new AMap.Pixel(3, 12),
                    zIndex: 10,
                    style: styles,
                    position: [siteAll[i].Poi.Lon, siteAll[i].Poi.Lat]
                  });
                  siteMker = new AMap.Marker({
                    extData: {
                      id: siteAll[i].Id,
                      name: siteAll[i].Name
                    },
                    icon: iconImage,
                    position: [siteAll[i].Poi.Lon, siteAll[i].Poi.Lat],
                    clickable: true
                  });
                  siteMker.on("click", self.siteClick);
                  siteMonitorMarkers.push(siteMker);
                  self.StasticData.siteForwardCounter++;
                  break;
                case 2:
                  siteAll[i].Poi["SiteState"] = "未上报出土";
                  iconImage = require("../../../stastic/img/ExZtc/site_alerm.png");
                  siteTxtMker = new AMap.Text({
                    extData: {
                      id: siteAll[i].SiteId,
                      name: siteAll[i].Name
                    },
                    text: siteAll[i].Name,
                    offset: new AMap.Pixel(3, 12),
                    zIndex: 10,
                    style: styles,
                    position: [siteAll[i].Poi.Lon, siteAll[i].Poi.Lat]
                  });
                  siteMker = new AMap.Marker({
                    extData: {
                      id: siteAll[i].Id,
                      name: siteAll[i].Name
                    },
                    icon: iconImage,
                    position: [siteAll[i].Poi.Lon, siteAll[i].Poi.Lat],
                    clickable: true
                  });
                  siteMker.on("click", self.siteClick);
                  siteMonitorMarkers.push(siteMker);
                  self.StasticData.siteNoOrderCounter++;
                  break;
                case 3:
                  siteAll[i].Poi["SiteState"] = "上报未出土";
                  iconImage = require("../../../stastic/img/ExZtc/site_online.png");
                  siteTxtMker = new AMap.Text({
                    extData: {
                      id: siteAll[i].SiteId,
                      name: siteAll[i].Name
                    },
                    text: siteAll[i].Name,
                    offset: new AMap.Pixel(3, 12),
                    zIndex: 10,
                    style: styles,
                    position: [siteAll[i].Poi.Lon, siteAll[i].Poi.Lat]
                  });
                  break;
                case 4:
                  siteAll[i].Poi["SiteState"] = "核准工地";
                  iconImage = require("../../../stastic/img/ExZtc/site_offline.png");
                  siteTxtMker = new AMap.Text({
                    extData: {
                      id: siteAll[i].SiteId,
                      name: siteAll[i].Name
                    },
                    text: siteAll[i].Name,
                    offset: new AMap.Pixel(3, 12),
                    zIndex: 10,
                    style: styles,
                    position: [siteAll[i].Poi.Lon, siteAll[i].Poi.Lat]
                  });

                  break;
                case 5:
                  siteAll[i].Poi["SiteState"] = "上报工地";
                  iconImage = require("../../../stastic/img/ExZtc/site_online.png");
                  siteTxtMker = new AMap.Text({
                    extData: {
                      id: siteAll[i].SiteId,
                      name: siteAll[i].Name
                    },
                    text: siteAll[i].Name,
                    offset: new AMap.Pixel(3, 12),
                    zIndex: 10,
                    style: styles,
                    position: [siteAll[i].Poi.Lon, siteAll[i].Poi.Lat]
                  });
                  self.StasticData.siteOrderCounter++;
                  break;
              }
              //门禁状态
              if (!siteAll[i].Online) {
                siteAll[i].Online = "未安装";
              } else if (siteAll[i].Online == "在线") {
                iconImage = require("../../../stastic/img/ExZtc/site_fence_online.png");
                siteMker = new AMap.Marker({
                  extData: {
                    id: siteAll[i].Id,
                    name: siteAll[i].Name
                  },
                  icon: iconImage,
                  position: [siteAll[i].Poi.Lon, siteAll[i].Poi.Lat],
                  clickable: true
                });
                siteMker.on("click", self.siteClick);
                siteMonitorMarkers.push(siteMker);
                self.StasticData.siteFenceCounter++;
              } else if (siteAll[i].Online == "离线") {
                iconImage = require("../../../stastic/img/ExZtc/site_fence_offline.png");
                siteMker = new AMap.Marker({
                  extData: {
                    id: siteAll[i].Id,
                    name: siteAll[i].Name
                  },
                  icon: iconImage,
                  position: [siteAll[i].Poi.Lon, siteAll[i].Poi.Lat],
                  clickable: true
                });
                siteMker.on("click", self.siteClick);
                siteMonitorMarkers.push(siteMker);
                self.StasticData.siteFenceOffCounter++;
              }

              let tempPath = [];
              for (var y in siteAll[i].Point) {
                tempPath.push(
                  wgs84togcj02(siteAll[i].Point[y].lng, siteAll[i].Point[y].lat)
                );
              }

              sitePathArr.push(tempPath);
              siteMarkers.push(siteTxtMker);
            }
            self.siteTableData = siteAll;
            self.siteMonitorMarkers = siteMonitorMarkers;
            self.siteMarkers = siteMarkers;
            self.sitePathArr = sitePathArr;
            self.toMapMarker();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

    //地图上打工地的与围栏
    toMapMarker() {
      const self = this;
      if (self.sitePathGroup) self.sitePathGroup.clearOverlays();
      if (self.siteMonitorGroup) self.siteMonitorGroup.clearOverlays();
      if (self.clusterSite) self.clusterSite.clearMarkers();
      self.sitePath.setPath(self.sitePathArr);
      self.sitePathGroup.addOverlay(self.sitePath);
      self.siteMonitorGroup.addOverlay(self.siteMonitorMarkers);
      if (self.toolSwitch.siteShow)
        self.clusterSite.addMarkers(self.siteMarkers);
    },

    //工地表格定位
    pinToS(row) {
      let self = this;
      console.log(row);
      self.toolSwitch.stasticShow = false;
      let Lng = row.Poi.Lon;
      let Lat = row.Poi.Lat;
      self.mapOptions.center = [Lng, Lat];
      self.addCompents();
      self.mapObj.setZoom(16);
      self.mapObj.panTo(self.mapOptions.center);
    },

    /******************************上为new************************** */

    //刷新地图
    refreshMap() {
      if (dataID != null) {
        //判断计时器是否为空
        clearInterval(dataID);
        dataID = null;
      }
      //this.getCenterVechile();
      if (siteId != null) {
        //判断计时器是否为空
        clearInterval(siteId);
        siteId = null;
      }
      //this.getSiteList();
      siteId = setInterval(() => {
        //this.getSiteList();
      }, 1000 * 60 * 30);
    },

    //监控范围及地图中心点
    addCompents() {
      let self = this;
      self.mCenterMker.setPosition(self.mapOptions.center);
      self.mCircle.setCenter(self.mapOptions.center);
    },

    //热力图显示
    changeTraffic(v) {
      let self = this;
      if (v) {
        self.heatmapObj.show();
      } else {
        self.heatmapObj.hide();
      }
    },
    //移动地图
    moveMap() {
      let self = this;
      self.mapOptions.center = [
        self.mapObj.getCenter().lng,
        self.mapObj.getCenter().lat
      ];
    },
    //地图缩放
    zoomMap() {
      let self = this;
      let mapLevel = parseInt(self.mapObj.getZoom());
      // console.log(mapLevel);
      if (mapLevel >= 13) {
        // self.activeVecGroup.hide();
        self.sitePathGroup.show();
        self.mCircle.setOptions({
          fillOpacity: 0.05
        });
      } else {
        // self.activeVecGroup.show();
        self.sitePathGroup.hide();
        self.mCircle.setOptions({
          fillOpacity: 0.15
        });
      }
    },
    //切换卫星
    changeSatellite(v) {
      let self = this;
      if (v) {
        self.satelliteLayer.show();
        self.roadNetLayer.show();
      } else {
        self.satelliteLayer.hide();
        self.roadNetLayer.hide();
      }
    },
    //切换路况
    changeTraffic(v) {
      let self = this;
      if (v) {
        self.trafficLayer.show();
      } else {
        self.trafficLayer.hide();
      }
    },
    //车流量热力图
    getTraffic() {
      // console.log("车流量路况");
      let self = this;
      self.$http
        .post(api.host + api.GetLineFllowUrl, {})
        .then(res => {
          // console.log(res);
          if (res.data.Code == 0) {
            let linePathData = res.data.Data;
            let lineArr = [];
            for (var i in linePathData) {
              for (var x in linePathData[i].PList) {
                lineArr.push({
                  lng: linePathData[i].PList[x].lng,
                  lat: linePathData[i].PList[x].lat,
                  count: linePathData[i].PList[x].cnt
                });
              }
            }
            // console.log(lineArr);
            //加载热力图插件
            //初始化heatmap对象
            self.heatmapObj = new AMap.Heatmap(self.mapObj, {
              radius: 18,
              opacity: [0, 0.75],
              zooms: [11, 15]
            });
            self.heatmapObj.setDataSet({ data: lineArr, max: 50 }); //设置热力图数据集
            //具体参数见接口文档
            if (self.toolSwitch.trafficShow) {
              self.heatmapObj.show();
            } else {
              self.heatmapObj.hide();
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //切换工地
    changeSiteShow(v) {
      let self = this;
      if (!v) {
        self.clusterSite.clearMarkers();
      } else {
        self.clusterSite.addMarkers(self.siteMarkers);
      }
    },
    //切换切换车辆类型
    changeOnlineShow(v) {
      let self = this;
      if (!v) {
        self.clusterOnlineVechile.clearMarkers();
      } else {
        self.clusterOnlineVechile.clearMarkers();
        self.clusterOnlineVechile.addMarkers(self.markers);
      }
    },
    //切换切换车辆类型
    changeBlackShow(v) {
      let self = this;
      if (!v) {
        self.clusterVechile.clearMarkers();
      } else {
        self.clusterVechile.clearMarkers();
        self.clusterVechile.addMarkers(self.blackMarkers);
      }
    },
    //切换监控范围
    changeRadius(v) {
      let self = this;
      if (v) {
        self.activeVecGroup.show();
      } else {
        self.activeVecGroup.hide();
      }
    },
    //获取中心点范围车辆
    getCenterVechile() {
      let self = this;
      self.toolSwitch.refreshShow = true;
      self.$http
        .post(api.host + api.PostQueryCircleUrl, {
          Lon: self.mapOptions.center[0],
          Lat: self.mapOptions.center[1],
          Radius: self.mRadius
        })
        .then(res => {
          // console.log(res);
          self.activeVecList = [];
          let vLiteData = [];
          let vListData = self.vechileList;
          if (res.data.Code === 0) {
            vLiteData = res.data.Data;
            for (var i in vLiteData) {
              self.activeVecList.push({
                DeviceNo: vLiteData[i].PhoneNum,
                Lng: vLiteData[i].Lng,
                Lat: vLiteData[i].Lat,
                Direction: vLiteData[i].Direction,
                VehicleNo: vLiteData[i].VehicleNo,
                VehStatusInfo: vLiteData[i].VehStatusInfo,
                VehStatus: vLiteData[i].VehStatus,
                EnterpriseName: vLiteData[i].EnterpriseName,
                path: [[vLiteData[i].Lng, vLiteData[i].Lat]]
              });
              if (self.infoWindow.DeviceNo === vLiteData[i].PhoneNum) {
                self.infoWindow.position = [vLiteData[i].Lng, vLiteData[i].Lat];
              }
            }
          }
          //车辆定位点
          self.markers = [];
          self.blackMarkers = [];
          self.StasticData.vechileCounter = 0;
          self.StasticData.alermCounter = 0;
          for (var i in self.activeVecList) {
            let iconImg = "";
            switch (self.activeVecList[i].VehStatus) {
              case 1:
                iconImg = require("../../../stastic/img/ExZtc/truck_online.png");
                if (self.activeVecList[i].EnterpriseName == "无资质") {
                  self.StasticData.alermCounter =
                    self.StasticData.alermCounter + 1;
                  iconImg = require("../../../stastic/img/ExZtc/truck_online_black.png");
                }
                self.StasticData.vechileCounter =
                  self.StasticData.vechileCounter + 1;
                break;
              case 2:
                iconImg = require("../../../stastic/img/ExZtc/truck_online_dot.png");
                if (self.activeVecList[i].EnterpriseName == "无资质") {
                  self.StasticData.alermCounter =
                    self.StasticData.alermCounter + 1;
                  iconImg = require("../../../stastic/img/ExZtc/truck_online_black.png");
                }
                self.StasticData.vechileCounter =
                  self.StasticData.vechileCounter + 1;
                break;
              case 3:
                iconImg = require("../../../stastic/img/ExZtc/truck_online_dot_blue.png");
                if (self.activeVecList[i].EnterpriseName == "无资质") {
                  self.StasticData.alermCounter =
                    self.StasticData.alermCounter + 1;
                  iconImg = require("../../../stastic/img/ExZtc/truck_online_black.png");
                }
                self.StasticData.vechileCounter =
                  self.StasticData.vechileCounter + 1;
                break;
              case 4:
                self.StasticData.alermCounter =
                  self.StasticData.alermCounter + 1;
                iconImg = require("../../../stastic/img/ExZtc/truck_alerm.png");
                if (self.activeVecList[i].EnterpriseName == "无资质") {
                  iconImg = require("../../../stastic/img/ExZtc/truck_black.png");
                }
                break;
              case 5:
                iconImg = require("../../../stastic/img/ExZtc/truck_online_dot_gray.png");
                if (self.activeVecList[i].EnterpriseName == "无资质") {
                  iconImg = require("../../../stastic/img/ExZtc/truck_black.png");
                }
                break;
              case 6:
                iconImg = require("../../../stastic/img/ExZtc/truck_online_dot_blue.png");
                if (self.activeVecList[i].EnterpriseName == "无资质") {
                  iconImg = require("../../../stastic/img/ExZtc/truck_black.png");
                }
                break;
              default:
                iconImg = require("../../../stastic/img/ExZtc/truck_online_dot_gray.png");
                if (self.activeVecList[i].EnterpriseName == "无资质") {
                  iconImg = require("../../../stastic/img/ExZtc/truck_black.png");
                }
                break;
            }

            var vecMker = new AMap.Marker({
              extData: {
                id: self.activeVecList[i].DeviceNo,
                DeviceNo: self.activeVecList[i].DeviceNo,
                VehStatusInfo: self.activeVecList[i].VehStatusInfo,
                name: self.activeVecList[i].VehicleNo
              },
              icon: iconImg,
              position: [self.activeVecList[i].Lng, self.activeVecList[i].Lat],
              content:
                "<div style='background:url(" +
                iconImg +
                ") center no-repeat;width:36px;height:36px;transform:rotate(" +
                self.activeVecList[i].Direction +
                "deg) '></div>",
              offset: new AMap.Pixel(-18, -18),
              clickable: true,
              zIndex: 100
            });

            //如果车辆行驶状态，则展示label
            if (
              self.activeVecList[i].VehStatus === 1 ||
              self.activeVecList[i].VehStatus === 2
            ) {
              vecMker.setLabel({
                content: self.activeVecList[i].VehicleNo + "",
                direction: "bottom",
                offset: new AMap.Pixel(-3, 3)
              });
            }
            vecMker.on("click", self.markerClick);
            //mker.emit("click", { target: mker });

            if (
              self.activeVecList[i].VehStatus == 1 ||
              self.activeVecList[i].VehStatus == 2 ||
              self.activeVecList[i].VehStatus == 3
            ) {
              self.markers.push(vecMker);
            }

            if (
              self.activeVecList[i].EnterpriseName == "无资质" ||
              self.activeVecList[i].VehStatus == 4 ||
              self.activeVecList[i].VehStatus == 5
            ) {
              self.blackMarkers.push(vecMker);
            }
          }

          if (self.toolSwitch.onlineShow) {
            self.clusterOnlineVechile.clearMarkers();
            self.clusterOnlineVechile.addMarkers(self.markers);
          } else {
            self.clusterOnlineVechile.clearMarkers();
          }
          if (self.toolSwitch.blackShow) {
            self.clusterVechile.clearMarkers();
            self.clusterVechile.addMarkers(self.blackMarkers);
          } else {
            self.clusterVechile.clearMarkers();
          }
          self.toolSwitch.refreshShow = false;
          if (self.infoWindow.DeviceNo || self.dialogTableVisible) {
            self.getDevVehicleState();
          }
          self.refreshData();
        })
        .catch(error => {
          // console.log(error);
        });
    },

    //点击车辆图标
    markerClick(e) {
      let self = this;
      let LngLat = e.target.getPosition();
      let DeviceNo = e.target.getExtData().DeviceNo;
      let oldDeviceNo = self.infoWindow.oldDeviceNo;
      let mapLevel = parseInt(self.mapObj.getZoom());
      // console.log(e.target.getExtData().VehStatusInfo);
      //判断是否切换了新车
      if (!oldDeviceNo || DeviceNo != oldDeviceNo) {
        self.infoWindow.oldDeviceNo = DeviceNo;
        self.infoWindow.vecState.arrHis = [];
      }
      self.infoWindow.visible = false;
      self.$nextTick(() => {
        self.infoWindow.DeviceNo = DeviceNo;
        self.infoWindow.VecNo = e.target.getExtData().name;
        self.infoWindow.visible = true;
        self.infoWindow.content = e.target.getExtData().name;
        self.infoWindow.position = [LngLat.lng, LngLat.lat];
        if (mapLevel >= 16) {
          self.mapObj.panTo(LngLat);
        } else {
          self.mapObj.setZoomAndCenter(16, LngLat);
        }
        self.relativeVecList.unshift({
          DeviceNo: DeviceNo,
          path: [[LngLat.lng, LngLat.lat]]
        });
        self.getDevVehicleState();
      });
    },
    //获取单车实时状态
    getDevVehicleState() {
      let self = this;
      let DeviceNo = self.infoWindow.DeviceNo;
      self.$http
        .get(api.host + api.GetDevVehicleStateUrl + "?devNo=" + DeviceNo)
        .then(res => {
          // console.log(res);
          self.pathGroup.clearOverlays();
          if (res.data.Code == 0) {
            let vecState = res.data.Data[0];
            let VehicleStatusFlag = vecState.VehicleStatusFlag;
            let stateClass = "";
            switch (VehicleStatusFlag) {
              case 4:
                self.infoWindow.vecState.stateClass = "green";
                break;
              case 5:
                self.infoWindow.vecState.stateClass = "green";
                break;
              case 6:
                self.infoWindow.vecState.stateClass = "blue";
                break;
            }
            let cState = vecState.otherProperty,
              coverState = "未密闭",
              dirState = "0";
            for (var i in cState) {
              if (cState[i].pKey == "顶棚") {
                self.infoWindow.vecState.coverState = cState[i].pValue;
              }
              if (cState[i].pKey == "Direction") {
                self.infoWindow.vecState.dirState = cState[i].pValue - 45;
              }
            }
            self.infoWindow.vecState.DeviceStatusStr = vecState.DeviceStatusStr;
            self.infoWindow.vecState.ConectStatus = vecState.ConectStatus;
            self.infoWindow.vecState.DWStatus = vecState.DWStatus;
            self.infoWindow.vecState.Speed = vecState.Speed;
            self.infoWindow.vecState.LastDWTime = vecState.LastDWTime;
            self.infoWindow.vecState.SerAddress = vecState.SerAddress;
            self.infoWindow.vecState.EnterpriseName = vecState.EnterpriseName;
            self.infoWindow.vecState.arrHis.push(
              wgs84togcj02(vecState.Lon, vecState.Lat)
            );

            self.pathGroup.clearOverlays();
            self.HisTrackPolyline.setPath(self.infoWindow.vecState.arrHis);
            self.pathGroup.addOverlay(self.HisTrackPolyline);

            self.mapObj.center = wgs84togcj02(vecState.Lon, vecState.Lat);
            self.mapObj.panTo(self.mapObj.center);
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },
    //实时刷新
    refreshData() {
      let self = this;
      clearInterval(dataID);
      clearInterval(loadingId);
      dataID = null;
      loadingId = null;
      var loadIndex = 0;
      // self.$Loading.start();
      dataID = setInterval(() => {
        self.getCenterVechile();
      }, 30000);
      loadingId = setInterval(() => {
        loadIndex++;
        self.$Loading.update(3.3333333333 * loadIndex);
      }, 1000);
    },

    siteClick(e) {
      let self = this;
      self.siteWindow.visible = false;
      let siteData = self.reportTable.siteData;
      let LngLat = e.target.getPosition();
      let mapLevel = parseInt(self.mapObj.getZoom());

      self.$nextTick(() => {
        self.siteWindow.visible = true;
        console.log(LngLat);
        let index = e.target.getExtData().id;
        for (var i in siteData) {
          if (siteData[i].Id == index) {
            self.siteWindow.siteData = siteData[i];
            self.siteWindow.siteData.LngLat = [LngLat.lng, LngLat.lat];
            self.mapOptions.center = [LngLat.lng, LngLat.lat];
            self.addCompents();
            self.getCenterVechile();
            if (mapLevel >= 16) {
              self.mapObj.panTo(LngLat);
            } else {
              self.mapObj.setZoomAndCenter(16, LngLat);
            }
          }
        }
      });
    },
    //获取消纳点数据
    getUploadData() {
      let self = this;
      self.uploadListData = [];
      self.$http
        .get(api.host + api.GetUnloadUrl)
        .then(res => {
          // console.log(res);
          if (res.data.RetCode === 0) {
            self.uploadListData = res.data.Data;

            for (var i in self.uploadListData) {
              switch (self.uploadListData[i].BarrierType) {
                case 1:
                  self.StasticData.uploadCounter =
                    self.StasticData.uploadCounter + 1;
                  self.uploadListData[i][
                    "icon"
                  ] = require("../../../stastic/img/ExZtc/upload_online.png");
                  break;
                default:
                  self.uploadListData[i][
                    "icon"
                  ] = require("../../../stastic/img/ExZtc/upload_offline.png");
                  break;
              }
            }
          }
        })
        .catch(error => {
          // console.log(error);
        });
    },

    pantoPoi(item) {
      let self = this;
      self.infoWindow.visible = false;
      setTimeout(function() {
        self.mapObj.setZoomAndCenter(15, item.location);
        self.mapOptions.center = [item.location.lng, item.location.lat];
        self.addCompents();
        self.getCenterVechile();
      }, 500);
    },
    //回溯轨迹
    hisTrackThis(time) {
      // console.log(time);
      let self = this;
      if (time == "track") {
        self.trackWdData.show = true;
        self.trackWdData.VecNo = self.infoWindow.VecNo;
        return false;
      }
      self.hisTrackLoading = true;
      if (hisId != null) {
        //判断计时器是否为空
        clearInterval(hisId);
        hisId = null;
      }
      hisId = setTimeout(function() {
        self.$http
          .post(api.host + api.GetHisLocPayUrl, {
            VehicleNo: self.infoWindow.VecNo,
            StartDateTime: new Date(new Date().getTime() - time),
            EndDateTime: new Date()
          })
          .then(res => {
            console.log(res);
            if (res.data.Code == 0) {
              self.pathGroup.clearOverlays();
              let srcHis = res.data.Data;
              // console.log(srcHis);
              self.infoWindow.vecState.arrHis = [];
              for (var i in srcHis) {
                self.infoWindow.vecState.arrHis.push([
                  srcHis[i].Lon,
                  srcHis[i].Lat
                ]);
              }
              self.HisTrackPolyline.setPath(self.infoWindow.vecState.arrHis);
              self.pathGroup.addOverlay(self.HisTrackPolyline);

              self.getCenterVechile();
              self.hisTrackLoading = false;
            }
          })
          .catch(error => {
            // console.log(error);
            self.hisTrackLoading = false;
          });
      }, 1500);
    },
    //钉住轨迹线
    pinHisPolyline() {
      console.log("pin");
      let self = this;
      self.ownPathGroup.clearOverlays();
      let arrHis = self.infoWindow.vecState.arrHis;
      // self.ownPathArr.push(arrHis);
      // console.log(self.ownPathArr);
      self.ownPolyline.setPath(arrHis);
      self.ownPathGroup.addOverlay(self.ownPolyline);
      self.showPin = {
        show: false,
        left: 0 + "px",
        top: 0 + "px"
      };
    },
    //删除轨迹线
    deleteHisPolyline() {
      console.log("delete");
      let self = this;
      self.ownPathGroup.clearOverlays();
      // self.ownPathArr.push(arrHis);
      // console.log(self.ownPathArr);
      self.ownPolyline.setPath([]);
      self.ownPathGroup.addOverlay(self.ownPolyline);
      self.showDeletePoly = {
        show: false
      };
      self.showPin = {
        left: 0 + "px",
        top: 0 + "px"
      };
    },
    //跟踪列表
    watchThis() {
      let self = this;
      let VecNo = self.infoWindow.VecNo;
      self.detaileDialog.dialogWatchVisible = true;
      self.watchList.unshift({
        VecNo: VecNo,
        path: []
      });
    },
    //车辆详情
    infoDetail() {
      let self = this;
      self.detaileDialog.dialogTableVisible = true;
      self.getDevVehicleState();
    },
    changeTab(e) {
      let self = this;
      let index = self.detaileDialog.activeDetailName;
      console.log(index);
      switch (index) {
        case "breakrule":
          self.QueryAlarmStat();
          break;
      }
    },
    //获取车辆报警信息
    QueryAlarmStat() {
      let self = this;
      console.log(self.infoWindow.VecNo);
      self.$http
        .post(api.host + api.QueryAlarmStatUrl, {
          TypeId: 1,
          VehicleNo: self.infoWindow.VecNo
        })
        .then(res => {
          console.log(res);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取企业上线率
    GetEnterpriseTheWholePoint() {
      let self = this;
      self.$http
        .post(api.host + api.GetEnterpriseTheWholePointUrl, {
          // DepartmentId:"420111",
          DepartmentName: self.cityRegion
        })
        .then(res => {
          console.log(res);
          if (res.data.Code == 0) {
            let companyData = res.data.Data;
            self.reportTable.companyData = [];
            for (var i in companyData) {
              if (
                companyData[i].DistName === self.cityRegion ||
                self.cityRegion == "武汉市"
              ) {
                self.reportTable.companyData.push(companyData[i]);
              }
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //车辆表格定位
    pinToV(row) {
      console.log(row);
      let self = this;
      let mapLevel = parseInt(self.mapObj.getZoom());
      self.toolSwitch.stasticShow = false;
      self.mapOptions.center = wgs84togcj02(row.GpsData.Lon, row.GpsData.Lat);
      self.addCompents();
      // self.mapObj.panTo(self.mapOptions.center);
      self.getCenterVechile();
      if (mapLevel >= 16) {
        self.mapObj.panTo(self.mapOptions.center);
      } else {
        self.mapObj.setZoomAndCenter(16, self.mapOptions.center);
      }
    },
    VecSizeChange(val) {
      // console.log(val);
      this.reportTable.vechilePageSize = val;
      this.getVechileList();
    },
    VecCurrentChange(val) {
      this.reportTable.vechilePageIndex = val;
      this.getVechileList();
    },
    //门禁过车记录
    showCross(item, row) {
      let self = this;
      console.log(row);
      self.detaileDialog.siteCross.show = true;
      const EndTime = Util.setDate(new Date());
      const BeginTime = Util.setDate(
        new Date().getTime() - 60 * 1000 * 60 * 24
      );
      self.$http
        .post(api.host + api.GetControlCarReocdListUrl, {
          CloudMapId: item,
          BeginTime: BeginTime,
          EndTime: EndTime
        })
        .then(res => {
          console.log(res);
          if (res.data.Code == 0) {
            let recodeData = res.data.Data;
            self.detaileDialog.siteCross.recodeData = [];
            self.toolSwitch.stasticShow = false;
            if (row) self.pinToS(null, row);
            for (var i in recodeData) {
              if (recodeData[i].PhoneNum != "") {
                recodeData[i].RecTime = Util.setDate(recodeData[i].RecTime);
                self.detaileDialog.siteCross.recodeData.push(recodeData[i]);
              }
            }

            // self.detaileDialog.siteCross.
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  watch: {
    "toolSwitch.stasticShow"(n) {
      let self = this;
      if (n) {
        console.log(n);
        self.GetEnterpriseTheWholePoint();
      }
    },
    "infoWindow.DeviceNo"(n) {
      console.log(n);
      if (n) {
        this.trackWdData.VecNo = this.infoWindow.VecNo;
      }
    }
  }
};
</script>
<style lang="less">
.map-tool-pin {
  position: fixed;
}

.amap-marker-label {
  background-color: #333 !important;
  color: #fff !important;
  border: none !important;
  border-radius: 3px !important;
  transform: none;
}

.loading_btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: absolute;
  right: -5px;
  top: 0;
  color: #999;
  line-height: 32px;
  text-align: center;
  font-size: 24px;
  // border: 5px solid #999;
  background-color: #2d469a;
  cursor: pointer;
  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
    0 6px 14px 2px rgba(0, 0, 0, 0.14), 0 6px 12px 5px rgba(0, 0, 0, 0.12);
}
.map-layout {
  position: fixed;
  right: 15px;
  top: 70px;
  background: #333;
  color: #fff;
  border: none;
}

.map-tips {
  .el-drawer.ltr,
  .el-drawer.rtl {
    background-color: #333 !important;

    .el-drawer__header,
    .el-form-item__label {
      color: #fff;
    }
  }
  .el-drawer__header {
    margin: 0;
  }
  .el-drawer__body {
    padding: 5px 20px;
  }

  .table-query {
    height: 42px;
  }
  .el-table th {
    // color: #fff;
    // background-color: #909399;
  }

  .el-table th,
  .el-table td {
    padding: 7px 0;
  }
  .el-table__body-wrapper {
    overflow: auto;
  }
}

.map-watch-list {
  display: inline-block;
  width: 100%;
  li {
    font-size: 12px;
    width: calc(33.333% - 30px);
    float: left;
    padding: 3px 10px;
    margin: 5px;
    line-height: 28px;
    cursor: pointer;
    border-radius: 5px;
    color: #fff;
    background-color: #1e5799;
    background: linear-gradient(
      to bottom,
      #1e5799 0%,
      #2989d8 50%,
      #207cca 51%,
      #7db9e8 100%
    ); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  }
}

.amap-info-content {
  h3 {
    font-size: 14px;
    line-height: 32px;

    .vec-state {
      float: left;
      margin-right: 15px;
      font-size: 13px;
      font-weight: normal;
      padding: 0 15px;
      border-radius: 3px;
      line-height: 22px;
      &.green {
        color: #fff;
        background-color: #3b8c39;
      }
      &.blue {
        color: #fff;
        background-color: #29679c;
      }
    }
    .vec-stateus {
      position: absolute;
      top: 15px;
      right: 35px;
      font-size: 12px;
      color: #999;
      i.on {
        color: #3b8c39;
      }
    }
  }

  .vec-content {
    display: inline-block;
    width: 100%;
    li {
      float: left;
      height: 80px;
      color: #fff;
      font-weight: bold;
      text-align: center;
      border-radius: 5px;
      h5 {
        height: 24px;
        font-size: 12px;
        line-height: 24px;
        text-align: left;
        padding: 0 15px;
      }
      > div {
        height: 36px;
        font-size: 20px;
        line-height: 36px;
      }
      sub {
        font-size: 10px;
        font-weight: normal;
      }
      &.vec-speed {
        width: 120px;
        height: 60px;
        margin: 10px 5px;
        background: url("../../../stastic/img/bigData/behavior/behavior_tag_deviate_active.png")
          center no-repeat;
        background-size: cover;
      }
      &.vec-cover {
        width: 120px;
        height: 60px;
        margin: 10px 5px;
        background: url("../../../stastic/img/bigData/behavior/behavior_tag_driver_active.png")
          center no-repeat;
        background-size: cover;
      }
      &.vec-direction {
        width: 120px;
        height: 60px;
        margin: 10px 5px;
        background: url("../../../stastic/img/bigData/behavior/behavior_tag_phone_active.png")
          center no-repeat;
        background-size: cover;
      }
    }
  }

  .vec-time {
    font-size: 12px;
    line-height: 26px;
  }
  .vec-address {
    font-size: 12px;
    line-height: 28px;
  }

  .vec-btn {
    li {
      float: left;
      cursor: pointer;
      font-size: 14px;
      padding: 5px 7px;
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin: 5px;
    }
  }
}
.el-dialog {
  border-radius: 7px;
  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
    0 6px 14px 2px rgba(0, 0, 0, 0.14), 0 6px 12px 5px rgba(0, 0, 0, 0.12);

  .vec-stateus {
    position: absolute;
    top: 8px;
    right: 50px;
    color: #fff;
    i.on {
      color: #00ff12;
    }
  }

  .vec-content {
    display: inline-block;
    width: 100%;
    li {
      float: left;
      height: 80px;
      color: #fff;
      font-weight: bold;
      text-align: center;
      border-radius: 5px;
      h5 {
        height: 24px;
        font-size: 12px;
        line-height: 24px;
        text-align: left;
        padding: 0 15px;
      }
      > div {
        height: 36px;
        font-size: 20px;
        line-height: 36px;
      }
      sub {
        font-size: 10px;
        font-weight: normal;
      }
      &.vec-speed {
        width: 120px;
        height: 60px;
        margin: 10px 5px;
        background: url("../../../stastic/img/bigData/behavior/behavior_tag_deviate_active.png")
          center no-repeat;
        background-size: cover;
      }
      &.vec-cover {
        width: 120px;
        height: 60px;
        margin: 10px 5px;
        background: url("../../../stastic/img/bigData/behavior/behavior_tag_driver_active.png")
          center no-repeat;
        background-size: cover;
      }
      &.vec-direction {
        width: 120px;
        height: 60px;
        margin: 10px 5px;
        background: url("../../../stastic/img/bigData/behavior/behavior_tag_phone_active.png")
          center no-repeat;
        background-size: cover;
      }
    }
  }

  .vec-time {
    font-size: 12px;
    line-height: 26px;
  }
  .vec-address {
    font-size: 12px;
    line-height: 28px;
  }

  .vec-btn {
    li {
      float: left;
      cursor: pointer;
      font-size: 14px;
      padding: 5px 7px;
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin: 5px;
    }
  }
}
.el-dialog__header {
  padding: 5px 20px;
  background-color: #333;
  .el-dialog__title {
    font-size: 14px;
    font-weight: bold;
    color: #fff;
  }
  .el-dialog__headerbtn {
    top: 10px;
  }
}
.el-dialog__body {
  padding: 5px 15px;
}
</style>
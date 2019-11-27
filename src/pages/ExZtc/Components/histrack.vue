<template>
  <reDialog
    v-dialogDrag
    title="轨迹查询"
    :modal="false"
    :modal-append-to-body="false"
    :append-to-body="true"
    width="960px"
    class="map-wd-track"
    :visible.sync="vecHisData.show"
  >
    <!-- {{vecState}} -->
    <div style="height:550px">
      <el-amap
        :vid="'amap-vue-track'"
        :center="mapOptions.center"
        :zoom="mapOptions.zoom"
        :zooms="mapOptions.zooms"
        :viewMode="'2D'"
        :mapStyle="mapOptions.mapStyle"
        :pitch="mapOptions.pitch"
        :rotation="mapOptions.rotation"
        :showLabel="mapOptions.showLabel"
        :resizeEnable="mapOptions.resizeEnable"
        :buildingAnimation="mapOptions.buildingAnimation"
        :expandZoomRange="mapOptions.expandZoomRange"
        :animateEnable="mapOptions.animateEnable"
        :events="events"
        :amap-manager="amapManager"
        style="width:100%;height:100%"
      >
        <div class="map-wd-track-search" v-if="vecHisData.show">
          <el-form
            :inline="true"
            :rules="rules"
            ref="searchForm"
            :model="formInline"
            label-width="80px"
            size="mini"
          >
            <el-form-item label="车牌号" prop="VecNo">
              <el-input v-model="formInline.VecNo" :disabled="hisLoading" placeholder="请输入要查询的车牌号"></el-input>
            </el-form-item>
            <el-form-item label="查询时间" prop="date">
              <el-date-picker
                v-model="formInline.date"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                 :disabled="hisLoading" 
                align="right"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :disabled="true"
                icon="el-icon-loading"
                v-if="hisLoading"
              >正在查询...</el-button>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="onSearch('searchForm')"
                v-if="!hisLoading"
              >查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="map-wd-track-control" v-if="hisNavgControl.show">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-tooltip content="播放">
                <el-button
                  type="primary"
                  icon="el-icon-video-play"
                  circle
                  @click="hisNavgPlay('play')"
                  v-show="hisNavgControl.play"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="暂停">
                <el-button
                  type="primary"
                  icon="el-icon-video-pause"
                  circle
                  @click="hisNavgPlay('pause')"
                  v-show="hisNavgControl.pause"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="播放">
                <el-button
                  type="primary"
                  icon="el-icon-video-play"
                  circle
                  @click="hisNavgPlay('resume')"
                  v-show="hisNavgControl.resume"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="停止">
                <el-button
                  type="primary"
                  icon="el-icon-switch-button"
                  circle
                  @click="hisNavgPlay('stop')"
                ></el-button>
              </el-tooltip>
            </el-col>
            <el-col :span="12">
              <el-slider :max="hisNavgControl.max" v-model="hisNavgControl.seek"></el-slider>
            </el-col>
            <el-col :span="6">
              <el-select v-model="hisNavgControl.speed" size="mini" placeholder="请选择播放速度">
                <el-option
                  v-for="item in hisNavgControl.optSpeed"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </div>
      </el-amap>
    </div>
  </reDialog>
</template>
<script>
import api from "../Configs/api";
import VueAMap from "vue-amap";
let amapManager = new VueAMap.AMapManager();

let hisId = null;
export default {
  props: ["vecData"],
  data() {
    let self = this;
    return {
      mapObj: null,
      amapManager,
      mapOptions: {
        mapStyle: "amap://styles/whitesmoke", //whitesmoke //8ef17ea2354d5c3d45ec46141986a67b',//样式URL
        zoom: 15,
        zooms: [1, 22],
        showLabel: true,
        resizeEnable: true,
        animateEnable: true,
        center: [114.34253, 30.49984],
        pitch: 0,
        rotation: 0,
        buildingAnimation: true, //楼块出现是否带动画
        expandZoomRange: true
      },
      PathSimplifier: null,
      pathSimplifierIns: null,
      events: {
        //初始化地图
        init(instance) {
          self.mapObj = amapManager.getMap();

          //实时轨迹  高德巡航器
          AMapUI.load(["ui/misc/PathSimplifier"], function(PathSimplifier) {
            if (!PathSimplifier.supportCanvas) {
              alert("当前环境不支持 Canvas！");
              return;
            }
            self.PathSimplifier = PathSimplifier;
            let trackImg = require("../../../stastic/img/ExZtc/truck_online.png");
            self.pathSimplifierIns = new PathSimplifier({
              map: self.mapObj, //所属的地图实例
              autoSetFitView: true,
              zIndex: 500,
              getPath: function(pathData, pathIndex) {
                //返回轨迹数据中的节点坐标信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng|number,lat|number],...]
                return pathData.path;
              },
              getHoverTitle: function(pathData, pathIndex, pointIndex) {
                if (pointIndex >= 0) {
                  return "点： " + pointIndex;
                }
              },
              renderOptions: {
                //轨迹线的样式
                pathLineStyle: {
                  strokeStyle: "#666",
                  borderStyle: "#333",
                  lineWidth: 5,
                  dirArrowStyle: true
                },
                pathLineHoverStyle: {
                  strokeStyle: "#0078ff",
                  borderStyle: "#00b4ff",
                  lineWidth: 5,
                  dirArrowStyle: true
                },
                pathNavigatorStyle: {
                  width: 36,
                  height: 36,
                  lineJoin: "round",
                  content: self.PathSimplifier.Render.Canvas.getImageContent(
                    trackImg,
                    function onload() {
                      self.pathSimplifierIns.renderLater();
                    },
                    function onerror(e) {
                      console.log("图片加载失败！");
                    }
                  ),
                  pathLinePassedStyle: {
                    strokeStyle: "#11c711",
                    borderStyle: "#0078ff",
                    lineWidth: 5,
                    dirArrowStyle: true,
                    pathTolerance: 1
                  }
                }
              }
            });
          });
          //end
        }
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近10分钟",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 600 * 1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近30分钟",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 1800 * 1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近两小时",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 2);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近半天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 12);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      rules: {
        VecNo: [
          { required: true, message: "请输入完整车牌号", trigger: "blur" },
          { min: 7, max: 7, message: "完整车牌号应为7个字符", trigger: "blur" }
        ]
      },
      vecHisData: {
        show: false,
        VecNo: ""
      },
      formInline: {
        VecNo: "",
        date: [new Date(2019, 10, 1, 12), new Date(2019, 10, 1, 13)]
      },
      navgTrack: null,
      hisTrackData: [],
      hisLoading: false,
      hisNavgControl: {
        show: false,
        play: false,
        pause: false,
        resume: false,
        seek: 0,
        seekMax: 100,
        speed: 4,
        optSpeed: [
          {
            label: "正常播放",
            value: 1
          },
          {
            label: "快速播放",
            value: 2
          },
          {
            label: "急速播放",
            value: 4
          },
          {
            label: "光速播放",
            value: 8
          }
        ]
      }
    };
  },
  mounted() {
    let self = this;
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000);
    self.$nextTick(() => {
      self.vecHisData = self.vecData;
      self.formInline.VecNo = self.vecData.VecNo;
      self.formInline.date = [start, end];
      console.log(self.vecHisData);
    });
  },
  methods: {
    hisTrackThis() {
      let self = this;
      if (hisId != null) {
        //判断计时器是否为空
        clearInterval(hisId);
        hisId = null;
      }
      self.hisLoading = true;
      hisId = setTimeout(function() {
        self.$http
          .post(api.host + api.GetHisLocPayUrl, {
            VehicleNo: self.formInline.VecNo,
            StartDateTime: self.formInline.date[0],
            EndDateTime: self.formInline.date[1]
          })
          .then(res => {
            console.log(res);
            if (res.data.Code == 0) {
              let srcHis = res.data.Data;
              self.hisTrackData = [];
              for (var i in srcHis) {
                self.hisTrackData.push([srcHis[i].Lon, srcHis[i].Lat]);
              }
              console.log(self.hisTrackData);
              if (self.pathSimplifierIns) {
                self.pathSimplifierIns.setData([
                  {
                    name: self.formInline.VecNo,
                    path: self.hisTrackData
                  }
                ]);
                self.navgTrack = self.pathSimplifierIns.createPathNavigator(
                  0, //关联第1条轨迹
                  {
                    loop: false, //循环播放
                    speed: 10
                  }
                );
                //开始播放
                self.hisNavgPlay("play");
                self.hisNavgControl.show = true;
                self.hisNavgControl.max = srcHis.length - 1;
                //运行控制速度和按钮
                self.navgTrack.on("move", function() {
                  let seekIndex = self.navgTrack.getCursor().idx;
                  var speedData = srcHis[seekIndex].Speed;
                  if (speedData > 0)
                    self.navgTrack.setSpeed(
                      speedData * self.hisNavgControl.speed * 5
                    );
                  self.hisNavgControl.seek = seekIndex;
                  console.log(speedData + " / " + self.hisNavgControl.speed);

                  //播放完成
                  if (seekIndex == srcHis.length - 1) {
                    self.navgTrack.stop();
                    self.hisNavgControl.seek = 0;
                    self.hisNavgControl.play = true;
                    self.hisNavgControl.resume = false;
                    self.hisNavgControl.pause = false;
                  }
                });
              }
              self.hisLoading = false;
            }
          })
          .catch(error => {
            console.log(error);
            self.hisLoading = false;
          });
      }, 1500);
    },

    hisNavgPlay(state) {
      let self = this;
      switch (state) {
        case "play":
          self.hisNavgControl.seek = 0;
          self.navgTrack.start();
          self.hisNavgControl.play = false;
          self.hisNavgControl.resume = false;
          self.hisNavgControl.pause = true;
          break;
        case "resume":
          self.navgTrack.resume();
          self.hisNavgControl.play = false;
          self.hisNavgControl.resume = false;
          self.hisNavgControl.pause = true;
          break;
        case "pause":
          self.navgTrack.pause();
          self.hisNavgControl.play = false;
          self.hisNavgControl.resume = true;
          self.hisNavgControl.pause = false;
          break;
        case "stop":
          self.hisNavgControl.seek = 0;
          self.navgTrack.stop();
          self.hisNavgControl.play = true;
          self.hisNavgControl.resume = false;
          self.hisNavgControl.pause = false;
          self.navgTrack.moveToPoint(0);
          break;
      }
    },

    handlePlaySpeed() {},
    onSearch(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.formInline);
          this.hisTrackThis();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  watch: {
    "vecData.VecNo"(n) {
      let self = this;
      console.log(n);
      if (n) {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000);
        self.vecHisData = self.vecData;
        self.formInline.VecNo = self.vecData.VecNo;
        self.formInline.date = [start, end];
        console.log(self.vecHisData);
      }
    }
  }
};
</script>
 <style lang="less">
.map-wd-track {
  .el-dialog__body {
    padding: 0;

    .map-wd-track-search {
      width: 96%;
      border-radius: 5px;
      position: absolute;
      top: 42px;
      left: 50%;
      margin-left: -48%;
      background-color: #fff;
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
      padding: 5px 0;
    }

    .map-wd-track-control {
      width: 46%;
      border-radius: 5px;
      position: absolute;
      bottom: 15px;
      left: 15px;
      background-color: #333;
      box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
      padding: 5px 20px;

      .el-button.is-circle {
        padding: 0;
        font-size: 32px;
        border: none;
      }

      .el-button--primary {
        color: #409eff;
        background: none;
        &:hover {
          color: #fff;
          background: #409eff;
        }
      }
    }

    .el-form-item {
      margin: 0 !important;
    }
  }
}
</style>
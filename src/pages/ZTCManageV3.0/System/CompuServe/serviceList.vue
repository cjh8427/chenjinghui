<template>
  <div class="wrapper serviceWrapper">
    <div class="serviceHandle">
      <el-button type="info" size="small">升级服务</el-button>
      <el-button type="info" size="small" v-if="isEdit" @click="isEdit=false">编辑服务</el-button>
      <el-button type="info" size="small" v-if="!isEdit" @click="handleSaveService">保存服务</el-button>
    </div>
    <div class="serviceContainer">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header">
              <span>报警</span>
            </div>
            <el-col
              :xs="12"
              :sm="8"
              :md="8"
              :lg="6"
              v-for="(item, key) in serviceType[0].serviceList"
              :key="key"
            >
              <div
                class="ex-service-type-item"
                :class="{'ex-active': item.isSelected}"
                @click="!isEdit && handleClickItem(item)"
              >
                <i
                  class="iconClass"
                  :class="{'el-icon-circle-check': item.isSelected, 'el-icon-circle-close':!item.isSelected }"
                ></i>
                <span>{{item.name}}</span>
              </div>
            </el-col>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header">
              <span>运营统计</span>
            </div>
            <el-col :span="6" v-for="(item, key) in serviceType[1].serviceList" :key="key">
              <div
                class="ex-service-type-item"
                :class="{'ex-active': item.isSelected}"
                @click="!isEdit && handleClickItem(item)"
              >
                <i
                  class="iconClass"
                  :class="{'el-icon-circle-check': item.isSelected, 'el-icon-circle-close':!item.isSelected }"
                ></i>
                <span>{{item.name}}</span>
              </div>
            </el-col>
          </el-card>

          <el-card class="box-card" style="margin: 50px 0">
            <div slot="header">
              <span>服务</span>
            </div>
            <el-col
              :xs="12"
              :sm="8"
              :md="8"
              :lg="6"
              v-for="(item, key) in serviceType[2].serviceList"
              :key="key"
            >
              <div
                class="ex-service-type-item"
                :class="{'ex-active': item.isSelected}"
                @click="!isEdit && handleClickItem(item)"
              >
                <i
                  class="iconClass"
                  :class="{'el-icon-circle-check': item.isSelected, 'el-icon-circle-close':!item.isSelected }"
                ></i>
                <span>{{item.name}}</span>
              </div>
            </el-col>
          </el-card>

          <el-card class="box-card">
            <div slot="header">
              <span>其他</span>
            </div>
            <el-col
              :xs="12"
              :sm="8"
              :md="8"
              :lg="6"
              v-for="(item, key) in serviceType[3].serviceList"
              :key="key"
            >
              <div
                class="ex-service-type-item"
                :class="{'ex-active': item.isSelected}"
                @click="!isEdit && handleClickItem(item)"
              >
                <i
                  class="iconClass"
                  :class="{'el-icon-circle-check': item.isSelected, 'el-icon-circle-close':!item.isSelected }"
                ></i>
                <span>{{item.name}}</span>
              </div>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="serviceContainer">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header">
              <span>附加门禁计算服务</span>
            </div>
            <el-col
              :xs="12"
              :sm="8"
              :md="8"
              :lg="6"
              v-for="(item, key) in serviceType[4].serviceList"
              :key="key"
            >
              <div
                class="ex-service-type-item"
                :class="{'ex-active': item.isSelected}"
                @click="!isEdit && handleClickItem(item)"
              >
                <i
                  class="iconClass"
                  :class="{'el-icon-circle-check': item.isSelected, 'el-icon-circle-close':!item.isSelected }"
                ></i>
                <span>{{item.name}}</span>
              </div>
            </el-col>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card class="box-card">
            <div slot="header">
              <span>附加扬尘有害气体计算服务</span>
            </div>
            <el-col :span="6" v-for="(item, key) in serviceType[5].serviceList" :key="key">
              <div
                class="ex-service-type-item"
                :class="{'ex-active': item.isSelected}"
                @click="!isEdit && handleClickItem(item)"
              >
                <i
                  class="iconClass"
                  :class="{'el-icon-circle-check': item.isSelected, 'el-icon-circle-close':!item.isSelected }"
                ></i>
                <span>{{item.name}}</span>
              </div>
            </el-col>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "serviceList",
  data() {
    return {
      isEdit: true,
      warnServiceList: [
        { name: "紧急报警", value: 1, icon: "el-icon-s-platform" },
        { name: "超速报警", value: 2, icon: "el-icon-video-play" }
      ],
      menjinServiceList: [],
      yunyingServiceList: [],
      fuwuServiceList: [],
      othersServiceList: [],
      yangchenServiceList: [],

      serviceType: [
        {
          name: "报警",
          type: 1,
          serviceList: [
            { name: "紧急报警", isSelected: true },
            { name: "GNSS模块天线", isSelected: true },
            { name: "终端主电源断电", isSelected: true },
            { name: "休眠报警", isSelected: true },
            { name: "路线偏离报警", isSelected: true },
            { name: "GNSS模块天线短路", isSelected: true },
            { name: "进区域报警", isSelected: true },
            { name: "车辆非法位移", isSelected: true },
            { name: "超速报警", isSelected: true },
            { name: "终端LED或电视器故障", isSelected: true },
            { name: "出区域报警", isSelected: true },
            { name: "碰撞侧翻报警", isSelected: true },
            { name: "预警", isSelected: true },
            { name: "摄像头故障", isSelected: true },
            { name: "区域超速报警", isSelected: true },
            { name: "线路关键点监控（未离开）", isSelected: true },
            { name: "停车超速报警", isSelected: true },
            { name: "TTS模块故障", isSelected: true },
            { name: "分路段限速监控", isSelected: true },
            { name: "线路关键点监控（未到达）", isSelected: true },
            { name: "GNSS模块发生故障", isSelected: true },
            { name: "疲劳驾驶报警", isSelected: true },
            { name: "路段行驶时间过长", isSelected: true },
            { name: "超速报警（平台）", isSelected: true },
            { name: "出路线报警", isSelected: true },
            { name: "车辆被盗", isSelected: true },
            { name: "当天累计驾驶超时", isSelected: true },
            { name: "非法时间启动", isSelected: false },
            { name: "进路线报警", isSelected: true },
            { name: "终端主电源欠压", isSelected: true },
            { name: "车辆VVS报警", isSelected: true },
            { name: "车辆油量异常报警", isSelected: true },
            { name: "车辆非法点火", isSelected: true },
            { name: "路段行驶时间不足", isSelected: false }
          ]
        },
        {
          name: "运营统计",
          type: 1,
          serviceList: [
            { name: "里程统计", isSelected: true },
            { name: "趟次计算", isSelected: false },
            { name: "车辆在线率", isSelected: true }
          ]
        },
        {
          name: "服务",
          type: 1,
          serviceList: [
            { name: "停留点计算", isSelected: true },
            { name: "趟次计算", isSelected: true },
            { name: "语音播报", isSelected: true },
            { name: "GPS存储", isSelected: true },
            { name: "GPS纠偏", isSelected: true },
            { name: "车流量统计", isSelected: true },
            { name: "媒体存储", isSelected: false }
          ]
        },
        {
          name: "其他",
          type: 1,
          serviceList: [
            { name: "未密闭告警计算", isSelected: true },
            { name: "超载告警计算", isSelected: true },
            { name: "线路偏移报警", isSelected: true },
            { name: "（平台）超速报警", isSelected: true },
            { name: "Adas报警计算", isSelected: true },
            { name: "非法停车", isSelected: true },
            { name: "DMS", isSelected: false }
          ]
        },
        {
          name: "附加门禁计算服务",
          type: 1,
          serviceList: [
            { name: "门禁规则同步", isSelected: true },
            { name: "非法运输预警", isSelected: true },
            { name: "案件推送（案件执法）", isSelected: true },
            { name: "黑车预警", isSelected: true },
            { name: "车辆清洗预警", isSelected: true }
          ]
        },
        {
          name: "附加扬尘有害气体计算服务",
          type: 1,
          serviceList: [
            { name: "扬尘噪音存储", isSelected: true },
            { name: "有害气体存储", isSelected: true }
          ]
        }
      ]
    };
  },
  mounted() {},
  methods: {
    handleClickItem(item) {
      item.isSelected = !item.isSelected;
    },
    // 保存服务
    handleSaveService() {
      this.$message({
        message: "保存成功",
        type: "success",
        center: true
      });
      this.isEdit = true;
    }
  }
};
</script>

<style scoped lang="scss">
</style>
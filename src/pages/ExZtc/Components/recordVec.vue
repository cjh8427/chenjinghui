<template>
  <div class="map-record-vec" vid="mapRadius">
    <el-badge :value="recordVecData.length" class="item" v-if="recordVecData.length>0">
      <el-button type="text" @click="drawerRecord=true">临时过车记录</el-button>
    </el-badge>
    <el-drawer title="临时过车记录" :visible.sync="drawerRecord" size="90%" direction="btt">
      <el-tabs
        v-model="activeName"
        type="border-card"
        closable
        :stretch="true"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          :key="item.name"
          v-for="(item, index) in recordVecData"
          :label="item.title"
          :name="item.name"
        >
          <div class="map-reord-vec-tag">
            <el-tag>卡口地址：{{item.title}}</el-tag>
            <el-tag>半径：{{item.radius}}米</el-tag>
            <el-tag>开始记录时间：{{item.time}}</el-tag>
            <el-tag>经过车辆数：{{item.data.length}}辆</el-tag>
            <el-button
              type="primary"
              icon="el-icon-coordinate"
              size="mini"
              @click="panToFence(item.center)"
              class="fr"
            >定位</el-button>
          </div>

          <el-table
            :data="item.data"
            v-loading="item.vecListLoading"
            max-height="620"
            style="width: 100%"
            border
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column prop="VehicleNo" align="center" sortable label="车牌号" width="120"></el-table-column>
            <el-table-column prop="RecordTime" align="center" sortable label="最后经过时间" width="220"></el-table-column>
            <el-table-column prop="EnterpriseName" sortable label="所属企业"></el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template slot-scope="scope">
                <el-button size="mini" type="primary">查看轨迹</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>
<script>
import api from "../Configs/api";
import Util from "../Configs/util.lib";

let recordId = null;

export default {
  props: ["recordData"],
  data() {
    return {
      drawerRecord: false,
      activeName: "1",
      recordVecData: []
    };
  },
  methods: {
    removeTab(targetName) {
      let self = this;
      let tabs = self.recordVecData;
      let activeName = self.activeName;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      self.activeName = activeName;
      self.recordVecData = tabs.filter(tab => tab.name !== targetName);
    },
    recordThis(data, index) {
      let self = this;
      self.$http
        .post(api.host + api.PostQueryCircleUrl, {
          Lon: data[index].center[0],
          Lat: data[index].center[1],
          Radius: data[index].radius
        })
        .then(res => {
          if (res.data.Code == 0) {
            let rData = res.data.Data;
            let nowData = self.recordVecData[index].data;
            // let nowData = localStorage.$recordVecData
            //   ? JSON.parse(localStorage.$recordVecData).concat(
            //       self.recordVecData[index].data
            //     )
            //   : self.recordVecData[index].data;
            console.log(nowData);
            for (var i in rData) {
              if (
                rData[i].VehStatusInfo == "行驶" ||
                rData[i].VehStatusInfo == "停车"
              ) {
                rData[i].RecordTime = Util.setDate(new Date().getTime());
                nowData.unshift(rData[i]);
              }
            }
            self.recordVecData[index].data = uniq(nowData);
            localStorage.$recordVecData = JSON.stringify(
              self.recordVecData[index].data
            );
          }
        })
        .catch(error => {
          console.log(error);
        });

      function uniq(array) {
        var temp = [];
        var index = [];
        var l = array.length;
        for (var i = 0; i < l; i++) {
          for (var j = i + 1; j < l; j++) {
            if (array[i].VehicleNo === array[j].VehicleNo) {
              i++;
              j = i;
            }
          }
          temp.push(array[i]);
          index.push(i);
        }
        console.log(index);
        return temp;
      }
    },
    panToFence(center) {
      this.$emit("panToFence", center);
      this.drawerRecord = false;
    }
  },
  watch: {
    recordData(data) {
      let self = this;
      if (data) {
        console.log(data);
        let recordDate = new Date().getTime();
        self.activeName = recordDate + "";
        var geocoder = new AMap.Geocoder({
          city: "027", //城市设为北京，默认：“全国”
          radius: 100 //范围，默认：500
        });
        geocoder.getAddress(data[0].center, function(status, result) {
          if (status === "complete" && result.regeocode) {
            var address = result.regeocode.formattedAddress;
            self.recordVecData.unshift({
              title: address,
              name: self.activeName,
              time: Util.setDate(recordDate),
              center: data[0].center,
              radius: data[0].radius,
              data: []
            });
            self.recordThis(data, 0);
          } else {
            log.error("根据经纬度查询地址失败");
          }
        });
      }
    },
    recordVecData(data) {
      let self = this;
      if (data) {
        if (recordId) {
          clearInterval(recordId);
          recordId = null;
        }
        recordId = setInterval(() => {
          for (var i in data) {
            self.recordThis(data, i);
          }
        }, 30000);
      }
    }
  }
};
</script>
<style lang="less">
.map-record-vec {
  float: left;
  cursor: pointer;
  display: inline-block;
  border-radius: 5px 5px 0 0;
  background: linear-gradient(to bottom, #333 0%, #000000 100%);

  .el-button {
    color: #fff;
    padding: 15px;
    text-align: left;
  }
}
.el-drawer__header {
  font-size: 13px;
  padding: 0 20px;
  height: 32px;
  color: #fff;
  margin: 0;
  background: linear-gradient(to bottom, #333 0%, #000000 100%);
  line-height: 1;
  box-shadow: inset -5px -5px 12px rgba(0, 0, 0, 0.15);
}

.el-table th,
.el-table td {
  padding: 5px 0;
}

.map-reord-vec-tag {
  padding: 20px;
}
</style>
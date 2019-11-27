<template>
  <div>
    <el-table
      :data="TableData.Data"
      v-loading="loading"
      max-height="700"
      border
      style="width: 100%"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      class="table-search"
    >
      <el-table-column prop="VehicleNo" align="center" width="260">
        <template slot="header" slot-scope="scope">
          <el-form :inline="true" size="mini">
            <el-form-item>
              <el-input v-model="TableData.SearchParms" clearable placeholder="请输入车牌号">
                <el-button slot="append" icon="el-icon-search" @click="getVechileList"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="EnterpriseName" sortable label="所属企业" width="200"></el-table-column>
      <el-table-column
        prop="GpsData.VehicleStatus"
        align="center"
        sortable
        width="120"
        :filters="[{ text: '行驶', value: '行驶'  }, { text: '停车', value:'停车' }, { text: '熄火', value:'熄火' }, { text: '定位失败', value:'定位失败' }, { text: '通讯中断', value:'通讯中断' }]"
        :filter-method="filterVecState"
        label="车辆状态"
      >
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="dark"
            style="width:80%"
            v-if="scope.row.GpsData.VehicleStatus == '行驶' || scope.row.GpsData.VehicleStatus == '停车'"
          >{{scope.row.GpsData.VehicleStatus}}</el-tag>
          <el-tag
            effect="dark"
            style="width:80%"
            v-if=" scope.row.GpsData.VehicleStatus == '熄火'"
          >{{scope.row.GpsData.VehicleStatus}}</el-tag>
          <el-tag
            type="info"
            effect="dark"
            style="width:80%"
            v-if="scope.row.GpsData.VehicleStatus == '通讯中断'"
          >{{scope.row.GpsData.VehicleStatus}}</el-tag>
          <el-tag
            type="danger"
            effect="dark"
            style="width:80%"
            v-if="scope.row.GpsData.VehicleStatus == '定位失败'"
          >{{scope.row.GpsData.VehicleStatus}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="AlarmCount" align="center" sortable width="120" label="预警次数"></el-table-column>
      <el-table-column prop="GpsData.Speed" align="center" sortable width="120" label="速度"></el-table-column>
      <el-table-column
        prop="FrontDoor"
        align="center"
        sortable
        width="120"
        label="顶棚"
        :filters="[{ text: '密闭', value: true }, { text: '未密闭', value:false }]"
        :filter-method="filterVecCover"
      >
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="dark"
            style="width:80%"
            v-if="scope.row.GpsData.FrontDoor"
          >密闭</el-tag>
          <el-tag
            type="danger"
            effect="dark"
            style="width:80%"
            v-if="!scope.row.GpsData.FrontDoor"
          >未密闭</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="GpsData.GpsDateTime" sortable label="最后定位时间"></el-table-column>
      <el-table-column prop="GpsData.Poi.Address" sortable label="最后定位位置"></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="pinToV(scope.$index, scope.row)">跟踪</el-button>
          <el-button size="mini" type="warning" plain @click="pinToV(scope.$index, scope.row)">定位</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="changeSize"
      @current-change="changePage"
      :current-page="TableData.PageIndex"
      :page-sizes="[50, 100, 200, 300, 400, 500, 1000]"
      :page-size="TableData.PageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="TableData.PageTotal"
    ></el-pagination>
  </div>
</template>
<script>
import api from "../../Configs/api";
import Util from "../../Configs/util.lib";

export default {
  data() {
    return {
      loading: false,
      TableData: {
        SearchParms: "",
        PageIndex: 1,
        PageSize: 50,
        PageTotal: 0,
        Data: []
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getVechileList();
    });
  },
  methods: {
    //获取车辆列表
    getVechileList() {
      let self = this;
      self.loading = true;
      self.$http
        .post(api.host + api.GetVehicleListUrl, {
          VehicleNo: self.TableData.SearchParms,
          PageIndex: self.TableData.PageIndex,
          PageSize: self.TableData.PageSize
        })
        .then(res => {
          console.log(res);
          if (res.data.Code == 0) {
            let ResData = res.data.Data.DataItems;
            for (var i in ResData) {
              if (!ResData[i].GpsData) {
                ResData[i].GpsData = {
                  GpsDateTime: "未知",
                  FrontDoor: "未知"
                };
              } else {
                ResData[i].GpsData.GpsDateTime = Util.getNow(
                  ResData[i].GpsData.GpsDateTime
                );
              }
            }
            self.TableData.Data = ResData;
            self.TableData.PageTotal = res.data.Data.TotalCount;
          }
          self.loading = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeSize(index) {
      this.TableData.PageSize = index;
      this.TableData.PageIndex = 1;
      this.getVechileList();
    },
    changePage(index) {
      this.TableData.PageIndex = index;
      this.getVechileList();
    },
    //表格过滤
    filterVecCover(value, row) {
      return row.GpsData.FrontDoor === value;
    },
    filterVecState(value, row) {
      return row.GpsData.VehicleStatus === value;
    },
    pinToV(index, row) {
      this.$emit("pinToV", row);
    }
  }
};
</script>
<style lang="less">
.el-table th div {
  line-height: 24px;
}
.table-search {
  .el-form-item.el-form-item--mini {
    margin: 0;
  }

  .el-input__inner {
    width: 140px;
    float: left;
  }
  .el-input-group__append {
    line-height: 26px !important;
  }
}
</style>
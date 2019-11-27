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
      <el-table-column prop="Name" label="工地名称" width="300">
        <template slot="header" slot-scope="scope">
          <el-form :inline="true" size="mini">
            <el-form-item>
              <el-input v-model="TableData.SearchParms" clearable placeholder="请输入工地名称">
                <el-button slot="append" icon="el-icon-search" @click="searchSiteTable"></el-button>
              </el-input>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="Address" sortable label="工地地址" width="420"></el-table-column>

      <el-table-column
        prop="Poi.SiteType"
        align="center"
        sortable
        label="工地状态"
        width="140"
        :filters="[{ text: '提前出土', value: 1 }, { text: '未上报出土', value: 2 },{ text: '上报未出土', value: 3 }, { text: '上报工地', value: 5 }, { text: '核准工地', value: 4 }, { text: '停车场', value: 0 }]"
        :filter-method="filterSite"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            style="width:80%;background-color:#753ec7;border-color:#753ec7"
            v-if="scope.row.Poi.SiteType === 0"
          >{{scope.row.Poi.SiteState}}</el-tag>
          <el-tag
            type="warning"
            effect="dark"
            style="width:80%"
            v-if="scope.row.Poi.SiteType === 1"
          >{{scope.row.Poi.SiteState}}</el-tag>
          <el-tag
            type="danger"
            effect="dark"
            style="width:80%"
            v-if="scope.row.Poi.SiteType === 2"
          >{{scope.row.Poi.SiteState}}</el-tag>
          <el-tag
            type="success"
            effect="dark"
            style="width:80%"
            v-if="scope.row.Poi.SiteType === 5"
          >{{scope.row.Poi.SiteState}}</el-tag>
          <el-tag
            type="success"
            effect="dark"
            style="width:80%"
            v-if="scope.row.Poi.SiteType === 3 || scope.row.Poi.SiteType === 4"
          >{{scope.row.Poi.SiteState}}</el-tag>
          <el-tag
            effect="dark"
            style="width:80%;background:#a24fff;border-color:#a24fff"
            v-if="scope.row.Poi.SiteType === 6"
          >{{scope.row.Poi.SiteState}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="UnearthedTime" align="center" sortable width="160" label="出土时间"></el-table-column>
      <el-table-column prop="TripConut" align="center" sortable width="120" label="运输趟次"></el-table-column>
      <el-table-column prop="SiteVehRate" align="center" sortable width="160" label="工地上线率">
        <template slot-scope="scope">
          <span v-if="scope.row.SiteVehRate">{{scope.row.SiteVehRate}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="ReportVehCount" align="center" sortable width="160" label="工地上报车辆">
        <template slot-scope="scope">
          <span v-if="scope.row.ReportVehCount">{{scope.row.ReportVehCount}}辆</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="Online"
        align="center"
        sortable
        label="门禁状态"
        width="140"
        :filters="[{ text: '在线', value: '在线' }, { text: '离线', value: '离线' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end"
      >
        <template slot-scope="scope">
          <el-tag
            type="success"
            effect="dark"
            style="width:80%"
            v-if="scope.row.Online === '在线'"
          >{{scope.row.Online}}</el-tag>
          <el-tag
            type="danger"
            effect="dark"
            style="width:80%"
            v-if="scope.row.Online === '离线'"
          >{{scope.row.Online}}</el-tag>
          <el-tag
            type="info"
            effect="dark"
            style="width:80%"
            v-if="scope.row.Online === '未安装'"
          >{{scope.row.Online}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="ControlCarRecordCount"
        align="center"
        sortable
        width="110"
        label="门禁过车数量(24小时)"
      ></el-table-column>

      <el-table-column prop="DepartmentName" align="center" label="所属区域" width="120"></el-table-column>
      <el-table-column label="操作" width="260" fixed="right">
        <template slot="header" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-refresh"
            size="mini"
            round
            style="margin:0 auto"
            @click="getSiteList"
          >刷新列表</el-button>
        </template>
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="warning"
            icon="el-icon-coordinate"
            plain
            @click="pinToS(scope.$index, scope.row)"
          >定位</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            v-if="scope.row.ControlCarRecordCount1>0"
            @click="pinToS(scope.$index, scope.row)"
          >车辆记录(预留)</el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-document-copy"
            plain
            v-if="scope.row.ControlCarRecordCount>0"
            @click="showCross(scope.row.CloudMapId,scope.row)"
          >门禁记录</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import api from "../../Configs/api";
let wgs84togcj02 = require("../../../../common/plugin/gps").wgs84togcj02;
import Util from "../../Configs/util.lib";

export default {
  props: ["siteTableData"],
  data() {
    return {
      loading: false,
      TableData: {
        SearchParms: "",
        PageIndex: 1,
        PageSize: 50,
        PageTotal: 0,
        Data: []
      },
      siteMonitorMarkers: [],
      siteMarkers: [],
      sitePathArr: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.TableData.Data = this.siteTableData;
    });
  },
  methods: {
    getSiteList() {
      this.loading = true;
      this.$emit("getSiteList");
    },
    //工地表格搜索
    searchSiteTable() {
      let self = this;
      let keyWord = self.TableData.SearchParms;
      let allList = self.TableData.Data;
      let tempList = [];
      if (!keyWord) {
        self.getSiteList();
        return false;
      }
      for (var key in allList) {
        // console.log(allList[key].Name);
        if (allList[key].Name.indexOf(keyWord) != -1) {
          tempList.push(allList[key]);
        }
      }
      self.TableData.Data = tempList;
    },
    //表格过滤
    filterSite(value, row) {
      return row.Poi.SiteType === value;
    },
    filterTag(value, row) {
      return row.Online === value;
    },
    //工地定位
    pinToS(index, row) {
      this.$emit("pinToS", row);
    }
  },
  watch: {
    siteTableData(n) {
      if (n) {
        this.TableData.Data = n;
        this.loading = false;
      }
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
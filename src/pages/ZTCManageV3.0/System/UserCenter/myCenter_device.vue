<template>
  <div class="wrapper">
    <div class="sys-search">
      <div class="sys-search-formItem">
        <el-form :model="searchBtn" :inline="true" ref="searchBtn" align="left">
          <el-form-item prop label="筛选:">
            <el-button type="info" size="small">全部</el-button>
            <el-button type="info" size="small">依迅设备</el-button>
            <el-button type="info" size="small">自购设备</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="sys-search-formItem">
        <el-form :model="searchForm" :inline="true" ref="searchForm" align="right">
          <el-form-item prop label>
            <el-input
              v-model="searchForm.searchContent"
              placeholder="请输入搜索的内容"
              suffix-icon="el-icon-search"
              size="small"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <table-mixin
      :pageSize="pageSize"
      :pageNum="pageNum"
      :total="total"
      :pagination="pagination"
      :handleSizeChange="handleSizeChange"
      :handleCurrentChange="handleCurrentChange"
    >
      <el-table
        :height="tableHeight"
        stripe
        header-row-class-name="ex-table-header"
        border
        :data="tableData.body"
      >
        <el-table-column prop="platformVersion" label="设备版本" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="platformType" label="设备来源" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="platformTime" label="设备类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="surplusTime" label="设备号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jionVehType" label="设备协议" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jionVehCount" label="车牌号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="deviceAddress" label="设备对接地址" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="danger" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-mixin>
  </div>
</template>

<script>
import { tableDataMixin } from "~/pages/ZTCManageV3.0/System/Component/Common/TableMixin/mixin";
export default {
  mixins: [tableDataMixin],
  name: "myCenterPlatform",
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      sortName: "",
      sortValue: "",
      pagination: true,
      tableHeight: window.innerHeight - 300,
      tableData: {
        loading: true,
        body: [
          {
            platformVersion: "基础版",
            platformType: "依迅设备",
            platformTime: "设备类型1",
            surplusTime: "001",
            jionVehType: "协议1",
            jionVehCount: "鄂A12345",
            deviceAddress: "地址111",
            createTime: "2019-09-09"
          },
          {
            platformVersion: "旗舰版",
            platformType: "自购设备",
            platformTime: "设备类型2",
            surplusTime: "002",
            jionVehType: "协议2",
            jionVehCount: "鄂A67890",
            deviceAddress: "地址222",
            createTime: "2019-09-10"
          }
        ]
      },
      searchForm: {
        searchContent: ""
      },
      searchBtn: {}
    };
  },
  methods: {
    getTableData() {
      /*                let param = {
                                }
                                this.$axios({
                                    url: '',
                                    method: 'post',
                                    baseURL: '',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: param
                                }).then((res) => {
                                    if (res.success) {
                                        this.dealTableResponse(res)
                                    } else {
                                        this.$message.error(res.msg)
                                    }
                                })*/
    },
    formatColumn(row, column, cellValue, index) {},
    handleClick(row) {
      console.log(row);
    }
  }
};
</script>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.slider {
  width: 200px;
  height: 100%;
  color: #151515;
  background-color: #e9edf3;
}
.main {
  width: calc(100% - 210px);
  height: 100%;
  background-color: #fff;
  margin-left: 10px;
  border-radius: 6px;
  border: 1px solid #fff;
}
.el-menu-item.is-active {
  color: #4a71d4;
  background-color: #fff;
}
.sys-search {
  display: flex;
  flex-direction: row;
  padding: 20px;
}
.sys-search-formItem {
  flex: 1;
}
</style>
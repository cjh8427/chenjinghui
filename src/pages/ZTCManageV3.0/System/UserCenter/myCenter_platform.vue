<template>
  <div class="wrapper">
    <div class="sys-search">
      <div class="sys-search-formItem">
        <el-form :model="searchBtn" :inline="true" ref="searchBtn" align="left">
          <el-form-item prop label="筛选:">
            <el-button type="info" size="small">全部</el-button>
            <el-button type="info" size="small">依迅平台</el-button>
            <el-button type="info" size="small">自建平台</el-button>
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
        :data="tableData.body"
      >
        <el-table-column prop="platformVersion" label="平台版本" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="platformType" label="平台类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="platformTime" label="平台使用期限" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="surplusTime" label="剩余使用期限" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jionVehType" label="接入车辆类型" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="jionVehCount" label="接入车辆数量" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center" width="300">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
            <el-button type="text" size="small" @click="getPassWord">获取密码</el-button>
            <el-button type="text" size="small">生成key</el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-mixin>
    <el-dialog title="用户名密码" :visible.sync="dialogFormVisible" width="30%" left="30%" top="15%">
      <el-form :model="userForm" label-position="left" label-width="100px">
        <el-form-item label="用户名:">
          <span>{{userForm.username}}</span>
        </el-form-item>
        <el-form-item label="密码:">
          <span>{{userForm.password}}</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogFormVisible=false" size="small">确 定</el-button>
      </div>
    </el-dialog>
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
            platformVersion: "1.0.0",
            platformType: "依迅平台",
            platformTime: "3年",
            versionsId: "base",
            surplusTime: "2年",
            jionVehType: "渣土车",
            jionVehCount: "1000",
            createTime: "2019-09-09"
          },
          {
            platformVersion: "1.0.0",
            platformType: "依迅平台",
            platformTime: "3年",
            versionsId: "company",
            surplusTime: "2年",
            jionVehType: "渣土车",
            jionVehCount: "1000",
            createTime: "2019-09-09"
          },
          {
            platformVersion: "1.0.0",
            platformType: "依迅平台",
            platformTime: "3年",
            versionsId: "flagship",
            surplusTime: "2年",
            jionVehType: "渣土车",
            jionVehCount: "1000",
            createTime: "2019-09-09"
          }
        ]
      },
      searchForm: {
        searchContent: ""
      },
      searchBtn: {},
      dialogFormVisible: false,
      userForm: {
        username: "111",
        password: "333"
      }
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
      this.$router.push({
        path: "/system/UserCenter/mycenter/buyPlatformDetail",
        query: { versionsId: row.versionsId }
      });
    },
    getPassWord() {
      this.dialogFormVisible = true;
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
.wrapper/deep/.el-dialog__body {
  padding: 0 20px;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
}
.wrapper/deep/.el-form-item {
  margin-bottom: 0;
}
</style>
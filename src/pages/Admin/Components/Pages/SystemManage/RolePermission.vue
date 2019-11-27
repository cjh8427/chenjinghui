<template>
  <div class="ex-pages-table-content no-tree">
    <div class="ex-pages-table-content ex-pages-main" style="background:#e6e9f1">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin:15px;">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="el-icon-s-home" /> 首页
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/Index' }">系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>{{menuName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="ex-table-content ex-table-no-tree">
        <!-- 报表查询 -->
        <div class="ex-table-query">
          <el-form :inline="true" :model="formInline" size="small">
            <el-form-item label="角色名称">
              <el-input v-model="formInline.roleName" placeholder="请输入您要查询的角色名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">
                <i class="el-icon-search" /> 查询
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="handleAdd">
                <i class="el-icon-plus" /> 新增
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- 报表表格 -->
        <div class="ex-table-container">
          <el-table
            :loading="tableLoading"
            element-loading-text="数据请求中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(136, 136, 136, 0.5)"
            :data="gridData"
            row-key="name"
            border
            height="100%"
            max-height="100%"
            header-row-class-name="ex-table-header"
          >
            <!-- <el-table-column type="selection" fixed width="40" align="center"></el-table-column> -->
            <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="description" label="描述" align="center"></el-table-column>
            <el-table-column prop="action" fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="info"
                  @click="handleAdd(scope.$index, scope.row)"
                  icon="el-icon-key"
                >数据权限</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleMenuBtn(scope.$index, scope.row)"
                  icon="el-icon-brush"
                >菜单按钮权限</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="formInline.number"
          :page-size="formInline.size"
          :page-sizes="[20, 50, 100, 200]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="formInline.totalElements"
          class="ex-pagination"
        ></el-pagination>
      </div>
    </div>

    <!-- 新增弹框 -->
    <AddPermission :showModal="showModal" v-on:addPermission="addPermission" :rowData="rowData" />
    <AddMenuPermission
      :showModal="showMenuModal"
      v-on:addMenuPermission="addMenuPermission"
      :rowData="rowData"
    ></AddMenuPermission>
  </div>
</template>
<script>
import AddPermission from "../../Dialog/AddPermission";
import AddMenuPermission from "../../Dialog/AddMenuPermission";

export default {
  name: "role",
  components: {
    AddPermission,
    AddMenuPermission
  },
  data() {
    return {
      showModal: false,
      showMenuModal: false,
      menuName: this.$route.meta.title,
      hideMenu: true,
      activeIndex: this.$route.path,
      gridData: [],
      formInline: {
        roleName: null,
        size: 20, // 每页条数
        totalElements: 1, //总条数
        number: 1 // 当前页码
      },
      tableLoading: false,
      rowData: {},
      totalPage: 10
    };
  },

  mounted() {
    let self = this;
    self.$nextTick(() => {
      self.initGrid();
      self.initGridHeight();
    });
  },

  methods: {
    // 渲染翻页
    initPagination(oData) {
      for (var i in this.formInline) {
        if (oData[i]) {
          if (i == "number") {
            this.formInline[i] = oData[i] + 1;
          } else {
            this.formInline[i] = oData[i];
          }
        }
      }
      console.log(this.formInline);
    },

    // 每页条数改变
    handleSizeChange(oData) {
      this.formInline.size = oData;
      this.initGrid();
    },

    // 当前页码改变
    handleCurrentChange(oData) {
      this.formInline.number = parseInt(oData);
      this.initGrid();
    },

    // 初始化表格高度
    initGridHeight() {
      let pHeight = document.getElementsByClassName("ex-pages-table-content")[0]
        .offsetHeight;
      let qHeight = document.getElementsByClassName("ex-table-query")[0]
        .offsetHeight;
      document.getElementsByClassName("ex-table-container")[0].style.height =
        pHeight - qHeight - 132 + "px";
    },

    // 初始化表格数据
    initGrid() {
      let self = this;
      self.tableLoading = true;
      this.https.post("/role/searchList", this.formInline).then(res => {
        console.log(res);
        self.gridData = res.data.result.content;
        self.initPagination(res.data.result);
        self.tableLoading = false;
      });
    },

    // 设置菜单按钮权限
    handleMenuBtn(index, row) {
      this.showMenuModal = true;
      this.rowData = row;
    },

    // 设置菜单按钮的回调
    addMenuPermission(callbackValue) {
      this.showMenuModal = callbackValue.showModal;
      this.rowData = {};
      if (callbackValue.isReload) {
        this.initGrid();
      }
    },

    // 添加
    handleAdd() {
      this.showModal = true;
      this.rowData = {};
    },

    // 编辑
    handleEdit(index, row) {
      this.showModal = true;
      this.rowData = row;
    },

    // 删除操作
    handleDelete(index, row) {
      this.$confirm("确定删除该条记录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.https.post("/role/delete", { roleId: row.id }, function(oData) {
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {});
    },

    // 弹窗后的回调
    addPermission(callbackValue) {
      this.showModal = callbackValue.showModal;
      this.rowData = {};
      if (callbackValue.isReload) {
        this.initGrid();
      }
    },

    // 查询
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>

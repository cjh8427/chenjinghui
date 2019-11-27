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
            <el-form-item label="菜单名称">
              <el-input v-model="formInline.menuName" placeholder="请输入您要查询的菜单名称"></el-input>
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
            v-loading="tableLoading"
            element-loading-text="数据请求中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(136, 136, 136, 0.5)"
            :data="gridData"
            row-key="id"
            border
            lazy
            :load="loadSubGrid"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            height="100%"
            max-height="100%"
            header-row-class-name="ex-table-header"
          >
            <el-table-column prop="menuName" label="菜单名称" align="center"></el-table-column>
            <el-table-column prop="menuUrl" label="菜单路径" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="createUerName" label="创建人" align="center"></el-table-column>
            <el-table-column prop="action" fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.hasAction == true"
                  size="mini"
                  type="primary"
                  @click="handleAddBtn(scope.$index, scope.row)"
                  icon="el-icon-edit"
                >新增按钮</el-button>
                <el-button
                  v-else-if="!scope.row.hasAction"
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                >编辑</el-button>
                <el-button
                  v-else
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                >编辑按钮</el-button>

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
    <AddMenu :showModal="showModal" v-on:addMenu="addMenu" :rowData="rowData" />
    <!-- <AddBtn :showModal="showAddBtnModal" v-on:addBtn="addBtn" :rowData="rowData" /> -->
    <AddButtonGrid :showModal="showAddBtnGridModal" v-on:addBtnGrid="addBtnGrid" :rowData="rowData" />
  </div>
</template>
<script>
import AddMenu from "../../Dialog/AddMenu";
import AddBtn from "../../Dialog/AddButton";
import AddButtonGrid from "../../Dialog/AddButtonGrid";

export default {
  name: "menu",
  components: {
    AddMenu,
    AddBtn,
    AddButtonGrid
  },
  data() {
    return {
      postValue: {
        userId: 1
      },
      menuName: this.$route.meta.title,
      hideMenu: true,
      activeIndex: this.$route.path,
      gridData: [],
      showModal: false,
      showAddBtnModal: false,
      showAddBtnGridModal: false,
      formInline: {
        menuName: null,
        size: 20, // 每页条数
        totalElements: 1, //总条数
        number: 1 // 当前页码
      },
      rowData: {},
      tableLoading: false,
      totalPage: 10,
      listArr: []
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

    // 渲染表格
    initGrid() {
      let self = this;
      self.tableLoading = true;
      self.https.post("/menu/getMenuForm", self.formInline).then(res => {
        if (res.data.code == 0) {
          self.gridData = res.data.result;
          // self.initPagination(res.data.result);
        }
        self.tableLoading = false;
      });
    },

    // 懒加载表格结构子节点
    // loadSubGrid(tree, treeNode, resolve) {
    //   let self = this;
    //   debugger;
    //   self.https.get("/menu/searchSubList?menuId=" + tree.id).then(res => {
    //     tree.children = res.result;
    //     treeNode.childList = res.result;
    //   });
    // },

    loadSubGrid(tree, treeNode, resolve) {
      let self = this;
      // tree为点击那一行的数据
      self.https.get("/menu/searchSubList?menuId=" + tree.id).then(res => {
        res.result.forEach(item => {
          //判断是否有子节点
          if (item.pid > 0) {
            item.hasChildren = [];
          }
          this.listArr.push(item);
        });
        //传入res.dicList加载下一级
        resolve(res.result);
        if (res.result.length == 0) {
          this.$message({
            type: "error",
            message: "本节点以下暂无子节点!"
          });
        }
      });
    },

    // 初始化表格高度
    initGridHeight() {
      let pHeight = document.getElementsByClassName("ex-pages-table-content")[0]
        .offsetHeight;
      let qHeight = document.getElementsByClassName("ex-table-query")[0]
        .offsetHeight;
      document.getElementsByClassName("ex-table-container")[0].style.height =
        pHeight - qHeight - 117 + "px";
    },

    // 添加
    handleAdd() {
      this.showModal = true;
    },

    // 新增按钮
    handleAddBtn(index, row) {
      this.showAddBtnGridModal = true;
      // this.showAddBtnModal = true;
      this.rowData = row;
    },

    // 编辑
    handleEdit(index, row) {
      this.showModal = true;
      this.rowData = row;
    },

    // 删除操作
    handleDelete(index, row) {
      let self = this;
      this.$confirm("确定删除该条记录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self.tableLoading = true;
          this.https.post("/menu/delete?menuId=" + row.id).then(res => {
            if (res.data.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              self.initGrid();
            }
          });
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },

    // 弹窗后的回调
    addMenu(callbackValue) {
      this.showModal = callbackValue.showModal;
      this.rowData = {};
      if (callbackValue.isReload) {
        this.initGrid();
      }
    },
    // addBtn(callbackValue) {
    //   this.showAddBtnModal = callbackValue.showModal;
    //   this.rowData = {};
    //   if (callbackValue.isReload) {
    //     this.initGrid();
    //   }
    // },
    addBtnGrid(callbackValue){
      this.showAddBtnGridModal = callbackValue.showModal;
      this.rowData = {};
      if (callbackValue.isReload) {
        this.initGrid();
      }
    },

    // 查询
    onSubmit() {
      this.initGrid();
    }
  }
};
</script>

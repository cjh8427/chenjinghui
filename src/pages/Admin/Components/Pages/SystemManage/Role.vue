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
              <el-input v-model="formInline.user" placeholder="请输入您要查询的角色名称"></el-input>
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
            <div class="fr">
              <el-form-item>
                <el-button type="danger" @click="multipleDelete" icon="el-icon-delete">批量删除</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!-- 报表表格 -->
        <div class="ex-table-container">
          <el-table
            :loading="tableLoading"
            :data="menuData"
            row-key="name"
            border
            height="100%"
            max-height="100%"
            header-row-class-name="ex-table-header"
          >
            <el-table-column type="selection" fixed width="40" align="center"></el-table-column>
            <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
            <el-table-column prop="description" label="详细描述" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
            <el-table-column prop="action" fixed="right" label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="info"
                  @click="handlePemission(scope.$index, scope.row)"
                  icon="el-icon-key"
                >功能权限</el-button>
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                >编辑</el-button>
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
          layout="total, prev, pager, next, jumper"
          :page-size="pageSize"
          :current-page="pageIndex"
          :total="totalData"
          class="ex-pagination"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>

    <!-- 新增弹框 -->
    <AddRole :showModal="showModal" v-on:addRole="addRole" :rowData="rowData" />
  </div>
</template>
<script>
import AddRole from "../../Dialog/AddRole";

export default {
  name: "role",
  components: {
    AddRole
  },
  data() {
    return {
      menuName: this.$route.meta.title,
      hideMenu: true,
      activeIndex: this.$route.path,
      menuData: [
       
      ],
      leftMenu: [
        {
          id: "1",
          name: "角色管理",
          url: "/Role",
          iconClass: "ex-icon-group"
        },
        {
          id: "1",
          name: "角色权限管理",
          url: "/RolePermission",
          iconClass: "ex-icon-people"
        },
        {
          id: "1",
          name: "用户管理",
          url: "/User",
          iconClass: "ex-icon-mine"
        },
        {
          id: "1",
          name: "车辆管理",
          url: "/Vehicle",
          iconClass: "ex-icon-truck"
        },
        {
          id: "1",
          name: "企业管理",
          url: "/Enterprise",
          iconClass: "ex-icon-homepage"
        },
        {
          id: "1",
          name: "报警规则管理",
          url: "/AlarmRule",
          iconClass: "ex-icon-clock"
        }
      ],
      showModal: false,
      formInline: {
        user: "",
        region: ""
      },
      rowData: {},
      tableLoading: false,
      totalPage: 10,
      totalData:0,
      pageSize:15,
      pageIndex:1
    };
  },

  mounted() {
    let self = this;
    self.$nextTick(() => {
      self.initGridHeight();
      self.handleCurrentChange(self.pageIndex);
    });
  },

  methods: {
    // 初始化表格高度
    initGridHeight() {
      let pHeight = document.getElementsByClassName("ex-pages-table-content")[0]
        .offsetHeight;
      let qHeight = document.getElementsByClassName("ex-table-query")[0]
        .offsetHeight;
      document.getElementsByClassName("ex-table-container")[0].style.height =
        pHeight - qHeight - 117 + "px";
    },

    //分页
    handleCurrentChange(val){
      let self = this;
      this.pageIndex = val;
      self.tableLoading = true;
      this.https.post('/role/searchList',{
        number:this.pageIndex,
        roleName:this.formInline.user,
        size:this.pageSize
      }).then(res=>{
         console.log(res);
        if(res.data.code == 0){
          self.menuData = res.data.result.content
          self.totalData = res.data.result.totalElements
        }
        self.tableLoading = false;
      }).catch(err=>{
        console.log(err);
        self.tableLoading = false;
      })
    },

    // initTableData(){
     
    // },
    // 添加
    handleAdd() {
      this.showModal = true;
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
          this.https.get("/role/delete", { roleId: row.id }).then(res=>{
            console.log(res);
              if(res.code==0){
                self.handleCurrentChange(this.pageIndex);
                this.$message({
                type: "success",
                message: "删除成功!"
              });
            }else{
              this.$message({
                type: "warning",
                message: "删除失败!"
              });
            }
          }).catch(err=>{
            console.log(err);
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 左侧菜单选择
    handleSelect(key, keyPath) {
      console.log(key);
      this.$router.push({ path: key });
    },

    // 弹窗后的回调
    addRole(close) {
     
      this.showModal = close.showModal;
      this.rowData = {};
      if(close.isReload){
        this.handleCurrentChange(this.pageIndex);
      }
    },

    //功能权限
    handlePemission(){

    },
    // 查询
    onSubmit() {
      this.handleCurrentChange(this.pageIndex);
    },

    // 批量删除
    multipleDelete() {},

    // 隐藏/显示 左侧菜单
    handleMenu() {
      this.hideMenu = !this.hideMenu;
    }
  }
};
</script>

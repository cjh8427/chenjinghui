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
          <el-form :inline="true" :model="formInline" size="mini">
            <el-form-item label="选择车辆:">
              <el-input v-model="formInline.user" placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-truck"></el-button>
              </el-input>
            </el-form-item>

            <el-form-item label="绑定车辆:">
              <el-input v-model="formInline.user" placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-truck"></el-button>
              </el-input>
            </el-form-item>

            <el-form-item label="违规类型:">
              <el-select v-model="value" placeholder="请选择类型">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="创建时间:">
              <!-- <span class="demonstration">创建时间</span> -->
              <el-date-picker
                v-model="value1"
                size="mini"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>

            <!-- <el-form-item>
                                <el-button type="primary" @click="onSubmit">
                                    <i class="el-icon-search"/> 查询
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="success" @click="handleAdd">
                                    <i class="el-icon-plus"/> 新增
                                </el-button>
            </el-form-item>-->
            <div class="fr">
              <el-form-item>
                <el-button
                  style="background:#476de3;color:#fff;border-color:#476de3"
                  type
                  @click="multipleSearch"
                >查询</el-button>
                <el-button type="primary" @click="multipleReset">重置</el-button>
                <el-button type="success" @click="multipleAdd">新增</el-button>
                <el-button type="danger" @click="multipleDelete">删除</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <!-- 报表表格 -->
        <div class="ex-table-container">
          <el-table
            :data="menuData"
            row-key="name"
            border
            height="100%"
            max-height="100%"
            header-row-class-name="ex-table-header"
          >
            <el-table-column type="selection" fixed width="40" align="center"></el-table-column>
            <el-table-column type="index" fixed label="排序" :index="index"></el-table-column>
            <el-table-column prop="Account" fixed label="用户编号" align="center"></el-table-column>
            <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
            <!-- <el-table-column prop="RolesStr" label="角色名" align="center"></el-table-column> -->
            <el-table-column label="性别" align="center">
              <template slot-scope="scope" prop="Sex">
                <el-tag v-if="scope.row.Sex == 1">男</el-tag>
                <el-tag v-else type="danger">女</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="DepartmentName" label="薪水" align="center"></el-table-column>
            <el-table-column prop="Email" label="学历" align="center"></el-table-column>
            <el-table-column prop="Phone" label="创建时间" align="center"></el-table-column>
            <el-table-column
              prop="action"
              fixed="right"
              label="操作"
              align="center"
              width="350"
              style="box-shadow: 0 3px 3px rgba(0, 0, 0, .05);"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="info"
                  @click="handleDetail(scope.$index, scope.row)"
                  icon="el-icon-view"
                >查看详情</el-button>
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
          :hide-on-single-page="true"
          background
          layout="total, prev, pager, next, jumper"
          :total="20"
          class="ex-pagination"
        ></el-pagination>
      </div>
    </div>

    <!-- 新增弹框 -->
    <AddVehicle :showModal="showModal" v-on:addVehicle="addVehicle" :rowData="rowData"/>

    <!-- 查看详情 -->
    <SeeDetail :showModal="showDetail" v-on:seeDetail="seeDetail" />
  </div>
 
</template>
<script>
    import AddVehicle from "../../Dialog/AddVehicle";
    import SeeDetail from "../../Dialog/SeeDetail";
    export default {
        name: "role",
        components: {
            AddVehicle,
            SeeDetail,
        },
        data() {
            return {
                menuName: this.$route.meta.title,
                hideMenu: true,
                activeIndex: this.$route.path,
                showDetail:false,
                value1:'',
                options: [{
                    value: '1',
                    label: '闯红灯'
                    }, {
                    value: '2',
                    label: '无证驾驶'
                    }, {
                    value: '3',
                    label: '超载或超员'
                    }, {
                    value: '4',
                    label: '超速行驶'
                    }, {
                    value: '5',
                    label: '酒后驾驶'
                    }],
                value: '',
                index:1,
                menuData: [
                    {
                        id: 1,
                        Account:"鄂A12345",
                        RolesStr: "平台监控",
                        Sex: 1,
                        DepartmentName:"一致",
                        Email:"133",
                        Phone:"136",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 2,
                        Account:"鄂A12345",
                        RolesStr: "平台监控",
                        Sex: 0,
                        DepartmentName:"效率",
                        Email:"133",
                        Phone:"136",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 3,
                       Account:"鄂A12345",
                        RolesStr: "平台监控",
                        Sex: 0,
                        DepartmentName:"一致",
                        Email:"133",
                        Phone:"136",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 4,
                       Account:"鄂A12345",
                        RolesStr: "平台监控",
                        Sex: 1,
                        DepartmentName:"原则",
                        Email:"133",
                        Phone:"136",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 5,
                        Account:"鄂A12345",
                        RolesStr: "平台监控",
                        Sex: 1,
                        DepartmentName:"一致",
                        Email:"133",
                        Phone:"136",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 6,
                         Account:"鄂A12345",
                        RolesStr: "平台监控",
                        Sex: 0,
                        DepartmentName:"可行",
                        Email:"133",
                        Phone:"136",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 7,
                        Account:"鄂A12345",
                        RolesStr: "平台监控",
                        Sex: 1,
                        DepartmentName:"一致",
                        Email:"133",
                        Phone:"136",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    }
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
                totalPage: 10,  
            }
        },
        mounted() {
          let self = this;
          self.$nextTick(() => {
            // self.JSON2Arr(self.$store.state.platformAdminNav);
            self.initGridHeight();
          });
        },
        methods: {
          handleBlank(e) {
            console.log(e);
          },
          // 初始化表格高度
          // initGridHeight() {
          //   let pHeight = document.getElementsByClassName("ex-pages-table-content")[0]
          //       .offsetHeight;
          //   let qHeight = document.getElementsByClassName("ex-table-query")[0]
          //       .offsetHeight;
          //   document.getElementsByClassName("ex-table-container")[0].style.height =
          //       pHeight - qHeight - 132 + "px";
          // },
          handleAdd(index, row) {
            var self = this;
            self.showModal = true;
            self.modalName = "新增菜单";
          },
          //  initTree(){
          //             this.https.post('treeUrl',{}).then(res => {
          //                 console.log(res)
          //             })
          //         },

            // 渲染表格
          initGrid(){
              this.https.post('gridUrl',{}).then(res => {
                  console.log(res)
              })
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
          // handleAdd() {
          //     this.showModal = true;
          // },

          
          // 查看详情
          handleDetail(index, row) {
              this.showDetail = true;
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
                      this.https.post("", {delId: row.Id}, function (oData) {
                          this.$message({
                              type: "success",
                              message: "删除成功!"
                          });
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
          addVehicle(close) {
              this.showModal = close;
              this.rowData = {};
          },

          seeDetail(close){
              this.showDetail = close;
          },

          // 查询
          // onSubmit() {
          //     this.initGrid();
          // },


          // 左侧树点击事件
          handleTreeNodeClick(data) {
          },

          // 筛选树数据
          filterNode(value, data) {
              if (!value) return true;
              return data.label.indexOf(value) !== -1;
          },
          // 
          indexMethod(){},
          //查询
          multipleSearch(){},
          //重置
          multipleReset(){},
          //新增
          multipleAdd(){},
          // 批量删除
          multipleDelete() {}
        }
    }

</script>

<style scoped>
    .el-input,.el-select,.el-date-editor{
        width: 90% !important;
    }

    /* .el-input-group__append{
     background-color: #476de3 !important;
     color: #fff !important;
     border: 0 !important;
     }  */
</style>

<template>
    <div>
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
            <el-table-column type="index" label="排序" :index="index"></el-table-column>
            <el-table-column prop="Account" label="用户编号" align="center"></el-table-column>
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
        <!-- 分页 -->
         <el-pagination
          :hide-on-single-page="true"
          background
          layout="total, prev, pager, next, jumper"
          :total="20"
          class="ex-pagination"
        ></el-pagination>
    </div>

</template>
<script>
    export default {
        data() {
            return {
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
                
            }
        },
        mounted() {
         
        },
        methods: {
            // 渲染表格
          initGrid(){
              this.https.post('',{}).then(res => {
                  console.log(res)
              })
          },

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
        }
    }

</script>

<style scoped>
   
</style>

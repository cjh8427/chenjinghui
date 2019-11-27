<template>
    <div class="ex-pages-table-content has-tree">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="margin:15px;">
        <el-breadcrumb-item :to="{ path: '/' }">
          <i class="el-icon-s-home" /> 首页
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/Index' }">系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>{{menuName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="ex-content">
        <div class="ex-menu-table-side ex-tree">
            <h2>
                <i class="el-icon-s-operation" />
                报警规则
            </h2>
            <div class="ex-tree-search-input">
                <el-input placeholder="输入关键字进行过滤" size="small" v-model="filterText" style="width:85%"></el-input>
            </div>

            <el-tree
                    accordion
                    class="filter-tree"
                    highlight-current
                    show-checkbox
                    node-key="id"
                    :default-expanded-keys="[2]"
                    :data="treeData"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    @node-click="handleTreeNodeClick"
                    ref="tree"
                     style="background:#f6f7fa"
            ></el-tree>
        </div>
        <div class="ex-pages-table-content ex-pages-main">
      
          <div class="ex-table-content">
            <!-- 报表查询 -->
            <div class="ex-table-query">
              <el-form :inline="true" :model="queryData" size="mini">
                <el-form-item>
                  <strong>请选择查询条件：</strong>
                </el-form-item>
                <el-form-item label="菜单名称">
                  <el-input v-model="queryData.title" placeholder="请输入您要查询的菜单名称"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="QueryTitle">
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
                :data="currentTable"
                ref="tableDom"
                row-key="id"
                border
                default-expand-all
                lazy
                header-row-class-name="ex-table-header"
                height="100%"
                max-height="100%"
                :tree-props="{children: 'children'}"
              >
                <el-table-column type="selection" width="40" align="center"></el-table-column>
                <!-- <el-table-column prop="id" label="ID" width="80" sortable></el-table-column> -->
                <el-table-column prop="RuleName" label="规则名称" align="center"></el-table-column>
                <el-table-column prop="RuleType" label="规则属性" align="center"></el-table-column>
                <el-table-column prop="action" min-width="100" label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="info"
                      plain
                      @click="handleDetail(scope.$index,scope.row)"
                      icon="el-icon-view"
                    >详情</el-button>
                    <el-button
                      size="mini"
                      type="info"
                      @click="handleEdit(scope.$index, scope.row)"
                      icon="el-icon-edit"
                    >编辑</el-button>
                    <el-button
                      size="mini"
                      type="success"
                      @click="bindVehicle(scope.$index,scope.row)"
                      icon="el-icon-edit"
                    >绑定车辆</el-button>
                    <el-button
                      size="mini"
                      type="danger"
                      icon="el-icon-delete"
                      slot="reference"
                      @click="handleDelete(scope.$index, scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <el-pagination
              background
              layout="total, prev, pager, next, jumper"
              :page-size="tableSize"
              :total="tableTotal"
              @current-change="handlePage"
              class="ex-pagination"
            ></el-pagination>
          </div>
        </div>
      </div>
    <!-- 新增弹框 -->
    <AddAlarmRule :showModal="showModal" v-on:addAlarmRule="addAlarmRule" />

    <!-- 绑定车辆 -->
    <BindVehicle :showModal="showBindVehicleDialog" v-on:bindVehicleCallBack="bindVehicleCallBack"></BindVehicle>
    <!-- 查看详情 -->
    <SeeDetail :showModal="showDetail" v-on:seeDetail="seeDetail"/>
  </div>
</template>
<script>
import AddAlarmRule from "../../Dialog/AddAlarmRuleDialog";
import BindVehicle from "../../Dialog/BindVehicleDialog";
import SeeDetail from "../../Dialog/SeeDetail";
import SideMenu from "../../Public/SideMenu";
import { resolve, reject } from "q";

export default {
  name: "setupMenu",
  components: {
    BindVehicle,
    AddAlarmRule,
    SeeDetail,
    SideMenu
  },
  data() {
    return {
      menuName: this.$route.meta.title,
      hideMenu: true,
      activeIndex: this.$route.path,
      modalName: "",
      showModal: false,
      showBindVehicleDialog: false,
      showDetail:false,
      rowData: {},
      currentTable: [
        {
          RuleName: "禁入报警规则",
          RuleType: "禁入偏移值:100.0米"
        },
        {
          RuleName: "禁入规则-测试",
          RuleType: "禁入偏移值:100.0米"
        },
        {
          RuleName: "中心城区超速报警",
          RuleType: "超速阈值:60.0km/h"
        },
        {
          RuleName: "禁出规则报警",
          RuleType: "禁出偏移值:100.0米"
        }
      ],
      tablePages: 1,
      tableTotal: 0,
      tableSize: 20,
      tableData: [],
      queryData: {
        title: ""
      },
      editCfg: [
        {
          label: "title",
          name: "菜单名称",
          value: "",
          type: "input"
        },
        {
          label: "pid",
          name: "上级菜单",
          value: "",
          type: "select-tree"
        },
        {
          label: "iconClass",
          name: "菜单图标",
          value: "",
          type: "select-icon"
        },
        {
          label: "url",
          name: "菜单地址",
          value: "",
          type: "input",
          type: "input"
        },
        {
          label: "fav",
          name: "是否收藏",
          value: false,
          type: "switch"
        },
        {
          label: "iframe",
          name: "是否嵌套",
          value: false,
          type: "switch"
        },
        {
          label: "blank",
          name: "是否跳转",
          value: false,
          type: "switch"
        },
        {
          label: "sort",
          name: "排序",
          value: "0",
          type: "input"
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

      // 树的数据
      treeData: [
        {
          id: 1,
          label: "武汉市",
          children: [
              {
                  id: 2,
                  label: "汉阳区",
                  children: [
                      {
                          id: 5,
                          label: "琴台大剧院"
                      },
                      {
                          id: 6,
                          label: "古琴台"
                      }
                  ]
              },
              {
                  id: 3,
                  label: "江夏区",
                  children: [
                      {
                          id: 7,
                          label: "江夏广场"
                      },
                      {
                          id: 8,
                          label: "江夏大道"
                      }
                  ]
              },
              {
                  id: 4,
                  label: "洪山区",
                  children: [
                      {
                          id: 9,
                          label: "光谷步行街"
                      },
                      {
                          id: 10,
                          label: "银泰创意城"
                      }
                  ]
              }
          ]
        },
      ],
      filterText: "",
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  mounted() {
    let self = this;
    self.$nextTick(() => {
      self.initGridHeight();
      // self.JSON2Arr(self.$store.state.platformAdminNav);
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
    // 查询事件
    QueryTitle() {},

    // 新增 & 编辑事件
    handleAdd(index, row) {
      this.showModal = true;
      this.modalName = "新增菜单";
    },

    // 查看详情
    handleDetail(index, row) {
      this.showDetail = true;
    },

    // 绑定车辆
    bindVehicle(index, row) {
      this.showBindVehicleDialog = true;
    },

    // 删除弹窗
    handleDelete(index, row) {
      this.$confirm("确定删除该条记录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.https.post("", { delId: row.Id }, function(oData) {
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

    // 编辑弹窗
    handleEdit(index, row) {
      this.showModal = true;
    },

    addAlarmRule(close) {
      this.showModal = close;
    },

    bindVehicleCallBack(close) {
      this.showBindVehicleDialog = close;
    },
    seeDetail(close){
      this.showDetail = close;
    },
    handlePage(e) {
      let self = this;
      self.tablePages = e;
    },

    // 左侧树点击事件
    handleTreeNodeClick(data) {},

    // 筛选树数据
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // 左侧菜单选择
    handleSelect(key, keyPath) {
      console.log(key);
      this.$router.push({ path: key });
    },

    // 隐藏/显示 左侧菜单
    handleMenu() {
      this.hideMenu = !this.hideMenu;
    }
  },

  watch: {
    platformAdminNav(n) {
      console.log(n);
      this.JSON2Arr(n);
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    // platformAdminNav() {
    //   return this.$store.state.platformAdminNav;
    // }
  }
};
</script>
<style lang="less">
.ex-table-container {
  height: 80%;
}
</style>

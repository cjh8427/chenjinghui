<template>
  <div class="ex-dialog full-width" v-if="dialogTableVisible">
    <el-dialog
      v-loading="dialogLoading"
      element-loading-text="请稍候..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(136, 136, 136, 0.5)"
      title="功能权限配置"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="40%"
    >
      <div class="ex-dialog-container">
        <div class="ex-dialog-tabs-container">
          <div
            class="ex-tabs-item"
            :class="{'ex-active': item.index == currentIndex}"
            v-for="(item, index) in tabsList"
            :key="index"
            @click="switchTabs(item, index)"
          >
            {{item.label}}
            <span class="theme-point"></span>
          </div>
          <!-- <div class="ex-search-box">
            <el-input placeholder="请输入搜索内容" size="small" v-model="menuName">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>-->
        </div>

        <div class="tabs-content">
          <div class="content-title">
            <i class="el-icon-notebook-2"></i> &nbsp;菜单选择
          </div>
          <div class="content-second">
            <el-cascader-panel
              :props="props"
              :options="menuOptions"
              v-model="checkedMenuNodes"
              ref="menuCascader"
              @change="changeMenu"
            ></el-cascader-panel>
          </div>

          <div class="content-title">
            <i class="el-icon-finished"></i> &nbsp;已选菜单
          </div>
          <div class="content-second">
            <el-row :gutter="20">
              <el-col :xs="8" :sm="8" :md="6" :lg="6" v-for="(item, key) in sNodes" :key="key">
                <div class="ex-service-type-item" @click="handleClickItem(item)">
                  <i class="iconClass el-icon-circle-check"></i>
                  <span>{{item.label}}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSave">确定</el-button>
        <el-button size="small" @click="handleCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["showModal", "rowData"],
  data() {
    return {
      props: { multiple: true },
      menuOptions: [],
      currentIndex: 1,
      tabsList: [
        {
          label: "平台",
          index: 1,
          id: 1
        },
        {
          label: "政府APP",
          index: 2,
          id: 2
        },
        {
          label: "企业APP",
          index: 3,
          id: 3
        }
      ],
      menuName: null,
      dialogLoading: false,
      postValue: {},
      checkedNodes: [], // 已选择的下面的条目
      checkedMenuNodes: [[1, 3]] // 已选择的树的节点
    };
  },
  methods: {
    // 切换顶部tab
    switchTabs(item, index) {
      this.currentIndex = item.index;
    },

    //请求菜单表格数据
    initMenuOptions(oData) {
      let self = this;
      this.https.get("/menu/getMenuTree").then(res => {
        console.log(res);
        self.menuOptions = res.result;
      });
    },

    // 获取角色已经设置的菜单id
    getRoleMenuId(rowData) {
      this.checkedMenuNodes = [[1, 3]];
      // let ra = rowData.actionSet;
      // let list = [];
      // if (ra.length > 0) {
      //   for (let i in ra) {
      //     list.push(ra[i].id);
      //   }
      // }
      // this.checkedMenuNodes = [];
      // console.log(list)
    },

    // 勾选菜单的事件
    changeMenu(o, a) {
      let labels = this.$refs["menuCascader"].getCheckedNodes();
      if (labels.length > 0) {
        this.checkedNodes = [];
        for (let i in labels) {
          if (labels[i].pathLabels.length > 1) {
            let lps = labels[i].pathLabels;
            let content = lps.join(" - ");
            let item = {
              label: content,
              value: labels[i].path,
              isSelected: true
            };
            this.checkedNodes.push(item);
          }
        }
      }
    },

    // 已勾选的点击事件
    handleClickItem(item) {
      let sItem = JSON.stringify(item.value);
      if (this.checkedMenuNodes.length > 0) {
        for (let i in this.checkedMenuNodes) {
          let sNodes = JSON.stringify(this.checkedMenuNodes[i]);
          if (sItem == sNodes) {
            JSON.parse(JSON.stringify(this.checkedMenuNodes.splice(i, 1)));
          }
        }
      }
      item.isSelected = !item.isSelected;
      this.$refs["menuCascader"].clearCheckedNodes(item.value);
    },

    // 设置菜单按钮权限 保存回调
    handleSave() {
      let self = this;

      self.dialogLoading = true;
      let postUrl = "/role/add";
      if (this.menuForm.id) {
        postUrl = "/role/edit";
      }
      this.https
        .post(postUrl, { checkedMenuNodes: self.checkedMenuNodes })
        .then(res => {
          self.dialogLoading = false;
          if (res.data.code == 0) {
            self.$emit("addMenuPermission", { showModal: false, isReload: true });
          } else {
            this.$message.error("操作失败：" + res.data.message);
          }
        })
        .catch(err => {
          this.$message.error("操作失败：" + err.data.message);
          self.dialogLoading = false;
        });
    },

    // 弹窗取消
    handleCancel() {
      this.$emit("addMenuPermission", { showModal: false, isReload: false });
    }
  },
  watch: {
    showModal(v) {
      if (v) {
        this.initMenuOptions();
        this.getRoleMenuId(this.rowData);
      }
    }
    // rowData: {
    //   handler(newData, oldData) {
    //     if (newData) {
    //       this.getRoleMenuId(newData);
    //     } else {
    //       this.postValue = {};
    //       this.checkedNodes = [];
    //       this.checkedMenuNodes = [];
    //     }
    //   },
    //   immediate: true
    // }
  },
  computed: {
    dialogTableVisible: {
      get() {
        return this.showModal;
      },
      set(val) {
        return this.showModal;
      }
    },
    sNodes: function() {
      return this.checkedNodes.filter(function(node) {
        return node.isSelected;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.ex-dialog-container {
  height: 550px;
  overflow: hidden auto;
}
.ex-checkbox-group {
  max-width: 300px;
  height: auto;
  .el-checkbox__label {
    color: #fff;
  }
}
</style>
<style lang="less">
.full-width .el-dialog__body {
  padding: 0 !important;
}
.ex-dialog-tabs-container {
  width: 100%;
  position: relative;
  background-color: #f6f7fa;
  border-top: 1px solid #bfbfbf;
  float: left;
  .ex-tabs-item {
    float: left;
    cursor: pointer;
    font-size: 14px;
    color: #333;
    background-color: #fff;
    line-height: 1;
    text-align: left;
    width: 16%;
    line-height: 2;
    margin: 10px 0 10px 20px;
    padding: 0 5px;
    border-radius: 6px;
  }
  .ex-tabs-item.ex-active {
    border: 1px solid #476de3;
    .theme-point {
      width: 7px;
      height: 7px;
      background: #476de3;
      color: #476de3;
      border-radius: 50%;
      float: left;
      position: relative;
      left: 80%;
      top: 10px;
    }
  }
}
.ex-search-box {
  float: right;
  width: 30%;
  line-height: 2;
  margin: 10px 10px 0 0;
  font-size: 14px;
}

.ex-service-type-item {
  cursor: pointer;
  background: #476de3;
  height: 30px;
  line-height: 2;
  padding: 0 20px;
  margin: 10px;
  border-radius: 5px;
  white-space: nowrap;
  span {
    line-height: 1;
    vertical-align: middle;
    // font-size: 0.6rem;
    color: #fff;
    position: relative;
    left: -25px;
  }
  .iconClass {
    vertical-align: middle;
    position: relative;
    left: -28px;
    color: #476de3;
    font-size: 16px;
    background-color: #fff;
    border-radius: 50%;
    outline: inherit;
  }
}
.warnItem {
  display: inline-block;
  margin: 10px;
  text-align: center;
  line-height: 50px;
  color: #fff;
}

.tabs-content {
  width: 100%;
  float: left;
  .content-title,
  .content-second {
    width: 95%;
    display: block;
    margin: 10px auto;
  }
  .content-second {
    background: #f6f7fa;
  }
  .el-cascader-menu {
    min-width: 150px;
    max-width: 200px;
  }
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #476de3;
    border-color: #476de3;
  }
  .el-cascader-node.is-active,
  .el-cascader-node.in-active-path {
    color: #476de3;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #476de3;
    border-color: #476de3;
  }
  .el-checkbox__input.is-focus .el-checkbox__inner,
  .el-checkbox__inner:hover {
    border-color: #476de3;
  }
}
</style>

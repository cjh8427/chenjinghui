<template>
  <div class="ex-dialog" v-if="dialogTableVisible">
    <el-dialog
      v-loading="dialogLoading"
      element-loading-text="数据请求中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(136, 136, 136, 0.5)"
      title="菜单"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="40%"
    >
      <el-form ref="menuForm" :model="menuForm" :rules="ruleInline" label-width="110px">
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input v-model="menuForm.menuName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="菜单url：" prop="menuUrl">
          <el-input v-model="menuForm.menuUrl" size="small"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：" prop="pid">
          <el-cascader
            style="width: 100%"
            v-model="menuForm.pid"
            :options="menuOptions"
            :props="{ checkStrictly: true, value: 'id'}"
            size="small"
            @change="handleMenuChange"
            :getCheckedNodes="getCheckedNodes"
            clearable
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="排序：" prop="sortId">
          <el-input-number v-model="menuForm.sortId" :min="1" size="small" style="width: 100%"></el-input-number>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input v-model="menuForm.remark" size="small"></el-input>
        </el-form-item>
        <el-form-item label="是否有按钮：" prop="hasAction">
          <el-switch
            v-model="menuForm.hasAction"
            active-color="#409EFF"
            inactive-color="#e6e9f1"
            :width="60"
          ></el-switch>
        </el-form-item>
      </el-form>
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
      menuForm: {
        menuName: null,
        menuUrl: null,
        sortId: null,
        pid: 0,
        remark: null,
        hasAction: false,
        id: null
      },
      ruleInline: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" }
        ],
        menuUrl: [
          { required: true, message: "菜单路径不能为空", trigger: "blur" }
        ],
        sortId: [
          { required: true, message: "菜单排序不能为空", trigger: "blur" }
        ]
      },
      menuOptions: [],
      dialogLoading: false,
      postValue: {
        userId: 1
      }
    };
  },
  mounted() {},
  methods: {
    // 初始化联级菜单
    initMenuOptions() {
      let self = this;
      this.https.get("/menu/getMenuTree").then(res => {
        console.log(res);
        // self.menuOptions = self.utilFn.convertKey(res.result, ['text', 'label']);
        self.menuOptions = res.result;
      });
    },

    // 菜单选项发生改变时
    handleMenuChange(oData, aa) {
      console.log(oData);
      console.log(aa);
    },

    getCheckedNodes(aa, bb) {
      debugger;
    },

    handleCancel() {
      this.$refs["menuForm"].resetFields();
      this.$emit("addMenu", { showModal: false, isReload: false });
    },

    // 保存回调
    handleSave() {
      let self = this;
      this.$refs["menuForm"].validate(valid => {
        if (valid) {
          self.dialogLoading = true;
          let postValue = this.postValue;
          for (const key in this.menuForm) {
            postValue[key] = this.menuForm[key];
          }
          if (postValue.pid != 0) {
            postValue.pid = postValue.pid[this.postValue.pid.length - 1];
          }

          let postUrl = "/menu/add";
          if (this.menuForm.id) {
            postUrl = "/menu/edit";
          }
          this.https
            .post(postUrl, this.postValue)
            .then(res => {
              self.dialogLoading = false;
              if (res.data.code == 0) {
                self.$emit("addMenu", { showModal: false, isReload: true });
              } else {
                this.$message.error("操作失败：" + res.data.message);
              }
            })
            .catch(err => {
              this.$message.error("操作失败：" + err.data.message);
              self.dialogLoading = false;
            });
        } else {
          return false;
        }
      });
    },

    // 清空参数
    clearData() {
      this.menuForm = {
        menuName: null,
        menuUrl: null,
        sortId: null,
        pid: 0,
        remark: null,
        hasAction: false,
        id: null
      };
      this.menuOptions = [];
    }
  },
  watch: {
    showModal(v) {
      if (!v) {
        this.clearData();
      }
      if (v) {
        this.initMenuOptions();
        // if(this.rowData){
        //     this.menuForm = this.rowData;
        // }
      }
    },
    rowData: {
      handler(newData, oldData) {
        if (newData.id) {
          this.menuForm = newData;
          this.menuForm.pid = parseInt(newData.pid);
        } else {
          this.clearData();
        }
      },
      immediate: true
    },
    menuForm: {
      handler(newData, oldData) {
        console.log(newData);
      },
      immediate: true
    }
  },
  computed: {
    dialogTableVisible: {
      get() {
        return this.showModal;
      },
      set(val) {
        return this.showModal;
      }
    }
  }
};
</script>
<style scoped>
.el-form {
  display: flex;
  justify-content: inherit;
  align-items: center;
  flex-wrap: wrap;
}
.el-form-item {
  width: 48%;
}
</style>
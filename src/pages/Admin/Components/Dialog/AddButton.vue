<template>
  <div class="ex-dialog" v-if="dialogTableVisible">
    <el-dialog
      v-loading="dialogLoading"
      element-loading-text="数据请求中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(136, 136, 136, 0.5)"
      title="按钮"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="40%"
    >
      <el-form ref="btnForm" :model="btnForm" label-width="110px">
        <el-form-item label="按钮名称：">
          <el-input v-model="btnForm.actionName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="按钮url：">
          <el-input v-model="btnForm.actionUrl" size="small"></el-input>
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
  props: ["showModal", "rowDataInline", "menuId"],
  data() {
    return {
      btnForm: {
        actionName: null,
        actionUrl: null,
        id: null,
        userId: 1
      },
      dialogLoading: false,
      postValue: {
        userId: 1
      },
      menuIdInside: null
    };
  },
  mounted() {},
  methods: {
    handleCancel() {
      this.$refs["btnForm"].resetFields();
      this.$emit("addBtn", { showModal: false, isReload: false });
    },

    // 保存回调
    handleSave() {
      let self = this;
      self.dialogLoading = true;
      let postValue = this.postValue;
      for (const key in this.btnForm) {
        postValue[key] = this.btnForm[key];
      }
      postValue.userId = 1;
      for (let p in postValue) {
        if (postValue[p] == null) {
          delete postValue[p];
        }
      }
      postValue.menuId = this.menuIdInside;

      let postUrl = "/action/edit";
      if (!this.btnForm.id) {
        postUrl = "/action/add";
      }

      this.https
        .post(postUrl, this.postValue)
        .then(res => {
          self.dialogLoading = false;
          if (res.data.code == 0) {
            self.$emit("addBtn", { showModal: false, isReload: true });
          } else {
            this.$message.error("操作失败：" + res.data.message);
          }
        })
        .catch(err => {
          this.$message.error("操作失败：" + err.data.message);
          self.dialogLoading = false;
        });
    },

    // 清空参数
    clearData() {
      this.btnForm = {
        actionName: null,
        actionUrl: null,
        id: null,
        menuId: null,
        userId: 1
      };
    }
  },
  watch: {
    showModal(v) {
      if (!v) {
        this.clearData();
      }
    },
    rowDataInline: {
      handler(newData, oldData) {
        if(newData){
          this.btnForm = newData;
        }else{
          this.clearData();
        }
      },
      immediate: true
    },
    menuId: {
      handler(newData, oldData) {
        this.menuIdInside = newData;
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
</style>
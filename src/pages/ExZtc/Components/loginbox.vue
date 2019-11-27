<template>
  <el-dialog
    title="登录"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    append-to-body
    center
    :visible.sync="dialogFormVisible"
    width="350px"
  >
    <el-form :model="loginForm">
      <el-form-item label="账号:">
        <el-input
          v-model="loginForm.account"
          prefix-icon="el-icon-user"
          clearable
          placeholder="请输入账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码:">
        <el-input
          v-model="loginForm.pwd"
          prefix-icon="el-icon-lock"
          clearable
          type="password"
          placeholder="请输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item style="color:#f30">{{errorTips}}</el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button style="width:100%" type="success" @click="getToken" v-if="!loading">登 录</el-button>
      <el-button style="width:100%" type="success" :loading="true" v-if="loading">正在登录...</el-button>
    </div>
  </el-dialog>
</template>

<script>
import api from "../Configs/api";
export default {
  props: ["loginBox"],
  data() {
    return {
      dialogFormVisible: false,
      loginForm: {
        account: "",
        pwd: ""
      },
      errorTips: "",
      formLabelWidth: "120px",
      loading: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.dialogFormVisible = this.loginBox.show;
    });
  },
  methods: {
    //自动登录
    getToken() {
      const self = this;
      self.loading = true;
      self.errorTips = "";
      self.$http
        .get(api.host + api.GetLogin, {
          params: self.loginForm
        })
        .then(res => {
          // console.log(res);
          if (res.data.RetCode == 0) {
            self.$notify({
              message: "登录成功",
              type: "success",
              position: "bottom-right"
            });
            localStorage.$demoToken = res.data.Data;
            self.dialogFormVisible = false;
            self.$emit("loginOver", true);
          } else {
            self.errorTips = res.data.RetMsg;
          }
          self.loading = false;
        })
        .catch(error => {
          console.log(error);
          self.loading = false;
          self.errorTips = error;
          self.$notify.error({
            message: "登录失败," + error,
            position: "bottom-right"
          });
        });
    }
  },
  watch: {
    "loginBox.show"(n) {
      if (n) {
        this.dialogFormVisible = this.loginBox.show;
      }
    }
  }
};
</script>

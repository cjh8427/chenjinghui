<template>
  <div style="overflow: hidden">
    <el-row>
      <!--左侧轮播图-->
      <el-col :span="10">
        <carousel :carouselHeight="carouselHeight"></carousel>
      </el-col>

      <!--右侧 验证手机号 表单-->
      <el-col :span="14" v-if="isCheck">
        <div class="ex-login-form-container" v-bind:style="{ height: formHeight}">
          <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="ex-login-form">
            <el-form-item>
              <el-image :src="registerLogo" fit="contain"></el-image>
            </el-form-item>

            <el-form-item>
              <div class="ex-steps">
                <el-row>
                  <el-col :span="6">
                    <p class="ex-text-large ex-text-color-theme">01</p>
                    <p class="ex-text-mini ex-text-color-title">验证手机号</p>
                  </el-col>
                  <el-col :span="12">
                    <el-divider></el-divider>
                  </el-col>
                  <el-col :span="6">
                    <p class="ex-text-large ex-text-color-subtext">02</p>
                    <p class="ex-text-mini ex-text-color-subtext">重置密码</p>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>

            <el-form-item prop="phone">
              <el-input
                size="small"
                placeholder="请输入注册的手机号"
                prefix-icon="el-icon-mobile-phone"
                v-model="loginForm.phone"
              ></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input
                size="small"
                placeholder="请输入验证码"
                v-model="loginForm.code"
                prefix-icon="el-icon-chat-line-square"
              >
                <el-button slot="append" v-if="disabledBtn==false" @click="sendcode">获取验证码</el-button>
                <el-button
                  slot="append"
                  :disabled="disabledBtn"
                  v-if="disabledBtn==true"
                >{{countdownText}}</el-button>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="submitForm('loginForm')" style="width: 100%">找回密码</el-button>
            </el-form-item>
            <el-form-item class="go-to-regiter">
              <span @click="goToLogin">返回登录</span>
            </el-form-item>
          </el-form>
        </div>
      </el-col>

      <!--右侧 重置密码 表单-->
      <el-col :span="14" v-if="!isCheck">
        <div class="ex-login-form-container" v-bind:style="{ height: formHeight}">
          <el-form :model="loginForm" :rules="loginRules" ref="loginForm2" class="ex-login-form">
            <el-form-item>
              <el-image :src="registerLogo" fit="contain"></el-image>
            </el-form-item>

            <el-form-item>
              <div class="ex-steps">
                <el-row>
                  <el-col :span="6">
                    <p class="ex-text-large ex-text-color-theme">01</p>
                    <p class="ex-text-mini ex-text-color-title">验证手机号</p>
                  </el-col>
                  <el-col :span="12">
                    <el-divider></el-divider>
                  </el-col>
                  <el-col :span="6">
                    <p class="ex-text-large ex-text-color-theme">02</p>
                    <p class="ex-text-mini ex-text-color-title">重置密码</p>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                size="small"
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                v-model="loginForm.password"
              ></el-input>
            </el-form-item>
            <el-form-item prop="cPassword">
              <el-input
                size="small"
                placeholder="请确认密码"
                prefix-icon="el-icon-lock"
                v-model="loginForm.cPassword"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="submitForm('loginForm2')" style="width: 100%">提交</el-button>
            </el-form-item>
            <el-form-item class="go-to-regiter">
              <el-row>
                <el-col :span="12" style="text-align: left">
                  <span @click="goToLogin">上一步</span>
                </el-col>
                <el-col :span="12" style="text-align: right">
                  <span @click="goToLogin">返回登录</span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import carousel from "./Component/Carousel";
export default {
  name: "login-enterprise",
  components: { carousel },
  data() {
    return {
      isCheck: false,
      loginForm: {
        phone: "",
        code: "",
        password: "",
        cPassword: ""
      },
      loginRules: {
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        cPassword: [
          {
            required: true,
            message: "确认密码",
            trigger: "blur"
          },
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.loginForm.password) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      disabled: false,
      countdownText: "重新发送",
      disabledBtn: false,
      countdown: 0,
      carouselHeight: "",
      formHeight: "",
      registerLogo: require("../common/stastic/img/ex_default/register_logo.png")
    };
  },
  mounted() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 改变轮播高度
    getHeight() {
      this.carouselHeight = window.innerHeight - 30 + "px";
      this.formHeight = window.innerHeight + "px";
    },

    //手机验证发送验证码
    sendcode() {
      const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.loginForm.phone == "") {
        this.$message({
          message: "手机号不能为空",
          center: true
        });
        return;
      }
      if (!reg.test(this.loginForm.phone)) {
        this.$message({
          message: "请输入正确的手机号",
          center: true
        });
        return;
      } else {
        this.$message({
          message: "发送成功",
          type: "success",
          center: true
        });
        this.countdown = 60;
        this.disabledBtn = true;
        this.timer();
      }
    },
    //60S倒计时
    timer() {
      if (this.countdown > 0) {
        this.countdown--;
        this.countdownText = this.countdown + "s后重新获取";
        setTimeout(this.timer, 1000);
      } else {
        this.countdown = 0;
        this.countdownText = "获取验证码";
        this.disabledBtn = false;
      }
    },
    // 登录
    goToLogin: function() {
      this.$router.push({ path: "/login/Enterprise" });
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>
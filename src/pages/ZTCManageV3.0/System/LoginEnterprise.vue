<template>
  <div style="overflow: hidden">
    <el-row>
      <!--左侧轮播图-->
      <el-col :span="10">
        <carousel :carouselHeight="carouselHeight"></carousel>
      </el-col>

      <!--右侧 登录 表单-->
      <el-col :span="14">
        <div class="ex-login-form-container" v-bind:style="{ height: formHeight}">
          <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="ex-login-form">
            <el-form-item>
              <el-image :src="registerLogo" fit="contain"></el-image>
            </el-form-item>
            <el-form-item prop="userName">
              <el-input
                placeholder="请输入用户名/已验证手机"
                prefix-icon="el-icon-user-solid"
                v-model="loginForm.userName"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input placeholder="请输入密码" prefix-icon="el-icon-lock" v-model="loginForm.password"></el-input>
            </el-form-item>
            <el-form-item class="forget-password">
              <el-link type="info" class="fr" :underline="false" @click="resetPasswordFunc">忘记密码</el-link>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="submitForm('loginForm')" style="width: 100%">登录</el-button>
            </el-form-item>
            <el-form-item class="go-to-regiter">
              <span @click="registerFunc">还没有账号，立即注册</span>
              <!--<el-link type="info" :underline="false" href="https://element.eleme.io"></el-link>-->
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
      loginForm: {
        userName: "",
        password: ""
      },
      loginRules: {
        userName: [
          {
            required: true,
            message: "请输入用户名/已验证手机",
            trigger: "blur"
          },
          { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      carouselImgList: [
        {
          imgUrl: require("../common/stastic/img/slider_img/slider_1.png"),
          text: "运输轨迹 调剂消纳 工地热力图 执法监督",
          title: "“互联网+北斗”城市渣土"
        },
        {
          imgUrl: require("../common/stastic/img/slider_img/slider_2.png"),
          text: "位置监控 指挥调度 异常报警 考核分析",
          title: "“互联网+北斗”智慧环卫"
        },
        // {imgUrl: require('../common/stastic/img/slider_img/slider_3.png'), text:'', title: ''},
        {
          imgUrl: require("../common/stastic/img/slider_img/slider_4.png"),
          text: "国标平台 远程教学 模拟考试 计时实操",
          title: "“互联网+北斗”驾培驾考"
        }
      ],
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
    // 注册
    registerFunc: function() {
      this.$router.push({ path: "/register/Enterprise" });
    },
    // 重置密码
    resetPasswordFunc() {
      this.$router.push({ path: "/login/ResetPassword" });
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>
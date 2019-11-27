<template>
  <div class="wrapper">
    <div class="ex-layout-content" v-bind:style="{ height: formHeight}">
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerForm"
        class="ex-user-info-form"
        v-if="stepOne"
      >
        <el-form-item class="ex-form-title">
          <span class="ex-text-color-title ex-text-large">更换手机</span>
        </el-form-item>

        <el-form-item prop="phone">
          <el-input
            size="small"
            placeholder="原手机号"
            prefix-icon="el-icon-mobile-phone"
            v-model="registerForm.phone"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input
            size="small"
            placeholder="验证码"
            v-model="registerForm.code"
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
          <el-button type="info" @click="stepOne=false" style="width: 100%">下一步</el-button>
        </el-form-item>
      </el-form>
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerFormTwo"
        class="ex-user-info-form"
        v-if="!stepOne"
      >
        <el-form-item class="ex-form-title">
          <span class="ex-text-color-title">更换手机</span>
        </el-form-item>

        <el-form-item prop="newPhone">
          <el-input
            size="small"
            placeholder="新手机号"
            prefix-icon="el-icon-mobile-phone"
            v-model="registerForm.newPhone"
          ></el-input>
        </el-form-item>
        <el-form-item prop="newCode">
          <el-input
            size="small"
            placeholder="验证码"
            v-model="registerForm.newCode"
            prefix-icon="el-icon-chat-line-square"
          >
            <el-button slot="append" v-if="disabledBtnNew==false" @click="sendcodeNew">获取验证码</el-button>
            <el-button
              slot="append"
              :disabled="disabledBtnNew"
              v-if="disabledBtnNew==true"
            >{{countdownTextNew}}</el-button>
          </el-input>
        </el-form-item>

        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-button type="info" @click="stepOne=true" style="width: 100%">上一步</el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="info" @click="submitForm('registerFormTwo')" style="width: 100%">注册</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "user-info-phone",
  data() {
    return {
      stepOne: true,
      registerForm: {
        phone: "",
        code: "",
        newPhone: "",
        newCode: "",
        password: "",
        cPassword: ""
      },
      registerRules: {
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        newPhone: [
          { required: true, message: "请输入新手机号", trigger: "blur" }
        ],
        newCode: [{ required: true, message: "请输入验证码", trigger: "blur" }],
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
              } else if (value !== this.registerForm.password) {
                callback(new Error("两次输入密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      },
      carouselHeight: "",
      formHeight: "",
      countdownText: "重新发送",
      disabledBtn: false,
      countdown: 0,
      countdownTextNew: "重新发送",
      disabledBtnNew: false,
      countdownNew: 0
    };
  },
  mounted() {
    window.addEventListener("resize", this.getHeight);
    this.getHeight();
  },
  methods: {
    getHeight() {
      this.formHeight = window.innerHeight - 111 + "px";
    },

    //手机验证发送验证码
    sendcode() {
      const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.registerForm.phone == "") {
        this.$message({
          message: "手机号不能为空",
          center: true
        });
        return;
      }
      if (!reg.test(this.registerForm.phone)) {
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

    // TODO 步骤二里的验证码
    //手机验证发送验证码
    sendcodeNew() {
      const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.registerForm.newPhone == "") {
        this.$message({
          message: "手机号不能为空",
          center: true
        });
        return;
      }
      if (!reg.test(this.registerForm.newPhone)) {
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
        this.countdownNew = 60;
        this.disabledBtnNew = true;
        this.timerNew();
      }
    },
    //60S倒计时
    timerNew() {
      if (this.countdownNew > 0) {
        this.countdownNew--;
        this.countdownTextNew = this.countdownNew + "s后重新获取";
        setTimeout(this.timerNew, 1000);
      } else {
        this.countdownNew = 0;
        this.countdownTextNew = "获取验证码";
        this.disabledBtnNew = false;
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            type: "info",
            message: `提交成功!`
          });
          this.$refs[formName].resetFields();
        }
      });
    }
  },
  watch: {
    // "$router":{
    //     handler(route){
    //         let _this = this
    //         debugger
    //         if(route.path==='/system/UserInfo'){
    //             _this.$router.push({path: '/system/UserInfo/myInfo'});
    //         }
    //     }
    // }
    $route: {
      handler: function(val, oldVal) {
        debugger;
        console.log(val);
      },
      // 深度观察监听
      deep: true
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.slider {
  width: 200px;
  height: 100%;
  color: #151515;
  background-color: #e9edf3;
}

.main {
  width: calc(100% - 210px);
  height: 100%;
  background-color: #fff;
  margin-left: 10px;
  border-radius: 6px;
  border: 1px solid #fff;
}

.el-menu-item.is-active {
  color: #4a71d4;
  background-color: #fff;
  border-left: 2px solid #3c6dfe;
}
</style>
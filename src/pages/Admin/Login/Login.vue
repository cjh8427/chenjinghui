<template>
  <!-- 登录页面 -->
  <div class="layout-login">
    <!-- <div class="layout-btn-screen">
      <el-tooltip content="退出全屏模式" placement="left" :delay="1000">
        <el-button type="text" :circle="true" size="small" @click="handleScreen(false)" v-show="screen">
          <i class="el-icon-full-screen"></i>
        </el-button>
      </el-tooltip>
      <el-tooltip content="进入全屏模式" placement="left" :delay="1000">
        <el-button type="text" size="small" :circle="true" @click="handleScreen(true)" v-show="!screen">
          <i class="el-icon-cpu"></i>
        </el-button>
      </el-tooltip>
    </div> -->
    <div class="layout-login-box">
      <el-row>
        <el-col :span="24">
          <h1>{{platformName}}</h1>
          <!--<img src="/assets/img/site_slogon.png">-->
          <el-form
            ref="loginValue"
            size="large"
            :model="loginValue"
            :rules="ruleInline"
            class="layout-login-input-group"
            action="javascript:;"
            @submit.prevent="handleSubmit('loginValue')"
          >
            <el-avatar icon="el-icon-user-solid" class="layout-login-avatar"></el-avatar>
            <div style="margin-top: 48px;">
              <el-form-item prop="Account">
                <el-input type="text" v-model="loginValue.Account" placeholder="用户名支持账号、Email、手机号">
                  <el-button slot="prepend" icon="el-icon-user"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item prop="Password">
                <el-input
                  type="password"
                  size="large"
                  v-model="loginValue.Password"
                  placeholder="请输入密码"
                >
                  <el-button slot="prepend" icon="el-icon-lock"></el-button>
                </el-input>
              </el-form-item>
              <div class="ivu-form-item-error-tip text-center">{{errorTip}}</div>
            </div>

            <el-form-item>
              <el-button
                style="width: 100%"
                type="primary"
                :loading="loading"
                native-type="submit"
                size="medium"
                long
                @click="handleSubmit('loginValue')"
              >登 录</el-button>
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item>
                  <strong>记住账号:</strong>
                  <el-switch v-model="loginValue.Switch[0]">
                  </el-switch>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item style="text-align: right;">
                  <strong>2周内自动登录:</strong>
                  <el-switch v-model="loginValue.Switch[1]">
                  </el-switch>
                </el-form-item>
              </el-col>
            </el-row>
            <div style="text-align:center">(请不要在公共电脑记住登录信息)</div>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div class="layout-login-bg login-bg-05" ref="loginBg"></div>
    <div class="layout-copyrights">
      <p>技术支持：武汉依迅北斗空间技术有限公司 &nbsp;&nbsp;&nbsp;&nbsp; 服务热线：87773501</p>
      <p>Copyright©2015-2020 增值电信业务许可证号：B2-20150538 备案号:鄂ICP备10014997号-1</p>
    </div>
  </div>
</template>
<script>
const Base64 = require("../Configs/CommonFunction.js").Base64;
const GetLogin = require("../Configs/api.js").GetLogin;
const GetMenuUrl = require("../Configs/api.js").GetMenuUrl;
const GetPlatUrl = require("../Configs/api.js").GetPlatUrl;
const loginUrl = require("../Configs/api.js").loginUrl;

var idBg;
export default {
  data() {
    return {
      platformName: null,
      platformId: null,
      screen: false,
      ruleInline: {
        Account: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            type: "string",
            min: 4,
            message: "用户名长度不能小于4位",
            trigger: "blur"
          }
        ],
        Password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码长度不能小于6位",
            trigger: "blur"
          }
        ]
      },
      loading: false,
      errorTip: null,
      loginValue: {
        Account: null,
        Password: null,
        Switch: [true, true]
      }
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.handleBackground();
      this.initHeight();
    });
  },
  created() {
    if (!sessionStorage.$screen) {
      sessionStorage.$winheight = window.screen.height;
    }
  },
  beforeMount() {
    let self = this;
    let Host = location.host;
    // self.https
    //   .get(GetPlatUrl, { params: { host: "localhost" } })
    //   .then(function(res) {
    //     if (res.data.code == 1) {
    //       console.log(res.data.detail);
    //       self.platformName = res.data.detail.PlatName;
    //       self.platformId = res.data.detail.PlatId;
    //       self.platformTheme = res.data.detail.PlatTheme;
    //       localStorage.setItem(
    //         "$platformState",
    //         JSON.stringify({
    //           platformName: self.platformName,
    //           platformId: self.platformId,
    //           platformTheme: self.platformTheme
    //         })
    //       );
    //     }
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //     self.$notify({
    //       title: types.SEARVICE_ERROR_TITLE,
    //       desc: types.SEARVICE_ERROR,
    //       duration: 10
    //     });
    //   });
  },
  computed: {
    // loginValue: function() {
    //   var self = this;
    //   var UserStatus = localStorage.$userstatus
    //     ? JSON.parse(self.$store.state.user)
    //     : {};
    //   var UserSetting = localStorage.$usersetting
    //     ? JSON.parse(self.$store.state.setting)
    //     : {
    //         RemberName: true,
    //         AutoLogin: true
    //       };
    //   var loginData = {
    //     Account: UserStatus.Account,
    //     Password: UserStatus.Password,
    //     Switch: [UserSetting.RemberName, UserSetting.AutoLogin]
    //   };
    //   return loginData;
    // }
  },
  methods: {
    handleScreen(e) {
      var docElm = document.documentElement;
      if (e) {
        //W3C
        if (docElm.requestFullscreen) {
          docElm.requestFullscreen();
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
          docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
          docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (docElm.msRequestFullscreen) {
          docElm.msRequestFullscreen();
        }
        this.screen = true;
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        this.screen = false;
      }
      this.$store.commit(types.SCREEN, this.screen);
    },
    handleSubmit(name) {
      var self = this;
      self.$refs[name].validate(function(valid) {
        console.log(valid);
        if (valid) {
          self.handleLogin();
        }
      });
    },
    handleLogin(){
      var self = this;
      self.loading = true;
      self.https.post('/login/login',{
        account:self.loginValue.Account,
        password:self.loginValue.Password
      }).then(res=>{
        console.log(res);
        self.loading = false;
        if(res.data.code==0){
          let loginData = res.data.result;
          self.$router.push({ path:'/index'});
        }else{
          self.$message({
            type: "error",
            message: res.data.message
          })
        }
      }).catch(err=>{
        console.log(err);
      })
    },
    handleLoginOld() {
      //登录时对接的Boss接口
      var self = this;
      var userSetting = {
        RemberName: self.loginValue.Switch[0],
        AutoLogin: self.loginValue.Switch[1]
      };
      self.loading = true;
      //密码BAS464加密后反转
      let tempPass =
        Base64.encode(self.loginValue.Password) +
        Base64.encode(self.loginValue.Password)
          .split("")
          .reverse()
          .join("");
      console.log(tempPass);
      self.https.post(GetLogin, {
          account: self.loginValue.Account,
          password: tempPass
        })
        .then(function(response) {
          console.log(response);

          self.loading = false;

          if (response.data.code == 1) {
            let ReturnData = response.data.detail;
            var loginToken = {
              access_token: ReturnData.userGuid,
              login_date: new Date().getTime()
            };

            self.$store.commit(types.LOGIN, JSON.stringify(loginToken));
            self.$store.commit(types.USER, JSON.stringify(ReturnData));
            self.$store.commit(types.SETTING, JSON.stringify(userSetting));

            self.https
              .post(GetMenuUrl, {
                params: {
                  Account: ReturnData.account,
                  platformId: self.platformId
                }
              })
              .then(function(response) {
                if (response.data.code == 1) {
                  console.log(response);
                  let menuTemp = response.data.detail;
                  self.$store.commit(types.MENU, JSON.stringify(menuTemp));
                  clearInterval(Util.idtime);
                  self.$router.push("/");
                  self.$notify({ title: "登录成功" });
                } else {
                  self.loading = false;
                  self.$message(response.data.error);
                  self.errorTip = response.data.error;
                }
              })
              .catch(function(error) {
                console.log(error);
                self.loading = false;
                self.$notify({
                  title: types.SEARVICE_ERROR_TITLE,
                  desc: types.SEARVICE_ERROR,
                  duration: 10
                });
              });
          } else {
            self.loading = false;

            self.$message(response.data.error);
            self.errorTip = response.data.error;
          }
        })
        .catch(function(error) {
          console.log(error);
          self.loading = false;
          self.$notify({
            title: types.SEARVICE_ERROR_TITLE,
            desc: types.SEARVICE_ERROR,
            duration: 10
          });
        });
    },
    handleBackground() {
      var $loginBg = this.$refs.loginBg;
      idBg = setInterval(function() {
        var randomBg = Math.round(Math.random() * 4 + 1);
        $loginBg.className = "layout-login-bg login-bg-0" + randomBg;
      }, 60000);
    },
    initHeight(){
      var winHeight = window.screen.height - 143;
      document.getElementsByClassName('layout-login')[0].style.height = winHeight + 'px';
    }
  }
};
</script>

<style>
.layout {
  background: #f8f8f8;
  transition: opacity 0.3s;
  opacity: 1;
  height: 100%;
}

.layout-login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: inline-block;
  position: relative;
}

.layout-login .ivu-form-item {
  margin-top: 28px;
}

.layout-copyrights {
  width: 100%;
  color: #fff;
  opacity: 0.75;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 60px;
  z-index: 20;
  text-shadow: 0 2px 2px rgba(0, 0, 0, 0.65);
}

.layout-login-box {
  width: 750px;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -375px;
  margin-top: -300px;
  z-index: 100;
}

.layout-login-box h1 {
  font-size: 32px;
  white-space: nowrap;
  color: #fff;
  text-shadow: 0 5px 5px rgba(0, 0, 0, 0.45);
  margin-bottom: 50px;
  text-align: center;
}

.layout-login-input-group {
  position: relative;
  background-color: hsla(0, 0%, 100%, 0.95);
  width: 370px;
  height: 100%;
  padding: 12px;
  border-radius: 4px;
  box-shadow: inset 0 1px 0 hsla(0, 0%, 100%, 0.75), 0 0 2px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
}

.layout-login-input-group .ivu-switch-inner {
  font-size: 12px;
  line-height: 26px;
}

.layout-btn-screen {
  width: 47px;
  height: 42px;
  position: absolute;
  right: 0;
  top: 15px;
  z-index: 19;
  display: block;
}

.layout-btn-screen .ivu-btn-text {
  background-color: #fff;
  padding: 0;
}

.layout-btn-screen .ivu-icon {
  font-size: 24px;
}

.layout-login-bg {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background-color: #f8f8f8;
  background-color: -moz-radial-gradient(
    center,
    ellipse cover,
    #f8f8f8 0,
    #e1e8ea 100%
  );
  background-color: -webkit-radial-gradient(
    center,
    ellipse cover,
    #f8f8f8 0,
    #e1e8ea 100%
  );
  background-color: radial-gradient(
    ellipse at center,
    #f8f8f8 0,
    #e1e8ea 100%
  );
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
  width: 100%;
  height: 100%;
  -webkit-animation: puff-in-center 5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    infinite alternate-reverse both;
  animation: puff-in-center 5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite
    alternate-reverse both;
}

.login-bg-01 {
  background-image: url("../StaticResource/img/login_bg_06.jpg");
}

.login-bg-02 {
  background-image: url("../StaticResource/img/login_bg_06.jpg");
}

.login-bg-03 {
  background-image: url("../StaticResource/img/login_bg_06.jpg");
}

.login-bg-04 {
  background-image: url("../StaticResource/img/login_bg_06.jpg");
}

.login-bg-05 {
  background: url("../StaticResource/img/login_bg_06.jpg");
  background-size: cover;
  background-repeat: no-repeat;
}

.layout-login-avatar {
  position: absolute;
  top: -32px;
  left: 53%;
  margin-left: -32px;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.15);
  background-color: #f8f8f8;
  width: 64px;
  height: 64px;
  text-align: center;
  border-radius: 50%;

  font-size: 25px !important;
}

.layout-login-avatar > * {
  /* font-size: 32px !important;
  line-height: 32px !important; */
}

.puff-in-center {
  -webkit-animation: puff-in-center 0.7s cubic-bezier(0.47, 0, 0.745, 0.715)
    both;
  animation: puff-in-center 0.7s cubic-bezier(0.47, 0, 0.745, 0.715) both;
}

@-webkit-keyframes puff-in-center {
  0% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    -webkit-filter: blur(2px);
    filter: blur(2px);
    opacity: 0.6;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-filter: blur(0);
    filter: blur(0);
    opacity: 1;
  }
}

@keyframes puff-in-center {
  0% {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
    -webkit-filter: blur(2px);
    filter: blur(2px);
    opacity: 0.6;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-filter: blur(0);
    filter: blur(0);
    opacity: 1;
  }
}

.layout-login-box .ivu-form-item-error-tip {
  line-height: 2;
}
</style>
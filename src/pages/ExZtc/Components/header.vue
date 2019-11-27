<template>
  <div class="map-header">
    <div class="logo"></div>
    <div class="logo-text">建筑垃圾智慧监管平台 - {{cityRegion}}</div>
    <el-menu
      :default-active="menuIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="menuSelect"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="1">实时监控</el-menu-item>
      <el-menu-item index="2">监控报表</el-menu-item>
      <el-menu-item index="3" disabled>案件处理</el-menu-item>
      <el-menu-item index="4">后台管理</el-menu-item>
    </el-menu>

    <div class="map-search">
      <el-form :inline="true" size="mini" style="float:left; margin-right: 8px; margin-top: 8px;">
        <el-form-item>
          <el-dropdown @command="changeRegion" size="mini">
            <el-button icon="el-icon-map-location" size="mini">
              {{cityRegion}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="武汉市">武汉市</el-dropdown-item>
              <el-dropdown-item command="硚口区">硚口区</el-dropdown-item>
              <el-dropdown-item command="江汉区">江汉区</el-dropdown-item>
              <el-dropdown-item command="江岸区">江岸区</el-dropdown-item>
              <el-dropdown-item command="汉阳区">汉阳区</el-dropdown-item>
              <el-dropdown-item command="汉南区">汉南区</el-dropdown-item>
              <el-dropdown-item command="青山区">青山区</el-dropdown-item>
              <el-dropdown-item command="武昌区">武昌区</el-dropdown-item>
              <el-dropdown-item command="洪山区">洪山区</el-dropdown-item>
              <el-dropdown-item command="江夏区">江夏区</el-dropdown-item>
              <el-dropdown-item command="蔡甸区">蔡甸区</el-dropdown-item>
              <el-dropdown-item command="东西湖区">东西湖区</el-dropdown-item>
              <el-dropdown-item command="黄陂区">黄陂区</el-dropdown-item>
              <el-dropdown-item command="新洲区">新洲区</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
      </el-form>

      <el-autocomplete
        placeholder="请输入搜索地点"
        prefix-icon="el-icon-place"
        suffix-icon="el-icon-search"
        size="mini"
        v-model="searchPamas"
        :clearable="true"
        :fetch-suggestions="getSearchTip"
        :trigger-on-focus="true"
        @select="pantoPoi"
      >
        <template slot-scope="{ item }">
          <div class="name">{{ item.name }}</div>
        </template>
      </el-autocomplete>
      <div class="header-user">
        <i class="el-icon-user-solid" />
        {{userInfo.Name}}
        <el-tooltip content="退出" placement="bottom">
          <el-button icon="el-icon-switch-button" type="text" @click="logOut"></el-button>
        </el-tooltip>
      </div>
      <el-tooltip content="全屏按钮" placement="bottom">
        <el-button
          @click="changeScreen"
          size="small"
          icon="el-icon-full-screen"
          style="background: transparent;color: #fff;border: none;"
        />
      </el-tooltip>
    </div>
    <LoginBox :loginBox="loginBox" v-on:loginOver="getUserInfo" />
  </div>
</template>
<script>
import api from "../Configs/api";
import LoginBox from "../Components/loginbox.vue";

export default {
  components: { LoginBox },
  data() {
    return {
      cityRegion: "武汉市",
      menuIndex: "1",
      searchPamas: null,
      searchTips: null,
      loginBox: {
        show: true
      },
      userInfo: {}
    };
  },
  mounted() {
    const self = this;
    if (self.$store.state.token) {
      self.loginBox.show = false;
      self.getUserInfo();
    }
  },
  methods: {
    //菜单导航
    menuSelect(index) {
      const self = this;
      switch (index) {
        case "1":
          //   this.$router.replace("/index");
          break;
        case "2":
          this.$emit("openReports", true);
          break;
        case "4":
          window.open("http://ztc.comlbs.com", "_blank");
          break;
      }
    },
    //搜索POI
    getSearchTip(queryString, cb) {
      const self = this;
      var placeSearch = new AMap.PlaceSearch({
        city: "027"
      });
      placeSearch.search(self.searchPamas, function(status, result) {
        // 查询成功时，result即对应匹配的POI信息
        // console.log(result);
        cb(result.poiList.pois);
        self.searchTips = result.poiList.pois;
      });
    },
    //地图跳转
    pantoPoi(item) {
      const self = this;
      self.$emit("pantoPoi", item);
      self.searchPamas = item.name;
    },
    //切换图层
    changeRegion(v) {
      const self = this;
      self.cityRegion = v;
      if (v === "青山区") v = "420107";
      self.$emit("changeRegion", v);
    },
    //全屏按钮
    changeScreen() {
      var docElm = document.documentElement;
      if (!this.pageScreen) {
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
      }
      this.pageScreen = !this.pageScreen;
    },
    //获取用户信息
    getUserInfo() {
      const self = this;
      self.$http
        .get(api.host + api.GetUserInfo)
        .then(res => {
        //   console.log(res);
          if (res.data.RetCode == 0) {
            self.userInfo = res.data.Data;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //退出按钮
    logOut() {
      this.$confirm("此操作将注销本用户并退出系统, 是否继续?", "退出系统", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "退出成功!"
          });
          localStorage.clear();
          window.location.reload();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  }
};
</script>
<style lang="less">
.map-header {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  width: 100%;
  background-color: #2d469a;
  padding: 0 15px;
  line-height: 42px;
  color: #fff;
  padding: 0 40px 0 20px;
  box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
    0 6px 14px 2px rgba(0, 0, 0, 0.14), 0 6px 12px 5px rgba(0, 0, 0, 0.12);

  .logo {
    width: 30px;
    height: 32px;
    background: url(../../../stastic/img/ExZtc/cgw_logo.png) no-repeat;
    float: left;
    margin-right: 15px;
    margin-top: 5px;
  }
  .logo-text {
    float: left;
    margin-right: 20px;
  }

  .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
  .el-menu--horizontal > .el-menu-item:not(.is-disabled):focus {
    background: rgba(255, 255, 255, 0.15);
  }

  .el-menu--horizontal {
    border: none;
    background: none;
    .el-menu-item {
      height: 42px;
      line-height: 42px;
    }
  }

  .map-search {
    position: fixed;
    right: -5px;
    top: -2px;
    padding: 0 20px;
    z-index: 1010;
    .header-user {
      float: left;
      margin-right: 8px;
      font-size: 14px;
      line-height: 42px;
    }
    .el-autocomplete {
      float: left;
      margin-right: 15px;
      width: 249px;
    }
    .el-input__inner {
      box-shadow: 0 6px 12px 5px rgba(0, 0, 0, 0.12);
    }
  }
}
.el-autocomplete-suggestion {
  .name {
    font-size: 13px;
    font-weight: bold;
    float: left;
  }
  .addr {
    font-size: 12px;
    float: right;
  }
}
</style>
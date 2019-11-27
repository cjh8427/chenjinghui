<template>
  <div class="ex-header">
    <el-menu
      :default-active="activeIndex"
      class="ex-header-platform fl"
      mode="horizontal"
      @select="handleSelect"
    >
      <!-- logo -->
      <!-- <a href="./index.html" class="ex-header-logo">
        <div class="ex-header-logo-img"></div>
      </a> -->
      <a href="./admin.html" class="ex-header-logo">
        <h1 class="ex-header-logo-text">{{platformName}}</h1>
      </a>
      <!-- 菜单 -->
      <a href="./jzindex.html" target="_blank" class="ex-menu-link-to">大数据看板</a>


      <!-- <el-submenu index="/monitor">
        <template slot="title">平台监控</template>
        <el-menu-item index="/VehicleRegister/Index">车辆监控</el-menu-item>
      </el-submenu>
      <el-submenu index="/system">
        <template slot="title">系统设置</template>
        <el-menu-item index="/system/menu">菜单设置</el-menu-item>
      </el-submenu> -->

      <el-menu-item index="/monitor">平台监控</el-menu-item>
      <el-menu-item index="/system">系统设置</el-menu-item>
      
    </el-menu>
    <div class="ex-function">
      <div class="ex-message">
        <el-tooltip class="item" effect="dark" content="用户信息" placement="bottom" v-if="hadMessage">
          <!-- <el-badge is-dot>
            <i class="el-icon-bell"/>
          </el-badge> -->
          <i class="el-icon-user"/>
        </el-tooltip>
      </div>
      <div class="ex-message">
        <!-- <el-tooltip class="item" effect="dark"  placement="bottom" v-if="hadMessage"> -->
          <!-- <el-badge is-dot>
            <i class="el-icon-chat-dot-square"/>
          </el-badge> -->
          <span v-if="!isLogin">
            请登录
            <!-- <i class="el-icon-caret-bottom"/> -->
          </span>
          <!-- <span v-else>
            admin
            <i class="el-icon-caret-bottom"/>
          </span> -->
          <el-dropdown v-else>
            <span class="el-dropdown-link">
              admin<i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-lock">修改密码</el-dropdown-item>
              <el-dropdown-item icon="el-icon-switch-button">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
      </div>
      <div class="ex-message">
        <fullScreen/>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../../pages/JzIndex/Configs/store";
export default {
  name: "layout",
  data() {
    return {
      isLogin:true,
      hadMessage: true,
      activeIndex: "/system/menu"
    };
  },
  methods: {
    handleSelect(url) {
      this.$router.push({ path: url });
    }
  },
  computed: {
    platformName() {
      return (
        store.state.platformData.state.city +
        store.state.platformData.state.name
      );
    },
    adcode() {
      return store.state.platformData.state.adcode;
    },
    platformNav(){
      return store.state.platformNav

    }
  }
};
</script>

<style scoped>
 .el-menu--horizontal > .el-menu-item{
   height: 40px;
   line-height: 40px;
   color: #fff;
   font-weight: 600;
 }
.el-menu-item:hover{
  background-color: #476de3 !important;
  color: #fff !important;
}
 .el-menu--horizontal > .system-set{
   background: #476de3;
 }
 .ex-header-platform .el-menu-item.is-active{
    color: #fff !important;
    border-color:transparent !important;
    background: #476de3 !important;
 }
 .ex-message{
   font-size: 14px;
 }
 .ex-function .ex-screen{
   margin: 0;
 }
 .el-dropdown-link {
    cursor: pointer;
    color: #FFFFFF;
  }
</style>
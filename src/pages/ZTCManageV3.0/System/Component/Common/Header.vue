<template>
  <div class="ex-header">
    <el-menu
      :default-active="activeIndex"
      class="ex-header-platform fl"
      mode="horizontal"
      @select="handleSelect"
    >
      <!-- logo -->
      <a href="#" class="ex-header-logo">
        <div class="ex-header-logo-img"></div>
      </a>
      <a href="#" class="ex-header-logo">
        <h1 class="ex-header-logo-text">{{platformName}}</h1>
      </a>
      <!-- 菜单 -->
      <el-menu-item index="/system/DeviceManage">
        <a href="javascript:void(0)" class="ex-menu-link-to">设备</a>
      </el-menu-item>
      <el-menu-item index="/system/serviceList">
        <a href="javascript:void(0)" class="ex-menu-link-to">计算服务</a>
      </el-menu-item>
      <el-menu-item index="/system/UserCenter">
        <a href="javascript:void(0)" class="ex-menu-link-to">用户中心</a>
      </el-menu-item>

      <div class="ex-header-settings userInfo">
        <el-dropdown @command="handleUserSettings">
          <span class="el-dropdown-link">
            武汉依迅北斗
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="/system/UserInfo/myInfo">账号设置</el-dropdown-item>
            <el-dropdown-item command="/login/Enterprise">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="ex-header-settings" style="padding-top: 15px">
        <!--<img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" alt="">-->
        <el-avatar
          size="small"
          src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
          class="header-avatar"
        ></el-avatar>
      </div>
    </el-menu>

    <!--<el-menu @select="handleSelectUserCenter" v-if="showUserCenter">-->
    <!--&lt;!&ndash;用户中心二级菜单&ndash;&gt;-->
    <!--<el-menu-item index="1"><a href="javascript:void(0)" class="ex-menu-link-to">我的</a></el-menu-item>-->
    <!--<el-menu-item index="2"><a href="javascript:void(0)" class="ex-menu-link-to">购买平台</a></el-menu-item>-->
    <!--<el-menu-item index="3"><a href="javascript:void(0)" class="ex-menu-link-to">购买设备</a></el-menu-item>-->
    <!--</el-menu>-->
  </div>
</template>
<script>
export default {
  name: "sHeader",
  data() {
    return {
      hadMessage: true,
      activeIndex: "/system/menu",
      platformName: "依迅北斗用户中心",
      showUserCenter: false
    };
  },
  methods: {
    handleSelect(url) {
      if (url == 3) {
        this.showUserCenter = true;
      } else {
        this.showUserCenter = false;
        this.$router.push({ path: url });
      }
    },
    handleSelectUserCenter(url) {
      debugger;
    },
    handleUserSettings(url) {
      this.$router.push({ path: url });
    }
  },
  computed: {}
};
</script>
<style scoped>
</style>
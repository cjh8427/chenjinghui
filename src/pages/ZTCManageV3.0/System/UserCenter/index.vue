<template>
  <div class="wrapper">
    <div class="header">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="/system/UserCenter/mycenter" ref="myCenter">我的</el-menu-item>
        <el-menu-item index="/system/UserCenter/buyPlatform">购买平台</el-menu-item>
        <el-menu-item index="/system/UserCenter/buyDevice">购买设备</el-menu-item>
      </el-menu>
      <div class="line"></div>
    </div>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "UserCenter",
  data() {
    return {
      activeIndex: "/system/UserCenter/mycenter"
    };
  },

  watch: {
    $route: {
      handler(route) {
        let _this = this;
        if (route.path === "/system/UserCenter") {
          _this.$router.push({ path: "/system/UserCenter/mycenter" });
          _this.$refs.myCenter.$el.click();
        } else if (route.path === "/system/UserCenter/mycenter") {
          _this.$router.push({ path: "/system/UserCenter/mycenter/platform" });
        }
      }
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push({ path: key });
    }
  },
  mounted() {
    let _this = this;
    _this.$router.push({ path: _this.activeIndex });
  }
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 78px);
  overflow: hidden;
}

.header {
  height: 41px;
  background-color: #fff;
  color: #151515;
  padding-left: 100px;
}

.content {
  height: calc(100% - 30px);
  background-color: #f5f5fb;
  padding: 15px;
  display: flex;
}
</style>
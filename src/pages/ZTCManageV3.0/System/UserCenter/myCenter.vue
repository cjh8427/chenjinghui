<template>
  <div class="wrapper">
    <div class="slider">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        style="background-color: #E9EDF3;height: 100%"
        @select="handleSelect"
      >
        <el-menu-item index="/system/UserCenter/mycenter/platform" ref="myPlat">
          <i class="el-icon-user-solid"></i>
          <span slot="title">我的平台</span>
        </el-menu-item>
        <el-menu-item index="/system/UserCenter/mycenter/Device">
          <i class="el-icon-map-location"></i>
          <span slot="title">我的设备</span>
        </el-menu-item>
        <el-menu-item index="/system/UserCenter/mycenter/Order">
          <i class="el-icon-shopping-cart-2"></i>
          <span slot="title">我的订单</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "device-manage",
  data() {
    return {
      activeIndex: "/system/UserCenter/mycenter/platform"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push({ path: key });
    }
  },
  watch: {
    $route: {
      handler(route) {
        let _this = this;
        if (route.path === "/system/UserCenter/mycenter/platform") {
          _this.$refs.myPlat.$el.click();
        }
      }
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
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
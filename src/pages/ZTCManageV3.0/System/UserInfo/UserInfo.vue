<template>
  <div class="content">
    <div class="wrapper">
      <div class="slider">
        <el-menu
          :default-active="defaultUrl"
          class="el-menu-vertical-demo"
          style="background-color: #E9EDF3;height: 100%"
          @select="handleSelect"
        >
          <el-menu-item index="/system/UserInfo/myInfo">
            <!--<i class="el-icon-user-solid"></i>-->
            <span slot="title">基本信息</span>
          </el-menu-item>
          <el-menu-item index="/system/UserInfo/password">
            <!--<i class="el-icon-map-location"></i>-->
            <span slot="title">修改密码</span>
          </el-menu-item>
          <el-menu-item index="/system/UserInfo/phone">
            <!--<i class="el-icon-shopping-cart-2"></i>-->
            <span slot="title">更换手机</span>
          </el-menu-item>
          <el-menu-item index="/system/UserInfo/address">
            <!--<i class="el-icon-shopping-cart-2"></i>-->
            <span slot="title">收货地址</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="main">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "user-info",
  data() {
    return {
      defaultUrl: "/system/UserInfo/myInfo"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push({ path: key });
    }
  },
  watch: {
    // "$route":{
    //     handler(route){
    //         let _this = this
    //         if(route.path==='/system/UserInfo'){
    //             _this.$router.push({path: '/system/UserInfo/myInfo'});
    //         }
    //     }
    // }
    $route: {
      handler: function(val, oldVal) {
        if (val.path === "/system/UserInfo/phone") {
          this.defaultUrl = "/system/UserInfo/phone";
        }
      },
      // 深度观察监听
      deep: true
    }
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
.content {
  height: calc(100% - 30px);
  background-color: #f5f5fb;
  padding: 15px;
  display: flex;
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
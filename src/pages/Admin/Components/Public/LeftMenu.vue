<template>
  <div class="ex-pages">
    <!-- 侧边导航栏 -->
    <div class="ex-menu-side" :class="{'hide-menu' : hideMenu}">
      <h2>
        <i class="el-icon-set-up" />
        系统设置
        <el-tooltip
          class="hide-menu"
          effect="dark"
          content="缩进菜单"
          placement="right"
          v-if="!hideMenu"
        >
          <i class="el-icon-s-fold" @click="handleMenu" />
        </el-tooltip>
        <el-tooltip class="hide-menu" effect="dark" content="展开菜单" placement="right" v-else>
          <i class="el-icon-s-unfold" @click="handleMenu" />
        </el-tooltip>
      </h2>
      <el-menu @select="handleSelect" :default-active="activeIndex">
        <el-menu-item v-for="(item, index) in leftMenu" :key="index" :index="item.url">
          <el-tooltip effect="dark" :content="item.name" placement="right" v-show="hideMenu">
            <i class="hide-menu-icon" :class="item.iconClass" />
          </el-tooltip>
          <span v-show="!hideMenu">
            <i :class="item.iconClass" />
            {{item.name}}
          </span>
        </el-menu-item>
      </el-menu>
    </div>
    <router-view />
  </div>
</template>
<script>
// import { mapState, mapGetters } from "vuex";

export default {
  name: "SideMenu",
  data() {
    return {
      hideMenu: true,
      leftMenu: [
        {
          id: "1",
          name: "角色管理",
          url: "/Role",
          iconClass: "ex-icon-group"
        },
        {
          id: "1",
          name: "角色权限管理",
          url: "/RolePermission",
          iconClass: "ex-icon-people"
        },
        {
          id: "1",
          name: "用户管理",
          url: "/User",
          iconClass: "ex-icon-mine"
        },
        {
          id: "1",
          name: "车辆管理",
          url: "/Vehicle",
          iconClass: "ex-icon-truck"
        },
        {
          id: "1",
          name: "企业管理",
          url: "/Enterprise",
          iconClass: "ex-icon-homepage"
        },
        {
          id: "1",
          name: "报警规则管理",
          url: "/AlarmRule",
          iconClass: "ex-icon-clock"
        }
      ],
      activeIndex: ""
    };
  },
  mounted() {},
  methods: {
    handleMenu() {
      debugger
      this.hideMenu = !this.hideMenu;
      this.$emit("handleMenu", this.hideMenu);
    },
    handleSelect(key, keyPath) {
      this.$router.push({ path: key });
    }
  },
  computed: {
    // currentNavChildren() {
    //   return this.currentNav.children;
    // },
    // currentNav() {
    //   let self = this;
    //   let platformAdminNav = self.platformAdminNav;
    //   let currentNav = [];
    //   let currentPid = self.currentPid;
    //   for (var i in platformAdminNav) {
    //     if (platformAdminNav[i].id == currentPid) {
    //       currentNav = platformAdminNav[i];
    //     }
    //   }
    //   self.activeIndex = this.$route.path;
    //   return currentNav;
    // },
    // currentPid() {
    //   console.log(this.$route);
    //   return this.$route.meta.pid;
    // },
    // ...mapState({
    //   platformAdminNav: state => state.platData.platformAdminNav //后台管理菜单
    // })
  }
};
</script>
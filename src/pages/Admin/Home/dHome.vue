<template>
  <div>
    <pHeader />
    <!-- 这里是需要keepalive的 -->
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <!-- 这里不会被keepalive -->
    <router-view v-else></router-view>
    <pFooter />
  </div>
</template>
<script>
import store from "../../../pages/JzIndex/Configs/store";
export default {
  name: "dHome",
  mounted() {
    window.document.title =
      store.state.platformData.state.city + store.state.platformData.state.name;
  },
  methods: {
    toDB() {
      this.$router.push({ path: "/system/controlDB" });
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
    }
  }
};
</script>


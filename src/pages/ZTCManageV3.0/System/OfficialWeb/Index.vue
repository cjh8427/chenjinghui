<template>
  <div class="exWrapper">
    <div class="top-header">
      <div class="logo">
        <img src="../../common/stastic/img/official/logo_login.png" alt />
      </div>
      <ul class="nav-ul">
        <li>
          <router-link to="/OfficialWeb/NorthPlus">
            <a href="javascript:void(0)">北斗+车联网</a>
          </router-link>
        </li>
        <li>
          <router-link to="/OfficialWeb/ConnectCar">
            <a href="javascript:void(0)">车联网智能装备</a>
          </router-link>
        </li>
        <li class="sub-menu" @mouseenter="showSubNav(true)" @mouseleave="showSubNav(false)">
          <a href="#">关于依迅北斗</a>

          <ul class="sub-nav-ul" v-if="isShow">
            <li>
              <router-link to="/OfficialWeb/EnterpriseDetail">
                <a href="javascript:void(0)">公司简介</a>
              </router-link>
            </li>
            <li>
              <router-link to="/OfficialWeb/ContactUs">
                <a href="javascript:void(0)">联系我们</a>
              </router-link>
            </li>
            <li>
              <router-link to="/login/Enterprise">
                <a href="javascript:void(0)">登录</a>
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <router-view />
    <div class="bottom-footer">
      <ul class="bottom-ul">
        <li style="padding-top: 20px">
          <img src="../../common/stastic/img/official/bottom-logo.png" />
        </li>
        <li style="line-height: 5;">
          <a href="#">
            咨询热线：
            <span style="color: #9b9dbd">133-3999-0358</span>
          </a>
        </li>
      </ul>
      <div class="bottom-copyright">
        <p>
          Copyright©2019 依迅 版权所有 &nbsp;&nbsp;&nbsp;&nbsp; 备案号:鄂ICP备12016546号-6
          <!--&nbsp;&nbsp;&nbsp;&nbsp; <img src="img/police.png" height="20" width="20" /><span onclick="openUrl()">&nbsp;鄂公网安备 42018502000405号</span>-->
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      activeIndex: "/index/NorthPlus",
      isShow: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setFontSize(document, window);
      if (this.$router.currentRoute.path == "/OfficialWeb") {
        this.$router.push({ path: "/OfficialWeb/NorthPlus" });
      }
    });
  },
  methods: {
    showSubNav(v) {
      console.log(v);
      this.isShow = v;
    },
    handleCommand(c) {},
    handleSelect(key, keyPath) {
      this.$router.push({ path: key });
    },
    setFontSize(doc, win) {
      var docEl = doc.documentElement;
      var resizeEvt =
        "orientationchange" in window ? "orientationchange" : "resize";
      var reCaculate = function() {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = 100 * (clientWidth / 1920) + "px";
      };
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, reCaculate, false);
      doc.addEventListener("DOMContentLoaded", reCaculate, false);
    }
  },
  watch: {}
};
</script>

<style scoped>
</style>
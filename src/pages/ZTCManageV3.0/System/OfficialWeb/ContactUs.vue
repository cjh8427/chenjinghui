<template>
  <div class="bg-container" style="background: initial">
    <div class="content-top3"></div>
    <div class="content-mid">
      <div class="contact-us-container">
        <div style="width:50%; margin: 0 auto;padding: 20px">
          <div class="about-title">
            <p>
              联系我们
              <span>/ Contact Us</span>
            </p>
          </div>
          <!--地图容器-->
          <div id="map-container" class="content"></div>
          <div class="content-detail">
            <p>武汉依迅北斗空间技术有限公司</p>
            <p>公司地址：武汉武大科技园武大航域一期B5栋3-4层</p>
            <p>客服电话：400-811-1180</p>
            <p>服务热线：13339992626、13339999436、13339990358</p>
            <p>传真号码：027-87773501</p>
            <p>联系邮箱：super@exsun.cn</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "user-info-phone",
  data() {
    return {
      map: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
    });
  },
  methods: {
    initMap() {
      this.map = new AMap.Map("map-container", {
        resizeEnable: true,
        center: [114.416318, 30.458965],
        zoom: 16
      });
      this.addMarker();
    },
    addMarker() {
      let self = this;
      self.map.clearMap();
      let marker = new AMap.Marker({
        map: self.map,
        position: [114.416318, 30.458965]
      });
      //实例化信息窗体
      let title =
        '<div class="map-info-container"><p>武汉依迅北斗空间技术有限公司</p>' +
        "<p>地址：武汉武大科技园武大航域一期B5栋3-4层</p>" +
        "<p>电话：133-3999-0358</p></div>";
      let infoWindow = new AMap.InfoWindow({
        isCustom: true, //使用自定义窗体
        content: title,
        offset: new AMap.Pixel(10, -45)
      });
      infoWindow.open(self.map, marker.getPosition());

      //鼠标点击marker弹出自定义的信息窗体
      AMap.event.addListener(marker, "click", function() {
        infoWindow.open(self.map, marker.getPosition());
      });
    }
  }
};
</script>
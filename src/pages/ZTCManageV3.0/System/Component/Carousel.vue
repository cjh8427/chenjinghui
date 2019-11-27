<template>
  <!--左侧轮播图-->
  <el-carousel
    :interval="5000"
    arrow="always"
    :height="carouselHeight"
    indicator-position="outside"
  >
    <el-carousel-item v-for="(item,key) in carouselImgList" :key="key">
      <div class="ex-carousel-img-box">
        <el-image :src="item.imgUrl" fit="contain"></el-image>
        <div class="ex-carousel-text">
          <h4 class="ex-text-color-title ex-text-medium">{{item.title}}</h4>
          <p class="ex-text-color-context ex-text-small">{{item.text}}</p>
        </div>
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: "carousel",
  props: ["carouselHeight"],
  data() {
    return {
      carouselImgList: [
        {
          imgUrl: require("../../common/stastic/img/slider_img/slider_1.png"),
          text: "运输轨迹 调剂消纳 工地热力图 执法监督",
          title: "“互联网+北斗”城市渣土"
        },
        {
          imgUrl: require("../../common/stastic/img/slider_img/slider_2.png"),
          text: "位置监控 指挥调度 异常报警 考核分析",
          title: "“互联网+北斗”智慧环卫"
        },
        // {imgUrl: require('../../common/stastic/img/slider_img/slider_3.png'), text:'', title: ''},
        {
          imgUrl: require("../../common/stastic/img/slider_img/slider_4.png"),
          text: "国标平台 远程教学 模拟考试 计时实操",
          title: "“互联网+北斗”驾培驾考"
        }
      ]
      // carouselHeight: this.$props.cHeight
    };
  }
};
</script>

<style scoped>
</style>
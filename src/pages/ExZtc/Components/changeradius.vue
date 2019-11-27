<template>
  <!-- 监控范围 -->
  <el-slider
    v-model="tRadius"
    :step="100"
    :min="100"
    :max="15000"
    :format-tooltip="SliderTips"
    :vertical="true"
    :marks="marks"
    @change="changeMRadius"
    class="map-radius"
  ></el-slider>
</template>
<script>
export default {
  props: ["mRadius"],
  data() {
    return {
      tRadius: 5000,
      marks: {
        100: "100米",
        500: "500米",
        1000: "1公里",
        2000: "2公里",
        5000: "5公里",
        7000: "7公里",
        10000: "10公里",
        12000: "12公里",
        15000: "15公里"
      }
    };
  },
  methods: {
    //改变监控范围半径
    changeMRadius() {
      this.$emit("changeMRadius", this.tRadius);
    },
    //半径提示
    SliderTips(v) {
      return "实时监控半径：" + v / 1000 + "公里";
    }
  },
  watch: {
    mRadius(n) {
      if (n) {
        this.tRadius = this.mRadius;
      }
    }
  }
};
</script>
<style lang="less">
.map-radius {
  position: fixed !important;
  right: 15px;
  top: 175px;
  height:75%;
  .el-slider__runway {
    background-color: #333;
  }
  .el-slider__marks {
    width: auto;
    left: -100%;
    .el-slider__marks-text {
      margin-top: 0;
      left: -80px;
      transform: translateY(50%);
      color: #fff;
      background: #333;
      white-space: nowrap;
      padding: 0 15px;
      line-height: 24px;
      font-size: 13px;
      border-radius: 5px;
    }
  }
}
</style>
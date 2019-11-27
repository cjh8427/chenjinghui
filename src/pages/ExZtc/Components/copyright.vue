<template>
  <div class="system-copyrights">
    <el-card shadow="always">
      <el-button
        icon="el-icon-error"
        size="small"
        @click="hoverBoad(false)"
        v-if="showUpdate"
        circle
      />
      <el-badge value="new"  class="item-dot"><el-button type="text" @click="hoverBoad(true)">{{version}}</el-button></el-badge>
      <el-button
        icon="el-icon-error"
        size="small"
        @click="hoverBoad(false)"
        v-if="showUpdate"
        circle
      />


      <div class="copyright-content" v-if="showUpdate">
        <h5>(2019年11月21日) 更新内容:</h5>
        <ol>
          <li>调整了界面外观，主题色与升级计划UI设计保持一致。</li>
          <li>新增拔线预警车辆及离线车辆地图位置显示。</li>
          <li>为了优化性能，提高流畅性，目前默认关闭了工地名称显示，可在工具栏里自行打开。</li>
          <li>现在热力图可以自己切换开启了。</li>
          <li>修改了工地列表，增加停车场标签，增加了筛选条件，增加了门禁过车记录查询按钮(如有过车及安装门禁)</li>
        </ol>
        <h5>(2019年11月20日) 更新内容:</h5>
        <ol>
          <!-- <li>新增拔线预警车辆及离线车辆地图位置显示。</li> -->
          <li>修复了车辆列表翻页bug。</li>
        </ol>
         <!-- <h5>(2019年11月19日) 更新内容:</h5>
        <ol>
          <li>地图新增1小时内路网车流量热力图显示，在地图层级(11-15级中显示)。线路热力图需要事先在管理后台中设置需要记录的路网。热力图从打开页面开始，每小时刷新一次。</li>
          <li>监控半径范围增加到了15公里</li>
          <li>地图现在开始显示停车场围栏及名称。</li>
          <li>修复了车辆列表模糊搜索车牌号的bug</li>
        </ol>
        <h5>(2019年11月18日) 更新内容:</h5>
        <ol>
          <li>新增临时卡点过车记录功能，已经可以本地记录最多5个临时卡口记录，还存在部分bug后面解决。(进度80%)</li>
        </ol>
         <h5>(2019年11月17日) 更新内容:</h5>
        <ol>
          <li>调整了界面显示效果。</li>
          <li>调整监控半径范围：100米~10公里。</li>
          <li>新增临时卡点过车记录功能，目前完成UI设计及基本逻辑。(进度60%)</li>
        </ol>-->
        <!-- <h5>(2019年11月12日) 更新内容:</h5>
        <ol>
          <li>新增账号登录和退出功能。使用正式平台账号密码即可登录。</li>
        </ol>-->
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showUpdate: false,
      version: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.version = this.$store.state.version;
    });
  },
  methods: {
    hoverBoad(b) {
      this.showUpdate = b;
    }
  }
};
</script>
<style lang="less">
.system-copyrights {
  position: fixed;
  right: 15px;
  bottom: 0;
  cursor: pointer;
  width: 200px;
  display: inline-block;

  .item-dot{
    .el-badge__content.is-fixed{
      top: 13px !important;
      right: -5px !important;
    }
  }

  .copyright-content {
    line-height: 1.9;
    font-size: 12px;
    padding: 20px 0;
    transition: 0.75s ease-in all;
    h5 {
      font-size: 13px;
    }

    ol,
    li {
      width: 95%;
      margin-left: 5%;
      list-style-type: disc;
    }
  }

  .el-button--text {
    color: #fff;
    padding: 5px 0;
  }
  .el-card {
    font-size: 14px;
    padding: 0 20px;
    width: 200px;
    color: #fff;
    line-height: 28px;
    position: absolute;
    bottom: 0;
    right: 0;
    border: none;
    border-radius: 5px 5px 0 0;
    background: linear-gradient(to bottom, #333 0%, #000000 100%);

    .el-card__body {
      padding: 0 !important;
    }
  }
  .el-button--small.is-circle {
    position: absolute;
    right: 15px;
    top: 8px;
    cursor: pointer;
    padding: 0;
    border: none;
    background: transparent;
  }
}
</style>
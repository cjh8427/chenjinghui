<template>
  <div class="map-stastic">
    <el-row :gutter="12">
      <transition name="el-zoom-in-bottom">
        <el-col :span="24" v-if="StasticData.vechileCounter > 0">
          <el-card shadow="hover" style="position:relative">
            <h3>半径{{mRadius/1000 + '公里'}}在线车辆总数:</h3>
            <p>
              <img src="../../../stastic/img/ExZtc/truck_online.png" />
              <span>{{StasticData.vechileCounter}}</span> 辆
            </p>
          </el-card>
        </el-col>
      </transition>
      <transition name="el-zoom-in-bottom">
        <el-col :span="24" v-if="StasticData.alermCounter > 0">
          <el-card shadow="hover" style="background-color: #ca2d2d;">
            <h3>半径{{mRadius/1000 + '公里'}}预警车辆:</h3>
            <p>
              <img src="../../../stastic/img/ExZtc/truck_online_black.png" />
              <span>{{StasticData.alermCounter}}</span> 辆
            </p>
          </el-card>
        </el-col>
      </transition>
      <transition name="el-zoom-in-bottom">
        <el-col :span="24" v-if="StasticData.siteForwardCounter > 0">
          <el-card shadow="hover" style="background-color: #ca2d2d;">
            <h3>提前出土工地数量：</h3>
            <p>
              <img src="../../../stastic/img/ExZtc/site_forward.png" />
              <span>{{StasticData.siteForwardCounter}}</span> 个
            </p>
          </el-card>
        </el-col>
      </transition>
      <transition name="el-zoom-in-bottom">
        <el-col :span="24" v-if="StasticData.siteNoOrderCounter > 0">
          <el-card shadow="hover" style="background-color: #ca2d2d;">
            <h3>未上报出土工地数量：</h3>
            <p>
              <img src="../../../stastic/img/ExZtc/site_alerm.png" />
              <span>{{StasticData.siteNoOrderCounter}}</span> 个
            </p>
          </el-card>
        </el-col>
      </transition>
      <transition name="el-zoom-in-bottom">
        <el-col :span="24" v-if="StasticData.siteOrderCounter > 0">
          <el-card shadow="hover" style="background-color: #ca2d2d;">
            <h3>上报工地数量：</h3>
            <p>
              <img src="../../../stastic/img/ExZtc/site_online.png" />
              <span>{{StasticData.siteOrderCounter}}</span> 个
            </p>
          </el-card>
        </el-col>
      </transition>
      <transition name="el-zoom-in-bottom">
        <el-col :span="24" v-if="StasticData.siteFenceCounter > 0">
          <el-card shadow="hover" style="background-color: #2dca70;">
            <h3>门禁在线工地数量：</h3>
            <p>
              <img src="../../../stastic/img/ExZtc/site_fence_online.png" />
              <span>{{StasticData.siteFenceCounter}}</span> 个
            </p>
          </el-card>
        </el-col>
      </transition>
      <transition name="el-zoom-in-bottom">
        <el-col :span="24" v-if="StasticData.siteFenceOffCounter > 0">
          <el-card shadow="hover" style="background-color: #ca2d2d;">
            <h3>门禁离线工地数量</h3>
            <p>
              <img src="../../../stastic/img/ExZtc/site_fence_offline.png" />
              <span>{{StasticData.siteFenceOffCounter}}</span> 个
            </p>
          </el-card>
        </el-col>
      </transition>
    </el-row>
  </div>
</template>
<script>
export default {
  props: ["mRadius", "StasticData"]
};
</script>
<style lang="less">
.map-stastic {
  position: fixed;
  left: 15px;
  bottom: 55px;
  width: 220px;
  text-align: center;
  z-index: 1000;
  .el-card {
    cursor: pointer;
    border: none;
    background-color: #2d469a;
    background-image: linear-gradient(
      -45deg,
      rgba(255, 255, 255, 0.05) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.05) 50%,
      rgba(255, 255, 255, 0.05) 75%,
      transparent 75%,
      transparent
    );
    background-size: 10px 10px;
    box-shadow: 0 8px 10px -5px rgba(0, 0, 0, 0.2),
      0 6px 14px 2px rgba(0, 0, 0, 0.14), 0 6px 12px 5px rgba(0, 0, 0, 0.12);

    color: #fff;
    margin: 7px;
    .el-card__body {
      padding: 10px;

      h3 {
        font-size: 14px;
        font-weight: normal;
      }
      p {
        span {
          font-size: 32px;
          font-weight: bold;
        }
      }
    }
  }
}
</style>
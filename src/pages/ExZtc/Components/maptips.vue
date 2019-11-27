<template>
  <div class="map-tooltip">
    <h3>车辆图例</h3>
    <ul>
      <li>
        <div class="image">
          <img src="../../../stastic/img/ExZtc/truck_online.png" />
        </div>
        <p>行驶状态</p>
      </li>
      <li>
        <div class="image">
          <img src="../../../stastic/img/ExZtc/truck_online_dot.png" />
        </div>
        <p>停车状态</p>
      </li>
      <li>
        <div class="image">
          <img src="../../../stastic/img/ExZtc/truck_online_dot_blue.png" />
        </div>
        <p>熄火状态</p>
      </li>
      <li>
        <div class="image">
          <img src="../../../stastic/img/ExZtc/truck_alerm.png" />
        </div>
        <p>报警车辆</p>
      </li>
      <li>
        <div class="image">
          <img src="../../../stastic/img/ExZtc/truck_online_black.png" />
        </div>
        <p>无资质车</p>
      </li>
      <li>
        <div class="image">
          <img src="../../../stastic/img/ExZtc/truck_offline.png" />
        </div>
        <p>离线车辆</p>
      </li>
    </ul>

    <h3>工地图例</h3>
    <ul>
      <li>
        <div class="image">
          <img src="../../../stastic/img/ExZtc/site_forward.png" />
        </div>
        <p>提前出土</p>
      </li>
      <li>
        <div class="image">
          <img src="../../../stastic/img/ExZtc/site_alerm.png" />
        </div>
        <p>未上报出土</p>
      </li>
      <li>
        <div class="image">
          <img src="../../../stastic/img/ExZtc/site_fence_online.png" />
        </div>
        <p>门禁在线</p>
      </li>
      <li>
        <div class="image">
          <img src="../../../stastic/img/ExZtc/site_fence_offline.png" />
        </div>
        <p>门禁离线</p>
      </li>
    </ul>
  </div>
</template>
<script>
export default {};
</script>
<style lang="less">
.map-tooltip {
  font-size: 12px;
  position: absolute;
  left: 15px;
  margin-top: -26px;
  width: 220px;
  border-radius: 5px 5px 0 0;
  padding: 0 10px;
  color: #fff;
  background-color: #333;
  transition: 0.5s ease-in all;
  cursor: pointer;
  z-index: 2000;

  &:hover {
    bottom: 0;
  }

  h3 {
    line-height: 26px;
  }

  li {
    display: table;
    width: 50%;
    height: 60px;
    float: left;
    text-align: center;
    .image {
      width: 36px;
      height: 36px;
      display: table-cell;
      vertical-align: middle;
      margin: 5px auto;
    }

    p {
      line-height: 50px;
    }
  }
}
</style>
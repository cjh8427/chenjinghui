<template>
  <div class="ex-init">
    <el-dialog
      :visible.sync="showModal"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="35px"
      :show-close="false"
    >
      <span slot="title">
        <el-steps :active="initStep" finish-status="success" align-center simple>
          <el-step
            :title="item.label"
            :icon="item.icon"
            v-for="item,index in dialogTitle"
            :key="index"
          ></el-step>
        </el-steps>
      </span>

      <!-- 第一步 -->
      <section v-if="initStep == 0">
        <initBaseData />
      </section>

      <!-- 第二步 -->
      <section v-if="initStep == 1">
        <el-tabs type="border-card">
          <el-tab-pane label="全局监管">
            <initAllMonitor />
          </el-tab-pane>
          <el-tab-pane label="环境监测" v-if="pModule.airmonitor.enable">
            <initAirMonitor />
          </el-tab-pane>

          <!-- <el-tab-pane label="围栏设置">
            <initFences />
          </el-tab-pane>-->
          <el-tab-pane label="场站管理" v-if="pModule.sitemonitor.enable">
            <initFences />
          </el-tab-pane>
        </el-tabs>
      </section>
      <!-- 第三步 -->
      <section v-if="initStep == 2">
        <simData />
      </section>
      <!-- 第四步 -->
      <section v-if="initStep == 3">
        <div style="text-align:center;font-size:18px;font-weight:bold;">完成平台配置,正在进入平台页面。</div>
        <el-button type="success" @click="saveCfg">保存已有配置</el-button>
      </section>
      <span slot="footer" class="dialog-footer">
        <span class="ex-ver" style="float:left">当前版本：{{ver}}</span>
        <section v-if="initStep == 0">
          <!--    @click="submitUpload" -->
          <el-button type="primary" @click="handleStep(1)">下一步</el-button>
        </section>
        <section v-if="initStep == 1">
          <el-button type="default" @click="handleStep(0)">上一步</el-button>
          <el-button type="primary" @click="handleStep(2)">下一步</el-button>
        </section>
        <section v-if="initStep == 3">
          <el-button type="default" @click="handleStep(1)">上一步</el-button>
          <el-button type="primary" @click="handleStep(4)">进入平台页面</el-button>
        </section>
      </span>
    </el-dialog>
  </div>
</template>
<script>
//调用的库文件
import service from "./initdatamodule.service";
import store from "../Configs/store";

import initBaseData from "../../JzIndex/Component/initStep/initData/initBaseData"; //初始化基础数据
import initAllMonitor from "../../JzIndex/Component/initStep/initData/initAllMonitor.vue"; //初始化全局监控数据
import initAirMonitor from "../../JzIndex/Component/initStep/initData/initAirMonitor.vue"; //初始化环境监测数据
import initFences from "../../JzIndex/Component/initStep/initData/initFences.vue"; //初始化围栏数据
import simData from "../../JzIndex/Component/initStep/initData/simData.vue"; //模拟数据生成

import { saveAs } from "file-saver";

export default {
  name: "initDataModule",
  components: {
    initBaseData,
    initAllMonitor,
    initAirMonitor,
    initFences,
    simData
  },
  data() {
    return {
      showModal: true,
      dialogTitle: [
        { label: "数据初始化", icon: "el-icon-s-management" },
        { label: "模块配置", icon: "el-icon-s-help" },
        { label: "模拟数据生成", icon: "el-icon-s-open" },
        { label: "完成初始配置", icon: "el-icon-s-claim" }
      ]
    };
  },
  methods: {
    handleStep(step) {
      this.$store.commit("handle_step", step);
    },
    saveCfg() {
      let self = this;
      var cfgJson = {
        platformData: store.state.platformData,
        simData: store.state.simData
      };

      var file = new File(
        [JSON.stringify(cfgJson)],
        this.pState.city + this.pState.name +"_配置.json",
        {
          type: "application/json;charset=utf-8"
        }
      );
      saveAs(file);
      self.$store.commit("handle_step", 4);
    }
  },
  computed: {
    initStep() {
      return store.state.initStep;
    },
    initPlartform() {
      return store.state.initPlartform;
    },
    pState() {
      return store.state.platformData.state;
    },
    pModule() {
      return this.$store.state.platformData.module;
    },
    platformUnit() {
      let unitTemp = store.state.platformUnit;
      unitTemp = unitTemp.join("|");
      return unitTemp;
    },
    ver() {
      localStorage.$version = store.state.version
      return store.state.version;
    }
  }
};
</script>


<style lang="less">
.ex-init {
  line-height: 1.5;
  .el-button--mini.is-circle {
    padding: 3px !important;
  }
  blockquote {
    padding: 10px;
    background-color: #fffdb7;
  }
  h3 {
    line-height: 42px;
  }
  .ex-ver {
    font-size: 12px;
  }
}
</style>
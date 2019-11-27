<template>
  <div class="ex-pages">
    <!-- 侧边导航栏 -->
    <div class="ex-menu-side" :class="{'hide-menu' : hideMenu}">
      <h2>
        <i class="ex-icon ex-icon-equipment" />
        设备
      </h2>

      <div class="box-card-container">
        <el-card class="box-card" v-for="(item, key) in cardList" :key="key">
          <div class="card-icon-container" style="margin-left: 15px;margin-top: 20px;">
            <i :class="item.icon"></i>
          </div>
          <div class="box-card-right">
            <p>{{item.title}}</p>
            <p>
              <span
                style="font-size: 16px;font-weight: 600;line-height: 2;color:#000000"
              >{{item.number}}</span>台
            </p>
          </div>
        </el-card>
      </div>
      <div class="bottom-position-container">
        <div class="bottom-card">
          <div class="bottom-position-img">
            <i class="ex-icon ex-icon-file-large"></i>
          </div>
          <div class="bottom-text">您当前购买的设备版本为{{version}}，点击下方按钮即可升级</div>
          <div class="bottom-button">
            <el-button type="info" size="small" @click="uploadDevice">升级</el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="ex-pages-content" :class="{'hide-menu':hideMenu}">
      <div class="ex-table-content">
        <!-- 报表查询 -->
        <div class="ex-table-query">
          <el-form :inline="true" :model="formInline" size="small">
            <el-form-item>
              <el-button type="info" @click="importDeviceFunc">导入设备号</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="handleAdd">导出设备号</el-button>
            </el-form-item>
            <div class="fr">
              <el-form-item>
                <el-input placeholder="请输入要搜索的内容" v-model="formInline.user">
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </el-form-item>
            </div>
          </el-form>
        </div>

        <div class="ex-table-query">
          <div class="fr">
            <span style="color:#909399;font-size: 13px">已上传设备{{tableCount}}台</span>
          </div>
        </div>

        <!-- 报表表格 -->
        <el-table
          :height="tableHeight"
          :data="tableDataList"
          row-key="name"
          stripe
          border
          header-row-class-name="ex-table-header"
        >
          <!--<el-table-column type="selection" width="40" align="center"></el-table-column>-->
          <!--<el-table-column prop="id" label="id" width="60"></el-table-column>-->
          <!--<el-table-column prop="icon" width="80" align="center" label="菜单图标"></el-table-column>-->
          <el-table-column prop="version" label="设备版本" align="center"></el-table-column>
          <el-table-column prop="origion" label="设备来源" align="center"></el-table-column>
          <el-table-column prop="type" label="设备类型" align="center"></el-table-column>
          <el-table-column prop="phoneNum" label="设备号" align="center"></el-table-column>
          <el-table-column prop="contract" label="设备协议" align="center"></el-table-column>
          <el-table-column prop="vehicleNo" label="车牌号" align="center"></el-table-column>
          <el-table-column prop="address" label="设备对接地址" align="center"></el-table-column>
          <el-table-column prop="dateTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="action" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :hide-on-single-page="false"
          background
          layout="total, prev, pager, next, jumper"
          :total="totalCount"
          class="ex-pagination"
          @size-change="handlePagination"
          @current-change="handlePagination"
          @prev-click="handlePagination"
          @next-click="handlePagination"
        ></el-pagination>
      </div>
    </div>

    <!--导入设备-->
    <importDevice :showModal="showModal" v-on:importDeviceValue="importDeviceValue"></importDevice>
  </div>
</template>

<script>
import importDevice from "./Component/Modal/importDevice";
export default {
  name: "device-manage",
  components: {
    importDevice
  },
  data() {
    return {
      hideMenu: false,
      activeIndex: "/system/menu",
      tableDataList: [],
      totalCount: 0,
      showModal: false,
      formInline: {
        user: "",
        region: ""
      },
      cardList: [
        {
          title: "已上传设备",
          icon: "ex-icon ex-icon-upload-equipment",
          number: 100
        },
        {
          title: "依迅设备",
          icon: "ex-icon ex-icon-exsun-equipment",
          number: 2000
        },
        { title: "自购设备", icon: "ex-icon ex-icon-buy-equipment", number: 20 }
      ],
      version: "基础版",
      tableCount: 100,
      tableHeight: window.innerHeight - 235
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.simiData();
    });
  },
  methods: {
    // 模拟数据
    simiData() {
      let nTotal = Math.floor(Math.random() * 100 + 1);
      this.totalCount = nTotal;
      let nArr = [];
      let versionArr = ["基础版", "其他", "进阶版", "高级版"];
      let origionArr = ["依迅设备", "自购设备", "其他"];

      for (var i = 1; i <= nTotal; i++) {
        nArr.push({
          id: i,
          version: versionArr[Math.floor(Math.random() * versionArr.length)],
          origion: origionArr[Math.floor(Math.random() * origionArr.length)],
          type: origionArr[Math.floor(Math.random() * origionArr.length)],
          phoneNum: Math.floor(Math.random() * (99999999 - 1)) + 1,
          contract: "设备协议",
          vehicleNo: "鄂A" + Math.floor(Math.random() * (999999 - 1)) + 1,
          address: "设备对接地址",
          dateTime: new Date().toLocaleString()
        });
      }
      this.tableDataList = nArr;
    },
    // 处理翻页
    handlePagination(page) {
      console.log(page);
    },
    // 导入设备号
    importDeviceFunc() {
      this.showModal = true;
    },
    importDeviceValue(oData) {
      this.showModal = oData;
    },
    handleAdd() {
      this.showModal = true;
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleSelect(key, keyPath) {
      console.log(key);
      this.$router.push({ path: key });
    },

    addMenu(close) {
      var self = this;
      self.showModal = close;
    },

    onSubmit() {
      console.log("submit!");
    },
    handleMenu() {
      this.hideMenu = !this.hideMenu;
    },
    // 升级设备
    uploadDevice() {
      this.$router.push({ path: "/system/UserCenter/mycenter/Device" });
    }
  }
};
</script>

<style scoped lang="sass">

</style>
<template>
  <div class="ex-dialog" v-if="dialogTableVisible">
    <el-dialog
      title="车辆"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="40%"
    >
      <el-form ref="vehicleForm" :model="vehicleForm" :rules="ruleInline" label-width="110px">
        <el-form-item label="设备品牌：" prop="deviceBrand ">
          <el-input v-model="vehicleForm.deviceBrand" size="small"></el-input>
        </el-form-item>
         <el-form-item label="简称：" prop="shortName  ">
          <el-input v-model="vehicleForm.shortName " size="small"></el-input>
        </el-form-item>
        <el-form-item label="设备号：" prop="devNo ">
          <el-input v-model="vehicleForm.devNo" size="small"></el-input>
        </el-form-item>
        <!-- <el-form-item label="上级部门：" prop="ParentId">
          <el-cascader
            :options="deptOptions"
            :show-all-levels="false"
            v-model="vehicleForm.ParentId"
            style="width:100%"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf">({{ data.children.length }})</span>
            </template>
          </el-cascader>
        </el-form-item> -->
        <el-form-item label=" 摄像头个数：" prop="cameraNum ">
          <el-input v-model="vehicleForm.cameraNum " size="small"></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="Contacts">
          <el-input v-model="vehicleForm.Contacts" size="small"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="ContactsTel">
          <el-input v-model="vehicleForm.ContactsTel" size="small"></el-input>
        </el-form-item>
        <el-form-item label=" 终端id：" prop="terminalId ">
          <el-input v-model="vehicleForm.terminalId " size="small"></el-input>
        </el-form-item>
        <el-form-item label="总重量：" prop="tonnage ">
          <el-input v-model="vehicleForm.tonnage " size="small"></el-input>
        </el-form-item>
        <el-form-item label=" 车牌号：" prop="vehNo ">
          <el-input v-model="vehicleForm.vehNo " size="small"></el-input>
        </el-form-item>
        <el-form-item label=" 车辆颜色：" prop="vehicleColor ">
          <el-input v-model="vehicleForm.vehicleColor " size="small"></el-input>
        </el-form-item>
        <el-form-item label=" 安装时间：" prop="installTime ">
          <el-input v-model="vehicleForm.installTime " size="small"></el-input>
        </el-form-item>
        <el-form-item label="车牌颜色：" prop="licensePlateColor ">
          <el-select v-model="vehicleForm.licensePlateColor " placeholder="请选择" style="width:100%">
            <el-option label="黄色" value="1"></el-option>
            <el-option label="蓝色" value="2"></el-option>
            <el-option label="绿色" value="2"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label=" 备注：" prop="Remark">
          <el-input v-model="vehicleForm.Remark" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <span style="color: brown">提示：初始密码为000000</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSave">确定</el-button>
        <el-button size="small" @click="handleCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["showModal", "rowData"],
  data() {
    return {
      vehicleForm: {
        cameraNum: null,
        contact: null,
        contactPhone: null,
        devNo: null,
        deviceBrand: null,
        installTime: null,
        licensePlateColor: null,
        remark: null,
        shortName: null,
        terminalId: null,
        tonnage : null,
        vehNo : null,
        vehicleColor: null
      },
      ruleInline: {
        ShortName: [
          { required: true, message: "简称不能为空", trigger: "blur" },
        ],
        deviceBrand: [
          { required: true, message: "设备品牌不能为空", trigger: "blur" }
        ],
        devNo: [
          { required: true, message: "设备号不能为空", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {},
  methods: {
    handleChange(val) {
      console.log(val);
    },
    handleCancel() {
      this.$refs["vehicleForm"].resetFields();
      this.$emit("addVehicle", false);
    },
    handleSave() {
      this.$emit("addVehicle", false);
    },
    // 查询表格数据
    queryDialogGridData() {},

    selectCloudMapFn() {
      this.selectCloudMap = true;
    },

    selectCloudMapCallBack(v) {
      this.selectCloudMap = v;
    }
  },
  watch: {
    showModal(v) {
      if (!v) {
        this.vehicleForm = {
            cameraNum: null,
            contact: null,
            contactPhone: null,
            devNo: null,
            deviceBrand: null,
            installTime: null,
            licensePlateColor: null,
            remark: null,
            shortName: null,
            terminalId: null,
            tonnage : null,
            vehNo : null,
            vehicleColor: null
        };
      }
    },
    rowData(v) {
      if (v.devNo) {
        this.vehicleForm = v;
      }
    }
  },
  computed: {
    dialogTableVisible: {
      get() {
        return this.showModal;
      },
      set(val) {
        return this.showModal;
      }
    }
  }
};
</script>

<style scoped>
 
  .el-form{
    display: flex;
    justify-content: inherit;
    align-items: center;
    flex-wrap: wrap;
  }
  .el-form-item{
    width: 48%;
  }

</style>
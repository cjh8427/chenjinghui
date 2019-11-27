<template>
  <el-dialog
    class="import-device-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="新增收货地址"
    :visible.sync="centerDialogVisible"
    :destroy-on-close="true"
    :close="closeDialog"
    :before-close="closeDialog"
    width="35%"
    center
  >
    <el-form
      :model="newAddressForm"
      :rules="newAddressRules"
      ref="newAddressForm"
      label-width="80px"
    >
      <el-form-item label="收货人" prop="name">
        <el-input
          autocomplete="off"
          placeholder="请输入收货人姓名"
          prefix-icon="el-icon-lock"
          v-model="newAddressForm.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input
          autocomplete="off"
          placeholder="请输入联系电话"
          prefix-icon="el-icon-lock"
          v-model="newAddressForm.phone"
        ></el-input>
      </el-form-item>
      <el-form-item label="所在区域" prop="area">
        <!--<el-cascader :options="options" clearable></el-cascader>-->

        <el-select v-model="newAddressForm.area" placeholder="请选择">
          <el-option label="武汉市" value="武汉市"></el-option>
          <el-option label="荆门市" value="荆门市"></el-option>
          <el-option label="宜昌市" value="宜昌市"></el-option>
          <el-option label="孝感市" value="孝感市"></el-option>
          <el-option label="黄冈市" value="黄冈市"></el-option>
          <el-option label="十堰市" value="十堰市"></el-option>
          <el-option label="襄阳市" value="襄阳市"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input
          autocomplete="off"
          placeholder="请输入联系电话"
          prefix-icon="el-icon-lock"
          v-model="newAddressForm.address"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="info" @click="submitForm('newAddressForm')" style="width: 90%">保存收货地址</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "import-device",
  props: ["showModal", "formData"],
  data() {
    return {
      centerDialogVisible: false,
      newAddressForm: {
        name: "",
        phone: "",
        area: "",
        address: ""
      },
      newAddressRules: {
        name: [
          { required: true, message: "请输入收货人姓名", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
        area: [{ required: true, message: "请选择区域", trigger: "change" }],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      options: [
        {
          value: 1,
          label: "东南",
          children: [
            {
              value: 2,
              label: "上海",
              children: [
                { value: 3, label: "普陀" },
                { value: 4, label: "黄埔" },
                { value: 5, label: "徐汇" }
              ]
            },
            {
              value: 7,
              label: "江苏",
              children: [
                { value: 8, label: "南京" },
                { value: 9, label: "苏州" },
                { value: 10, label: "无锡" }
              ]
            },
            {
              value: 12,
              label: "浙江",
              children: [
                { value: 13, label: "杭州" },
                { value: 14, label: "宁波" },
                { value: 15, label: "嘉兴" }
              ]
            }
          ]
        },
        {
          value: 17,
          label: "西北",
          children: [
            {
              value: 18,
              label: "陕西",
              children: [
                { value: 19, label: "西安" },
                { value: 20, label: "延安" }
              ]
            },
            {
              value: 21,
              label: "新疆维吾尔族自治区",
              children: [
                { value: 22, label: "乌鲁木齐" },
                { value: 23, label: "克拉玛依" }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    // 监听弹窗关闭
    closeDialog() {
      this.centerDialogVisible = false;
      this.$emit("newAddressValue", false);
    },
    // 提交订单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$message({
            type: "info",
            message: `提交成功!`
          });
          this.$refs[formName].resetFields();
          this.centerDialogVisible = false;
          this.$emit("newAddressValue", false);
        }
      });
    }
  },
  watch: {
    showModal(newValue, oldValue) {
      this.centerDialogVisible = newValue;
    },
    formData(n, v) {
      if (n) {
        for (let i in this.newAddressForm) {
          this.newAddressForm[i] = n[i];
        }
      }
    }
  },
  computed: {}
};
</script>

<style scoped>
</style>
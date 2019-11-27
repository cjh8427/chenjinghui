<template>
  <el-dialog
    class="import-device-dialog"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    title="上传设备号"
    :visible.sync="centerDialogVisible"
    :destroy-on-close="true"
    :close="closeDialog"
    :before-close="closeDialog"
    width="35%"
    center
  >
    <el-form ref="form" :model="importDeviceForm" label-width="80px">
      <el-form-item label="设备协议">
        <el-select v-model="importDeviceForm.contract" placeholder="请选择">
          <el-option label="设备协议一" value="设备协议一"></el-option>
          <el-option label="设备协议二" value="设备协议一"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-select v-model="importDeviceForm.type" placeholder="请选择">
          <el-option label="设备类型一" value="设备类型一"></el-option>
          <el-option label="设备类型二" value="设备类型二"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备来源">
        <el-select v-model="importDeviceForm.origin" placeholder="请选择">
          <el-option label="设备来源一" value="设备来源一"></el-option>
          <el-option label="设备来源二" value="设备来源二"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传文件">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          multiple
          :limit="3"
          :on-exceed="handleExceed"
          :before-upload="beforeUpload"
          :file-list="importDeviceForm.fileList"
          accept=".xls, .xlsx"
        >
          <el-button size="small" type="info">选择Excel文件</el-button>
          <span slot="tip" class="el-upload__tip" style="margin-left: 20px">Excel文件大小不超过50MB</span>
        </el-upload>
      </el-form-item>
      <el-form-item label="模板">
        <el-link type="info" :href="downloadUrl">下载Excel模板</el-link>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <!--<el-button @click="centerDialogVisible = false">取 消</el-button>-->
      <el-button type="info" size="small" @click="submitForm" style="width: 90%">导入</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "import-device",
  props: ["showModal"],
  data() {
    return {
      centerDialogVisible: false,
      importDeviceForm: {
        contract: "",
        type: "",
        origin: "",
        fileList: []
      },
      downloadUrl: ""
    };
  },
  methods: {
    // 监听弹窗关闭
    closeDialog() {
      this.centerDialogVisible = false;
      this.$emit("importDeviceValue", false);
    },
    // 提交订单
    submitForm() {
      this.centerDialogVisible = false;
      this.$emit("importDeviceValue", false);
    },
    // 文件上传前判断
    beforeUpload(file) {
      console.log(file);
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xls";
      const extension2 = testmsg === "xlsx";
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 xls、xlsx格式!",
          type: "warning"
        });
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 50MB!",
          type: "warning"
        });
      }
      return extension || (extension2 && isLt2M);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  },
  watch: {
    showModal(newValue, oldValue) {
      this.centerDialogVisible = newValue;
    }
  },
  computed: {
    // centerDialogVisible() {
    //     return this.showModal;
    // }
  }
};
</script>

<style scoped>
</style>
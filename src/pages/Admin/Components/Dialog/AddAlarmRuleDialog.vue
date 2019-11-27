<template>
  <div class="ex-dialog" v-if="dialogTableVisible">
    <el-dialog
      title="报警规则"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="60%"
    >
      <el-container style="height: 500px; border: 1px solid #eee">
        <el-aside width="70%" style="border-right: 1px solid #dedcdc;">
          <el-form ref="ruleForm" :model="ruleForm" label-width="110px">
            <el-col :span="11">
              <el-form-item label="规则类型：" prop="type">
                <el-input v-model="ruleForm.type" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="规则名称：" prop="name">
                <el-input v-model="ruleForm.name" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="规则阈值：" prop="number">
                <el-input v-model="ruleForm.number" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="持续时长(秒)：" prop="timing">
                <el-input v-model="ruleForm.timing" size="small"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="生效日期1：" prop="date1">
                <el-date-picker
                  placeholder="选择时间"
                  v-model="ruleForm.date1"
                  size="small"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="生效时间1：" prop="time1">
                <el-time-picker
                  placeholder="选择时间"
                  v-model="ruleForm.time1"
                  size="small"
                  style="width: 100%;"
                ></el-time-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="生效日期2：" prop="date2">
                <el-date-picker
                  placeholder="选择时间"
                  v-model="ruleForm.date2"
                  size="small"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="生效时间2：" prop="time2">
                <el-time-picker
                  placeholder="选择时间"
                  v-model="ruleForm.time2"
                  size="small"
                  style="width: 100%;"
                ></el-time-picker>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="22">
              <el-form-item>
                <el-button type="primary" size="small" @click="handleSave">立即创建</el-button>
                <el-button size="small" @click="handleCancel">取消</el-button>
              </el-form-item>
            </el-col>-->
          </el-form>
        </el-aside>
        <el-container width="30%" style="overflow: hidden;padding-top: 10px;">
          <el-header style="height: inherit;margin:0 auto">
            <el-button size="small" type="primary" @click="selectCloudMapFn">选择空间对象</el-button>
          </el-header>
          <div class="tag-container-close">
            <el-tag closable v-for="item in 9" :key="item">{{item+1}}</el-tag>
          </div>
        </el-container>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSave">确定</el-button>
        <el-button size="small" @click="handleCancel">取消</el-button>
      </span>
    </el-dialog>
    <SelectCloudMapDialog
      :showModal="selectCloudMap"
      v-on:selectCloudMapCallBack="selectCloudMapCallBack"
    ></SelectCloudMapDialog>
  </div>
</template>
<script>
import SelectCloudMapDialog from "./SelectCloudMapDialog";
export default {
  props: ["showModal"],
  components: { SelectCloudMapDialog },
  data() {
    return {
      activeNames: ["1"],
      ruleForm: {
        type: null,
        name: null,
        timing: null,
        number: null,
        date1: null,
        time1: null,
        date2: null,
        time2: null
      },
      tableData: [],
      selectCloudMap: false
    };
  },
  mounted() {},
  methods: {
    handleChange(val) {
      console.log(val);
    },
    handleCancel() {
      this.$refs["ruleForm"].resetFields();
      this.$emit("addAlarmRule", false);
    },
    handleSave() {
      this.$emit("addAlarmRule", false);
    },
    // 查询表格数据
    queryDialogGridData() {},

    selectCloudMapFn() {
      this.selectCloudMap = true;
    },

    selectCloudMapCallBack(v){
      this.selectCloudMap = v;
    }
  },
  watch: {},
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
<template>
  <div class="ex-dialog" v-if="dialogTableVisible">
    <el-dialog
      title="企业"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="40%"
    >
      <el-form ref="enterpriseForm" :model="enterpriseForm" :rules="ruleInline" label-width="110px">
        <el-form-item label="部门名称：" prop="Name">
          <el-input v-model="enterpriseForm.Name" size="small"></el-input>
        </el-form-item>
        <el-form-item label="部门简称：" prop="ShortName">
          <el-input v-model="enterpriseForm.ShortName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="上级部门：" prop="ParentId">
          <el-cascader
            :options="deptOptions"
            :show-all-levels="false"
            v-model="enterpriseForm.ParentId"
            style="width:100%"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf">({{ data.children.length }})</span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="联系人：" prop="Contacts">
          <el-input v-model="enterpriseForm.Contacts" size="small"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="ContactsTel">
          <el-input v-model="enterpriseForm.ContactsTel" size="small"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="Remark">
          <el-input v-model="enterpriseForm.Remark" size="small"></el-input>
        </el-form-item>
        <el-form-item label="排序：" prop="Phone">
          <el-input v-model="enterpriseForm.Phone" size="small"></el-input>
        </el-form-item>
        <el-form-item label="标签：" prop="TagId">
          <el-select v-model="enterpriseForm.TagId" placeholder="请选择" style="width:100%">
            <el-option label="好" value="1"></el-option>
            <el-option label="很好" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门类型：" prop="DeptType">
          <el-select v-model="enterpriseForm.DeptType" placeholder="请选择" style="width:100%">
            <el-option label="区域" value="1"></el-option>
            <el-option label="企业" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门属性：" prop="DepartRole">
          <el-select v-model="enterpriseForm.DepartRole" placeholder="请选择" style="width:100%">
            <el-option label="强" value="1"></el-option>
            <el-option label="很强" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区域网格：" prop="CloudMapIDs">
          <el-select v-model="enterpriseForm.CloudMapIDs" placeholder="请选择" style="width:100%">
            <el-option label="武昌区" value="1"></el-option>
            <el-option label="硚口区" value="2"></el-option>
          </el-select>
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
      deptOptions: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致"
                },
                {
                  value: "fankui",
                  label: "反馈"
                },
                {
                  value: "xiaolv",
                  label: "效率"
                },
                {
                  value: "kekong",
                  label: "可控"
                }
              ]
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航"
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航"
                }
              ]
            }
          ]
        }
      ],
      enterpriseForm: {
        Account: null,
        Name: null,
        DepartmentId: null,
        Sex: null,
        Email: null,
        Phone: null
      },
      ruleInline: {
        ShortName: [
          { required: true, message: "简称不能为空", trigger: "blur" },
          {
            type: "string",
            max: 8,
            message: "简称长度不能小于4位或者大于8位",
            trigger: "blur"
          }
        ],
        Name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        ParentId: [
          { required: true, message: "上级部门不能为空", trigger: "blur" }
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
      this.$refs["enterpriseForm"].resetFields();
      this.$emit("addEnterprise", false);
    },
    handleSave() {
      this.$emit("addEnterprise", false);
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
        this.enterpriseForm = {
          roleName: null,
          des: null
        };
      }
    },
    rowData(v) {
      if (v.roleName) {
        this.enterpriseForm = v;
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
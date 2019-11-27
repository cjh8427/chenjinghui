<template>
  <div class="ex-dialog" v-if="dialogTableVisible">
    <el-dialog
      title="用户"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="40%"
    >
      <el-form ref="userForm" :model="userForm" :rules="ruleInline" label-width="110px">
        <el-form-item label="账号：" prop="account">
          <el-input v-model="userForm.account" size="small"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="userName">
          <el-input v-model="userForm.userName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="DepartmentId">
          <el-cascader :options="deptOptions" :show-all-levels="false" v-model="userForm.DepartmentId" style="width:100%">
            <template slot-scope="{ node, data }">
              <span>{{ data.label }}</span>
              <span v-if="!node.isLeaf">({{ data.children.length }})</span>
            </template>
          </el-cascader>
        </el-form-item>
        <el-form-item label="性别：" prop="sex">
          <el-select v-model="userForm.sex" placeholder="请选择" style="width:100%">
            <el-option label="女" value="0"></el-option>
            <el-option label="男" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="email：" prop="email">
          <el-input v-model="userForm.email" size="small"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话：" prop="phone">
          <el-input v-model="userForm.phone" size="small"></el-input>
        </el-form-item>
        <el-form-item>
          <span style="color: brown;">提示：初始密码为000000</span>
        </el-form-item>
        <el-form-item>
          <span></span>
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
      userForm: {
        id:null,
        account: null,
        userName: null,
        DepartmentId: null,
        sex: null,
        email: null,
        phone: null
      },
      ruleInline: {
        account: [
          { required: true, message: "角色名不能为空", trigger: "blur" },
          // {
          //   type: "string",
          //   min: 4,
          //   message: "角色名长度不能小于4位",
          //   trigger: "blur"
          // }
        ],
        userName: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
          // {
          //   type: "string",
          //   min: 4,
          //   message: "姓名长度不能小于4位",
          //   trigger: "blur"
          // }
        ],
        // DepartmentId: [
        //   { required: true, message: "角色名不能为空", trigger: "blur" }
        // ]
      }
    };
  },
  mounted() {},
  methods: {
    handleChange(val) {
      console.log(val);
    },
    handleCancel() {
      this.$refs["userForm"].resetFields();
      this.$emit("addUser", false);
    },
    handleSave() {
      let self = this;
       this.$refs["userForm"].validate(valid => {
          if (valid) {
            console.log(valid);
            self.dialogLoading = true;
            this.postValue = {
              account: self.userForm.account,
              email: self.userForm.email,
              id: self.userForm.id,
              password: "000000",
              phone: self.userForm.phone,
              roleId: 3,
              sex: self.userForm.sex,
              userId: 1,
              userName: self.userForm.userName
            }

            let postUrl = '/user/add';
            if(this.userForm.id){
              postUrl = '/user/edit';
            }
          this.https.post(postUrl,this.postValue).then(res=>{
            console.log(res);
            self.dialogLoading = false;
            if(res.data.code == 0){
              self.$emit("addUser", { showModal: false, isReload: true });
            }else{
              self.$message({
                type:'error',
                message:res.data.message
              });
              self.$emit("addUser", {showModal:false});
            }
          }).catch(err => {
               console.log(err);
               self.$emit("addUser",{showModal:false});
              self.dialogLoading = false;
            });
          }else{
            return false;
          }
       });
    
      // this.$emit("addUser", false);
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
        this.userForm = {
          id:null,
          account: null,
          userName: null,
          DepartmentId: null,
          sex: null,
          email: null,
          phone: null
        };
      }
    },
    rowData(v) {
      if (v.id) {
        this.userForm = v;
        this.userForm.sex = null;
      }
      // console.log(this.userForm);
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

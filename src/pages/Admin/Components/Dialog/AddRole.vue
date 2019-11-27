<template>
  <div class="ex-dialog" v-if="dialogTableVisible">
    <el-dialog
      title="角色"
      :loading="dialogLoading"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="27%"
    >
      <el-form ref="roleForm" :model="roleForm" :rules="ruleInline" label-width="110px">
        <el-form-item label="角色名称：" prop="roleName">
          <el-input v-model="roleForm.roleName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="角色描述：" prop="description">
          <el-input v-model="roleForm.description" size="small"></el-input>
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
      activeNames: ["1"],
      dialogLoading:false,
      roleForm: {
        id:null,
        roleName: null,
        description: null
      },
      postValue:{},
      ruleInline: {
        roleName: [
          { required: true, message: "角色名不能为空", trigger: "blur" },
          {
            type: "string",
            min: 4,
            message: "角色名长度不能小于4位",
            trigger: "blur"
          }
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
      this.$refs["roleForm"].resetFields();
      this.$emit("addRole", false);
    },
    handleSave() {
      let self = this;
       this.$refs["roleForm"].validate(valid => {
          if (valid) {
            console.log(valid);
            self.dialogLoading = true;
            this.postValue = {
                actionids: "1",
                deptids: "1",
                enabled:0,
                description:this.roleForm.description,
                menuids: "1",
                roleName: this.roleForm.roleName,
                id:this.roleForm.id,
                userId:1
            }

            let postUrl = '/role/add';
            if(this.roleForm.id){
              postUrl = '/role/edit';
            }
          this.https.post(postUrl,this.postValue).then(res=>{
            console.log(res);
            self.dialogLoading = false;
            if(res.data.code == 0){
              self.$emit("addRole", { showModal: false, isReload: true });
            }else{
               self.$message({
                type:'error',
                message:res.data.message
              });
              self.$emit("addRole", {showModal:false});
            }
          }).catch(err => {
               console.log(err);
               self.$emit("addRole",{showModal:false});
              self.dialogLoading = false;
            });
          }else{
            return false;
          }
       });
    },
    // 查询表格数据
    queryDialogGridData() {},

    selectCloudMapFn() {
      this.selectCloudMap = true;
    },

    selectCloudMapCallBack(v) {
      this.selectCloudMap = v;
    },


  },

  watch: {
   
      showModal(v) {
      
      if (!v) {
        this.roleForm = {
          id:null,
          roleName: null,
          description: null
        };
      }

    },
    rowData(v) {
      // console.log(v);
      if (v.id) {
        this.roleForm = v;
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
 
  /* .el-form{
    display: flex;
    justify-content: inherit;
    align-items: center;
    flex-wrap: wrap;
  } */
  .el-form-item{
    width: 95%;
  }

</style>
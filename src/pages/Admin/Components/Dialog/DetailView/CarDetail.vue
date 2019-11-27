<template>
  <div>
    <h3>车辆信息</h3>
     
    <el-form ref="enterpriseForm" :model="enterpriseForm" label-position="top" class="enterpriseForm">
      <el-form-item label="车主名称：" prop="Account">
        <el-input v-model="enterpriseForm.Account" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
      <el-form-item label="车辆编号：" prop="Name">
        <el-input v-model="enterpriseForm.Name" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
      <el-form-item label="车辆载重：" prop="Account">
        <el-input v-model="enterpriseForm.Account" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
      <el-form-item label="归属公司：" prop="Name">
        <el-input v-model="enterpriseForm.Name" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
     <el-form-item label="车主名称：" prop="Account">
        <el-input v-model="enterpriseForm.Account" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
      <el-form-item label="车辆编号：" prop="Name">
        <el-input v-model="enterpriseForm.Name" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
      <el-form-item label="车辆载重：" prop="Account">
        <el-input v-model="enterpriseForm.Account" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
      <el-form-item label="归属公司：" prop="Name">
        <el-input v-model="enterpriseForm.Name" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
      <el-form-item label="车主名称：" prop="Account">
        <el-input v-model="enterpriseForm.Account" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
      <el-form-item label="车辆编号：" prop="Name">
        <el-input v-model="enterpriseForm.Name" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
      <el-form-item label="车辆载重：" prop="Account">
        <el-input v-model="enterpriseForm.Account" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
      <el-form-item label="归属公司：" prop="Name">
        <el-input v-model="enterpriseForm.Name" size="small" class="enterpriseMsg"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      enterpriseForm: {
        Account: "冯浩",
        Name: "鄂A12345",
        Depart: "鑫运机械",
        Sex: null,
        Email: null,
        Phone: "1333333333"
      }
    };
  }
};
</script>

<style scoped>

     h3{
      margin-left: 3%;
      border-left: 3px solid #476de3;
      text-indent: 0.6em;
    }

    .el-form{
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }
 
    .el-form-item{
        margin:0  3%;
        width: 42%;
        margin-bottom: 10px;
        border-bottom: 1px dashed #bdbfc9;
    }
   
</style>


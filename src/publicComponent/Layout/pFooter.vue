<template>
  <div class="ex-footer">
    <div class="ex-footer-user">
      <el-popover
        placement="top"
        title="常用快捷菜单"
        width="300"
        trigger="click"
      >
        <el-row class="popMenu">
          <el-col :span="4" v-for="(o,i) in 8" :key="o" :offset="i !=0 && i !=4 ? 2 : 1" :class="i>3?'':'el-bottom'">
            <el-card :body-style="{ padding: '0px',background:'#545c64',color:'#fff' }">
              <el-button type="primary" class="image">icon</el-button>
            </el-card>
            <div>
                <span>快捷菜单</span>
            </div>
          </el-col>
        </el-row>
        <el-button type="primary" slot="reference" icon="el-icon-menu" circle></el-button>
      </el-popover>
      <span>快捷菜单</span>
    </div>
  </div>
</template>
<script>

export default {
  name: "pFooter",
  data() {
    return {
      
    };
  }
};
</script>
<style scoped>

  .el-card{
    border: 0 !important;
    height: 50px;
    width: 50px;
    
  }
  .el-bottom{
    margin-bottom:6%; 
  }
  .image {
    display: block;
    width: 50px;
    height: 50px;
    display: flex;   
    justify-content: center;
    align-items: center;
  }

  
</style>

<template>
    <div class="wrapper">
        <div class="ex-layout-content" v-bind:style="{ height: formHeight}">
            <el-form :model="registerForm" ref="registerForm" class="ex-user-info-form">

                <el-form-item class="ex-form-title">
                    <span class="ex-text-color-title ex-text-large">修改密码</span>
                </el-form-item>
                <el-form-item v-for="(item, key) in inputList" :prop="item.prop" :key="key">
                    <el-input
                            type="password"
                            :show-password="true"
                            autocomplete="off"
                            size="small"
                            :placeholder="item.text"
                            prefix-icon="el-icon-lock"
                            v-model="item.value">
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="info" @click="submitForm('registerForm')" style="width: 100%">确认</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "user-info-password",
        data() {
            return {
                inputList:[
                    {prop:'oldPassword',isShow: false, text:'请输入原密码', value: null},
                    {prop:'password',isShow: false, text:'请输入新密码', value: null},
                    {prop:'cPassword',isShow: false, text:'请确认密码', value: null}
                ],
                registerForm: {
                    oldPassword:'',
                    password: '',
                    cPassword: ''
                },
                registerRules: {
                    oldPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    cPassword:[
                        {
                            required:true,message:'确认密码',trigger:'blur'
                        },{
                            validator:(rule,value,callback)=>{
                                if(value===''){
                                    callback(new Error('请再次输入密码'))
                                }else if(value!==this.registerForm.password){
                                    callback(new Error('两次输入密码不一致'))
                                }else{
                                    callback( )
                                }
                            },
                            trigger:'blur'
                        }]
                },
                formHeight: ''

            };
        },
        mounted() {
            window.addEventListener('resize', this.getHeight);
            this.getHeight();
        },
        methods:{
            getHeight() {
                this.formHeight = window.innerHeight - 111 + 'px';
            },
            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$message({
                            type: 'info',
                            message: `提交成功!`
                        });
                        this.$refs[formName].resetFields();
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .wrapper{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .slider {
        width: 200px;
        height: 100%;
        color: #151515;
        background-color: #E9EDF3;
    }

    .main {
        width: calc(100% - 210px);
        height: 100%;
        background-color: #fff;
        margin-left: 10px;
        border-radius: 6px;
        border: 1px solid #fff;
    }

    .el-menu-item.is-active {
        color: #4a71d4;
        background-color: #fff;
        border-left: 2px solid #3C6DFE;
    }
</style>
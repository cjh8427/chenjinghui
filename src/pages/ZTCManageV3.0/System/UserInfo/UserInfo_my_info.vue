<template>
    <div class="wrapper">
        <div class="ex-layout-content" v-bind:style="{ height: formHeight}">
            <el-form :model="registerForm" ref="registerForm" class="ex-user-info-form">
                <el-form-item class="ex-form-avatar">
                    <!--<el-image :src="registerLogo" fit="contain"></el-image>-->
                    <div class="block">
                        <el-avatar :src="registerForm.circleUrl" fit="contain"></el-avatar>
                        <p>123123</p>
                        <!--<span>{{registerForm.userName}}</span>-->
                    </div>
                </el-form-item>

                <el-form-item class="ex-form-title">
                    <span class="ex-text-color-title">基本信息</span>
                </el-form-item>

                <el-form-item class="ex-form-second-content">
                    <el-row>
                        <el-col :span="4" class="ex-text-right"><span>企业法人</span></el-col>
                        <el-col :span="4">&nbsp;</el-col>
                        <el-col :span="16"><span>{{registerForm.entity}}</span></el-col>
                    </el-row>
                </el-form-item>

                <el-form-item class="ex-form-second-content">
                    <el-row>
                        <el-col :span="4" class="ex-text-right"><span>企业联系人</span></el-col>
                        <el-col :span="4">&nbsp;</el-col>
                        <el-col :span="16"><span>{{registerForm.contact}}</span></el-col>
                    </el-row>
                </el-form-item>

                <el-form-item class="ex-form-second-content">
                    <el-row>
                        <el-col :span="4" class="ex-text-right"><span>手机号</span></el-col>
                        <el-col :span="4">&nbsp;</el-col>
                        <el-col :span="16"><span>{{registerForm.phone}}</span><span class="ex-text-color-theme" style="margin-left: 20px;cursor: pointer" @click="changePhone" v-if="!isEdit">更换手机号</span></el-col>
                    </el-row>
                </el-form-item>

                <el-form-item class="ex-form-second-content" prop="imgUrl">
                    <el-row>
                        <el-col :span="4" class="ex-text-right"><span>营业执照</span></el-col>
                        <el-col :span="4">&nbsp;</el-col>
                        <el-col :span="16">
                            <el-image :src="registerForm.imgUrl" fit="contain"></el-image>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item class="ex-form-title">
                    <span class="ex-text-color-title">接入车辆数</span>
                </el-form-item>

                <el-form-item class="ex-form-second-content" prop="typeAndNumber">
                    <div v-for="(item, key) in registerForm.typeAndNumber" :key="key">
                        <el-row>
                            <el-col :span="4" class="ex-text-right"><span>{{item.label}}</span></el-col>
                            <el-col :span="4">&nbsp;</el-col>
                            <el-col :span="16"><el-input size="small" :disabled="isEdit" v-model="item.numberValue"></el-input></el-col>
                        </el-row>
                    </div>
                </el-form-item>

                <el-form-item class="ex-form-title" v-if="isEdit">
                    <span class="ex-text-color-title">状态</span>
                </el-form-item>

                <el-form-item class="ex-form-second-content" v-if="isEdit">
                    <el-col style="padding-left: 3rem;white-space: nowrap;color: #e09f2c"><span>{{registerForm.tips}}</span></el-col>
                </el-form-item>

                <el-form-item v-if="isEdit" style="text-align: center">
                    <el-col :span="24"><el-button type="info" @click="isEdit=false">编辑</el-button></el-col>

                </el-form-item>

                <el-form-item v-if="!isEdit" style="margin-top: 20px">
                    <el-row :gutter="20">
                        <el-col :span="12" style="text-align: right"><el-button type="info" @click="resetForm('registerForm')">取消</el-button></el-col>
                        <el-col :span="12"><el-button type="info" @click="submitForm('registerForm')">保存</el-button></el-col>
                    </el-row>
                </el-form-item>


            </el-form>
        </div>

    </div>
</template>

<script>
    import {tableDataMixin} from '~/pages/ZTCManageV3.0/System/Component/Common/TableMixin/mixin'
    export default {
        mixins: [tableDataMixin],
        name: "user-info-info",
        data() {
            return {
                isEdit: true,
                registerForm: {
                    circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
                    userName: '武汉依迅北斗',
                    entity: '武汉依迅北斗',
                    contact: '武汉依迅北斗',
                    imgUrl:'',
                    phone: '18888888888',
                    tips:'用户信息正在审核中，请稍后进行购买',
                    typeAndNumber: [
                        {label: '渣土车', typeValue: false, numberValue: null, disabled: true},
                        {label: '环卫车', typeValue: false, numberValue: null, disabled: true},
                        {label: '两客一危', typeValue: false, numberValue: null, disabled: true},
                        {label: '特种车', typeValue: false, numberValue: null, disabled: true}
                    ]
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
                        this.isEdit = true
                    }
                })
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
                this.isEdit = true
            },
            changePhone(){
                this.$router.push({path: '/system/UserInfo/phone'});
            },
        },
        watch:{
            // "$router":{
            //     handler(route){
            //         let _this = this
            //         debugger
            //         if(route.path==='/system/UserInfo'){
            //             _this.$router.push({path: '/system/UserInfo/myInfo'});
            //         }
            //     }
            // }
            $route: {
                handler: function(val, oldVal){
                    debugger
                    console.log(val);
                },
                // 深度观察监听
                deep: true
            }
        }
    }
</script>

<style scoped>
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
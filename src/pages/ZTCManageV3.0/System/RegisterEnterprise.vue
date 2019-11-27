<template>
    <div style="overflow: hidden">
        <el-row>
            <!--左侧轮播图-->
            <el-col :span="10">
                <carousel :carouselHeight="carouselHeight"></carousel>
            </el-col>

            <!--右侧 注册 表单-->
            <el-col :span="14">
                <div class="ex-login-form-container" v-bind:style="{ height: formHeight}">
                    <el-form :model="registerForm" :rules="registerRules" ref="registerForm" class="ex-register-form">
                        <el-form-item>
                            <el-image :src="registerLogo" fit="contain"></el-image>
                        </el-form-item>

                        <el-form-item class="ex-form-title">
                            <span class="ex-text-color-context">请如实填写相关信息:</span>
                        </el-form-item>
                        <el-form-item prop="userName">
                            <el-input
                                    size="small"
                                    placeholder="用户名"
                                    prefix-icon="el-icon-user-solid"
                                    v-model="registerForm.userName">
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="entity">
                            <el-input
                                    size="small"
                                    placeholder="企业法人"
                                    prefix-icon="el-icon-s-custom"
                                    v-model="registerForm.entity">
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="contact">
                            <el-input
                                    size="small"
                                    placeholder="企业联系人"
                                    prefix-icon="el-icon-notebook-2"
                                    v-model="registerForm.contact">
                            </el-input>
                        </el-form-item>
                        <el-form-item class="ex-form-title">
                            <span class="ex-text-color-context">请上传营业执照:</span>
                        </el-form-item>
                        <el-form-item>
                            <el-upload action="#" list-type="picture-card" :auto-upload="false">
                                <i slot="default" class="el-icon-plus"></i>
                                <div slot="file" slot-scope="{file}">
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                                    <span class="el-upload-list__item-actions">
                                    <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
                                      <i class="el-icon-delete"></i>
                                    </span>
                                  </span>
                                </div>
                            </el-upload>
                        </el-form-item>

                        <el-form-item class="ex-form-title">
                            <span class="ex-text-color-context">请验证手机号:</span>
                        </el-form-item>
                        <el-form-item prop="phone">
                            <el-input
                                    size="small"
                                    placeholder="请输入验证的手机号"
                                    prefix-icon="el-icon-mobile-phone"
                                    v-model="registerForm.phone">
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="code">
                            <el-input size="small" placeholder="请输入验证码" v-model="registerForm.code" prefix-icon="el-icon-chat-line-square">
                                <el-button slot="append" v-if="disabledBtn==false" @click="sendcode">获取验证码</el-button>
                                <el-button slot="append" :disabled="disabledBtn" v-if="disabledBtn==true">{{countdownText}}</el-button>
                            </el-input>
                        </el-form-item>

                        <el-form-item class="ex-form-title">
                            <span class="ex-text-color-context">请设置密码:(最小长度为8个字符):</span>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                    size="small"
                                    placeholder="请输入密码"
                                    prefix-icon="el-icon-lock"
                                    v-model="registerForm.password">
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="cPassword">
                            <el-input
                                    size="small"
                                    placeholder="请确认密码"
                                    prefix-icon="el-icon-lock"
                                    v-model="registerForm.cPassword">
                            </el-input>
                        </el-form-item>

                        <el-form-item class="ex-form-title">
                            <span class="ex-text-color-context">请选择需要接入的车辆类型及数量(选三种):</span>
                        </el-form-item>
                        <el-form-item>
                            <div v-for="(item, key) in registerForm.typeAndNumber" :key="key">
                                <el-col :span="7">
                                    <el-checkbox :label="item.label" v-model="item.typeValue" name="type" @change="changeType(item, key)"></el-checkbox>
                                </el-col>
                                <el-col :span="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </el-col>
                                <el-col :span="14">
                                    <el-input size="small" v-model="item.numberValue" :disabled="!item.typeValue"></el-input>
                                </el-col>
                            </div>
                        </el-form-item>

                        <el-form-item prop="agreement" class="agreement">
                            <span><el-checkbox v-model="registerForm.agreement"></el-checkbox>
                            我已阅读<el-link type="info":underline="false">《协议XXX一》</el-link>和<el-link type="info":underline="false">《协议XXX二》</el-link></span>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="info" @click="submitForm('registerForm')" style="width: 100%">注册</el-button>
                        </el-form-item>
                        <el-form-item class="go-to-regiter">
                            <span @click="loginFunc">已有账号，立即登录</span>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>

        </el-row>
    </div>
</template>

<script>
    import carousel from './Component/Carousel'

    export default {
        name: "register-enterprise",
        components: {carousel},
        data() {
            return {
                isRegister: false,
                registerForm: {
                    userName: '',
                    entity: '',
                    contact: '',
                    imgUrl:[],
                    phone: '',
                    code: '',
                    password: '',
                    cPassword: '',
                    agreement:false,
                    typeAndNumber: [
                        {label: '渣土车', typeValue: false, numberValue: null, disabled: true},
                        {label: '环卫车', typeValue: false, numberValue: null, disabled: true},
                        {label: '两客一危', typeValue: false, numberValue: null, disabled: true},
                        {label: '特种车', typeValue: false, numberValue: null, disabled: true}
                    ]
                },
                registerRules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
                    ],
                    entity: [
                        {required: true, message: '请输入企业法人', trigger: 'blur'}
                    ],
                    contact: [
                        {required: true, message: '请输入企业联系人', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
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
                carouselHeight: '',
                formHeight: '',
                registerLogo: require('../common/stastic/img/ex_default/register_logo.png'),
                disabled: false,
                countdownText: '重新发送',
                disabledBtn: false,
                countdown: 0,

            };
        },
        mounted() {
            window.addEventListener('resize', this.getHeight);
            this.getHeight();
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                return false;
                    }
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 改变轮播高度
            getHeight() {
                this.carouselHeight = window.innerHeight - 30 + 'px';
                this.formHeight = window.innerHeight + 'px';
            },
            // 登录
            loginFunc: function () {
                this.$router.push({ path: "/login/Enterprise" });
            },

            // 移除图片
            handleRemove(file) {
                console.log(file);
            },

            changeType(v, k){

            },

            //手机验证发送验证码
            sendcode() {
                const reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
                if (this.registerForm.phone == '') {
                    this.$message({
                        message:'手机号不能为空',
                        center: true
                    })
                    return
                }
                if (!reg.test(this.registerForm.phone)) {
                    this.$message({
                        message:'请输入正确的手机号',
                        center:true
                    })
                    return
                } else {
                    this.$message({
                        message: '发送成功',
                        type: 'success',
                        center:true
                    });
                    this.countdown = 60;
                    this.disabledBtn = true;
                    this.timer();
                }
            },
            //60S倒计时
            timer() {
                if (this.countdown > 0) {
                    this.countdown--;
                    this.countdownText = this.countdown + "s后重新获取";
                    setTimeout(this.timer, 1000);
                } else {
                    this.countdown = 0;
                    this.countdownText = "获取验证码";
                    this.disabledBtn = false;
                }
            }

        },
        watch: {}
    }
</script>

<style scoped>

</style>
<template>
    <div class="wrapper">
        <div class="platformHolder">
            <el-button @click="goBack" size="mini" type="info" style="margin: 20px 30px;">返回</el-button>
        </div>
        <ul class="platformDetial">
            <li class="platformDetialItem">
                <div class="itemTxt">设备版本</div>
                <div class="itemContent">
                    <div :class="platObj.class" ><span>{{platObj.name}}</span></div>
                </div>
            </li>
            <li class="platformDetialItem">
                <div class="itemTxt">包含设备</div>
                <div class="itemContent deviceItemWrapper">

                    <div class="deviceItem" v-for="(item,index) in deviceList" :key="index">
                        <span class="icon"><i :class="item.icon" ></i></span>
                        <span class="text">{{item.name}}</span>
                    </div>

                </div>
            </li>


            <li class="platformDetialItem" v-show="isDeviceMjShow">
                <div class="itemTxt">附加门禁设备</div>
                <div class="itemContent deviceItemWrapper">
                    <div class="deviceItem" v-for="(item,index) in deviceList_menjin" :key="index">
                        <span class="icon"><i :class="item.icon" ></i></span>
                        <span class="text">{{item.name}}</span>
                    </div>

                </div>
            </li>


            <li class="platformDetialItem" v-show="isDeviceYcShow">
                <div class="itemTxt">附加扬尘噪音有害气体设备</div>
                <div class="itemContent deviceItemWrapper">

                    <div class="deviceItem" v-for="(item,index) in deviceList_yangchen" :key="index">
                        <span class="icon"><i :class="item.icon" ></i></span>
                        <span class="text">{{item.name}}</span>
                    </div>

                </div>
            </li>

            <li class="platformDetialItem">
                <div class="itemTxt">选择计算服务</div>
                <div class="itemContent">
                    <!--报警统计-->
                    <div class="serviceItem" v-show="isShow">
                        <el-checkbox :indeterminate="isIndeterminate" class="checkAllTitle" v-model="checkAll" @change="handleCheckAllChange">报警统计</el-checkbox>
                        <el-checkbox-group v-model="checkedServices" @change="handleCheckedServicesChange">
                            <el-checkbox  v-for="(item,index) in serviceList" :label="item" :key="index">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!--运营统计-->
                    <div class="serviceItem"  v-show="isShow_yunyin">
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox :indeterminate="isIndeterminate_yunying" class="checkAllTitle" v-model="checkAll_yunying" @change="handleCheckAllChange_yunying">运营统计</el-checkbox>
                        <el-checkbox-group v-model="checkedServices_yunying" @change="handleCheckedServicesChange_yunying">
                            <el-checkbox v-for="(item,index) in serviceList_yunying" :label="item" :key="index">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!--服务-->
                    <div class="serviceItem" v-show="isShow_service">
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox :indeterminate="isIndeterminate_service" class="checkAllTitle" v-model="checkAll_service" @change="handleCheckAllChange_service">服务</el-checkbox>
                        <el-checkbox-group v-model="checkedServices_service" @change="handleCheckedServicesChange_service">
                            <el-checkbox v-for="(item,index) in serviceList_service" :label="item" :key="index">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!--其他-->
                    <div class="serviceItem" v-show="isShow_others">
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox :indeterminate="isIndeterminate_others" class="checkAllTitle" v-model="checkAll_others" @change="handleCheckAllChange_others">其他</el-checkbox>
                        <el-checkbox-group v-model="checkedServices_others" @change="handleCheckedServicesChange_others">
                            <el-checkbox v-for="(item,index) in serviceList_others" :label="item" :key="index">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!--门禁-->
                    <div class="serviceItem" v-show="isShow_menjin">
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox :indeterminate="isIndeterminate_menjin" class="checkAllTitle" v-model="checkAll_menjin" @change="handleCheckAllChange_menjin">附件门禁计算服务</el-checkbox>
                        <el-checkbox-group v-model="checkedServices_menjin" @change="handleCheckedServicesChange_menjin">
                            <el-checkbox v-for="(item,index) in serviceList_menjin" :label="item" :key="index">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                    <!--扬尘噪音有害气体-->
                    <div class="serviceItem" v-show="isShow_yangchen">
                        <div style="margin: 15px 0;"></div>
                        <el-checkbox :indeterminate="isIndeterminate_yangchen" class="checkAllTitle" v-model="checkAll_yangchen" @change="handleCheckAllChange_yangchen">附加扬尘噪音有害气体统计</el-checkbox>
                        <el-checkbox-group v-model="checkedServices_yangchen" @change="handleCheckedServicesChange_yangchen">
                            <el-checkbox v-for="(item,index) in serviceList_yangchen" :label="item" :key="index">{{item}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </li>
            <li class="platformDetialItem">
                <div class="itemTxt">接入车辆及数量</div>
                <div class="itemContent">
                    <el-form :model="ruleForm" ref="ruleForm" label-width="60px" label-position="left"
                             class="demo-ruleForm">
                        <el-form-item prop="region">
                            <span>{{ruleForm.name+','}}接入:{{ruleForm.count}}辆</span>
                        </el-form-item>
                    </el-form>
                </div>
            </li>
            <li class="platformDetialItem">
                <div class="itemTxt">收货人信息</div>
                <div class="itemContent" >
                    <el-form  label-width="100px" :model="receiveForm">
                        <el-form-item label="收货人">
                            <span>{{receiveForm.name}}</span>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <span>{{receiveForm.phone}}</span>
                        </el-form-item>
                    </el-form>
                </div>
            </li>
            <li class="platformDetialItem">
                <div class="itemTxt">收货地址</div>
                <div class="itemContent">
                    <div class="receiverAddressWrapper">
                      <el-tag class="receiverAddress" :key="tag" v-for="tag in dynamicTags"  :disable-transitions="false" @close="handleClose(tag)">
                         <ul>
                             <li><span>姓名</span> <span>111</span></li>
                             <li><span>收货人</span> <span>111</span></li>
                             <li><span>联系电话</span> <span>111</span></li>
                             <li><span>所在地区</span> <span>111</span></li>
                             <li><span>详细地址</span> <span>111</span></li>
                         </ul>
                      </el-tag>
                    </div>
                </div>
            </li>
            <li class="platformDetialItem">
                <div class="itemTxt">创建时间</div>
                <div class="itemContent" >
                    <span>2019-08-08</span>
                </div>
            </li>
            <li class="platformDetialItem" style="margin-bottom: 20px;">
                <div class="itemTxt">订单状态</div>
                <div class="itemContent" >
                    <span>已下单</span>
                </div>
            </li>
        </ul>
        <div class="platformPrice">
            <div class="priceContainer">
                <ul>
                    <li class="priceTitle">{{platformPrice.priceTitle}}</li>
                    <li class="price"><span>{{platformPrice.price}}</span>元/年</li>
                    <li class="priceIntroduce">介绍</li>
                    <li class="priceIntroducetext">{{platformPrice.priceIntroducetext}}</li>
                </ul>
            </div>
        </div>
    </div>


</template>

<script>
    export default {
        name: "myCenterPlatform",
        data() {
            return {

                platObj:{},
                platType:this.$route.query.versionsId,
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                value: '',
                ruleForm: {
                    name: '渣土车',
                    count: '100',
                },
                radio: '1',


                platList:[
                    {name:'基础版',
                        id:'base',
                        deviceList:[
                            {name:'4G部标机',value:1,icon:'el-icon-s-platform'},
                            {name:'4G视频',value:2, icon:'el-icon-video-play'}
                        ],
                        class:'ex-icon ex-icon-buy-platform-noSelect',
                        platformPrice:{
                            priceTitle:'基础版设备',
                            price:'000',
                            priceIntroducetext:'基础平台介绍,基础平台介绍,基础平台介绍,基础平台介绍,基础平台介绍,基础平台介绍,基础平台介绍,基础平台介绍'
                        }
                    },
                    {name:'企业版',
                        id:'company',
                        deviceList:[
                            {name:'4G部标机',value:1,icon:'el-icon-s-platform'},
                            {name:'4G视频',value:2, icon:'el-icon-video-play'},
                            {name:'载重传感器',value:3, icon:'el-icon-set-up'},
                            {name:'顶灯',value:4, icon:'el-icon-sunrise'},
                        ],
                        class:'ex-icon ex-icon-buy-platform-noSelect',
                        platformPrice:{
                            priceTitle:'企业版设备',
                            price:'111',
                            priceIntroducetext:'企业平台介绍,企业平台介绍,企业平台介绍,企业平台介绍,企业平台介绍,企业平台介绍,企业平台介绍,'
                        }
                    },
                    {name:'旗舰版',
                        id:'flagship',
                        deviceList:[
                            {name:'4G部标机',value:1,icon:'el-icon-s-platform'},
                            {name:'4G视频',value:2, icon:'el-icon-video-play'},
                            {name:'载重传感器',value:3, icon:'el-icon-set-up'},
                            {name:'顶灯',value:4, icon:'el-icon-sunrise'},
                            {name:'密闭传感器',value:5,icon:'el-icon-c-scale-to-original'},
                            {name:'ECU举升传感器',value:6, icon:'el-icon-ice-cream-square'},
                            {name:'ECU限速',value:7, icon:'el-icon-odometer'},
                            {name:'身份认证',value:8, icon:'el-icon-s-custom'},
                            {name:'Dms',value:9, icon:'el-icon-video-camera-solid'},
                            {name:'Adas',value:10, icon:'el-icon-collection'},
                        ],
                        class:'ex-icon ex-icon-buy-platform-noSelect',
                        platformPrice:{
                            priceTitle:'旗舰版设备',
                            price:'222',
                            priceIntroducetext:'旗舰平台介绍,旗舰平台介绍,旗舰平台介绍,旗舰平台介绍,旗舰平台介绍,旗舰平台介绍,旗舰平台介绍,'
                        }
                    }],

                receiveForm:{
                    name:'zhangsan',
                    phone:'13000000000000'
                },
                dynamicTags: ['标签一'],
                inputVisible: false,
                inputValue: '',



                isDeviceMjShow:false,
                isDeviceYcShow:false,
                deviceList_menjin:[
                    {name:'智能工控机',value:1,icon:'el-icon-s-cooperation'},
                    {name:'门禁',value:2, icon:'el-icon-smoking'},],
                deviceList_yangchen:[
                    {name:'扬尘噪音',value:1, icon:'el-icon-bell'},
                    {name:'有害气体',value:2, icon:'el-icon-picture-outline-round'},
                ],
                deviceList:[],
                /*报警统计*/
                isShow:true,
                checkAll: false,
                checkedServices: [],
                serviceList: ['紧急报警', '超速报警', '疲劳驾驶', '车辆被盗'],
                isIndeterminate: true,
                /*运营统计*/
                isShow_yunyin:false,
                checkAll_yunying: false,
                checkedServices_yunying: [],
                serviceList_yunying: ['里程计算', '趟次计算', '车辆在线率'],
                isIndeterminate_yunying: true,
                /*服务*/
                isShow_service:false,
                checkAll_service: false,
                checkedServices_service: [],
                serviceList_service: ['停留点计算', '趟次计算', '语音播报','语音播报','GPS存储','GPS纠偏','车流量统计'],
                isIndeterminate_service: true,
                /*其他*/
                isShow_others:false,
                checkAll_others: false,
                checkedServices_others: [],
                serviceList_others: ['未密闭告警', '超载告警', '线路偏移告警', '(平台)超速报警','非法停车'],
                isIndeterminate_others: true,
                /*附加门禁计算服务*/
                isShow_menjin:false,
                checkAll_menjin: false,
                checkedServices_menjin: [],
                serviceList_menjin: ['门禁规则同步', '非法运输预警', '案件推送(案件执法)', '黑车预警','车辆清洗预警'],
                isIndeterminate_menjin: true,

                /*附加扬尘有害气体服务*/
                isShow_yangchen:false,
                checkAll_yangchen: false,
                checkedServices_yangchen: [],
                serviceList_yangchen: ['扬尘噪音存储', '有害气体存储'],
                isIndeterminate_yangchen: true,

                // 弹框
                dialogFormVisible:false,
                addressForm:{
                    name:'',
                    region:''
                },
                platformPrice:{}
            }
        },
        mounted(){
            this.changeColor(this.platType)
        },
        methods: {
            changeColor(id,index){
                let _this = this
                this.platList.map((item)=>{
                    if(id===item.id){
                        item.class= `ex-icon ex-icon-buy-platform-${item.id}`
                        _this.platObj = item
                        _this.deviceList = item.deviceList
                        _this.platformPrice = item.platformPrice
                    } else {
                        item.class= `ex-icon ex-icon-buy-platform-noSelect`
                    }
                })
                switch (id) {
                    case 'base':
                        _this.isShow_yunyin = true
                        _this.isShow_service = false
                        _this.isShow_others = false
                        _this.isShow_menjin = false
                        _this.isShow_yangchen = false
                        break;
                    case 'company':
                        _this.isShow_service = true
                        _this.isShow_others = true
                        _this.isShow_menjin = true
                        _this.isShow_yangchen = false
                        _this.isShow_yunyin=false
                        _this.isDeviceMjShow=true
                        _this.isDeviceYcShow=false

                        break;
                    case 'flagship':
                        _this.isShow_service = true
                        _this.isShow_others = true
                        _this.isShow_menjin = true
                        _this.isShow_yangchen = true
                        _this.isShow_yunyin=false
                        _this.isDeviceMjShow=true
                        _this.isDeviceYcShow=true
                        break;

                }
            },


            handleAdd(){
                this.dialogFormVisible = true
            },
            handleClose(tag) {
                this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
            },
            submitAddressForm(){
                this.dialogFormVisible = false
                this.dynamicTags.push(1)
            },

            placeOrder(){
                this.$confirm('稍后客服会根据您提交的联系方式与您进行沟通,请保持电话通畅 谢谢!', '提示', {
                    confirmButtonText: '继续购买',
                    cancelButtonText: '订单详情',
                    type: 'success'
                }).then(() => {
                    console.log('继续购买')
                }).catch(() => {
                    console.log('订单详情')
                });
            },
            saveOrder(){
                this.$confirm('稍后客服会根据您提交的联系方式与您进行沟通,请保持电话通畅 谢谢!', '提示', {
                    confirmButtonText: '继续购买',
                    cancelButtonText: '订单详情',
                    type: 'success'
                }).then(() => {
                    console.log('继续购买')
                }).catch(() => {
                    console.log('订单详情')
                });
            },




            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.dynamicTags.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            },
            // 勾选计算服务
            handleCheckAllChange(val) {
                this.checkedServices = val ? this.serviceList : [];
                this.isIndeterminate = false;
            },
            handleCheckedServicesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.serviceList.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.serviceList.length;
            },
            // 勾选计算服务--运营
            handleCheckAllChange_yunying(val) {
                this.checkedServices_yunying = val ? this.serviceList_yunying : [];
                this.isIndeterminate_yunying = false;
            },
            handleCheckedServicesChange_yunying(value) {
                let checkedCount = value.length;
                this.checkAll_yunying = checkedCount === this.serviceList_yunying.length;
                this.isIndeterminate_yunying = checkedCount > 0 && checkedCount < this.serviceList_yunying.length;
            },
            // 勾选计算服务--服务
            handleCheckAllChange_service(val) {
                this.checkedServices_service = val ? this.serviceList_service : [];
                this.isIndeterminate_service = false;
            },
            handleCheckedServicesChange_service(value) {
                let checkedCount = value.length;
                this.checkAll_service = checkedCount === this.serviceList_service.length;
                this.isIndeterminate_service = checkedCount > 0 && checkedCount < this.serviceList_service.length;
            },
            // 勾选计算服务--其他
            handleCheckAllChange_others(val) {
                this.checkedServices_others= val ? this.serviceList_others : [];
                this.isIndeterminate_others = false;
            },
            handleCheckedServicesChange_others(value) {
                let checkedCount = value.length;
                this.checkAll_others = checkedCount === this.serviceList_others.length;
                this.isIndeterminate_others = checkedCount > 0 && checkedCount < this.serviceList_others.length;
            },
            // 勾选计算服务--门禁
            handleCheckAllChange_menjin(val) {
                this.checkedServices_menjin = val ? this.serviceList_menjin : [];
                this.isIndeterminate_menjin = false;
            },
            handleCheckedServicesChange_menjin(value) {
                let checkedCount = value.length;
                this.checkAll_menjin = checkedCount === this.serviceList_menjin.length;
                this.isIndeterminate_menjin = checkedCount > 0 && checkedCount < this.serviceList_menjin.length;
            },

            // 勾选计算服务--扬尘噪音
            handleCheckAllChange_yangchen (val) {
                this.checkedServices_yangchen = val ? this.serviceList_yangchen : [];
                this.isIndeterminate_yangchen  = false;
            },
            handleCheckedServicesChange_yangchen (value) {
                let checkedCount = value.length;
                this.checkAll_yangchen  = checkedCount === this.serviceList_yangchen .length;
                this.isIndeterminate_yangchen  = checkedCount > 0 && checkedCount < this.serviceList_yangchen .length;
            },
            goBack(){
                this.$router.go(-1)
            }
        }
    }
</script>

<style scoped lang="scss">
    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        background-color: #fff;
        flex-direction: row;
        justify-content: center;
        overflow-y: auto;

        .platformDetial {
            flex: 3;

            .platformDetialItem {
                display: flex;
                flex-direction: column;

                .itemTxt {
                    font-size: 13px;
                    color: #77808E;
                    font-weight: bold;
                    padding: 20px 0;
                }

                .itemContent {
                    padding-left: 20px;
                    font-size: 14px;

                    ul li {
                        list-style-type: none
                    }

                    ul li i {
                        color: #3C6DFE;
                        margin-right: 10px;
                        font-weight: bold;
                    }

                    .ex-icon {
                        text-align: center;
                        line-height: 46px;
                        margin-left: 30px;
                        cursor: pointer;
                        span {
                            color: #fff;
                            margin-left: 34px
                        }

                    }
                    .receiverAddressWrapper{
                        display:flex;
                        flex-direction: column;
                        width: 100%;
                        .receiverAddress{
                            height: 150px;
                            border: 1px solid #ccc;
                            display: inline-block;
                            margin-bottom: 10px;
                            position: relative;
                            background-color: #fff;
                            color: #656161;
                            ul{
                                li{
                                    list-style: none;
                                    span:first-child{
                                        text-align: right;
                                    }
                                }
                            }
                            .addressHandle{
                                position: absolute;
                                bottom: 5px;
                                right: 5px;
                            }

                        }
                    }


                }
            }
        }

        .platformPrice {
            flex: 1;

            .priceContainer {
                width: 170px;
                height: 230px;
                border-radius: 5px;
                box-shadow: 2px 2px 10px 5px #edf1fb;
                position: relative;
                top: 100px;

                ul {
                    margin: 0;
                    padding: 10px;
                }

                ul li {
                    list-style: none;
                }

                .priceTitle {
                    font-size: 14px;
                    color: #737373;
                    font-weight: bold;
                }

                .price {
                    span {
                        font-size: 18px;
                        color: #FE8E43;
                        font-weight: bold;
                    }

                    font-size: 12px;
                    color: #ABB0B8;
                    padding-top: 5px;
                    padding-bottom: 32px;
                }

                .priceIntroduce {
                    font-size: 14px;
                    color: #737373;
                    font-weight: bold;
                }

                .priceIntroducetext {
                    font-size: 12px;
                    color: #ABB0B8;
                }

            }
        }

        .platformHolder {
            flex: 1;
        }
        .saveBtn{
            width: 70%;
            text-align: right;
            padding-top: 10px;
            padding-bottom: 15px;
        }
    }

    .el-tag + .el-tag {
        margin-left: 0;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }

    .wrapper /deep/ .el-tag .el-icon-close {
        border-radius: 50%;
        text-align: center;
        position: absolute;
        cursor: pointer;
        font-size: 16px;
        height: 16px;
        width: 16px;
        line-height: 16px;
        vertical-align: middle;
        top: 6px;
        right: 6px;
        color: #909399;
    }
    .checkAllTitle{
        color: #909399;
        margin-left: -24px;
        font-size: 14px!important;
    }
    .wrapper /deep/ .el-checkbox__label {
        display: inline-block;
        padding-left: 10px;
        line-height: 19px;
        font-size: 12px;
    }
    .wrapper /deep/ .el-checkbox{
        width: 128px;
    }
    .deviceItemWrapper{

        width: 70%;
    }
    .deviceItem{
        display: inline-block;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        width: 90px;
        height: 50px;
        border-radius: 5px;
        background-color: #F5F5FB;
        color:#A7ABB5;
        margin-right: 10px;
        margin-bottom: 10px;
        .icon{
            display: inline-block;
          font-size: 18px;
            width: 100%;
            height: 55%;
            i{
                margin-top: 7px;
            }
        }
        .text{
            display: inline-block;
            font-size: 12px;
            width: 100%;
            height: 45%;
        }
    }
    .serviceItem{
        width: 70%;
    }
    .wrapper /deep/ .el-checkbox__inner{
        display: none;
    }
</style>
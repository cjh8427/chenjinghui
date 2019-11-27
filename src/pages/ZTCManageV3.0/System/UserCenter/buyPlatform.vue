<template>
    <div class="wrapper">
        <div class="platformHolder"></div>
        <ul class="platformDetial">
            <li class="platformDetialItem">
                <div class="itemTxt">平台版本</div>
                <div class="itemContent">
                    <div v-for="(item,index) in platList" :key="index" :class="item.class" @click="changeColor(item.id,index)"><span>{{item.name}}</span></div>
                </div>
            </li>
            <li class="platformDetialItem">
                <div class="itemTxt">介绍</div>
                <div class="itemContent">
                    <ul>
                        <li style="font-size: 12px;color:#656060;padding:5px 0" :key="index" v-for="(item,index) in introduceList"><i class="el-icon-check"></i>{{item.name}}</li>
                    </ul>
                </div>
            </li>
            <li class="platformDetialItem">
                <div class="itemTxt">功能菜单</div>
                <div class="itemContent">
                    <el-tag style="margin-left: 10px;" v-for="(item,index) in menuList" :key="index">{{item.name}}</el-tag>
                </div>
            </li>
            <li class="platformDetialItem">
                <div class="itemTxt">接入车辆及数量</div>
                <div class="itemContent">
                    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" label-position="left"
                             class="demo-ruleForm">
                        <el-form-item prop="region">
                            <el-radio v-model="radio" label="1" style="width: 100px;">渣土车</el-radio>
                            <el-select v-model="ruleForm.region" placeholder="请选择数量">
                                <el-option label="100" value="shanghai"></el-option>
                                <el-option label="200" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="" prop="region">
                            <el-radio v-model="radio" label="2" style="width: 100px;">环卫车</el-radio>
                            <el-select v-model="ruleForm.region" placeholder="请选择数量">
                                <el-option label="100" value="shanghai"></el-option>
                                <el-option label="200" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" prop="region">
                            <el-radio v-model="radio" label="3" style="width: 100px;">两客一危</el-radio>
                            <el-select v-model="ruleForm.region" placeholder="请选择数量">
                                <el-option label="100" value="shanghai"></el-option>
                                <el-option label="200" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="" prop="region">
                            <el-radio v-model="radio" label="4" style="width: 100px;">特种车1</el-radio>
                            <el-select v-model="ruleForm.region" placeholder="请选择数量">
                                <el-option label="100" value="shanghai"></el-option>
                                <el-option label="200" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </li>
            <li class="platformDetialItem">
                <div class="itemTxt">使用时间 <span style="color:#ccc">(最低购买时间为一年)</span></div>
                <div class="itemContent" >
                    <el-slider
                            style="width: 70%"
                            v-model="timeVal"
                            :step="1"
                            show-stops
                            :max="5"
                            :min="1"
                            :format-tooltip="formatTooltip"
                    >
                    </el-slider>
                </div>
            </li>
            <li class="platformDetialItem">
                <div class="saveBtn">
                    <el-button  size="small"@click="saveOrder">保存后下单</el-button>
                    <el-button type="info" size="small" @click="placeOrder">下单</el-button>
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
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                radio: '1',
                timeVal: [],
                marks: {
                    1: '1年',
                    2: '2年',
                    3: '3年',
                    4: '4年',
                    5: '5年',
                },
                introduceList:[],
                menuList:[],
                platformPrice:{},
                platList:[
                    {name:'基础版',
                        id:'base',
                        introduceList: [
                            {name:'定位,视频',value:1},
                            {name:'载重',value:1},
                            {name:'超速报警',value:1}
                            ],
                        menuList:[
                            {name:'一级菜单1',value:1},
                            {name:'一级菜单1',value:2},
                            {name:'一级菜单1',value:3},
                            {name:'一级菜单1',value:4},
                            {name:'一级菜单1',value:5},
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
                        introduceList: [
                            {name:'定位,视频',value:1},
                            {name:'载重,顶灯',value:1},
                            {name:'超速报警,违规报警',value:1}
                        ],
                        menuList:[
                            {name:'一级菜单2',value:1},
                            {name:'一级菜单2',value:2},
                            {name:'一级菜单2',value:3},
                            {name:'一级菜单2',value:4},
                            {name:'一级菜单2',value:5},
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
                        introduceList: [
                            {name:'定位,视频',value:1},
                            {name:'载重,密闭,顶灯,指纹,内外屏',value:1},
                            {name:'超速报警,违规报警,天线报警',value:1}
                        ],
                        menuList:[
                            {name:'一级菜单3',value:1},
                            {name:'一级菜单3',value:2},
                            {name:'一级菜单3',value:3},
                            {name:'一级菜单3',value:4},
                            {name:'一级菜单3',value:5},
                        ],
                        class:'ex-icon ex-icon-buy-platform-noSelect',
                        platformPrice:{
                            priceTitle:'旗舰版设备',
                            price:'222',
                            priceIntroducetext:'旗舰平台介绍,旗舰平台介绍,旗舰平台介绍,旗舰平台介绍,旗舰平台介绍,旗舰平台介绍,旗舰平台介绍,'
                        }
                    }],
            }
        },
        mounted(){
            this.changeColor('base')
        },
        methods: {
            formatTooltip(value) {
               return value + '年'
            },

            changeColor(id,index){
                let _this = this
                this.platList.map((item)=>{
                    if(id===item.id){
                        item.class= `ex-icon ex-icon-buy-platform-${item.id}`
                        _this.introduceList = item.introduceList
                        _this.menuList = item.menuList
                        _this.platformPrice = item.platformPrice
                    } else {
                        item.class= `ex-icon ex-icon-buy-platform-noSelect`
                    }
                })

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
        }
    }


</style>
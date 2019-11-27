<template>
    <div class="wrapper" style="overflow-x: hidden;overflow-y: auto">
        <div class="ex-layout-content" v-bind:style="{ height: formHeight}">
        <div class="sys-search" style="padding: 20px 0 0 5px;">
            <div class="sys-search-formItem">
                <span class="ex-text-color-title ex-text-large">收货地址</span>
            </div>
            <div class="sys-search-formItem">
                <el-form :inline="true" align="right">
                    <el-form-item>
                        <el-button type="info" plain @click="addNewAddress" style="background-color: initial!important;">新增地址</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="orderTable">
            <el-card class="box-card" v-for="(item, key) in cardList" :key="key" v-bind:class="{ 'ex-active': item.isDefault}">
                <div slot="header" class="clearfix">
                    <span>{{item.name}}</span>
                    <i class="el-icon-close" style="float: right;cursor: pointer" @click="deleteAddress(item, key)"></i>
                </div>
                <div class="ex-address-container">
                    <el-row>
                        <el-col :span="16">
                            <el-form class="ex-user-info-form">
                                <el-form-item>
                                    <el-row :gutter="10">
                                        <el-col :span="5" class="ex-text-right"><span class="ex-text-color-context">收货人：</span></el-col>
                                        <el-col :span="16"><span>{{item.name}}</span></el-col>
                                    </el-row>
                                </el-form-item>

                                <el-form-item>
                                    <el-row :gutter="10">
                                        <el-col :span="5" class="ex-text-right"><span class="ex-text-color-context">联系电话：</span></el-col>
                                        <el-col :span="16"><span>{{item.phone}}</span></el-col>
                                    </el-row>
                                </el-form-item>

                                <el-form-item>
                                    <el-row :gutter="10">
                                        <el-col :span="5" class="ex-text-right"><span class="ex-text-color-context">所在地区：</span></el-col>
                                        <el-col :span="16"><span>{{item.area}}</span></el-col>
                                    </el-row>
                                </el-form-item>

                                <el-form-item>
                                    <el-row :gutter="10">
                                        <el-col :span="5" class="ex-text-right"><span class="ex-text-color-context">详细地址：</span></el-col>
                                        <el-col :span="16"><span>{{item.address}}</span></el-col>
                                    </el-row>
                                </el-form-item>
                            </el-form>
                        </el-col>
                        <el-col :span="8">
                            <div class="right-bottom-btn-group">
                                <el-button type="text" @click="setDefautAddress(item, key)" v-if="!item.isDefault">设为默认</el-button>
                                <el-button type="text" @click="editAddress(item, key)">修改</el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
        </div>

        <!--添加新地址-->
        <addNewAddress :showModal="showModal" :formData="formData" v-on:newAddressValue="newAddressValue"></addNewAddress>
        </div>
    </div>
</template>

<script>
    import addNewAddress from '../Component/Modal/AddNewAddress'
    export default {
        name: "myCenterPlatform",
        components:{addNewAddress},
        data() {
            return {
                showModal: false,
                formHeight: '',
                cardList:[
                    {name: 'Adonia', phone: 18989898989, area: '武汉市硚口区', address: '金南二路', isDefault: true},
                    {name: 'Bena', phone: 17777777777, area: '武汉市东西湖区', address: '新天大道491号', isDefault: false},
                    {name: 'Clementine', phone: 16666666666, area: '武汉市洪山区', address: '民族大道163号', isDefault: false},
                    {name: 'Cynthia', phone: 18777777777, area: '湖北铁道运输职业学院', address: '狮子山街钢狮咀1号 ', isDefault: false},
                    {name: 'Doris', phone: 19999999999, area: '武汉市东湖高新技术开发区南湖大道182号', address: '中南财经政法大学', isDefault: false},
                    {name: 'Faustine', phone: 13666666666, area: ' 湖北省武汉市江夏区', address: '中州社区观音岛', isDefault: false}
                ],
                formData:{}
            };
        },
        mounted() {
            window.addEventListener('resize', this.getHeight);
            this.getHeight();
        },
        methods: {
            getHeight() {
                this.formHeight = window.innerHeight - 111 + 'px';
            },
            addNewAddress(){
                this.showModal = true
            },
            newAddressValue(oData){
                this.showModal = oData
            },
            // 设为默认地址
            setDefautAddress(item, key){
                for(let i = 0; i<this.cardList.length; i++){
                    this.cardList[i].isDefault = false
                }
                this.cardList[key].isDefault = true
            },
            // 修改地址
            editAddress(item, key){
                this.showModal = true
                this.formData = item
            },
            // 删除地址
            deleteAddress(item, key){
                this.$message({
                    message: '暂时无法删除',
                    type: 'warning'
                });
            },
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
    .slider{
        width: 200px;
        height: 100%;
        color:#151515;
        background-color: #E9EDF3;
    }
    .main{
        width: calc(100% - 210px);
        height: 100%;
        background-color: #fff;
        margin-left: 10px;
        border-radius: 6px;
        border:1px solid #fff;
    }
    .el-menu-item.is-active {
        color: #4a71d4;
        background-color: #fff;
    }
    .sys-search{
        display: flex;
        flex-direction: row;
        padding: 20px;
    }
    .sys-search-formItem{
        flex: 1;
    }

    .orderTable{
        width: 100%;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding: 5px;
    }

</style>
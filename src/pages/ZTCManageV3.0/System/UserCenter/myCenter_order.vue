<template>
    <div class="wrapper">
        <div class="sys-search">
            <div class="sys-search-formItem">
                <el-form :model="searchBtn" :inline="true" ref="searchBtn" align="left">
                    <el-form-item prop="" label="筛选:" >
                        <el-button type="info" size="small">全部</el-button>
                        <el-button type="info" size="small">依迅平台</el-button>
                        <el-button type="info" size="small">自建平台</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="sys-search-formItem">
                <el-form :model="searchForm" :inline="true" ref="searchForm" align="right">
                    <el-form-item prop="" label="" >
                        <el-input v-model="searchForm.searchContent" placeholder="请输入搜索的内容" suffix-icon="el-icon-search" size="small"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <div class="orderTable" ref="orderTable" :style="{height:tableHeight}">
            <div v-for="(item,index) in tableData.body" class="orderTable-tr" :key="index">
                <div class="orderTitle">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="订单类型:">
                            <span>{{ item.orderType }}</span>
                        </el-form-item>
                        <el-form-item label="订单编号:">
                            <span>{{ item.orderNo  }}</span>
                        </el-form-item>
                        <el-form-item label="下单时间:">
                            <span>{{ item.orderTime }}</span>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="orderContent">
                    <el-table
                            :data="[item]"
                            style="width: 100%">
                        <el-table-column
                                prop="versions"
                                align="center"
                                label="平台版本">
                        </el-table-column>
                        <el-table-column
                                prop="deployType"
                                align="center"
                                label="部署方式">
                        </el-table-column>
                        <el-table-column
                                prop="vehType"
                                align="center"
                                label="接入车辆类型">
                        </el-table-column>
                        <el-table-column
                                prop="usage"
                                align="center"
                                label="使用期限">
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                align="center"
                                label="状态">
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <div class="sys-table-pagination">
            <el-pagination
                    background
                    class="center"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageNum"
                    :page-sizes=pageSizes
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: "myCenterPlatform",
        data() {
            return {
                pageNum: 1,
                pageSize: 10,
                pageSizes:[5,10,20],
                total: 0,
                tableHeight: window.innerHeight - 300,
                tableData: {
                    loading: true,
                    body:  [{
                        id: '12987122',
                        orderType:'购买平台',
                        orderTypeId:'1',
                        orderNo:'201900001',
                        orderTime:'2019-09-09',
                        versions: '基础版',
                        versionsId:'base',
                        deployType: '单独部署',
                        vehType: '渣土车',
                        usage: '5年',
                        status: '已下单',
                    },{
                        id: '12987122',
                        orderType:'购买平台',
                        orderTypeId:'1',
                        orderNo:'201900001',
                        orderTime:'2019-09-09',
                        versions: '企业版',
                        versionsId:'company',
                        deployType: '单独部署',
                        vehType: '渣土车',
                        usage: '5年',
                        status: '已下单',
                    },{
                        id: '12987122',
                        orderType:'购买平台',
                        orderTypeId:'1',
                        orderNo:'201900001',
                        orderTime:'2019-09-09',
                        versions: '旗舰版',
                        versionsId:'flagship',
                        deployType: '单独部署',
                        vehType: '渣土车',
                        usage: '5年',
                        status: '已下单',
                    },{
                        id: '12987123',
                        orderType:'购买设备',
                        orderTypeId:'2',
                        orderNo:'201900001',
                        orderTime:'2019-09-09',
                        versions: '基础版',
                        versionsId:'base',
                        deployType: '单独部署',
                        vehType: '渣土车',
                        usage: '5年',
                        status: '已下单',
                    },{
                        id: '12987122',
                        orderType:'购买设备',
                        orderTypeId:'2',
                        orderNo:'201900001',
                        orderTime:'2019-09-09',
                        versions: '企业版',
                        versionsId:'company',
                        deployType: '单独部署',
                        vehType: '渣土车',
                        usage: '5年',
                        status: '已下单',
                    },{
                        id: '12987122',
                        orderType:'购买设备',
                        orderTypeId:'2',
                        orderNo:'201900001',
                        orderTime:'2019-09-09',
                        versions: '旗舰版',
                        versionsId:'flagship',
                        deployType: '单独部署',
                        vehType: '渣土车',
                        usage: '5年',
                        status: '已下单',
                    }]
                },
                searchForm: {
                    searchContent:''
                },
                searchBtn:{

                }
            };
        },

        mounted(){
        },
        methods: {

            getTableData() {
                /*                let param = {
                                }
                                this.$axios({
                                    url: '',
                                    method: 'post',
                                    baseURL: '',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    data: param
                                }).then((res) => {
                                    if (res.success) {
                                        this.dealTableResponse(res)
                                    } else {
                                        this.$message.error(res.msg)
                                    }
                                })*/
            },
            formatColumn(row, column, cellValue, index) {

            },
            handleClick(row){
                if(row.orderTypeId==='1'){
                    this.$router.push({path:'/system/UserCenter/mycenter/buyPlatformDetail',query:{versionsId:row.versionsId}})
                } else if(row.orderTypeId==='2') {
                    this.$router.push({path:'/system/UserCenter/mycenter/buyDeviceDetail',query:{versionsId:row.versionsId}})
                }

            },
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
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
        overflow-y: auto;
        box-sizing: border-box;
        padding: 5px;
        .orderTable-tr{
            height: 137px;
            width: 100%;
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            box-shadow: 1px 1px 1px 1px #edf1fb;
           .orderTitle{
               flex: 2;
               border-bottom: 1px dashed #ccc;
               display: flex;
               flex-direction: row;
               text-align: center;
           }
            .orderContent{
                flex: 5;
            }
        }
    }
    .sys-table-pagination{
        text-align: center;
        padding:10px;
    }
    .orderTitle .el-form-item {
        margin: 0 50px;
    }
    .orderTitle .el-form-item__content span {
        line-height: 40px;
        position: relative;
        font-size: 12px;
        color: #ababab;
    }
    .orderTitle /deep/.el-form--inline .el-form-item__label {
        float: none;
        display: inline-block;
        color: #ababab;
        font-size: 12px;
    }
    .el-table{
        border:none !important;
    }
    .orderTable /deep/ .el-table th.is-leaf, .el-table td {
         border:none;
    }
    .orderTable /deep/ .el-table th > .cell {
        font-size: 12px;
        font-weight: normal;
    }
    .orderTable /deep/.el-table td > .cell {
        font-size: 12px;
    }

</style>
<template>
    <div v-if="dialogTableVisible">
        <el-dialog
            title="详情"
            :visible.sync="dialogTableVisible"
            :close-on-click-modal="false"
            :before-close="handleCancel"
            width="50%"
        >
            <el-tabs type="border-card" class="tab_menu">
                <el-tab-pane label="车辆详情">
                    <CarDetail/>
                </el-tab-pane>
                <el-tab-pane label="企业信息">
                    <EnterpriseMsg />
                </el-tab-pane>
                <el-tab-pane label="审批路线">
                    <CarTable />
                </el-tab-pane>
                <el-tab-pane label="运输过程">运输过程</el-tab-pane>
                <el-tab-pane label="设备控制">设备控制</el-tab-pane>
                <el-tab-pane label="变更信息">变更信息</el-tab-pane>
                <el-tab-pane label="违法信息">违法信息</el-tab-pane>
                <el-tab-pane label="设备信息">设备信息</el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<script>
import EnterpriseMsg from "./DetailView/EnterpriseMsg";
import CarTable from "./DetailView/CarTable";
import CarDetail from "./DetailView/CarDetail";
export default {
    props:["showModal"],
    components:{
        EnterpriseMsg,
        CarTable,
        CarDetail
    },
    data(){
        return{
            
        }
    },
    methods:{
        handleCancel() {
            this.$emit("seeDetail", false);
        },
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
}
</script>

<style>
.el-dialog__body{
    padding: 0 !important;
}

.el-tabs__nav{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>>

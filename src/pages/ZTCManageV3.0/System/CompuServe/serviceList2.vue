<template>
    <div class="wrapper">
        <div class="serviceHandle">
            <el-button size="mini" type="info">升级服务</el-button>
            <el-button size="mini" type="info">编辑服务</el-button>
        </div>
        <div class="serviceContainer">
            <div class="serviceLeft">
                <ul>
                    <li>
                        <div class="warnItem ex-icon ex-icon-serviceItem-select" v-for="(item,index) in warnServiceList"><span>{{item.name}}</span></div>
                    </li>
                    <li>
                        <div class="warnItem ex-icon ex-icon-serviceItem-select" v-for="(item,index) in warnServiceList"><span>{{item.name}}</span></div>
                    </li>
                </ul>
            </div>
            <div class="serviceRight">
                <ul>
                    <li>
                        <div class="warnItem ex-icon ex-icon-serviceItem-select" v-for="(item,index) in warnServiceList"><span>{{item.name}}</span></div>
                    </li>
                    <li>
                        <div class="warnItem ex-icon ex-icon-serviceItem-select" v-for="(item,index) in warnServiceList"><span>{{item.name}}</span></div>
                    </li>
                    <li>
                        <div class="warnItem ex-icon ex-icon-serviceItem-select" v-for="(item,index) in warnServiceList"><span>{{item.name}}</span></div>
                    </li>
                    <li>
                        <div class="warnItem ex-icon ex-icon-serviceItem-select" v-for="(item,index) in warnServiceList"><span>{{item.name}}</span></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "serviceList",
        data() {
            return {
                warnServiceList:[ {name:'紧急报警',value:1, icon:'el-icon-s-platform'},
                                  {name:'超速报警',value:2, icon:'el-icon-video-play'}],
                menjinServiceList:[],
                yunyingServiceList:[],
                fuwuServiceList:[],
                othersServiceList:[],
                yangchenServiceList:[]
            }
        },
        mounted(){

        },
        methods: {

        }
    }
</script>

<style scoped lang="scss">
    .wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: calc(100vh - 78px);
        overflow-x:hidden;
        overflow-y: auto;
        .serviceHandle{
            width: 100%;
            height: 100px;
            padding:20px;
            box-sizing: border-box;
        }
        .serviceContainer{
            display: flex;
            flex-direction: row;
            width: 100%;
            height: calc(100% - 100px);
            padding:20px;
            box-sizing: border-box;
            ul li{
                list-style: none;
            }
            .serviceLeft{
                flex: 1;

            }
            .serviceRight{
                flex: 1;
            }
            .warnItem{
                display: inline-block;
                margin:10px;
                text-align: center;
                line-height: 50px;
                color: #fff;
            }
        }
    }

</style>
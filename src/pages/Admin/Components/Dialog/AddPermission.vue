<template>
    <div class="ex-dialog" v-if="dialogTableVisible">
        <el-dialog
                title="角色"
                :visible.sync="dialogTableVisible"
                :close-on-click-modal="false"
                :before-close="handleCancel"
                width="40%"
        >
            <div class="ex-table-query">
                <el-form
                        ref="permissionForm"
                        :inline="true"
                        :model="permissionForm"
                        :rules="ruleInline"
                        label-width="110px"
                >
                  
                    <el-form-item label="所属部门：" class="departSearch">
                        <!-- <el-input v-model="permissionForm.DepartmentId" size="small"></el-input> -->
                         <el-cascader
                            size="mini"
                            placeholder="请选择部门或输入关键字可搜索"
                            :show-all-levels="false"
                            :options="options"
                            filterable>
                        </el-cascader>
                    </el-form-item>

                </el-form>
            </div>

            <!-- <div>
                <el-card class="role-card">
                    <div slot="header" class="clearfix">
                        <span>卡片名称</span>
                    </div>
                    <div v-for="o in 4" :key="o" class="text item">
                        {{'列表内容 ' + o }}
                    </div>
                </el-card>
            </div> -->
            <!-- 树结构 -->
            <div class="ex-table-container" style="max-height: 280px; overflow: auto;">
                <el-tree
                        accordion
                        class="filter-tree"
                        highlight-current
                        show-checkbox
                        :data="treeData"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        @node-click="handleTreeNodeClick"
                        ref="tree"
                ></el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSave">确定</el-button>
        <el-button size="small" @click="handleCancel">取消</el-button>
      </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props: ["showModal", "rowData"],
        data() {
            return {
                activeNames: ["1"],
                permissionForm: {
                    RoleName: null,
                    des: null
                },
                ruleInline: {
                    RoleName: [
                        {required: true, message: "角色名不能为空", trigger: "blur"},
                        {
                            type: "string",
                            min: 4,
                            message: "角色名长度不能小于4位",
                            trigger: "blur"
                        }
                    ]
                },
                //层级选择
               options: [{
                    value: 'zhinan',
                    label: '指南',
                    children: [{
                        value: 'shejiyuanze',
                        label: '设计原则',
                        children: [{
                        value: 'yizhi',
                        label: '一致'
                        }, {
                        value: 'fankui',
                        label: '反馈'
                        }, {
                        value: 'xiaolv',
                        label: '效率'
                        }, {
                        value: 'kekong',
                        label: '可控'
                        }]
                    }, {
                        value: 'daohang',
                        label: '导航',
                        children: [{
                        value: 'cexiangdaohang',
                        label: '侧向导航'
                        }, {
                        value: 'dingbudaohang',
                        label: '顶部导航'
                        }]
                    }]
                }],
                // 树的数据
                treeData: [
                    {
                        id: 1,
                        label: "汉阳区",
                        children: [
                            {
                                id: 4,
                                label: "琴台大道",
                                children: [
                                    {
                                        id: 9,
                                        label: "琴台大剧院"
                                    },
                                    {
                                        id: 10,
                                        label: "古琴台"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 2,
                        label: "江夏区",
                        children: [
                            {
                                id: 5,
                                label: "江夏广场"
                            },
                            {
                                id: 6,
                                label: "江夏大道"
                            }
                        ]
                    },
                    {
                        id: 3,
                        label: "洪山区",
                        children: [
                            {
                                id: 7,
                                label: "光谷步行街"
                            },
                            {
                                id: 8,
                                label: "银泰创意城"
                            }
                        ]
                    }
                ],
                filterText: "",
                defaultProps: {
                    children: "children",
                    label: "label"
                }
            };
        },
        mounted() {
        },
        methods: {

            handleTreeNodeClick(){

            },

            handleChange(val) {
                console.log(val);
            },
            handleCancel() {
                this.$refs["permissionForm"].resetFields();
                this.$emit("addPermission", false);
            },
            handleSave() {
                this.$emit("addPermission", false);
            },

            // 筛选树数据
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            }
        },
        watch: {
            showModal(v) {
                if (!v) {
                    this.permissionForm = {
                        roleName: null,
                        des: null
                    };
                }
            },
            rowData(v) {
                if (v.roleName) {
                    this.permissionForm = v;
                }
            }
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
    };
</script>

<style scoped>
.ex-table-query{
    padding: 0 !important;
}
.el-form-item{
    width: 100%;
}

.el-cascader{
    width: 100%;
}

.text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .role-card {
    margin-left: 3%;
    width: 180px !important;
  }


</style>
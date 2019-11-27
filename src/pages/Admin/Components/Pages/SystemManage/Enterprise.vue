<template>
    <div class="ex-pages-table-content has-tree">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin:15px;">
            <el-breadcrumb-item :to="{ path: '/' }">
                <i class="el-icon-s-home"/> 首页
            </el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/Index' }">系统设置</el-breadcrumb-item>
            <el-breadcrumb-item>{{menuName}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="ex-content">
            <div class="ex-menu-table-side ex-tree">
                <h2>
                    <i class="el-icon-s-operation"/>
                    报警规则
                </h2>
                <div class="ex-tree-search-input">
                    <el-input placeholder="输入关键字进行过滤" size="small" v-model="filterText" style="width:85%"></el-input>
                </div>

                <el-tree
                        accordion
                        class="filter-tree"
                        highlight-current
                        show-checkbox
                        node-key="id"
                        :default-expanded-keys="[2]"
                        :data="treeData"
                        :props="defaultProps"
                        :filter-node-method="filterNode"
                        @node-click="handleTreeNodeClick"
                        ref="tree"
                        style="background:#f6f7fa"
                ></el-tree>
            </div>
            <div class="ex-pages-table-content ex-pages-main">
            
                <div class="ex-table-content">
                    <!-- 报表查询 -->
                    <div class="ex-table-query">
                        <el-form :inline="true" :model="formInline" size="small">
                            <el-form-item label="部门名称">
                                <el-input v-model="formInline.user" placeholder="请输入您要查询的部门名称"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">
                                    <i class="el-icon-search"/> 查询
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="success" @click="handleAdd">
                                    <i class="el-icon-plus"/> 新增
                                </el-button>
                            </el-form-item>
                            <div class="fr">
                                <el-form-item>
                                    <el-button type="danger" @click="multipleDelete" icon="el-icon-delete">批量删除</el-button>
                                </el-form-item>
                            </div>
                        </el-form>
                    </div>
                    <!-- 报表表格 -->
                    <div class="ex-table-container">
                        <el-table
                                :data="menuData"
                                row-key="name"
                                border
                                height="100%"
                                max-height="100%"
                                header-row-class-name="ex-table-header"
                        >
                            <el-table-column type="selection" fixed width="40" align="center"></el-table-column>
                            <el-table-column prop="Name" label="部门名称" align="center"></el-table-column>
                            <el-table-column prop="ShortName" label="部门简称" align="center"></el-table-column>
                            <el-table-column prop="TagName" label="部门标签" align="center"></el-table-column>
                            <el-table-column prop="DepartRoleName" label="部门属性" align="center"></el-table-column>
                            <el-table-column prop="ParentName" label="上级部门" align="center"></el-table-column>
                            <el-table-column prop="action" fixed="right" label="操作" align="center" width="350">
                                <template slot-scope="scope">
                                    <el-button 
                                            type="info"
                                            size="small"
                                            @click="handleDetail(scope.$index,scope.row)"
                                            icon="el-icon-view"
                                    >详情
                                    </el-button>
                                    <el-button
                                            size="small"
                                            type="primary"
                                            @click="handleEdit(scope.$index, scope.row)"
                                            icon="el-icon-edit"
                                    >编辑
                                    </el-button>
                                    <el-button
                                            size="small"
                                            type="danger"
                                            icon="el-icon-delete"
                                            @click="handleDelete(scope.$index, scope.row)"
                                    >删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                    <el-pagination
                            :hide-on-single-page="true"
                            background
                            layout="total, prev, pager, next, jumper"
                            :total="20"
                            class="ex-pagination"
                    ></el-pagination>
                </div>
            </div>
        </div>

        <!-- 新增弹框 -->
        <AddEnterprise :showModal="showModal" v-on:addEnterprise="addEnterprise" :rowData="rowData"/>
        <!-- 查看详情 -->
        <SeeDetail :showModal="showDetail" v-on:seeDetail="seeDetail"/>
    </div>
</template>
<script>
    import AddEnterprise from "../../Dialog/AddEnterprise";
    import SeeDetail from "../../Dialog/SeeDetail";
    export default {
        name: "enterprise",
        components: {
            AddEnterprise,
            SeeDetail
        },
        data() {
            return {
                menuName: this.$route.meta.title,
                hideMenu: true,
                activeIndex: this.$route.path,
                menuData: [
                    {
                        id: 1,
                        roleName: "平台监控",
                        des: "",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 2,
                        roleName: "平台监控",
                        des: "",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 3,
                        roleName: "平台监控",
                        des: "",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 4,
                        roleName: "平台监控",
                        des: "",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 5,
                        roleName: "平台监控",
                        des: "",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 6,
                        roleName: "平台监控",
                        des: "",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    },
                    {
                        id: 7,
                        roleName: "平台监控",
                        des: "",
                        dateTime: "2019-11-07 07:08:09",
                        userName: "张三"
                    }
                ],
                leftMenu: [
                    {
                        id: "1",
                        name: "角色管理",
                        url: "/Role",
                        iconClass: "ex-icon-group"
                    },
                    {
                        id: "1",
                        name: "角色权限管理",
                        url: "/RolePermission",
                        iconClass: "ex-icon-people"
                    },
                    {
                        id: "1",
                        name: "用户管理",
                        url: "/User",
                        iconClass: "ex-icon-mine"
                    },
                    {
                        id: "1",
                        name: "车辆管理",
                        url: "/Vehicle",
                        iconClass: "ex-icon-truck"
                    },
                    {
                        id: "1",
                        name: "企业管理",
                        url: "/Enterprise",
                        iconClass: "ex-icon-homepage"
                    },
                    {
                        id: "1",
                        name: "报警规则管理",
                        url: "/AlarmRule",
                        iconClass: "ex-icon-clock"
                    }
                ],
                showModal: false,
                showDetail:false,
                formInline: {
                    user: "",
                    region: ""
                },
                rowData: {},
                totalPage: 10,
                // 树的数据
                treeData: [
                    {
                        id: 1,
                        label: "武汉市",
                        children: [
                            {
                                id: 2,
                                label: "汉阳区",
                                children: [
                                    {
                                        id: 5,
                                        label: "琴台大剧院"
                                    },
                                    {
                                        id: 6,
                                        label: "古琴台"
                                    }
                                ]
                            },
                            {
                                id: 3,
                                label: "江夏区",
                                children: [
                                    {
                                        id: 7,
                                        label: "江夏广场"
                                    },
                                    {
                                        id: 8,
                                        label: "江夏大道"
                                    }
                                ]
                            },
                            {
                                id: 4,
                                label: "洪山区",
                                children: [
                                    {
                                        id: 9,
                                        label: "光谷步行街"
                                    },
                                    {
                                        id: 10,
                                        label: "银泰创意城"
                                    }
                                ]
                            }
                        ]
                    },
                ],
                filterText: "",
                defaultProps: {
                    children: "children",
                    label: "label"
                }
            };
        },

        mounted() {
            let self = this;
            self.$nextTick(() => {
                self.initTree();
                self.initGrid();
                self.initGridHeight();
            });
        },

        methods: {
            // 渲染树
            initTree() {
                this.https.post('treeUrl', {}).then(res => {
                    console.log(res)
                })
            },

            // 渲染表格
            initGrid() {
                this.https.post('gridUrl', {}).then(res => {
                    console.log(res)
                })
            },

            // 初始化表格高度
            initGridHeight() {
                let pHeight = document.getElementsByClassName("ex-pages-table-content")[0]
                    .offsetHeight;
                let qHeight = document.getElementsByClassName("ex-table-query")[0]
                    .offsetHeight;
                document.getElementsByClassName("ex-table-container")[0].style.height =
                    pHeight - qHeight - 117 + "px";
            },

            // 添加
            handleAdd() {
                this.showModal = true;
            },

            // 编辑
            handleEdit(index, row) {
                this.showModal = true;
                this.rowData = row;
            },
            // 查看详情
            handleDetail(index, row) {
            this.showDetail = true;
            },
            // 删除操作
            handleDelete(index, row) {
                this.$confirm("确定删除该条记录？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.https.post("", {delId: row.Id}, function (oData) {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                        });
                    })
                    .catch(() => {
                        // this.$message({
                        //   type: "info",
                        //   message: "已取消删除"
                        // });
                    });
            },

            // 左侧菜单选择
            handleSelect(key, keyPath) {
                console.log(key);
                this.$router.push({path: key});
            },

            // 弹窗后的回调
            addEnterprise(close) {
                this.showModal = close;
                this.rowData = {};
            },
            seeDetail(close){
            this.showDetail = close;
            },
            // 查询
            onSubmit() {
                console.log("submit!");
            },

            // 批量删除
            multipleDelete() {
            },

            // 隐藏/显示 左侧菜单
            handleMenu() {
                this.hideMenu = !this.hideMenu;
            },

            // 左侧树点击事件
            handleTreeNodeClick(data) {
            },

            // 筛选树数据
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            }
        }
    };
</script>
<style scoped>
    .detail{
        color:#5b95ff;
        background: #e6e9f1;
        border: 0;
    }
</style>

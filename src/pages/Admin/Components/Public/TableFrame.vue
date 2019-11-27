<template>
    <div class="ex-pages">
        <!-- 侧边导航栏 -->
        <div class="ex-menu-side" :class="{'hide-menu' : hideMenu}">
            <h2>
                <i class="el-icon-set-up"/>
                系统设置
                <el-tooltip
                        class="hide-menu"
                        effect="dark"
                        content="缩进菜单"
                        placement="right"
                        v-if="!hideMenu"
                >
                    <i class="el-icon-s-fold" @click="handleMenu"/>
                </el-tooltip>
                <el-tooltip class="hide-menu" effect="dark" content="展开菜单" placement="right" v-else>
                    <i class="el-icon-s-unfold" @click="handleMenu"/>
                </el-tooltip>
            </h2>
            <el-menu @select="handleSelect" :default-active="activeIndex">

                <el-menu-item v-for="(item, index) in leftMenu" :key="index" :index="item.url">
                    <el-tooltip effect="dark" :content="item.name" placement="right" v-show="hideMenu">
                        <i class="hide-menu-icon" :class="item.iconClass"/>
                    </el-tooltip>
                    <span v-show="!hideMenu">
            <i :class="item.iconClass"/>
            {{item.name}}
          </span>
                </el-menu-item>

                <el-submenu :index="roleMenu.url">
                    <template slot="title">
                        <i class="ex-icon-group"></i>
                        <span>{{roleMenu.name}}</span>
                    </template>
                    <!-- <el-menu-item-group > -->
                    <!-- <template slot="title">分组一</template> -->
                    <el-menu-item v-for="(menu,i) in roleMenu.subMenu" :key="i" :index="menu.url">
                        <el-tooltip effect="dark" :content="menu.name" placement="right" v-show="hideMenu">
                            <i class="hide-menu-icon" :class="menu.iconClass"/>
                        </el-tooltip>
                        <span v-show="!hideMenu">
                    <i :class="menu.iconClass"/>
                    {{menu.name}}
                  </span>
                    </el-menu-item>
                    <!-- </el-menu-item-group> -->

                </el-submenu>
            </el-menu>
        </div>
        <div class="ex-layout-right-content" :class="{'hide-menu' : hideMenu}">
            <!-- 这里是需要keepalive的 -->
            <keep-alive v-if="$route.meta.keepAlive">
                <router-view></router-view>
            </keep-alive>
            <!-- 这里不会被keepalive -->
            <router-view v-else></router-view>
        </div>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                menuName: this.$route.meta.title,
                hideMenu: false,
                activeIndex: this.$route.path,
                roleMenu: {
                    id: "1",
                    name: "企业管理",
                    url: "/Enterprise",
                    iconClass: "ex-icon-homepage",
                    subMenu: [
                        {
                            id: "2",
                            name: "子菜单1",
                            url: "/Enterprise",
                            iconClass: "ex-icon-homepage",
                        },
                        {
                            id: "2",
                            name: "子菜单2",
                            url: "/Enterprise2",
                            iconClass: "ex-icon-homepage",
                        },
                    ]
                },
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
                    // {
                    //   id: "1",
                    //   name: "企业管理",
                    //   url: "/Enterprise",
                    //   iconClass: "ex-icon-homepage"
                    // },
                    {
                        id: "1",
                        name: "报警规则管理",
                        url: "/AlarmRule",
                        iconClass: "ex-icon-clock"
                    },
                    {
                        id: "1",
                        name: "菜单管理",
                        url: "/Menu",
                        iconClass: "ex-icon-truck"
                    },
                ]
            };
        },
        methods: {
            // 左侧菜单选择
            handleSelect(key, keyPath) {
                console.log(key);
                this.$router.push({path: key});
            },

            // 隐藏/显示 左侧菜单
            handleMenu() {
                this.hideMenu = !this.hideMenu;
            }
        }
    };
</script>
<style lang="less">
    .ex-pages-table-content {
        width: calc(~"100% - 201px");
        height: 100%;
        float: left;
        -webkit-box-shadow: inset 3px 0 10px rgba(0, 0, 0, 0.05);
        box-shadow: inset 3px 0 10px rgba(0, 0, 0, 0.05);
        .ex-menu-table-side {
            width: 200px;
            height: 100%;
            float: left;
        }
    }

    .ex-menu-table-side {
        h2 {
            font-size: 15px;
            line-height: 40px;
            margin: 0;
            padding: 0 15px;
            background-color: #e7e8ee;
            color: #585858;
            position: relative;
        }
    }

    .ex-layout-right-content {
        .ex-pages-table-content {
            .ex-pages-table-content.ex-pages-main {
                width: 100%;
            }
        }
    }

    .ex-layout-right-content.hide-menu {
        width: calc(100% - 41px);
        margin-left: 41px;
        .ex-pages-table-content.no-tree {
            width: calc(100%);
            // padding: 15px 0;
        }
        .ex-pages-table-content.has-tree {
            width: 100%;
            // padding: 15px 0;
            // margin-left: 41px;
        }
    }

    .ex-layout-right-content {
        width: 100%;
        height: 100%;
        .ex-pages-table-content.has-tree {
            .ex-pages-table-content {
                width: calc(~"100% - 201px");
            }
        }
    }

    .el-submenu .el-menu-item {
        min-width: 0px !important;
    }

    .el-submenu .el-menu {
        background: #f6f7fa;
    }

    .el-submenu .el-submenu__title {
        height: 42px;
        line-height: 42px;
        margin: 15px;
        padding: 0;
    }

</style>
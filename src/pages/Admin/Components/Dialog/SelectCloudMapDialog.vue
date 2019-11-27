<template>
  <div class="ex-dialog tree" v-if="dialogTableVisible">
    <el-dialog
      title="选择云图"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="60%"
    >
      <el-container style="height: 500px; border: 1px solid #eee">
        <el-aside width="25%">
          <!-- 侧边树结构 -->
          <div class="ex-menu-side" style="width: 98%">
            <h2>
              <i class="el-icon-s-operation" />
              云图树
            </h2>
            <div class="ex-tree-search-input">
              <el-input placeholder="输入关键字进行过滤" size="small" v-model="dialogFilterText"></el-input>
            </div>

            <el-tree
              accordion
              class="filter-tree"
              highlight-current
              show-checkbox
              :data="dialogTreeData"
              :props="dialogTreeProps"
              :filter-node-method="dialogFilterNode"
              @node-click="handleDialogTreeNodeClick"
              ref="tree"
            ></el-tree>
          </div>
        </el-aside>
        <div class="ex-table-content dialog" style="width: 49%">
          <div ref="cloudMap"></div>
        </div>

        <el-aside width="25%" style="overflow: hidden">
          <!-- 侧边树结构 -->
          <div class="ex-menu-side" style="width: 98%">
            <h2>
              <i class="el-icon-shopping-cart-2" />
              已选车辆（0）
            </h2>

            <div class="tag-container">
              <div class="tag-item" v-for="item in 20" :key="item">
                <el-tag>{{item+1}}</el-tag>
              </div>
            </div>
          </div>
        </el-aside>
      </el-container>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSave">确定</el-button>
        <el-button size="small" @click="handleCancel">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: ["showModal"],
  data() {
    return {
      activeNames: ["1"],
      tableData: [],
      // 树的数据
      dialogTreeData: [
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
      dialogFilterText: "",
      dialogTreeProps: {
        children: "children",
        label: "label"
      },
      dialogGridData: {
        title: null
      }
    };
  },
  mounted() {},
  methods: {
    handleChange(val) {
      console.log(val);
    },
    handleCancel() {
      this.$emit("selectCloudMapCallBack", false);
    },
    handleSave() {
      this.$emit("selectCloudMapCallBack", false);
    },
    // 左侧树点击事件
    handleDialogTreeNodeClick(data) {},

    // 筛选树数据
    dialogFilterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    // 查询表格数据
    queryDialogGridData() {}
  },
  watch: {},
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
<template>
  <div class="sys-table">
    <slot></slot>
    <div class="sys-table-pagination" v-if="pagination">
      <el-pagination
        :current-page="pageNum"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :layout="pageLayout"
        :class="align"
        background
        size="small"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableMixin",
  props: {
    pagination: Boolean,
    paginationAlign: {
      type: String,
      default: "right"
    },
    pageLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default: function() {
        return [10, 20, 50];
      }
    },
    total: {
      type: Number,
      default: 10
    },
    pageNum: {
      type: Number,
      default: 1
    },
    handleSizeChange: {
      type: Function,
      default: function() {
        return null;
      }
    },
    handleCurrentChange: {
      type: Function,
      default: function() {
        return null;
      }
    }
  },
  computed: {
    align() {
      let res;
      switch (this.paginationAlign) {
        case "right":
          res = "textR";
          break;
        case "center":
          res = "textC";
          break;
        default:
          res = "";
      }
      return res;
    }
  }
};
</script>

<style scoped lang="scss">
.sys-table {
  width: 100%;
}
.sys-table-pagination {
  text-align: center;
  padding: 10px;
}
</style>

<template>
  <div class="ex-dialog" v-if="dialogTableVisible">
    <el-dialog
      v-loading="dialogLoading"
      element-loading-text="数据请求中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(136, 136, 136, 0.5)"
      title="按钮"
      :visible.sync="dialogTableVisible"
      :close-on-click-modal="false"
      :before-close="handleCancel"
      width="40%"
    >
      <div class="ex-table-query">
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button type="success" @click="editBtn">
              <i class="el-icon-plus" /> 新增
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="ex-table-container">
        <el-table
          v-loading="tableLoading"
          element-loading-text="数据请求中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(136, 136, 136, 0.5)"
          :data="gridData"
          row-key="id"
          border
          height="400"
          header-row-class-name="ex-table-header"
        >
          <el-table-column prop="actionName" label="按钮名称" align="center"></el-table-column>
          <el-table-column prop="actionUrl" label="按钮路径" align="center"></el-table-column>
          <el-table-column prop="action" fixed="right" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="editBtn(scope.$index, scope.row)"
                icon="el-icon-edit"
              >编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="delBtn(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel">关闭</el-button>
      </span>
    </el-dialog>
    <AddBtn :showModal="showAddBtnModal" v-on:addBtn="addBtn" :rowDataInline="rowData2" :menuId="menuId" />
  </div>
</template>
<script>
import AddBtn from "./AddButton";
export default {
  props: ["showModal", "rowData"],
  components: {
    AddBtn
  },
  data() {
    return {
      gridData: [],
      dialogLoading: false,
      tableLoading: false,
      showAddBtnModal: false,
      rowData2: [],
      menuId: null,
    };
  },
  mounted() {},
  methods: {
    editBtn(index, row){
      this.showAddBtnModal = true;
      this.rowData2 = row;
    },
    handleCancel() {
      this.$emit("addBtnGrid", { showModal: false, isReload: false });
    },
    addBtn(callbackValue) {
      this.showAddBtnModal = callbackValue.showModal;
      this.rowData2 = {};
      if (callbackValue.isReload) {
        // this.initGrid();
      }
    },
  },
  watch: {
    showModal(v) {
      if (!v) {
        this.gridData = [];
      }
    },
    rowData: {
      handler(newData, oldData) {
        this.gridData = newData.actionSet;
        this.menuId = newData.id;
      },
      immediate: true
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
</style>
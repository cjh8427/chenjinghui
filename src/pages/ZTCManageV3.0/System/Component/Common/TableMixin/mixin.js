export const tableDataMixin = {
    data() {
        return {
            pageNum: 1,
            pageSize: 10,
            pageSizes: [10, 20, 50],
            total: 0,
            sortName: '',
            sortValue: '',
            pagination: true,
            multipleSelection: []
        }
    },
    mounted() {
        if (this.$refs.searchForm) {
            let _this = this
            // enter键登录
            this.$refs.searchForm.$el.onkeydown = function (e) {
                let key = window.event.keyCode
                if (key === 13) {
                    _this.getTableData()
                }
            }
        }
    },
    methods: {
        search() {
            this.tableData.loading = true
            this.pageNum = 1
            this.getTableData()
        },
        handleSizeChange(val) {
            this.pageNum = 1
            this.pageSize = val
            this.getTableData()
        },
        handleCurrentChange(val) {
            this.pageNum = val
            this.getTableData()
        },
        handleRowClick(row, event, column) {
            this.$refs.table.toggleRowSelection(row);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        tableRowClassName({
            row,
            rowIndex
        }) {
            for (let item of this.multipleSelection) {
                if (item.id && item.id === row.id) {
                    return 'selected-row'
                }
            }
        },
        handleSortChange({
            prop,
            order
        }) {
            this.sortName = prop
            if (order === 'descending') {
                this.sortValue = 'desc'
            } else {
                this.sortValue = 'asc'
            }
            this.getTableData()
        },
        dealTableResponse(res) {
            this.tableData.loading = false
            if (res.success) {
                this.tableData.body = res.obj.list
                this.pageNum = res.obj.pageNum > 0 ? res.obj.pageNum : 1
                this.pageSize = res.obj.pageSize
                this.total = res.obj.total
            } else {
                this.$message.error(res.msg)
            }
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
            this.search()
        }
    }
}
<template>
  <div class="main-content">
    <el-form
      :inline="true"
      label-position="right"
      label-width="90px"
      class="filter-form">
      <el-form-item label="选择项目:">
        <el-select v-model="filterFormData.name" size="small">
          <el-option
            value="移动" />
        </el-select>
      </el-form-item>
      <el-form-item label="检查人:">
        <el-select v-model="filterFormData.name" size="small">
          <el-option
            value="移动" />
        </el-select>
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button type="primary" size="mini">查询</el-button>
        <el-button size="mini">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="operate-wrap">
      <el-button type="primary" size="small">新增</el-button>
    </div>
    <el-table
      :data="tableData"
      size="small"
      class="no-border-gary-head" >
      <el-table-column label="项目名称" />
      <el-table-column label="评估主题" />
      <el-table-column label="检查人" />
      <el-table-column label="计划开始日期" />
      <el-table-column label="综合得分" />
      <el-table-column width="220" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="small" class="no-border">查看</el-button>
          <el-button size="small" class="no-border">编辑</el-button>
          <el-button size="small" class="no-border">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="pageTotal"
      :page-size="10"
      :page-sizes="[10, 20, 30, 40]"
      :current-page="pageIndex"
      background
      layout="total, prev, pager, next, sizes, jumper"
      class="pager-wrap"
      @current-change="pageChangeHandle"
      @size-change="pageSizeChangeHandle"/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filterFormData: {
        name: ''
      },
      tableData: [],
      pageIndex: 0,
      pageTotal: 10
    }
  },
  methods: {
    pageChangeHandle(page) {
      this.pageIndex = page
    },
    pageSizeChangeHandle(val) {
      console.log('val', val)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

.main-content {
  padding: 20px;
  background: #fff;
  .filter-form {
    .el-form-item {
      margin: 0 0 15px 0;
      white-space: nowrap;
      .el-select, .date-select {
        width: 200px;
      }
      &.btn-wrap {
        padding-left: 20px;
      }
      .form-ctrl-btn {
        font-size: 14px;
      }
    }
  }
  .operate-wrap {
    padding: 20px 10px;
  }
  .el-table {
    margin-top: 5px;
  }
  .pager-wrap {
    text-align: center;
    margin-top: 20px;
  }
}
</style>

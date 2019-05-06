<template>
  <el-container class="project-container">
    <el-header class="search-wrap" height="no">
      <div class="header">
        <span class="el-icon-tickets">筛选查询</span>
      </div>
      <el-form ref="searchForm" :inline="true" :model="searchForm" size="small" class="search-form">
        <el-form-item prop="projectName" label="项目名称">
          <el-input v-model="searchForm.projectName" type="text" auto-complete="off" placeholder="请输入项目名称" />
        </el-form-item>
        <el-button type="primary" size="small" class="search-btn">查询</el-button>
      </el-form>
    </el-header>
    <el-main class="main-wrap">
      <div class="header">
        <span class="el-icon-tickets">数据列表</span>
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="account-add-btn">新增</el-button>
      </div>
      <el-table
        ref="projectTable"
        :data="projectTableData"
        border
        class="project-table">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="projectName" label="项目名称" align="center" />
        <el-table-column prop="companyName" label="公司名称" align="center" />
        <el-table-column width="220" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary">编辑</el-button>
            <el-button size="mini" type="primary">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="footer-wrap">
      <div class="footer-operatete-wrap">
        <el-checkbox v-model="allCheckdeValue" border size="mini">全选</el-checkbox>
        <el-select v-model="batchOperateValue" clearable size="mini" placeholder="批量操作">
          <el-option value="disable" label="删除" />
        </el-select>
        <el-button type="primary" size="mini">确定</el-button>
      </div>
      <el-pagination
        :total="pageTotal"
        background
        layout="prev, pager, next, jumper"/>
    </el-footer>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      searchForm: {
        projectName: ''
      },
      projectTableData: [],
      allCheckdeValue: '',
      batchOperateValue: '',
      pageTotal: 20
    }
  },
  created() {
    console.log('runing ')
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.project-container {
  padding: 20px;
  .header {
    @include gray-header;
  }
  .search-wrap {
    @include boxShadow-container;
    .search-form {
      padding: 20px 40px;
      .el-form-item {
        margin: 0 15px 0 10px;
      }
    }
  }
  .main-wrap {
    margin-top: 30px;
    @include boxShadow-container;
  }
  .footer-wrap {
    padding: 0;
    margin-top: 30px;
    @include flex-space-between-center;
    @include flex-wrap;
    .el-select {
      width: 100px;
      margin: 0 10px;
    }
    .footer-operatete-wrap {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
  }
}
</style>

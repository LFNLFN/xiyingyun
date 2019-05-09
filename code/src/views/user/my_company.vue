<template>
  <el-container class="company-container">
    <el-header class="search-wrap" height="no">
      <div class="header">
        <span class="el-icon-tickets">筛选查询</span>
      </div>
      <el-form ref="searchForm" :inline="true" :model="searchForm" size="small" class="search-form">
        <el-form-item prop="companyId" label="公司ID">
          <el-input v-model="searchForm.companyId" type="text" auto-complete="off" placeholder="公司ID" />
        </el-form-item>
        <el-form-item prop="companyName" label="公司名称">
          <el-input v-model="searchForm.companyName" type="text" auto-complete="off" placeholder="公司名称" />
        </el-form-item>
        <el-form-item prop="companyType" label="公司类型">
          <el-select v-model="searchForm.companyType" clearable size="mini" placeholder="请选择">
            <el-option value="disable" label="全部" />
            <el-option value="disable" label="施工" />
            <el-option value="disable" label="监工" />
          </el-select>
        </el-form-item>
        <el-button type="primary" size="small" class="search-btn">查询</el-button>
      </el-form>
    </el-header>
    <el-main class="main-wrap">
      <div class="header">
        <span class="el-icon-tickets">数据列表</span>
        <div>
          <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="account-add-btn">加入</el-button>
          <el-button type="danger" size="small" icon="el-icon-circle-plus-outline" class="account-add-btn">退出</el-button>
        </div>
      </div>
      <el-table
        ref="companyTable"
        :data="companyTableData"
        border
        class="company-table">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column prop="companyID" label="公司ID" align="center" />
        <el-table-column prop="companyName" label="公司名称" align="center" />
        <el-table-column prop="companyType" label="公司类型" align="center" />
        <el-table-column prop="companyName" label="负责人" align="center" />
        <el-table-column prop="companyName" label="加入时间" align="center" />
        <el-table-column prop="companyName" label="角色" align="center" />
        <el-table-column prop="companyName" label="账户启用状态" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.disabled" active-color="#13ce66" inactive-color="#6e6e6e" />
          </template>
        </el-table-column>
        <el-table-column width="180" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary">详情</el-button>
            <el-button size="mini" type="primary">推迟</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer class="footer-wrap">
      <div class="footer-operatete-wrap">
        <el-checkbox v-model="allCheckdeValue" border size="mini">全选</el-checkbox>
        <el-select v-model="batchOperateValue" clearable size="mini" placeholder="批量操作">
          <el-option value="applyQuit" label="申请退出" />
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
        companyId: '',
        companyName: '',
        companyType: ''
      },
      companyTableData: [],
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

.company-container {
  padding: 20px;
  .header {
    @include gray-header;
  }
  .search-wrap {
    @include boxShadow-container;
    .search-form {
      padding: 20px 40px;
      .el-form-item {
        margin: 5px 10px;
      }
      .search-btn {
        margin: 5px 0 0 10px;
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
    @include flex-layout(space-between, center, null, wrap);
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

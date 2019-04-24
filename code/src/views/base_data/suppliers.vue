<template>
  <el-container class="suppliers-container">
    <el-header class="search-container" height="no">
      <div class="search-header">
        <i class="el-icon-tickets"/>
        快速搜索栏
      </div>
      <el-form ref="searchForm" :inline="true" size="small" class="search-form">
        <el-form-item>
          <span>查询按</span>
          <el-select v-model="supSelectedVal" clearable placeholder="请选择条件" class="search-select">
            <el-option value="fullName" label="供应商全称"/>
            <el-option value="property" label="供应商性质"/>
            <el-option value="inCharge" label="负责人"/>
            <el-option value="contactNum" label="联系电话"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>关键字</span>
          <el-input v-model="searchKeyword" clearables placeholder="请输入关键字" class="search-input"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" class="search-btm">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="suppliers-table-container">
      <div class="suppliers-header">
        <i class="el-icon-tickets"/>
        数据列表
        <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" class="suppliers-add-btn" @click.native="addSuppBoxShow">添加</el-button>
      </div>
      <el-table v-loading="isLoading" ref="suppTable" :data="suppTableData" border class="suppliers-table">
        <el-table-column prop="name" label="供应商全称" align="center" />
        <el-table-column prop="name" label="供应商简称" align="center" />
        <el-table-column prop="name" label="供应商性质" align="center" />
        <el-table-column prop="name" width="80" label="负责人" align="center" />
        <el-table-column prop="name" width="100" label="联系电话" align="center" />
        <el-table-column prop="name" width="80" label="员工数" align="center" />
        <el-table-column width="220" label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" class="suppliers-table-btn">详情</el-button>
            <el-button size="mini" type="primary" class="suppliers-table-btn">编辑</el-button>
            <el-button size="mini" type="primary" class="suppliers-table-btn">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer>
      <el-pagination
        :total="pageTotal"
        background
        layout="prev, pager, next, jumper"
        @current-change="pageChangeHandle"/>
    </el-footer>
  </el-container>
</template>
<script>
export default{
  data() {
    return {
      supSelectedVal: '',
      searchKeyword: '',
      suppTableData: [
        {
          name: '美的'
        }
      ],
      isLoading: false,
      pageTotal: 10
    }
  },
  methods: {
    pageChangeHandle(val) {
      console.log(val)
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.suppliers-container {
  padding: 20px;
  .search-container {
    @include boxShadow-container;
    .search-header {
      @include gray-header;
    }
    .search-form {
      padding: 20px 30px;
      .el-form-item {
        margin: 0 25px 0 10px;
        .search-select {
          margin-left: 10px;
          width: 120px;
        }
        .search-input {
          margin-left: 10px;
          width: 250px;
        }
      }
    }
  }
  .suppliers-table-container {
    margin-top: 30px;
    @include boxShadow-container;
    .suppliers-header {
      @include gray-header;
      .suppliers-add-btn {
        float: right;
        height: 30px;
        margin: 5px 5px 0 0;
      }
    }
    .suppliers-table {
      .suppliers-table-btn {
        padding: 5px 10px !important;
      }
    }
  }
  .el-footer {
    padding: 0;
    margin-top: 30px;
    @include flex-center;
  }
}
</style>

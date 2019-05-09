<template>
  <el-container class="suppliers-container">
    <el-header class="suppliers-header" height="no">
      <div class="suppliers-header-title">
        <span class="el-icon-tickets"> 快速搜索栏</span>
        <!-- <i class="el-icon-tickets"/>
        快速搜索栏 -->
        <el-button type="primary" size="mini" icon="el-icon-search" class="show-advance-search-btn" @click="searchFormChange">{{ advancedSearchBtnText }}</el-button>
      </div>
      <!-- 普通搜索表单 -->
      <el-form v-show="!advancedSearchShow" ref="searchForm" :inline="true" :model="searchForm" size="small" class="search-form">
        <el-form-item>
          <span>查询按</span>
          <el-select v-model="searchForm.supSelectedVal" clearable placeholder="请选择条件" class="search-select">
            <el-option value="fullName" label="供应商全称"/>
            <el-option value="property" label="供应商性质"/>
            <el-option value="inCharge" label="负责人"/>
            <el-option value="contactNum" label="联系电话"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <span>关键字</span>
          <el-input v-model="searchForm.searchKeyword" clearables placeholder="请输入关键字" class="search-input"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" class="search-btm">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 高级搜索表单 -->
      <el-form v-show="advancedSearchShow" ref="advancedSearchForm" :inline="true" :model="advancedSearchForm" size="small" class="search-form">
        <el-form-item prop="name">
          <span>会员账号: </span>
          <el-input v-model="advancedSearchForm.name" clearables placeholder="请输入关键字" class="search-input-short"/>
        </el-form-item>
        <el-form-item prop="type">
          <span>会员类型: </span>
          <el-select v-model="advancedSearchForm.type" clearable placeholder="请选择条件" class="search-select">
            <el-option value="fullName" label="条件一"/>
            <el-option value="property" label="条件二"/>
            <el-option value="inCharge" label="条件三"/>
          </el-select>
        </el-form-item>
        <el-form-item prop="registDate">
          <span>注册日期: </span>
          <el-date-picker
            v-model="advancedSearchForm.registDate"
            size="small"
            align="center"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item class="advanced-search-footer">
          <el-button @click="resetAdvaSearchForm">重置</el-button>
          <el-button type="primary">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main class="suppliers-main">
      <div class="suppliers-main-title">
        <span>
          <i class="el-icon-tickets"/>
          数据列表
        </span>
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
            <el-button size="mini" type="primary" class="suppliers-table-btn" @click="showSuppDetail(scope.$index)">详情</el-button>
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
import { getSuppliers } from '@/api/base_data/suppliers'
export default{
  data() {
    return {
      searchForm: {
        supSelectedVal: '',
        searchKeyword: ''
      },
      advancedSearchForm: {
        name: '',
        type: '',
        registDate: ''
      },
      suppTableData: [
        {
          name: '席英云'
        }
      ],
      isLoading: false,
      advancedSearchShow: false,
      advancedSearchBtnText: '高级搜索',
      pageTotal: 10
    }
  },
  created() {
    console.log('running')
    getSuppliers().then(resp => {
      console.log('resp: ', resp)
    })
  },
  methods: {
    searchFormChange() {
      this.advancedSearchShow = !this.advancedSearchShow
      this.advancedSearchShow ? this.advancedSearchBtnText = '收起搜索' : this.advancedSearchBtnText = '高级搜索'
    },
    resetAdvaSearchForm() {
      this.$refs['advancedSearchForm' ].resetFields()
    },
    showSuppDetail(idx) {
      this.$router.push('/base_data/suppliers/details')
    },
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
  .suppliers-header {
    @include boxShadow-container;
    .suppliers-header-title {
      @include flex-layout(space-between, center, null, null);
      @include gray-header;
      .show-advance-search-btn {
        padding: 7px 10px;
        float: right;
      }
    }
    .search-form {
      padding: 20px 30px;
      .el-form-item {
        margin: 10px 25px 0 10px;
        .search-select {
          margin-left: 10px;
          max-width: 150px;
        }
        .search-input {
          margin-left: 10px;
          width: 250px;
        }
        .search-input-short {
          margin-left: 10px;
          width: 180px;
        }
      }
      .advanced-search-footer {
        display: block;
        text-align: right;
        margin-top: 30px;
      }
    }
  }
  .suppliers-main {
    margin-top: 30px;
    @include boxShadow-container;
    .suppliers-main-title {
      @include gray-header;
      .suppliers-add-btn {
        height: 30px;
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
    @include flex-layout(center, center, null, null);
  }
}
</style>

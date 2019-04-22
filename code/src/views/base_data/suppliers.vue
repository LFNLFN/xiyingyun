<template>
  <el-container class="suppliers-container">
    <el-header class="search-container" height="no">
      <div class="search-header">
        <i class="el-icon-tickets"/>
        快速搜索栏
      </div>
      <el-form ref="searchForm" :inline="true" size="small" class="search-form">
        <el-form-item>
          <el-select v-model="supSelectedVal" clearable placeholder="请选择条件">
            <el-option value="fullName" label="供应商全称"/>
            <el-option value="property" label="供应商性质"/>
            <el-option value="inCharge" label="负责人"/>
            <el-option value="contactNum" label="联系电话"/>
          </el-select>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main><div/></el-main>
  </el-container>
</template>
<script>
export default{
  data() {
    return {
      supSelectedVal: ''
    }
  }
}
</script>
<style ref="stylesheet/scss" lang="scss" scoped>
@mixin header {
  height: 40px;
  background: #e6e6e6;
  line-height: 40px;
  padding-left: 10px;
}
@mixin container {
  padding: 0px;
  border: 1px solid #e6e6e6;
  border-top: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.suppliers-container {
  padding: 20px;
  .search-container {
    @include container;
    .search-header {
      @include header;
    }
    .search-form {
      padding: 20px 40px;
      .el-form-item {
        margin: 0 15px 0 10px;
      }
    }
  }
}
</style>

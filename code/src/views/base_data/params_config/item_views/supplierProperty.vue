<template>
  <el-container>
    <el-main>
      <div class="header">
        <span class="el-icon-tickets"> 供应商性质</span>
        <div class="btn-wrap">
          <el-button size="small">添加</el-button>
          <el-button type="primary" size="small" @click="backConigNav">返回</el-button>
        </div>
      </div>
      <el-table ref="suppPropertyTable" :data="suppPropertyTableData" border class="property-table">
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-checkbox v-model="propertyCheckedVal" />
          </template>
        </el-table-column>
        <el-table-column prop="property" label="供应商性质" align="center" />
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: 'SupplierProperty',
  data() {
    return {
      suppPropertyTableData: [
        {
          property: '供应商性质'
        },
        {
          property: '供应商性质'
        },
        {
          property: '供应商性质'
        },
        {
          property: '供应商性质'
        }
      ],
      propertyCheckedVal: ''
    }
  },
  methods: {
    backConigNav() {
      this.$emit('changeSowCom', 'configNav')
    }
  }
}
</script>

<style ref="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.el-container {
  padding: 20px;
  .el-main {
    @include boxShadow-container;
    .header {
      @include gray-header;
    }
    .params-item-wrap {
      padding: 20px 30px;
      .el-row {
        padding: 0 10px;
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid #c7c6c6;
      }
    }
    .property-table {
      width: 600px;
      margin: 50px auto;
    }
  }
}
</style>

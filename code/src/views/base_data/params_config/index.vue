<template>
  <component :is="showComponent" @changeSowCom="showCurConfigBox"/>
</template>
<script>
import SupplierProperty from '@/views/base_data/params_config/supplierProperty'
import ProblemLevel from '@/views/base_data/params_config/problemLevel'
import ProfessionSort from '@/views/base_data/params_config/professionSort'
import AllowUploadImg from '@/views/base_data/params_config/allowUploadImg'
import ConfigNav from '@/views/base_data/params_config/configNav'
export default{
  components: { SupplierProperty, ProblemLevel, ProfessionSort, AllowUploadImg, ConfigNav },
  data() {
    return {
      showComponent: 'ConfigNav'
    }
  },
  methods: {
    showCurConfigBox(component) {
      this.showComponent = component
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
  }
}
</style>

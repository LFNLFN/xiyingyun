<template>
  <el-container>
    <el-main>
      <div class="header">
        <span class="el-icon-tickets"> 业务参数</span>
      </div>
      <div class="params-item-wrap">
        <el-row v-for="(item, idx) in paramsItems" :key="idx" type="flex" justify="space-between">
          <el-col><span>{{ item.name }}</span></el-col>
          <el-col :span="2"><el-button type="primary" size="small" @click="showCurConfigBox(item.component)">设置</el-button></el-col>
        </el-row>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default{
  data() {
    return {
      paramsItems: [
        { name: '问题等级', component: 'problemLevel' },
        { name: '专业分类', component: 'professionSort' },
        { name: '允许相册上传图片', component: 'allowUploadImg' },
        { name: '供应商性质', component: 'SupplierProperty' }
      ],
      showComponent: 'SupplierProperty',
      componentShow: false
    }
  },
  methods: {
    showCurConfigBox(component) {
      this.$emit('changeSowCom', component)
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

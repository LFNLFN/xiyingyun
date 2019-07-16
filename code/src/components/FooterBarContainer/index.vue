<template>
  <el-container direction="vertical" class="global-container">
    <slot name="main-content" />
    <footer class="footer-btn-bar">
      <div class="btn-warp">
        <el-button size="small" @click="cancelHandle">取消</el-button>
        <el-button type="primary" size="small" @click="confirmHandle">确定</el-button>
      </div>
    </footer>
  </el-container>
</template>
<script>
export default {
  methods: {
    cancelHandle() {
      this.$emit('cancelHandle')
    },
    confirmHandle() {
      this.$emit('confirmHandle')
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
.el-container {
  padding: 20px 20px 100px 20px;
  width: 100%;

  .footer-btn-bar {
    height: 80px;
    line-height: 85px;
    position: fixed;
    bottom: 0;
    right:0;
    background: #fff;
    border-top: 2px solid #ccc;
    .btn-warp {
      float: right;
      margin-right: 30px;
    }
  }
}
</style>

<template>
  <el-container direction="vertical">
    <footer class="footer">
      <div class="btn-warp">
        <el-button @click="cancelHandle">取消</el-button>
        <el-button type="primary" @click="submitHandle">确定</el-button>
      </div>
    </footer>
  </el-container>
</template>
<script>
export default {
  methods: {
    submitHandle() {
      console.log('submit')
    },
    cancelHandle() {
      this.$router.go(-1)
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';
@import "src/styles/variables.scss";

.el-container {
  padding: 20px 20px 100px 20px;
  width: 100%;
  min-height: calc(100vh - #{$navbarHeight});
  background: #f0f1f5;
  .footer {
    height: 80px;
    line-height: 85px;
    width: 100%;
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

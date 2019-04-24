<template>
  <div class="container-shadow">
    <div class="container">
      <header height="50" class="header">
        <span>{{ titleText }}</span>
        <i class="el-icon-error" @click="emitClosePop" />
      </header>
      <main>
        <slot name="main-content" />
        <!-- <slot /> -->
      </main>
      <footer class="footer">
        <el-button @click="emitClosePop">取消</el-button>
        <el-button type="primary" @click="emitConfirm">确定</el-button>
      </footer>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PublicPopups',
  props: {
    titleText: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      popShow: false
    }
  },
  methods: {
    emitClosePop() {
      this.$emit('closePasswordBox', 'ispopus')
    },
    emitConfirm() {
      this.$emit('formConfirm')
    }
  }
}
</script>
<style ref="styleshheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.container-shadow {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background: rgba(255, 255, 255, .6);
  @include flex-center;
  .container {
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    background: #fff;
    width: 500px !important;
    overflow: hidden;
    .header {
      padding: 10px 5px 10px 20px;
      background: #e6e6e6;
      height: 50px;
      font-size: 24px;
      i {
        cursor: pointer;
        float: right;
        color: #f00;
        font-size: 30px;
      }
    }
    .footer {
      height: 70px;
      @include flex-center;
      .el-button {
        margin: 0 20px;
      }
    }
  }
}
</style>

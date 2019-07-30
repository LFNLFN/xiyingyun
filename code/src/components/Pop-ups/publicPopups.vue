<template>
  <div class="container-shadow">
    <div :style="{ width:width }" class="container">
      <header height="50" class="header">
        <span>{{ titleText }}</span>
        <i class="el-icon-error" @click="emitClosePop" />
      </header>
      <main
        :class="{'border-bottom': mainBorder}"
        class="main">
        <slot name="main-content" />
        <!-- <slot /> -->
      </main>
      <footer class="footer">
        <slot name="footer-content">
          <el-button size="small" @click="emitClosePop">取消</el-button>
          <el-button type="primary" size="small" @click="emitConfirm">确定</el-button>
        </slot>
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
    },
    width: {
      type: String,
      default: '500px'
    },
    mainBorder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popShow: false
    }
  },
  methods: {
    emitClosePop() {
      this.$emit('closePopupsBox')
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
  // z-index: 1999;
  background: rgba(0, 0, 0,.5);
  @include flex-layout(center, center, null, null);
  .container {
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    background: #fff;
    overflow: hidden;
    .header {
      padding: 10px 5px 10px 20px;
      background: #e6e6e6;
      height: 50px;
      line-height: 32px;
      font-size: 18px;
      i {
        cursor: pointer;
        float: right;
        color: #f00;
        font-size: 30px;
      }
    }
    .main {
      padding: 1px 20px;
      max-height: calc(100vh - 140px);
      overflow: auto;
      &.border-bottom {
        border-bottom: 1px solid #ccc;
      }
    }
    .footer {
      min-height: 70px;
      @include flex-layout(center, center, null, wrap);
      .el-button {
        margin: 0 20px;
      }
    }
  }
}
</style>

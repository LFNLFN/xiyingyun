<template>
  <el-dropdown class="icon-container user-container">
    <div class="user-info-warp">
      <!-- <img :src="avatar" class="user-img"> -->
      <svg
        t="1562816332739"
        class="btn-icon user-icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="4761">
        <path
          d="M512 1024C229.248 1024 0 794.752 0 512S229.248 0 512 0s512 229.248 512 512-229.248 512-512 512z m0-938.666667C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667S747.648 85.333333 512 85.333333z m0 768a340.650667 340.650667 0 0 1-266.24-128A340.650667 340.650667 0 0 1 512 597.333333a340.48 340.48 0 0 1 266.197333 128A340.48 340.48 0 0 1 512 853.333333z m0-298.666666a170.666667 170.666667 0 1 1 0-341.333334 170.666667 170.666667 0 0 1 0 341.333334z"
          fill="#8a8a8a"
          p-id="4762"/>
      </svg>
      <span class="user-permission">{{ name }}</span>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>修改密码</el-dropdown-item>
      <el-dropdown-item>基本信息</el-dropdown-item>
      <el-dropdown-item @click.native="logOutHandle">退出登录</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script >
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'avatar',
      'name'
    ])
  },
  methods: {
    logOutHandle() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.user-container {
  .user-info-warp {
    // width: 33px;
    height: 33px;
    margin-top: 10px;
    @include flex-layout(center, center, null, null);
    .user-icon {
      margin-top: 0 !important;
      margin-right: 5px;
    }
    .user-permission{
      display: inline-block;
      height: 20px;
      line-height: 20px;
      color: #409eff;
      position: relative;
      &:after {
        content: '';
        border-top: 6px solid #409eff;
        border-right: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid transparent;
        position: absolute;
        top: 8px;
        right: -12px;
      }
    }
  }
}
</style>

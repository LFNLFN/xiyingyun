<template>
  <el-dropdown class="user-container">
    <div class="user-info-warp">
      <img :src="avatar" class="user-img">
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
  cursor: pointer;
  height: 50px;
  margin-right: 15px;

  .user-info-warp {
    // width: 36px;
    height: 36px;
    margin-top: 7px;
    @include flex-layout(center, center, null, null);

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

    .user-img {
      display: inline-block;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      margin-right: 5px;
    }
  }
}
</style>

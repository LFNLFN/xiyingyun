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
.user-container {
  cursor: pointer;
  height: 50px;
  margin-right: 15px;

  .user-info-warp {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .user-permission{
      display: block;
      height: 20px;
      line-height: 20px;
    }

    .user-img {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      margin-right: 5px;
    }
  }
}
</style>

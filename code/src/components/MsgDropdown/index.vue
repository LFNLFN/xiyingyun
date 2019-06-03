<template>
  <el-dropdown class="message-container">
    <div class="message-logo-wrap">
      <img src="@/assets/navbar_images/message.png" class="message-logo">
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>全部消息</el-dropdown-item>
      <el-dropdown-item>产品消息</el-dropdown-item>
      <el-dropdown-item>安全消息</el-dropdown-item>
      <el-dropdown-item>服务消息</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<style rel="stylesheet/scss" lang="scss" scoped>
.message-container  {
  cursor: pointer;
  height: 50px;
  margin-right: 15px;
  .message-logo-wrap {
    height: 36px;
    width: 36px;
    margin-top: 7px;
    .message-logo {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
